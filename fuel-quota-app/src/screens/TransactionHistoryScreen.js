import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    RefreshControl,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { apiService } from "../services/apiService";
import { useAuth } from "../contexts/AuthContext";
import { useLoading } from "../contexts/LoadingContext";

export default function TransactionHistoryScreen() {
    const [transactions, setTransactions] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const { user } = useAuth();
    const { showLoading, hideLoading } = useLoading();

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async (pageNum = 0, refresh = false) => {
        try {
            if (refresh) {
                showLoading("Loading transactions...");
            }

            const response = await apiService.getTransactionHistory(
                user.id,
                pageNum,
                20
            );
            const newTransactions = response.data.content || [];

            if (refresh || pageNum === 0) {
                setTransactions(newTransactions);
            } else {
                setTransactions((prev) => [...prev, ...newTransactions]);
            }

            setHasMore(!response.data.last);
            setPage(pageNum);
        } catch (error) {
            console.error("Error loading transactions:", error);
        } finally {
            hideLoading();
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadTransactions(0, true);
    };

    const loadMore = () => {
        if (hasMore && !refreshing) {
            loadTransactions(page + 1);
        }
    };

    const TransactionCard = ({ item }) => {
        const getStatusColor = (status) => {
            switch (status) {
                case "COMPLETED":
                    return "#4CAF50";
                case "PENDING":
                    return "#FF9800";
                case "FAILED":
                    return "#f44336";
                default:
                    return "#666";
            }
        };

        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString() + " " + date.toLocaleTimeString();
        };

        return (
            <View style={styles.transactionCard}>
                <View style={styles.transactionHeader}>
                    <View style={styles.vehicleInfo}>
                        <Text style={styles.vehicleNumber}>
                            {item.vehicleNumber}
                        </Text>
                        <Text style={styles.transactionDate}>
                            {formatDate(item.createdAt)}
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.statusBadge,
                            { backgroundColor: getStatusColor(item.status) },
                        ]}
                    >
                        <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                </View>

                <View style={styles.transactionDetails}>
                    <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                            <Ionicons name="water" size={16} color="#666" />
                            <Text style={styles.detailLabel}>Fuel Type</Text>
                            <Text style={styles.detailValue}>
                                {item.fuelType}
                            </Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Ionicons
                                name="speedometer"
                                size={16}
                                color="#666"
                            />
                            <Text style={styles.detailLabel}>Amount</Text>
                            <Text style={styles.detailValue}>
                                {item.fuelAmount}L
                            </Text>
                        </View>
                    </View>

                    <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                            <Ionicons name="cash" size={16} color="#666" />
                            <Text style={styles.detailLabel}>Amount</Text>
                            <Text style={styles.detailValue}>
                                LKR {item.totalAmount?.toLocaleString()}
                            </Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Ionicons name="person" size={16} color="#666" />
                            <Text style={styles.detailLabel}>Owner</Text>
                            <Text style={styles.detailValue}>
                                {item.ownerName}
                            </Text>
                        </View>
                    </View>
                </View>

                {item.notes && (
                    <View style={styles.notesSection}>
                        <Text style={styles.notesLabel}>Notes:</Text>
                        <Text style={styles.notesText}>{item.notes}</Text>
                    </View>
                )}
            </View>
        );
    };

    const EmptyState = () => (
        <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={80} color="#ccc" />
            <Text style={styles.emptyStateTitle}>No Transactions Found</Text>
            <Text style={styles.emptyStateText}>
                Fuel transactions will appear here once you start dispensing
                fuel.
            </Text>
        </View>
    );

    const renderFooter = () => {
        if (!hasMore) return null;
        return (
            <View style={styles.footer}>
                <TouchableOpacity
                    onPress={loadMore}
                    style={styles.loadMoreButton}
                >
                    <Text style={styles.loadMoreText}>Load More</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#1B5E20", "#2E7D32"]}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>Transaction History</Text>
                <Text style={styles.headerSubtitle}>
                    {transactions.length} transaction
                    {transactions.length !== 1 ? "s" : ""}
                </Text>
            </LinearGradient>

            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <TransactionCard item={item} />}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                ListEmptyComponent={EmptyState}
                ListFooterComponent={renderFooter}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        paddingTop: 20,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
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
    listContainer: {
        padding: 20,
        flexGrow: 1,
    },
    transactionCard: {
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    transactionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    vehicleInfo: {
        flex: 1,
    },
    vehicleNumber: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    transactionDate: {
        fontSize: 12,
        color: "#666",
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    statusText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
    transactionDetails: {
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
        paddingTop: 15,
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    detailItem: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: "#666",
        marginLeft: 5,
        marginRight: 5,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
    },
    notesSection: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#f8f8f8",
        borderRadius: 8,
    },
    notesLabel: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#666",
        marginBottom: 5,
    },
    notesText: {
        fontSize: 14,
        color: "#333",
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 60,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginTop: 20,
        marginBottom: 10,
    },
    emptyStateText: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        lineHeight: 20,
        paddingHorizontal: 40,
    },
    footer: {
        padding: 20,
        alignItems: "center",
    },
    loadMoreButton: {
        backgroundColor: "#2E7D32",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    loadMoreText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
