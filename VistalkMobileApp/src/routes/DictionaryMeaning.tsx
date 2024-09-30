import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import SearchIcon from "../assets/svg/SearchIcon";
import { useEffect, useState } from "react";
import SpeakerIcon from "../assets/svg/SpeakerIcon";
import { RootStackParamList } from "../../types";
import { Path, Svg } from "react-native-svg";
import { StackScreenProps } from "@react-navigation/stack";
import { getContentById, getContentDefinitionById, getContentExampleById, getContentPronunciation, getContentSyllableById, getSyllablePronunciation } from "./repo";
import { Content, ContentDefinition, ContentExample, ContentSyllable } from "./type";
import Sound from 'react-native-sound';

type Props = StackScreenProps<RootStackParamList, 'DictionaryMeaning'>;

const DictionaryMeaning: React.FC<Props> = ({route, navigation}) => {
    const [searchText, setSearchText] = useState('');
    const [activeScreen, setActiveScreen] = useState<keyof RootStackParamList | null>('Dictionary');
    const {contentId} = route.params; 
    const [content, setContentById] = useState<Content>();
    const [contentSyllables, setContentSyllables] = useState<ContentSyllable[]>();
    const [contentDefinitions, setContentDefinitions] = useState<ContentDefinition[]>();
    const [contentExamples, setContentExamples] = useState<ContentExample[]>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [sound, setSound] = useState<Sound | null>(null); 
    const [syllableFileUrls, setSyllableFileUrls] = useState<string[]>([]);


    useEffect(() => {
      const fetchContent = async () => {
        setLoading(true);
        setError(null);
        try {
          const contentResult = await getContentById(contentId);
          setContentById(contentResult.data);

          if (contentResult.data.audioPath) {
            const newFileUrl = getContentPronunciation(contentResult.data.audioPath);
            setFileUrl(newFileUrl);
          }

          const syllableResult = await getContentSyllableById(contentId);
          setContentSyllables(syllableResult.data);
          
          const syllableUrls = syllableResult.data.map(syllable => getSyllablePronunciation(syllable.audioPath));
          setSyllableFileUrls(syllableUrls);

          const definitionResult = await getContentDefinitionById(contentId);
          setContentDefinitions(definitionResult.data);
          
          const exampleResult = await getContentExampleById(contentId);
          setContentExamples(exampleResult.data);
        } catch (err) {
          console.error('Failed to fetch content:', err);
          setError('Failed to fetch contents');
        } finally {
          setLoading(false); 
        }
      };
    
      if (contentId) {
        fetchContent();
        stopAndReleaseSound();
      }
    }, [contentId]);

   
    const playSound = (fileUrl: string | null) => {
      if (!fileUrl) return;
    
      const sound = new Sound(fileUrl, '', (error: Error | null) => {
        if (error) {
          console.error('Failed to load sound', error);
          return;
        }
    
        sound.setVolume(1.0); // Set volume to max
        sound.play(() => {
          // Callback when sound playback ends
          sound.release(); // Release the sound instance after playback
        });
      });
    
      setSound(sound); // Optionally track the sound instance
    };
  
    const stopAndReleaseSound = () => {
      if (sound) {
        sound.stop();
        sound.release();
        setSound(null);
      }
    };

    const playSyllableSound = (syllableIndex: number) => {
      const syllableAudioUrl = syllableFileUrls[syllableIndex];
      if (!syllableAudioUrl) return;
    
      const syllableSound = new Sound(syllableAudioUrl, '', (error) => {
        if (error) {
          console.error('Failed to load the syllable sound', error);
          return;
        }
    
        syllableSound.play();
      });
    };

    return (
      <ImageBackground
        source={require("../assets/bg.png")}
        className="flex-1 items-center"
        resizeMode="cover"
      >
        <View className="flex-row justify-between w-full px-5 absolute top-10">
          <TouchableOpacity onPress={() => navigation.navigate("Dictionary")}>
            <Svg
              width="30"
              height="30"
              className="bg-white text-[#99BC85] rounded-lg"
              viewBox="0 0 24 24"
            >
              <Path
                fill="currentColor"
                d="M3.636 11.293a1 1 0 000 1.414l5.657 5.657a1 1 0 001.414-1.414L6.757 13H20a1 1 0 100-2H6.757l3.95-3.95a1 1 0 00-1.414-1.414z"
              />
            </Svg>
          </TouchableOpacity>
        </View>
    
        {content && (
          <View className="ml-4 mt-24 w-full px-6">
            <View className="flex flex-row items-center mb-4">
              <Text className="text-2xl font-bold text-white">
                {content.contentText}
              </Text>
              <TouchableOpacity onPress={() => playSound(fileUrl)}>
                <SpeakerIcon className="h-6 w-6 ml-2" />
              </TouchableOpacity>
            </View>
    
            {contentSyllables && contentSyllables.length > 0 && (
              <View className="flex flex-row mb-2 px-2">
                {contentSyllables.map((syllable, index) => (
                  <View key={index} className="flex flex-row">
                    <TouchableOpacity onPress={() => playSyllableSound(index)}>
                      <Text className="text-xl italic underline font-light text-white">
                        {syllable.syllableText}
                      </Text>
                    </TouchableOpacity>
                    {index < contentSyllables.length - 1 && (
                      <Text className="text-xl italic font-light text-white"> </Text>
                    )}
                  </View>
                ))}
              </View>
            )}
    
            <Text className="text-lg mb-4 text-white">
              {"English Translation:"} "{content.englishTranslation}""
            </Text>
    
            {contentDefinitions && contentDefinitions.length > 0 && (
              <View className="ml-4 px-2 mb-4 w-auto">
                <Text className="text-xl font-semibold text-white">
                  Definitions:
                </Text>
                {contentDefinitions.map((definition, index) => (
                  <View key={index}>
                    <Text className="text-lg text-white font-light ml-2">
                      {"\u2022"} {definition.nativeDefinition}
                    </Text>
                    <Text className="text-lg text-white font-light ml-2 mt-2 italic">
                      {definition.englishDefinition}
                    </Text>
                  </View>
                ))}
              </View>
            )}
    
            {contentExamples && contentExamples.length > 0 && (
              <View className="ml-4 px-2 mb-4 w-auto">
                <Text className="text-xl font-semibold text-white">Examples:</Text>
                {contentExamples.map((example, index) => (
                  <View key={index}>
                    <Text className="text-lg text-white font-light">
                      {"\u2022"} "{example.nativeExample}"
                    </Text>
                    <Text className="text-lg italic text-white font-light">
                      {" "} "{example.englishExample}"
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
    
        {error && (
          <Text className="text-red-500 text-center mt-4">{error}</Text>
        )}
    
        {loading && (
          <Text className="text-white text-center mt-4">Loading...</Text>
        )}
      </ImageBackground>
    );    
};

export default DictionaryMeaning;
