import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { loginUser } from '../services/api';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../Navigation';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
  onLogin: (token: string) => void;
};

const LoginScreen: React.FC<Props> = ({ navigation, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '136528838841-f4qtnf6psgdhr2d71953slrsh0uvoosm.apps.googleusercontent.com',
    });
  }, []);

  const handleLogin = async () => {
    console.log('Email:', email);
    console.log('Password:', password);
    try {
      const response = await loginUser(email, password);
      console.log('Response:', response);
      if (response.access_token) {
        onLogin(response.access_token); // Call onLogin with the token
        Alert.alert('Login successful');
        navigation.replace('Main'); // Ensure 'Main' is defined in RootStackParamList
      } else {
        Alert.alert('Login failed', 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login failed', 'An error occurred');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.idToken;
      // Send ID token to your backend for verification
      const response = await fetch('http://127.0.0.1:8888/login/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken }),
      });
      const data = await response.json();
      if (response.ok) {
        onLogin(data.access_token); // Call onLogin with the token from the backend
        Alert.alert('Google Sign-In successful');
        navigation.replace('Main'); // Ensure 'Main' is defined in RootStackParamList
      } else {
        Alert.alert('Google Sign-In failed', data.message);
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Sign in cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Sign in in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play services not available');
      } else {
        Alert.alert('Something went wrong');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>PlayPoint</Text>
      <Text style={styles.title}>LOGIN</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>LOGIN</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>or sign up using</Text>
      <View style={styles.socialButtons}>
        <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignIn}>
          <Image source={require('../assets/google.png')} style={styles.socialIcon} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signUp}>SIGN UP</Text>
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
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  forgotPassword: {
    color: 'gray',
    textAlign: 'right',
    marginBottom: 12,
  },
  loginButton: {
    backgroundColor: '#FF5733',
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 16,
  },
  loginButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
  orText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  socialButton: {
    marginHorizontal: 10,
  },
  socialIcon: {
    width: 30,
    height: 30,
  },
  signUp: {
    textAlign: 'center',
    color: '#FF5733',
  },
});

export default LoginScreen;