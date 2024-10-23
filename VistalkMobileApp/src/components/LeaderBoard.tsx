import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { LeaderBoardDto } from '../routes/type';
import { getLeaderBoards, getSelfRank, getUserImageUrl } from '../routes/repo';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LeaderboardProps {
  onCloseLeaderBoard: () => void;
}

interface FileUrl {
  index: number;
  url: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onCloseLeaderBoard }) => {
  const [leaderboardData, setLeaderBoardData] = useState<LeaderBoardDto[]>([]);
  const [fileUrl, setFileUrl] = useState<FileUrl[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const userIdString = await AsyncStorage.getItem('userID');
        if(userIdString){
          const userId = parseInt(userIdString, 10); 
          const result = await getLeaderBoards();
          const top10Data = result.data.slice(0, 10); 
          setLeaderBoardData(top10Data);

          top10Data.forEach((user, index) => {
            if (user.imagePath) {
              const userImageUrl = getUserImageUrl(user.imagePath);
              setFileUrl(prevFileUrl => [...prevFileUrl, { index, url: userImageUrl }]);
            }
          });
          const isUserInTop10 = top10Data.some(user => user.id === userId);
          if (!isUserInTop10) {
            const userRankResult = await getSelfRank(userId); 
            setUserRank(userRankResult.data);
          }
      }
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };

    fetchLeaderboardData();
  }, []);

  const getBorderColor = (rank: number) => {
    switch (rank) {
      case 0:
        return '#FFD700'; 
      case 1:
        return '#C0C0C0'; 
      case 2:
        return '#CD7F32'; 
      default:
        return '#6addd0'; 
    }
  };

  const renderUserRow = (index: number, user: LeaderBoardDto, imageUrl: any) => (
    <View
      key={index}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        marginBottom: 8,
        backgroundColor: '#ffffff',
        borderRadius: 10,
      }}
    >
      <Text style={{ color: '#6addd0', fontWeight: 'bold', width: '15%', textAlign: 'center' }}>
        {index + 1}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl}
          style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8 }}
        />
        <Text style={{ color: '#6addd0' }}>{user.name}</Text>
      </View>

      <Text style={{ color: '#6addd0', width: '25%', textAlign: 'right' }}>{user.totalScoreWeekly || 0}</Text>
    </View>
  );

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="slide"
      onRequestClose={onCloseLeaderBoard}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000080' }}>
        <View style={{ width: '80%', backgroundColor: 'white', borderRadius: 20, padding: 16 }}>
          <TouchableOpacity
            onPress={onCloseLeaderBoard}
            style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}
          >
            <Text style={{ fontSize: 18, color: 'black', fontWeight: 'bold' }}>X</Text>
          </TouchableOpacity>

          <Text style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold', marginBottom: 12, color: 'black' }}>
            LEADERBOARD
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 }}>
              {leaderboardData.length > 1 && (
                <View style={{ alignItems: 'center', justifyContent: 'flex-end', position: 'relative' }}>
                  <View style={{ height: 64, justifyContent: 'flex-end' }}> 
                    <Image
                          source={
                            fileUrl.find(file => file.index === 1)?.url 
                            ? { uri: fileUrl.find(file => file.index === 1)?.url } 
                            : require('../assets/cebuano.png')
                          }   
                        style={{
                        width: 48,  
                        height: 48,
                        borderRadius: 24,
                        borderWidth: 3,
                        borderColor: getBorderColor(1),
                      }}
                    />
                  </View>
                  <View
                      style={{
                        position: 'absolute',
                        top: 56,
                        backgroundColor: getBorderColor(1),
                        width: 15,
                        height: 15,
                        borderRadius: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                        <Text className="text-xs" style={{ color: 'white', fontWeight: 'bold'}}>2</Text>
                  </View>
                  <Text style={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}>{leaderboardData[1].name}</Text>
                  <Text style={{ color: 'black', textAlign: 'center' }}>{leaderboardData[1].totalScoreWeekly || 0}</Text>
                </View>
              )}

              {leaderboardData.length > 0 && (
                <View style={{ alignItems: 'center', justifyContent: 'flex-end', position: 'relative' }}>
                  <View style={{ height: 64, justifyContent: 'flex-end' }}>
                    <Image
                      source={
                        fileUrl.find(file => file.index === 0)?.url 
                        ? { uri: fileUrl.find(file => file.index === 0)?.url } 
                        : require('../assets/cebuano.png')
                      }        
                      style={{
                        width: 64,  
                        height: 64,
                        borderRadius: 32,
                        borderWidth: 3,
                        borderColor: getBorderColor(0),
                      }}
                    />
                  </View>
                  <View
                      style={{
                        position: 'absolute',
                        top: 54,
                        backgroundColor: getBorderColor(0),
                        width: 15,
                        height: 15,
                        borderRadius: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                        <Text className="text-xs" style={{ color: 'white', fontWeight: 'bold'}}>1</Text>
                  </View>
                  <Text style={{ color: 'black', fontWeight: 'bold', textAlign: 'center', marginTop: 4 }}>{leaderboardData[0].name}</Text>
                  <Text style={{ color: 'black', textAlign: 'center' }}>{leaderboardData[0].totalScoreWeekly || 0}</Text>
                </View>
              )}

              {leaderboardData.length > 2 && (
                <View style={{ alignItems: 'center', justifyContent: 'flex-end', position: 'relative' }}>
                  <View style={{ height: 64, justifyContent: 'flex-end' }}> 
                    <Image
                        source={
                          fileUrl.find(file => file.index === 2)?.url 
                          ? { uri: fileUrl.find(file => file.index ===2)?.url } 
                          : require('../assets/cebuano.png')
                        }   
                      style={{
                        width: 48,  
                        height: 48,
                        borderRadius: 24,
                        borderWidth: 3,
                        borderColor: getBorderColor(2),
                      }}
                    />
                  </View>

                  <View
                      style={{
                        position: 'absolute',
                        top: 56,
                        backgroundColor: getBorderColor(2),
                        width: 15,
                        height: 15,
                        borderRadius: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                        <Text className="text-xs" style={{ color: 'white', fontWeight: 'bold'}}>3</Text>
                  </View>
                  <Text style={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}>{leaderboardData[2].name}</Text>
                  <Text style={{ color: 'black', textAlign: 'center' }}>{leaderboardData[2].totalScoreWeekly || 0}</Text>
                </View>
              )}
            </View>

          <ScrollView style={{ maxHeight: 200 }}>
            {leaderboardData.slice(3).map((entry, index) => {
              const imageUrl = fileUrl.find(file => file.index === index + 3)?.url || require('../assets/cebuano.png');
              return renderUserRow(index + 3, entry, imageUrl);
            })}
          </ScrollView>
          
          {userRank && typeof userRank === 'number' && (
            <View style={{ marginTop: 16, alignItems: 'center' }}>
              <Text style={{ color: '#6addd0', fontWeight: 'bold' }}>
                Your Rank: {userRank}
              </Text>
            </View>
          )}

        </View>
      </View>
    </Modal>
  );
};

export default Leaderboard;
