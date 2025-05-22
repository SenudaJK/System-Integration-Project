import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { updateFuelAmount } from '../api/apiService';
import QuotaDetails from '../components/QuotaDetails';

const FuelUpdateScreen = ({ route, navigation }) => {
    const {
        vehicleId,
        vehicleNumber,
        ownerName,
        availableQuota,
        fuelType
    } = route.params;

    const [fuelAmount, setFuelAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!fuelAmount || isNaN(fuelAmount) || parseFloat(fuelAmount) <= 0) {
            Alert.alert('Error', 'Please enter a valid fuel amount');
            return;
        }

        const amount = parseFloat(fuelAmount);

        if (amount > availableQuota) {
            Alert.alert('Error', `The amount exceeds available quota (${availableQuota}L)`);
            return;
        }

        try {
            setLoading(true);

            await updateFuelAmount(vehicleId, amount);

            Alert.alert(
                'Success',
                `Successfully dispensed ${amount}L of fuel to vehicle ${vehicleNumber}`,
                [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
            );
        } catch (error) {
            console.error('Failed to update fuel amount:', error);
            Alert.alert('Error', 'Failed to update fuel amount. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <QuotaDetails
                    vehicleNumber={vehicleNumber}
                    ownerName={ownerName}
                    availableQuota={availableQuota}
                    fuelType={fuelType}
                />

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Enter Fuel Amount (Liters)</Text>
                    <TextInput
                        style={styles.input}
                        value={fuelAmount}
                        onChangeText={setFuelAmount}
                        placeholder="0.0"
                        keyboardType="decimal-pad"
                        autoFocus
                    />
                </View>

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitButtonText}>Confirm Fuel Dispensed</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => navigation.navigate('Home')}
                    disabled={loading}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        padding: 20,
    },
    inputContainer: {
        marginTop: 20,
        marginBottom: 30,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
        color: '#333',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 18,
    },
    submitButton: {
        backgroundColor: '#28a745',
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
        marginBottom: 15,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cancelButtonText: {
        color: '#333',
        fontSize: 16,
    },
});

export default FuelUpdateScreen;