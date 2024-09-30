import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import PlayIcon from '../assets/svg/PlayIcon';

const Music: React.FC = () => {
  return (
    <View className="flex flex-row gap-10 items-center p-[50px] mb-24">
      <View className="items-center">
        <Image source={require('../assets/Disk.png')} className="w-56 h-56 mb-4" />
        <TouchableOpacity>
          <PlayIcon className="w-8 h-8 text-black bg-white p-4 rounded-full mb-2" />
        </TouchableOpacity>
        <Text className="text-2xl text-white font-bold mb-6">Sample Music</Text>
        <View className="flex flex-row gap-4">
        <TouchableOpacity className="bg-white rounded-md py-2 px-3">
          <View className="flex flex-row gap-2">
            <Image source={require('../assets/Vcoin.png')} className="w-6 h-6" />
            <Text className="text-base font-bold text-black">1000</Text>
          </View>
        </TouchableOpacity>
        </View>
      </View> 
    </View>
  );
};
export default Music;
