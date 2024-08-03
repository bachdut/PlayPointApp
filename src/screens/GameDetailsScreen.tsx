import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { getCourtDetails, makeReservation, cancelReservation } from '../services/api';

type RootStackParamList = {
  GameDetails: { courtId: number; token: string };
};

type GameDetailsScreenRouteProp = RouteProp<RootStackParamList, 'GameDetails'>;

const GameDetailsScreen: React.FC = () => {
  const route = useRoute<GameDetailsScreenRouteProp>();
  const { courtId, token } = route.params;
  const [courtDetails, setCourtDetails] = useState<any | null>(null);

  useEffect(() => {
    if (courtId !== undefined) {
      const fetchCourtDetails = async () => {
        try {
          const details = await getCourtDetails(courtId.toString(), token);
          setCourtDetails(details);
        } catch (error) {
          console.error('Error fetching court details:', error);
          Alert.alert('Error', 'Unable to fetch court details');
        }
      };

      fetchCourtDetails();
    } else {
      console.error('Error: courtId is undefined');
      Alert.alert('Error', 'Invalid court ID');
    }
  }, [courtId]);

  const handleJoinGame = async () => {
    try {
      const response = await makeReservation(courtDetails.name, token);
      if (response.message === 'Reservation successful') {
        Alert.alert('Success', 'You have successfully joined the game!');
        setCourtDetails({ ...courtDetails, has_reserved: true });
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
      const response = await cancelReservation(courtDetails.name, token);
      if (response.message === 'Reservation deleted') {
        Alert.alert('Success', 'You have successfully unjoined the game!');
        setCourtDetails({ ...courtDetails, has_reserved: false });
      } else {
        Alert.alert('Failed', response.message);
      }
    } catch (error) {
      console.error('Error unjoining game:', error);
      Alert.alert('Error', 'Unable to unjoin game');
    }
  };

  if (!courtDetails) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{courtDetails.name}</Text>
      <Text>Location: {courtDetails.location}</Text>
      <Text>Price: ${courtDetails.price}</Text>
      <Text>Available Seats: {courtDetails.available_seats}</Text>
      <Text>Category: {courtDetails.category}</Text>
      <Text>Level: {courtDetails.level}</Text>
      <Text>Date: {courtDetails.available_date}</Text>
      <Text>Time: {courtDetails.available_time}</Text>
      <Text>Players Joined: {courtDetails.players_joined}</Text>
      {courtDetails.has_reserved ? (
        <TouchableOpacity
          style={styles.joinButton}
          onPress={handleUnjoinGame}
        >
          <Text style={styles.joinButtonText}>Unjoin Match</Text>
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