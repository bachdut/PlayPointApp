import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getHostedGames, deleteHostedGame } from '../services/api';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../Navigation';

type MyHostedGamesScreenRouteProp = RouteProp<RootStackParamList, 'MyHostedGames'>;
type MyHostedGamesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MyHostedGames'>;

type Props = {
  route: MyHostedGamesScreenRouteProp;
  navigation: MyHostedGamesScreenNavigationProp;
};

const MyHostedGamesScreen: React.FC<Props> = ({ route, navigation }) => {
  const [games, setGames] = useState([]);
  const { token } = route.params;

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
        setGames(games.filter((game) => game.id !== gameId));
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete game');
    }
  };

  const renderGameItem = ({ item }) => (
    <View style={styles.gameItem}>
      <View style={styles.gameInfo}>
        <Text style={styles.courtName}>{item.court_name}</Text>
        <Text style={styles.gameTime}>{`${item.start_time} - ${item.end_time}`}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteGame(item.id)}
      >
        <Icon name="trash-outline" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <View style={styles.container}>
        {games.length > 0 ? (
          <FlatList
            data={games}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderGameItem}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <Text style={styles.noGamesText}>You haven't hosted any games yet.</Text>
        )}
      </View>
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
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#212121',
  },
  listContent: {
    paddingBottom: 20,
  },
  gameItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  gameInfo: {
    flex: 1,
  },
  courtName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  gameTime: {
    fontSize: 14,
    color: '#757575',
  },
  deleteButton: {
    padding: 8,
  },
  noGamesText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default MyHostedGamesScreen;