import { StyleSheet, Pressable, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useEffect, useState } from 'react';
import Card from '../../components/card';
import { SessionService } from '../../lib/services/sessionService';
import { Session } from '../../constants/sessionData';

export default function HomeScreen() {
  const router = useRouter();
  const [activeWorkouts, setActiveWorkouts] = useState<Session[]>([]);
  const [pastWorkouts, setPastWorkouts] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      
      // Use SessionService to fetch workouts
      const activeData = await SessionService.fetchActiveWorkouts();
      const pastData = await SessionService.fetchPastWorkouts();
      
      console.log('Active workouts data:', activeData);
      console.log('Past workouts data:', pastData);
      
      setActiveWorkouts(activeData || []);
      setPastWorkouts(pastData || []);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Active Workouts</Text>
        <View style={styles.cardsContainer}>
          {activeWorkouts.length > 0 ? (
            activeWorkouts.map((workout) => (
              <Card 
                key={workout.session_id}
                title={workout.name} 
                subtitle="" 
                date={SessionService.formatDate(workout.created_at)} 
                onPress={() => router.push({
                  pathname: '/screens/workout', 
                  params: {mode: 'edit', id: workout.session_id}
                })}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No active workouts</Text>
          )}
        </View>

        <Pressable 
          style={({ pressed }) => [
            styles.startButton,
            { opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={() => router.push({pathname: '/screens/workout', params: {mode: 'create'}})}
        >
          <FontAwesome name="plus-circle" size={30} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Create Workout</Text>
        </Pressable>
      
        <Text style={styles.header}>Past Workouts</Text>
        
        <View style={styles.cardsContainer}>
          {pastWorkouts.length > 0 ? (
            pastWorkouts.map((workout) => (
              <Card 
                key={workout.session_id}
                title={workout.name} 
                subtitle={workout.completed_date ? SessionService.getRelativeTimeSubtitle(workout.completed_date) : ""} 
                date={workout.completed_date ? SessionService.formatDate(workout.completed_date) : SessionService.formatDate(workout.created_at)} 
                onPress={() => router.push({
                  pathname: '/screens/workout', 
                  params: {mode: 'view', id: workout.session_id}
                })}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No past workouts</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  content: {
    flex: 1,
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
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 20,
   
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
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  cardsContainer: {
    width: '100%',
    marginBottom: 30,
    paddingHorizontal: 5,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
});

