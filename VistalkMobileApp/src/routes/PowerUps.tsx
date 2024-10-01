import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, TextInput } from 'react-native';
import { PowerUp } from './type';
import { getPowerupImage, getPowerUps, buyPowerUp, getUserVCoin } from './repo';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FileUrl = {
  id: number;
  url: string;
};

type PowerUpsProps = {
  vCoin: number;
  setVcoin: React.Dispatch<React.SetStateAction<number>>;
};

const PowerUps: React.FC<PowerUpsProps> = ({ vCoin, setVcoin }) => {
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fileUrls, setFileUrls] = useState<FileUrl[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedPowerUp, setSelectedPowerUp] = useState<PowerUp | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const fetchPowerUps = async () => {
      try {
        const result = await getPowerUps();
        setPowerUps(result.data);

        const imageUrls = await Promise.all(
          result.data.map(async (powerUp: PowerUp) => {
            if (powerUp.isActive) {
              const url = getPowerupImage(powerUp.filePath);
              return { id: powerUp.itemID, url };
            }
            return null;
          })
        );

        setFileUrls(imageUrls.filter((url) => url !== null) as FileUrl[]);

        const userID = await AsyncStorage.getItem('userID');
        
        if (userID) {
          const result = await getUserVCoin(userID);
          if (result.isSuccess) {
            setVcoin(result.data); 
          } else {
            setError('Failed to fetch vCoin');
          }
      }
      } catch (err) {
        setError('Failed to fetch power-ups');
      } finally {
        setLoading(false);
      }
    };

    fetchPowerUps();
  }, []);

  const getImageUrlById = (id: number) => {
    const fileUrl = fileUrls.find((url) => url.id === id);
    return fileUrl ? fileUrl.url : null;
  };

  const handleOpenModal = (powerUp: PowerUp) => {
    setSelectedPowerUp(powerUp);
    setQuantity(1); 
    setTotalPrice(powerUp.vcoinPrice); 
    setModalVisible(true);
  };

  const handleQuantityChange = (value: number) => {
    if (value < 0 && quantity <= 1) {
      return; 
    }
  
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + value;
  
      if (newQuantity >= 1) {
        setTotalPrice(newQuantity * (selectedPowerUp?.vcoinPrice || 0));
        return newQuantity;
      }
      
      return prevQuantity;
    });
  };
  

  const handleBuy = async () => {
    if (selectedPowerUp && quantity > 0 && totalPrice <= vCoin) {
      const userID = await AsyncStorage.getItem('userID');
      if(userID)
        buyPowerUp(userID ,selectedPowerUp.itemID, quantity).then(() => {
          setVcoin(prev => prev - totalPrice);
          setModalVisible(false);
        });
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View className="flex flex-row gap-10 items-center p-[50px] mb-24">
      {powerUps.map((powerUp, index) => (
        <View key={index} className="items-center">
          <Image
            source={{ uri: getImageUrlById(powerUp.itemID) || '' }}
            className="w-64 h-64 mb-4"
          />
          <Text className="text-2xl text-white font-bold mb-6">{powerUp.name}</Text>
          <TouchableOpacity
            className="bg-white rounded-md py-2 px-3"
            onPress={() => handleOpenModal(powerUp)}
          >
            <View className="flex flex-row gap-2">
              <Image
                source={require('../assets/Vcoin.png')} 
                className="w-6 h-6"
              />
              <Text className="text-base font-bold text-black">{powerUp.vcoinPrice}</Text> 
            </View>
          </TouchableOpacity>
        </View>
      ))}

      {selectedPowerUp && (
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex items-center justify-center flex-1 bg-gray bg-opacity-50">
            <View className="bg-black p-6 rounded-lg w-[80%]">
              <Text className="text-xl font-bold mb-4">Buy {selectedPowerUp.name}</Text>
              <Text className="text-lg mb-2">Price: {selectedPowerUp.vcoinPrice} vCoins each</Text>
              
              <View className="flex flex-row items-center mb-4">
                <TouchableOpacity 
                  onPress={() => handleQuantityChange(-1)} 
                  className="bg-gray-300 rounded-full p-2"
                >
                  <Text className="text-xl">−</Text>
                </TouchableOpacity>
                <Text className="mx-4 text-lg">{quantity}</Text>
                <TouchableOpacity 
                  onPress={() => handleQuantityChange(1)} 
                  className="bg-gray-300 rounded-full p-2"
                >
                  <Text className="text-xl">+</Text>
                </TouchableOpacity>
              </View>

              <Text className="text-lg mb-4">Total Price: {totalPrice} vCoins</Text>
              <Text className="text-sm mb-4">Your vCoins: {vCoin}</Text>

              <TouchableOpacity
                className={`bg-blue-500 rounded-md py-2 px-3 ${quantity === 0 || totalPrice > vCoin ? 'opacity-50' : ''}`}
                onPress={handleBuy}
                disabled={quantity === 0 || totalPrice > vCoin}
              >
                <Text className="text-white text-center">Buy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="mt-4"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-center text-red-500">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default PowerUps;
