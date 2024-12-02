import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Appbar, Button, Text, Card, TextInput, IconButton, Divider, ActivityIndicator, Portal, Dialog, Paragraph, useTheme, Tooltip } from 'react-native-paper';
import { IndemniteEntity } from '../../../models/indemnites';
import { getDetailConfiguredContrat, modifierContrat, removeConfiguredContrat } from '../../../utils/contrat';
import { NavigationContext, useFocusEffect } from '@react-navigation/native';
import { getIndemniteByContratId, updateEntretieByContraId, updateKilometriqueByContraId, updateRepasByContraId } from '../../../utils/indemnite';
import Toast from 'react-native-toast-message';
import { connectedUserContext, UserContextType } from '../../../../App';
import { getModeGardeByType, type_A, type_B, TypeModeGarde } from '../../../utils/mode-de-garde';
import LoadingScreen from '../../../components/loading/LoadingScreens';
import { Body as Contrat } from '../ConfigurerContratPage/classes';
import { configuredContratContext } from '../Home/Home';
import { getModePayement, ModePayement, PAYMENT_MODES } from '../../../utils/conges';
import moment from 'moment';
import MonthSelectorCalendar from 'react-native-month-selector';
import { calculateNbHoursAndDays } from '../ConfigurerContratPage/fonctions';

enum IndemniteType {
    Entretien = "entretien",
    Repas = "repas",
    Kilometrique = "kilometrique",
}


const ContratProfile: React.FC = () => {
    const { fonts } = useTheme()
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
    const [showModalModifGarde, setShowModalModifGarde] = useState<boolean>(false);
    const [selectedModeGarde, setSelectedModeGarde] = useState<TypeModeGarde>();
    const [selectedNbSemmaine, setSelectedNbSemmaine] = useState("");
    const [loadingChangeModeGarde, setLoadingChangeModeGarde] = useState(false);
    const { configuredContrat, setConfiguredContrat } = useContext(configuredContratContext);

    const [showModalConges, setShowModalConges] = useState(false);
    const [selectedModePayement, setSelectedModePayement] = useState<ModePayement>();
    const [selectedMonth, setSelectedMonth] = useState(moment());
    const [loadingUpdateConges, setLoadingUpdateConges] = useState(false);

    const [showModalSalaires, setShowModalSalaires] = useState(false);
    const [salaireNormale, setSalaireNormale] = useState(0);
    const [salaireCompl, setSalaireCompl] = useState(0);
    const [salaireMajoree, setSalaireMajoree] = useState(0);
    const [loadingUpdateSalaires, setLoadingUpdateSalaires] = useState(false);

    const navigation = useContext(NavigationContext)

    //INIT

    const initData = async function (){
        try {
            const contratData: Contrat = await getDetailConfiguredContrat();
            const indemnite = await getIndemniteByContratId(contratData.id);
            setContrat(contratData);
            setSalaireNormale(contratData.salaireHoraireNet)
            setSalaireCompl(contratData.salaireHoraireComplementaireNet)
            setSalaireMajoree(contratData.salaireHoraireMajoreNet)
            setIndemnities(indemnite)
        } catch (err) {
            setError("Erreur lors du chargement des données du contrat");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        initData();
    }, []);

    useFocusEffect(
        useCallback(() => {
          initData();
        }, [])
      );

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

    //MODIF MODE GARDE
    const showToast = function (message: string, message1?: string, type: 'error' | 'info' | 'success' = 'error') {
        Toast.show({
            type: type,
            text1: message,
            text2: message1,
            visibilityTime: 2000,
            autoHide: true,
        })
    }

    const onConfirmModifModeGarde = function () {
        if (!selectedModeGarde) showToast("Aucun type selectionnée")
        else if (!!selectedModeGarde && (selectedModeGarde.type === type_B.type) && !selectedNbSemmaine) showToast("Données incomplet")
        else {
            setLoadingChangeModeGarde(true);
            var tmp = { ...configuredContrat }
            tmp.modeDeGarde = selectedModeGarde.type;
            tmp.nbSemainesTravaillees = (selectedModeGarde.type == "B") ? parseInt(selectedNbSemmaine) : 52;
            const [_nbHeuresNormalesHebdo, _nbHeuresNormalesMensu, _nbJoursMensu, _nbHeuresMajoreesHebdo, _nbHeuresSpecifiquesHebdo, _nbHeuresMajoreesMensu] = calculateNbHoursAndDays(tmp.planning, tmp.nbSemainesTravaillees, tmp.indexJourRepos);

            tmp.nbHeuresNormalesHebdo = _nbHeuresNormalesHebdo;
            tmp.nbHeuresNormalesMensu = _nbHeuresNormalesMensu;
            tmp.nbHeuresMajoreesHebdo = _nbHeuresMajoreesHebdo;
            tmp.nbHeuresMajoreesMensu = _nbHeuresMajoreesMensu;
            tmp.nbHeuresSpecifiquesHebdo = _nbHeuresSpecifiquesHebdo;
            tmp.nbJoursMensu = _nbJoursMensu;

            modifierContrat("MODE_GARDE", tmp).catch(error => {
                showToast(error.message || "Erreur pendant la modif")
            }).then((newContrat) => {
                return getDetailConfiguredContrat()
            }).then((contrat) => {
                setConfiguredContrat(contrat);
                setContrat(contrat);
                showToast("Modification reussi", undefined, "success");
                setShowModalModifGarde(false);
            })
                .finally(function () {
                    setLoadingChangeModeGarde(false);
                })
        }
    }


    //MODIF RENUMERATION GONGES
    const handleUpdateConges = async () => {
        if (!selectedModePayement || !contrat) return;
        else {

            setLoadingUpdateConges(true);
            try {
                const moisPriseConge = selectedMonth.month() + 1;
                const params = {
                    mode: selectedModePayement.type,
                    mois: selectedModePayement.type === 'LORS_PRISE_CONGES_PRINCIPAUX' ? moisPriseConge : -1
                };

                // Mettre à jour le contrat avec les nouvelles modalités de congés
                var updatedContrat = contrat;
                updatedContrat.remunerationCongesPayes = {
                    mode: params.mode,
                    mois: params.mois
                };

                await modifierContrat("RENUMERATION_CONGES_PAYES", updatedContrat);
                setContrat(updatedContrat);
                setShowModalConges(false);
                Toast.show({
                    type: 'success',
                    text1: 'Modification réussie',
                    visibilityTime: 2000,
                    autoHide: true,
                });
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Erreur lors de la modification',
                    visibilityTime: 2000,
                    autoHide: true,
                });
            } finally {
                setLoadingUpdateConges(false);
            }
        }
    };

    //MODIF SALAIRE
    const deuxChiffreApresVirgule = function (nbr: number) {
        return Math.round(nbr * 100) / 100
    }
    const handleConfirmModifSalaire = async function () {
        try {
            var updatedContrat = contrat;
            if (!updatedContrat) return;
            else {
                updatedContrat.salaireHoraireNet = salaireNormale;
                updatedContrat.salaireHoraireComplementaireNet = salaireCompl;
                updatedContrat.salaireHoraireMajoreNet = salaireMajoree;

                const taxRate = 0.22;
                updatedContrat.salaireHoraireBrut = deuxChiffreApresVirgule(salaireNormale / (1 - taxRate));
                updatedContrat.salaireHoraireComplementaireBrut = deuxChiffreApresVirgule(salaireCompl / (1 - taxRate));
                updatedContrat.salaireHoraireMajoreBrut = deuxChiffreApresVirgule(salaireMajoree / (1 - taxRate));

                const heuresNormalesMensu = updatedContrat.nbHeuresNormalesMensu || 151.67; // Default to 151.67 if not available
                updatedContrat.salaireMensuelNet = salaireNormale * heuresNormalesMensu;

                updatedContrat.salaireMajore = salaireMajoree - salaireNormale;

                await modifierContrat("MODIF_SALAIRE", updatedContrat);
                setContrat(updatedContrat);
                setShowModalSalaires(false);
                Toast.show({
                    type: 'success',
                    text1: 'Modification réussie',
                    visibilityTime: 2000,
                    autoHide: true,
                });
            }

        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Erreur lors de la modification',
                visibilityTime: 2000,
                autoHide: true,
            });
        } finally {

        }
    }

    //HISTORIQUES
    const handleClicHistorique = function () {
        navigation?.navigate("HistoriqueContratList");
    }

    if (loading) {
        return <LoadingScreen />
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={{ ...styles.errorText, ...fonts.bodyMedium }}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Appbar.Header
                style={{
                    backgroundColor: '#ffffff', // ou votre couleur de fond
                    elevation: 2, // pour Android
                    shadowOpacity: 0.1, // pour iOS
                }}
            >
                <Appbar.BackAction
                    onPress={() => navigation?.goBack()}
                />

                <Appbar.Content
                    title=""
                />

                {/* Action pour l'historique */}
                <Tooltip title="Historique des contrats">
                    <Appbar.Action
                        icon="history"
                        onPress={handleClicHistorique}
                        color="#1f2937"
                    // Si vous voulez ajouter un badge
                    // style={{ position: 'relative' }}
                    />
                </Tooltip>

            </Appbar.Header>

            <ScrollView>
                {contrat && (
                    <Card style={styles.card}>
                        <Card.Content>
                            <Text style={{ ...styles.title, ...fonts.titleLarge }}>Détails du Contrat</Text>

                            {contrat.enfant && (
                                <>
                                    <View style={styles.detailContainer}>
                                        <Text style={{ ...styles.detailLabel, ...fonts.bodyLarge }}>Enfant:</Text>
                                        <Text style={{ ...styles.detailText, ...fonts.bodyMedium }}>{`${contrat.enfant.prenom} ${contrat.enfant.nom}`}</Text>
                                    </View>
                                    <View style={styles.detailContainer}>
                                        <Text style={{ ...styles.detailLabel, ...fonts.bodyLarge }}>Date de naissance:</Text>
                                        <Text style={{ ...styles.detailText, ...fonts.bodyMedium }}>{new Date(contrat.enfant.dateNaissance).toLocaleDateString()}</Text>
                                    </View>
                                </>
                            )}

                            <Divider style={styles.divider} />

                            {contrat.assmat && (
                                <View style={styles.detailContainerColumn}>
                                    <Text style={{ ...styles.detailLabel, ...fonts.bodyLarge }}>Assistant(e) maternel(le):</Text>
                                    <Text style={{ ...styles.detailText, ...fonts.bodyMedium }}>{`${contrat.assmat.prenom} ${contrat.assmat.nom}`}</Text>
                                </View>
                            )}

                            {contrat.parent && (
                                <View style={styles.detailContainerColumn}>
                                    <Text style={{ ...styles.detailLabel, ...fonts.bodyLarge }}>Parent employeur:</Text>
                                    <Text style={{ ...styles.detailText, ...fonts.bodyMedium }}>{`${contrat.parent.prenom} ${contrat.parent.nom}`}</Text>
                                </View>
                            )}

                            <Divider style={styles.divider} />
                            <View style={styles.detailContainer}>
                                <Text style={{ ...styles.detailLabel, ...fonts.titleMedium }}>Garde :</Text>
                                {connectedUser.profile == "PAJE_EMPLOYEUR" && <IconButton
                                    icon="pencil"
                                    size={20}
                                    onPress={() => { setShowModalModifGarde(true) }}
                                    style={styles.modifyButton}
                                />}
                            </View>
                            <View style={styles.detailContainer}>
                                <Text style={{ ...styles.detailLabel, ...fonts.bodyLarge }}>Mode de garde:</Text>
                                <Text style={{ ...styles.detailText, ...fonts.bodyMedium }}>{(contrat.modeDeGarde == "A") ? "Année complete" : "Année incomplete"}</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <Text style={{ ...styles.detailLabel, ...fonts.bodyLarge }}>Semaines travaillées:</Text>
                                <Text style={{ ...styles.detailText, ...fonts.bodyMedium }}>{contrat.nbSemainesTravaillees} semaines</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <Text style={{ ...styles.detailLabel, ...fonts.bodyLarge }}>Heures normales hebdo:</Text>
                                <Text style={{ ...styles.detailText, ...fonts.bodyMedium }}>{contrat.nbHeuresNormalesHebdo} h</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <Text style={{ ...styles.detailLabel, ...fonts.bodyLarge }}>Heures majorées hebdo:</Text>
                                <Text style={{ ...styles.detailText, ...fonts.bodyMedium }}>{contrat.nbHeuresMajoreesHebdo} h</Text>
                            </View>

                            <Divider style={styles.divider} />
                            <View style={styles.detailContainer}>
                                <Text style={{ ...styles.detailLabel, ...fonts.titleMedium }}>Salaires :</Text>
                                {connectedUser.profile == "PAJE_EMPLOYEUR" && <IconButton
                                    icon="pencil"
                                    size={20}
                                    onPress={() => { setShowModalSalaires(true) }}
                                    style={styles.modifyButton}
                                />}
                            </View>
                            <View style={styles.detailContainer}>
                                <Text style={{ ...styles.detailLabel, ...fonts.bodyLarge }}>Salaire horaire net:</Text>
                                <Text style={{ ...styles.detailText, ...fonts.bodyMedium }}>{`${contrat.salaireHoraireNet.toFixed(2)}€`}</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <Text style={{ ...styles.detailLabel, ...fonts.bodyLarge }}>Salaire complementaire net:</Text>
                                <Text style={{ ...styles.detailText, ...fonts.bodyMedium }}>{`${contrat.salaireHoraireComplementaireNet.toFixed(2)}€/h`}</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <Text style={{ ...styles.detailLabel, ...fonts.bodyLarge }}>Salaire majoré net:</Text>
                                <Text style={{ ...styles.detailText, ...fonts.bodyMedium }}>{`${contrat.salaireHoraireMajoreNet.toFixed(2)}€/h`}</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <Text style={{ ...styles.detailLabel, ...fonts.bodyLarge }}>Salaire mensuel net:</Text>
                                <Text style={{ ...styles.detailText, ...fonts.bodyMedium }}>{`${contrat.salaireMensuelNet.toFixed(2)}€`}</Text>
                            </View>

                            <Divider style={styles.divider} />
                            <View style={styles.detailContainer}>
                                <Text style={{ ...styles.detailLabel, ...fonts.titleMedium }}>Dates :</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <Text style={{ ...styles.detailLabel, ...fonts.bodyLarge }}>Date de début:</Text>
                                <Text style={{ ...styles.detailText, ...fonts.bodyMedium }}>{new Date(contrat.dateDebut).toLocaleDateString()}</Text>
                            </View>

                            <View style={styles.detailContainer}>
                                <Text style={{ ...styles.detailLabel, ...fonts.bodyLarge }}>Date de fin:</Text>
                                <Text style={{ ...styles.detailText, ...fonts.bodyMedium }}>{new Date(contrat.dateFin).toLocaleDateString()}</Text>
                            </View>


                            <Divider style={styles.divider} />
                            <View style={styles.detailContainer}>
                                <Text style={{ ...styles.detailLabel, ...fonts.titleMedium }}>Renumeration des conges :</Text>
                                {connectedUser.profile == "PAJE_EMPLOYEUR" && <IconButton
                                    icon="pencil"
                                    size={20}
                                    onPress={() => { setShowModalConges(true) }}
                                    style={styles.modifyButton}
                                />}
                            </View>
                            <View style={styles.detailContainer}>
                                <Text style={{ ...styles.detailLabel, ...fonts.bodyLarge }}> {getModePayement(contrat.remunerationCongesPayes.mode)?.titre} </Text>
                            </View>

                            <Divider style={styles.divider} />
                            <View style={styles.detailContainer}>
                                <Text style={{ ...styles.detailLabel, ...fonts.titleMedium }}>Planning hebdomadaire:</Text>
                                <IconButton
                                    icon="calendar-week"
                                    size={20}
                                    onPress={() => { navigation?.navigate("DetailPlanningPage", {
                                        contrat: contrat
                                    }) }}
                                    style={styles.modifyButton}
                                />
                            </View>
                            
                        </Card.Content>
                    </Card>
                )}

                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={{ ...styles.title, ...fonts.titleLarge }}>Indemnités</Text>
                        {Object.values(IndemniteType).map((type) => (
                            <View key={type} style={styles.indemnityContainer}>
                                <Text style={{ ...styles.indemnityText, ...fonts.bodyMedium }}>{`Indemnité ${type}: ${indemnities[type] || 0} €`}</Text>
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

                <Button icon="file-document-multiple" mode="contained" onPress={handleClicHistorique} style={{ ...styles.unlinkButton, borderRadius: 8 }}>
                    Historique des contrats
                </Button>

                <Button icon="file-cancel" buttonColor='#dc2626' mode="contained" onPress={() => { navigation?.navigate("ResiliationContratPage") }} style={{ ...styles.unlinkButton, borderRadius: 8 }}>
                    Resiliation de contrats
                </Button>

                <Button
                    icon="link-off"
                    mode="outlined"
                    onPress={() => setUnlinkDialogVisible(true)}
                    textColor="#dc2626"
                    rippleColor="rgba(220, 38, 38, 0.12)"
                    style={{
                        borderColor: '#dc2626',
                        borderWidth: 1.5,
                        borderRadius: 8,
                        ...styles.unlinkButton
                    }}
                    labelStyle={{
                        fontWeight: '500',
                    }}
                >
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
                    <Dialog.Title>Delier le contrat de l'application </Dialog.Title>
                    <Dialog.Content>
                        <Paragraph style={fonts.bodyMedium}>Êtes-vous sûr de vouloir delier le contrat de l'application ?</Paragraph>
                        <Paragraph style={fonts.bodyMedium}>Noter que le contrat ne va pas etre supprimée</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setUnlinkDialogVisible(false)}>Annuler</Button>
                        <Button onPress={handleUnlinkContract}>Confirmer</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <Portal>
                <Dialog dismissable={!loadingChangeModeGarde} visible={showModalModifGarde} onDismiss={() => setShowModalModifGarde(false)}>
                    <Dialog.Title>Modifier le mode de garde</Dialog.Title>
                    <Dialog.Content style={{ alignItems: 'center', }}>
                        {
                            [type_A, type_B].map((type, index) => <TouchableOpacity onPress={() => { setSelectedModeGarde(type) }} style={{ backgroundColor: (selectedModeGarde?.type == type.type) ? "#fff" : "transparent", width: "100%", borderWidth: 1, borderColor: (selectedModeGarde?.type == type.type) ? "#afafaf" : "#cfcfcf", padding: 10, marginBottom: 10, borderRadius: 5 }} key={index}>
                                <Text style={fonts.titleSmall}>{type.titre}</Text>
                                <Text style={fonts.bodyMedium}>{type.desc}</Text>
                            </TouchableOpacity>)
                        }
                        {(selectedModeGarde?.type === type_B.type) && <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="Nombre de semmaine de garde"
                            value={selectedNbSemmaine}
                            onChangeText={setSelectedNbSemmaine}
                        />}
                    </Dialog.Content>
                    {!loadingChangeModeGarde ? <Dialog.Actions>
                        <Button onPress={() => setShowModalModifGarde(false)}>Annuler</Button>
                        <Button onPress={onConfirmModifModeGarde}>Confirmer</Button>
                    </Dialog.Actions> :
                        <ActivityIndicator style={{ marginBottom: 20 }}></ActivityIndicator>}
                </Dialog>
            </Portal>


            <Portal>
                <Dialog dismissable={!loadingUpdateSalaires} visible={showModalSalaires} onDismiss={() => setShowModalSalaires(false)}>
                    <Dialog.Title>Modifier les salaires</Dialog.Title>
                    <Dialog.Content style={{ alignItems: 'center', }}>
                        <Text style={[fonts.titleSmall, { width: "100%", marginTop: 10, marginBottom: 5 }]}>Salaire normale:</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="ex: 4€/h"
                            value={salaireNormale.toString() || ""}
                            onChangeText={(text: string) => { setSalaireNormale(parseFloat(text) || 0) }}
                        />
                        <Text style={[fonts.titleSmall, { width: "100%", marginTop: 10, marginBottom: 5 }]}>Salaire complementaire:</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="ex: 4€/h"
                            value={salaireCompl.toString() || ""}
                            onChangeText={(text: string) => { setSalaireCompl(parseFloat(text) || 0) }}
                        />
                        <Text style={[fonts.titleSmall, { width: "100%", marginTop: 10, marginBottom: 5 }]}>Salaire majorée:</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="ex: 4€/h"
                            value={salaireMajoree.toString() || ""}
                            onChangeText={(text: string) => { setSalaireMajoree(parseFloat(text) || 0) }}
                        />
                    </Dialog.Content>
                    {!loadingUpdateSalaires ? <Dialog.Actions>
                        <Button onPress={() => setShowModalSalaires(false)}>Annuler</Button>
                        <Button onPress={handleConfirmModifSalaire}>Confirmer</Button>
                    </Dialog.Actions> :
                        <ActivityIndicator style={{ marginBottom: 20 }}></ActivityIndicator>}
                </Dialog>
            </Portal>


            <Portal>
                <Dialog
                    visible={showModalConges}
                    onDismiss={() => setShowModalConges(false)}
                    style={styles.congesDialog}
                >
                    <Dialog.Title>Modifier la méthode de rémunération des congés</Dialog.Title>
                    <Dialog.ScrollArea>
                        <ScrollView contentContainerStyle={styles.dialogScrollContent}>
                            <Text style={styles.dialogSubtitle}>
                                Sélectionnez votre modalité de paiement des indemnités de congés payés
                            </Text>
                            {PAYMENT_MODES.map((modalite, index) => (
                                <View key={modalite.type}>
                                    <TouchableOpacity
                                        style={[
                                            styles.modaliteItem,
                                            modalite.type === selectedModePayement?.type && styles.selectedModaliteItem
                                        ]}
                                        onPress={() => setSelectedModePayement(modalite)}
                                    >
                                        <Text style={styles.typeName}>{modalite.titre}</Text>
                                        <Text style={styles.typeDescription}>{modalite.description}</Text>
                                    </TouchableOpacity>

                                    {modalite.type === 'LORS_PRISE_CONGES_PRINCIPAUX' &&
                                        selectedModePayement?.type === 'LORS_PRISE_CONGES_PRINCIPAUX' && (
                                            <View style={styles.monthSelectorContainer}>
                                                <Text style={styles.monthSelectorLabel}>
                                                    Sélectionnez le mois de la prise des congés :
                                                </Text>
                                                <MonthSelectorCalendar
                                                    selectedDate={selectedMonth}
                                                    onMonthTapped={(month: any) => setSelectedMonth(month)}
                                                    maxDate={moment().endOf('year')}
                                                />
                                            </View>
                                        )}
                                </View>
                            ))}
                        </ScrollView>
                    </Dialog.ScrollArea>
                    <Dialog.Actions>
                        <Button onPress={() => setShowModalConges(false)}>Annuler</Button>
                        <Button
                            onPress={handleUpdateConges}
                            disabled={!selectedModePayement || loadingUpdateConges}
                        >
                            {loadingUpdateConges ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                'Confirmer'
                            )}
                        </Button>
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
        margin: 10,
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
        padding: 0,
    },
    detailContainerColumn: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailLabel: {
        marginLeft: 0,
        fontSize: 15,
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
    congesDialog: {
        maxHeight: '80%',
    },
    dialogScrollContent: {
        paddingHorizontal: 0,
        paddingVertical: 8,
    },
    dialogSubtitle: {
        fontSize: 16,
        marginBottom: 16,
        textAlign: 'center',
    },
    modaliteItem: {
        padding: 16,
        borderWidth: 0.5,
        borderRadius: 5,
        marginBottom: 10,
        borderColor: '#ccc',
    },
    selectedModaliteItem: {
        borderWidth: 1,
        backgroundColor: '#f1f1f1',
    },
    typeName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    typeDescription: {
        fontSize: 14,
        color: '#666',
    },
    monthSelectorContainer: {
        marginTop: 10,
    },
    monthSelectorLabel: {
        marginBottom: 10,
    },
});

export default ContratProfile;