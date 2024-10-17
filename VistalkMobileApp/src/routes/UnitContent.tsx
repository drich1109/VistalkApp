import { Alert, Animated, Button, Image, Modal, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import BackIcon from "../assets/svg/BackIcon";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList, UnitScreenNavigationProp } from "../../types";
import ClockIcon from "../assets/svg/ClockIcon";
import { useEffect, useRef, useState } from "react";
import HeartIcon from "../assets/svg/HeartIcon";
import { Vibration } from 'react-native';
import SpeakerIcon from "../assets/svg/SpeakerIcon";
import { PowerUp, QuestionDetails, UserPowerUp } from "./type";
import { getContentPronunciation, getPowerupImage, getPowerUps, getQuestionFiles, getUnitQuestions, getUserPowerUps } from "./repo";
import Sound from "react-native-sound";
import Loader from "../components/Loader";
import { useNavigation } from "@react-navigation/native";
import SpeakerIcon2 from "../assets/svg/SpeakerIcon2";
import HeartComponent from "../components/HeartComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SnowflakeComponent from "../components/SnowFlakeComponent";

type Props = StackScreenProps<RootStackParamList, 'UnitContent'>;

type FileUrl = {
    id: number;
    audioUrl?: string;
    imageUrl?: string;
    choice1AudioUrl?: string;
    choice2AudioUrl?: string;
    choice3AudioUrl?: string;
    choice4AudioUrl?: string;
};


type PowerUpURL = {
    id: number;
    url: string;
  };
  

const UnitContent: React.FC<Props> = ({ route, navigation }) => {
    const [timeLeft, setTimeLeft] = useState(15);
    const rotateAnimation = useRef(new Animated.Value(0)).current;
    const scaleAnimation = useRef(new Animated.Value(1)).current;
    const { unitId, sectionId } = route.params;
    const [questionList, setQuestions] = useState<QuestionDetails[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [fileUrls, setFileUrls] = useState<FileUrl[]>([]);
    const [sound, setSound] = useState<Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false); 
    const [currentTrack, setCurrentTrack] = useState<number | null>(null); 
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [matches, setMatches] = useState([
        '', // Match 1
        '', // Match 2
        '', // Match 3
        '', // Match 4
      ]);
    const [hearts, setHearts] = useState(3);
    const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [timerRunning, setTimerRunning] = useState<boolean>(true);
    const navigate = useNavigation<UnitScreenNavigationProp>();
    const [powerUps, setPowerUps] = useState<UserPowerUp[]>([]);
    const [powerUpUrls, setPowerUpUrl] = useState<PowerUpURL[]>([]);
    const [showHeartPopup, setShowHeartPopup] = useState<boolean>(false);
    const [showSnowflakes, setShowSnowflakes] = useState(false);
    const [disabledChoiceIndex, setDisabledChoiceIndex] = useState<number[]>([]);

    async function fetchQuestion() {
        try {
            setIsLoading(true)
            const result = await getUnitQuestions(unitId);
            setQuestions(result.data);
            const urls = await Promise.all(
                result.data.map(async (q: QuestionDetails) => {
                    let audioUrl = null;
                    let imageUrl = null;
                    let choice1AudioUrl = null;
                    let choice2AudioUrl = null;
                    let choice3AudioUrl = null;
                    let choice4AudioUrl = null;
    
                    if (q.audioPath != null) {
                        audioUrl = await getQuestionFiles(q.audioPath);
                    }
    
                    if (q.imagePath != null) {
                        imageUrl = await getQuestionFiles(q.imagePath);
                    }
    
                    if (q.choice1AudioPath != null) {
                        choice1AudioUrl = await getContentPronunciation(q.choice1AudioPath);
                    }
                    if (q.choice2AudioPath != null) {
                        choice2AudioUrl = await getContentPronunciation(q.choice2AudioPath);
                    }
                    if (q.choice3AudioPath != null) {
                        choice3AudioUrl = await getContentPronunciation(q.choice3AudioPath);
                    }
                    if (q.choice4AudioPath != null) {
                        choice4AudioUrl = await getContentPronunciation(q.choice4AudioPath);
                    }
    
                    return {
                        id: q.questionID,
                        audioUrl,
                        imageUrl,
                        choice1AudioUrl,
                        choice2AudioUrl,
                        choice3AudioUrl,
                        choice4AudioUrl
                    };
                })
            );
    
            setFileUrls(urls as FileUrl[]);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
        finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchQuestion();
    }, [unitId]);

    useEffect(() => {
        if (timerRunning && timeLeft > 0) {
            const timerId = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);

            return () => clearInterval(timerId);
        } else if (timeLeft === 0) {
            if (currentQuestionIndex < questionList.length - 1) {
                setDisabledChoiceIndex([]);
                setHearts((prevHearts) => {
                    if (prevHearts <= 1) {
                        Alert.alert("Game Over!", "You've lost all your hearts.");
                        navigation.goBack();
                        return 0;
                    } else {
                        return prevHearts - 1;
                    }
                });
                if (sound) {
                    sound.stop(); 
                    sound.release(); 
                  }
                setCurrentQuestionIndex(prevIndex => prevIndex + 1);
                setTimeLeft(15);
            }
        }
    }, [timerRunning, timeLeft, currentQuestionIndex, questionList.length]);

    useEffect(() => {
        if (currentQuestionIndex) {
            setIsPlaying(false);
            setMatches([
                questionList[currentQuestionIndex].match1ContentText ?? '',
                questionList[currentQuestionIndex].match2ContentText ?? '',
                questionList[currentQuestionIndex].match3ContentText ?? '',
                questionList[currentQuestionIndex].match4ContentText ?? '',
            ]);
        }
    }, [currentQuestionIndex, questionList]);

    useEffect(() => {
        if (timeLeft <= 5 && timeLeft > 0) {
            Animated.loop(
                Animated.parallel([
                    Animated.sequence([
                        Animated.timing(rotateAnimation, { toValue: 1, duration: 150, useNativeDriver: true }),
                        Animated.timing(rotateAnimation, { toValue: -1, duration: 150, useNativeDriver: true }),
                        Animated.timing(rotateAnimation, { toValue: 0, duration: 150, useNativeDriver: true }),
                    ]),
                    Animated.sequence([
                        Animated.timing(scaleAnimation, { toValue: 1.2, duration: 150, useNativeDriver: true }),
                        Animated.timing(scaleAnimation, { toValue: 1, duration: 150, useNativeDriver: true }),
                    ]),
                ])
            ).start();
        } else {
            rotateAnimation.setValue(0);
            scaleAnimation.setValue(1);
            rotateAnimation.stopAnimation();
            scaleAnimation.stopAnimation();
        }
    }, [timeLeft]);

    const rotation = rotateAnimation.interpolate({
        inputRange: [-1, 1],
        outputRange: ['-40deg', '40deg'],
    });

    const toggleSound = (fileUrl: string | undefined, trackId: number) => {
        if(fileUrl){
        if (currentTrack === trackId && isPlaying) {
          sound?.pause();
          setIsPlaying(false);
        } else {
          if (sound) {
            sound.stop(); 
            sound.release(); 
          }
      
          const newSound = new Sound(fileUrl, '', (error: Error | null) => {
            if (error) {
              console.error('Failed to load sound', error);
              return;
            }
      
            newSound.setVolume(1.0); 
            newSound.play(() => {
              setIsPlaying(false);
              setCurrentTrack(null); 
              newSound.release(); 
            });
          });
      
          setSound(newSound); 
          setIsPlaying(true); 
          setCurrentTrack(trackId); 
        }
    }
      };
      
        const moveUp = (index: number) => {
          if (index > 0) {
            const newMatches = [...matches];
            [newMatches[index], newMatches[index - 1]] = [newMatches[index - 1], newMatches[index]];
            setMatches(newMatches);
          }
        };
      
        const moveDown = (index: number) => {
          if (index < matches.length - 1) {
            const newMatches = [...matches];
            [newMatches[index], newMatches[index + 1]] = [newMatches[index + 1], newMatches[index]];
            setMatches(newMatches);
          }
        };

        const checkAnswer = (choiceId: number) => {
            const currentQuestion: QuestionDetails = questionList[currentQuestionIndex];
            setTimerRunning(false);
            setIsPlaying(true);
            setSelectedChoice(choiceId);
            if (currentQuestion.questionTypeID === 1 || currentQuestion.questionTypeID === 2) {
                if (choiceId === currentQuestion.correctChoice) {
                    setIsCorrect(true);
                    setTimeout(() => {
                        proceedToNextQuestion();
                        setIsCorrect(null); 
                        setSelectedChoice(null); 
                        setDisabledChoiceIndex([]);
                    }, 2000);
                } else {
                    setIsCorrect(false);
                    setHearts((prevHearts) => {
                        if (prevHearts <= 1) {
                            Alert.alert("Game Over!", "You've lost all your hearts.");
                            navigation.goBack();
                            return 0;
                        } else {
                            setTimeout(() => {
                                setDisabledChoiceIndex([]);
                                setIsCorrect(null); 
                                setSelectedChoice(null); 
                                proceedToNextQuestion();
                            }, 2000);
                            return prevHearts - 1;
                        }
                    });
                }
            }
        };

          const proceedToNextQuestion = () => {
            if (currentQuestionIndex < questionList.length - 1) {
              setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
              setTimeLeft(15); 
              setTimerRunning(true);
            } else {
              Alert.alert("Congratulations!", "You've completed all the questions!");
            }
          };
          
          useEffect(() => {
            const fetchPowerUps = async () => {
              const userID = await AsyncStorage.getItem('userID');
              if (userID) {
                const result = await getUserPowerUps(userID);
                setPowerUps(result.data);
                const imageUrls = await Promise.all(
                  result.data.map(async (powerUp) => {
                    if (powerUp.itemId !== 0) {
                      const url = getPowerupImage(powerUp.filePath); 
                      return { id: powerUp.itemId, url };
                    }
                    return null;
                  })
                );
        
                setPowerUpUrl(imageUrls.filter((url) => url !== null)); 
              }
            };
        
            fetchPowerUps();
          }, []);
        
          const getImageUrlByItemId = (itemId:number) => {
            const powerUpUrlObj = powerUpUrls.find((powerUp) => powerUp.id === itemId);
            return powerUpUrlObj ? powerUpUrlObj.url : null;
          };

          async function usePowerUp(p: UserPowerUp) {
            if (p.quantity >= 1) {
                const updatedPowerUps = [...powerUps];
        
                if (p.itemId == 1) {
                    if (hearts < 3 || hearts <= 1) {
                        setHearts(hearts + 1);
                        setShowHeartPopup(true);
                        setTimeout(() => {
                            setShowHeartPopup(false);
                        }, 1000);
                                        
                        const powerUpIndex = updatedPowerUps.findIndex(powerUp => powerUp.itemId === p.itemId);
                        if (powerUpIndex !== -1) {
                            updatedPowerUps[powerUpIndex].quantity -= 1; 
                            setPowerUps(updatedPowerUps); 
                            }
                    } else {
                        Vibration.vibrate([0, 100, 50, 100]);
                    }
                }
                
                if (p.itemId == 2) {
                    if (timerRunning) {
                        setTimerRunning(false);
                        setShowSnowflakes(true);
                        setTimeout(() => {
                            setTimerRunning(true);
                            setShowSnowflakes(false);
                        }, 15000);
                        const powerUpIndex = updatedPowerUps.findIndex(powerUp => powerUp.itemId === p.itemId);
                        if (powerUpIndex !== -1) {
                            updatedPowerUps[powerUpIndex].quantity -= 1; 
                            setPowerUps(updatedPowerUps); 
                            }
                    }
                    else {
                        Vibration.vibrate([0, 100, 50, 100]);
                    }
                }
                
                if (p.itemId === 3) {
                    const allChoices = [
                        { id: questionList[currentQuestionIndex].choice1, index: 1 },
                        { id: questionList[currentQuestionIndex].choice2, index: 2 },
                        { id: questionList[currentQuestionIndex].choice3, index: 3 },
                        { id: questionList[currentQuestionIndex].choice4, index: 4 },
                    ];
                    
                    const correctChoice = questionList[currentQuestionIndex].correctChoice;
                    const incorrectChoices = allChoices.filter(choice => choice.id !== correctChoice);
                    const currentDisabledChoices = disabledChoiceIndex || [];
                    
                    if (currentDisabledChoices.length < 2) {
                        const availableChoices = incorrectChoices.filter(choice => !currentDisabledChoices.includes(choice.index));
                        
                        if (availableChoices.length > 0) {
                            const randomChoice = availableChoices[Math.floor(Math.random() * availableChoices.length)];
                            setDisabledChoiceIndex([...currentDisabledChoices, randomChoice.index]);
                        }
                        const powerUpIndex = updatedPowerUps.findIndex(powerUp => powerUp.itemId === p.itemId);
                        if (powerUpIndex !== -1) {
                            updatedPowerUps[powerUpIndex].quantity -= 1; 
                            setPowerUps(updatedPowerUps); 
                        }
                    }
                    else
                    {
                        Vibration.vibrate([0, 100, 50, 100]);
                    }
                } 
                if (p.itemId == 4) {
                    const allChoices = [
                        { id: questionList[currentQuestionIndex].choice1, index: 1 },
                        { id: questionList[currentQuestionIndex].choice2, index: 2 },
                        { id: questionList[currentQuestionIndex].choice3, index: 3 },
                        { id: questionList[currentQuestionIndex].choice4, index: 4 },
                    ];
                    const correctChoice = questionList[currentQuestionIndex].correctChoice;
                    const incorrectChoices = allChoices.filter(choice => choice.id !== correctChoice);
                    
                    const currentDisabledChoices = disabledChoiceIndex || [];
                
                    if (currentDisabledChoices.length < 2) {
                        const shuffledIncorrectChoices = incorrectChoices.sort(() => 0.5 - Math.random());
                        const availableChoices = shuffledIncorrectChoices.filter(choice => !currentDisabledChoices.includes(choice.index));
                        const choicesToDisable = availableChoices.slice(0, 2).map(choice => choice.index);
                        
                        setDisabledChoiceIndex([...currentDisabledChoices, ...choicesToDisable]);
                        
                        const powerUpIndex = updatedPowerUps.findIndex(powerUp => powerUp.itemId === p.itemId);
                        if (powerUpIndex !== -1) {
                            updatedPowerUps[powerUpIndex].quantity -= 1; 
                            setPowerUps(updatedPowerUps); 
                        }
                    }
                    else
                    {
                        Vibration.vibrate([0, 100, 50, 100]);
                    }
                }                
            } else {
                // Add toggle music here like Dota 2 Memorp
                Vibration.vibrate([0, 100, 50, 100]);
            }
        }
        

    return (
        <SafeAreaView className="flex-1">
            <LinearGradient colors={['#6addd0', '#f7c188']} className="flex-1 items-center">
            {isLoading ? ( 
                    <Loader />
                ):( 
                <>
                        {showSnowflakes && ( <SnowflakeComponent />)}
                       
                        <View className="flex-row justify-between items-center mt-2 w-full">
                            <TouchableOpacity className="ml-4" onPress = {() => navigation.goBack()}>
                                <Text className="text-white">Back</Text>
                            </TouchableOpacity>

                            <View className="relative items-center justify-center">
                                    <Animated.View
                                        className="relative items-center justify-center"
                                        style={[
                                            {
                                                transform: [
                                                    { rotate: timerRunning ? rotation : '0deg' },
                                                    { scale: timerRunning ? scaleAnimation : 1 },
                                                ],
                                            },
                                        ]}
                                    >
                                        <ClockIcon className="h-10 w-10 text-white" />
                                    </Animated.View>
                                    <Text className="absolute text-white bottom-2 mb-1 font-bold">{timeLeft}</Text>
                                </View>

                                <View >
                                    {hearts > 0 && (
                                        <HeartComponent hearts={hearts} />
                                    )}

                                </View>

                        </View>

                {questionList.length > 0 && (

                    
                    <View className="mt-5">
                          {fileUrls[currentQuestionIndex]?.audioUrl && (
                                    <View className="items-center rounded-xl py-3 px-4 overflow-hidden"> 
                                <TouchableOpacity onPress={() => toggleSound(fileUrls[currentQuestionIndex].audioUrl, questionList[currentQuestionIndex].questionID)}
                                disabled={isPlaying} 
                                style={{ opacity: isPlaying ? 0.5 : 1 }}
                                >
                                    <SpeakerIcon2 className="w-24 h-24" />
                                </TouchableOpacity>
                                </View>
                            )}

                        {fileUrls[currentQuestionIndex]?.imageUrl && (
                            <View className="items-center rounded-xl py-3 px-4 overflow-hidden"> 
                                 <Image
                                    source={{ uri: fileUrls[currentQuestionIndex]?.imageUrl }}
                                    className="w-48 h-32 rounded-xl mr-2"
                                    resizeMode="contain"
                                />
                            </View>
                        )}

                       <View className="items-center mb-2 w-[85%] shadow-lg">
                            <Text className="text-white text-center font-bold text-xl">
                                {questionList[currentQuestionIndex].questionText}
                            </Text>
                        </View>
                      
                        { (questionList[currentQuestionIndex].questionTypeID === 1 || questionList[currentQuestionIndex].questionTypeID === 2) && (
                        <View className="mt-6 mb-4 items-center">
                        {!disabledChoiceIndex.includes(1) && (
                            <View className="flex-row items-center py-2 px-4 border border-1 rounded-lg mb-4 w-[100%] border-white">

                                <TouchableOpacity 
                                onPress={() => checkAnswer(questionList[currentQuestionIndex].choice1 ?? 0)} 
                                className={`flex-1 py-2 px-4 border border-1 rounded-lg ${selectedChoice === questionList[currentQuestionIndex].choice1
                                    ? isCorrect
                                    ? 'bg-green-500'
                                    : 'bg-red-500'
                                    : 'border-white'} ${disabledChoiceIndex.includes(1)|| selectedChoice !== null ? 'opacity-50' : ''}`}
                                disabled={selectedChoice !== null || disabledChoiceIndex.includes(1) }
                                >

                                    <Text className={`text-center text-sm font-semibold ${disabledChoiceIndex.includes(1)? 'text-gray-400' : 'text-white'}`}>{questionList[currentQuestionIndex].choice1ContentText}</Text>                             
                                </TouchableOpacity>
                            {fileUrls[currentQuestionIndex]?.choice1AudioUrl && questionList[currentQuestionIndex].choice1AudioPath !== null && (
                                <TouchableOpacity onPress={() => {toggleSound(fileUrls[currentQuestionIndex].choice1AudioUrl, questionList[currentQuestionIndex].questionID)}}
                                disabled={isPlaying} 
                                style={{ opacity: isPlaying ? 0.5 : 1 }}>
                                <SpeakerIcon className="h-5 w-5 ml-2 text-black" />
                                </TouchableOpacity>
                            )}
                            </View>
                            )}
                            {!disabledChoiceIndex.includes(2) && (
                            <View className="flex-row items-center py-2 px-4 border border-1 rounded-lg mb-4 w-[100%] border-white">
                                <TouchableOpacity 
                                onPress={() => checkAnswer(questionList[currentQuestionIndex].choice2 ?? 0)} 
                                className={`flex-1 py-2 px-4 border border-1 rounded-lg ${selectedChoice === questionList[currentQuestionIndex].choice2
                                    ? isCorrect
                                    ? 'bg-green-500'
                                    : 'bg-red-500'
                                    : 'border-white'}  ${selectedChoice !== null ? 'opacity-50' : ''}`}
                                disabled={selectedChoice !== null || disabledChoiceIndex.includes(2)}
                                >

                                <Text className={`text-center text-sm font-semibold ${disabledChoiceIndex.includes(2)? 'text-gray-400' : 'text-white'}`}>{questionList[currentQuestionIndex].choice2ContentText}</Text>
                                </TouchableOpacity>
                                {fileUrls[currentQuestionIndex]?.choice2AudioUrl && questionList[currentQuestionIndex].choice2AudioPath !== null && (
                                        <TouchableOpacity onPress={() => {toggleSound(fileUrls[currentQuestionIndex].choice2AudioUrl, questionList[currentQuestionIndex].questionID)}}
                                        disabled={isPlaying} 
                                        style={{ opacity: isPlaying ? 0.5 : 1 }}>
                                        <SpeakerIcon className="h-5 w-5 ml-2 text-black" />
                                        </TouchableOpacity>
                                        )}
                            </View>
                            )}
                            {!disabledChoiceIndex.includes(3) && (
                            <View className="flex-row items-center py-2 px-4 border border-1 rounded-lg mb-4 w-[100%] border-white">
                                <TouchableOpacity 
                                onPress={() => checkAnswer(questionList[currentQuestionIndex].choice3 ?? 0)} 
                                className={`flex-1 py-2 px-4 border border-1 rounded-lg ${selectedChoice === questionList[currentQuestionIndex].choice3
                                    ? isCorrect
                                    ? 'bg-green-500'
                                    : 'bg-red-500'
                                    : 'border-white'}  ${disabledChoiceIndex.includes(3) || selectedChoice !== null ? 'opacity-50' : ''} `}
                                disabled={selectedChoice !== null ||disabledChoiceIndex.includes(3) }
                                >

                                <Text className={`text-center text-sm font-semibold ${disabledChoiceIndex.includes(3)? 'text-gray-400' : 'text-white'}`}>{questionList[currentQuestionIndex].choice3ContentText}</Text>
                                </TouchableOpacity>
                                {fileUrls[currentQuestionIndex]?.choice3AudioUrl && questionList[currentQuestionIndex].choice3AudioPath !== null && (
                                <TouchableOpacity onPress={() => {toggleSound(fileUrls[currentQuestionIndex].choice3AudioUrl, questionList[currentQuestionIndex].questionID)}}
                                disabled={isPlaying} 
                                style={{ opacity: isPlaying ? 0.5 : 1 }}>
                                <SpeakerIcon className="h-5 w-5 ml-2 text-black" />
                                </TouchableOpacity>
                                )}
                            </View>
                            )}
                            {!disabledChoiceIndex.includes(4) && (
                              <View className="flex-row items-center py-2 px-4 border border-1 rounded-lg mb-4 w-[100%] border-white">
                                <TouchableOpacity 
                                onPress={() => checkAnswer(questionList[currentQuestionIndex].choice4 ?? 0)} 
                                className={`flex-1 py-2 px-4 border border-1 rounded-lg ${selectedChoice === questionList[currentQuestionIndex].choice4
                                    ? isCorrect
                                    ? 'bg-green-500'
                                    : 'bg-red-500'
                                    : 'border-white'}  ${disabledChoiceIndex.includes(4) || selectedChoice !== null ? 'opacity-50' : ''} `}
                                disabled={selectedChoice !== null || disabledChoiceIndex.includes(4) }
                                >

                                <Text className={`text-center text-sm font-semibold ${disabledChoiceIndex.includes(4)? 'text-gray-400' : 'text-white'}`}>{questionList[currentQuestionIndex].choice4ContentText}</Text>
                                </TouchableOpacity>
                                {fileUrls[currentQuestionIndex]?.choice4AudioUrl && questionList[currentQuestionIndex].choice4AudioPath !== null && (
                                <TouchableOpacity onPress={() => {toggleSound(fileUrls[currentQuestionIndex].choice4AudioUrl, questionList[currentQuestionIndex].questionID)}}
                                disabled={isPlaying} 
                                style={{ opacity: isPlaying ? 0.5 : 1 }}>
                                <SpeakerIcon className="h-5 w-5 ml-2 text-black" />
                                </TouchableOpacity>
                                )}
                            </View>
                            )}
                        </View>
                        )}

                        {(questionList[currentQuestionIndex].questionTypeID === 3 || questionList[currentQuestionIndex].questionTypeID === 4) && (
                            <View className="bg-white rounded-lg shadow-md p-3 mt-4">
                                <Text className="text-center text-lg font-semibold mb-2">Choose the Correct Word</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ flex: 1, paddingRight: 10 }}>
                                        {[
                                            questionList[currentQuestionIndex].word1ContentText,
                                            questionList[currentQuestionIndex].word2ContentText,
                                            questionList[currentQuestionIndex].word3ContentText,
                                            questionList[currentQuestionIndex].word4ContentText,
                                        ].map((word, idx) => (
                                            <TouchableOpacity key={idx} className="border border-gray-300 rounded-lg mb-1 bg-gray-100 hover:bg-gray-200 p-1">
                                                <Text className="text-center text-sm text-black">{word}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        {matches.map((match, index) => (
                                            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                                <TouchableOpacity onPress={() => moveUp(index)} className="bg-blue-500 p-1 rounded-lg mr-1">
                                                    <Text className="text-xs text-white">UP</Text>
                                                </TouchableOpacity>
                                                <Text style={{ marginHorizontal: 5, fontSize: 12, fontWeight: '500', color: '#333', padding: 2 }}>{match}</Text>
                                                <TouchableOpacity onPress={() => moveDown(index)} className="bg-red-500 p-1 rounded-lg ml-1">
                                                    <Text className="text-xs text-white">DOWN</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                    )}

                <View className="absolute bottom-5 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                    <View className="flex-row justify-center gap-2 w-[100%]">
                    {powerUps.map((powerUp, index) => {
                            const imageUrl = getImageUrlByItemId(powerUp.itemId); 
                            return (
                                <TouchableOpacity key={index} onPress={() => usePowerUp(powerUp)} disabled={selectedChoice !== null}>
                                <View className="py-2 px-1 items-center relative">
                                    {imageUrl ? (
                                    <Image
                                        source={{ uri: imageUrl }} 
                                        className = "w-10 h-10"
                                    />
                                    ) : null}
                                    <Text className="text-center text-[10px] text-black font-bold bg-gray-200 p-1 rounded-full absolute right-1 bottom-1">
                                    {powerUp.quantity}x
                                    </Text>
                                </View>
                                </TouchableOpacity>
                            );
                            })}
                    </View>
                    <Modal
                        transparent={true}
                        visible={showHeartPopup}
                        animationType="fade"
                        onRequestClose={() => setShowHeartPopup(false)}
                    >
                        <View className="flex-1 justify-center items-center bg-black/40">
                            <View className="bg-white p-6 rounded-full shadow-lg scale-105">
                                <HeartIcon className="h-12 w-12 text-red-500" />
                            </View>
                        </View>
                    </Modal>
                </View>
                </>
            )}
            </LinearGradient>
        </SafeAreaView>
    )
};
export default UnitContent;
