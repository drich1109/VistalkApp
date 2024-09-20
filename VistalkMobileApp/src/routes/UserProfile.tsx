import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, Alert, ImageBackground, Image } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types'; // Adjust the import path
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserDetails, getUserImageUrl } from './repo';
import { UserProfileDto } from './type';
import { Path, Svg } from 'react-native-svg';
import BackIcon from '../assets/svg/BackIcon';

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
      <ImageBackground source={require('../assets/bg.png')} className="flex-1" resizeMode="cover">
        <View className="flex-row justify-between w-full px-5 absolute top-10">
          <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
            <Svg width="30" height="30" className="bg-white text-[#99BC85] rounded-lg" viewBox="0 0 24 24">
                <Path
                  fill="currentColor"
                  d="M3.636 11.293a1 1 0 000 1.414l5.657 5.657a1 1 0 001.414-1.414L6.757 13H20a1 1 0 100-2H6.757l3.95-3.95a1 1 0 00-1.414-1.414z"
                />
            </Svg>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" clipRule="evenodd" className="bg-white text-[#99BC85] rounded-lg">
              <Path d="M12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5M9.75 12a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0" />
              <Path d="M11.975 1.25c-.445 0-.816 0-1.12.02a2.8 2.8 0 00-.907.19 2.75 2.75 0 00-1.489 1.488c-.145.35-.184.72-.2 1.122a.87.87 0 01-.415.731.87.87 0 01-.841-.005c-.356-.188-.696-.339-1.072-.389a2.75 2.75 0 00-2.033.545 2.8 2.8 0 00-.617.691c-.17.254-.356.575-.578.96l-.025.044c-.223.385-.408.706-.542.98-.14.286-.25.568-.29.88a2.75 2.75 0 00.544 2.033c.231.301.532.52.872.734a.87.87 0 01.426.726.87.87 0 01-.426.726c-.34.214-.64.433-.872.734a2.75 2.75 0 00-.545 2.033c.041.312.15.594.29.88.135.274.32.595.543.98l.025.044c.222.385.408.706.578.96.177.263.367.5.617.69a2.75 2.75 0 002.033.546c.376-.05.716-.2 1.072-.389a.87.87 0 01.84-.005.86.86 0 01.417.731c.015.402.054.772.2 1.122a2.75 2.75 0 001.488 1.489c.29.12.59.167.907.188.304.021.675.021 1.12.021h.05c.445 0 .816 0 1.12-.02.318-.022.617-.069.907-.19a2.75 2.75 0 001.489-1.488c.145-.35.184-.72.2-1.122a.87.87 0 01.415-.732.87.87 0 01.841.006c.356.188.696.339 1.072.388a2.75 2.75 0 002.033-.544c.25-.192.44-.428.617-.691.17-.254.356-.575.578-.96l.025-.044c.223-.385.408-.706.542-.98.14-.286.25-.569.29-.88a2.75 2.75 0 00-.544-2.033c-.231-.301-.532-.52-.872-.734a.87.87 0 01-.426-.726c0-.278.152-.554.426-.726.34-.214.64-.433.872-.734a2.75 2.75 0 00.545-2.033 2.8 2.8 0 00-.29-.88 18 18 0 00-.543-.98l-.025-.044a18 18 0 00-.578-.96 2.8 2.8 0 00-.617-.69 2.75 2.75 0 00-2.033-.546c-.376.05-.716.2-1.072.389a.87.87 0 01-.84.005.87.87 0 01-.417-.731c-.015-.402-.054-.772-.2-1.122a2.75 2.75 0 00-1.488-1.489c-.29-.12-.59-.167-.907-.188-.304-.021-.675-.021-1.12-.021zm-1.453 1.595c.077-.032.194-.061.435-.078.247-.017.567-.017 1.043-.017s.796 0 1.043.017c.241.017.358.046.435.078.307.127.55.37.677.677.04.096.073.247.086.604.03.792.439 1.555 1.165 1.974s1.591.392 2.292.022c.316-.167.463-.214.567-.227a1.25 1.25 0 01.924.247c.066.051.15.138.285.338.139.206.299.483.537.895s.397.69.506.912c.107.217.14.333.15.416a1.25 1.25 0 01-.247.924c-.064.083-.178.187-.48.377-.672.422-1.128 1.158-1.128 1.996s.456 1.574 1.128 1.996c.302.19.416.294.48.377.202.263.29.595.247.924-.01.083-.044.2-.15.416-.109.223-.268.5-.506.912s-.399.689-.537.895c-.135.2-.219.287-.285.338a1.25 1.25 0 01-.924.247c-.104-.013-.25-.06-.567-.227-.7-.37-1.566-.398-2.292.021s-1.135 1.183-1.165 1.975c-.013.357-.046.508-.086.604a1.25 1.25 0 01-.677.677c-.077.032-.194.061-.435.078-.247.017-.567.017-1.043.017s-.796 0-1.043-.017c-.241-.017-.358-.046-.435-.078a1.25 1.25 0 01-.677-.677c-.04-.096-.073-.247-.086-.604-.03-.792-.439-1.555-1.165-1.974s-1.591-.392-2.292-.022c-.316.167-.463.214-.567.227a1.25 1.25 0 01-.924-.247c-.066-.051-.15-.138-.285-.338a17 17 0 01-.537-.895c-.238-.412-.397-.69-.506-.912-.107-.217-.14-.333-.15-.416a1.25 1.25 0 01.247-.924c.064-.083.178-.187.48-.377.672-.422 1.128-1.158 1.128-1.996s-.456-1.574-1.128-1.996c-.302-.19-.416-.294-.48-.377a1.25 1.25 0 01-.247-.924c.01-.083.044-.2.15-.416.109-.223.268-.5.506-.912s.399-.689.537-.895c.135-.2.219-.287.285-.338a1.25 1.25 0 01.924-.247c.104.013.25.06.567.227.7.37 1.566.398 2.292-.022.726-.419 1.135-1.182 1.165-1.974.013-.357.046-.508.086-.604.127-.307.37-.55.677-.677" />
          </Svg>
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
              <Text className="text-white text-base">{userDetails.email}</Text>
            </View>
          </View>
        )}
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
      </ImageBackground>
    </SafeAreaView>
  );
};

export default UserProfile;
