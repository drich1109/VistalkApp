import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal } from 'react-native';
import PlayIcon from '../assets/svg/PlayIcon';
import PauseIcon from '../assets/svg/PauseIcon';  // Import the pause icon
import { Musics } from './type';
import { buyMusic, getBackgroundMusic, getMusic, getUserVCoin } from './repo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound';

type FileUrl = {
  id: number;
  url: string;
};

type MusicProps = {
  vCoin: number;
  setVcoin: React.Dispatch<React.SetStateAction<number>>;
};

const Music: React.FC<MusicProps> = ({ vCoin, setVcoin }) => {
  const [music, setMusic] = useState<Musics[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fileUrls, setFileUrls] = useState<FileUrl[]>([]);
  const [sound, setSound] = useState<Sound | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedMusic, setSelectedMusic] = useState<Musics | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);  // Track if sound is playing
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);  // Track the current playing track

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const result = await getMusic();
        setMusic(result.data);

        const audioUrls = await Promise.all(
          result.data.map(async (music: Musics) => {
            if (music.isActive) {
              const url = getBackgroundMusic(music.filePath);
              return { id: music.itemID, url };
            }
            return null;
          })
        );

        setFileUrls(audioUrls.filter((url) => url !== null) as FileUrl[]);

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
        setError('Failed to fetch music');
      } finally {
        setLoading(false);
      }
    };

    fetchMusic();
  }, []);

  const toggleSound = (fileUrl: string, trackId: number) => {
    if (currentTrack === trackId && isPlaying) {
      // If the current track is already playing, pause it
      sound?.pause();
      setIsPlaying(false);
    } else {
      // Play the sound if it is not playing or a new track is selected
      if (sound) {
        sound.stop(); // Stop the sound without a callback
        sound.release(); // Release the sound instance
      }
  
      const newSound = new Sound(fileUrl, '', (error: Error | null) => {
        if (error) {
          console.error('Failed to load sound', error);
          return;
        }
  
        newSound.setVolume(1.0); // Set volume to max
        newSound.play(() => {
          // Callback when sound playback ends
          setIsPlaying(false);
          setCurrentTrack(null); // Reset track after playback ends
          newSound.release(); // Release the sound instance after playback
        });
      });
  
      setSound(newSound); // Track the sound instance
      setIsPlaying(true); // Set playing state
      setCurrentTrack(trackId); // Track the current playing track
    }
  };

  const handleOpenModal = (music: Musics) => {
    setSelectedMusic(music);
    setQuantity(1); 
    setTotalPrice(music.vcoinPrice); 
    setModalVisible(true);
  };

  const handleBuy = async () => {
    if (selectedMusic && quantity > 0 && totalPrice <= vCoin) {
      const userID = await AsyncStorage.getItem('userID');
      if(userID)
        buyMusic(userID ,selectedMusic.itemID, quantity).then(() => {
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
    <View className="flex flex-row gap-12 items-center p-[65px] mb-24">
        {fileUrls.length > 0 && (
          music.map((m, index) => (
          <View className="items-center">
          <Image source={require('../assets/Disk.png')} className="w-56 h-56 mb-2" />
            <View className="items-center" key={index}>
              <TouchableOpacity onPress={() => toggleSound(fileUrls[index].url, m.itemID)}>
                {isPlaying && currentTrack === m.itemID ? (
                  <PauseIcon className="w-8 h-8 text-black bg-white p-4 rounded-full mb-2" />
                ) : (
                  <PlayIcon className="w-8 h-8 text-black bg-white p-4 rounded-full mb-2" />
                )}
              </TouchableOpacity>
              <Text className="text-2xl text-white font-bold mb-2">{m.musicTitle}</Text>
              <Text className="text-lg text-white font-light mb-6">{m.musicGenre}</Text>
              <View className="flex flex-row gap-4">
                <TouchableOpacity className={`bg-white rounded-md py-2 px-3 ${m.isAlreadyBought == 1 ? 'opacity-50' : ''}`} onPress ={() => handleOpenModal(m)} disabled={m.isAlreadyBought == 1}>
                  <View className="flex flex-row gap-2" >
                    <Image source={require('../assets/Vcoin.png')} className="w-6 h-6" />
                    <Text className="text-base font-bold text-black">{m.vcoinPrice}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          ))
        )}
        {selectedMusic && (
          <Modal visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}>
            <View className="flex items-center justify-center flex-1 bg-[#00000080]">
            <View className="bg-white items-center p-6 rounded-lg w-[80%]">
              <Text className="text-xl text-black font-bold mb-4">Buy {selectedMusic.musicTitle}</Text>
              <Text className="text-lg mb-4 text-black">Price: {totalPrice} vCoins</Text>
              <Text className="text-sm mb-4 text-black">Your vCoins: {vCoin}</Text>

              <View className="flex-row gap-2 items-center">
                <TouchableOpacity
                  className={`bg-gray-400 rounded-md py-2 px-3 ${quantity === 0 || totalPrice > vCoin ? 'opacity-50' : ''}`}
                  onPress={handleBuy}
                  disabled={quantity === 0 || totalPrice > vCoin}
                >
                  <Text className="text-black text-center">Buy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="mt-4 bg-gray-400 rounded-md py-2 px-3"
                  onPress={() => setModalVisible(false)}
                >
                  <Text className="text-center text-black">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        )}
    </View>
  );
};

export default Music;
