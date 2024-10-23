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
          <Modal transparent={true} animationType="none" >
            <TouchableOpacity
              className="flex-1 justify-end"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
              onPress={onHome}
            >
              <View className="bg-[#FAF9F6] rounded-t-xl w-full">
                <TouchableOpacity activeOpacity={1} className="bg-[#FAF9F6] rounded-t-xl">
                  <View className="p-10 items-center">
                    <Text className="text-3xl font-bold text-red-500 mb-6 uppercase">Game Over</Text>
                    <View className="relative items-center mb-4">
                      <Text className="text-2xl font-semibold text-gray-600 mb-2 uppercase">Your Score</Text>
                      <View className="w-[80%] border rounded-xl py-2 px-8">
                        <Text className="text-2xl font-semibold text-black">{score}</Text>
                      </View>
                    </View>
                    <View className="pb-4 px-10">
                      <TouchableOpacity onPress={onRestart}>
                        <LinearGradient colors={['#6addd0', '#f7c188']} className="bg-[#6addd0] px-6 py-3 rounded-full mb-2">
                          <Text className="text-white text-lg font-bold">Try Again</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={onHome}>
                        <LinearGradient colors={['#6addd0', '#f7c188']} className="bg-[#6addd0] px-6 py-3 rounded-full">
                          <Text className="text-white text-lg font-bold">Go Home</Text>
                        </LinearGradient>
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
