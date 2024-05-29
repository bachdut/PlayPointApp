// PlayPointApp/App.tsx
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import CourtsScreen from './src/screens/CourtsScreen';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '136528838841-f4qtnf6psgdhr2d71953slrsh0uvoosm.apps.googleusercontent.com', // Replace with your actual web client ID from Google Cloud Console
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Courts" component={CourtsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;