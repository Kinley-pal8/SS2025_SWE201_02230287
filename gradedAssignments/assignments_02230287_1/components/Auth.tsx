// Auth Component - Written by [Your Name]
import React, { useState, useRef } from "react";
import {
  Alert,
  StyleSheet,
  View,
  AppState,
  Image,
  Text,
  Animated,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { supabase } from "../lib/supabase";
import { Input } from "@rneui/themed";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as Linking from "expo-linking";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // For the back icon

const redirectTo = makeRedirectUri();

// Handle session refresh when app is active - Implemented by [Your Name]
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

// Authentication screen component - Created by [Your Name]
export default function Auth() {
  const route = useRoute();
  const navigation = useNavigation(); // Hook for navigation
  const { method = "email" } = route.params || {};
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  // Animation refs for button press effects - Added by [Your Name]
  const buttonScale = useRef(new Animated.Value(1)).current;
  const resendButtonScale = useRef(new Animated.Value(1)).current;

  // Button press animation - Written by [Your Name]
  const handlePressIn = (scale) => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (scale) => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  // Handle redirect for session (for phone auth) - Implemented by [Your Name]
  const createSessionFromUrl = async (url) => {
    const { params, errorCode } = QueryParams.getQueryParams(url);
    if (errorCode) throw new Error(errorCode);
    const { access_token, refresh_token } = params;
    if (!access_token) return;
    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    if (error) throw error;
    return data.session;
  };

  // Sign up with email and password - Written by [Your Name]
  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert("Please check your inbox (or spam) for email verification!");
      setSignUpSuccess(true);
    }
    setLoading(false);
  }

  // Resend confirmation email - Written by [Your Name]
  async function resendConfirmationEmail() {
    setLoading(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert("Success", "Confirmation email resent! Check your inbox or spam.");
    }
    setLoading(false);
  }

  // Log in with email and password - Written by [Your Name]
  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      if (error.message.includes("Email not confirmed")) {
        Alert.alert("Please confirm your email before logging in.");
      } else {
        Alert.alert(error.message);
      }
    }
    setLoading(false);
  }

  // Send OTP for phone - Written by [Your Name]
  async function sendOtp() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      phone: phone,
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert("Success", "OTP sent to your phone number!");
      setOtpSent(true);
    }
    setLoading(false);
  }

  // Verify the phone OTP - Written by [Your Name]
  async function verifyPhoneOtp() {
    setLoading(true);
    const { data: { session }, error } = await supabase.auth.verifyOtp({
      phone: phone,
      token: otp,
      type: "sms",
    });

    if (error) {
      Alert.alert(error.message);
    } else if (session) {
      setPhone("");
      setOtp("");
      setOtpSent(false);
    }
    setLoading(false);
  }

  // UI rendering - Designed by [Your Name]
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingContainer}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        style={styles.scrollView}
      >
        <View style={styles.container}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Show logo */}
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
          />
          {/* Title */}
          <Text style={styles.title}>
            {method === "email" ? "Email Authentication" : "Phone Login"}
          </Text>
          {method === "email" && (
            <>
              <View style={[styles.verticallySpaced, styles.mt20]}>
                {/* Email input */}
                <Input
                  label="Email"
                  labelStyle={styles.label}
                  leftIcon={{ type: "font-awesome", name: "envelope", color: "#B3B3B3", size: 20 }}
                  onChangeText={(text) => setEmail(text)}
                  value={email}
                  placeholder="email@address.com"
                  placeholderTextColor="#B3B3B3"
                  autoCapitalize={"none"}
                  style={styles.input}
                  containerStyle={styles.inputContainer}
                  inputContainerStyle={styles.inputInnerContainer}
                />
              </View>
              <View style={styles.verticallySpaced}>
                {/* Password input */}
                <Input
                  label="Password"
                  labelStyle={styles.label}
                  leftIcon={{ type: "font-awesome", name: "lock", color: "#B3B3B3", size: 20 }}
                  onChangeText={(text) => setPassword(text)}
                  value={password}
                  secureTextEntry={true}
                  placeholder="Password"
                  placeholderTextColor="#B3B3B3"
                  autoCapitalize={"none"}
                  style={styles.input}
                  containerStyle={styles.inputContainer}
                  inputContainerStyle={styles.inputInnerContainer}
                />
              </View>
              {/* Always show Sign Up and Log In buttons */}
              <View style={[styles.verticallySpaced, styles.mt20]}>
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                  <TouchableOpacity
                    onPressIn={() => handlePressIn(buttonScale)}
                    onPressOut={() => handlePressOut(buttonScale)}
                    onPress={() => signUpWithEmail()}
                    disabled={loading}
                    activeOpacity={1}
                  >
                    <View style={styles.button}>
                      {loading ? (
                        <Text style={styles.buttonTitle}>Loading...</Text>
                      ) : (
                        <Text style={styles.buttonTitle}>Sign Up</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              </View>
              <View style={[styles.verticallySpaced, styles.mt20]}>
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                  <TouchableOpacity
                    onPressIn={() => handlePressIn(buttonScale)}
                    onPressOut={() => handlePressOut(buttonScale)}
                    onPress={() => signInWithEmail()}
                    disabled={loading}
                    activeOpacity={1}
                  >
                    <View style={styles.button}>
                      {loading ? (
                        <Text style={styles.buttonTitle}>Loading...</Text>
                      ) : (
                        <Text style={styles.buttonTitle}>Log In</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              </View>
              {signUpSuccess && (
                <>
                  <View style={[styles.verticallySpaced, styles.mt20]}>
                    {/* Message after sign up */}
                    <Text style={styles.message}>
                      Waiting for email confirmation...
                    </Text>
                  </View>
                  <View style={[styles.verticallySpaced, styles.mt20]}>
                    {/* Button to resend confirmation email */}
                    <Animated.View style={{ transform: [{ scale: resendButtonScale }] }}>
                      <TouchableOpacity
                        onPressIn={() => handlePressIn(resendButtonScale)}
                        onPressOut={() => handlePressOut(resendButtonScale)}
                        onPress={() => resendConfirmationEmail()}
                        disabled={loading}
                        activeOpacity={1}
                      >
                        <View style={[styles.button, styles.resendButton]}>
                          {loading ? (
                            <Text style={[styles.buttonTitle, styles.resendButtonTitle]}>Loading...</Text>
                          ) : (
                            <Text style={[styles.buttonTitle, styles.resendButtonTitle]}>Resend Confirmation Email</Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  </View>
                </>
              )}
            </>
          )}
          {method === "phone" && !otpSent && (
            <View style={[styles.verticallySpaced, styles.mt20]}>
              {/* Phone input */}
              <Input
                label="Phone Number"
                labelStyle={styles.label}
                leftIcon={{ type: "font-awesome", name: "phone", color: "#B3B3B3", size: 20 }}
                onChangeText={(text) => setPhone(text)}
                value={phone}
                placeholder="+12345678901"
                placeholderTextColor="#B3B3B3"
                autoCapitalize={"none"}
                keyboardType="phone-pad"
                style={styles.input}
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.inputInnerContainer}
              />
            </View>
          )}
          {method === "phone" && otpSent && (
            <View style={[styles.verticallySpaced, styles.mt20]}>
              {/* OTP input for phone */}
              <Input
                label="OTP"
                labelStyle={styles.label}
                leftIcon={{ type: "font-awesome", name: "lock", color: "#B3B3B3", size: 20 }}
                onChangeText={(text) => setOtp(text)}
                value={otp}
                placeholder="Enter 6-digit OTP"
                placeholderTextColor="#B3B3B3"
                autoCapitalize={"none"}
                keyboardType="numeric"
                style={styles.input}
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.inputInnerContainer}
              />
            </View>
          )}
          {method === "phone" && !otpSent && (
            <View style={[styles.verticallySpaced, styles.mt20]}>
              {/* Button to send OTP */}
              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity
                  onPressIn={() => handlePressIn(buttonScale)}
                  onPressOut={() => handlePressOut(buttonScale)}
                  onPress={() => sendOtp()}
                  disabled={loading || !phone}
                  activeOpacity={1}
                >
                  <View style={styles.button}>
                    {loading ? (
                      <Text style={styles.buttonTitle}>Loading...</Text>
                    ) : (
                      <Text style={styles.buttonTitle}>Send OTP</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </View>
          )}
          {method === "phone" && otpSent && (
            <View style={[styles.verticallySpaced, styles.mt20]}>
              {/* Button to verify OTP */}
              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity
                  onPressIn={() => handlePressIn(buttonScale)}
                  onPressOut={() => handlePressOut(buttonScale)}
                  onPress={() => verifyPhoneOtp()}
                  disabled={loading || !otp}
                  activeOpacity={1}
                >
                  <View style={styles.button}>
                    {loading ? (
                      <Text style={styles.buttonTitle}>Loading...</Text>
                    ) : (
                      <Text style={styles.buttonTitle}>Verify OTP</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Styles for Auth component - Designed by [Your Name]
const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: "#121212", // Ensure dark background
  },
  scrollView: {
    backgroundColor: "#121212", // Ensure dark background
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    paddingHorizontal: 20,
    backgroundColor: "#121212",
    alignItems: "center",
    paddingVertical: 40,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 30,
    letterSpacing: 0.5,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  inputContainer: {
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  inputInnerContainer: {
    borderBottomWidth: 0,
  },
  message: {
    color: "#B3B3B3",
    fontSize: 14,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#1DB954",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  resendButton: {
    backgroundColor: "#FFFFFF",
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  resendButtonTitle: {
    color: "#121212",
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