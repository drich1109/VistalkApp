import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Linking, Alert } from 'react-native';
import { CoinBag } from './type';
import { buyCoinBag, getCoinBags, getUserVCoin, paymongoRedirect } from './repo';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CoinBagProps = {
  vCoin: number;
  setVcoin: React.Dispatch<React.SetStateAction<number>>;
};

const Currency: React.FC<CoinBagProps> = ({ vCoin, setVcoin }) => {
  const [coinBags, setCoinBags] = useState<CoinBag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedBag, setSelectedBag] = useState<CoinBag | null>(null);

  
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const result = await getCoinBags();
        setCoinBags(result.data);

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

    fetchSubscriptions();
  }, []);

  const handleOpenModal = (c: CoinBag) => {
    setSelectedBag(c);
    setModalVisible(true);
  };

  const handleBuy = async () => {
    if (selectedBag) {
      const userID = await AsyncStorage.getItem('userID');
      if (userID) {
        try {
          const result = await paymongoRedirect(selectedBag.moneyPrice, selectedBag.coinBagName);
          if (result.url) {
            Linking.openURL(result.url);

            setModalVisible(false);
            setTimeout(async () => {
              const paymentSuccess = true;
              if (paymentSuccess) {
                  await buyCoinBag(userID ,selectedBag.coinBagId).then(() => {
                    setVcoin(prev => prev + selectedBag.quantity);
                    setModalVisible(false);
                    
                  });
                  Alert.alert("Payment Success", "Your payment was successful!");
              } else {
                  Alert.alert("Payment Failed", "There was a problem with your payment. Please try again.");
              }
          }, 10000);
          } else {
            setError('Failed to initiate payment');
          }
        } catch (err) {
          setError('Payment failed');
        }
      }
    }
  };

  return (
    <View className="flex flex-row gap-16 items-center p-[60px] mb-24">
      {coinBags.map((bag, index) => (
      <View key={index} className="items-center">
        <Image source={require('../assets/Vcoin.png')} className="w-56 h-56 mb-4" />
        <Text className="text-2xl text-white font-bold mb-6">{bag.coinBagName}</Text>
        <Text className="text-2xl text-white font-bold mb-6">{bag.quantity}</Text>
        <TouchableOpacity className="bg-white rounded-md py-2 px-3"  onPress={() => handleOpenModal(bag)}>
        <Text className="text-base font-bold text-black">₱ {bag.moneyPrice}</Text>
        </TouchableOpacity>
      </View>))}

      {selectedBag && (
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex items-center justify-center flex-1 bg-[#00000080]">
            <View className="bg-white items-center p-6 rounded-lg w-[80%]">
              <Text className="text-xl text-black font-bold mb-4">Purchase {selectedBag.coinBagName}</Text>
              <Text className="text-lg text-black mb-4">Quantity: {selectedBag.quantity} VCoins</Text>

              <Text className="text-lg text-black mb-4">Total Price: ₱{selectedBag.moneyPrice}</Text>

              <View className="flex-row gap-2 items-center">
                <TouchableOpacity
                  className={`bg-gray-400 rounded-md py-2 px-3`}
                  onPress={handleBuy}
                >
                  <Text className="text-white text-center">Buy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="mt-4 bg-gray-400 rounded-md py-2 px-3"
                  onPress={() => setModalVisible(false)}
                >
                  <Text className="text-center text-center">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

    </View>
  );
};

export default Currency;
