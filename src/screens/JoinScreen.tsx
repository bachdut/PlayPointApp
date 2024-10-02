import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image, Alert, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { getOpenGames } from '../services/api';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Ionicons';

interface JoinScreenProps {
  token: string;
}

type RootStackParamList = {
  Home: undefined;
  Join: { token: string }; 
  GameDetails: { gameId: number; token: string };
};

const JoinScreen: React.FC<JoinScreenProps> = ({ token }) => {
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState<number | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [games, setGames] = useState([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const data = await getOpenGames(token, location, null, null, price?.toString(), level);
      setGames(data.games);
    } catch (error) {
      Alert.alert('Error', 'Failed to load open games');
    }
  };

  const handleFilter = () => {
    fetchGames();
  };

  const handleJoinGame = (game: any) => {
    if (game.id) {
      navigation.navigate('GameDetails', { gameId: game.id, token });
    } else {
      Alert.alert('Error', 'Invalid game or court ID');
    }
  };

  const renderGame = ({ item }: { item: any }) => (
    <View style={styles.gameContainer}>
      <View style={styles.gameImageContainer}>
        {item.image ? 
          <Image source={{ uri: item.image }} style={styles.gameImage} /> : 
          <View style={styles.gameImagePlaceholder}>
            <Icon name="basketball-outline" size={40} color="#CCCCCC" />
          </View>
        }
      </View>
      <View style={styles.gameDetails}>
        <Text style={styles.gameName}>{item.court_name || 'Unnamed Court'}</Text>
        <Text style={styles.gameInfo}>{item.location || 'Unknown Location'}</Text>
        <Text style={styles.gameInfo}>{item.players_joined !== undefined ? `${item.players_joined} players joined` : 'Players not specified'}</Text>
        <Text style={styles.gameInfo}>{item.price !== undefined ? `${item.price} USD` : 'Price not specified'}</Text>
        <Text style={styles.gameInfo}>{`${item.start_time} - ${item.end_time}`}</Text>
        <TouchableOpacity onPress={() => handleJoinGame(item)} style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <View style={styles.container}>
        <Text style={styles.title}>Filter Games</Text>

        <View style={styles.inputContainer}>
          <Icon name="location-outline" size={24} color="#1E90FF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <Text style={styles.sliderLabel}>Price (up to): {price !== null ? `$${price}` : 'Any'}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={10}
          value={price || 0}
          onValueChange={setPrice}
          minimumTrackTintColor="#1E90FF"
          maximumTrackTintColor="#D3D3D3"
          thumbTintColor="#1E90FF"
        />

        <View style={styles.inputContainer}>
          <Icon name="fitness-outline" size={24} color="#1E90FF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Level"
            value={level || ''}
            onChangeText={setLevel}
          />
        </View>

        <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>

        <FlatList
          data={games}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderGame}
          contentContainerStyle={styles.gameList}
        />
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  sliderLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#212121',
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  filterButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameList: {
    paddingBottom: 20,
  },
  gameContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gameImageContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  gameImage: {
    width: 100,
    height: 100,
  },
  gameImagePlaceholder: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  gameDetails: {
    flex: 1,
    padding: 12,
  },
  gameName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#212121',
  },
  gameInfo: {
    fontSize: 14,
    marginBottom: 2,
    color: '#757575',
  },
  joinButton: {
    backgroundColor: '#FF6F00',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  joinButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default JoinScreen;