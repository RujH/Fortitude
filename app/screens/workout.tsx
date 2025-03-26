import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SessionService } from '../../lib/services/sessionService';
import { ExerciseService } from '../../lib/services/exerciseService';
import { Session } from '../../constants/constants';
import { Exercise } from '../../constants/constants';

export default function Workout() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const mode = params.mode as string;
  const workoutId = params.id as string;
  
  console.log('Workout params:', { mode, workoutId });

  const [workoutName, setWorkoutName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<any[]>([]);
  const [currentExercise, setCurrentExercise] = useState('');
  const [sets, setSets] = useState(3); // Default value
  const [reps, setReps] = useState(10); // Default value
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [sessionData, setSessionData] = useState<Session | null>(null);

  // Load available exercises and workout data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch all available exercises
        const exerciseData = await ExerciseService.fetchAllExercises();
        setExercises(exerciseData || []);
        
        // If editing or viewing an existing workout, fetch its data
        if (workoutId) {
          const session = await SessionService.fetchSessionById(workoutId);
          setSessionData(session);
          setWorkoutName(session.name);
          
          // Fetch exercises for this session
          const sessionExercises = await ExerciseService.fetchExercisesBySession(workoutId);
          setSelectedExercises(ExerciseService.formatExerciseList(sessionExercises));
        }
      } catch (error) {
        console.error('Error loading workout data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [workoutId]);

  const incrementSets = () => setSets(prev => prev + 1);
  const decrementSets = () => setSets(prev => prev > 1 ? prev - 1 : 1);
  const incrementReps = () => setReps(prev => prev + 1);
  const decrementReps = () => setReps(prev => prev > 1 ? prev - 1 : 1);

  const addExercise = () => {
    if (currentExercise) {
      // Find the selected exercise from our list
      const exerciseObj = exercises.find(ex => ex.exercise_id === currentExercise);
      
      if (exerciseObj) {
        const newExercise = {
          id: '', // Will be assigned by the database when saved
          exerciseId: exerciseObj.exercise_id,
          name: exerciseObj.name,
          sets: sets,
          reps: reps,
          orderIndex: selectedExercises.length
        };
        
        setSelectedExercises([...selectedExercises, newExercise]);
        // Reset fields after adding
        setCurrentExercise('');
        setSets(3); // Reset to default
        setReps(10); // Reset to default
      }
    }
  };

  const removeExercise = (index) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises.splice(index, 1);
    // Update order indices
    const reorderedExercises = updatedExercises.map((ex, idx) => ({
      ...ex,
      orderIndex: idx
    }));
    setSelectedExercises(reorderedExercises);
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

  const saveWorkout = async () => {
    try {
      setLoading(true);
      
      let sessionId = workoutId;
      
      // If creating a new workout, save the session first
      if (!sessionId) {
        const sessionData = {
          name: workoutName,
          created_at: new Date().toISOString()
        };
        
        const newSession = await SessionService.addSession(sessionData);
        sessionId = newSession[0].session_id;
      } else {
        // Update existing session name
        await SessionService.updateSession(sessionId, { name: workoutName });
      }
      
      // Process exercises - add new ones, update existing ones
      for (const exercise of selectedExercises) {
        if (!exercise.id) {
          // This is a new exercise to add
          await ExerciseService.addExerciseToSession(
            sessionId,
            exercise.exerciseId,
            exercise.sets,
            exercise.reps,
            exercise.orderIndex
          );
        } else {
          // This is an existing exercise to update
          await ExerciseService.updateSessionExercises([{
            id: exercise.id,
            session_id: sessionId,
            exercise_id: exercise.exerciseId,
            sets: exercise.sets,
            reps: exercise.reps,
            order_index: exercise.orderIndex
          }]);
        }
      }
      
      // Navigate back to home screen
      router.back();
    } catch (error) {
      console.error('Error saving workout:', error);
    } finally {
      setLoading(false);
    }
  };

  // Determine if we're in view-only mode
  const isViewMode = mode === 'view';
  
  // Determine the title based on mode
  const pageTitle = mode === 'edit' ? 'Edit Workout' : mode === 'view' ? 'Workout Details' : 'Create Workout';

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading workout data...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>{pageTitle}</Text>
        
        <TextInput
          style={styles.nameInput}
          value={workoutName}
          onChangeText={setWorkoutName}
          placeholder="Workout name"
          placeholderTextColor="#999"
          editable={!isViewMode}
        />
        
        <Text style={styles.sectionLabel}>Exercises</Text>
        
        {!isViewMode && (
          <>
            <View style={styles.exerciseSelector}>
              <Picker
                selectedValue={currentExercise}
                onValueChange={(itemValue) => setCurrentExercise(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select an exercise" value="" />
                {exercises.map((exercise) => (
                  <Picker.Item 
                    key={exercise.exercise_id} 
                    label={exercise.name} 
                    value={exercise.exercise_id} 
                  />
                ))}
              </Picker>
            </View>
            
            {currentExercise ? (
              <View style={styles.exerciseConfig}>
                <Text style={styles.exerciseName}>
                  {exercises.find(ex => ex.exercise_id === currentExercise)?.name}
                </Text>
                
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
          </>
        )}
        
        {selectedExercises.length > 0 ? (
          <View style={styles.exerciseList}>
            {isViewMode ? (
              selectedExercises.map((item, index) => (
                <View key={`exercise-${index}`} style={styles.exerciseItem}>
                  <View style={styles.exerciseContent}>
                    <Text style={styles.exerciseItemName}>{item.name}</Text>
                    <Text style={styles.exerciseDetails}>{item.sets} sets × {item.reps} reps</Text>
                  </View>
                </View>
              ))
            ) : (
              <DraggableFlatList
                data={selectedExercises}
                renderItem={renderExerciseItem}
                keyExtractor={(item, index) => `exercise-${index}`}
                onDragEnd={({ data }) => {
                  // Update order indices after drag
                  const reorderedExercises = data.map((ex, idx) => ({
                    ...ex,
                    orderIndex: idx
                  }));
                  setSelectedExercises(reorderedExercises);
                }}
              />
            )}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No exercises added</Text>
          </View>
        )}
        
        {!isViewMode && (
          <TouchableOpacity 
            style={[styles.saveButton, !selectedExercises.length && styles.disabledButton]} 
            disabled={!selectedExercises.length}
            onPress={saveWorkout}
          >
            <Text style={styles.saveButtonText}>
              {mode === 'edit' ? 'Update Workout' : 'Save Workout'}
            </Text>
          </TouchableOpacity>
        )}
        
        {isViewMode && sessionData && !sessionData.completed_date && (
          <TouchableOpacity 
            style={styles.completeButton}
            onPress={async () => {
              try {
                await SessionService.completeSession(workoutId);
                router.back();
              } catch (error) {
                console.error('Error completing workout:', error);
              }
            }}
          >
            <Text style={styles.saveButtonText}>Complete Workout</Text>
          </TouchableOpacity>
        )}
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
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
  completeButton: {
    backgroundColor: '#4CAF50',
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
