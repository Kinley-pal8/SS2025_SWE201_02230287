import React from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Home({ session }) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* show logo at the top */}
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome to the Dashboard!</Text>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        {/* description text */}
        <Text style={{ color: "#B3B3B3", fontSize: 16 }}>
          This is my Spotify-like home screen.
        </Text>
      </View>
      <View style={styles.verticallySpaced}>
        {/* button to go to account screen */}
        <Button
          title="Go to Account"
          onPress={() => navigation.navigate("Account", { session })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#121212",
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
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});