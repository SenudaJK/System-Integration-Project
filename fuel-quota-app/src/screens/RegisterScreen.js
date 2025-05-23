import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useLoading } from '../contexts/LoadingContext';

export default function RegisterScreen({ navigation }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        stationName: '',
        stationAddress: '',
        licenseNumber: '',
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register } = useAuth();
    const { showLoading, hideLoading } = useLoading();

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.stationName.trim()) newErrors.stationName = 'Station name is required';
        if (!formData.stationAddress.trim()) newErrors.stationAddress = 'Station address is required';
        if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        showLoading('Creating account...');

        // Mock registration - replace with actual API call
        setTimeout(() => {
            hideLoading();
            Alert.alert(
                'Registration Successful',
                'Your account has been created successfully. Please login.',
                [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
            );
        }, 2000);
    };

    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <LinearGradient
                colors={['#1B5E20', '#2E7D32']}
                style={styles.gradient}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.formContainer}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Register as a fuel station operator</Text>

                        {/* Personal Information */}
                        <Text style={styles.sectionTitle}>Personal Information</Text>

                        <View style={styles.inputRow}>
                            <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                                <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, errors.firstName && styles.inputError]}
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChangeText={(value) => updateFormData('firstName', value)}
                                />
                            </View>
                        </View>
                        <View style={styles.inputRow}>
                            <View style={[styles.inputContainer, { flex: 1 }]}>
                                <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, errors.lastName && styles.inputError]}
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChangeText={(value) => updateFormData('lastName', value)}
                                />
                            </View>
                        </View>
                        {(errors.firstName || errors.lastName) && (
                            <Text style={styles.errorText}>
                                {errors.firstName || errors.lastName}
                            </Text>
                        )}

                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, errors.email && styles.inputError]}
                                placeholder="Email Address"
                                value={formData.email}
                                onChangeText={(value) => updateFormData('email', value)}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                        <View style={styles.inputContainer}>
                            <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, errors.phone && styles.inputError]}
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChangeText={(value) => updateFormData('phone', value)}
                                keyboardType="phone-pad"
                            />
                        </View>
                        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

                        {/* Password Section */}
                        <Text style={styles.sectionTitle}>Security</Text>

                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, errors.password && styles.inputError]}
                                placeholder="Password"
                                value={formData.password}
                                onChangeText={(value) => updateFormData('password', value)}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                <Ionicons
                                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                                    size={20}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, errors.confirmPassword && styles.inputError]}
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChangeText={(value) => updateFormData('confirmPassword', value)}
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={styles.eyeIcon}
                            >
                                <Ionicons
                                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                                    size={20}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

                        {/* Station Information */}
                        <Text style={styles.sectionTitle}>Station Information</Text>

                        <View style={styles.inputContainer}>
                            <Ionicons name="business-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, errors.stationName && styles.inputError]}
                                placeholder="Fuel Station Name"
                                value={formData.stationName}
                                onChangeText={(value) => updateFormData('stationName', value)}
                            />
                        </View>
                        {errors.stationName && <Text style={styles.errorText}>{errors.stationName}</Text>}

                        <View style={styles.inputContainer}>
                            <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, errors.stationAddress && styles.inputError]}
                                placeholder="Station Address"
                                value={formData.stationAddress}
                                onChangeText={(value) => updateFormData('stationAddress', value)}
                                multiline
                            />
                        </View>
                        {errors.stationAddress && <Text style={styles.errorText}>{errors.stationAddress}</Text>}

                        <View style={styles.inputContainer}>
                            <Ionicons name="document-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, errors.licenseNumber && styles.inputError]}
                                placeholder="License Number"
                                value={formData.licenseNumber}
                                onChangeText={(value) => updateFormData('licenseNumber', value)}
                            />
                        </View>
                        {errors.licenseNumber && <Text style={styles.errorText}>{errors.licenseNumber}</Text>}

                        {/* Register Button */}
                        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                            <LinearGradient
                                colors={['#4CAF50', '#45A049']}
                                style={styles.buttonGradient}
                            >
                                <Text style={styles.registerButtonText}>Create Account</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Login Link */}
                        <TouchableOpacity
                            style={styles.loginLink}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={styles.loginText}>
                                Already have an account? <Text style={styles.loginTextBold}>Sign In</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 20,
    },
    formContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        margin: 20,
        borderRadius: 20,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2E7D32',
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginTop: 20,
        marginBottom: 15,
    },
    inputRow: {
        flexDirection: 'row',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        marginBottom: 5,
        backgroundColor: '#fff',
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
        borderColor: '#f44336',
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
        padding: 5,
    },
    errorText: {
        color: '#f44336',
        fontSize: 12,
        marginBottom: 10,
        marginLeft: 5,
    },
    registerButton: {
        marginTop: 30,
        borderRadius: 12,
        overflow: 'hidden',
    },
    buttonGradient: {
        paddingVertical: 15,
        alignItems: 'center',
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginLink: {
        marginTop: 20,
        alignItems: 'center',
    },
    loginText: {
        color: '#666',
        fontSize: 14,
    },
    loginTextBold: {
        color: '#2E7D32',
        fontWeight: 'bold',
    },
});