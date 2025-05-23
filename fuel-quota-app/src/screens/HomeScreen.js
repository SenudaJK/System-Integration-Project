import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Dimensions,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
    const { user, logout } = useAuth();
    const [todayStats, setTodayStats] = useState({
        totalTransactions: 0,
        totalFuelDispensed: 0,
        totalRevenue: 0,
    });

    // Animation values
    const fadeAnim = useSharedValue(0);
    const slideAnim = useSharedValue(50);

    useEffect(() => {
        fadeAnim.value = withTiming(1, { duration: 800 });
        slideAnim.value = withSpring(0, { damping: 15 });

        // Load today's stats (mock data for now)
        setTodayStats({
            totalTransactions: 24,
            totalFuelDispensed: 450.5,
            totalRevenue: 95250.75,
        });
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: fadeAnim.value,
            transform: [{ translateY: slideAnim.value }],
        };
    });

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', onPress: logout, style: 'destructive' },
            ]
        );
    };

    const MenuCard = ({ icon, title, subtitle, onPress, color = '#4CAF50' }) => {
        const cardAnim = useSharedValue(1);

        const cardStyle = useAnimatedStyle(() => {
            return {
                transform: [{ scale: cardAnim.value }],
            };
        });

        const handlePressIn = () => {
            cardAnim.value = withSpring(0.95);
        };

        const handlePressOut = () => {
            cardAnim.value = withSpring(1);
        };

        return (
            <Animated.View style={cardStyle}>
                <TouchableOpacity
                    style={styles.menuCard}
                    onPress={onPress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={[color, `${color}DD`]}
                        style={styles.menuCardGradient}
                    >
                        <View style={styles.menuCardIcon}>
                            <Ionicons name={icon} size={30} color="#fff" />
                        </View>
                        <Text style={styles.menuCardTitle}>{title}</Text>
                        <Text style={styles.menuCardSubtitle}>{subtitle}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const StatCard = ({ icon, title, value, color = '#4CAF50' }) => (
        <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: color }]}>
                <Ionicons name={icon} size={24} color="#fff" />
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statTitle}>{title}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#1B5E20', '#2E7D32']}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.greeting}>Welcome back,</Text>
                        <Text style={styles.userName}>{user?.firstName || 'Operator'}</Text>
                        <Text style={styles.stationName}>{user?.stationName || 'Fuel Station'}</Text>
                    </View>
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                        <Ionicons name="log-out-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Animated.View style={animatedStyle}>
                    {/* Today's Stats */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Today's Summary</Text>
                        <View style={styles.statsContainer}>
                            <StatCard
                                icon="receipt-outline"
                                title="Transactions"
                                value={todayStats.totalTransactions}
                                color="#4CAF50"
                            />
                            <StatCard
                                icon="water-outline"
                                title="Fuel (L)"
                                value={todayStats.totalFuelDispensed.toFixed(1)}
                                color="#2196F3"
                            />
                            <StatCard
                                icon="cash-outline"
                                title="Revenue (LKR)"
                                value={todayStats.totalRevenue.toLocaleString()}
                                color="#FF9800"
                            />
                        </View>
                    </View>

                    {/* Quick Actions */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Quick Actions</Text>
                        <View style={styles.menuGrid}>
                            <MenuCard
                                icon="qr-code-outline"
                                title="Scan QR Code"
                                subtitle="Scan vehicle QR to check quota"
                                onPress={() => navigation.navigate('QRScanner')}
                                color="#4CAF50"
                            />
                            <MenuCard
                                icon="analytics-outline"
                                title="Transaction History"
                                subtitle="View fuel dispensing records"
                                onPress={() => navigation.navigate('TransactionHistory')}
                                color="#2196F3"
                            />
                            <MenuCard
                                icon="person-outline"
                                title="Profile"
                                subtitle="Manage your account"
                                onPress={() => navigation.navigate('Profile')}
                                color="#9C27B0"
                            />
                            <MenuCard
                                icon="settings-outline"
                                title="Settings"
                                subtitle="App preferences"
                                onPress={() => Alert.alert('Coming Soon', 'Settings feature will be available soon')}
                                color="#607D8B"
                            />
                        </View>
                    </View>

                    {/* Recent Activity */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Recent Activity</Text>
                        <View style={styles.activityCard}>
                            <Ionicons name="time-outline" size={20} color="#666" />
                            <Text style={styles.activityText}>
                                Last transaction: 25.5L Petrol - 2 minutes ago
                            </Text>
                        </View>
                        <View style={styles.activityCard}>
                            <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
                            <Text style={styles.activityText}>
                                Vehicle ABC-1234 quota updated successfully
                            </Text>
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        paddingTop: 20,
        paddingBottom: 30,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    greeting: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 16,
    },
    userName: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 5,
    },
    stationName: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 14,
        marginTop: 2,
    },
    logoutButton: {
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    section: {
        marginTop: 25,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    statIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    statTitle: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    menuCard: {
        width: (width - 50) / 2,
        marginBottom: 15,
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
    },
    menuCardGradient: {
        padding: 20,
        alignItems: 'center',
        minHeight: 120,
        justifyContent: 'center',
    },
    menuCardIcon: {
        marginBottom: 10,
    },
    menuCardTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    menuCardSubtitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
        textAlign: 'center',
    },
    activityCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    activityText: {
        marginLeft: 10,
        color: '#666',
        flex: 1,
    },
});