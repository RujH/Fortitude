import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Header() {
  const navigation = useNavigation();
  
  return (
    <View style={styles.headerContainer}>
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('screens/home')}>
          <Text style={styles.headerTitle}>Fortitude</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('screens/profile')}>
          <View style={styles.profileCircle} />
        </TouchableOpacity>
      </View>
      <View style={styles.statusContainer}>
        <View style={[styles.statusCircle, styles.statusOnline]} />
        <Text style={styles.statusText}>Online</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 10,
  },
  profileCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ccc',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  statusOnline: {
    backgroundColor: '#4CD964',
  },
  statusOffline: {
    backgroundColor: '#FF3B30',
  },
  statusText: {
    fontSize: 16,
    color: 'white',
  },
});

