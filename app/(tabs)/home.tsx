import { StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuthenticator } from '@aws-amplify/ui-react-native';

export default function HomeScreen() {
  const { user } = useAuthenticator();
  const firstName = user?.attributes?.given_name || 'there';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Fortitude, {firstName}</Text>
      <Text style={styles.subtitle}>Optimize your Strength</Text>
      
      <Pressable 
        style={({ pressed }) => [
          styles.startButton,
          { opacity: pressed ? 0.8 : 1 }
        ]}
        onPress={() => router.push('/startNewWorkout')}
      >
        <FontAwesome name="play-circle" size={24} color="white" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Start Workout</Text>
      </Pressable>

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 4,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});