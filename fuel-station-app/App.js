import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './utils/authContext';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ScanScreen from './screens/ScanScreen';
import FuelUpdateScreen from './screens/FuelUpdateScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Fuel Station Dashboard' }}
          />
          <Stack.Screen
            name="Scan"
            component={ScanScreen}
            options={{ title: 'Scan QR Code' }}
          />
          <Stack.Screen
            name="FuelUpdate"
            component={FuelUpdateScreen}
            options={{ title: 'Update Fuel Amount' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;