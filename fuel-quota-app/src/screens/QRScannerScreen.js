import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Dimensions,
    SafeAreaView,
} from "react-native";
import { CameraView, Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    interpolate,
} from "react-native-reanimated";
import { apiService } from "../services/apiService";
import { useLoading } from "../contexts/Loadingcontext";

const { width, height } = Dimensions.get("window");

export default function QRScannerScreen({ navigation }) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [flashOn, setFlashOn] = useState(false);
    const { showLoading, hideLoading } = useLoading();

    // Animation for scanning line
    const scanLineAnim = useSharedValue(0);

    useEffect(() => {
        getCameraPermissions();
        startScanAnimation();
    }, []);

    const getCameraPermissions = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
    };

    const startScanAnimation = () => {
        scanLineAnim.value = withRepeat(
            withTiming(1, { duration: 2000 }),
            -1,
            true
        );
    };

    const scanLineStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        scanLineAnim.value,
                        [0, 1],
                        [0, 200]
                    ),
                },
            ],
        };
    });

    const handleBarcodeScanned = async ({ type, data }) => {
        if (scanned) return;

        setScanned(true);
        showLoading("Scanning QR code...");

        try {
            console.log("Scanned QR type:", type);
            console.log("Scanned QR data:", data);
            
            // Send the scanned data directly to the backend
            // The backend will validate if it's a valid QR code
            const vehicleData = await apiService.scanQRCode(data);
            
            hideLoading();

            if (vehicleData && vehicleData.weeklyAvailableQuantity > 0) {
                // Navigate to fuel entry screen with vehicle data
                navigation.navigate("FuelEntry", {
                    vehicleData: vehicleData,
                    qrData: data, // Pass the actual scanned QR code
                });
            } else {
                Alert.alert(
                    "No Quota Available",
                    "This vehicle has no fuel quota available for this period.",
                    [{ text: "OK", onPress: () => setScanned(false) }]
                );
            }
        } catch (error) {
            hideLoading();
            console.error("QR scan error:", error);
            
            Alert.alert(
                "Scan Failed",
                error.message || "Invalid QR code. Please scan a valid fuel quota QR code.",
                [{ text: "OK", onPress: () => setScanned(false) }]
            );
        }
    };

    const resetScanner = () => {
        setScanned(false);
    };

    const toggleFlash = () => {
        setFlashOn(!flashOn);
    };

    if (hasPermission === null) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>
                    Requesting camera permission...
                </Text>
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View style={styles.permissionContainer}>
                <Ionicons name="camera-outline" size={80} color="#ccc" />
                <Text style={styles.permissionText}>
                    Camera permission denied
                </Text>
                <Text style={styles.permissionSubtext}>
                    Please enable camera access in settings to scan QR codes
                </Text>
                <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={getCameraPermissions}
                >
                    <Text style={styles.settingsButtonText}>
                        Grant Permission
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                flash={flashOn ? "on" : "off"}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr", "pdf417"],
                }}
            />

            {/* Overlay */}
            <View style={styles.overlay}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Scan QR Code</Text>
                    <TouchableOpacity
                        style={styles.flashButton}
                        onPress={toggleFlash}
                    >
                        <Ionicons
                            name={flashOn ? "flash" : "flash-off"}
                            size={24}
                            color="#fff"
                        />
                    </TouchableOpacity>
                </View>

                {/* Scanning Area */}
                <View style={styles.scanningArea}>
                    <View style={styles.scanFrame}>
                        {/* Corner indicators */}
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />

                        {/* Animated scanning line */}
                        <Animated.View
                            style={[styles.scanLine, scanLineStyle]}
                        />
                    </View>
                </View>

                {/* Instructions */}
                <View style={styles.instructionsContainer}>
                    <Text style={styles.instructionsTitle}>
                        Position the QR code within the frame
                    </Text>
                    <Text style={styles.instructionsText}>
                        Make sure the QR code is clearly visible and well-lit
                    </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    {scanned && (
                        <TouchableOpacity
                            style={styles.rescanButton}
                            onPress={resetScanner}
                        >
                            <Ionicons name="refresh" size={20} color="#fff" />
                            <Text style={styles.rescanButtonText}>
                                Scan Again
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    permissionContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    permissionText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        marginTop: 20,
    },
    permissionSubtext: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginTop: 10,
        lineHeight: 20,
    },
    settingsButton: {
        backgroundColor: "#4CAF50",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 20,
    },
    settingsButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    overlay: {
        flex: 1,
        backgroundColor: "transparent",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    backButton: {
        padding: 10,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    flashButton: {
        padding: 10,
    },
    scanningArea: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    scanFrame: {
        width: 250,
        height: 250,
        position: "relative",
    },
    corner: {
        position: "absolute",
        width: 30,
        height: 30,
        borderColor: "#4CAF50",
        borderWidth: 3,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderBottomWidth: 0,
        borderRightWidth: 0,
    },
    topRight: {
        top: 0,
        right: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderTopWidth: 0,
        borderRightWidth: 0,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
    },
    scanLine: {
        position: "absolute",
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: "#4CAF50",
        opacity: 0.8,
    },
    instructionsContainer: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    instructionsTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    instructionsText: {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: 14,
        textAlign: "center",
        lineHeight: 20,
    },
    actionButtons: {
        paddingHorizontal: 20,
        paddingBottom: 30,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    rescanButton: {
        backgroundColor: "#4CAF50",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 15,
        borderRadius: 12,
    },
    rescanButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8,
    },
});
