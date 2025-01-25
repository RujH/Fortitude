import { useEffect } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import {
  Authenticator,
  defaultDarkModeOverride,
  ThemeProvider,
  useAuthenticator,
} from '@aws-amplify/ui-react-native';
import { Hub } from 'aws-amplify/utils';
import { signOut } from 'aws-amplify/auth';

interface AuthUser {
  username: string;
  signInDetails?: {
    loginId?: string;
  };
  attributes?: {
    email?: string;
    sub?: string;
    [key: string]: any;
  };
}

// Custom theme for Authenticator
const theme = {
  overrides: [defaultDarkModeOverride],
  tokens: {
    colors: {
      background: {
        primary: '#FFFFFF',
        secondary: '#F5F5F5',
      },
      brand: {
        primary: {
          10: '#1565C0',
          20: '#1976D2',
          40: '#2196F3',
          60: '#42A5F5',
          80: '#64B5F6',
          90: '#90CAF9',
          100: '#BBDEFB',
        },
      },
      font: {
        interactive: '#1565C0',
      },
    },
    components: {
      button: {
        primary: {
          backgroundColor: '#1565C0',
          color: '#FFFFFF',
        },
      },
      fieldControl: {
        border: '1px solid #E0E0E0',
        borderRadius: '8px',
      },
    },
  },
};

function SignedIn() {
  const { user, signOut } = useAuthenticator();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome Back</Text>
        <Text style={styles.userText}>
          {user?.username || user?.signInDetails?.loginId}
        </Text>
        <Pressable 
          style={({ pressed }) => [
            styles.signOutButton,
            pressed && styles.signOutButtonPressed
          ]}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function LoginScreen() {
  useEffect(() => {
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          router.replace('/(tabs)/home');
          break;
        case 'signedOut':
          router.replace('/login');
          break;
        case 'tokenRefresh_failure':
          console.error('Token refresh failed:', payload.data);
          break;
      }
    });

    return unsubscribe;
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <View style={styles.container}>
        <Authenticator
          loginMechanisms={['email']}
          signUpAttributes={['email']}
        >
          <SignedIn />
        </Authenticator>
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 16,
  },
  userText: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 32,
  },
  signOutButton: {
    backgroundColor: '#1565C0',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  signOutButtonPressed: {
    backgroundColor: '#1976D2',
    transform: [{ scale: 0.98 }],
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});