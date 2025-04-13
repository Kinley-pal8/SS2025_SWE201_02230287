import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { supabase } from "./lib/supabase";
import { Session } from "@supabase/supabase-js";
import SignUpOrLogIn from "./components/SignUpOrLogIn";
import Auth from "./components/Auth";
import Account from "./components/Account";
import Home from "./components/Home";
import Splash from "./components/Splash";

const Stack = createStackNavigator();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // get the session when app starts
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // listen for login/logout changes
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session && session.user ? (
          <>
            {/* show home and account if logged in */}
            <Stack.Screen
              name="Home"
              children={() => <Home session={session} />}
            />
            <Stack.Screen
              name="Account"
              children={({ route }) => <Account session={route.params.session} />}
            />
          </>
        ) : (
          <>
            {/* show splash, signup, and auth if not logged in */}
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="SignUpOrLogIn" component={SignUpOrLogIn} />
            <Stack.Screen name="Auth" component={Auth} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}