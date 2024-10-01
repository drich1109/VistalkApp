import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HexagonIcon from '../assets/svg/HexagonIcon';
import StarIcon from '../assets/svg/StarIcon';
import LockIcon from '../assets/svg/LockIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import BackIcon from '../assets/svg/BackIcon';

type Props = StackScreenProps<RootStackParamList, 'Unit'>;

const Unit: React.FC<Props> = ({navigation}) => {
    return (
        <SafeAreaView className="flex-1">
            <LinearGradient colors={['#6addd0', '#7fc188']} className="flex-1 justify-center items-center">
                <View className="flex-row justify-between w-full px-5 absolute top-10">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <BackIcon className="text-black w-6 h-6 bg-white p-2 rounded-lg" />
                    </TouchableOpacity>
                </View>
                <View className="items-center mb-3 mt-8">
                    <Text className="text-4xl font-bold text-white">Section 1</Text>
                </View>
                <ScrollView contentContainerStyle={{ padding: 20 }} className="mb-8" showsVerticalScrollIndicator={false}>
                    <View className="justify-around mt-2">
                        <View className="items-center justify-center mb-8">
                            <TouchableOpacity>
                                <View className="relative items-center justify-center h-24 w-24">
                                    <HexagonIcon className="h-full w-full text-black" />
                                    <Text className="absolute text-white text-xl font-bold">1</Text>
                                </View>
                            </TouchableOpacity>
                            <View className="absolute bottom-[-12px] flex-row items-center gap-2 z-10">
                                <StarIcon className="w-8 h-8 text-gray-300" />
                                <StarIcon className="w-10 h-10 text-gray-300" />
                                <StarIcon className="w-8 h-8 text-gray-300" />
                            </View>
                        </View>
                        <View className="items-center justify-center mb-8">
                            <TouchableOpacity>
                                <View className="relative items-center justify-center h-24 w-24">
                                    <HexagonIcon className="h-full w-full text-black" />
                                    <LockIcon className="absolute text-white h-6 w-6" />
                                </View>
                            </TouchableOpacity>
                            <View className="absolute bottom-[-12px] flex-row items-center gap-2 z-10">
                                <StarIcon className="w-8 h-8 text-gray-300" />
                                <StarIcon className="w-10 h-10 text-gray-300" />
                                <StarIcon className="w-8 h-8 text-gray-300" />
                            </View>
                        </View>
                        <View className="items-center justify-center mb-8">
                            <TouchableOpacity>
                                <View className="relative items-center justify-center h-24 w-24">
                                    <HexagonIcon className="h-full w-full text-black" />
                                    <LockIcon className="absolute text-white h-6 w-6" />
                                </View>
                            </TouchableOpacity>
                            <View className="absolute bottom-[-12px] flex-row items-center gap-2 z-10">
                                <StarIcon className="w-8 h-8 text-gray-300" />
                                <StarIcon className="w-10 h-10 text-gray-300" />
                                <StarIcon className="w-8 h-8 text-gray-300" />
                            </View>
                        </View>
                        <View className="items-center justify-center mb-8">
                            <TouchableOpacity>
                                <View className="relative items-center justify-center h-24 w-24">
                                    <HexagonIcon className="h-full w-full text-black" />
                                    <LockIcon className="absolute text-white h-6 w-6" />
                                </View>
                            </TouchableOpacity>
                            <View className="absolute bottom-[-12px] flex-row items-center gap-2 z-10">
                                <StarIcon className="w-8 h-8 text-gray-300" />
                                <StarIcon className="w-10 h-10 text-gray-300" />
                                <StarIcon className="w-8 h-8 text-gray-300" />
                            </View>
                        </View>
                        <View className="items-center justify-center mb-8">
                            <TouchableOpacity>
                                <View className="relative items-center justify-center h-24 w-24">
                                    <HexagonIcon className="h-full w-full text-black" />
                                    <LockIcon className="absolute text-white h-6 w-6" />
                                </View>
                            </TouchableOpacity>
                            <View className="absolute bottom-[-12px] flex-row items-center gap-2 z-10">
                                <StarIcon className="w-8 h-8 text-gray-300" />
                                <StarIcon className="w-10 h-10 text-gray-300" />
                                <StarIcon className="w-8 h-8 text-gray-300" />
                            </View>
                        </View>
                        <View className="items-center justify-center mb-8">
                            <TouchableOpacity>
                                <View className="relative items-center justify-center h-24 w-24">
                                    <HexagonIcon className="h-full w-full text-black" />
                                    <LockIcon className="absolute text-white h-6 w-6" />
                                </View>
                            </TouchableOpacity>
                            <View className="absolute bottom-[-12px] flex-row items-center gap-2 z-10">
                                <StarIcon className="w-8 h-8 text-gray-300" />
                                <StarIcon className="w-10 h-10 text-gray-300" />
                                <StarIcon className="w-8 h-8 text-gray-300" />
                            </View>
                        </View>
                        <View className="items-center justify-center mb-8">
                            <TouchableOpacity>
                                <View className="relative items-center justify-center h-24 w-24">
                                    <HexagonIcon className="h-full w-full text-black" />
                                    <LockIcon className="absolute text-white h-6 w-6" />
                                </View>
                            </TouchableOpacity>
                            <View className="absolute bottom-[-12px] flex-row items-center gap-2 z-10">
                                <StarIcon className="w-8 h-8 text-gray-300" />
                                <StarIcon className="w-10 h-10 text-gray-300" />
                                <StarIcon className="w-8 h-8 text-gray-300" />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};
export default Unit;