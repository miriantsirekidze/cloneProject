import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

import Home from '../screens/Home';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import PassRecovery from '../screens/PassRecovery';
import { StatusBar } from 'react-native';

const MainNavigator = () => {
  const Stack = createNativeStackNavigator();
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <StatusBar barStyle={'dark-content'}/>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Home" component={Home} />
        ) : (
          <>
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="PassRecovery" component={PassRecovery} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
