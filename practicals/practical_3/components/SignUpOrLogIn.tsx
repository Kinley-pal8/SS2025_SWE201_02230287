import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// Define the navigation stack's param list
type RootStackParamList = {
  Splash: undefined;
  SignUpOrLogIn: undefined;
  Auth: { method: "email" | "phone" };
  Home: { session: any };
  Account: { session: any };
};

type SignUpOrLogInScreenNavigationProp = StackNavigationProp<RootStackParamList, "SignUpOrLogIn">;

export default function SignUpOrLogIn() {
  const navigation = useNavigation<SignUpOrLogInScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.png")} // Reuse the same logo
        style={styles.logo}
      />
      <Text style={styles.title}>Sign up to start listening</Text>

      {/* Continue with Email */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Auth", { method: "email" })}
      >
        <Text style={styles.buttonText}>Continue with email</Text>
      </TouchableOpacity>

      {/* Continue with Phone */}
      <TouchableOpacity
        style={[styles.button, styles.buttonSecondary]}
        onPress={() => navigation.navigate("Auth", { method: "phone" })}
      >
        <Text style={styles.buttonText}>Continue with phone</Text>
      </TouchableOpacity>

      {/* Already have an account? Log in */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Auth", { method: "email" })}>
          <Text style={styles.footerLink}>Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212", // Spotify's dark background
    padding: 20,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 40,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#1DB954", // Spotify green
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonSecondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  footer: {
    flexDirection: "row",
    marginTop: 30,
  },
  footerText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  footerLink: {
    color: "#1DB954",
    fontSize: 14,
    fontWeight: "bold",
  },
});