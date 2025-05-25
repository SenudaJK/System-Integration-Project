import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CustomInput({
    label,
    placeholder,
    value,
    onChangeText,
    error,
    secureTextEntry = false,
    icon,
    rightIcon,
    onRightIconPress,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
    autoCorrect = true,
    multiline = false,
    numberOfLines = 1,
    maxLength,
    editable = true,
    style,
    inputStyle,
    ...props
}) {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View style={[
                styles.inputContainer,
                isFocused && styles.focusedInputContainer,
                error && styles.errorInputContainer,
                !editable && styles.disabledInputContainer,
            ]}>
                {icon && (
                    <Ionicons
                        name={icon}
                        size={20}
                        color={isFocused ? '#2E7D32' : '#666'}
                        style={styles.leftIcon}
                    />
                )}

                <TextInput
                    style={[styles.input, inputStyle]}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    secureTextEntry={secureTextEntry && !isPasswordVisible}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    autoCorrect={autoCorrect}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    maxLength={maxLength}
                    editable={editable}
                    placeholderTextColor="#999"
                    {...props}
                />

                {secureTextEntry && (
                    <TouchableOpacity
                        onPress={togglePasswordVisibility}
                        style={styles.rightIcon}
                    >
                        <Ionicons
                            name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
                            size={20}
                            color="#666"
                        />
                    </TouchableOpacity>
                )}

                {rightIcon && !secureTextEntry && (
                    <TouchableOpacity
                        onPress={onRightIconPress}
                        style={styles.rightIcon}
                    >
                        <Ionicons name={rightIcon} size={20} color="#666" />
                    </TouchableOpacity>
                )}
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        minHeight: 50,
    },
    focusedInputContainer: {
        borderColor: '#2E7D32',
        shadowColor: '#2E7D32',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    errorInputContainer: {
        borderColor: '#f44336',
    },
    disabledInputContainer: {
        backgroundColor: '#f5f5f5',
        opacity: 0.7,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        paddingVertical: 15,
    },
    leftIcon: {
        marginRight: 10,
    },
    rightIcon: {
        marginLeft: 10,
        padding: 5,
    },
    errorText: {
        color: '#f44336',
        fontSize: 12,
        marginTop: 5,
        marginLeft: 5,
    },
});