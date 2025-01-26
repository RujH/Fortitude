import { StyleSheet, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { Alert } from 'react-native';

export default function StartNewWorkoutScreen() {
  const [selectedWorkout, setSelectedWorkout] = useState('');
  const [error, setError] = useState('');

  const workoutOptions = [
    { label: 'Strength Training', value: 'strength' },
    { label: 'Cardio', value: 'cardio' },
    { label: 'HIIT', value: 'hiit' },
    { label: 'Yoga', value: 'yoga' },
  ];

  const handleNext = () => {
    if (!selectedWorkout) {
      setError('Please select a workout');
      Alert.alert('Please select a workout type');
      return;
    }
    setError('');
    const selectedOption = workoutOptions.find(option => option.value === selectedWorkout);
    router.push({
      pathname: '/recordWorkout',
      params: { 
        workoutType: selectedWorkout,
        workoutName: selectedOption?.label 
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Start New Workout</Text>
          
        </View>

        <Text style={styles.subtitle}>Choose your workout type</Text>
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
            style={[styles.picker]}
            prompt="Select a workout type"
          >
            <Picker.Item label="Select workout type..." value="" />
            {workoutOptions.map((option) => (
              <Picker.Item 
                key={option.value} 
                label={option.label} 
                value={option.value} 
              />
            ))}
          </Picker>
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      <Pressable 
        style={({ pressed }) => [
          styles.nextButton,
          { opacity: pressed ? 0.8 : 1 }
        ]}
        onPress={handleNext}
      >
        <Text style={styles.buttonText}>Next</Text>
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
  subtitle: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
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
    color: '#000000'
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
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '400',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 30,
    textAlign: 'center'
  }
});