import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface TodoInputProps {
  onAddTodo: (text: string) => Promise<boolean>;
}

const TodoInput: React.FC<TodoInputProps> = ({ onAddTodo }) => {
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = async () => {
    const success = await onAddTodo(newTodo);
    if (success) {
      setNewTodo('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={newTodo}
        onChangeText={setNewTodo}
        placeholder="Enter a new todo..."
        placeholderTextColor="#B3B3B3"
        multiline
        returnKeyType="done"
        onSubmitEditing={handleAddTodo}
      />
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={handleAddTodo}
      >
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#535353',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#282828',
    marginRight: 12,
    fontSize: 16,
    maxHeight: 100,
    textAlignVertical: 'top',
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#1DB954', // Spotify green
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default TodoInput;