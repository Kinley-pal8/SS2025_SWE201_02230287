import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { StyleSheet, View, Alert, Image } from "react-native";
import { Button, Input } from "@rneui/themed";
import { Session } from "@supabase/supabase-js";

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    // get profile data when session is ready
    if (session) getProfile();
  }, [session]);

  // fetch user profile from supabase
  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  // update user profile in supabase
  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string;
    website: string;
    avatar_url: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* show logo */}
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
      />
      <View style={[styles.verticallySpaced, styles.mt20]}>
        {/* email input (disabled) */}
        <Input
          label="Email"
          labelStyle={styles.label}
          value={session?.user?.email}
          disabled
          style={styles.input}
        />
      </View>
      <View style={styles.verticallySpaced}>
        {/* username input */}
        <Input
          label="Username"
          labelStyle={styles.label}
          value={username || ""}
          onChangeText={(text) => setUsername(text)}
          style={styles.input}
        />
      </View>
      <View style={styles.verticallySpaced}>
        {/* website input */}
        <Input
          label="Website"
          labelStyle={styles.label}
          value={website || ""}
          onChangeText={(text) => setWebsite(text)}
          style={styles.input}
        />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        {/* update button */}
        <Button
          title={loading ? "Loading ..." : "Update"}
          onPress={() =>
            updateProfile({ username, website, avatar_url: avatarUrl })
          }
          disabled={loading}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
        />
      </View>

      <View style={styles.verticallySpaced}>
        {/* sign out button */}
        <Button
          title="Sign Out"
          onPress={async () => {
            await supabase.auth.signOut();
            Alert.alert("Success", "Signed out successfully!");
          }}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
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
  },
  logo: {
    width: 60,
    height: 60,
    marginTop: 40,
    marginBottom: 20,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#1DB954",
    borderRadius: 25,
    paddingVertical: 12,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
});