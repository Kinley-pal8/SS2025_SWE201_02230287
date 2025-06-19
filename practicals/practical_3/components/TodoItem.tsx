import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Todo } from '../types/todo';

interface TodoItemProps {
  item: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ item, onToggle, onDelete }) => {
  const handleDelete = () => {
    Alert.alert(
      'Delete Todo',
      'Are you sure you want to delete this todo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onDelete(item.id)
        }
      ]
    );
  };

  return (
    <View style={styles.todoItem}>
      <TouchableOpacity 
        style={styles.todoContent}
        onPress={() => onToggle(item.id, item.completed)}
      >
        <Text style={[
          styles.todoText, 
          item.completed && styles.completedText
        ]}>
          {item.text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={handleDelete}
      >
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: 'row',
    backgroundColor: '#282828',
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#535353',
  },
  todoContent: {
    flex: 1,
    paddingRight: 12,
  },
  todoText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#B3B3B3',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#535353',
  },
  deleteButtonText: {
    fontSize: 16,
  },
});

export default TodoItem;