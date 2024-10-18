import React, { Component, createRef } from 'react';
import {
    View,
    FlatList,
    Text,
    ListRenderItemInfo,
    Button,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DraxProvider, DraxList, DraxViewDragStatus } from 'react-native-drax';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface Item {
    id: number;  
    name: string;
}

interface MatchComponentProps {
    fixedItems: string[];
    draggableItems: Item[];
    onSubmit: (reorderedItems: Item[]) => void;
    showCorrectAnswer: boolean; 
    questionList: Array<any>; 
    currentQuestionIndex: number;
    clairVoyanceUsed: boolean;
    clairVoyageDone:() => void;
    isLoading:boolean;
}

interface MatchComponentState {
    draggableData: Item[]; 
    results: boolean[]; 
}

class MatchComponent extends Component<MatchComponentProps, MatchComponentState> {
    private listRef = createRef<FlatList<Item>>();

    constructor(props: MatchComponentProps) {
        super(props);
        this.state = {
            draggableData: this.jumbleArray(props.draggableItems),
            results: new Array(props.fixedItems.length).fill(false),
        };
    }

    jumbleArray(array: Item[]): Item[] {
        return array.sort(() => Math.random() - 0.5);
    }

    handleItemReorder = ({ fromIndex, fromItem, toIndex }: { fromIndex: number; fromItem: Item; toIndex: number }) => {
        const newData = [...this.state.draggableData];
        newData.splice(toIndex, 0, newData.splice(fromIndex, 1)[0]);
        this.setState({ draggableData: newData });
        if (this.props.clairVoyanceUsed) {
            this.props.clairVoyageDone();
        }
    };

    handleSubmit = () => {
        this.props.onSubmit(this.state.draggableData); 
    };
    
    checkAnswer = () => {
        const { draggableData } = this.state; 
        const { questionList, currentQuestionIndex } = this.props;
        const currentQuestion = questionList[currentQuestionIndex];
    
        const newResults = draggableData.map((item, index) => 
            currentQuestion[`match${index + 1}`] === item.id
        );
    
        this.setState({ results: newResults }); 
    };

    componentDidUpdate(prevProps: MatchComponentProps) {
        if (this.props.clairVoyanceUsed && !prevProps.clairVoyanceUsed) {
            this.checkAnswer(); 
        }
    }

    render() {
        const { fixedItems } = this.props;
        const { draggableData, results } = this.state;

        return (
            <GestureHandlerRootView style={{ flex: 1 }}>
                <DraxProvider>
                    <SafeAreaView style={{ flex: 1, width: '100%' }}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <View style={{ flex: 1, paddingRight: 8 }}>
                                <FlatList
                                    data={fixedItems}
                                    renderItem={({ item, index }: ListRenderItemInfo<string>) => (
                                        <View style={{ flexDirection: 'row', alignItems: 'center', margin: 4 }}>
                                            {this.props.showCorrectAnswer && (
                                                <Text style={{ color: 'white', marginRight: 8 }}>
                                                    {results[index] ? '✔️' : '❌'}
                                                </Text>
                                            )}
                                            <View style={{ padding: 12, backgroundColor: 'transparent', borderRadius: 8, borderWidth: 1, borderColor: 'white', flex: 1 }}>
                                                <Text style={{ color: 'white' }}>{item}</Text>
                                            </View>
                                        </View>
                                    )}
                                    keyExtractor={(item) => item}
                                    style={{ width: '100%' }}
                                />
                            </View>

                            <View style={{ flex: 1, paddingLeft: 8 }}>
                                <DraxList
                                    ref={this.listRef}
                                    data={draggableData}
                                    renderItemContent={({ item }, { viewState }) => (
                                        <View
                                            style={{
                                                padding: 12,
                                                backgroundColor: 'transparent',
                                                borderRadius: 8,
                                                margin: 4,
                                                borderWidth: 1,
                                                borderColor: 'white',
                                                ...(viewState?.dragStatus === DraxViewDragStatus.Dragging ? { borderWidth: 2, borderColor: 'blue' } : {})
                                            }}
                                        >
                                            <Text style={{ color: 'white' }}>{item.name}</Text> 
                                        </View>
                                    )}
                                    onItemReorder={this.handleItemReorder}
                                    keyExtractor={(item) => item.id.toString()} 
                                    style={{ width: '100%' }}
                                />
                            </View>
                        </View>
                        <View style={{ padding: 16 }} className="mb-64">
                            <Button title="Submit" onPress={this.handleSubmit} disabled={this.props.isLoading} color="blue" />
                        </View>
                    </SafeAreaView>
                </DraxProvider>
            </GestureHandlerRootView>
        );
    }
}

export default MatchComponent;
