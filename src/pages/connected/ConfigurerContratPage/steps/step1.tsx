import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Modal, Button } from "react-native";
import { Enfant } from "../classes";
import { ConfigContratContext } from "../ConfigurerContratPage";
import { getEnfantByPajeIdParent } from "../../../../utils/user";
import { Body as ContratEntity } from "../classes";
import { recupererContratBySalarieParentAndEnfant, deleteContrat, saveConfiguredContrat } from "../../../../utils/contrat";
import { connectedUserContext } from "../../../../../App";
import { NavigationContext } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Appbar, useTheme } from "react-native-paper";
import LoadingScreen from "../../../../components/loading/LoadingScreens";

const RenderStep1 = ({ setStep, setSelectedEnfant }: { setStep: any, setSelectedEnfant: any }) => {
    const [Enfantren, setEnfantren] = useState<Enfant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingText, setLoadingText] = useState<string>('Chargement en cours...');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedChild, setSelectedChild] = useState<Enfant | null>(null);
    const [existingContract, setExistingContract] = useState<ContratEntity | null>(null);
    const configContrat = useContext(ConfigContratContext);
    const { connectedUser, setConnectedUser } = useContext(connectedUserContext);
    const navigation = useContext(NavigationContext);
    const {fonts} = useTheme()

    const fetchEnfants = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 100));
        if (configContrat?.configContrat.body.numeroPajeEmployeur) {
            const val: Enfant[] = await getEnfantByPajeIdParent(configContrat?.configContrat.body.numeroPajeEmployeur);
            setEnfantren(val);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEnfants();
    }, []);

    const handleChildSelection = async (child: Enfant) => {
        setIsLoading(true);
        setLoadingText("Vérification si un contrat existe déjà ...");

        if (configContrat) {
            const contrats: ContratEntity[] = await recupererContratBySalarieParentAndEnfant(
                connectedUser.pajeId,
                configContrat.configContrat.body.assmat.pajeId,
                child.id
            );

            if (!!contrats && contrats.length === 0) {
                setSelectedEnfant(child);
                setStep(2);
            } else {
                setSelectedChild(child);
                setExistingContract(contrats[0]);
                setModalVisible(true);
            }
        }

        setIsLoading(false);
    };

    const handleModalChoice = async (overwrite: boolean) => {
        setLoadingText('Chargement ...');
        if (overwrite && existingContract) {
            setIsLoading(true);
            console.log("Overwriting existing contract for:", selectedChild?.nom);
            deleteContrat(existingContract.id).then((response: any) => {
                if (!!response) {
                    setSelectedEnfant(selectedChild!);
                    setStep(2);
                } else Toast.show({
                    type: 'error',
                    text1: 'Impossible d\'écraser le contrat',
                    visibilityTime: 4000,
                    autoHide: true
                });
            }).finally(function () {
                setIsLoading(false);
            });
        } else {
            if (!!existingContract) {
                setIsLoading(true);
                console.log("Using existing contract for:", selectedChild?.nom);
                await saveConfiguredContrat(existingContract.id);
                navigation?.navigate('Home');
                setIsLoading(false);
            }
        }

        setModalVisible(false);
    };

    if (isLoading) {
        return (
            <LoadingScreen></LoadingScreen>
        );
    }

    return (
        <View style={styles.main}>
            <Text style={[styles.title, fonts.titleLarge]}>Choix de l'enfant</Text>
            <Text style={[styles.subtitle, fonts.bodyMedium]}>Pour quel enfant gardé par <Text style={{ fontWeight: 'bold' }}> {configContrat?.configContrat.body.assmat.nom} {configContrat?.configContrat.body.assmat.prenom} </Text> souhaitez-vous configurer un contrat ?</Text>
            <ScrollView style={styles.listContainer}>
                {Enfantren.map((enfant, index) => (
                    <TouchableOpacity
                        style={styles.EnfantItem}
                        key={index}
                        onPress={() => { handleChildSelection(enfant) }}
                    >
                        <Text style={styles.EnfantName}>{enfant.nom + ' ' + enfant.prenom}</Text>
                        <Text style={styles.EnfantDob}>{enfant.dateNaissance}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <Text style={[styles.helpText, fonts.bodySmall]}>
                Vous ne trouvez pas votre enfant dans la liste ? Contactez l'admin qu'il procède à son enregistrement.
            </Text>

            {/* Modal for confirming action */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Un contrat existe déjà</Text>
                    <Text style={styles.modalMessage}>Souhaitez-vous écraser le contrat existant ou l'utiliser ?</Text>
                    <View style={styles.buttonContainer}>
                        <Button title="Écraser" onPress={() => handleModalChoice(true)} />
                        <Button title="Utiliser" onPress={() => handleModalChoice(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
    },
    listContainer: {
        maxHeight: '80%',
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: "black"
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 16,
        color: "black",
        textAlign: "center",
        paddingHorizontal: 20,
    },
    EnfantItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: "90%",
        alignSelf: "center"
    },
    EnfantName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "black"
    },
    EnfantDob: {
        fontSize: 14,
        color: '#666',
    },
    helpText: {
        marginTop: 16,
        fontSize: 14,
        color: '#666',
        textAlign: "center",
        paddingHorizontal: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "black"
    },
    modalView: {
        borderWidth: 1,
        marginTop: 'auto',
        backgroundColor: 'white',
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: .25,
        shadowRadius: .5,
        elevation: .5,
        marginBottom: 10,
        width: '95%',
        marginHorizontal: 'auto'
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'black'
    },
    modalMessage: {
        textAlign: 'center',
        marginBottom: 20,
        color: 'black'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    }
});

export default RenderStep1;