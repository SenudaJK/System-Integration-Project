import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { getVehicleQuota } from '../api/apiService';

const ScanScreen = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = async ({ type, data }) => {
        try {
            setScanned(true);
            setLoading(true);

            // Assume data contains the vehicle ID from QR code
            const vehicleId = data;

            // Fetch vehicle quota details
            const quotaDetails = await getVehicleQuota(vehicleId);

            // Navigate to fuel update screen with the vehicle and quota details
            navigation.replace('FuelUpdate', {
                vehicleId,
                vehicleNumber: quotaDetails.vehicleNumber,
                ownerName: quotaDetails.ownerName,
                availableQuota: quotaDetails.availableQuota,
                fuelType: quotaDetails.fuelType
            });
        } catch (error) {
            console.error('Failed to process QR code:', error);
            Alert.alert(
                'Error',
                'Failed to get vehicle details. Please try again.',
                [{ text: 'OK', onPress: () => setScanned(false) }]
            );
        } finally {
            setLoading(false);
        }
    };

    if (hasPermission === null) {
        return <ActivityIndicator size="large" color="#007BFF" style={styles.center} />;
    }

    if (hasPermission === false) {
        return (
            <View style={styles.center}>
                <Text style={styles.permissionText}>No access to camera</Text>
                <TouchableOpacity
                    style={styles.permissionButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.permissionButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />

            <View style={styles.overlay}>
                <View style={styles.scanArea} />
            </View>

            <View style={styles.instructionContainer}>
                <Text style={styles.instructionText}>
                    Align the QR code within the square
                </Text>
            </View>

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loadingText}>Loading vehicle details...</Text>
                </View>
            )}

            {scanned && !loading && (
                <TouchableOpacity
                    style={styles.rescanButton}
                    onPress={() => setScanned(false)}
                >
                    <Text style={styles.rescanButtonText}>Scan Again</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    permissionText: {
        fontSize: 18,
        marginBottom: 20,
    },
    permissionButton: {
        backgroundColor: '#007BFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    permissionButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    scanArea: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: '#fff',
        backgroundColor: 'transparent',
    },
    instructionContainer: {
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    instructionText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    loadingText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 10,
    },
    rescanButton: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        backgroundColor: '#007BFF',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 5,
    },
    rescanButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ScanScreen;