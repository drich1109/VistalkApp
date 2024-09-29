import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const Currency: React.FC = () => {
  return (
    <View className="flex flex-row gap-16 items-center p-[60px] mb-24">
      <View className="items-center">
        <Image source={require('../assets/Vcoin.png')} className="w-56 h-56 mb-4" />
        <Text className="text-2xl text-white font-bold mb-6">100 VCoins</Text>
        <TouchableOpacity className="bg-white rounded-md py-2 px-3">
        <Text className="text-base font-bold text-black">₱ 99.99</Text>
        </TouchableOpacity>
      </View>

      <View className="items-center">
        <Image source={require('../assets/Vcoin.png')} className="w-56 h-56 mb-6" />
        <Text className="text-2xl text-white font-bold mb-6">200 VCoins</Text>
        <TouchableOpacity className="bg-white rounded-md py-2 px-3">
            <Text className="text-base font-bold text-black">₱ 149.99</Text>
        </TouchableOpacity>
      </View>

      <View className="items-center">
        <Image source={require('../assets/Vcoin.png')} className="w-56 h-56 mb-6" />
        <Text className="text-2xl text-white font-bold mb-6">300 VCoins</Text>
        <TouchableOpacity className="bg-white rounded-md py-2 px-3">
            <Text className="text-base font-bold text-black">₱ 249.99</Text>
        </TouchableOpacity>
      </View>

      <View className="items-center">
        <Image source={require('../assets/Vcoin.png')} className="w-56 h-56 mb-6" />
        <Text className="text-2xl text-white font-bold mb-6">400 VCoins</Text>
        <TouchableOpacity className="bg-white rounded-md py-2 px-3">
            <Text className="text-base font-bold text-black">₱ 349.99</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Currency;
