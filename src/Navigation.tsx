// MobileApp/App/src/Navigation/Navigation.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PlayPointsScreen from './screens/PlayPointsScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import PlaceholderScreen from './screens/PlaceholderScreen';
import GroupingScreen from './screens/GroupingScreen';
import PPClubScreen from './screens/PPClubScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

const PlayPointsStack = ({ token }: { token: string | null }) => (
  <Stack.Navigator initialRouteName="PlayPoints">
    <Stack.Screen name="PlayPoints">
      {props => <PlayPointsScreen {...props} token={token} />}
    </Stack.Screen>
  </Stack.Navigator>
);

const ShopStack = () => (
  <TopTab.Navigator>
    <TopTab.Screen name="Grouping" component={GroupingScreen} />
    <TopTab.Screen name="PPClub" component={PPClubScreen} />
  </TopTab.Navigator>
);

const AppNavigator = ({ token }: { token: string | null }) => (
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
      {props => <PlayPointsStack {...props} token={token} />}
    </Tab.Screen>
    <Tab.Screen name="CatchUp" component={PlaceholderScreen} />
    <Tab.Screen name="TheShop" component={ShopStack} />
    <Tab.Screen name="Profile" component={PlaceholderScreen} />
    <Tab.Screen name="About" component={PlaceholderScreen} />
  </Tab.Navigator>
);

export default AppNavigator;