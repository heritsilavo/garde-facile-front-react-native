import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Modal } from "react-native";
import { UserContextType, connectedUserContext } from "../../../../App";
import { Parent, Enfant } from "../ConfigurerContratPage/classes";
import { getAssociatedParentByPajeIdSalarie, logout } from "../../../utils/user";
import { Button } from "react-native-paper";
import { NavigationContext } from "@react-navigation/native";
import { getContratByPajeIdParentAndSalarie, saveConfiguredContrat, recupererContratBySalarieParentAndEnfant } from "../../../utils/contrat";
import { Body as ContratEntity } from "../ConfigurerContratPage/classes";
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from "react-native-toast-message";

const SelectParentpage = () => {
    const [Parents, setParents] = useState<Parent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
    const [enfants, setEnfants] = useState<Enfant[]>([]);
    const { connectedUser, setConnectedUser } = useContext<UserContextType>(connectedUserContext);
    const navigation = useContext(NavigationContext);

    const fetchParents = async () => {
        setIsLoading(true);
        if (connectedUser.pajeId) {
            const val: Parent[] = await getAssociatedParentByPajeIdSalarie(connectedUser.pajeId);
            setParents(val);
            setIsLoading(false);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchParents();
    }, []);

    const handleParentSelection = async (parent: Parent) => {
        setIsLoading(true);
        setSelectedParent(parent);
        const contrats: ContratEntity[] = await getContratByPajeIdParentAndSalarie(parent.pajeId, connectedUser.pajeId);
        
        if (contrats.length > 0) {
            const enfantsList: Enfant[] = [];
            for (const contrat of contrats) {
                const contratEnfants = await recupererContratBySalarieParentAndEnfant(parent.pajeId, connectedUser.pajeId, contrat.enfant.id);
                
                enfantsList.push(...contratEnfants.map((c:any) => c.enfant));
            }
            setEnfants(enfantsList);
            setModalVisible(true);
        }
        
        setIsLoading(false);
    };

    const handleEnfantSelection = async (enfant: Enfant) => {
        setIsLoading(true);
        const contrats = await recupererContratBySalarieParentAndEnfant( selectedParent!.pajeId, connectedUser.pajeId, enfant.id);
        if (contrats.length > 0) {
            const saved = await saveConfiguredContrat(contrats[0].id);
            if (saved) {
                setModalVisible(false);
                navigation?.navigate('Home');
            }
        }else{
            Toast.show({
                type:'error',
                text1:'Contrat introuvable'
            });
        }
        setIsLoading(false);
    };

    const handleLogOut = async function () {
        setIsLoading(true);
        await logout();
        navigation?.navigate("Login");
    };

    if (isLoading) {
        return (
            <View style={{ ...styles.main, justifyContent: "center" }}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Chargement en cours...</Text>
            </View>
        );
    }

    return (
        <View style={styles.main}>
            <Text style={styles.title}>Choix de l'employeur</Text>
            <Text style={styles.subtitle}>Pour quel parent employeur, rattaché à votre compte voulez-vous configurer un contrat</Text>
            <ScrollView style={styles.listContainer}>
                {Parents.map((Parent, index) => (
                    <TouchableOpacity
                        style={styles.ParentItem}
                        key={index}
                        onPress={() => { handleParentSelection(Parent) }}
                    >
                        <Text style={styles.ParentName}>{Parent.nom + ' ' + Parent.prenom}</Text>
                        <Text style={styles.ParentDob}>{Parent.pajeId}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <Text style={styles.helpText}>
                Vous ne trouvez pas votre employeur dans la liste ? Contactez l'admin qu'il procède à son enregistrement.
            </Text>
            <Button
                mode="contained"
                onPress={handleLogOut}
                labelStyle={styles.label}
                style={styles.button}
                contentStyle={styles.content}
            >
                Se déconnecter
            </Button>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Choisissez un enfant</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Icon name="close" size={30} color="#000" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView contentContainerStyle={styles.modalListContainer}>
                            {enfants.map((enfant, index) => (
                                <TouchableOpacity
                                    style={styles.EnfantItem}
                                    key={index}
                                    onPress={() => { handleEnfantSelection(enfant) }}
                                >
                                    <Text style={styles.EnfantName}>{enfant.nom + ' ' + enfant.prenom}</Text>
                                    <Text style={styles.EnfantDob}>{enfant.dateNaissance}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        paddingHorizontal: 20,
    },
    listContainer: {
        maxHeight: '60%',
        width: '100%',
        marginTop: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 16,
        color: "#333",
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 16,
        color: "#666",
        textAlign: "center",
    },
    ParentItem: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    ParentName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#333",
    },
    ParentDob: {
        fontSize: 14,
        color: '#888',
    },
    helpText: {
        marginTop: 20,
        fontSize: 14,
        color: '#888',
        textAlign: "center",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#007AFF",
    },
    button: {
        backgroundColor: '#007AFF',
        borderRadius: 10,
        paddingVertical: 10,
        marginTop: 20,
        width: '90%',
    },
    content: {
        height: 50,
    },
    label: {
        fontSize: 18,
        color: 'white',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "#333",
    },
    modalListContainer: {
        width: '100%',
        paddingBottom: 20,
    },
    EnfantItem: {
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        marginBottom: 10,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    EnfantName: {
        fontSize: 16,
        fontWeight: '500',
        color: "#333",
    },
    EnfantDob: {
        fontSize: 14,
        color: '#666',
    }
});

export default SelectParentpage;
