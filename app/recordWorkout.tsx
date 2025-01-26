import { StyleSheet, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useState, useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams, router } from 'expo-router';

export default function RecordWorkoutScreen() {
  const { workoutName } = useLocalSearchParams<{ workoutName: string }>();
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{workoutName}</Text>
        </View>
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(time)}</Text>
        {isActive ? (
          <Pressable 
            style={({ pressed }) => [
              styles.pauseButton,
              { opacity: pressed ? 0.8 : 1 }
            ]}
            onPress={() => setIsActive(false)}
          >
            <FontAwesome name="pause" size={32} color="white" />
          </Pressable>
        ) : (
          <View style={styles.buttonContainer}>
            <Pressable 
              style={({ pressed }) => [
                styles.controlButton,
                { opacity: pressed ? 0.8 : 1 }
              ]}
              onPress={() => setIsActive(true)}
            >
              <FontAwesome name="play" size={32} color="white" />
            </Pressable>
            {time > 0 && (
              <Pressable 
                style={({ pressed }) => [
                  styles.controlButton,
                  styles.endButton,
                  { opacity: pressed ? 0.8 : 1 }
                ]}
                onPress={() => {
                  router.push({
                    pathname: '/workoutSummary',
                    params: { workoutName, time: time.toString() }
                  });
                }}
              >
                <FontAwesome name="stop" size={32} color="white" />
              </Pressable>
            )}
          </View>
        )}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  pauseButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  controlButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  endButton: {
    backgroundColor: '#FF3B30',
  }
});