import React from 'react';
import {
    View,
    ActivityIndicator,
    Text,
    StyleSheet,
} from 'react-native';

export default function LoadingSpinner({
    size = 'large',
    color = '#2E7D32',
    text = 'Loading...',
    style
}) {
    return (
        <View style={[styles.container, style]}>
            <ActivityIndicator size={size} color={color} />
            {text && <Text style={styles.text}>{text}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});