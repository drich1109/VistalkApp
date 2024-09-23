import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, StyleSheet, Image, Alert,ImageBackground } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types'; // Adjust the import path

type Props = StackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ImageBackground source={require('../assets/bg.png')} className="flex-1" resizeMode="cover">
    <SafeAreaView className="flex-1 justify-center p-4">
      <View className="items-center mb-8">
        <Image source={require('../assets/logo.png')} className="w-44 h-44 mb-4" />
      </View>
      <View className="mt-4">
        <TouchableOpacity className="bg-white p-4 rounded-xl items-center mb-3" onPress={() => navigation.navigate('LogIn')}>
          <Text className="text-[#99BC85] text-xl font-bold">Login</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-white p-4 rounded-xl items-center mb-3" onPress={() => navigation.navigate('Register')}>
          <Text className="text-[#99BC85] text-xl font-bold">Create an Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </ImageBackground>
  );
};

export default HomeScreen;