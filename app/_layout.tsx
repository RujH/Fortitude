// import FontAwesome from '@expo/vector-icons/FontAwesome';
// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
// import { Stack, router, usePathname } from 'expo-router';
// import * as SplashScreen from 'expo-splash-screen';
// import { useEffect, useState } from 'react';
// import { View, ActivityIndicator } from 'react-native';
// import { Session } from '@supabase/supabase-js';

// import { useColorScheme } from '@/components/useColorScheme';
// import { initSupabase } from '../lib/supabase';

// export {
//   // Catch any errors thrown by the Layout component.
//   ErrorBoundary,
// } from 'expo-router';

// export const unstable_settings = {
//   initialRouteName: '/login',
//   unstable_noSSR: true
// };

// // Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const [loaded, error] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//     ...FontAwesome.font,
//   });
//   const [session, setSession] = useState<Session | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const pathname = usePathname();

//   // Handle font loading error
//   useEffect(() => {
//     if (error) throw error;
//   }, [error]);

//   // Hide splash screen once fonts are loaded
//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);

//   // Initialize Supabase client
//   useEffect(() => {
//     const initializeAuth = async () => {
//       try {
//         const supabase = initSupabase();
//         const { data: { session: initialSession } } = await supabase.auth.getSession();
//         setSession(initialSession);
        
//         // Only attempt navigation after setting the session
//         if (initialSession) {
//           if (pathname === '/login') {
//             setTimeout(() => router.replace('/(tabs)/home'), 0);
//           }
//         } else {
//           if (pathname !== '/login') {
//             setTimeout(() => router.replace('/login'), 0);
//           }
//         }

//         const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//           setSession(session);
//           if (session) {
//             if (pathname === '/login') {
//               setTimeout(() => router.replace('/(tabs)/home'), 0);
//             }
//           } else {
//             if (!pathname.includes('/login')) {
//               setTimeout(() => router.replace('/login'), 0);
//             }
//           }
//         });

//         setIsLoading(false);
//         return () => subscription.unsubscribe();
//       } catch (error) {
//         console.error('Auth initialization error:', error);
//         setIsLoading(false);
//       }
//     };

//     initializeAuth();
//   }, [pathname]);

//   if (!loaded || isLoading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   const colorScheme = useColorScheme();

//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <Stack>
//         <Stack.Screen name="login" options={{ headerShown: false }} />
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
//         <Stack.Screen name="startNewWorkout" options={{ headerShown: false }} />
//         <Stack.Screen name="recordWorkout" options={{ headerShown: false }} />
//         <Stack.Screen name="workoutSummary" options={{ headerShown: false }} />
//       </Stack>
//     </ThemeProvider>
//   );
// }


import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Auth from '../components/Auth'
import Account from '../components/Account'
import { View } from 'react-native'
import { Session } from '@supabase/supabase-js'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <View>
      {session && session.user ? <Account key={session.user.id} session={session} /> : <Auth />}
    </View>
  )
}
