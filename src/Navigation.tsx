// MobileApp/App/src/Navigation.tsx
import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PlayPointsScreen from '../src/screens/PlayPointsScreen';
import LoginScreen from '../src/screens/LoginScreen';
import SignUpScreen from '../src/screens/SignUpScreen';
import ResetPasswordScreen from '../src/screens/ResetPasswordScreen';
import PlaceholderScreen from '../src/screens/PlaceholderScreen';
import GroupingScreen from '../src/screens/GroupingScreen';
import PPClubScreen from '../src/screens/PPClubScreen';
import CartScreen from '../src/screens/CartScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity, View, Text } from 'react-native';
import CartContext from '../src/context/CartContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

const ShopTabs = () => (
  <TopTab.Navigator>
    <TopTab.Screen name="Grouping" component={GroupingScreen} />
    <TopTab.Screen name="PPClub" component={PPClubScreen} />
  </TopTab.Navigator>
);

const ShopStack = ({ navigation }) => {
  const { cartItems } = useContext(CartContext);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ShopTabs"
        component={ShopTabs}
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
              <View style={{ marginRight: 15 }}>
                <Ionicons name="cart" size={25} color="black" />
                {cartItems.length > 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      right: -10,
                      top: -3,
                      backgroundColor: 'red',
                      borderRadius: 6,
                      width: 12,
                      height: 12,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 10 }}>{cartItems.length}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ),
          headerTitle: 'TheShop',
        }}
      />
      <Stack.Screen 
        name="Cart" 
        component={CartScreen} 
        options={{ headerTitle: '' }} 
      />
    </Stack.Navigator>
  );
};

const PlayPointsStack = ({ token }) => (
  <Stack.Navigator initialRouteName="PlayPoints">
    <Stack.Screen 
      name="PlayPoints" 
      options={{ headerTitle: 'PlayPoints' }}
    >
      {props => <PlayPointsScreen {...props} token={token} />}
    </Stack.Screen>
  </Stack.Navigator>
);

const AppNavigator = ({ token }) => (
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
    <Tab.Screen 
      name="TheShop" 
      component={ShopStack} 
      options={{ headerShown: false }} // Hide the default header
    />
    <Tab.Screen name="Profile" component={PlaceholderScreen} />
    <Tab.Screen name="About" component={PlaceholderScreen} />
  </Tab.Navigator>
);

export default AppNavigator;