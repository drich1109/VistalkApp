import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View, ActivityIndicator, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import StarIcon from '../assets/svg/StarIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList, UnitContentScreenNavigationProp } from '../../types';
import BackIcon from '../assets/svg/BackIcon';
import { UnitDetails } from './type';
import { getUnits } from './repo';
import { useNavigation } from '@react-navigation/native';
import TotalIcon from '../assets/svg/TotalIcon';
import CorrectIcon from '../assets/svg/CorrectIcon';
import IncorrectIcon from '../assets/svg/IncorrectIcon';
import UnitIcon from '../assets/svg/UnitIcon';
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = StackScreenProps<RootStackParamList, 'Unit'>;

const Unit: React.FC<Props> = ({ route, navigation }) => {
    const { sectionId, sectionName } = route.params;
    const [units, setUnits] = useState<UnitDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentUnit, setCurrentUnit] = useState<UnitDetails | null>(null);
    const navigate = useNavigation<UnitContentScreenNavigationProp>();

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const userID = await AsyncStorage.getItem('userID');
                const result = await getUnits(sectionId, userID);
                setUnits(result.data);
            } catch (error) {
                console.error('Error fetching units:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUnits();
    }, [sectionId]);
    const navigateToUnitContent = () => {
        if(currentUnit){
        const unitId = currentUnit?.unitID
        closeModal();
        navigate.navigate('UnitContent', {unitId, sectionId, sectionName});
        }

    };

    const openModal = (unit: UnitDetails) => {
        setCurrentUnit(unit);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setCurrentUnit(null);
    };

    if (loading) {
        return (
            <Loader message='loading' isVisible={loading} />
        );
    }

    return (
        <SafeAreaView className="flex-1">
            <LinearGradient colors={['#6addd0', '#f7c188']} className="flex-1 justify-center items-center">
                <View className="flex-row justify-between w-full px-5 absolute top-8">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <BackIcon className=" w-8 h-8 text-white" />
                    </TouchableOpacity>
                </View>
                <View className="items-center mb-3 mt-8">
                    <Text className="text-4xl font-bold text-white">Section {sectionName}</Text>
                </View>
                <ScrollView contentContainerStyle={{ padding: 20 }} className="" showsVerticalScrollIndicator={false}>
                    <View className="justify-around mt-2">
                        {units.map((unit: UnitDetails, index: number) => (
                            <View key={index} className="mb-8">
                                <TouchableOpacity onPress={() => openModal(unit)}>
                                    <View className="border border-[#FAF9F6] rounded-2xl py-3 px-6" style={{
                                        backgroundColor: 'rgba(240, 240, 240, 0.4)'
                                    }}>
                                        <View className="flex-row items-center justify-between gap-4">
                                            <View className="flex-row items-center gap-1">
                                                <UnitIcon className="h-6 w-6 text-black" />
                                                <Text className="text-black text-xl font-bold">Unit {unit.unitNumber}</Text>
                                            </View>
                                            <View className="relative items-center">
                                                <View className="flex-row">
                                                    <StarIcon className="text-[#FFFF00] h-6 w-6 items-center" />
                                                    <Text className="text-black text-lg font-bold">Score</Text>
                                                </View>
                                                <Text className="text-black text-3xl font-bold">{unit.totalScore}</Text>
                                            </View>
                                        </View>
                                        <View className="border-t border-[#FAF9F6] flex-row items-center justify-between gap-2 mt-4">
                                            <View className="relative items-center">
                                                <View className="flex-row">
                                                    <TotalIcon className="text-black h-6 w-6" />
                                                    <Text className="text-black text-lg font-light">Total</Text>
                                                </View>
                                                <Text className="text-black text-lg font-bold">{unit.totalItems}</Text>
                                            </View>
                                            <View className="relative items-center border-l border-[#FAF9F6]">
                                                <View className="flex-row">
                                                    <CorrectIcon className="text-green-600 h-6 w-6" />
                                                    <Text className="text-black text-lg font-light">Correct</Text>
                                                </View>
                                                <Text className="text-green-600 text-lg font-bold">{unit.totalCorrect}</Text>
                                            </View>
                                            <View className="relative items-center border-l border-[#FAF9F6]">
                                                <View className="flex-row">
                                                    <IncorrectIcon className="text-[#FF0000] h-6 w-6" />
                                                    <Text className="text-black text-lg font-light">Wrong</Text>
                                                </View>
                                                <Text className="text-[#FF0000] text-lg font-bold">{unit.totalWrong}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </ScrollView>

                {/* Modal for showing unit details */}
                {currentUnit && (
                    <Modal visible={modalVisible} transparent={true} animationType="none" onRequestClose={closeModal}>
                        <TouchableOpacity
                            className="flex-1 justify-end"
                            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                            onPress={closeModal}
                        >
                            <View className=" rounded-t-xl w-full">
                                <TouchableOpacity activeOpacity={1} className="bg-[#FAF9F6] rounded-t-xl">
                                    <View className="p-8">
                                        <View className="flex-row items-center mb-2">
                                            <UnitIcon className="h-4 w-4 text-black" />
                                            <Text className="text-xl font-bold text-black items-start">
                                                Unit {currentUnit.unitNumber}
                                            </Text>
                                        </View>
                                        <Text className="text-3xl text-black mb-2 text-center">{currentUnit.title}</Text>
                                        <Text className="text-base text-black mb-5 text-center">
                                            {currentUnit.description}
                                        </Text>
                                        <View className="pb-10 px-10">
                                            <TouchableOpacity
                                                onPress={() => navigateToUnitContent()}
                                            >
                                                <LinearGradient colors={['#6addd0', '#f7c188']} className="bg-gray-600 py-2 px-10 rounded-full self-center">
                                                    <Text className="text-lg text-white font-bold">Start Unit</Text>
                                                </LinearGradient>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </Modal>
                )}
            </LinearGradient>
        </SafeAreaView>
    );
};

export default Unit;
