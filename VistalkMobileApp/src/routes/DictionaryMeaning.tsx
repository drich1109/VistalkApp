import { ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import SearchIcon from "../assets/svg/SearchIcon";
import { useState } from "react";
import SpeakerIcon from "../assets/svg/SpeakerIcon";
import Menu from "../components/Menu";
import { RootStackParamList } from "../../types";

const DictionaryMeaning: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [activeScreen, setActiveScreen] = useState<keyof RootStackParamList | null>('Dictionary');
    return(
        <ImageBackground source={require('../assets/bg.png')} className="flex-1 justify-center items-center" resizeMode="cover">
          <View className="items-center mb-3">
            <Text className="text-4xl font-bold text-white">Dictionary</Text>
          </View>
          <View className="flex flex-row items-center justify-start bg-white rounded-lg px-4 mb-5 w-4/5 h-10">
            <TextInput
              className="flex-1 h-full text-[#999] text-base"
              placeholder="Search for a word"
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
            <SearchIcon className="w-7 h-7" />
          </View>
            <View className="justify-self-start ml-4">
                <View className="flex flex-row items-center gap-3 mb-2">
                    <Text className="text-2xl font-bold text-white">Kapoy</Text>
                    <Text className="text-xl italic font-light text-white">(Tired)</Text>
                </View>
                <View className="flex flex-row justify-self-start ml-4 mb-2 px-2">
                    <Text className="text-xl italic font-light text-white w-20">["ka-poy"]</Text>
                    <TouchableOpacity>
                        <SpeakerIcon className="h-6 w-6 ml-2" />
                    </TouchableOpacity>
                </View>
                <View className="justify-self-start ml-4 px-2 mb-4">
                    <Text className="text-xl text-white font-light">:drained of strength and energy</Text>
                    <Text className="text-xl text-white font-light">:fatigued often to the point of exhaustion.</Text>
                </View>
            </View>
            <Menu activeScreen={activeScreen} />
        </ImageBackground>
    );
};

export default DictionaryMeaning;