import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function CustomButton({
    title,
    onPress,
    loading = false,
    disabled = false,
    variant = 'primary',
    size = 'medium',
    icon,
    style,
    textStyle,
    gradient = false,
    ...props
}) {
    const isDisabled = disabled || loading;

    const getButtonStyle = () => {
        let baseStyle = [styles.button];

        if (size === 'small') {
            baseStyle.push(styles.smallButton);
        } else if (size === 'large') {
            baseStyle.push(styles.largeButton);
        }

        if (variant === 'primary') {
            baseStyle.push(styles.primaryButton);
        } else if (variant === 'secondary') {
            baseStyle.push(styles.secondaryButton);
        } else if (variant === 'outline') {
            baseStyle.push(styles.outlineButton);
        } else if (variant === 'danger') {
            baseStyle.push(styles.dangerButton);
        }

        if (isDisabled) {
            baseStyle.push(styles.disabledButton);
        }

        return baseStyle;
    };

    const getTextStyle = () => {
        let baseStyle = [styles.buttonText];

        if (size === 'small') {
            baseStyle.push(styles.smallButtonText);
        } else if (size === 'large') {
            baseStyle.push(styles.largeButtonText);
        }

        if (variant === 'primary') {
            baseStyle.push(styles.primaryButtonText);
        } else if (variant === 'secondary') {
            baseStyle.push(styles.secondaryButtonText);
        } else if (variant === 'outline') {
            baseStyle.push(styles.outlineButtonText);
        } else if (variant === 'danger') {
            baseStyle.push(styles.dangerButtonText);
        }

        return baseStyle;
    };

    const renderContent = () => (
        <View style={styles.buttonContent}>
            {loading && (
                <ActivityIndicator
                    size="small"
                    color={variant === 'outline' ? '#2E7D32' : '#fff'}
                    style={styles.loader}
                />
            )}
            {icon && !loading && (
                <Ionicons
                    name={icon}
                    size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
                    color={variant === 'outline' ? '#2E7D32' : '#fff'}
                    style={styles.icon}
                />
            )}
            <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
        </View>
    );

    if (gradient && variant === 'primary') {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={isDisabled}
                activeOpacity={0.8}
                {...props}
            >
                <LinearGradient
                    colors={['#4CAF50', '#45A049']}
                    style={[...getButtonStyle(), style]}
                >
                    {renderContent()}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            style={[...getButtonStyle(), style]}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.8}
            {...props}
        >
            {renderContent()}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    loader: {
        marginRight: 8,
    },
    icon: {
        marginRight: 8,
    },

    // Sizes
    smallButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    smallButtonText: {
        fontSize: 14,
    },
    largeButton: {
        paddingVertical: 18,
        paddingHorizontal: 25,
    },
    largeButtonText: {
        fontSize: 18,
    },

    // Variants
    primaryButton: {
        backgroundColor: '#2E7D32',
    },
    primaryButtonText: {
        color: '#fff',
    },

    secondaryButton: {
        backgroundColor: '#4CAF50',
    },
    secondaryButtonText: {
        color: '#fff',
    },

    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#2E7D32',
    },
    outlineButtonText: {
        color: '#2E7D32',
    },

    dangerButton: {
        backgroundColor: '#f44336',
    },
    dangerButtonText: {
        color: '#fff',
    },

    disabledButton: {
        backgroundColor: '#ccc',
        opacity: 0.6,
    },
});