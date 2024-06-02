import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import PlayPointsScreen from './src/screens/PlayPointsScreen';
import PlaceholderScreen from './src/screens/PlaceholderScreen';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '136528838841-f4qtnf6psgdhr2d71953slrsh0uvoosm.apps.googleusercontent.com',
    });
  }, []);

  const handleLogin = (userToken: string) => {
    setToken(userToken);
  };

  const MainTabs = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'PlayPoints') {
            iconName = focused ? 'basketball' : 'basketball-outline';
          } else if (route.name === 'CatchUp') {
            iconName = focused ? 'chatbox' : 'chatbox-outline';
          } else if (route.name === 'TheShop') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'About') {
            iconName = focused ? 'information-circle' : 'information-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF5733',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="PlayPoints">
        {props => <PlayPointsScreen {...props} token={token} />}
      </Tab.Screen>
      <Tab.Screen name="CatchUp" component={PlaceholderScreen} />
      <Tab.Screen name="TheShop" component={PlaceholderScreen} />
      <Tab.Screen name="Profile" component={PlaceholderScreen} />
      <Tab.Screen name="About" component={PlaceholderScreen} />
    </Tab.Navigator>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login">
          {props => <LoginScreen {...props} onLogin={handleLogin} />}
        </Stack.Screen>
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;