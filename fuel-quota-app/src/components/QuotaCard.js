import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function QuotaCard({
    fuelType,
    totalQuota,
    usedQuota,
    availableQuota,
    style,
}) {
    const getProgressPercentage = () => {
        if (totalQuota === 0) return 0;
        return (usedQuota / totalQuota) * 100;
    };

    const getFuelTypeColor = (type) => {
        switch (type) {
            case "PETROL_92":
                return ["#FF5722", "#E64A19"];
            case "PETROL_95":
                return ["#FF9800", "#F57C00"];
            case "DIESEL":
                return ["#607D8B", "#455A64"];
            case "SUPER_DIESEL":
                return ["#795548", "#5D4037"];
            case "KEROSENE":
                return ["#9C27B0", "#7B1FA2"];
            default:
                return ["#4CAF50", "#388E3C"];
        }
    };

    const getFuelTypeIcon = (type) => {
        switch (type) {
            case "PETROL_92":
            case "PETROL_95":
                return "car-outline";
            case "DIESEL":
            case "SUPER_DIESEL":
                return "bus-outline";
            case "KEROSENE":
                return "flame-outline";
            default:
                return "water-outline";
        }
    };

    const formatFuelType = (type) => {
        switch (type) {
            case "PETROL_92":
                return "Petrol 92";
            case "PETROL_95":
                return "Petrol 95";
            case "DIESEL":
                return "Diesel";
            case "SUPER_DIESEL":
                return "Super Diesel";
            case "KEROSENE":
                return "Kerosene";
            default:
                return type;
        }
    };

    const progressPercentage = getProgressPercentage();
    const colors = getFuelTypeColor(fuelType);

    return (
        <View style={[styles.container, style]}>
            <LinearGradient colors={colors} style={styles.gradient}>
                <View style={styles.header}>
                    <View style={styles.fuelTypeInfo}>
                        <Ionicons
                            name={getFuelTypeIcon(fuelType)}
                            size={24}
                            color="#fff"
                        />
                        <Text style={styles.fuelTypeText}>
                            {formatFuelType(fuelType)}
                        </Text>
                    </View>
                    <View style={styles.availableQuota}>
                        <Text style={styles.availableQuotaText}>
                            {availableQuota}L
                        </Text>
                        <Text style={styles.availableLabel}>Available</Text>
                    </View>
                </View>

                <View style={styles.quotaDetails}>
                    <View style={styles.quotaRow}>
                        <Text style={styles.quotaLabel}>Total Quota</Text>
                        <Text style={styles.quotaValue}>{totalQuota}L</Text>
                    </View>
                    <View style={styles.quotaRow}>
                        <Text style={styles.quotaLabel}>Used</Text>
                        <Text style={styles.quotaValue}>{usedQuota}L</Text>
                    </View>
                </View>

                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${progressPercentage}%` },
                            ]}
                        />
                    </View>
                    <Text style={styles.progressText}>
                        {progressPercentage.toFixed(1)}% Used
                    </Text>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 15,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
        marginBottom: 15,
    },
    gradient: {
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    fuelTypeInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    fuelTypeText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
    },
    availableQuota: {
        alignItems: "flex-end",
    },
    availableQuotaText: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
    },
    availableLabel: {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: 12,
        marginTop: 2,
    },
    quotaDetails: {
        marginBottom: 20,
    },
    quotaRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    quotaLabel: {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: 14,
    },
    quotaValue: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
    progressContainer: {
        marginTop: 10,
    },
    progressBar: {
        height: 8,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        borderRadius: 4,
        overflow: "hidden",
        marginBottom: 8,
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#fff",
        borderRadius: 4,
    },
    progressText: {
        color: "rgba(255, 255, 255, 0.9)",
        fontSize: 12,
        textAlign: "center",
    },
});
