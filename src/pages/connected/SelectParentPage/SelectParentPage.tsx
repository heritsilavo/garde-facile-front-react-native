import React, { useContext, useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, ScrollView, Modal } from "react-native";
import { UserContextType, connectedUserContext } from "../../../../App";
import { Parent, Enfant } from "../ConfigurerContratPage/classes";
import { getAssociatedParentByPajeIdSalarie, logout } from "../../../utils/user";
import { Button, Text, useTheme, Divider, Portal } from "react-native-paper";
import { NavigationContext } from "@react-navigation/native";
import { getContratByPajeIdParentAndSalarie, saveConfiguredContrat, recupererContratBySalarieParentAndEnfant } from "../../../utils/contrat";
import { Body as ContratEntity } from "../ConfigurerContratPage/classes";
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from "react-native-toast-message";
import LoadingScreen from '../../../components/loading/LoadingScreens';

const SelectParentpage = () => {
    const theme = useTheme();
    const [Parents, setParents] = useState<Parent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
    const [enfants, setEnfants] = useState<Enfant[]>([]);
    const { connectedUser, setConnectedUser } = useContext<UserContextType>(connectedUserContext);
    const navigation = useContext(NavigationContext);

    const fetchParents = async () => {
        setIsLoading(true);
        console.log("1");

        if (connectedUser.pajeId) {
            console.log("2");
            const val: Parent[] = await getAssociatedParentByPajeIdSalarie(connectedUser.pajeId);
            console.log("3");
            setParents(val);
            setIsLoading(false);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        console.log("SelectParentpage");
        fetchParents();
    }, []);

    const handleParentSelection = async (parent: Parent) => {
        setIsLoading(true);
        setSelectedParent(parent);

        const contrats: ContratEntity[] = await getContratByPajeIdParentAndSalarie(parent.pajeId, connectedUser.pajeId);
        console.log("Contrats: ", contrats);

        if (contrats.length > 0) {
            const enfantsList: Enfant[] = [];
            for (const contrat of contrats) {
                enfantsList.push(contrat.enfant);
            }
            setEnfants(enfantsList);
            setModalVisible(true);
        } else navigation?.navigate("NoContractScreen");

        setIsLoading(false);
    };

    const handleEnfantSelection = async (enfant: Enfant) => {
        setIsLoading(true);
        const contrats = await recupererContratBySalarieParentAndEnfant(selectedParent!.pajeId, connectedUser.pajeId, enfant.id);
        if (contrats.length > 0) {
            const saved = await saveConfiguredContrat(contrats[0].id);
            if (saved) {
                setModalVisible(false);
                navigation?.reset({
                    index: 0,
                    routes: [{ name: "Home" }]
                })
            }
        } else {
            Toast.show({
                type: 'error',
                text1: 'Contrat introuvable'
            });
        }
        setIsLoading(false);
    };

    const handleLogOut = async function () {
        setIsLoading(true);
        await logout();
        navigation?.navigate("Login");
    };

    const styles = StyleSheet.create({
        main: {
            flex: 1,
            backgroundColor: theme.colors.background,
            padding: 16,
        },
        listContainer: {
            flexGrow: 0,
            marginVertical: 24,
        },
        title: {
            ...theme.fonts.headlineMedium,
            color: theme.colors.onBackground,
            marginBottom: 8,
        },
        subtitle: {
            ...theme.fonts.bodyMedium,
            color: theme.colors.onSurfaceVariant,
            textAlign: "center",
            marginBottom: 16,
        },
        ParentItem: {
            backgroundColor: theme.colors.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            elevation: 2,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
        },
        ParentName: {
            ...theme.fonts.titleMedium,
            color: theme.colors.onSurface,
            marginBottom: 4,
        },
        ParentDob: {
            ...theme.fonts.bodyMedium,
            color: theme.colors.onSurfaceVariant,
        },
        helpText: {
            ...theme.fonts.bodySmall,
            color: theme.colors.onSurfaceVariant,
            textAlign: "center",
            marginVertical: 16,
            paddingHorizontal: 24,
        },
        button: {
            marginTop: 8,
            borderRadius: 8,
        },
        modalOverlay: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalView: {
            width: '90%',
            backgroundColor: theme.colors.surface,
            borderRadius: 28,
            padding: 24,
            elevation: 5,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
        },
        modalTitle: {
            ...theme.fonts.titleLarge,
            color: theme.colors.onSurface,
        },
        modalListContainer: {
            width: '100%',
            paddingBottom: 8,
        },
        EnfantItem: {
            padding: 16,
            borderRadius: 12,
            backgroundColor: theme.colors.surfaceVariant,
            marginBottom: 8,
        },
        EnfantName: {
            ...theme.fonts.titleMedium,
            color: theme.colors.onSurfaceVariant,
            marginBottom: 4,
        },
        EnfantDob: {
            ...theme.fonts.bodyMedium,
            color: theme.colors.onSurfaceVariant,
        },
        closeButton: {
            padding: 8,
        }
    });

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <View style={styles.main}>
            <ScrollView style={{ flex: 1 }}>
                <Text style={[styles.title, theme.fonts.titleLarge]}>Choix de l'employeur</Text>
                <Text style={[styles.subtitle, theme.fonts.titleMedium]}>
                    Pour quel parent employeur, rattaché à votre compte voulez-vous configurer un contrat
                </Text>

                <ScrollView style={styles.listContainer}>
                    {Parents.map((Parent, index) => (
                        <TouchableOpacity
                            style={styles.ParentItem}
                            key={index}
                            onPress={() => handleParentSelection(Parent)}
                        >
                            <Text style={[styles.ParentName, theme.fonts.bodyMedium]}>
                                {Parent.nom + ' ' + Parent.prenom}
                            </Text>
                            <Text style={styles.ParentDob}>{Parent.pajeId}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>


            </ScrollView>
            <Text style={[styles.helpText, theme.fonts.bodySmall]}>
                Vous ne trouvez pas votre employeur dans la liste ?
                Contactez l'admin qu'il procède à son enregistrement.
            </Text>
            <Button
                mode="contained"
                onPress={handleLogOut}
                style={styles.button}
            >
                Se déconnecter
            </Button>

            <Portal>
                <Modal
                    animationType="slide"
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalView}>
                            <View style={styles.modalHeader}>
                                <Text style={[styles.modalTitle, theme.fonts.titleMedium]}>Choisissez un enfant</Text>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Icon
                                        name="close"
                                        size={24}
                                        color={theme.colors.onSurfaceVariant}
                                    />
                                </TouchableOpacity>
                            </View>

                            <Divider style={{ marginBottom: 16 }} />

                            <ScrollView contentContainerStyle={styles.modalListContainer}>
                                {enfants.map((enfant, index) => (
                                    <TouchableOpacity
                                        style={styles.EnfantItem}
                                        key={index}
                                        onPress={() => handleEnfantSelection(enfant)}
                                    >
                                        <Text style={[styles.EnfantName, theme.fonts.bodyMedium]}>
                                            {enfant.nom + ' ' + enfant.prenom}
                                        </Text>
                                        <Text style={[styles.EnfantDob, theme.fonts.bodySmall]}>
                                            {new Date(enfant.dateNaissance).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </Portal>
        </View>
    );
};

export default SelectParentpage;