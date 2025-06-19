import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { Todo } from '../types/todo';

export const useTodos = (userId: string | undefined) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch todos from Supabase for current user
  const fetchTodos = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTodos(data || []);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add new todo
  const addTodo = async (text: string): Promise<boolean> => {
    if (!userId) {
      Alert.alert('Error', 'User not authenticated');
      return false;
    }

    if (!text.trim()) {
      Alert.alert('Error', 'Please enter a todo item');
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ 
          text: text.trim(), 
          completed: false, 
          user_id: userId 
        }])
        .select();

      if (error) throw error;
      
      if (data && data[0]) {
        setTodos([data[0], ...todos]);
      }
      return true;
    } catch (error: any) {
      Alert.alert('Error', error.message);
      return false;
    }
  };

  // Toggle todo completion
  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !completed })
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed: !completed } : todo
      ));
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // Delete todo
  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // Setup real-time subscription
  useEffect(() => {
    if (!userId) return;

    fetchTodos();

    const subscription = supabase
      .channel('todos')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'todos',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        console.log('Todo change received!', payload);
        fetchTodos();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  return {
    todos,
    loading,
    addTodo,
    toggleTodo,
    deleteTodo,
    refreshTodos: fetchTodos,
  };
};