import React, { createContext, useContext, useState } from "react";
import {
    View,
    ActivityIndicator,
    StyleSheet,
    Text,
    Modal,
    Dimensions
} from "react-native";

const LoadingContext = createContext();

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
};

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Loading...");

    const showLoading = (message = "Loading...") => {
        setLoadingMessage(message);
        setIsLoading(true);
    };

    const hideLoading = () => {
        setIsLoading(false);
    };

    return (
        <LoadingContext.Provider value={{ showLoading, hideLoading }}>
            {children}
            <Modal
                transparent={true}
                animationType="fade"
                visible={isLoading}
                statusBarTranslucent={true}
                hardwareAccelerated={true}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#2E7D32" />
                        <Text style={styles.loadingText}>{loadingMessage}</Text>
                    </View>
                </View>
            </Modal>
        </LoadingContext.Provider>
    );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: width,
        height: height,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    },
    loadingContainer: {
        backgroundColor: "white",
        padding: 30,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 150,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: "#333",
        textAlign: "center",
        fontWeight: "500",
    },
});