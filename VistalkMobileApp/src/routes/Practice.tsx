import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Menu from '../components/Menu'; // Adjust the import path as needed
import HistoryIcon from '../assets/svg/HistoryIcon';
import SearchIcon from '../assets/svg/SearchIcon';
import SpeakerIcon from '../assets/svg/SpeakerIcon';
import { Circle, Svg } from 'react-native-svg';
import MicrophoneIcon from '../assets/svg/MicrophoneIcon';
import { RootStackParamList } from '../../types';

const Practice: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [activeScreen, setActiveScreen] = useState<keyof RootStackParamList | null>('Practice');
  let progressnumber = 17;
  return (
    <SafeAreaView className="flex-1">
      <ImageBackground source={require('../assets/bg.png')} className="flex-1 items-center" resizeMode="cover">
      <TouchableOpacity className="absolute top-0 right-0 mr-4 mt-4">
        <HistoryIcon className="h-8 w-8 rounded-full bg-white" />
      </TouchableOpacity>
      <View className="items-center mt-20 mb-3">
        <Text className="text-4xl font-bold text-white">Pronounce</Text>
      </View>
      <View className="flex flex-row items-center justify-start bg-white rounded-lg px-4 mb-5 w-4/5 h-10">
            <TextInput
              className="flex-1 h-full text-[#999] text-base"
              placeholder="Search for a word"
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
            <SearchIcon className="w-7 h-7" />
      </View>
      <TouchableOpacity className="items-center mb-4">
        <Text className="bg-white rounded-lg p-2 text-base font-seminbold text-black">
          Random Words
        </Text>
      </TouchableOpacity>
      <View className='flex-1 items-center justify-center mt-20'>
        <View className="mb-2">
          <Text className="text-2xl font-bold text-white">Maayong Buntag</Text>
          <View className="flex flex-row ml-2 mb-2 px-2">
            <Text className="text-xl italic font-light text-white">["ma-a-yong bun-tag"]</Text>
            <TouchableOpacity>
              <SpeakerIcon className="h-6 w-6 ml-3 text-white" />
            </TouchableOpacity>
          </View>
        </View>
        <View className="items-center mb-4">
          <Text className="text-3xl font-bold text-white">Excellent !!!</Text>
        </View>
        <View className="w-20 h-20 justify-center items-center mb-4">
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
                  strokeDasharray={`${progressnumber / 100 * 2 * Math.PI * 35} ${2 * Math.PI * 35 - progressnumber / 100 * 2 * Math.PI * 35}`}
                  strokeDashoffset={Math.PI / 2 * 35}                />
              </Svg>
              <Text className='absolute text-xl text-white font-bold'>{progressnumber}%</Text>
      </View>
      <TouchableOpacity className="items-center">
          <MicrophoneIcon className="h-24 w-24 bg-white rounded-full p-4"/>
      </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ padding: 4 }} className="mb-4" showsVerticalScrollIndicator={false}>

      </ScrollView>
      <Menu activeScreen={activeScreen}/>
    </ImageBackground>
    </SafeAreaView>
  );
};

export default Practice;
