import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, Animated, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type LoaderProps = {
  isVisible: boolean;
  message?: string; // Optional message
};

const Loader: React.FC<LoaderProps> = ({ isVisible, message }) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [isVisible]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal transparent={true} visible={isVisible}>
      <View style={styles.fullScreen}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <View style={styles.donutContainer}>
            <LinearGradient colors={['#6addd0', '#f7c188']} style={styles.donut} />
            <View style={styles.innerCircle} />
          </View>
        </Animated.View>
        {message && <Text style={styles.messageText}>{message}</Text>}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Solid white background
  },
  donutContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    position: 'relative',
  },
  donut: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: 'transparent',
    borderTopColor: 'transparent',
  },
  innerCircle: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  messageText: {
    marginTop: 10,
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Loader;
