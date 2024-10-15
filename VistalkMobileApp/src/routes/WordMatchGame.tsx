import React, { useState, useRef } from 'react';
import { View, Text, PanResponder, Animated, StyleSheet, Dimensions } from 'react-native';

export default function WordMatchGame() {
    const [leftWords] = useState<string[]>(['Word1', 'Word2', 'Word3', 'Word4']);
    const [rightWords, setRightWords] = useState<string[]>(['Match1', 'Match2', 'Match3', 'Match4']);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

    const swapWords = (dragIndex: number, dropIndex: number) => {
        if (dropIndex < 0 || dropIndex >= rightWords.length) return;
        let newRightWords = [...rightWords];
        [newRightWords[dragIndex], newRightWords[dropIndex]] = [newRightWords[dropIndex], newRightWords[dragIndex]];
        setRightWords(newRightWords);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Drag and Drop the Correct Word</Text>

            <View style={styles.rowContainer}>
                {/* Left Words */}
                <View style={styles.leftColumn}>
                    {leftWords.map((word, idx) => (
                        <Text key={idx} style={styles.wordBox}>{word}</Text>
                    ))}
                </View>

                {/* Right Words with Drag and Drop */}
                <View style={styles.rightColumn}>
                    {rightWords.map((word, index) => (
                        <DraggableWord
                            key={index}
                            index={index}
                            word={word}
                            swapWords={swapWords}
                            draggingIndex={draggingIndex}
                            setDraggingIndex={setDraggingIndex}
                        />
                    ))}
                </View>
            </View>
        </View>
    );
}

type DraggableWordProps = {
    word: string;
    index: number;
    swapWords: (dragIndex: number, dropIndex: number) => void;
    draggingIndex: number | null;
    setDraggingIndex: (index: number | null) => void;
};

function DraggableWord({ word, index, swapWords, draggingIndex, setDraggingIndex }: DraggableWordProps) {
    const pan = useRef(new Animated.ValueXY()).current;
    const offset = useRef({ x: 0, y: 0 }).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                setDraggingIndex(index);
                pan.setOffset(offset);
                pan.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (e, gestureState) => {
                pan.flattenOffset(); 
                const dropIndex = calculateDropIndex(gestureState.moveY);
                swapWords(index, dropIndex);
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
                    transform: pan.getTranslateTransform(), // Ensure transform applies correctly
                    zIndex: draggingIndex === index ? 2 : 1,
                    opacity: draggingIndex === index ? 0.8 : 1,
                    backgroundColor: draggingIndex === index ? '#d1d5db' : '#f3f4f6',
                },
            ]}
        >
            <Text style={styles.wordText}>{word}</Text>
        </Animated.View>
    );
}

function calculateDropIndex(moveY: number): number {
    const screenHeight = Dimensions.get('window').height;
    const wordHeight = screenHeight / 6;
    return Math.floor(moveY / wordHeight);
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
