// MobileApp/App/App.tsx
import 'react-native-gesture-handler';
import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Linking } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import AppNavigator from './src/Navigation';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { CartProvider } from './src/context/CartContext';

const Stack = createStackNavigator();

const App = () => {
  const [token, setToken] = useState<string | null>(null);
  const navigationRef = useRef();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '136528838841-f4qtnf6psgdhr2d71953slrsh0uvoosm.apps.googleusercontent.com',
    });

    const handleDeepLink = (event: { url: string }) => {
      const { url } = event;
      if (url) {
        const gameId = extractGameIdFromUrl(url);
        if (gameId) {
          navigateToGameDetails(gameId);
        }
      }
    };

    Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      Linking.removeEventListener('url', handleDeepLink);
    };
  }, []);

  const handleLogin = (userToken: string) => {
    setToken(userToken);
  };

  const extractGameIdFromUrl = (url: string): string | null => {
    const match = url.match(/\/shared-game\/([^\/]+)/);
    return match ? match[1] : null;
  };

  const navigateToGameDetails = (gameId: string) => {
    if (navigationRef.current) {
      navigationRef.current.navigate('Main', {
        screen: 'PlayPoints',
        params: {
          screen: 'GameDetails',
          params: { gameId: parseInt(gameId), token },
        },
      });
    }
  };

  return (
    <CartProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login">
            {props => <LoginScreen {...props} onLogin={handleLogin} />}
          </Stack.Screen>
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <Stack.Screen name="Main" options={{ headerShown: false }}>
            {props => <AppNavigator {...props} token={token} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
};

export default App;