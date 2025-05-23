import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileScreen({ navigation }) {
    const { user, logout } = useAuth();
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

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

    const ProfileItem = ({ icon, title, subtitle, onPress, showArrow = true, rightComponent }) => (
        <TouchableOpacity style={styles.profileItem} onPress={onPress}>
            <View style={styles.profileItemLeft}>
                <View style={styles.profileItemIcon}>
                    <Ionicons name={icon} size={24} color="#2E7D32" />
                </View>
                <View style={styles.profileItemInfo}>
                    <Text style={styles.profileItemTitle}>{title}</Text>
                    {subtitle && <Text style={styles.profileItemSubtitle}>{subtitle}</Text>}
                </View>
            </View>
            <View style={styles.profileItemRight}>
                {rightComponent}
                {showArrow && <Ionicons name="chevron-forward" size={20} color="#ccc" />}
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={['#1B5E20', '#2E7D32']}
                style={styles.header}
            >
                <View style={styles.profileHeader}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                        </Text>
                    </View>
                    <Text style={styles.userName}>
                        {user?.firstName} {user?.lastName}
                    </Text>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                    <Text style={styles.userRole}>Fuel Station Operator</Text>
                </View>
            </LinearGradient>

            {/* Station Information */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Station Information</Text>
                <View style={styles.card}>
                    <ProfileItem
                        icon="business"
                        title="Station Name"
                        subtitle={user?.stationName || 'Not specified'}
                        onPress={() => { }}
                    />
                    <ProfileItem
                        icon="location"
                        title="Station Address"
                        subtitle={user?.stationAddress || 'Not specified'}
                        onPress={() => { }}
                    />
                    <ProfileItem
                        icon="document-text"
                        title="License Number"
                        subtitle={user?.licenseNumber || 'Not specified'}
                        onPress={() => { }}
                    />
                </View>
            </View>

            {/* Account Settings */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account Settings</Text>
                <View style={styles.card}>
                    <ProfileItem
                        icon="person"
                        title="Edit Profile"
                        subtitle="Update your personal information"
                        onPress={() => Alert.alert('Coming Soon', 'Profile editing will be available soon')}
                    />
                    <ProfileItem
                        icon="lock-closed"
                        title="Change Password"
                        subtitle="Update your password"
                        onPress={() => Alert.alert('Coming Soon', 'Password change will be available soon')}
                    />
                    <ProfileItem
                        icon="phone-portrait"
                        title="Phone Number"
                        subtitle={user?.phone || 'Not specified'}
                        onPress={() => { }}
                    />
                </View>
            </View>

            {/* App Settings */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>App Settings</Text>
                <View style={styles.card}>
                    <ProfileItem
                        icon="notifications"
                        title="Notifications"
                        subtitle="Receive push notifications"
                        showArrow={false}
                        rightComponent={
                            <Switch
                                value={notifications}
                                onValueChange={setNotifications}
                                trackColor={{ false: '#ccc', true: '#4CAF50' }}
                                thumbColor={notifications ? '#fff' : '#fff'}
                            />
                        }
                    />
                    <ProfileItem
                        icon="moon"
                        title="Dark Mode"
                        subtitle="Enable dark theme"
                        showArrow={false}
                        rightComponent={
                            <Switch
                                value={darkMode}
                                onValueChange={setDarkMode}
                                trackColor={{ false: '#ccc', true: '#4CAF50' }}
                                thumbColor={darkMode ? '#fff' : '#fff'}
                            />
                        }
                    />
                </View>
            </View>

            {/* Support */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Support</Text>
                <View style={styles.card}>
                    <ProfileItem
                        icon="help-circle"
                        title="Help & Support"
                        subtitle="Get help and contact support"
                        onPress={() => Alert.alert('Help', 'For support, please contact: support@fuelquota.lk')}
                    />
                    <ProfileItem
                        icon="information-circle"
                        title="About"
                        subtitle="App version and information"
                        onPress={() => Alert.alert('About', 'Fuel Quota Management System v1.0.0')}
                    />
                    <ProfileItem
                        icon="document"
                        title="Terms & Privacy"
                        subtitle="View terms and privacy policy"
                        onPress={() => Alert.alert('Coming Soon', 'Terms and privacy policy will be available soon')}
                    />
                </View>
            </View>

            {/* Logout */}
            <View style={styles.section}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out" size={24} color="#fff" />
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        paddingTop: 40,
        paddingBottom: 30,
        alignItems: 'center',
    },
    profileHeader: {
        alignItems: 'center',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    avatarText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 5,
    },
    userRole: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    section: {
        margin: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    profileItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    profileItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    profileItemIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f8f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    profileItemInfo: {
        flex: 1,
    },
    profileItemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    profileItemSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    profileItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoutButton: {
        backgroundColor: '#f44336',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 12,
        marginTop: 10,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});