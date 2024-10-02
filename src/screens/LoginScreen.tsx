import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../Navigation';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import Icon from 'react-native-vector-icons/Ionicons';
import { loginUser } from '../services/api';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
  onLogin: (token: string) => void;
};

const { width, height } = Dimensions.get('window');

const LoginScreen: React.FC<Props> = ({ navigation, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '136528838841-f4qtnf6psgdhr2d71953slrsh0uvoosm.apps.googleusercontent.com',
    });
  }, []);

  const handleLogin = async () => {
    try {
      const response = await loginUser(email, password);
      if (response.access_token) {
        onLogin(response.access_token);
        Alert.alert('Success', 'Login successful');
        navigation.replace('Main');
      } else {
        Alert.alert('Login Failed', 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred during login');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.idToken;
      const response = await fetch('http://127.0.0.1:8888/login/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken }),
      });
      const data = await response.json();
      if (response.ok) {
        onLogin(data.access_token);
        Alert.alert('Success', 'Google Sign-In successful');
        navigation.replace('Main');
      } else {
        Alert.alert('Google Sign-In Failed', data.message);
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Cancelled', 'Google Sign-In was cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('In Progress', 'Google Sign-In operation is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Play services not available or outdated');
      } else {
        Alert.alert('Error', 'An unknown error occurred');
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/playpointLogo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>PlayPoint</Text>
        </View>
        
        <View style={styles.inputContainer}>
          <Icon name="mail-outline" size={24} color="#1E90FF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Icon name="lock-closed-outline" size={24} color="#1E90FF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Icon
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color="#1E90FF"
            />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </TouchableOpacity>
        
        <Text style={styles.orText}>or sign in with</Text>
        
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
          <Image source={require('../assets/google.png')} style={styles.googleIcon} />
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>
        
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Cool Gray background
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#212121', // Charcoal text
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#212121', // Charcoal text
    fontSize: 16,
  },
  forgotPassword: {
    color: '#1E90FF', // Electric Blue
    textAlign: 'right',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#FF6F00', // Vibrant Orange
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orText: {
    color: '#212121', // Charcoal text
    textAlign: 'center',
    marginBottom: 20,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#1E90FF', // Electric Blue
    justifyContent: 'center',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#212121', // Charcoal text
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#212121', // Charcoal text
  },
  signupLink: {
    color: '#1E90FF', // Electric Blue
    fontWeight: 'bold',
  },
});

export default LoginScreen;