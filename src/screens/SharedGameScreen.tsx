import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { fetchSharedGame } from '../services/api';

const SharedGameScreen = () => {
  const route = useRoute();
  const { uniqueId } = route.params;
  const [gameDetails, setGameDetails] = useState(null);

  useEffect(() => {
    const loadGameDetails = async () => {
      try {
        const details = await fetchSharedGame(uniqueId);
        setGameDetails(details);
      } catch (error) {
        console.error('Error loading shared game details:', error);
      }
    };
    loadGameDetails();
  }, [uniqueId]);

  if (!gameDetails) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{gameDetails.name}</Text>
      <Text>Date: {gameDetails.date}</Text>
      <Text>Time: {gameDetails.time}</Text>
      <Text>Location: {gameDetails.location}</Text>
      {/* Add more game details as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default SharedGameScreen;