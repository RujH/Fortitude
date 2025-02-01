import { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  TextInput, 
  Alert 
} from 'react-native';
import { Text, View } from '@/components/Themed';
import workoutData from '@/constants/WorkoutData';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

import websocketService from '../services/websocketService'; // Adjust path as needed

export default function WorkoutsScreen() {
  // === ESP32 Connection Logic ===
  const [espIP, setEspIP] = useState('192.168.1.207');
  const [isConnected, setIsConnected] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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

  return (
    <View style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Workouts</Text>
      </View>

      {/* ESP32 Connection Card and Workout Selection */}
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

        {/* Workout selection area */}
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.innerContainer}>
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
                          if (!isConnected) {
                            Alert.alert(
                              'Not Connected',
                              'Please ensure the ESP32 is connected before recording a workout',
                              [{ text: 'OK' }]
                            );
                            return;
                          }
                          router.push({
                            pathname: '/recordWorkout',
                            params: { 
                              categoryIndex, 
                              exerciseIndex,
                              workoutName: exercise.name 
                            }
                          });
                        }}
                      >
                        <View style={styles.card}>
                          <Text style={styles.exerciseName}>{exercise.name}</Text>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // -- Main container styles --
  mainContainer: {
    flex: 1,
    padding: 20,
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
  // -- ESP32 Connection & Workout Selection Container --
  ipContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 0,
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
  // -- Scrollable workout list inside ipContainer --
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
