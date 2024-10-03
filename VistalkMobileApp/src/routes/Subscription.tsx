import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Linking, Alert } from 'react-native';
import { SubscriptionDto } from './type';
import { buySubscription, getSubscriptions, getUserVCoin, paymongoRedirect } from './repo';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SusbcriptionProps = {
  vCoin: number;
  setVcoin: React.Dispatch<React.SetStateAction<number>>;
};

const Subscription: React.FC<SusbcriptionProps> = ({ vCoin, setVcoin }) => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedSubcription, setSelectedSubscription] = useState<SubscriptionDto | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const result = await getSubscriptions();
        setSubscriptions(result.data);

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

  const handleOpenModal = (s: SubscriptionDto) => {
    setSelectedSubscription(s);
    setModalVisible(true);
  };

  const handleBuy = async () => {
    if (selectedSubcription) {
      const userID = await AsyncStorage.getItem('userID');
      if (userID) {
        try {
          const result = await paymongoRedirect(selectedSubcription.price, selectedSubcription.subscriptionName);
          if (result.url) {
            Linking.openURL(result.url);

            setModalVisible(false);
            setTimeout(async () => {
              const paymentSuccess = true;
              if (paymentSuccess) {
                  await buySubscription(userID, selectedSubcription.id);
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
    <View className="flex flex-row gap-32 items-center p-[100px] mb-24">
       {subscriptions.map((subscription, index) => (
      <View  key={index} className="items-center">
        <View className="items-center bg-white rounded-lg p-4 mb-4">
            <Image  source={require('../assets/logosubs.png')} className="w-24 h-24 mb-6"/>
            <Text className="text-2xl font-bold text-black w-32 text-center">{subscription.subscriptionName}</Text>
        </View>
        <TouchableOpacity className="bg-white rounded-md py-2 px-3" onPress={() => handleOpenModal(subscription)}
        >
            <Text className="text-base font-bold text-black">₱ {subscription.price}</Text>
        </TouchableOpacity>
      </View>))}
  
      {selectedSubcription && (
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex items-center justify-center flex-1 bg-gray bg-opacity-50">
            <View className="bg-black p-6 rounded-lg w-[80%]">
              <Text className="text-xl font-bold mb-4">Purchase {selectedSubcription.subscriptionName}</Text>
              
              <Text className="text-lg mb-4">Total Price: ₱{selectedSubcription.price}</Text>

              <TouchableOpacity
                className={`bg-blue-500 rounded-md py-2 px-3`}
                onPress={handleBuy}
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

export default Subscription;
