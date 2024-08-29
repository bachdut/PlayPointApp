import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { getOpenGames } from '../services/api';
import Slider from '@react-native-community/slider';

interface JoinScreenProps {
  token: string;
}

type RootStackParamList = {
  Home: undefined;
  Join: { token: string }; 
  GameDetails: { courtId: number; token: string };
};

const JoinScreen: React.FC<JoinScreenProps> = ({ token }) => {
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<{ startDate: Date | null, endDate: Date | null }>({ startDate: null, endDate: null });
  const [level, setLevel] = useState<string | null>(null);
  const [games, setGames] = useState([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const data = await getOpenGames(token, location, formatDate(dateRange.startDate), formatDate(dateRange.endDate), price?.toString(), level);
      setGames(data.games);
    } catch (error) {
      Alert.alert('Error', 'Failed to load open games');
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleFilter = () => {
    fetchGames();
  };

  const handleJoinGame = (game: any) => {
    console.log('Attempting to join game:', game);  // Log the game object to see what is being passed
    if (game.id) {
        console.log('Navigating to GameDetails with gameId:', game.id);
        navigation.navigate('GameDetails', { gameId: game.id, token });
    } else {
        console.error('Invalid game or court ID:', game);
        Alert.alert('Error', 'Invalid game or court ID');
    }
  };

  const renderGame = ({ item }: { item: any }) => (
    <View style={styles.courtContainer}>
      {item.image ? <Image source={{ uri: item.image }} style={styles.courtImage} /> : <View style={styles.courtImagePlaceholder} />}
      <View style={styles.courtDetails}>
        <Text style={styles.courtName}>{item.court_name || 'Unnamed Court'}</Text>
        <Text>{item.location || 'Unknown Location'}</Text>
        <Text>{item.players_joined !== undefined ? `${item.players_joined} players joined` : 'Players not specified'}</Text>
        <Text>{item.price !== undefined ? `${item.price} USD` : 'Price not specified'}</Text>
        <Text>{`${item.start_time} - ${item.end_time}`}</Text>
        <TouchableOpacity onPress={() => handleJoinGame(item)} style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filter Games</Text>

      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />

      <Text>Price (up to): {price !== null ? `$${price}` : 'Any'}</Text>
      <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={0}
        maximumValue={100}
        step={10}
        value={price || 0}
        onValueChange={setPrice}
      />

      <TextInput
        style={styles.input}
        placeholder="Level"
        value={level || ''}
        onChangeText={setLevel}
      />

      <Button title="Filter" onPress={handleFilter} />

      <FlatList
        data={games}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderGame}
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  courtContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  courtImage: {
    width: 100,
    height: 100,
  },
  courtImagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#ccc',
  },
  courtDetails: {
    flex: 1,
    padding: 16,
  },
  courtName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  joinButton: {
    backgroundColor: '#FF5733',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginTop: 8,
  },
  joinButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default JoinScreen;