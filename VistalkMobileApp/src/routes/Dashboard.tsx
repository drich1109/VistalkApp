import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import Menu from '../components/Menu';
import Svg, { Circle, Path  } from 'react-native-svg';
import { RootStackParamList } from '../../types';
import { getUserDetails, getUserImageUrl, getUserLanguage } from './repo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Languages, UserProfileDto } from './type';
import { StackScreenProps } from '@react-navigation/stack';

type Props = StackScreenProps<RootStackParamList, 'Dashboard'>;

const Dashboard: React.FC<Props> = ({ navigation })=> {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState<number | null>(null);
  const [activeScreen] = useState<keyof RootStackParamList | null>('Dashboard');
  const [languageDetails, setLanguageDetails] = useState<Languages>();
  const [userDetails, setUserDetails] = useState<UserProfileDto>();
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  let progressnumber = 17;

  const fetchUserData = async () => {
    try {
      const userID = await AsyncStorage.getItem('userID');
      const result = await getUserLanguage(Number(userID));
      setLanguageDetails(result.data);
      const userResult = await getUserDetails(Number(userID));
      setUserDetails(userResult.data);
      if (userResult.data.imagePath) {
        setFileUrl(getUserImageUrl(userResult.data.imagePath));
      }
    } catch (error) {
      console.error('Error retrieving user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
    const unsubscribe = navigation.addListener('focus', fetchUserData);
    return unsubscribe;
  }, [navigation]);
  
  const openModal = (section: number) => {
    setCurrentSection(section);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setCurrentSection(null);
  };

  return (
    <ImageBackground
      source={require('../assets/bg.png')}
      className="flex-1 resize-cover justify-center"
    >
      <View className="flex-row justify-between p-2 items-center">
        <TouchableOpacity className="w-10 h-10 rounded-full overflow-hidden bg-white justify-center items-center" onPress={() => navigation.navigate('UserProfile')}>
          {fileUrl ? (
            <Image
              source={{ uri: fileUrl }}
              className="w-10 h-10"
            />
          ) : (
            <Svg
            width="40"
            height="40"
            viewBox="0 0 1792 1792"
          >
            <Path
              fill="black"
              d="M1523 1339q-22-155-87.5-257.5T1251 963q-67 74-159.5 115.5T896 1120t-195.5-41.5T541 963q-119 16-184.5 118.5T269 1339q106 150 271 237.5t356 87.5t356-87.5t271-237.5m-243-699q0-159-112.5-271.5T896 256T624.5 368.5T512 640t112.5 271.5T896 1024t271.5-112.5T1280 640m512 256q0 182-71 347.5t-190.5 286T1245 1721t-349 71q-182 0-348-71t-286-191t-191-286T0 896t71-348t191-286T548 71T896 0t348 71t286 191t191 286t71 348"
            />
          </Svg>
          )}
        </TouchableOpacity>
        <View className="flex-row">
          <TouchableOpacity className="ml-2">
            <Svg  width="24" height="24" className='bg-white rounded-lg' viewBox="0 0 16 16">
              <Path
                fill="black"
                d="M2 4.5A2.5 2.5 0 0 1 4.5 2h7A2.5 2.5 0 0 1 14 4.5v7a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5zm6.5 6a.5.5 0 0 0 .5.5h2.25a.5.5 0 0 0 0-1H9a.5.5 0 0 0-.5.5M9 6a.5.5 0 0 0 0 1h2.25a.5.5 0 0 0 0-1zM7.354 9.146a.5.5 0 0 0-.708 0L5.5 10.293l-.394-.395a.5.5 0 0 0-.708.707l.748.749a.5.5 0 0 0 .708 0l1.5-1.5a.5.5 0 0 0 0-.708m0-3.292a.5.5 0 1 0-.708-.708L5.5 6.293l-.394-.395a.5.5 0 0 0-.708.708l.748.748a.5.5 0 0 0 .708 0z"
              />
            </Svg>
          </TouchableOpacity>
          <TouchableOpacity className="ml-2">
            <Svg  width="24" height="24" className='bg-white rounded-lg' viewBox="0 0 24 24">
              <Path
                fill="black"
                d="M14.235 19c.865 0 1.322 1.024.745 1.668A4 4 0 0 1 12 22a4 4 0 0 1-2.98-1.332c-.552-.616-.158-1.579.634-1.661l.11-.006zM12 2c1.358 0 2.506.903 2.875 2.141l.046.171l.008.043a8.01 8.01 0 0 1 4.024 6.069l.028.287L19 11v2.931l.021.136a3 3 0 0 0 1.143 1.847l.167.117l.162.099c.86.487.56 1.766-.377 1.864L20 18H4c-1.028 0-1.387-1.364-.493-1.87a3 3 0 0 0 1.472-2.063L5 13.924l.001-2.97A8 8 0 0 1 8.822 4.5l.248-.146l.01-.043a3 3 0 0 1 2.562-2.29l.182-.017z"
              />
            </Svg>
          </TouchableOpacity>
      </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20 }} className="mb-8" showsVerticalScrollIndicator={false}>
      {languageDetails !== undefined && (
        <View className="items-center mb-5">
          <Text className="text-4xl font-bold text-black">{languageDetails.native_name}</Text>
        </View>
      )}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(section => (
          <View key={section} className="flex-row items-center justify-center mb-5">
            <TouchableOpacity className="bg-white py-2 px-8 rounded-full" onPress={() => openModal(section)}>
              <View className="flex-col items-center">
                <Text className="text-lg font-bold text-black uppercase">SECTION {section}</Text>
                <Text className="text-base text-gray-800">10 units</Text>
              </View>
            </TouchableOpacity>
            <View className="w-20 h-20 justify-center items-center ml-5">
              <Svg width="80" height="80">
                <Circle
                  cx="40"
                  cy="40"
                  r="35"
                  stroke="#ffffff"
                  strokeWidth="5"
                  fill="none"
                />
                <Circle
                  cx="40"
                  cy="40"
                  r="35"
                  stroke="#000000" // Adjust the color for the progress
                  strokeWidth="5"
                  fill="none"
                  strokeDasharray={`${(progressnumber / 100) * 2 * Math.PI * 35} ${2 * Math.PI * 35 - (progressnumber / 100) * 2 * Math.PI * 35}`}
                  strokeDashoffset={Math.PI / 2 * 35} 
                />
              </Svg>
              <Text className="text-xl text-white font-bold absolute">{progressnumber}%</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
      >
        <TouchableOpacity className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }} onPress={closeModal}>
          <View className="bg-black rounded-t-xl w-full">
            <TouchableOpacity activeOpacity={1} className="bg-black rounded-t-xl">
              <View className="p-10">
                <Text className="text-4xl font-bold text-white mb-2 text-center">SECTION {currentSection}</Text>
                <Text className="text-2xl text-white mb-5 text-center">10 units</Text>
                <Text className="text-base text-white mb-5 text-center">
                  This is a brief description of Section.
                  This is a brief description of Section.
                  This is a brief description of Section.
                  This is a brief description of Section {currentSection}.
                </Text>
                <View className="pb-10 px-10">
                  <TouchableOpacity className="bg-white py-2 px-10 rounded-full self-center" onPress={closeModal}>
                    <Text className="text-lg text-black font-bold">Play</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Menu activeScreen={activeScreen} /> 
    </ImageBackground>
  );
};

export default Dashboard;
