import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Menu from '../components/Menu'; // Adjust the import path as needed
import SearchIcon from '../assets/svg/SearchIcon';
import ArrowIcon from '../assets/svg/ArrowIcon';
import { useNavigation } from '@react-navigation/native';
import { DictionaryMeaningScreenNavigationProp, RootStackParamList } from '../../types';

const Dictionary: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [activeScreen, setActiveScreen] = useState<keyof RootStackParamList | null>('Dictionary');

  const navigation = useNavigation<DictionaryMeaningScreenNavigationProp>();
    const navigateToMeaning = (meaning: keyof RootStackParamList) => {
        console.log(meaning);
        navigation.navigate(meaning);
      };
  return (
    <ImageBackground source={require('../assets/bg.png')} className="flex-1 justify-center items-center" resizeMode="cover">
      <View className="items-center mb-3 mt-8">
        <Text className="text-4xl font-bold text-white">Dictionary</Text>
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
      <View className="flex flex-row items-center mb-4 gap-24">
        <Text className="text-white text-2xl">English</Text>
        <Text className="text-white text-2xl">Bisaya</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }} className="mb-8">
        <TouchableOpacity onPress={() => navigateToMeaning('DictionaryMeaning')}>
          <View className="bg-white rounded-lg p-4">
            <View className='flex flex-row items-center gap-x-16'>
            <Text className="text-xl text-center text-[#5B7200] font-light italic">Tired</Text>
            <ArrowIcon className="w-8 h-8" />
            <Text className="text-xl text-center text-[#5B7200] font-bold">Kapoy</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
      <Menu activeScreen={activeScreen} /> 
    </ImageBackground>
  );
};

export default Dictionary;
