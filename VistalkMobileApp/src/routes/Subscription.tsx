import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const Subscription: React.FC = () => {
  return (
    <View className="flex flex-row gap-32 items-center p-[100px] mb-24">
      <View className="items-center">
        <View className="items-center bg-white rounded-lg p-4 mb-4">
            <Image  source={require('../assets/logosubs.png')} className="w-24 h-24 mb-6"/>
            <Text className="text-2xl font-bold text-black w-32 text-center">Monthly Subscription</Text>
        </View>
        <Text className="text-2xl text-white font-bold mb-6">50 VCoins</Text>
        <TouchableOpacity className="bg-white rounded-md py-2 px-3">
            <Text className="text-base font-bold text-black">₱ 349.99</Text>
        </TouchableOpacity>
      </View>
      <View className="items-center">
        <View className="items-center bg-white rounded-lg p-4 mb-4">
            <Image  source={require('../assets/logosubs.png')} className="w-24 h-24 mb-6"/>
            <Text className="text-2xl font-bold text-black w-32 text-center">Annual Subscription</Text>
        </View>
        <Text className="text-2xl text-white font-bold mb-6">50 VCoins</Text>
        <TouchableOpacity className="bg-white rounded-md py-2 px-3">
            <Text className="text-base font-bold text-black">₱ 349.99</Text>
        </TouchableOpacity>
      </View>
      <View className="items-center">
        <View className="items-center bg-white rounded-lg p-4 mb-4">
            <Image  source={require('../assets/logosubs.png')} className="w-24 h-24 mb-6"/>
            <Text className="text-2xl font-bold text-black w-32 text-center">Yearly Subscription</Text>
        </View>
        <Text className="text-2xl text-white font-bold mb-6">50 VCoins</Text>
        <TouchableOpacity className="bg-white rounded-md py-2 px-3">
            <Text className="text-base font-bold text-black">₱ 349.99</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Subscription;
