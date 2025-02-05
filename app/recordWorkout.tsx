import { StyleSheet, Pressable, ScrollView, Platform, Alert, Share } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useState, useEffect, useRef, useMemo } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams, router } from 'expo-router';
import workoutData from '@/constants/WorkoutData';
import * as FileSystem from 'expo-file-system';
import websocketService, { IMUData } from './services/websocketService';

export default function RecordWorkoutScreen() {
  const { categoryIndex, exerciseIndex, workoutName } = useLocalSearchParams<{
    categoryIndex: string;
    exerciseIndex: string;
    workoutName: string;
  }>();
  
  // Convert string indices to numbers and get workout details
  const category = workoutData[Number(categoryIndex)];
  const exercise = category?.exercises[Number(exerciseIndex)];
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const imuDataRef = useRef<IMUData[][]>([]);
  const [imuSamplingRates, setImuSamplingRates] = useState<Record<number, number>>({});
  const [totalSamples, setTotalSamples] = useState<Record<number, number>>({});
  const currentSecondSamplesRef = useRef<Record<number, number>>({});
  
  // Update IMU counts
  const updateIMUCounts = (data: IMUData[]) => {
    // Count samples per IMU in this batch
    data.forEach(imu => {
      // Update samples for the current second
      currentSecondSamplesRef.current[imu.id] = (currentSecondSamplesRef.current[imu.id] || 0) + 1;
      
      // Update total samples
      setTotalSamples(prev => ({
        ...prev,
        [imu.id]: (prev[imu.id] || 0) + 1
      }));
    });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      // Start WebSocket connection when workout begins
      websocketService.connect();
      websocketService.setOnDataCallback((data) => {
        imuDataRef.current.push(data);
        updateIMUCounts(data);
      });

      // Update every second
      interval = setInterval(() => {
        // Update sampling rates with the number of samples received in the last second
        setImuSamplingRates(currentSecondSamplesRef.current);
        // Reset the counter for the next second
        currentSecondSamplesRef.current = {};
        
        setTime(prevTime => prevTime + 1);
        setIsConnected(websocketService.isConnectedToServer());
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
      // Don't disconnect on pause, just stop recording
      websocketService.setOnDataCallback(() => {});
    };
  }, [isActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      websocketService.disconnect();
    };
  }, []);

  const generateCSV = (data: IMUData[][]) => {
    const csvRows = ['IMU ID,Timestamp,W,X,Y,Z,Sys Cal, Gyro Cal, Accel Cal, Mag Cal'];
    data.forEach(batch => {
      batch.forEach(imu => {
        csvRows.push(`${imu.id},${imu.timestamp},${imu.quaternion.w},${imu.quaternion.x},${imu.quaternion.y},${imu.quaternion.z},${imu.calibration.s},${imu.calibration.g},${imu.calibration.a},${imu.calibration.m}`);
      });
    });
    return csvRows.join('\n');
  };

  const downloadWebCSV = (csvContent: string, fileName: string) => {
    // Check if we have access to web APIs
    if (typeof window === 'undefined' || !window.Blob || !window.URL || !window.URL.createObjectURL) {
      throw new Error('Web download not supported in this environment');
    }

    try {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred';
      throw new Error('Failed to download file: ' + errorMessage);
    }
  };

  const saveNativeCSV = async (csvContent: string, fileName: string) => {
    const documentsDir = FileSystem.documentDirectory;
    const filePath = `${documentsDir}${fileName}`;
    await FileSystem.writeAsStringAsync(filePath, csvContent);
    Alert.alert(
      'CSV Saved',
      `Data saved to:\n${filePath}\n\nYou can find the file in your app's Documents directory.`
    );
    return filePath;
  };

  const handleEndWorkout = async () => {
    const imuData = imuDataRef.current;
    const csvContent = generateCSV(imuData);
    const fileName = `workout_${workoutName}_${Date.now()}.csv`;
    
    if (Platform.OS === 'web') {
      try {
        await downloadWebCSV(csvContent, fileName);
      } catch (error) {
        console.error('Error saving CSV:', error);
        // Always fallback to showing data in new tab for web
        try {
          const newWindow = window.open();
          if (newWindow) {
            newWindow.document.write('<html><head><title>Workout Data</title></head><body>');
            newWindow.document.write('<h3>Workout Data (CSV Format)</h3>');
            newWindow.document.write(`<pre>${csvContent}</pre>`);
            newWindow.document.write('</body></html>');
            newWindow.document.close();
          }
        } catch (fallbackError) {
          console.error('Fallback display failed:', fallbackError);
          Alert.alert('Error', 'Could not save or display data. Please try again.');
        }
      }
    } else {
      try {
        const filePath = await saveNativeCSV(csvContent, fileName);
        try {
          await Share.share({
            url: filePath,
            message: `Workout data for ${workoutName}`,
          });
        } catch (shareError) {
          console.error('Error sharing file:', shareError);
          // File is still saved even if sharing fails
        }
      } catch (error) {
        console.error('Error saving CSV:', error);
        Alert.alert('Error', 'Failed to save CSV file');
      }
    }
    
    // Disconnect websocket and stop recording
    websocketService.disconnect();
    setIsActive(false);
    
    // Navigate to summary
    router.push({
      pathname: '/workoutSummary',
      params: { 
        workoutName, 
        time: time.toString(),
        imuData: JSON.stringify(imuData)
      }
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{workoutName}</Text>
          <View style={[
            styles.connectionStatus,
            { backgroundColor: isConnected ? '#4CD964' : '#FF3B30' }
          ]} />
        </View>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(time)}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>IMU Data Collection</Text>
          <View style={styles.imuGrid}>
            {Object.entries(totalSamples).map(([id, count]) => (
              <View key={id} style={styles.imuCard}>
                <Text style={styles.imuLabel}>IMU {id}</Text>
                <Text style={styles.imuCount}>{count}</Text>
                <Text style={styles.imuSubtext}>samples</Text>
                <Text style={styles.samplingRate}>
                  {imuSamplingRates[Number(id)] || 0} Hz
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.controlsContainer}>
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
                  onPress={handleEndWorkout}
                >
                  <FontAwesome name="stop" size={32} color="white" />
                </Pressable>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    alignItems: 'center',
    fontWeight: 'bold',
  },
  timerContainer: {
    alignItems: 'center',
    width: '100%',
  },
  timerText: {
    fontSize: 48,
    fontWeight: '300',
    color: '#007AFF',
    textAlign: 'center',
  },
  connectionStatus: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  statsContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  imuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  imuCard: {
    width: '48%',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  imuLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 5,
  },
  imuCount: {
    fontSize: 24,
    fontWeight: '600',
    color: '#007AFF',
  },
  imuSubtext: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  samplingRate: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  footer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  controlsContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  pauseButton: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  controlButton: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  endButton: {
    backgroundColor: '#FF3B30',
    shadowColor: '#FF3B30',
    shadowOpacity: 0.4,
  }
});