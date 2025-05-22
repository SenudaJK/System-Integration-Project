import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { useAuth } from '../utils/authContext';
import { getFuelStationDetails } from '../api/apiService';
import Header from '../components/Header';

const HomeScreen = ({ navigation }) => {
    const { user, signOut } = useAuth();
    const [stationDetails, setStationDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStationDetails = async () => {
            try {
                if (user && user.stationId) {
                    const details = await getFuelStationDetails(user.stationId);
                    setStationDetails(details);
                }
            } catch (error) {
                console.error('Failed to load station details:', error);
            } finally {
                setLoading(false);
            }
        };

        loadStationDetails();
    }, [user]);

    const handleScanPress = () => {
        navigation.navigate('Scan');
    };

    return (
        <View style={styles.container}>
            <Header title="Fuel Station Dashboard" onLogout={signOut} />

            {loading ? (
                <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
            ) : (
                <View style={styles.content}>
                    <View style={styles.stationInfo}>
                        <Text style={styles.stationName}>
                            {stationDetails ? stationDetails.name : 'Welcome'}
                        </Text>
                        <Text style={styles.stationAddress}>
                            {stationDetails ? stationDetails.address : 'Fuel Station Operator'}
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.scanButton} onPress={handleScanPress}>
                        <Text style={styles.scanButtonText}>Scan QR Code</Text>
                    </TouchableOpacity>

                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <Text style={styles.statValue}>
                                {stationDetails ? stationDetails.todayTransactions : '0'}
                            </Text>
                            <Text style={styles.statLabel}>Today's Transactions</Text>
                        </View>

                        <View style={styles.statCard}>
                            <Text style={styles.statValue}>
                                {stationDetails ? `${stationDetails.todayVolume.toFixed(2)}L` : '0L'}
                            </Text>
                            <Text style={styles.statLabel}>Today's Volume</Text>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    stationInfo: {
        marginBottom: 30,
    },
    stationName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    stationAddress: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    scanButton: {
        backgroundColor: '#007BFF',
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
        marginBottom: 30,
    },
    scanButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        marginHorizontal: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007BFF',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
    },
});

export default HomeScreen;