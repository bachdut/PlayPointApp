import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { getGameDetails, makeReservation, cancelReservation } from '../services/api';

type RootStackParamList = {
  GameDetails: { gameId: number; token: string };
};

type GameDetailsScreenRouteProp = RouteProp<RootStackParamList, 'GameDetails'>;

const GameDetailsScreen: React.FC = () => {
  const route = useRoute<GameDetailsScreenRouteProp>();
  const { gameId, token } = route.params;
  const [gameDetails, setGameDetails] = useState<any | null>(null);
  const [isUserJoined, setIsUserJoined] = useState(false);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const details = await getGameDetails(gameId.toString(), token);
        setGameDetails(details);

        // Check if the user has joined the game
        if (details.has_reserved) {
          setIsUserJoined(true);
        }
      } catch (error) {
        console.error('Error fetching game details:', error);
        Alert.alert('Error', 'Unable to fetch game details');
      }
    };

    fetchGameDetails();
  }, [gameId]);

  const handleJoinGame = async () => {
    try {
      console.log('Making reservation for game ID:', gameId); // Debug log
      const response = await makeReservation(gameId, token);  // Pass gameId directly
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
      console.log('Cancelling reservation for game ID:', gameId); // Debug log
      const response = await cancelReservation(gameId, token);  // Pass gameId directly
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

  if (!gameDetails) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
        <TouchableOpacity
          style={styles.joinButton}
          onPress={handleUnjoinGame}
        >
          <Text style={styles.joinButtonText}>Unjoin Game</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.joinButton}
          onPress={handleJoinGame}
        >
          <Text style={styles.joinButtonText}>Join Game</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
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
});

export default GameDetailsScreen;