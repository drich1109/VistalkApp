import React, { useState, useRef } from 'react';
import { View, Text, PanResponder, Animated, StyleSheet } from 'react-native';

const WordMatchGame: React.FC = () => {
    const [leftWords] = useState<string[]>(['Word1', 'Word2', 'Word3', 'Word4']);
    const [rightWords, setRightWords] = useState<string[]>(['Match1', 'Match2', 'Match3', 'Match4']);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const animatedValues = useRef(rightWords.map(() => new Animated.Value(0))).current;

    const swapWords = (dragIndex: number, dropIndex: number) => {
        if (dropIndex < 0 || dropIndex >= rightWords.length || dragIndex === dropIndex) return;

        setRightWords((prevRightWords) => {
            const newRightWords = [...prevRightWords];
            [newRightWords[dragIndex], newRightWords[dropIndex]] = [newRightWords[dropIndex], newRightWords[dragIndex]];
            return newRightWords;
        });

        animateWords(dragIndex, dropIndex);
    };

    const animateWords = (dragIndex: number, dropIndex: number) => {
        const moveDistance = dropIndex > dragIndex ? -50 : 50; // Adjust the distance based on direction
        const animations = animatedValues.map((value, index) => {
            return Animated.timing(value, {
                toValue: index === dragIndex ? moveDistance : (index === dropIndex ? -moveDistance : 0),
                duration: 200,
                useNativeDriver: true,
            });
        });

        Animated.parallel(animations).start(() => {
            animatedValues.forEach((value) => value.setValue(0)); // Reset positions after animation
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Drag and Drop the Correct Word</Text>
            <View style={styles.rowContainer}>
                <View style={styles.leftColumn}>
                    {leftWords.map((word, idx) => (
                        <Text key={idx} style={styles.wordBox}>{word}</Text>
                    ))}
                </View>
                <View style={styles.rightColumn}>
                    {rightWords.map((word, index) => (
                        <DraggableWord
                            key={index}
                            index={index}
                            word={word}
                            swapWords={swapWords}
                            draggingIndex={draggingIndex}
                            setDraggingIndex={setDraggingIndex}
                            animatedValue={animatedValues[index]}
                        />
                    ))}
                </View>
            </View>
        </View>
    );
};

type DraggableWordProps = {
    word: string;
    index: number;
    swapWords: (dragIndex: number, dropIndex: number) => void;
    draggingIndex: number | null;
    setDraggingIndex: (index: number | null) => void;
    animatedValue: Animated.Value;
};

const DraggableWord: React.FC<DraggableWordProps> = ({ word, index, swapWords, draggingIndex, setDraggingIndex, animatedValue }) => {
    const pan = useRef(new Animated.ValueXY()).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                setDraggingIndex(index);
                pan.setOffset({ x: 0, y: 0 });
                pan.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: (e, gestureState) => {
                pan.setValue({ x: gestureState.dx, y: gestureState.dy });
                const dropIndex = calculateDropIndex(gestureState.moveY);
                if (dropIndex !== null && dropIndex !== draggingIndex) {
                    swapWords(index, dropIndex);
                }
            },
            onPanResponderRelease: (e, gestureState) => {
                pan.flattenOffset();
                const dropIndex = calculateDropIndex(gestureState.moveY);
                if (dropIndex !== null) {
                    swapWords(index, dropIndex);
                }
                setDraggingIndex(null);
                Animated.spring(pan, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: false,
                }).start();
            },
        })
    ).current;

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[
                styles.draggable,
                {
                    transform: [{ translateY: Animated.add(animatedValue, pan.y) }],
                    zIndex: draggingIndex === index ? 2 : 1,
                    opacity: draggingIndex === index ? 0.8 : 1,
                },
            ]}
        >
            <Text style={styles.wordText}>{word}</Text>
        </Animated.View>
    );
};

function calculateDropIndex(moveY: number): number | null {
    const dropThresholds = [150, 180, 240]; // Define your thresholds here
    for (let i = 0; i < dropThresholds.length; i++) {
        if (moveY < dropThresholds[i]) {
            return i;
        }
    }
    return dropThresholds.length; // Return the last index if it exceeds the last threshold
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        marginTop: 40,
    },
    title: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    leftColumn: {
        flex: 1,
        paddingRight: 10,
    },
    rightColumn: {
        flex: 1,
    },
    wordBox: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#f0f0f0',
        marginBottom: 10,
        textAlign: 'center',
    },
    draggable: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
    },
    wordText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#000',
    },
});

// Export the main component
export default WordMatchGame;
