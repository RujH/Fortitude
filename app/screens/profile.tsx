import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';

export default function Profile() {
  // Mock user data - replace with actual data from your state management or API
  const [user, setUser] = useState({
    initials: "JS",
    name: "Jane Smith",
    activeSince: "June, 2017",
    email: "jane.smith@example.com",
    password: "********"
  });

  const [isEditing, setIsEditing] = useState(false);
  
  // Temporary state to hold edits
  const [editedUser, setEditedUser] = useState({...user});
  
  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditedUser({...user});
    setIsEditing(false);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header with Avatar */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{user.initials}</Text>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userActive}>Active since - {user.activeSince}</Text>
      </View>

      {/* Edit Section */}
      <View style={styles.editContainer}>
        <View style={styles.editHeader}>
          <TouchableOpacity 
            style={styles.editButtonContainer} 
            onPress={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            <Text style={styles.editButton}>{isEditing ? 'Save' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>
        
        {isEditing ? (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput 
                style={styles.input}
                value={editedUser.name}
                onChangeText={(text) => setEditedUser({...editedUser, name: text})}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput 
                style={styles.input}
                value={editedUser.email}
                onChangeText={(text) => setEditedUser({...editedUser, email: text})}
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput 
                style={styles.input}
                value={editedUser.password}
                onChangeText={(text) => setEditedUser({...editedUser, password: text})}
                secureTextEntry
              />
            </View>
            
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name</Text>
              <Text style={styles.valueText}>{user.name}</Text>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.valueText}>{user.email || 'Not set'}</Text>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Password</Text>
              <Text style={styles.valueText}>••••••••</Text>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerTitle: {
    color: '#333',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#555',
  },
  userName: {
    color: '#333',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
  },
  userActive: {
    color: '#888',
    fontSize: 14,
    marginBottom: 20,
  },
  editContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  editHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 25,
  },
  editButtonContainer: {
    alignSelf: 'flex-end',
  },
  editButton: {
    fontSize: 16,
    color: '#4a90e2',
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 15,
    color: '#888',
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    fontSize: 16,
    paddingVertical: 8,
    color: '#333',
  },
  valueText: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  cancelButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
  }
});
