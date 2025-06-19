import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  FlatList,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTodos } from "../hooks/useTodos";
import TodoInput from "./TodoInput";
import TodoItem from "./TodoItem";
import { Todo } from "../types/todo";

interface HomeProps {
  session: any;
}
--legacy-peer-deps
export default function Home({ session }: HomeProps) {
  const navigation = useNavigation();
  const { todos, loading, addTodo, toggleTodo, deleteTodo, refreshTodos } = useTodos(session?.user?.id);

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  const renderTodo = ({ item }: { item: Todo }) => (
    <TodoItem 
      item={item}
      onToggle={toggleTodo}
      onDelete={deleteTodo}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Existing header section */}
        <View style={styles.header}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Welcome to the Dashboard!</Text>
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <Text style={styles.description}>
              This is my Spotify-like home screen.
            </Text>
          </View>
          <View style={styles.verticallySpaced}>
            <Button
              title="Go to Account"
              onPress={() => navigation.navigate("Account", { session })}
            />
          </View>
        </View>

        {/* Todo section */}
        <View style={styles.todoSection}>
          <Text style={styles.sectionTitle}>My Todos</Text>
          {session?.user?.email && (
            <Text style={styles.userGreeting}>
              Hey {session.user.email.split('@')[0]}! 👋
            </Text>
          )}
          
          {totalCount > 0 && (
            <Text style={styles.stats}>
              {completedCount} of {totalCount} completed
            </Text>
          )}

          <TodoInput onAddTodo={addTodo} />

          {todos.length > 0 ? (
            <View style={styles.todoListContainer}>
              <FlatList
                data={todos}
                renderItem={renderTodo}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📝</Text>
              <Text style={styles.emptyTitle}>No todos yet</Text>
              <Text style={styles.emptySubtitle}>
                Add your first todo above to get started!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 24,
    color: "#FFFFFF",
    marginBottom: 10,
  },
  description: {
    color: "#B3B3B3",
    fontSize: 16,
    textAlign: "center",
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
  
  // Todo section styles
  todoSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
  },
  userGreeting: {
    fontSize: 16,
    color: "#1DB954", // Spotify green
    textAlign: "center",
    marginBottom: 8,
  },
  stats: {
    fontSize: 14,
    color: "#1DB954",
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 20,
  },
  todoListContainer: {
    marginTop: 10,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#B3B3B3",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#535353",
    textAlign: "center",
    fontStyle: "italic",
  },
});