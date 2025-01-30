import { StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import websocketService from '../services/websocketService';

export default function WorkoutsScreen() {
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

  const startWorkout = () => {
    if (!isConnected) {
      Alert.alert(
        'Not Connected',
        'Please ensure the ESP32 is connected before starting a workout',
        [{ text: 'OK' }]
      );
      return;
    }
    router.push('/startNewWorkout');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Workouts</Text>
      </View>

      <View style={styles.ipContainer}>
        <View style={styles.ipHeader}>
          <Text style={styles.label}>ESP32 Connection</Text>
          <View style={[
            styles.connectionIndicator,
            { backgroundColor: isConnected ? '#4CD964' : '#FF3B30' }
          ]} />
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

      <View style={styles.content}>
        <Pressable
          style={({ pressed }) => [
            styles.startButton,
            { opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={startWorkout}
        >
          <Text style={styles.startButtonText}>Start New Workout</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  ipContainer: {
    marginBottom: 30,
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
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
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});