import { StyleSheet, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useLocalSearchParams, router } from 'expo-router';

export default function WorkoutSummaryScreen() {
  const { workoutName, time } = useLocalSearchParams<{ workoutName: string, time: string }>();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Workout Summary</Text>
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.label}>Workout Type</Text>
            <Text style={styles.value}>{workoutName}</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.label}>Duration</Text>
            <Text style={styles.value}>{formatTime(Number(time))}</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable 
          style={({ pressed }) => [
            styles.button,
            styles.newWorkoutButton,
            { opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={() => router.push('/startNewWorkout')}
        >
          <Text style={styles.buttonText}>Start New Workout</Text>
        </Pressable>

        <Pressable 
          style={({ pressed }) => [
            styles.button,
            styles.doneButton,
            { opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={() => router.replace('/(tabs)/home')}
        >
          <Text style={styles.buttonText}>Done</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryContainer: {
    padding: 20,
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 24,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  newWorkoutButton: {
    backgroundColor: '#007AFF',
  },
  doneButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  }
});