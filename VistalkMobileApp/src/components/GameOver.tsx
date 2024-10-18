import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface GameOverProps {
  score: number;
  onRestart: () => void;
  onHome: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, onRestart, onHome }) => {
  return (
    <SafeAreaView className="flex-1">
      <LinearGradient colors={['#6addd0', '#f7c188']} className="flex-1">
        <View className="flex-1 justify-center items-center">
          <Modal  transparent={true} animationType="none" >
          <TouchableOpacity
                            className="flex-1 justify-end"
                            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                            onPress={onHome}
                        >
                      <View className="bg-black rounded-t-xl w-full">
                                <TouchableOpacity activeOpacity={1} className="bg-black rounded-t-xl">
                                    <View className="p-10">
                                    <Text className="text-4xl font-bold text-red-500 mb-8">Game Over</Text>
                                    <Text className="text-2xl font-semibold text-white mb-4">Your Score: {score}</Text>
                                        <View className="pb-10 px-10">
                                        <TouchableOpacity
                                            className="bg-blue-500 px-6 py-3 rounded-full"
                                            onPress={onRestart}
                                          >
                                            <Text className="text-white text-lg font-bold">Play Again</Text>
                                          </TouchableOpacity>
                                          <TouchableOpacity
                                            className="bg-gray-600 px-6 py-3 rounded-full"
                                            onPress={onHome}
                                          >
                                            <Text className="text-white text-lg font-bold">Go Home</Text>
                                          </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
          </TouchableOpacity>
          </Modal>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default GameOver;
