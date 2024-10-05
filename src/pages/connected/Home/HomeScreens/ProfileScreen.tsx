import React, { useContext, useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { Avatar, Button, Text, Card, List, HelperText, IconButton, Dialog, Portal, Paragraph, useTheme } from 'react-native-paper';
import { connectedUserContext, UserContextType } from '../../../../../App';
import { NavigationContext } from '@react-navigation/native';
import { Body as ContratType } from '../../ConfigurerContratPage/classes';
import { logout } from '../../../../utils/user';
import { configuredContratContext, } from '../Home';
import { saveConfiguredContrat } from '../../../../utils/contrat';
import LoadingScreen from '../../../../components/loading/LoadingScreens';

interface ProfileScreenProps {
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    listeContrat: ContratType[];
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ isLoading, setIsLoading, listeContrat }) => {
    const { fonts } = useTheme();
    const { connectedUser } = useContext<UserContextType>(connectedUserContext);
    const navigation = useContext(NavigationContext);
    const { configuredContrat, setConfiguredContrat } = useContext(configuredContratContext);

    const [expanded, setExpanded] = useState(false);
    const [selectedChild, setSelectedChild] = useState(listeContrat[0]?.enfant);
    const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
    const [addChildDialogVisible, setAddChildDialogVisible] = useState(false);

    const handleLogout = useCallback(async () => {
        setLogoutDialogVisible(false);
        await logout();
        navigation?.navigate("Login");
    }, [navigation]);

    const handleContractSettings = useCallback(() => {
        navigation?.navigate("ContratProfile");
    }, [navigation]);

    const handleChildPress = useCallback(async (contrat: ContratType) => {
        setSelectedChild(contrat.enfant);
        setExpanded(false);
        await saveConfiguredContrat(contrat.id);
        setConfiguredContrat(contrat);
        navigation?.reset({
            index: 0,
            routes: [{ name: "Home" }]
        });
    }, [navigation, setConfiguredContrat]);

    const handleAddChild = useCallback(() => {
        setAddChildDialogVisible(false);
        if (connectedUser.profile === "PAJE_EMPLOYEUR") {
            navigation?.navigate("ConfigurerContrat", {
                assmat: configuredContrat.assmat,
                parent: configuredContrat.parent
            });
        }
    }, [connectedUser.profile, navigation, configuredContrat]);

    if (isLoading) {
        return <LoadingScreen></LoadingScreen>
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <UserInfoCard user={connectedUser} fonts={fonts} />
                <ChildInfoCard
                    selectedChild={selectedChild}
                    expanded={expanded}
                    setExpanded={setExpanded}
                    listeContrat={listeContrat}
                    handleChildPress={handleChildPress}
                    connectedUser={connectedUser}
                    configuredContrat={configuredContrat}
                    setAddChildDialogVisible={setAddChildDialogVisible}
                    fonts={fonts}
                />
                <Button mode="outlined" onPress={handleContractSettings} style={styles.button}>
                    Configuration de contrat
                </Button>
                <Button mode="contained" onPress={() => setLogoutDialogVisible(true)} style={styles.button}>
                    Se deconnecter
                </Button>
            </ScrollView>
            <LogoutDialog
                visible={logoutDialogVisible}
                onDismiss={() => setLogoutDialogVisible(false)}
                onConfirm={handleLogout}
                fonts={fonts}
            />
            <AddChildDialog
                visible={addChildDialogVisible}
                onDismiss={() => setAddChildDialogVisible(false)}
                onConfirm={handleAddChild}
                fonts={fonts}
            />
        </View>
    );
};

const UserInfoCard = ({ user, fonts }:any) => (
    <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
            <Avatar.Text size={80} label={user.nom.charAt(0) || 'U'} />
            <Text style={{...styles.userName, ...fonts.headlineMedium}}>{user.nom || "userName"}</Text>
            <Text style={{...styles.userId, ...fonts.bodyMedium}}>{user.pajeId || "userId"}</Text>
        </Card.Content>
    </Card>
);

const ChildInfoCard = ({ selectedChild, expanded, setExpanded, listeContrat, handleChildPress, connectedUser, configuredContrat, setAddChildDialogVisible, fonts }:any) => (
    <Card style={styles.childCard}>
        <View style={styles.childHeaderContainer}>
            <Text style={{...styles.title, ...fonts.titleLarge}}>Enfant: {`${selectedChild.prenom} ${selectedChild.nom}`}</Text>
            {connectedUser.profile === "PAJE_EMPLOYEUR" && (
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
            onPress={() => setExpanded(!expanded)}
            titleStyle={fonts.bodyLarge}
        >
            {listeContrat.map((contrat:any, index:number) => (
                <TouchableOpacity key={index} onPress={() => handleChildPress(contrat)}>
                    <List.Item
                        title={`${contrat.enfant.prenom} ${contrat.enfant.nom}`}
                        description={`Date de naissance: ${contrat.enfant.dateNaissance}`}
                        left={() => <Avatar.Icon size={40} icon="baby" />}
                        titleStyle={fonts.bodyLarge}
                        descriptionStyle={fonts.bodySmall}
                    />
                </TouchableOpacity>
            ))}
        </List.Accordion>
        {!expanded && (
            <HelperText type='info'>
                {connectedUser.profile === "PAJE_EMPLOYEUR"
                    ? `Enfant(s) gardée par ${configuredContrat.assmat.prenom} ${configuredContrat.assmat.nom}`
                    : `Les enfant(s) de ${configuredContrat.parent.prenom} ${configuredContrat.parent.nom}`}
            </HelperText>
        )}
    </Card>
);

const LogoutDialog = ({ visible, onDismiss, onConfirm, fonts }:any) => (
    <Portal>
        <Dialog visible={visible} onDismiss={onDismiss}>
            <Dialog.Title style={fonts.titleLarge}>Se déconnecter</Dialog.Title>
            <Dialog.Content>
                <Paragraph style={fonts.bodyMedium}>Êtes-vous sûr de vouloir vous déconnecter ?</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={onDismiss}>Annuler</Button>
                <Button onPress={onConfirm}>Confirmer</Button>
            </Dialog.Actions>
        </Dialog>
    </Portal>
);

const AddChildDialog = ({ visible, onDismiss, onConfirm, fonts }:any) => (
    <Portal>
        <Dialog visible={visible} onDismiss={onDismiss}>
            <Dialog.Title style={fonts.titleLarge}>Ajouter un nouvel enfant</Dialog.Title>
            <Dialog.Content>
                <Paragraph style={fonts.bodyMedium}>Êtes-vous sûr de vouloir ajouter un nouvel enfant ?</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={onDismiss}>Annuler</Button>
                <Button onPress={onConfirm}>Confirmer</Button>
            </Dialog.Actions>
        </Dialog>
    </Portal>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
    addChildButton: {
        margin: 0,
    },
});

export default ProfileScreen;