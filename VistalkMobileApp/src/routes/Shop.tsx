import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, ScrollView, Image } from 'react-native';
import Menu from '../components/Menu';
import PowerUps from './PowerUps';
import Subscription from './Subscription';
import Currency from './Currency';
import Music from './Music';
import { RootStackParamList } from '../../types';
import { getUserVCoin } from './repo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { StackScreenProps } from '@react-navigation/stack';
import MusicIcon from '../assets/svg/MusicIcon';
import PotionIcon from '../assets/svg/PotionIcon';
import SubscriptionIcon from '../assets/svg/SubscriptionIcon';
import CurrencyIcon from '../assets/svg/CurrencyIcon';

type Props = StackScreenProps<RootStackParamList, 'Shop'>;

interface Shop {
  route: {
    params: {
      selectedItemDefault?: string; 
    };
  };
}

const Shop: React.FC<Props> = ({ route }) => {
  const selectedItemDefault = route.params.selectedItemDefault || 'Power Ups'; 
  const [activeScreen, setActiveScreen] = useState<keyof RootStackParamList | null>('Shop');
  const [selectedItem, setSelectedItem] = useState<string>(selectedItemDefault); 
  const [vCoin, setVcoin] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const renderContent = () => {
    switch (selectedItem) {
      case 'Power Ups':
        return <PowerUps vCoin={vCoin} setVcoin={setVcoin} />;
      case 'Subscription':
        return <Subscription vCoin={vCoin} setVcoin={setVcoin} />;
      case 'Currency':
        return <Currency vCoin={vCoin} setVcoin={setVcoin} />;
      case 'Music':
        return <Music vCoin={vCoin} setVcoin={setVcoin}/>; 

      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchVcoin = async () => {
      try {
        const userID = await AsyncStorage.getItem('userID');

        if (userID) {
          const result = await getUserVCoin(userID);
          if (result.isSuccess) {
            setVcoin(result.data);
          } else {
            setError('Failed to fetch vCoin');
          }
        } else {
          setError('No userID found');
        }
      } catch (err) {
        setError('Failed to fetch vCoin');
      } finally {
        setLoading(false);
      }
    };

    fetchVcoin();
  }, []);

  return (
    <LinearGradient colors={['#6addd0', '#7fc188']} className="flex-1 justify-center items-center">
      <TouchableOpacity className="absolute top-0 right-0 mr-4 mt-4 bg-white rounded-md py-2 px-3">
        <View className="flex flex-row gap-2">
          <Image source={require('../assets/Vcoin.png')} className="w-6 h-6" />
          <Text className="text-base font-bold text-black">{vCoin}</Text>
        </View>
      </TouchableOpacity>
      <View className="items-center mt-20 mb-3">
        <Text className="text-4xl font-bold text-white">Shop</Text>
      </View>
      <View>
        <View className="flex flex-row gap-x-2 items-center flex-wrap w-full">
          <TouchableOpacity
            className={`p-2 px-3 rounded-full ${selectedItem === 'Power Ups' ? 'bg-white' : 'bg-transparent'}`}
            onPress={() => setSelectedItem('Power Ups')}>
            <PotionIcon className={`text-base h-8 w-8 font-${selectedItem === 'Power Ups' ? 'bold' : 'light'} ${selectedItem === 'Power Ups' ? 'text-black' : 'text-white'}`} />
          </TouchableOpacity>

          <TouchableOpacity
            className={`py-2 px-3 rounded-full ${selectedItem === 'Subscription' ? 'bg-white' : 'bg-transparent'}`}
            onPress={() => setSelectedItem('Subscription')}>
            <SubscriptionIcon className={`text-base h-8 w-8 font-${selectedItem === 'Subscription' ? 'bold' : 'light'} ${selectedItem === 'Subscription' ? 'text-black' : 'text-white'}`} />
          </TouchableOpacity>

          <TouchableOpacity
            className={`py-2 px-3 rounded-full ${selectedItem === 'Currency' ? 'bg-white' : 'bg-transparent'}`}
            onPress={() => setSelectedItem('Currency')}>
            <CurrencyIcon className={`text-white h-8 w-8 font-${selectedItem === 'Currency' ? 'bold' : 'light'} ${selectedItem === 'Currency' ? 'text-black' : 'text-white'}`} />
          </TouchableOpacity>

          <TouchableOpacity
            className={`py-2 px-3 rounded-full ${selectedItem === 'Music' ? 'bg-white' : 'bg-transparent'}`}
            onPress={() => setSelectedItem('Music')}>
            <MusicIcon className={`text-base h-8 w-8 font-${selectedItem === 'Music' ? 'bold' : 'light'} ${selectedItem === 'Music' ? 'text-black' : 'text-white'}`} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView horizontal contentContainerStyle={{ padding: 4 }} className="mb-4 flex-1">
        {renderContent()}
      </ScrollView>
      <Menu activeScreen={activeScreen} />
    </LinearGradient>
  );
};

export default Shop;
