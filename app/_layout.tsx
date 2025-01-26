import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';

import { Amplify } from 'aws-amplify';
import { Authenticator, ThemeProvider as AmplifyThemeProvider } from '@aws-amplify/ui-react-native';
import { Hub } from 'aws-amplify/utils';
import { getCurrentUser } from 'aws-amplify/auth';
import awsmobile from './aws-exports';

// Configure Amplify
Amplify.configure(awsmobile);

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '/login',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const pathname = usePathname();

  // Set up auth listener
  useEffect(() => {
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          if (pathname === '/login') {
            router.replace('/(tabs)/home');
          }
          break;
        case 'signedOut':
          if (!pathname.includes('/login')) {
            router.replace('/login');
          }
          break;
      }
    });

    // Check current auth state on mount
    checkAuthState();

    return unsubscribe;
  }, [pathname]);

  async function checkAuthState() {
    try {
      await getCurrentUser();
      if (pathname === '/login') {
        router.replace('/(tabs)/home');
      }
    } catch (error) {
      if (!pathname.includes('/login')) {
        router.replace('/login');
      }
    }
  }

  // Handle font loading error
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Hide splash screen once fonts are loaded
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AmplifyThemeProvider>
      <Authenticator.Provider>
        <RootLayoutNav />
      </Authenticator.Provider>
    </AmplifyThemeProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="startNewWorkout" options={{ headerShown: false }} />
        <Stack.Screen name="recordWorkout" options={{ headerShown: false }} />
        <Stack.Screen name="workoutSummary" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}