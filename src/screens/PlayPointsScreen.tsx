// MobileApp/App/src/screens/PlayPointsScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation';

type Props = StackScreenProps<RootStackParamList, 'PlayPoints'> & {
  token: string | null;
};

const PlayPointsScreen: React.FC<Props> = ({ token, navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PlayPoints</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Host', { token })}>
        <Text style={styles.buttonText}>Host</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Join', { token })}>
        <Text style={styles.buttonText}>Join</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#FF5733',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default PlayPointsScreen;