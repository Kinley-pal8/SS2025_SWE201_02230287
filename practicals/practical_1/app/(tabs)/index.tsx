import React, { useMemo, useCallback, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import Swiper from "react-native-swiper";

const OnboardingScreen = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);

  // Content for each slide
  const slides = useMemo(() => [
    {
      image: require("../../assets/welcome.png"),
      title: "Welcome to Gojek!",
      subtitle: "Your go-to app for a hassle-free life. We're here to help with all your needs anytime, anywhere."
    },
    {
      image: require("../../assets/transport.png"),
      title: "Get rides on demand",
      subtitle: "Book a car or motorcycle ride to your destination quickly and affordably."
    },
    {
      image: require("../../assets/food.png"),
      title: "Order food & groceries",
      subtitle: "Get your favorite meals and daily essentials delivered right to your doorstep."
    },
    {
      image: require("../../assets/payment.png"),
      title: "Get going with us",
      subtitle: "Book a ride, order food, send packages, and more with Gojek."
    },
  ], []);

  // Memoize handlers to prevent recreating functions on re-renders
  const handleLogin = useCallback(() => {
    router.push("/login");
  }, [router]);

  const handleSignup = useCallback(() => {
    router.push("/signup");
  }, [router]);

  const handleSwiperIndexChanged = useCallback((index) => {
    setCurrentPage(index);
  }, []);

  // Memoize the slide rendering function
  const renderSlides = useMemo(() => 
    slides.map((slide, index) => (
      <View key={index} style={styles.slide}>
        <Image source={slide.image} style={styles.image} />
      </View>
    )), 
  [slides]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        {/* Gojek Logo */}
        <Image source={require("../../assets/gojek-logo.png")} style={styles.logo} />
        
        {/* Language Selection Button */}
        <TouchableOpacity style={styles.languageButton}>
          <Text style={styles.languageText}>🌐 English</Text>
        </TouchableOpacity>
      </View>
      
      {/* Swiper */}
      <View style={styles.swiperContainer}>
        <Swiper
          style={styles.wrapper}
          showsButtons={false}
          autoplay={true}
          autoplayTimeout={4}
          dotStyle={styles.dot}
          activeDotStyle={styles.activeDot}
          removeClippedSubviews={true}
          loop={true}
          onIndexChanged={handleSwiperIndexChanged}
        >
          {renderSlides}
        </Swiper>
      </View>

      {/* Title & Subtitle - Dynamic based on current slide */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{slides[currentPage].title}</Text>
        <Text style={styles.subtitle}>{slides[currentPage].subtitle}</Text>
      </View>

      {/* Buttons Container */}
      <View style={styles.buttonContainer}>
        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}> 
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>

        {/* Signup Button */}
        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupText}>I'm new, sign me up</Text>
        </TouchableOpacity>
      </View>
      
      {/* Footer */}
      <View style={styles.footerContainer}>
        <Text style={styles.footer}>
          By logging in or registering, you agree to our{" "}
          <Text style={styles.link}>Terms of Service</Text> and{" "}
          <Text style={styles.link}>Privacy Policy</Text>.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  logo: {
    width: 120,
    height: 30,
    resizeMode: "contain",
  },
  languageButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
  },
  languageText: {
    fontSize: 14,
  },
  swiperContainer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 320,
    height: 280,
    resizeMode: "contain",
  },
  dot: {
    backgroundColor: "#D9D9D9",
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  activeDot: {
    backgroundColor: "#00AA13",
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  textContainer: {
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    lineHeight: 22,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    width: "100%",
  },
  loginButton: {
    backgroundColor: "#00AA13",
    width: "100%",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupButton: {
    width: "100%",
    padding: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#00AA13",
    alignItems: "center",
    marginBottom: 20,
  },
  signupText: {
    fontSize: 18,
    color: "#00AA13",
    fontWeight: "bold",
  },
  footerContainer: {
    paddingHorizontal: 40,
    position: "absolute",
    bottom: 40,
    width: "100%",
  },
  footer: {
    fontSize: 12,
    textAlign: "center",
    color: "#666",
    lineHeight: 18,
  },
  link: {
    color: "#00AA13",
  },
});

export default React.memo(OnboardingScreen);