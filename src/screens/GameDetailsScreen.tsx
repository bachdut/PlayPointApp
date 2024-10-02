import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, FlatList, Dimensions, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { RouteProp, useRoute, useIsFocused } from '@react-navigation/native';
import { getGameDetails, makeReservation, cancelReservation, shuffleTeams, fetchChatMessages, sendMessage } from '../services/api';
import Icon from 'react-native-vector-icons/Ionicons';

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

const ChatSection: React.FC<{
  messages: Message[];
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
  flatListRef: React.RefObject<FlatList<Message>>;
}> = ({ messages, inputMessage, setInputMessage, handleSendMessage, flatListRef }) => (
  <>
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
  </>
);

const GameDetailsScreen: React.FC = () => {
  const route = useRoute<GameDetailsScreenRouteProp>();
  const { gameId, token } = route.params;
  const [gameDetails, setGameDetails] = useState<any | null>(null);
  const [isUserJoined, setIsUserJoined] = useState(false);
  const [shuffleResults, setShuffleResults] = useState<{ team1: string[]; team2: string[] }>({ team1: [], team2: [] });
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const flatListRef = useRef<FlatList<Message>>(null);
  const isFocused = useIsFocused();

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
  }, [gameId, token]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isFocused && isUserJoined) {
      loadMessages();
      interval = setInterval(loadMessages, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isFocused, isUserJoined, gameId, token]);

  const loadMessages = async () => {
    if (!isUserJoined) return;

    try {
      const fetchedMessages = await fetchChatMessages(gameId, token);
      setMessages(fetchedMessages);
      flatListRef.current?.scrollToEnd({ animated: true });
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
        loadMessages();
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
        setMessages([]);
      } else {
        Alert.alert('Failed', response.message);
      }
    } catch (error) {
      console.error('Error unjoining game:', error);
      Alert.alert('Error', 'Unable to unjoin game');
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() && isUserJoined) {
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

  if (!gameDetails) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.detailsContainer}>
            <Text style={styles.title}>{gameDetails.name}</Text>
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Icon name="location-outline" size={24} color="#1E90FF" />
                <Text style={styles.infoText}>{gameDetails.location}</Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="cash-outline" size={24} color="#32CD32" />
                <Text style={styles.infoText}>${gameDetails.price}</Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="people-outline" size={24} color="#FF6347" />
                <Text style={styles.infoText}>{gameDetails.available_seats} seats available</Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="football-outline" size={24} color="#FFA500" />
                <Text style={styles.infoText}>{gameDetails.category}</Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="stats-chart-outline" size={24} color="#8A2BE2" />
                <Text style={styles.infoText}>{gameDetails.level}</Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="calendar-outline" size={24} color="#20B2AA" />
                <Text style={styles.infoText}>{gameDetails.start_time.split(' ')[0]}</Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="time-outline" size={24} color="#FF4500" />
                <Text style={styles.infoText}>{`${gameDetails.start_time.split(' ')[1]} - ${gameDetails.end_time.split(' ')[1]}`}</Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="people" size={24} color="#4169E1" />
                <Text style={styles.infoText}>{gameDetails.players_joined} players joined</Text>
              </View>
            </View>
            
            {isUserJoined ? (
              <TouchableOpacity style={styles.unjoinButton} onPress={handleUnjoinGame}>
                <Text style={styles.buttonText}>Unjoin Game</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.joinButton} onPress={handleJoinGame}>
                <Text style={styles.buttonText}>Join Game</Text>
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
                  <Text key={index} style={styles.playerName}>{player}</Text>
                ))}
                <Text style={styles.resultsTitle}>Team 2:</Text>
                {shuffleResults.team2.map((player, index) => (
                  <Text key={index} style={styles.playerName}>{player}</Text>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
        
        {isUserJoined && (
          <ChatSection
            messages={messages}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
            flatListRef={flatListRef}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#212121',
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#424242',
  },
  joinButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 16,
  },
  unjoinButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  shuffleButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  shuffleButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    flex: 0.48,
  },
  shuffleButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  resultsContainer: {
    backgroundColor: '#F0F0F0',
    padding: 16,
    borderRadius: 10,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 8,
    color: '#212121',
  },
  playerName: {
    fontSize: 16,
    marginBottom: 4,
    color: '#424242',
  },
  chatContainer: {
    height: 300,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  chatList: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#212121',
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
    color: '#424242',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default GameDetailsScreen;