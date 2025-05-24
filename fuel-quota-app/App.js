import React, { useEffect, useState, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

// Import screens
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import QRScannerScreen from "./src/screens/QRScannerScreen";
import FuelEntryScreen from "./src/screens/FuelEntryScreen";
import TransactionHistoryScreen from "./src/screens/TransactionHistoryScreen";
import ProfileScreen from "./src/screens/ProfileScreen";

// Import contexts
import { AuthProvider, useAuth } from "./src/contexts/Authcontext";
import { LoadingProvider } from "./src/contexts/Loadingcontext";

const Stack = createStackNavigator();

function AppNavigator() {
    const navigationRef = useRef();
    const { setNavigation, isAuthenticated } = useAuth();

    useEffect(() => {
        if (navigationRef.current) {
            setNavigation(navigationRef.current);
        }
    }, [navigationRef.current]);

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
                initialRouteName={isAuthenticated ? "Home" : "Login"}
                screenOptions={{
                    headerStyle: {
                        backgroundColor: "#2E7D32",
                    },
                    headerTintColor: "#fff",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                }}
            >
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{ title: "Register" }}
                />
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="QRScanner"
                    component={QRScannerScreen}
                    options={{ title: "Scan QR Code" }}
                />
                <Stack.Screen
                    name="FuelEntry"
                    component={FuelEntryScreen}
                    options={{ title: "Fuel Entry" }}
                />
                <Stack.Screen
                    name="TransactionHistory"
                    component={TransactionHistoryScreen}
                    options={{ title: "Transaction History" }}
                />
                <Stack.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{ title: "Profile" }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                await SplashScreen.preventAutoHideAsync();

                // Pre-load fonts, make any API calls you need to do here
                await Font.loadAsync({
                    // Add any custom fonts here
                });

                // Artificially delay for demo purposes
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (e) {
                console.warn(e);
            } finally {
                setAppIsReady(true);
            }
        }

        prepare();
    }, []);

    useEffect(() => {
        if (appIsReady) {
            SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <LoadingProvider>
                <AuthProvider>
                    <AppNavigator />
                    <StatusBar style="light" />
                </AuthProvider>
            </LoadingProvider>
        </SafeAreaProvider>
    );
}