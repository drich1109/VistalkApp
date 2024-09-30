import React, { useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, ScrollView, Image } from 'react-native';
import Menu from '../components/Menu'; // Adjust the import path as needed
import PowerUps from './PowerUps';
import Subscription from './Subscription';
import Currency from './Currency';
import Music from './Music';
import { RootStackParamList } from '../../types';

const Shop: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<keyof RootStackParamList | null>('Shop');
  const [selectedItem, setSelectedItem] = useState<string>('Power Ups');

  const renderContent = () => {
    switch (selectedItem) {
      case 'Power Ups':
        return <PowerUps />;
      case 'Subscription':
        return <Subscription />;
      case 'Currency':
        return <Currency />;
      case 'Music':
        return <Music />;
      default:
        return null;
    }
  };

  return (
    <ImageBackground source={require('../assets/bg.png')} className="flex-1 justify-center items-center" resizeMode="cover">
      {/* Top Vcoin display */}
      <TouchableOpacity className="absolute top-0 right-0 mr-4 mt-4 bg-white rounded-md py-2 px-3">
        <View className="flex flex-row gap-2">
          <Image source={require('../assets/Vcoin.png')} className="w-6 h-6" />
          <Text className="text-base font-bold text-black">1000</Text>
        </View>
      </TouchableOpacity>
      <View className="items-center mt-20 mb-3">
        <Text className="text-4xl font-bold text-white">Shop</Text>
      </View>
      <View className="flex flex-wrap gap-2 items-center">
        <View className="flex flex-row gap-x-2 w-full">
          <TouchableOpacity
            className={`p-2 px-3 rounded-full ${selectedItem === 'Power Ups' ? 'bg-white' : 'bg-transparent'}`}
            onPress={() => setSelectedItem('Power Ups')}>
            <Text className={`text-base font-${selectedItem === 'Power Ups' ? 'bold' : 'light'} ${selectedItem === 'Power Ups' ? 'text-black' : 'text-white'}`}>
              Power Ups
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`py-2 px-3 rounded-full ${selectedItem === 'Subscription' ? 'bg-white' : 'bg-transparent'}`}
            onPress={() => setSelectedItem('Subscription')}>
            <Text className={`text-base font-${selectedItem === 'Subscription' ? 'bold' : 'light'} ${selectedItem === 'Subscription' ? 'text-black' : 'text-white'}`}>
              Subscription
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`py-2 px-3 rounded-full ${selectedItem === 'Currency' ? 'bg-white' : 'bg-transparent'}`}
            onPress={() => setSelectedItem('Currency')}>
            <Text className={`text-base font-${selectedItem === 'Currency' ? 'bold' : 'light'} ${selectedItem === 'Currency' ? 'text-black' : 'text-white'}`}>
              Currency
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className={`w-full py-2 px-3 rounded-full ${selectedItem === 'Music' ? 'bg-white' : 'bg-transparent'}`}
          onPress={() => setSelectedItem('Music')}>
          <Text className={`text-base font-${selectedItem === 'Music' ? 'bold' : 'light'} ${selectedItem === 'Music' ? 'text-black' : 'text-white'}`}>
            Music
          </Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView horizontal contentContainerStyle={{ padding: 4 }} className="mb-4 flex-1">
        {renderContent()}
      </ScrollView>

      <Menu activeScreen={activeScreen} />
    </ImageBackground>
  );
};

export default Shop;
