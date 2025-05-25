import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { useAuth } from "../contexts/Authcontext";
import { useLoading } from "../contexts/Loadingcontext";
import { validateEmail, validatePassword, getValidationErrorMessage } from "../utils/validation";

const { width, height } = Dimensions.get("window");

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const { login, isAuthenticated } = useAuth();
    const { showLoading, hideLoading } = useLoading();

    // Animations
    const fadeAnim = useSharedValue(0);
    const slideAnim = useSharedValue(50);

    useEffect(() => {
        // Animate in
        fadeAnim.value = withTiming(1, { duration: 1000 });
        slideAnim.value = withSpring(0, { damping: 15 });
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            navigation.replace("Home");
        }
    }, [isAuthenticated]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: fadeAnim.value,
            transform: [{ translateY: slideAnim.value }],
        };
    });

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(email.trim())) {
            newErrors.email = "Please enter a valid email address";
        }

        // Password validation
        if (!password.trim()) {
            newErrors.password = "Password is required";
        } else if (!validatePassword(password.trim())) {
            newErrors.password = getValidationErrorMessage('password', password.trim()) ||
                "Password must be 8+ characters with uppercase, lowercase, digit, and special character";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        showLoading("Signing in...");

        const result = await login({
            email: email.trim(),
            password: password.trim(),
        });

        hideLoading();

        if (!result.success) {
            Alert.alert("Login Failed", result.error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={["#1B5E20", "#2E7D32", "#4CAF50"]}
                style={styles.gradient}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardView}
                >
                    <Animated.View style={[styles.content, animatedStyle]}>
                        {/* Logo Section */}
                        <View style={styles.logoContainer}>
                            <View style={styles.logoCircle}>
                                <Ionicons name="car" size={50} color="#fff" />
                            </View>
                            <Text style={styles.title}>Fuel Station</Text>
                            <Text style={styles.subtitle}>Operator Portal</Text>
                        </View>

                        {/* Form Section */}
                        <View style={styles.formContainer}>
                            {/* Email Input */}
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="mail-outline"
                                    size={20}
                                    color="#666"
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={[
                                        styles.input,
                                        errors.email && styles.inputError,
                                    ]}
                                    placeholder="Email Address"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                            {errors.email && (
                                <Text style={styles.errorText}>
                                    {errors.email}
                                </Text>
                            )}

                            {/* Password Input */}
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="lock-closed-outline"
                                    size={20}
                                    color="#666"
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={[
                                        styles.input,
                                        errors.password && styles.inputError,
                                    ]}
                                    placeholder="Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity
                                    onPress={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons
                                        name={
                                            showPassword
                                                ? "eye-outline"
                                                : "eye-off-outline"
                                        }
                                        size={20}
                                        color="#666"
                                    />
                                </TouchableOpacity>
                            </View>
                            {errors.password && (
                                <Text style={styles.errorText}>
                                    {errors.password}
                                </Text>
                            )}

                            {/* Password Requirements */}
                            <View style={styles.passwordRequirements}>
                                <Text style={styles.requirementsTitle}>Password must contain:</Text>
                                <Text style={styles.requirementItem}>• At least 8 characters</Text>
                                <Text style={styles.requirementItem}>• One uppercase letter (A-Z)</Text>
                                <Text style={styles.requirementItem}>• One lowercase letter (a-z)</Text>
                                <Text style={styles.requirementItem}>• One digit (0-9)</Text>
                                <Text style={styles.requirementItem}>• One special character (!@#$%^&*)</Text>
                            </View>

                            {/* Login Button */}
                            <TouchableOpacity
                                style={styles.loginButton}
                                onPress={handleLogin}
                            >
                                <LinearGradient
                                    colors={["#4CAF50", "#45A049"]}
                                    style={styles.buttonGradient}
                                >
                                    <Text style={styles.loginButtonText}>
                                        Sign In
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* Register Link */}
                            <TouchableOpacity
                                style={styles.registerLink}
                                onPress={() => navigation.navigate("Register")}
                            >
                                <Text style={styles.registerText}>
                                    Don't have an account?{" "}
                                    <Text style={styles.registerTextBold}>
                                        Register
                                    </Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </KeyboardAvoidingView>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 30,
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 50,
    },
    logoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.8)",
    },
    formContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: 20,
        padding: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        marginBottom: 5,
        backgroundColor: "#fff",
    },
    inputIcon: {
        marginLeft: 15,
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 15,
        paddingRight: 50,
        fontSize: 16,
    },
    inputError: {
        borderColor: "#f44336",
    },
    eyeIcon: {
        position: "absolute",
        right: 15,
        padding: 5,
    },
    errorText: {
        color: "#f44336",
        fontSize: 12,
        marginBottom: 10,
        marginLeft: 5,
    },
    passwordRequirements: {
        backgroundColor: "#f5f5f5",
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        marginTop: 10,
    },
    requirementsTitle: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    requirementItem: {
        fontSize: 11,
        color: "#666",
        lineHeight: 16,
    },
    loginButton: {
        marginTop: 20,
        borderRadius: 12,
        overflow: "hidden",
    },
    buttonGradient: {
        paddingVertical: 15,
        alignItems: "center",
    },
    loginButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    registerLink: {
        marginTop: 20,
        alignItems: "center",
    },
    registerText: {
        color: "#666",
        fontSize: 14,
    },
    registerTextBold: {
        color: "#2E7D32",
        fontWeight: "bold",
    },
});