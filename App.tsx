import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { GameProvider } from './src/context/GameContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <GameProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </GameProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
