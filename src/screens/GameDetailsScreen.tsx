import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, FlatList, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { getGameDetails, makeReservation, cancelReservation, shuffleTeams, fetchChatMessages, sendMessage } from '../services/api';

type RootStackParamList = {
  GameDetails: { gameId: number; token: string };
};

type GameDetailsScreenRouteProp = RouteProp<RootStackParamList, 'GameDetails'>;

interface Message {
  username: string;
  sender_id: number;
  content: string;
  timestamp: string;
  message_id: number;
}

const GameDetailsScreen: React.FC = () => {
  const route = useRoute<GameDetailsScreenRouteProp>();
  const { gameId, token } = route.params;
  const [gameDetails, setGameDetails] = useState<any | null>(null);
  const [isUserJoined, setIsUserJoined] = useState(false);
  const [shuffleResults, setShuffleResults] = useState<{ team1: string[]; team2: string[] }>({ team1: [], team2: [] });
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const flatListRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const details = await getGameDetails(gameId.toString(), token);
        setGameDetails(details);
        setIsUserJoined(details.has_reserved);
      } catch (error) {
        console.error('Error fetching game details:', error);
        Alert.alert('Error', 'Unable to fetch game details');
      }
    };

    fetchGameDetails();
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [gameId]);

  const loadMessages = async () => {
    try {
      const fetchedMessages = await fetchChatMessages(gameId, token);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleShuffle = async (shuffleType: 'random' | 'level') => {
    try {
      const response = await shuffleTeams(gameId, shuffleType, token);
      if (response) {
        setShuffleResults(response);
        Alert.alert('Success', `${shuffleType.charAt(0).toUpperCase() + shuffleType.slice(1)} shuffle completed`);
      } else {
        Alert.alert('Failed', 'Shuffle failed');
      }
    } catch (error) {
      console.error('Error shuffling teams:', error);
      Alert.alert('Error', 'Unable to shuffle teams');
    }
  };

  const handleJoinGame = async () => {
    try {
      const response = await makeReservation(gameId, token);
      if (response.message === 'Reservation successful') {
        Alert.alert('Success', 'You have successfully joined the game!');
        setIsUserJoined(true);
        setGameDetails({ ...gameDetails, players_joined: gameDetails.players_joined + 1 });
      } else {
        Alert.alert('Failed', response.message);
      }
    } catch (error) {
      console.error('Error joining game:', error);
      Alert.alert('Error', 'Unable to join game');
    }
  };

  const handleUnjoinGame = async () => {
    try {
      const response = await cancelReservation(gameId, token);
      if (response.message === 'Reservation deleted') {
        Alert.alert('Success', 'You have successfully unjoined the game!');
        setIsUserJoined(false);
        setGameDetails({ ...gameDetails, players_joined: gameDetails.players_joined - 1 });
      } else {
        Alert.alert('Failed', response.message);
      }
    } catch (error) {
      console.error('Error unjoining game:', error);
      Alert.alert('Error', 'Unable to unjoin game');
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      try {
        await sendMessage(gameId, inputMessage.trim(), token);
        setInputMessage('');
        await loadMessages();
      } catch (error) {
        console.error('Error sending message:', error);
        Alert.alert('Error', 'Failed to send message. Please try again.');
      }
    }
  };

  const getColorForUsername = (username: string) => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33F1', '#33FFF1', '#F1FF33'];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={styles.messageContainer}>
      <Text style={[styles.username, { color: getColorForUsername(item.username) }]}>{item.username}:</Text>
      <Text style={styles.messageText}>{item.content}</Text>
    </View>
  );

  if (!gameDetails) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <FlatList
        data={[{ key: 'details' }]}
        renderItem={() => (
          <>
            <View style={styles.detailsContainer}>
              <Text style={styles.title}>{gameDetails.name}</Text>
              <Text>Location: {gameDetails.location}</Text>
              <Text>Price: ${gameDetails.price}</Text>
              <Text>Available Seats: {gameDetails.available_seats}</Text>
              <Text>Category: {gameDetails.category}</Text>
              <Text>Level: {gameDetails.level}</Text>
              <Text>Date: {gameDetails.start_time.split(' ')[0]}</Text>
              <Text>Time: {`${gameDetails.start_time.split(' ')[1]} - ${gameDetails.end_time.split(' ')[1]}`}</Text>
              <Text>Players Joined: {gameDetails.players_joined}</Text>
              
              {isUserJoined ? (
                <TouchableOpacity style={styles.joinButton} onPress={handleUnjoinGame}>
                  <Text style={styles.joinButtonText}>Unjoin Game</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.joinButton} onPress={handleJoinGame}>
                  <Text style={styles.joinButtonText}>Join Game</Text>
                </TouchableOpacity>
              )}
              
              <View style={styles.shuffleButtonsContainer}>
                <TouchableOpacity style={styles.shuffleButton} onPress={() => handleShuffle('random')}>
                  <Text style={styles.shuffleButtonText}>Random Shuffle</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shuffleButton} onPress={() => handleShuffle('level')}>
                  <Text style={styles.shuffleButtonText}>Level-based Shuffle</Text>
                </TouchableOpacity>
              </View>
              
              {shuffleResults.team1.length > 0 && (
                <View style={styles.resultsContainer}>
                  <Text style={styles.resultsTitle}>Team 1:</Text>
                  {shuffleResults.team1.map((player, index) => (
                    <Text key={index}>{player}</Text>
                  ))}
                  <Text style={styles.resultsTitle}>Team 2:</Text>
                  {shuffleResults.team2.map((player, index) => (
                    <Text key={index}>{player}</Text>
                  ))}
                </View>
              )}
            </View>
            
            <View style={styles.chatContainer}>
              <Text style={styles.chatTitle}>Game Chat</Text>
              <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.message_id.toString()}
                style={styles.chatList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              />
            </View>
          </>
        )}
        keyExtractor={() => 'details'}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  detailsContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  joinButton: {
    backgroundColor: '#FF5733',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginTop: 16,
  },
  joinButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  shuffleButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  shuffleButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
  },
  shuffleButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  resultsContainer: {
    marginTop: 20,
  },
  resultsTitle: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  chatContainer: {
    height: 300, // Adjust this value as needed
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    padding: 16,
  },
  chatList: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  messageContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  username: {
    fontWeight: 'bold',
  },
  messageText: {
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: 'white',
  },
});

export default GameDetailsScreen;