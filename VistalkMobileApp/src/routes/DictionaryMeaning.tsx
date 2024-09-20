import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import SearchIcon from "../assets/svg/SearchIcon";
import { useState } from "react";
import SpeakerIcon from "../assets/svg/SpeakerIcon";
import { RootStackParamList } from "../../types";
import { Path, Svg } from "react-native-svg";
import { StackScreenProps } from "@react-navigation/stack";

type Props = StackScreenProps<RootStackParamList, 'DictionaryMeaning'>;

const DictionaryMeaning: React.FC<Props> = ({navigation}) => {
    const [searchText, setSearchText] = useState('');
    const [activeScreen, setActiveScreen] = useState<keyof RootStackParamList | null>('Dictionary');
    
    return(
        <SafeAreaView className="flex-1">
          <ImageBackground source={require('../assets/bg.png')} className="flex-1 items-center" resizeMode="cover">
          <View className="flex-row justify-between w-full px-5 absolute top-10">
            <TouchableOpacity onPress={() => navigation.navigate('Dictionary')}>
              <Svg width="30" height="30" className="bg-white text-[#99BC85] rounded-lg" viewBox="0 0 24 24">
                  <Path
                    fill="currentColor"
                    d="M3.636 11.293a1 1 0 000 1.414l5.657 5.657a1 1 0 001.414-1.414L6.757 13H20a1 1 0 100-2H6.757l3.95-3.95a1 1 0 00-1.414-1.414z"
                  />
              </Svg>
            </TouchableOpacity>
          </View>
          <View className="items-center mt-20 mb-3">
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
          <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }} className="mb-16" showsVerticalScrollIndicator={false}>
            <View className="justify-self-start ml-3">
                  <View className="flex flex-row items-center gap-3 mb-2">
                      <Text className="text-2xl font-bold text-white">Kapoy</Text>
                      <Text className="text-xl italic font-light text-white">(Tired)</Text>
                  </View>
                  <View className="flex flex-row justify-self-start ml-3 mb-2 px-2">
                      <Text className="text-xl italic font-light text-white w-20">["ka-poy"]</Text>
                      <TouchableOpacity>
                          <SpeakerIcon className="h-6 w-6 ml-2" />
                      </TouchableOpacity>
                  </View>
                  <View className="justify-self-start ml-4 px-2 mb-4 w-auto">
                      <Text className="text-xl text-white font-light">:drained of strength and energy</Text>
                      <Text className="text-xl text-white font-light">:fatigued often to the point of exhaustion.</Text>
                  </View>
            </View>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    );
};

export default DictionaryMeaning;