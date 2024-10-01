import React, { useContext, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { Avatar, Button, Text, Card, List, HelperText, Appbar, IconButton, Dialog, Portal, Paragraph, useTheme } from 'react-native-paper';
import { connectedUserContext, UserContextType } from '../../../../../App';
import { NavigationContext } from '@react-navigation/native';
import { Assmat, Body as ContratType } from '../../ConfigurerContratPage/classes';
import { logout } from '../../../../utils/user';
import { configuredContratContext, configuredContratContextProps } from '../Home';
import { saveConfiguredContrat } from '../../../../utils/contrat';

interface ProfileScreenProps {
    isLoading: boolean;
    setIsLoading: any;
    listeContrat: ContratType[]
}

const ProfileScreen = ({ isLoading, setIsLoading, listeContrat }: ProfileScreenProps) => {
    const {fonts} = useTheme()
    const { connectedUser } = useContext<UserContextType>(connectedUserContext)
    const navigation = useContext(NavigationContext);
    const [expanded, setExpanded] = useState(false);
    const [selectedChild, setSelectedChild] = useState(listeContrat[0]?.enfant);
    const { configuredContrat, setConfiguredContrat } = useContext<configuredContratContextProps>(configuredContratContext);
    const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
    const [addChildDialogVisible, setAddChildDialogVisible] = useState(false);

    const handleLogout = async () => {
        setLogoutDialogVisible(false);
        await logout();
        navigation?.navigate("Login");
    };

    const handleContractSettings = () => {
        navigation?.navigate("ContratProfile");
    };

    const handlePress = () => setExpanded(!expanded);

    const handleChildPress = async (contrat: ContratType) => {
        setSelectedChild(contrat.enfant);
        setExpanded(false);
        saveConfiguredContrat(contrat.id);
        setConfiguredContrat(contrat);
        navigation?.reset({
            index: 0,
            routes: [{ name: "Home" }]
        });
    };

    const handleAddChild = () => {
        setAddChildDialogVisible(false);
        if (connectedUser.profile === "PAJE_EMPLOYEUR") {
            navigation?.navigate("ConfigurerContrat", {
                assmat: configuredContrat.assmat,
                parent: configuredContrat.parent
            });
        }
        console.log("Add new child");
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={{...fonts.bodyMedium}}>Chargement des données...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Card style={styles.card}>
                    <Card.Content style={styles.cardContent}>
                        <Avatar.Text size={80} label={connectedUser.nom.charAt(0) || 'U'} />
                        <Text style={{...styles.userName, ...fonts.headlineMedium}}>{connectedUser.nom || "userName"}</Text>
                        <Text style={{...styles.userId, ...fonts.bodyMedium}}>{connectedUser.pajeId || "userId"}</Text>
                    </Card.Content>
                </Card>

                <Card style={styles.childCard}>
                    <View style={styles.childHeaderContainer}>
                        <Text style={{...styles.title, ...fonts.titleLarge}}>Enfant: {`${selectedChild.prenom} ${selectedChild.nom}`}</Text>
                        {(connectedUser.profile === "PAJE_EMPLOYEUR") && (
                            <IconButton
                                icon="plus"
                                size={24}
                                onPress={() => setAddChildDialogVisible(true)}
                                style={styles.addChildButton}
                            />
                        )}
                    </View>

                    <List.Accordion
                        title={expanded ? "Liste des enfants" : `${selectedChild?.prenom} ${selectedChild?.nom}`}
                        expanded={expanded}
                        onPress={handlePress}
                        titleStyle={{...fonts.bodyLarge}}
                    >
                        {listeContrat.map((contrat, index) => (
                            <TouchableOpacity key={index} onPress={() => handleChildPress(contrat)}>
                                <List.Item
                                    title={`${contrat.enfant.prenom} ${contrat.enfant.nom}`}
                                    description={`Date de naissance: ${contrat.enfant.dateNaissance}`}
                                    left={() => <Avatar.Icon size={40} icon="baby" />}
                                    titleStyle={{...fonts.bodyLarge}}
                                    descriptionStyle={{...fonts.bodySmall}}
                                />
                            </TouchableOpacity>
                        ))}
                    </List.Accordion>
                    {
                        !expanded && <HelperText type='info'>Enfant(s) gardée par {configuredContrat.assmat.prenom+' '+configuredContrat.assmat.nom} </HelperText>
                    }
                </Card>

                <Button mode="outlined" onPress={handleContractSettings} style={styles.button}>
                    Configuration de contrat
                </Button>
                <Button mode="contained" onPress={() => setLogoutDialogVisible(true)} style={styles.button}>
                    Se deconnecter
                </Button>
            </ScrollView>

            {/* Modal for Logout Confirmation */}
            <Portal>
                <Dialog visible={logoutDialogVisible} onDismiss={() => setLogoutDialogVisible(false)}>
                    <Dialog.Title style={{...fonts.titleLarge}}>Se déconnecter</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph style={{...fonts.bodyMedium}}>Êtes-vous sûr de vouloir vous déconnecter ?</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setLogoutDialogVisible(false)}>Annuler</Button>
                        <Button onPress={handleLogout}>Confirmer</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            {/* Modal for Adding New Child Confirmation */}
            <Portal>
                <Dialog visible={addChildDialogVisible} onDismiss={() => setAddChildDialogVisible(false)}>
                    <Dialog.Title style={{...fonts.titleLarge}}>Ajouter un nouvel enfant</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph style={{...fonts.bodyMedium}}>Êtes-vous sûr de vouloir ajouter un nouvel enfant ?</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setAddChildDialogVisible(false)}>Annuler</Button>
                        <Button onPress={handleAddChild}>Confirmer</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    appBar: {
        elevation: 0,
        backgroundColor: 'transparent',
    },
    scrollViewContent: {
        flexGrow: 1,
        padding: 16,
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '100%',
        marginBottom: 20,
        borderRadius: 10,
        elevation: 4,
    },
    childCard: {
        width: '100%',
        marginBottom: 20,
        padding: 16,
        borderRadius: 10,
        elevation: 4,
    },
    cardContent: {
        alignItems: 'center',
        padding: 16,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    userId: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    childHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    button: {
        marginTop: 10,
        width: '100%',
    },
    helperText: {
        textAlign: 'center',
        fontStyle: 'italic',
    },
    addChildButton: {
        margin: 0,
    },
});

export default ProfileScreen;
