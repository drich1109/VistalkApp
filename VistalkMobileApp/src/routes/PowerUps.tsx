import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const PowerUps: React.FC = () => {
  return (
    <View className="flex flex-row gap-10 items-center p-[50px] mb-24">
      <View className="items-center">
        <Image source={require('../assets/Red.png')} className="w-64 h-64 mb-4" />
        <Text className="text-2xl text-white font-bold mb-6">Heart</Text>
        <TouchableOpacity className="bg-white rounded-md py-2 px-3">
          <View className="flex flex-row gap-2">
            <Image source={require('../assets/Vcoin.png')} className="w-6 h-6" />
            <Text className="text-base font-bold text-black">1000</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View className="items-center">
        <Image source={require('../assets/Blue.png')} className="w-64 h-64 mb-6" />
        <Text className="text-2xl text-white font-bold mb-6">Freeze Time</Text>
        <TouchableOpacity className="bg-white rounded-md py-2 px-3">
          <View className="flex flex-row gap-2">
            <Image source={require('../assets/Vcoin.png')} className="w-6 h-6" />
            <Text className="text-base font-bold text-black">1000</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View className="items-center">
        <Image source={require('../assets/Teal.png')} className="w-64 h-64 mb-6" />
        <Text className="text-2xl text-white font-bold mb-6">Double Word</Text>
        <TouchableOpacity className="bg-white rounded-md py-2 px-3">
          <View className="flex flex-row gap-2">
            <Image source={require('../assets/Vcoin.png')} className="w-6 h-6" />
            <Text className="text-base font-bold text-black">1000</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View className="items-center">
        <Image source={require('../assets/Yellow.png')} className="w-64 h-64 mb-6" />
        <Text className="text-2xl text-white font-bold mb-6">Word Hint</Text>
        <TouchableOpacity className="bg-white rounded-md py-2 px-3">
          <View className="flex flex-row gap-2">
            <Image source={require('../assets/Vcoin.png')} className="w-6 h-6" />
            <Text className="text-base font-bold text-black">1000</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PowerUps;
