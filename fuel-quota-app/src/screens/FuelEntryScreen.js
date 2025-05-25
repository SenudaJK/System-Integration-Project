import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { apiService } from "../services/apiService";
import { useLoading } from "../contexts/Loadingcontext";
import { useAuth } from "../contexts/Authcontext";

export default function FuelEntryScreen({ route, navigation }) {
    const { vehicleData, qrData } = route.params;
    const [fuelAmount, setFuelAmount] = useState("");
    const [notes, setNotes] = useState("");
    const [errors, setErrors] = useState({});
    const { user } = useAuth();
    const { showLoading, hideLoading } = useLoading();

    // Animation values
    const fadeAnim = useSharedValue(0);
    const slideAnim = useSharedValue(50);

    useEffect(() => {
        fadeAnim.value = withTiming(1, { duration: 800 });
        slideAnim.value = withSpring(0, { damping: 15 });
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: fadeAnim.value,
            transform: [{ translateY: slideAnim.value }],
        };
    });

    const validateFuelAmount = () => {
        const amount = parseFloat(fuelAmount);
        const newErrors = {};

        if (!fuelAmount.trim()) {
            newErrors.fuelAmount = "Fuel amount is required";
        } else if (isNaN(amount) || amount <= 0) {
            newErrors.fuelAmount = "Please enter a valid fuel amount";
        } else if (amount > vehicleData.weeklyAvailableQuantity) {
            newErrors.fuelAmount = `Amount exceeds available quota (${vehicleData.weeklyAvailableQuantity}L)`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFuelDispense = async () => {
        if (!validateFuelAmount()) return;

        Alert.alert(
            "Confirm Fuel Dispense",
            `Dispense ${fuelAmount}L of ${vehicleData.fuelType} to vehicle ${vehicleData.vehicleNumber}?\n\nOwner: ${vehicleData.owner.firstName} ${vehicleData.owner.lastName}`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Confirm", onPress: processFuelDispense },
            ]
        );
    };

    const processFuelDispense = async () => {
        showLoading("Processing fuel transaction...");

        try {
            // Call the dispense API
            const response = await apiService.dispenseFuel(qrData, parseFloat(fuelAmount));
            
            hideLoading();

            Alert.alert(
                "Transaction Successful",
                `${fuelAmount}L of ${vehicleData.fuelType} dispensed successfully.\n\nRemaining quota: ${response.weeklyAvailableQuantity}L\n\nSMS notification sent to vehicle owner.`,
                [
                    {
                        text: "OK",
                        onPress: () => navigation.navigate("Home"),
                    },
                ]
            );
        } catch (error) {
            hideLoading();
            console.error("Dispense error:", error);
            
            Alert.alert(
                "Transaction Failed",
                error.message || "Failed to process fuel transaction. Please try again.",
                [
                    { text: "Try Again" },
                    { text: "Go Back", onPress: () => navigation.goBack() }
                ]
            );
        }
    };

    const getRemainingQuota = () => {
        const dispensed = parseFloat(fuelAmount) || 0;
        return Math.max(0, vehicleData.weeklyAvailableQuantity - dispensed);
    };

    const getUsedQuota = () => {
        return vehicleData.weeklyQuota - vehicleData.weeklyAvailableQuantity;
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <LinearGradient
                colors={["#1B5E20", "#2E7D32"]}
                style={styles.header}
            >
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Fuel Dispense</Text>
                    <Text style={styles.headerSubtitle}>
                        Enter fuel amount to dispense
                    </Text>
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View style={animatedStyle}>
                    {/* Vehicle Information Card */}
                    <View style={styles.vehicleCard}>
                        <View style={styles.vehicleHeader}>
                            <Ionicons name="car" size={30} color="#2E7D32" />
                            <View style={styles.vehicleInfo}>
                                <Text style={styles.vehicleNumber}>
                                    {vehicleData.vehicleNumber}
                                </Text>
                                <Text style={styles.vehicleType}>
                                    {vehicleData.vehicleTypeName} • {vehicleData.fuelType}
                                </Text>
                            </View>
                            <View style={styles.ownerInfo}>
                                <Text style={styles.ownerName}>
                                    {vehicleData.owner.firstName} {vehicleData.owner.lastName}
                                </Text>
                                <Text style={styles.ownerNic}>
                                    {vehicleData.owner.nic}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Quota Information */}
                    <View style={styles.quotaCard}>
                        <Text style={styles.quotaTitle}>Fuel Quota Information</Text>
                        <View style={styles.quotaRow}>
                            <Text style={styles.quotaLabel}>Weekly Quota:</Text>
                            <Text style={styles.quotaValue}>{vehicleData.weeklyQuota}L</Text>
                        </View>
                        <View style={styles.quotaRow}>
                            <Text style={styles.quotaLabel}>Available:</Text>
                            <Text style={[styles.quotaValue, styles.availableQuota]}>
                                {vehicleData.weeklyAvailableQuantity}L
                            </Text>
                        </View>
                        <View style={styles.quotaRow}>
                            <Text style={styles.quotaLabel}>Used:</Text>
                            <Text style={styles.quotaValue}>
                                {getUsedQuota().toFixed(1)}L
                            </Text>
                        </View>
                    </View>

                    {/* Fuel Entry Form */}
                    <View style={styles.formCard}>
                        <Text style={styles.formTitle}>
                            Fuel Dispense Details
                        </Text>

                        {/* Fuel Amount Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>
                                Fuel Amount (Liters) *
                            </Text>
                            <View
                                style={[
                                    styles.inputContainer,
                                    errors.fuelAmount && styles.inputError,
                                ]}
                            >
                                <Ionicons
                                    name="water-outline"
                                    size={20}
                                    color="#666"
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter fuel amount"
                                    value={fuelAmount}
                                    onChangeText={(text) => {
                                        setFuelAmount(text);
                                        if (errors.fuelAmount) {
                                            setErrors({});
                                        }
                                    }}
                                    keyboardType="numeric"
                                    maxLength={6}
                                />
                                <Text style={styles.inputUnit}>L</Text>
                            </View>
                            {errors.fuelAmount && (
                                <Text style={styles.errorText}>
                                    {errors.fuelAmount}
                                </Text>
                            )}
                        </View>

                        {/* Remaining Quota Display */}
                        <View style={styles.quotaDisplay}>
                            <Text style={styles.quotaDisplayLabel}>
                                Remaining Quota After Dispense:
                            </Text>
                            <Text
                                style={[
                                    styles.quotaDisplayValue,
                                    getRemainingQuota() < 5 &&
                                    styles.quotaDisplayWarning,
                                ]}
                            >
                                {getRemainingQuota().toFixed(1)}L
                            </Text>
                        </View>

                        {/* Notes Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>
                                Notes (Optional)
                            </Text>
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="create-outline"
                                    size={20}
                                    color="#666"
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={[styles.input, styles.notesInput]}
                                    placeholder="Add any notes..."
                                    value={notes}
                                    onChangeText={setNotes}
                                    multiline
                                    numberOfLines={3}
                                    maxLength={200}
                                />
                            </View>
                        </View>

                        {/* Dispense Button */}
                        <TouchableOpacity
                            style={[
                                styles.dispenseButton,
                                (!fuelAmount || errors.fuelAmount) &&
                                styles.dispenseButtonDisabled,
                            ]}
                            onPress={handleFuelDispense}
                            disabled={!fuelAmount || !!errors.fuelAmount}
                        >
                            <LinearGradient
                                colors={
                                    !fuelAmount || errors.fuelAmount
                                        ? ["#ccc", "#999"]
                                        : ["#4CAF50", "#45A049"]
                                }
                                style={styles.buttonGradient}
                            >
                                <Ionicons
                                    name="checkmark-circle"
                                    size={24}
                                    color="#fff"
                                />
                                <Text style={styles.dispenseButtonText}>
                                    Dispense Fuel
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Safety Information */}
                    <View style={styles.safetyCard}>
                        <View style={styles.safetyHeader}>
                            <Ionicons
                                name="shield-checkmark"
                                size={24}
                                color="#FF9800"
                            />
                            <Text style={styles.safetyTitle}>
                                Safety Reminders
                            </Text>
                        </View>
                        <Text style={styles.safetyText}>
                            • Ensure vehicle engine is turned off{"\n"}
                            • No smoking or open flames{"\n"}
                            • Check fuel cap is properly secured{"\n"}
                            • Verify fuel type matches vehicle requirement
                        </Text>
                    </View>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        paddingTop: 50,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        flexDirection: "row",
        alignItems: "center",
    },
    backButton: {
        padding: 8,
        marginRight: 15,
    },
    headerContent: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: "rgba(255, 255, 255, 0.8)",
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    vehicleCard: {
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 20,
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    vehicleHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    vehicleInfo: {
        flex: 1,
        marginLeft: 15,
    },
    vehicleNumber: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    vehicleType: {
        fontSize: 14,
        color: "#666",
        marginTop: 2,
    },
    ownerInfo: {
        alignItems: "flex-end",
    },
    ownerName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    ownerNic: {
        fontSize: 12,
        color: "#666",
        marginTop: 2,
    },
    quotaCard: {
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 20,
        marginTop: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    quotaTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 15,
    },
    quotaRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
    },
    quotaLabel: {
        fontSize: 16,
        color: "#666",
    },
    quotaValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    availableQuota: {
        color: "#4CAF50",
    },
    formCard: {
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 20,
        marginTop: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        backgroundColor: "#fff",
        paddingHorizontal: 15,
        minHeight: 50,
    },
    inputError: {
        borderColor: "#f44336",
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#333",
        paddingVertical: 15,
    },
    notesInput: {
        minHeight: 80,
        textAlignVertical: "top",
    },
    inputUnit: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#666",
        marginLeft: 10,
    },
    errorText: {
        color: "#f44336",
        fontSize: 12,
        marginTop: 5,
        marginLeft: 5,
    },
    quotaDisplay: {
        backgroundColor: "#f8f9fa",
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    quotaDisplayLabel: {
        fontSize: 14,
        color: "#666",
        fontWeight: "bold",
    },
    quotaDisplayValue: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#4CAF50",
    },
    quotaDisplayWarning: {
        color: "#FF9800",
    },
    dispenseButton: {
        borderRadius: 12,
        overflow: "hidden",
        marginTop: 10,
    },
    dispenseButtonDisabled: {
        opacity: 0.6,
    },
    buttonGradient: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 15,
    },
    dispenseButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
    },
    safetyCard: {
        backgroundColor: "#fff3cd",
        borderRadius: 15,
        padding: 20,
        marginTop: 15,
        marginBottom: 30,
        borderLeftWidth: 4,
        borderLeftColor: "#FF9800",
    },
    safetyHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    safetyTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginLeft: 10,
    },
    safetyText: {
        fontSize: 14,
        color: "#666",
        lineHeight: 20,
    },
});
