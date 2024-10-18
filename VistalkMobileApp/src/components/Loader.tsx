import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, Dimensions } from 'react-native';

const Loader = () => {
    const rotation = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Rotate animation
        const rotateAnimation = Animated.loop(
            Animated.timing(rotation, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        );

        // Scale animation
        const scaleAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(scale, {
                    toValue: 1.2,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(scale, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );

        rotateAnimation.start();
        scaleAnimation.start();

        return () => {
            rotateAnimation.stop();
            scaleAnimation.stop();
        };
    }, [rotation, scale]);

    const rotationInterpolation = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.loaderContainer}>
            <Animated.View
                style={[
                    styles.animatedShape,
                    { transform: [{ rotate: rotationInterpolation }, { scale }] },
                ]}
            />
            <Animated.View
                style={[
                    styles.animatedShape,
                    styles.secondShape,
                    { transform: [{ rotate: rotationInterpolation }, { scale }] },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Fullscreen dark background
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    animatedShape: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(0, 122, 255, 0.5)', // Semi-transparent blue
        position: 'absolute',
    },
    secondShape: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white
        position: 'absolute',
    },
});

export default Loader;
