import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View, ActivityIndicator, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HexagonIcon from '../assets/svg/HexagonIcon';
import StarIcon from '../assets/svg/StarIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import BackIcon from '../assets/svg/BackIcon';
import { UnitDetails } from './type';
import { getUnits } from './repo';

type Props = StackScreenProps<RootStackParamList, 'Unit'>;

const Unit: React.FC<Props> = ({ route, navigation }) => {
    const { sectionId, sectionName } = route.params;
    const [units, setUnits] = useState<UnitDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentUnit, setCurrentUnit] = useState<UnitDetails | null>(null);

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                console.log(sectionName);
                const result = await getUnits(sectionId);
                console.log(result.data);
                setUnits(result.data);
            } catch (error) {
                console.error('Error fetching units:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUnits();
    }, [sectionId]);

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
            <SafeAreaView className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1">
            <LinearGradient colors={['#6addd0', '#7fc188']} className="flex-1 justify-center items-center">
                <View className="flex-row justify-between w-full px-5 absolute top-10">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <BackIcon className="text-black w-6 h-6 bg-white p-2 rounded-lg" />
                    </TouchableOpacity>
                </View>
                <View className="items-center mb-3 mt-8">
                    <Text className="text-4xl font-bold text-white">Section {sectionName}</Text>
                </View>
                <ScrollView contentContainerStyle={{ padding: 20 }} className="mb-8" showsVerticalScrollIndicator={false}>
                    <View className="justify-around mt-2">
                        {units.map((unit: UnitDetails, index: number) => (
                            <View key={index} className="items-center justify-center mb-8">
                                <TouchableOpacity onPress={() => openModal(unit)}>
                                    <View className="relative items-center justify-center h-24 w-24">
                                        <HexagonIcon className="h-full w-full text-black" />
                                        <Text className="absolute text-white text-xl font-bold">{unit.unitNumber}</Text>
                                    </View>
                                </TouchableOpacity>
                                <View className="absolute bottom-[-12px] flex-row items-center gap-2 z-10">
                                    <StarIcon className="w-8 h-8 text-gray-300" />
                                    <StarIcon className="w-10 h-10 text-gray-300" />
                                    <StarIcon className="w-8 h-8 text-gray-300" />
                                </View>
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
                            <View className="bg-black rounded-t-xl w-full">
                                <TouchableOpacity activeOpacity={1} className="bg-black rounded-t-xl">
                                    <View className="p-10">
                                        <Text className="text-4xl font-bold text-white mb-2 text-center">
                                            Unit {currentUnit.unitNumber}
                                        </Text>
                                        <Text className="text-2xl text-white mb-5 text-center">{currentUnit.title}</Text>
                                        <Text className="text-base text-white mb-5 text-center">
                                            {currentUnit.description}
                                        </Text>
                                        <View className="pb-10 px-10">
                                            <TouchableOpacity
                                                className="bg-white py-2 px-10 rounded-full self-center"
                                                onPress={() => {
                                                    closeModal();
                                                    //navigation.navigate('PlayUnit', { unitId: currentUnit.unitId });
                                                }}
                                            >
                                                <Text className="text-lg text-black font-bold">Start Unit</Text>
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
