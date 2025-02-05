import { StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useState, useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import websocketService from './services/websocketService';
import workoutData from '@/constants/WorkoutData';

export default function StartNewWorkoutScreen() {
  const params = useLocalSearchParams();
  const { categoryIndex, exerciseIndex, workoutName } = params;

  // State for workout selection when coming directly to this page
  const [selectedWorkout, setSelectedWorkout] = useState('');
  const [error, setError] = useState('');

  // === ESP32 Connection Logic ===
  const [espIP, setEspIP] = useState('192.168.1.207');
  const [isConnected, setIsConnected] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Flatten all exercises for the picker
  const workoutOptions = workoutData.flatMap((category, catIndex) => 
    category.exercises.map((exercise, exIndex) => ({
      label: exercise.name,
      value: `${catIndex}-${exIndex}`,
      category: category.name
    }))
  );

  useEffect(() => {
    // Check connection status every second
    const interval = setInterval(() => {
      setIsConnected(websocketService.isConnectedToServer());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleIPSubmit = () => {
    if (!isValidIP(espIP)) {
      Alert.alert('Invalid IP', 'Please enter a valid IP address');
      return;
    }
    websocketService.updateESPIP(espIP);
    setIsEditing(false);
  };

  const isValidIP = (ip: string) => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) return false;
    
    const parts = ip.split('.');
    return parts.every(part => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  };

  const handleNext = () => {
    if (!isConnected) {
      Alert.alert('Not Connected', 'Please ensure the ESP32 is connected before starting the workout');
      return;
    }

    // Handle direct access case (no params)
    if (!categoryIndex && !exerciseIndex) {
      if (!selectedWorkout) {
        setError('Please select a workout');
        Alert.alert('Selection Required', 'Please select a workout before continuing');
        return;
      }
      const [catIndex, exIndex] = selectedWorkout.split('-');
      router.push({
        pathname: '/recordWorkout',
        params: {
          categoryIndex: catIndex,
          exerciseIndex: exIndex,
          workoutName: workoutData[Number(catIndex)].exercises[Number(exIndex)].name
        }
      });
      return;
    }

    // Handle navigation from workouts page
    router.push({
      pathname: '/recordWorkout',
      params: { 
        categoryIndex: Number(categoryIndex), 
        exerciseIndex: Number(exerciseIndex),
        workoutName 
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Start Workout</Text>
        </View>

        {/* Workout Selection/Display */}
        {categoryIndex && exerciseIndex ? (
          // Show selected workout when coming from workouts page
          <View style={styles.workoutInfo}>
            <Text style={styles.subtitle}>Selected Workout:</Text>
            <Text style={styles.workoutName}>{workoutName}</Text>
          </View>
        ) : (
          // Show workout picker when coming directly
          <View style={styles.workoutSelection}>
            <Text style={styles.subtitle}>Choose your workout</Text>
            <View style={[
              styles.pickerContainer,
              error ? styles.pickerError : null
            ]}>
              <Picker
                selectedValue={selectedWorkout}
                onValueChange={(itemValue) => {
                  setSelectedWorkout(itemValue);
                  setError('');
                }}
                style={styles.picker}
              >
                <Picker.Item label="Select exercise..." value="" />
                {workoutOptions.map((option) => (
                  <Picker.Item 
                    key={option.value} 
                    label={`${option.label} (${option.category})`}
                    value={option.value} 
                  />
                ))}
              </Picker>
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
        )}

        {/* ESP32 Connection UI */}
        <View style={styles.ipContainer}>
          <View style={styles.ipHeader}>
            <Text style={styles.label}>ESP32 Connection</Text>
            <View 
              style={[
                styles.connectionIndicator,
                { backgroundColor: isConnected ? '#4CD964' : '#FF3B30' }
              ]} 
            />
          </View>
          
          {isEditing ? (
            <View style={styles.ipEditContainer}>
              <TextInput
                style={styles.ipInput}
                value={espIP}
                onChangeText={setEspIP}
                placeholder="192.168.1.207"
                keyboardType="numeric"
                autoFocus
                maxLength={15}
              />
              <Pressable
                style={({ pressed }) => [
                  styles.ipButton,
                  { opacity: pressed ? 0.8 : 1 }
                ]}
                onPress={handleIPSubmit}
              >
                <Text style={styles.buttonText}>Connect</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              style={styles.ipDisplayContainer}
              onPress={() => setIsEditing(true)}
            >
              <View style={styles.ipInfo}>
                <Text style={styles.ipLabel}>IP Address</Text>
                <Text style={styles.ipText}>{espIP}</Text>
              </View>
              <FontAwesome name="pencil" size={20} color="#007AFF" />
            </Pressable>
          )}
        </View>
      </View>

      <Pressable 
        style={({ pressed }) => [
          styles.nextButton,
          { opacity: pressed ? 0.8 : 1 }
        ]}
        onPress={handleNext}
      >
        <Text style={styles.nextButtonText}>Start Workout</Text>
        <FontAwesome name="arrow-right" size={20} color="white" style={styles.buttonIcon} />
      </Pressable>
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
  workoutInfo: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  workoutSelection: {
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  workoutName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  pickerContainer: {
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#ccc'
  },
  pickerError: {
    borderColor: 'red',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  ipContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
  },
  ipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
  connectionIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  ipEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ipDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  ipInfo: {
    flex: 1,
  },
  ipLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  ipInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  ipText: {
    fontSize: 17,
    fontWeight: '500',
  },
  ipButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 8,
  },
});