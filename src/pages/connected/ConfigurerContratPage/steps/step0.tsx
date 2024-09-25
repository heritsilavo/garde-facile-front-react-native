import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Modal, Button } from "react-native";
import { Assmat } from "../classes";
import { getAssociatedAssmatByPajeIdParent, logout } from "../../../../utils/user";
import { connectedUserContext } from "../../../../../App";
import User from "../../../../models/user";
import { deleteContrat, getContratByPajeIdParentAndSalarie, saveConfiguredContrat } from "../../../../utils/contrat";
import { Body as ContratEntity } from "../classes";
import Toast from "react-native-toast-message";
import { NavigationContext } from "@react-navigation/native";

const RenderStep0 = ({ setStep, setSelectedssmat }: { setStep: any, setSelectedssmat: any }) => {
    const [Assmatren, setAssmatren] = useState<Assmat[]>([]);
    const [loadingText, setLoadingText] = useState<string>('Chargement en cours...');
    const [isLoading, setIsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAssmat, setSelectedAssmat] = useState<Assmat | null>(null);
    const [existingContract, setExistingContract] = useState<ContratEntity | null>(null);
    const navigation = useContext(NavigationContext);
    const { connectedUser, setConnectedUser }: { connectedUser: User, setConnectedUser: any } | any = useContext(connectedUserContext);

    const fetchAssmats = async () => {
        setIsLoading(true);
        if (connectedUser.pajeId) {
            const val: Assmat[] = await getAssociatedAssmatByPajeIdParent(connectedUser.pajeId);
            setAssmatren(val);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAssmats();
    }, []);

    const handleChildSelection = async (child: Assmat) => {
        setIsLoading(true);
        setLoadingText("Vérification si un contrat existe déjà ...");

        const contrat: ContratEntity = await getContratByPajeIdParentAndSalarie(connectedUser.pajeId, child.pajeId);
        
        if (!contrat) {
            setSelectedssmat(child);
            setStep(1);
        } else {
            // Set the selected assmat and existing contract for modal confirmation
            setSelectedAssmat(child);
            setExistingContract(contrat);
            setModalVisible(true);
        }

        setIsLoading(false);
    };

    const handleModalChoice =async (overwrite: boolean) => {
        setLoadingText('Chargement ...')
        if (overwrite && existingContract) {
            setIsLoading(true)
            console.log("Overwriting existing contract for:", selectedAssmat?.nom);
            deleteContrat(existingContract.id).then((response:any)=>{
                if (!!response) {
                    setSelectedssmat(selectedAssmat!);
                    setStep(1);
                }else Toast.show({
                    type:'error',
                    text1:'Impossible d\'ecraser le contrat',
                    visibilityTime:4000,
                    autoHide:true
                })
            }).finally(function(){
                setIsLoading(false)
            })
            
        } else {
            if (!!existingContract) {
                setIsLoading(true)
                console.log("Using existing contract for: >>>>", selectedAssmat?.nom);
                await saveConfiguredContrat(existingContract.id);
                navigation?.navigate('Home');
                setIsLoading(false)
            }
        }

        // Close the modal after making a choice
        setModalVisible(false);
    };

    if (isLoading) {
        return (
            <View style={{ ...styles.main, justifyContent: "center" }}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>{loadingText}</Text>
            </View>
        );
    }

    return (
        <View style={styles.main}>
            <Text style={styles.title}>Choix de l'assistante maternelle</Text>
            <Text style={styles.subtitle}>Pour quelle assistante maternelle, rattachée à votre compte voulez-vous configurer un contrat</Text>

            <ScrollView style={styles.listContainer}>
                {Assmatren.map((assmat, index) => (
                    <TouchableOpacity
                        style={styles.AssmatItem}
                        key={index}
                        onPress={() => { handleChildSelection(assmat) }}
                    >
                        <Text style={styles.AssmatName}>{assmat.nom + ' ' + assmat.prenom}</Text>
                        <Text style={styles.AssmatDob}>{assmat.pajeId}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Text style={styles.helpText}>
                Vous ne trouvez pas votre assistante maternelle dans la liste ? Contactez l'admin qu'il procède à son enregistrement.
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
        width: '100%', // ensure the scroll view takes the full width
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
    AssmatItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: "90%",
        alignSelf: "center"
    },
    AssmatName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "black"
    },
    AssmatDob: {
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
        borderWidth:1,
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
        marginBottom:10,
        width:'95%',
        marginHorizontal:'auto'
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color:'black'
    },
    modalMessage: {
        textAlign: 'center',
        marginBottom: 20,
        color:'black'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    }
});

export default RenderStep0;