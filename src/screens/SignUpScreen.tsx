// MobileApp/App/src/screens/SignUpScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { registerUser } from '../services/api';

const SignUpScreen = ({ navigation }: { navigation: any }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const data = await registerUser(username, email, password);
      if (data.message === 'User created successfully') {
        Alert.alert('Success', 'You are now registered');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error registering user:', error);
      Alert.alert('Error', 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp} disabled={loading}>
        <Text style={styles.signUpButtonText}>{loading ? 'Loading...' : 'Sign Up'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  signUpButton: {
    backgroundColor: '#FF5733',
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 16,
  },
  signUpButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default SignUpScreen;