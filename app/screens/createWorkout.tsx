import { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Sample exercise data - replace with your actual data source
const exerciseOptions = [
  'Bench Press',
  'Squat',
  'Deadlift',
  'Pull-ups',
  'Push-ups',
  'Lunges',
  'Shoulder Press',
  'Bicep Curls',
];

export default function CreateWorkout() {
  const [workoutName, setWorkoutName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState('');
  const [sets, setSets] = useState(3); // Default value
  const [reps, setReps] = useState(10); // Default value

  const incrementSets = () => setSets(prev => prev + 1);
  const decrementSets = () => setSets(prev => prev > 1 ? prev - 1 : 1);
  const incrementReps = () => setReps(prev => prev + 1);
  const decrementReps = () => setReps(prev => prev > 1 ? prev - 1 : 1);

  const addExercise = () => {
    if (currentExercise) {
      const newExercise = {
        name: currentExercise,
        sets: sets,
        reps: reps
      };
      setSelectedExercises([...selectedExercises, newExercise]);
      // Reset fields after adding
      setCurrentExercise('');
      setSets(3); // Reset to default
      setReps(10); // Reset to default
    }
  };

  const removeExercise = (index) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises.splice(index, 1);
    setSelectedExercises(updatedExercises);
  };

  const renderExerciseItem = ({ item, index, drag, isActive }) => {
    return (
      <TouchableOpacity
        onLongPress={drag}
        style={[
          styles.exerciseItem,
          isActive && styles.exerciseItemActive
        ]}
      >
        <View style={styles.exerciseContent}>
          <Text style={styles.exerciseItemName}>{item.name}</Text>
          <Text style={styles.exerciseDetails}>{item.sets} sets × {item.reps} reps</Text>
        </View>
        <TouchableOpacity onPress={() => removeExercise(index)}>
          <Text style={styles.removeButton}>×</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Workout</Text>
        
        <TextInput
          style={styles.nameInput}
          value={workoutName}
          onChangeText={setWorkoutName}
          placeholder="Workout name"
          placeholderTextColor="#999"
        />
        
        <Text style={styles.sectionLabel}>Exercises</Text>
        
        <View style={styles.exerciseSelector}>
          <Picker
            selectedValue={currentExercise}
            onValueChange={(itemValue) => setCurrentExercise(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select an exercise" value="" />
            {exerciseOptions.map((exercise) => (
              <Picker.Item key={exercise} label={exercise} value={exercise} />
            ))}
          </Picker>
        </View>
        
        {currentExercise ? (
          <View style={styles.exerciseConfig}>
            <Text style={styles.exerciseName}>{currentExercise}</Text>
            
            <View style={styles.counterRow}>
              <View style={styles.counter}>
                <Text style={styles.counterLabel}>Sets</Text>
                <View style={styles.counterControl}>
                  <TouchableOpacity onPress={decrementSets} style={styles.counterButton}>
                    <Text style={styles.counterButtonText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.counterValue}>{sets}</Text>
                  <TouchableOpacity onPress={incrementSets} style={styles.counterButton}>
                    <Text style={styles.counterButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.counter}>
                <Text style={styles.counterLabel}>Reps</Text>
                <View style={styles.counterControl}>
                  <TouchableOpacity onPress={decrementReps} style={styles.counterButton}>
                    <Text style={styles.counterButtonText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.counterValue}>{reps}</Text>
                  <TouchableOpacity onPress={incrementReps} style={styles.counterButton}>
                    <Text style={styles.counterButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={addExercise}
            >
              <Text style={styles.buttonText}>Add Exercise</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        
        {selectedExercises.length > 0 ? (
          <View style={styles.exerciseList}>
            <DraggableFlatList
              data={selectedExercises}
              renderItem={renderExerciseItem}
              keyExtractor={(item, index) => `exercise-${index}`}
              onDragEnd={({ data }) => setSelectedExercises(data)}
            />
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No exercises added</Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={[styles.saveButton, !selectedExercises.length && styles.disabledButton]} 
          disabled={!selectedExercises.length}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 24,
    color: '#000',
  },
  nameInput: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },
  exerciseSelector: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
    marginBottom: 16,
  },
  picker: {
    height: 50,
  },
  exerciseConfig: {
    marginBottom: 24,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  counter: {
    width: '48%',
  },
  counterLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },
  counterControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
    height: 44,
  },
  counterButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButtonText: {
    fontSize: 20,
    color: '#000',
  },
  counterValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#000',
    borderRadius: 4,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  exerciseList: {
    flex: 1,
    marginBottom: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  exerciseItemActive: {
    backgroundColor: '#f9f9f9',
    elevation: 2,
  },
  dragHandle: {
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  dragHandleText: {
    fontSize: 20,
    color: '#999',
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseItemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  removeButton: {
    fontSize: 24,
    color: '#999',
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#999',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#000',
    borderRadius: 4,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: '#eee',
  },
});
