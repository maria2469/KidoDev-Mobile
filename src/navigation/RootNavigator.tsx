import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './NavigationTypes';
import { HomeScreen } from '../screens/HomeScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { LevelsScreen } from '../screens/LevelsScreen';
import { MagicStudioScreen } from '../screens/MagicStudioScreen';
import { GamesHubScreen } from '../screens/GamesHubScreen';
import { ParentDashboardScreen } from '../screens/ParentDashboardScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Levels" component={LevelsScreen} />
      <Stack.Screen name="MagicStudio" component={MagicStudioScreen} />
      <Stack.Screen name="GamesHub" component={GamesHubScreen} />
      <Stack.Screen name="ParentDashboard" component={ParentDashboardScreen} />
    </Stack.Navigator>
  );
};
