import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Button, Text, Card } from 'react-native-paper';
import { connectedUserContext } from '../../../../../App';
import User from '../../../../models/user';
import { logout } from '../../../../utils/user';
import { NavigationContext } from '@react-navigation/native';


const ProfileScreen = () => {

    const userContext = useContext(connectedUserContext)
    const navigation  = useContext(NavigationContext);

    const handleLogout =async () => {
        navigation?.navigate("Login")
        await logout();
    };

    const handleUnlinkContract = () => {
        // Logic for unlinking the contract
        console.log('Contract unlinked');
    };

    const handleContractSettings = () => {
        navigation?.navigate("ContratProfile")
    };

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                    <Avatar.Text size={80} label={userContext?.connectedUser.nom.charAt(0) || 'U'} />
                    <Text style={styles.userName}>{userContext?.connectedUser.nom || "userName"}</Text>
                    <Text style={styles.userId}>{userContext?.connectedUser.pajeId || "userId"}</Text>
                </Card.Content>
            </Card>

            <View style={styles.buttonContainer}>
                <Button mode="contained" onPress={handleLogout} style={styles.button}>
                    Se déconnecter
                </Button>
                <Button mode="outlined" onPress={handleUnlinkContract} style={styles.button}>
                    Délier le contrat de l'application
                </Button>
                <Button mode="text" onPress={handleContractSettings} style={styles.button}>
                    Configuration de contrat
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    card: {
        width: '100%',
        marginBottom: 20,
        padding: 16,
        alignItems: 'center',
        borderRadius: 10,
        elevation: 4,
    },
    cardContent: {
        alignItems: 'center',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 8,
    },
    userId: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },
    button: {
        marginVertical: 8,
        width: '100%',
    },
});

export default ProfileScreen;