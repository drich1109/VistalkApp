import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, Alert, ImageBackground, Image } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types'; // Adjust the import path
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserDetails, getUserImageUrl } from './repo';
import { UserProfileDto } from './type';
import { Path, Svg } from 'react-native-svg';
import BackIcon from '../assets/svg/BackIcon';
import LinearGradient from 'react-native-linear-gradient';
import SettingIcon from '../assets/svg/SettingIcon';

type Props = StackScreenProps<RootStackParamList, 'UserProfile'>;

const UserProfile: React.FC<Props> = ({ navigation }) => {
  const [userDetails, setUserDetails] = useState<UserProfileDto>();
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const fetchUserData = async () => {
    try {
      const userID = await AsyncStorage.getItem('userID');
      if (userID) {
        const result = await getUserDetails(Number(userID));
        setUserDetails(result.data);
        if (result.data.imagePath) {
          setFileUrl(getUserImageUrl(result.data.imagePath));
        }
      }
    } catch (error) {
      console.error('Error retrieving user data:', error);
      Alert.alert('An error occurred while fetching user details.');
    }
  };

  useEffect(() => {
    fetchUserData();
    const unsubscribe = navigation.addListener('focus', fetchUserData);
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient colors={['#6addd0', '#7fc188']} className="flex-1 resize-cover">
      <View className="flex-row justify-between w-full px-5 absolute top-10">
          <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
            <BackIcon className="h-8 w-8 text-white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <SettingIcon className="h-8 w-8 text-white" />
          </TouchableOpacity>
        </View>
        {userDetails && (
          <View className="flex flex-row items-center gap-4 ml-4 mt-24">
            {fileUrl ? (
              <Image
                source={{ uri: fileUrl }}
                className="w-16 h-16 rounded-full mb-5 border-2 border-white"
              />
            ) : (
              <Svg width="50" height="50" viewBox="0 0 1792 1792" className="mb-5">
                <Path
                  fill="black"
                  d="M1523 1339q-22-155-87.5-257.5T1251 963q-67 74-159.5 115.5T896 1120t-195.5-41.5T541 963q-119 16-184.5 118.5T269 1339q106 150 271 237.5t356 87.5t356-87.5t271-237.5m-243-699q0-159-112.5-271.5T896 256T624.5 368.5T512 640t112.5 271.5T896 1024t271.5-112.5T1280 640m512 256q0 182-71 347.5t-190.5 286T1245 1721t-349 71q-182 0-348-71t-286-191t-191-286T0 896t71-348t191-286T548 71T896 0t348 71t286 191t191 286t71 348"
                />
              </Svg>
            )}
            <View className="mb-5">
              <Text className="text-white text-2xl font-bold">{userDetails.name}</Text>
              <Text className="text-white text-base w-[90%]">{userDetails.email}</Text>
            </View>
          </View>
        )}
        <View className="items-center mt-2">
          <Text className="text-white text-xl font-bold">Subscription Expiry</Text>
          <Text className="text-white text-lg">10 - 2 - 2024</Text>
        </View>
        <View className="flex flex-row justify-center items-center gap-5 mt-2">
          <View className="w-20">
            <Text className="text-xl font-bold text-center mb-2">Units Unlocked</Text>
            <Text className="text-xl text-center">5</Text>
          </View>
          <View className="w-20">
            <Text className="text-xl font-bold text-center mb-2">Total Streak</Text>
            <Text className="text-xl text-center">10</Text>
          </View>
          <View className="w-20">
            <Text className="text-xl font-bold text-center mb-2">Highest Score</Text>
            <Text className="text-xl text-center">12,654</Text>
          </View>
        </View>
        <View className="items-center mt-6">
          <View className="w-60">
            <Text className="text-2xl font-bold text-center mb-2">TOTAL WEEKLY SCORE</Text>
            <Text className="text-2xl font-bold text-center mb-2">12,654</Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default UserProfile;
