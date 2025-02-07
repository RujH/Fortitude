import { useState } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  Alert,
  Linking
} from 'react-native';
import { Text, View } from '@/components/Themed';
import workoutData from '@/constants/WorkoutData';
import { router } from 'expo-router';
import { ChevronDown, ChevronUp, ArrowUpRight } from 'lucide-react-native';
import { Link } from 'expo-router';

export default function WorkoutsScreen() {
  const [selectedWorkout, setSelectedWorkout] = useState<{
    categoryIndex: number;
    exerciseIndex: number;
    workoutName: string;
  } | null>(null);

  // === Workout Category Expand/Collapse Logic ===
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    workoutData.forEach(category => {
      initialState[category.name] = true;
    });
    return initialState;
  });

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const handleNext = () => {
    if (!selectedWorkout) {
      Alert.alert('Selection Required', 'Please select a workout before continuing');
      return;
    }
    router.push({
      pathname: '/startNewWorkout',
      params: selectedWorkout
    });
  };

  return (
    <View style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Workouts</Text>
      </View>

      {/* Workout Selection */}
      <View style={styles.workoutContainer}>
      <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        {workoutData.map((category, categoryIndex) => (
          <View key={categoryIndex} style={styles.categoryContainer}>
            <Pressable 
              onPress={() => toggleCategory(category.name)}
              style={styles.categoryHeader}
            >
              <Text style={styles.categoryTitle}>{category.name}</Text>
              {expandedCategories[category.name] ? (
                <ChevronUp size={24} color="#333" />
              ) : (
                <ChevronDown size={24} color="#333" />
              )}
            </Pressable>

            {expandedCategories[category.name] && (
                  <View style={styles.cardsContainer}>
                    {category.exercises.map((exercise, exerciseIndex) => (
                      <Pressable
                        key={exerciseIndex}
                        onPress={() => {
                          setSelectedWorkout({
                            categoryIndex,
                            exerciseIndex,
                            workoutName: exercise.name
                          });
                        }}
                      >
                        <View style={[
                          styles.card,
                          selectedWorkout?.categoryIndex === categoryIndex && 
                          selectedWorkout?.exerciseIndex === exerciseIndex && 
                          styles.selectedCard
                        ]}>
                          <View style={styles.cardHeader}>
                            <Text style={styles.exerciseName}>{exercise.name}</Text>
                            <Pressable
                              style={({ pressed }) => [
                                styles.iconButton,
                                { opacity: pressed ? 0.6 : 1 }
                              ]}
                              onPress={() => Linking.openURL(exercise.link)}
                            >
                              <ArrowUpRight size={20} color="#666" />
                            </Pressable>
                          </View>
                          {exercise.description && (
                            <Text style={styles.description}>
                              {exercise.description}
                            </Text>
                          )}
                          {exercise.beginner_modification && (
                            <Text style={styles.modification}>
                              {exercise.beginner_modification}
                            </Text>
                          )}
                        </View>
                      </Pressable>
                    ))}
                  </View>
                )}
            

          </View>
        ))}
      </View>
    </ScrollView>

        {/* Next Button */}
        <Pressable
          style={({ pressed }) => [
            styles.nextButton,
            { opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  workoutContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 0,
  },
  scrollContainer: {
    flex: 1,
  },
  innerContainer: {
    paddingHorizontal: 4,
    paddingBottom: 20,
  },
  categoryContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardsContainer: {
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
  },
  selectedCard: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3',
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  modification: {
    fontSize: 14,
    color: '#2196F3',
    marginTop: 4,
    fontStyle: 'italic',
  },
  iconButton: {
    padding: 4,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});