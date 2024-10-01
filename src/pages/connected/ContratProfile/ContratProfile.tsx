import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Appbar, Button, Text, Card, TextInput, IconButton, Divider, ActivityIndicator, Portal, Dialog, Paragraph, useTheme } from 'react-native-paper';
import { IndemniteEntity } from '../../../models/indemnites';
import { getDetailConfiguredContrat, removeConfiguredContrat } from '../../../utils/contrat';
import { NavigationContext } from '@react-navigation/native';
import { getIndemniteByContratId, updateEntretieByContraId, updateKilometriqueByContraId, updateRepasByContraId } from '../../../utils/indemnite';
import Toast from 'react-native-toast-message';
import { connectedUserContext, UserContextType } from '../../../../App';

enum IndemniteType {
    Entretien = "entretien",
    Repas = "repas",
    Kilometrique = "kilometrique",
}

interface Contrat {
    id: string;
    numeroPajeEmployeur: string;
    numeroPajeSalarie: string;
    enfant?: {
        nom: string;
        prenom: string;
        dateNaissance: string;
    };
    assmat?: {
        nom: string;
        prenom: string;
    };
    parent?: {
        nom: string;
        prenom: string;
    };
    modeDeGarde: string;
    anneeComplete: boolean;
    nbSemainesTravaillees: number;
    nbHeuresNormalesHebdo: number;
    nbHeuresMajoreesHebdo: number;
    salaireHoraireNet: number;
    salaireMensuelNet: number;
    dateDebut: string;
}

const ContratProfile: React.FC = () => {
    const {fonts} = useTheme()
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedIndemnityType, setSelectedIndemnityType] = useState<IndemniteType | null>(null);
    const [indemnityAmount, setIndemnityAmount] = useState<string>('');
    const [contrat, setContrat] = useState<Contrat | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [indemnities, setIndemnities] = useState<IndemniteEntity>(new IndemniteEntity());
    const [isLoadingChangeIndemnite, setIsLoadingChangeIndemnite] = useState<boolean>(false);
    const { connectedUser } = useContext<UserContextType>(connectedUserContext);
    const [unlinkDialogVisible, setUnlinkDialogVisible] = useState<boolean>(false);

    const navigation = useContext(NavigationContext)

    //INIT
    useEffect(() => {
        (async function () {
            try {
                const contratData = await getDetailConfiguredContrat();
                const indemnite = await getIndemniteByContratId(contratData.id);
                setContrat(contratData);
                setIndemnities(indemnite)
            } catch (err) {
                setError("Erreur lors du chargement des données du contrat");
                console.error(err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    //OPEN MODAL
    const handleModifyIndemnity = (type: IndemniteType) => {
        setSelectedIndemnityType(type);
        setIndemnityAmount(indemnities[type] ? indemnities[type].toString() : "0");
        setModalVisible(true);
    };

    const confirmModifIndemnitee = () => {
        if (selectedIndemnityType) {
            setIsLoadingChangeIndemnite(true);
            const amount = parseFloat(indemnityAmount);
            var newIndemnite: IndemniteEntity = { ...indemnities };
            if (!isNaN(amount)) {
                setIndemnities((prev) => {
                    newIndemnite = {
                        ...prev,
                        [selectedIndemnityType]: amount,
                    }
                    return newIndemnite;
                });
            }

            if ((selectedIndemnityType == IndemniteType.Entretien) && !!contrat) {
                updateEntretieByContraId(contrat?.id, amount).then(function () {
                    setModalVisible(false);
                    setSelectedIndemnityType(null);
                    setIndemnityAmount('');
                    setIsLoadingChangeIndemnite(false);
                }).catch(function () {
                    Toast.show({
                        autoHide: true,
                        type: "error",
                        text1: "Impossible de modifier  cet indemnitée"
                    })
                    setIsLoadingChangeIndemnite(false);
                })
            } else if ((selectedIndemnityType == IndemniteType.Kilometrique) && !!contrat) {
                updateKilometriqueByContraId(contrat?.id, amount).then(function () {
                    setModalVisible(false);
                    setSelectedIndemnityType(null);
                    setIndemnityAmount('');
                    setIsLoadingChangeIndemnite(false);
                }).catch(function () {
                    Toast.show({
                        autoHide: true,
                        type: "error",
                        text1: "Impossible de modifier  cet indemnitée"
                    })
                    setIsLoadingChangeIndemnite(false);
                })
            } else if ((selectedIndemnityType == IndemniteType.Repas) && !!contrat) {
                updateRepasByContraId(contrat?.id, amount).then(function () {
                    setModalVisible(false);
                    setSelectedIndemnityType(null);
                    setIndemnityAmount('');
                    setIsLoadingChangeIndemnite(false);
                }).catch(function () {
                    Toast.show({
                        autoHide: true,
                        type: "error",
                        text1: "Impossible de modifier  cet indemnitée"
                    })
                    setIsLoadingChangeIndemnite(false);
                })
            } else {

            }

            console.log(newIndemnite);
        }
    };

    const handleUnlinkContract = async () => {
        await removeConfiguredContrat();
        (connectedUser.profile === "PAJE_EMPLOYEUR") ?
            navigation?.reset({
                index: 0, routes: [{ name: "ElementsAMunirPage" }]
            }) :
            navigation?.reset({
                index: 0, routes: [{ name: "Login" }]
            })
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={{...fonts.bodyMedium}}>Chargement des données du contrat...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={{...styles.errorText,...fonts.bodyMedium}}>{error}</Text>
            </View>
        );
    }



    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation?.goBack()} />
            </Appbar.Header>

            <ScrollView>
                {contrat && (
                    <Card style={styles.card}>
                        <Card.Content>
                            <Text style={{...styles.title, ...fonts.titleLarge}}>Détails du Contrat</Text>
                            {contrat.enfant && (
                                <>
                                    <View style={styles.detailContainer}>
                                        <Text style={{...styles.detailLabel, ...fonts.bodyLarge}}>Enfant:</Text>
                                        <Text style={{...styles.detailText, ...fonts.bodyMedium}}>{`${contrat.enfant.prenom} ${contrat.enfant.nom}`}</Text>
                                    </View>
                                    <View style={styles.detailContainer}>
                                        <Text style={{...styles.detailLabel, ...fonts.bodyLarge}}>Date de naissance:</Text>
                                        <Text style={{...styles.detailText, ...fonts.bodyMedium}}>{new Date(contrat.enfant.dateNaissance).toLocaleDateString()}</Text>
                                    </View>
                                </>
                            )}
                            <Divider style={styles.divider} />
                            {contrat.assmat && (
                                <View style={styles.detailContainerColumn}>
                                    <Text style={{...styles.detailLabel, ...fonts.bodyLarge}}>Assistant(e) maternel(le):</Text>
                                    <Text style={{...styles.detailText, ...fonts.bodyMedium}}>{`${contrat.assmat.prenom} ${contrat.assmat.nom}`}</Text>
                                </View>
                            )}
                            {contrat.parent && (
                                <View style={styles.detailContainerColumn}>
                                    <Text style={{...styles.detailLabel, ...fonts.bodyLarge}}>Parent employeur:</Text>
                                    <Text style={{...styles.detailText, ...fonts.bodyMedium}}>{`${contrat.parent.prenom} ${contrat.parent.nom}`}</Text>
                                </View>
                            )}
                            <Divider style={styles.divider} />
                            <View style={styles.detailContainer}>
                                <Text style={{...styles.detailLabel, ...fonts.bodyLarge}}>Mode de garde:</Text>
                                <Text style={{...styles.detailText, ...fonts.bodyMedium}}>{contrat.modeDeGarde === 'A' ? 'Année complète' : 'Année incomplète'}</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <Text style={{...styles.detailLabel, ...fonts.bodyLarge}}>Semaines travaillées:</Text>
                                <Text style={{...styles.detailText, ...fonts.bodyMedium}}>{contrat.nbSemainesTravaillees}</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <Text style={{...styles.detailLabel, ...fonts.bodyLarge}}>Heures normales hebdo:</Text>
                                <Text style={{...styles.detailText, ...fonts.bodyMedium}}>{contrat.nbHeuresNormalesHebdo}</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <Text style={{...styles.detailLabel, ...fonts.bodyLarge}}>Heures majorées hebdo:</Text>
                                <Text style={{...styles.detailText, ...fonts.bodyMedium}}>{contrat.nbHeuresMajoreesHebdo}</Text>
                            </View>
                            <Divider style={styles.divider} />
                            <View style={styles.detailContainer}>
                                <Text style={{...styles.detailLabel, ...fonts.bodyLarge}}>Salaire horaire net:</Text>
                                <Text style={{...styles.detailText, ...fonts.bodyMedium}}>{`${contrat.salaireHoraireNet.toFixed(2)}€`}</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <Text style={{...styles.detailLabel, ...fonts.bodyLarge}}>Salaire mensuel net:</Text>
                                <Text style={{...styles.detailText, ...fonts.bodyMedium}}>{`${contrat.salaireMensuelNet.toFixed(2)}€`}</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <Text style={{...styles.detailLabel, ...fonts.bodyLarge}}>Date de début:</Text>
                                <Text style={{...styles.detailText, ...fonts.bodyMedium}}>{new Date(contrat.dateDebut).toLocaleDateString()}</Text>
                            </View>
                        </Card.Content>
                    </Card>
                )}

                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={{...styles.title, ...fonts.titleLarge}}>Indemnités</Text>
                        {Object.values(IndemniteType).map((type) => (
                            <View key={type} style={styles.indemnityContainer}>
                                <Text  style={{...styles.indemnityText, ...fonts.bodyMedium}}>{`Indemnité ${type}: ${indemnities[type] || 0} €`}</Text>
                                {
                                    connectedUser.profile == "PAJE_EMPLOYEUR" && <IconButton
                                        icon="pencil"
                                        size={20}
                                        onPress={() => handleModifyIndemnity(type)}
                                        style={styles.modifyButton}
                                    />
                                }
                            </View>
                        ))}
                    </Card.Content>
                </Card>

                <Button rippleColor='#fc2121' textColor='#fc2121' mode="outlined" onPress={()=>setUnlinkDialogVisible(true)} style={styles.unlinkButton}>
                    Délier le contrat de l'application
                </Button>
            </ScrollView>

            <Modal visible={modalVisible} animationType="fade" transparent={true} onRequestClose={() => setModalVisible(false)}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>
                            Modifier indemnité {selectedIndemnityType}
                        </Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="Montant de l'indemnité"
                            value={indemnityAmount}
                            onChangeText={setIndemnityAmount}
                        />
                        <View style={styles.buttonContainer}>
                            <Button mode="contained" onPress={confirmModifIndemnitee} style={styles.button}>
                                {isLoadingChangeIndemnite ? <ActivityIndicator color='white'></ActivityIndicator> : "Confirmer"}
                            </Button>
                            <Button mode="outlined" onPress={() => setModalVisible(false)} style={styles.button}>
                                Annuler
                            </Button>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>

            <Portal>
                <Dialog visible={unlinkDialogVisible} onDismiss={() => setUnlinkDialogVisible(false)}>
                    <Dialog.Title> Delier le contrat de l'application </Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>Êtes-vous sûr de vouloir delier le contrat de l'application ?</Paragraph>
                        <Paragraph>Noter que le contrat ne va pas etre supprimée</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setUnlinkDialogVisible(false)}>Annuler</Button>
                        <Button onPress={handleUnlinkContract}>Confirmer</Button>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
    },
    card: {
        margin: 16,
        elevation: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    detailContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailContainerColumn: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
    },
    detailText: {
        fontSize: 16,
        color: '#333',
    },
    divider: {
        marginVertical: 12,
    },
    indemnityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    indemnityText: {
        fontSize: 16,
        color: '#333',
    },
    modifyButton: {
        margin: 0,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 12,
        alignItems: 'center',
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        height: 50,
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    button: {
        width: '45%',
    },
    unlinkButton: {
        marginVertical: 8,
        width: '90%',
        marginHorizontal: 16
    },
});

export default ContratProfile;