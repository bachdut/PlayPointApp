// MobileApp/App/src/Navigation/Navigation.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PlayPointsScreen from './screens/PlayPointsScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import PlaceholderScreen from './screens/PlaceholderScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const PlayPointsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PlayPoints" component={PlayPointsScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="PlayPoints" component={PlayPointsStack} />
        <Tab.Screen name="CatchUp" component={PlaceholderScreen} />
        <Tab.Screen name="TheShop" component={PlaceholderScreen} />
        <Tab.Screen name="Profile" component={PlaceholderScreen} />
        <Tab.Screen name="About" component={PlaceholderScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;