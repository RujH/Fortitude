import { StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import workoutData from '@/constants/WorkoutData';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

export default function WorkoutsScreen() {
  // Initialize state with all categories expanded
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

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        {workoutData.map((category, index) => (
          <View key={index} style={styles.categoryContainer}>
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
                  <View key={exerciseIndex} style={styles.card}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    {exercise.description && (
                      <Text style={styles.description}>{exercise.description}</Text>
                    )}
                    {exercise.beginner_modification && (
                      <Text style={styles.modification}>
                        {exercise.beginner_modification}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  categoryContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
});