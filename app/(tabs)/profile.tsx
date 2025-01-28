import { StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';

export default function ProfileScreen() {
  const { user, authStatus } = useAuthenticator();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    async function loadUserData() {
      try {
        const attributes = await fetchUserAttributes();
        setUserData({ attributes });
      } catch (error) {
        console.error('Error getting user attributes:', error);
      }
    }

    if (authStatus === 'authenticated') {
      loadUserData();
    }
  }, [authStatus]);

  // Get user's email and name from attributes
  const userEmail = userData?.attributes?.email || user?.signInDetails?.loginId || 'No email available';
  const firstName = userData?.attributes?.given_name || '';
  const lastName = userData?.attributes?.family_name || '';


  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <FontAwesome name="user-circle" size={80} color="#007AFF" />
          </View>
          <Text style={styles.name}>{`${firstName} ${lastName}`.trim()}</Text>
          <Text style={styles.email}>{userEmail}</Text>
        </View>

        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Hours</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Avg/Week</Text>
          </View>
        </View>

        {/* Settings Options */}
        <View style={styles.settingsContainer}>
          <Pressable style={styles.settingItem}>
            <FontAwesome name="user" size={20} color="#007AFF" />
            <Text style={styles.settingText}>Edit Profile</Text>
            <FontAwesome name="chevron-right" size={16} color="#999" />
          </Pressable>
          

          
          <Pressable style={styles.settingItem}>
            <FontAwesome name="gear" size={20} color="#007AFF" />
            <Text style={styles.settingText}>Settings</Text>
            <FontAwesome name="chevron-right" size={16} color="#999" />
          </Pressable>
          
          <Pressable style={styles.settingItem}>
            <FontAwesome name="question-circle" size={20} color="#007AFF" />
            <Text style={styles.settingText}>Help & Support</Text>
            <FontAwesome name="chevron-right" size={16} color="#999" />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    paddingVertical: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  settingsContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    marginVertical: 5,
    borderRadius: 8,
  },
  settingText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
  },
});