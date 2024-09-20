import React, { useState } from 'react';
import { View, Animated, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MenuScreenNavigationProp, RootStackParamList } from '../../types'; // Adjust the import path
import DashboardIcon from '../assets/svg/DashboardIcon';
import ShopIcon from '../assets/svg/ShopIcon';
import DictionaryIcon from '../assets/svg/DictionaryIcon';
import PracticeIcon from '../assets/svg/PracticeIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MenuProps {
  activeScreen: keyof RootStackParamList | null;
}

const Menu: React.FC<MenuProps> = ({ activeScreen }) => {
  const navigation = useNavigation<MenuScreenNavigationProp>();
  const navigateToScreen = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen);
  };

 /*  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      navigation.navigate('LogIn');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }; */

  return (
    <View className="items-center justify-center">
      <Animated.View className="absolute bottom-0 w-full flex-row items-center justify-around bg-white rounded-t-lg p-4 shadow-md">
        <TouchableOpacity onPress={() => navigateToScreen('Dashboard')}>
          <DashboardIcon className={`w-6 h-6`} isActive={activeScreen == 'Dashboard'}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateToScreen('Shop')}>
          <ShopIcon className={`w-6 h-6 ${activeScreen === 'Shop' ? 'text-blue-500' : 'text-black'}`} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateToScreen('Dictionary')}>
          <DictionaryIcon className={`w-6 h-6`} isActive={activeScreen == 'Dictionary'}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateToScreen('Practice')}>
          <PracticeIcon className={`w-6 h-6`} isActive={activeScreen == 'Practice'}/>
        </TouchableOpacity>
{/*         <TouchableOpacity
          className="bg-red-500 p-2 rounded"
          onPress={handleLogout}
        >
          <Text className="text-white font-bold">Logout</Text>
        </TouchableOpacity> */}
      </Animated.View>
    </View>
  );
};

export default Menu;
