import React, { useContext, useState } from 'react';
import { Text, useTheme, Button as PaperButton } from 'react-native-paper';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContext, useNavigation } from '@react-navigation/native';
import { getContratByPajeIdUser, isContratConfiguree } from '../../../utils/contrat';
import { connectedUserContext } from '../../../../App';
import { logout } from '../../../utils/user';

const NoContractScreen = () => {
    const { fonts } = useTheme();
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
        setIsLoading(true);
        await logout();
        navigation?.navigate("Login");
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.title, fonts.headlineMedium]}>
                Aucun contrat configuré
            </Text>
            <Text style={[styles.message, fonts.bodyLarge]}>
                Votre employeur n'a pas encore configuré votre contrat dans l'application,
                s'il vous plaît contactez-le pour en savoir plus.
            </Text>
            {isLoading ? (
                <ActivityIndicator size="large" color="#6200EE" />
            ) : (
                <View style={styles.buttonContainer}>
                    <PaperButton 
                        mode="contained" 
                        onPress={handleRetry}
                        labelStyle={fonts.labelLarge}
                    >
                        Recommencer
                    </PaperButton>
                    <PaperButton 
                        mode="outlined" 
                        onPress={handleLogout}
                        labelStyle={fonts.labelLarge}
                    >
                        Se déconnecter
                    </PaperButton>
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
        marginBottom: 20,
        textAlign: 'center',
        color: '#000',
        marginTop: 10
    },
    message: {
        color: '#555',
        textAlign: 'center',
        marginBottom: 40,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingBottom: 20,
        gap: 16
    },
});

export default NoContractScreen;