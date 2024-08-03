import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { getCourtDetails, cancelReservation } from '../services/api';

type RootStackParamList = {
  GameDetails: { courtId: number, token: string };
};

type GameDetailsScreenRouteProp = RouteProp<RootStackParamList, 'GameDetails'>;

const GameDetailsScreen: React.FC = () => {
  const route = useRoute<GameDetailsScreenRouteProp>();
  const { courtId, token } = route.params;
  const [courtDetails, setCourtDetails] = useState<any | null>(null);

  console.log('Received courtId:', courtId);  // Debug log

  useEffect(() => {
    if (courtId !== undefined) {
      const fetchCourtDetails = async () => {
        try {
          const details = await getCourtDetails(courtId.toString());
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

  const handleUnjoinMatch = async () => {
    try {
      const response = await cancelReservation(courtDetails.name, token);
      if (response.message === 'Reservation deleted') {
        Alert.alert('Unjoin Match', 'Successfully unjoined the match');
        // Update court details locally to reflect the unjoined match
        setCourtDetails((prevDetails: any) => ({
          ...prevDetails,
          available_seats: prevDetails.available_seats + 1,
          players_joined: prevDetails.players_joined - 1,
        }));
      } else {
        Alert.alert('Error', response.message || 'Failed to unjoin match');
      }
    } catch (error) {
      console.error('Error unjoining match:', error);
      Alert.alert('Error', 'Unable to unjoin match');
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
      <TouchableOpacity
        style={styles.joinButton}
        onPress={handleUnjoinMatch}
      >
        <Text style={styles.joinButtonText}>Unjoin Match</Text>
      </TouchableOpacity>
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