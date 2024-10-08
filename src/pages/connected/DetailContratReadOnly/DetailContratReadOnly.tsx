import { NavigationProp, RouteProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Card, Divider, Text, useTheme } from 'react-native-paper';
import { Body as Contrat } from '../ConfigurerContratPage/classes';
import { ContratHistorique } from '../../../models/contrat-historique';
import { motifHistorisationEnumFromKey } from '../../../utils/MotifHistorisationEnum';
import { getModePayement } from '../../../utils/conges';
import { getMonthNameByIndex } from '../../../utils/date';


type RootStackParamList = {
    DetailContratReadOnly: {
        contrat: Contrat | ContratHistorique;
        isHistorique?: boolean;
    };
};

type DetailContratReadOnlyProps = NativeStackScreenProps<RootStackParamList, 'DetailContratReadOnly'>;

const DetailContratReadOnly: React.FC<DetailContratReadOnlyProps> = ({ navigation, route }) => {
    const { contrat, isHistorique = false } = route.params;
    const { fonts } = useTheme();

    const isHistoriqueContrat = (contrat: Contrat | ContratHistorique): contrat is ContratHistorique => {
        return 'dateHistorisation' in contrat;
    };

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.appBar}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
            </Appbar.Header>
            <ScrollView style={styles.scrollView}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={{ ...styles.title, ...fonts.titleLarge }}>
                            Détails du Contrat {isHistorique && '(Historique)'}
                        </Text>

                        {/* Section Historique si applicable */}
                        {isHistoriqueContrat(contrat) && (
                            <>
                                <View style={styles.section}>
                                    <Text style={{ ...styles.sectionTitle, ...fonts.titleMedium }}>
                                        Informations de version
                                    </Text>
                                    <View style={styles.detailRow}>
                                        <Text style={{ ...styles.label, ...fonts.bodyLarge }}>Version:</Text>
                                        <Text style={{ ...styles.value, ...fonts.bodyMedium }}>
                                            {contrat.version}
                                        </Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={{ ...styles.label, ...fonts.bodyLarge }}>Date de modification:</Text>
                                        <Text style={{ ...styles.value, ...fonts.bodyMedium }}>
                                            {new Date(contrat.dateHistorisation).toLocaleDateString()}
                                        </Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={{ ...styles.label, ...fonts.bodyLarge }}>Modifié par:</Text>
                                        <Text style={{ ...styles.value, ...fonts.bodyMedium }}>
                                            {contrat.utilisateurHistorisation}
                                        </Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={{ ...styles.label, ...fonts.bodyLarge }}>Motif:</Text>
                                        <Text style={{ ...styles.value, ...fonts.bodyMedium }}>
                                            {motifHistorisationEnumFromKey(contrat.motifHistorisation)?.toString()}
                                        </Text>
                                    </View>
                                </View>
                                <Divider style={styles.divider} />
                            </>
                        )}

                        {/* Section Enfant */}
                        <View style={styles.section}>
                            <Text style={{ ...styles.sectionTitle, ...fonts.titleMedium }}>Information de l'enfant</Text>
                            <View style={styles.detailRow}>
                                <Text style={{ ...styles.label, ...fonts.bodyLarge }}>Nom complet:</Text>
                                <Text style={{ ...styles.value, ...fonts.bodyMedium }}>
                                    {`${contrat.enfant.prenom} ${contrat.enfant.nom}`}
                                </Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={{ ...styles.label, ...fonts.bodyLarge }}>Date de naissance:</Text>
                                <Text style={{ ...styles.value, ...fonts.bodyMedium }}>
                                    {new Date(contrat.enfant.dateNaissance).toLocaleDateString()}
                                </Text>
                            </View>
                        </View>

                        <Divider style={styles.divider} />

                        {/* Section Assistant(e) Maternel(le) */}
                        <View style={styles.section}>
                            <Text style={{ ...styles.sectionTitle, ...fonts.titleMedium }}>
                                Assistant(e) Maternel(le)
                            </Text>
                            <View style={styles.detailRow}>
                                <Text style={{ ...styles.label, ...fonts.bodyLarge }}>Nom complet:</Text>
                                <Text style={{ ...styles.value, ...fonts.bodyMedium }}>
                                    {`${contrat.assmat.prenom} ${contrat.assmat.nom}`}
                                </Text>
                            </View>
                        </View>

                        <Divider style={styles.divider} />

                        {/* Section Parent */}
                        <View style={styles.section}>
                            <Text style={{ ...styles.sectionTitle, ...fonts.titleMedium }}>Parent Employeur</Text>
                            <View style={styles.detailRow}>
                                <Text style={{ ...styles.label, ...fonts.bodyLarge }}>Nom complet:</Text>
                                <Text style={{ ...styles.value, ...fonts.bodyMedium }}>
                                    {`${contrat.parent.prenom} ${contrat.parent.nom}`}
                                </Text>
                            </View>
                        </View>

                        <Divider style={styles.divider} />

                        {/* Section Garde */}
                        <View style={styles.section}>
                            <Text style={{ ...styles.sectionTitle, ...fonts.titleMedium }}>
                                Informations de Garde
                            </Text>
                            <View style={styles.detailRow}>
                                <Text style={{ ...styles.label, ...fonts.bodyLarge }}>Mode de garde:</Text>
                                <Text style={{ ...styles.value, ...fonts.bodyMedium }}>
                                    {contrat.modeDeGarde === "A" ? "Année complète" : "Année incomplète"}
                                </Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={{ ...styles.label, ...fonts.bodyLarge }}>Semaines travaillées:</Text>
                                <Text style={{ ...styles.value, ...fonts.bodyMedium }}>
                                    {(contrat.modeDeGarde === "A") ? 52 : contrat.nbSemainesTravaillees}
                                </Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={{ ...styles.label, ...fonts.bodyLarge }}>Heures normales hebdo:</Text>
                                <Text style={{ ...styles.value, ...fonts.bodyMedium }}>
                                    {contrat.nbHeuresNormalesHebdo} heures
                                </Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={{ ...styles.label, ...fonts.bodyLarge }}>Heures majorées hebdo:</Text>
                                <Text style={{ ...styles.value, ...fonts.bodyMedium }}>
                                    {contrat.nbHeuresMajoreesHebdo} heures
                                </Text>
                            </View>
                        </View>

                        <Divider style={styles.divider} />

                        {/* Section Conges */}
                        <View style={styles.section}>
                            <Text style={{ ...styles.sectionTitle, ...fonts.titleMedium }}>
                                Rémunération des conges payes
                            </Text>
                            <View style={styles.detailRow}>
                                <Text style={{ ...styles.label, ...fonts.bodyMedium }}>
                                    {getModePayement(contrat.remunerationCongesPayes.mode)?.titre}
                                </Text>
                            </View>

                            {
                                (contrat.remunerationCongesPayes.mode == "LORS_PRISE_CONGES_PRINCIPAUX") && <View style={styles.detailRow}>
                                <Text style={{ ...styles.label, ...fonts.bodyLarge }}>Mois prise conges:</Text>
                                <Text style={{ ...styles.value, ...fonts.bodyMedium }}>
                                    {getMonthNameByIndex(contrat.remunerationCongesPayes.mois)}
                                </Text>
                            </View>
                            }

                        </View>

                        <Divider style={styles.divider} />

                        {/* Section Salaire */}
                        <View style={styles.section}>
                            <Text style={{ ...styles.sectionTitle, ...fonts.titleMedium }}>Salaires</Text>
                            <View style={styles.detailRow}>
                                <Text style={{ ...styles.label, ...fonts.bodyLarge }}>Salaire horaire net:</Text>
                                <Text style={{ ...styles.value, ...fonts.bodyMedium }}>
                                    {`${contrat.salaireHoraireNet.toFixed(2)}€/h`}
                                </Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={{ ...styles.label, ...fonts.bodyLarge }}>Salaire complementaire net:</Text>
                                <Text style={{ ...styles.value, ...fonts.bodyMedium }}>{`${contrat.salaireHoraireComplementaireNet.toFixed(2)}€/h`}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={{ ...styles.label, ...fonts.bodyLarge }}>Salaire majoré net:</Text>
                                <Text style={{ ...styles.value, ...fonts.bodyMedium }}>{`${contrat.salaireHoraireMajoreNet.toFixed(2)}€/h`}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={{ ...styles.label, ...fonts.bodyLarge }}>Salaire mensuel net:</Text>
                                <Text style={{ ...styles.value, ...fonts.bodyMedium }}>
                                    {`${contrat.salaireMensuelNet.toFixed(2)}€/mois`}
                                </Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={{ ...styles.label, ...fonts.bodyLarge }}>Date de début:</Text>
                                <Text style={{ ...styles.value, ...fonts.bodyMedium }}>
                                    {new Date(contrat.dateDebut).toLocaleDateString()}
                                </Text>
                            </View>
                        </View>

                        <Divider style={styles.divider} />

                        {/* Section dates */}

                        <View style={styles.section}>
                            <Text style={{ ...styles.sectionTitle, ...fonts.titleMedium }}>Dates</Text>
                            <View style={styles.detailRow}>
                                <Text style={{ ...styles.label, ...fonts.bodyLarge }}>Date de début:</Text>
                                <Text style={{ ...styles.value, ...fonts.bodyMedium }}>
                                    {new Date(contrat.dateDebut).toLocaleDateString()}
                                </Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={{ ...styles.label, ...fonts.bodyLarge }}>Date de fin:</Text>
                                <Text style={{ ...styles.value, ...fonts.bodyMedium }}>
                                    {new Date(contrat.dateFin).toLocaleDateString()}
                                </Text>
                            </View>
                        </View>

                    </Card.Content>
                </Card>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    appBar: {
        elevation: 0,
        backgroundColor: 'transparent',
    },
    container: {
        flex: 1,
        backgroundColor: '#f1f1f1',
    },
    scrollView: {
        flex: 1,
    },
    card: {
        margin: 16,
        elevation: 4,
    },
    title: {
        marginBottom: 16,
        color: '#333',
    },
    section: {
        marginVertical: 8,
    },
    sectionTitle: {
        marginBottom: 8,
        color: '#444',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    label: {
        color: '#666',
        flex: 1,
    },
    value: {
        color: '#333',
        flex: 1,
        textAlign: 'right',
    },
    divider: {
        marginVertical: 16,
    },
});

export default DetailContratReadOnly;