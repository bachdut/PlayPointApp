import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getHostedGames, deleteHostedGame } from '../services/api';

const MyHostedGamesScreen: React.FC = () => {
  const [games, setGames] = useState([]);
  const route = useRoute();
  const { token } = route.params as { token: string };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await getHostedGames(token);
        setGames(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to load hosted games');
      }
    };

    fetchGames();
  }, [token]);

  const handleDeleteGame = async (gameId: number) => {
    try {
      const response = await deleteHostedGame(gameId, token);
      if (response.message === 'Game deleted successfully') {
        Alert.alert('Success', 'Game deleted successfully');
        setGames(games.filter((game) => game.id !== gameId)); // Update the state to remove the deleted game
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete game');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Hosted Games</Text>
      <FlatList
        data={games}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.gameItem}>
            <Text>{item.court_name}</Text>
            <Text>{`${item.start_time} - ${item.end_time}`}</Text>
            <Button title="Delete" onPress={() => handleDeleteGame(item.id)} />
          </View>
        )}
      />
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
    marginBottom: 16,
    textAlign: 'center',
  },
  gameItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 8,
  },
});

export default MyHostedGamesScreen;