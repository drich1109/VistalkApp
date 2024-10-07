import { Animated, Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import BackIcon from "../assets/svg/BackIcon";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import ClockIcon from "../assets/svg/ClockIcon";
import { useEffect, useRef, useState } from "react";
import HeartIcon from "../assets/svg/HeartIcon";
import BlackHeartIcon from "../assets/svg/BlackHeartIcon";
import SettingIcon from "../assets/svg/SettingIcon";
import SpeakerIcon from "../assets/svg/SpeakerIcon";

type Props = StackScreenProps<RootStackParamList, 'UnitContent'>;

const UnitContent: React.FC<Props> = ({ navigation }) => {
    const [timeLeft, setTimeLeft] = useState(15); // Initialize countdown starting from 15 seconds
    const rotateAnimation = useRef(new Animated.Value(0)).current;
    const scaleAnimation = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Countdown function, decreasing timeLeft every second
        if (timeLeft > 0) {
            const timerId = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);

            // Clear the timer when the component unmounts or time reaches 0
            return () => clearInterval(timerId);
        }
    }, [timeLeft]);

    useEffect(() => {
        if (timeLeft <= 5 && timeLeft > 0) {
            // Start rotate and scale animation when timeLeft is below 5
            Animated.loop(
                Animated.parallel([
                    // Tilt (rotate) animation
                    Animated.sequence([
                        Animated.timing(rotateAnimation, { toValue: 1, duration: 150, useNativeDriver: true }),
                        Animated.timing(rotateAnimation, { toValue: -1, duration: 150, useNativeDriver: true }),
                        Animated.timing(rotateAnimation, { toValue: 0, duration: 150, useNativeDriver: true }),
                    ]),
                    // Pulse (enlarge) animation
                    Animated.sequence([
                        Animated.timing(scaleAnimation, { toValue: 1.2, duration: 150, useNativeDriver: true }),
                        Animated.timing(scaleAnimation, { toValue: 1, duration: 150, useNativeDriver: true }),
                    ]),
                ])
            ).start();
        } else {
            // Reset animation values and stop animation
            rotateAnimation.setValue(0);
            scaleAnimation.setValue(1);
            rotateAnimation.stopAnimation();
            scaleAnimation.stopAnimation();
        }
    }, [timeLeft]);

    // Rotate interpolation between -40 and 40 degrees
    const rotation = rotateAnimation.interpolate({
        inputRange: [-1, 1],
        outputRange: ['-40deg', '40deg'],
    });

    return (
        <SafeAreaView className="flex-1">
            <LinearGradient colors={['#6addd0', '#7fc188']} className="flex-1 justify-center items-center">
                <View className="absolute top-0 w-full flex-row justify-between items-center px-5" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                    <TouchableOpacity className="" onPress={() => navigation.goBack()}>
                        <BackIcon className="w-8 h-8 text-white" />
                    </TouchableOpacity>
                    <Text className="text-base font-bold text-white text-center mr-8 flex-1">Section 1 - Unit 1</Text>
                </View>
                <View className="absolute top-12 items-center">
                    <View className="flex-row items-center gap-44 mb-4">
                        <View className="relative items-center justify-center">
                            <Animated.View className="relative items-center justify-center" style={{
                                transform: [
                                    { rotate: rotation },
                                    { scale: scaleAnimation }
                                ]
                            }}
                            >
                                <ClockIcon className="h-10 w-10 text-white" />
                            </Animated.View>
                            <Text className="absolute text-white bottom-2 text-xl font-bold">{timeLeft}</Text>
                        </View>
                        <View className="flex-row gap-1">
                            <HeartIcon className="h-6 w-6" />
                            <HeartIcon className="h-6 w-6" />
                            <BlackHeartIcon className="h-6 w-6" />
                        </View>
                    </View>
                </View>
                {/* <View className="bg-white items-center rounded-xl py-3 px-4 w-[80%]">
                    <Text className="text-black text-center font-bold text-xl">This question addresses language structure, linguistic relativity, the effects of language learning, and the factors influencing language evolution.</Text>
                    <Text className="text-black text-center font-bold text-xl">Listen to the word. Tap the speacker button. </Text>
                    <TouchableOpacity className="mt-2">
                        <SpeakerIcon className="h-4 w-4 text-black" />
                    </TouchableOpacity>
                    <Image source={require('../assets/Teal.png')} className="w-14 h-14 mt-2" />
                </View> */}
                


                
                {/*  <View className="w-3/4">
                    <View className="mt-6 mb-4 items-center">
                        <TouchableOpacity className="py-3 px-5 mb-4 w-[100%] border border-1 rounded-lg border-white bg-red-600">
                            <Text className="text-center text-xl text-white font-semibold  ">Pangalan</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="py-3 px-5 mb-4 w-[100%] border border-1 rounded-lg border-white bg-[#80C758]">
                            <Text className="text-center text-xl text-white font-semibold ">Maayu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="py-3 px-5 mb-4 w-[100%] border border-1 rounded-lg border-white">
                            <Text className="text-center text-xl text-white font-semibold">Maayong adlaw</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="py-3 px-5 mb-4 w-[100%] border border-1 rounded-lg border-white">
                            <Text className="text-center text-xl text-white font-semibold ">Kamusta</Text>
                        </TouchableOpacity>
                    </View>
                </View> */}
                <View className="absolute bottom-5 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                    <View className="flex-row justify-center gap-2 w-[100%]">
                        <TouchableOpacity>
                            <View className="py-2 px-1 items-center relative">
                                <Image source={require('../assets/Red.png')} className="w-10 h-10" />
                                <Text className="text-center text-[10px] text-black font-bold bg-gray-200 p-1 rounded-full absolute right-1 bottom-1">10x</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View className="py-2 px-1 items-center relative">
                                <Image source={require('../assets/Teal.png')} className="w-10 h-10" />
                                <Text className="text-center text-[10px] text-black font-bold bg-gray-200 p-1 rounded-full absolute right-1 bottom-1">10x</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View className=" py-2 px-1 items-center relative">
                                <Image source={require('../assets/Blue.png')} className="w-10 h-10" />
                                <Text className="text-center text-[10px] text-black font-bold bg-gray-200 p-1 rounded-full absolute right-1 bottom-1">10x</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View className="py-2 px-1 items-center relative">
                                <Image source={require('../assets/Yellow.png')} className="w-10 h-10" />
                                <Text className="text-center text-[10px] text-black font-bold bg-gray-200 p-1 rounded-full absolute right-1 bottom-1">10x</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};
export default UnitContent;