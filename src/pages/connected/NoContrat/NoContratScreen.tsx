import React, { useContext, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContext, useNavigation } from '@react-navigation/native';
import { getContratByPajeIdUser, isContratConfiguree } from '../../../utils/contrat';
import { connectedUserContext } from '../../../../App';
import { logout } from '../../../utils/user';

const NoContractScreen = () => {
    const navigation = useContext(NavigationContext);
    const [isLoading, setIsLoading] = useState(false);
    const { connectedUser } = useContext(connectedUserContext);

    const handleRetry = async () => {
        setIsLoading(true);
        try {
            const contrats: any[] = await getContratByPajeIdUser(connectedUser.pajeId);
            setIsLoading(false);
            if (!contrats.length) navigation?.navigate("NoContractScreen");
            else navigation?.navigate("SelectParentpage");
        } catch (error) {
            console.error("Erreur lors de la vérification du contrat :", error);
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        setIsLoading(true)
        await logout()
        navigation?.navigate("Login")
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Aucun contrat configuré</Text>
            <Text style={styles.message}>
                Votre employeur n'a pas encore configuré votre contrat dans l'application,
                s'il vous plaît contactez-le pour en savoir plus.
            </Text>
            {isLoading ? (
                <ActivityIndicator size="large" color="#6200EE" />
            ) : (
                <View style={styles.buttonContainer}>
                    <Button title="Recommencer" onPress={handleRetry} />
                    <Button title="Se déconnecter" onPress={handleLogout} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#000',
        marginTop: 10
    },
    message: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 40,
    },
    buttonContainer: {
        flexDirection: 'row', // Pour aligner les boutons horizontalement
        justifyContent: 'space-around', // Espacement entre les boutons
        width: '100%', // Prendre toute la largeur disponible
        paddingBottom: 20, // Espacement en bas
    },
});

export default NoContractScreen;