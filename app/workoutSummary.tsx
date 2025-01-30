import { StyleSheet, Pressable, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useLocalSearchParams, router } from 'expo-router';
import { IMUData } from './services/websocketService';
import { useMemo } from 'react';

export default function WorkoutSummaryScreen() {
  const { workoutName, time, imuData } = useLocalSearchParams<{ 
    workoutName: string, 
    time: string,
    imuData: string 
  }>();

  const parsedIMUData = useMemo(() => {
    try {
      return JSON.parse(imuData || '[]') as IMUData[][];
    } catch (e) {
      console.error('Error parsing IMU data:', e);
      return [];
    }
  }, [imuData]);

  const imuStats = useMemo(() => {
    if (!parsedIMUData.length) return null;

    // Calculate average motion intensity for each IMU
    const stats = parsedIMUData.reduce((acc, batch) => {
      batch.forEach(data => {
        if (!acc[data.id]) {
          acc[data.id] = {
            totalMotion: 0,
            samples: 0
          };
        }
        // Calculate motion intensity from quaternion
        const motionIntensity = Math.sqrt(
          data.quaternion.x * data.quaternion.x +
          data.quaternion.y * data.quaternion.y +
          data.quaternion.z * data.quaternion.z
        );
        acc[data.id].totalMotion += motionIntensity;
        acc[data.id].samples += 1;
      });
      return acc;
    }, {} as Record<number, { totalMotion: number, samples: number }>);

    // Convert to averages
    return Object.entries(stats).map(([id, data]) => ({
      id: Number(id),
      averageMotion: data.totalMotion / data.samples
    }));
  }, [parsedIMUData]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Workout Summary</Text>
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.label}>Total IMU Readings</Text>
            <Text style={styles.value}>{parsedIMUData.length}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.label}>Workout Type</Text>
            <Text style={styles.value}>{workoutName}</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.label}>Duration</Text>
            <Text style={styles.value}>{formatTime(Number(time))}</Text>
          </View>
        </View>

        {imuStats && imuStats.length > 0 && (
          <View style={styles.imuContainer}>
            <Text style={styles.sectionTitle}>Motion Intensity by Sensor</Text>
            {imuStats.map((stat) => (
              <View key={stat.id} style={styles.imuItem}>
                <Text style={styles.imuLabel}>Sensor {stat.id}</Text>
                <View style={styles.intensityBar}>
                  <View 
                    style={[
                      styles.intensityFill,
                      { flex: Math.min(stat.averageMotion, 1) }
                    ]} 
                  />
                </View>
                <Text style={styles.intensityValue}>
                  {stat.averageMotion.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

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
  scrollContent: {
    paddingBottom: 20,
  },
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
  imuContainer: {
    width: '100%',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  imuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  imuLabel: {
    width: 80,
    fontSize: 14,
  },
  intensityBar: {
    flex: 1,
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  intensityFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  intensityValue: {
    width: 50,
    fontSize: 12,
    textAlign: 'right',
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