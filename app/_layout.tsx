import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { View, StyleSheet, Platform } from "react-native";
import Header from "../components/header";
import Constants from 'expo-constants';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // Calculate status bar height
  const statusBarHeight = Constants.statusBarHeight || 0;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View style={styles.container}>
        {/* Global Header with explicit padding for status bar */}
        <View style={[styles.headerWrapper, { paddingTop: statusBarHeight }]}>
          <Header />
        </View>
        
        {/* Content area with Stack Navigation */}
        <View style={styles.contentContainer}>
          <Stack 
            screenOptions={{ 
              headerShown: false,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="screens/home" />
            <Stack.Screen name="screens/createWorkout"/>
            <Stack.Screen name="screens/profile"/>
            <Stack.Screen name="screens/recordWorkout"/>
            <Stack.Screen name="+not-found" />
          </Stack>
        </View>
        
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrapper: {
    width: '100%',
    zIndex: 10,
  },
  contentContainer: {
    flex: 1,
  },
});
