import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react'
import { Text, useTheme, Portal, Dialog, Surface, Button } from 'react-native-paper'
import { Mois } from '../../utils/date';
import LoadingScreen from '../loading/LoadingScreens';
import Toast from 'react-native-toast-message';
import { getDeclaByContratAndPeriod, getDetailSalaireForMonth } from '../../utils/declaration';
import { Body as Contrat } from '../../pages/connected/ConfigurerContratPage/classes';
import { getDetailConfiguredContrat } from '../../utils/contrat';
import { DeclarationForContrat } from '../../models/declaration';
import HelpBox from '../../pages/connected/ConfigurerContratPage/components/HelpBox';
import { NavigationContext, useFocusEffect } from '@react-navigation/native';

interface CounterItem {
    label: string;
    value: number;
    info: string;
    subtitle?: string;
}

interface SectionData {
    title: string;
    items: CounterItem[];
}

const DeclarationTab = ({ refresh, month }: { refresh: Date; month: Mois }) => {
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [decla, setDecla] = useState<DeclarationForContrat>();
    const [sections, setSections] = useState<SectionData[]>([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedInfo, setSelectedInfo] = useState<CounterItem | null>(null);
    const [isValide, setIsValide] = useState(false);
    const navigation = useContext(NavigationContext);

    const fetchData = async () => {
        try {
            setIsLoading(true)
            var contrat: Contrat = await getDetailConfiguredContrat();
            var declaFromDatabase = await getDeclaByContratAndPeriod(contrat.id, month.year, month.monthIndex);
            var decla: DeclarationForContrat;
            if (!declaFromDatabase) {
                decla = await getDetailSalaireForMonth(contrat.id, month.year, month.monthIndex);
                setIsValide(false);
                setDecla(decla);
                console.log("DECLA_NON_VALIDE");
            } else {
                setIsValide(true)
                setDecla(declaFromDatabase);
                decla = declaFromDatabase;
                console.log("DECLA_VALIDE");
            }

            const sec = [
                {
                    title: "Salaire",
                    items: [
                        {
                            label: "Salaire net",
                            subtitle: "(Hors indemnités)",
                            value: decla.salaires.net,
                            info: "Montant net du salaire de l'assistante maternelle hors indemnités."
                        },
                        {
                            label: "Heures de garde normales",
                            subtitle: `${decla.salaires.normal.nbHeures} heures`,
                            value: decla.salaires.normal.montant,
                            info: "Montant total pour les heures de garde effectuées au taux horaire normal."
                        },
                        decla.salaires.majore.montant > 0 && {
                            label: "Heures majorées",
                            subtitle: `${decla.salaires.majore.nbHeures} heures`,
                            value: decla.salaires.majore.montant,
                            info: "Montant total des heures de garde effectuées au taux majoré."
                        },
                        decla.salaires.complementaire.montant > 0 && {
                            label: "Heures complémentaires",
                            subtitle: `${decla.salaires.complementaire.nbHeures} heures`,
                            value: decla.salaires.complementaire.montant,
                            info: "Montant total pour les heures complémentaires effectuées."
                        },
                        decla.salaires.specifique.montant > 0 && {
                            label: "Heures spécifiques",
                            subtitle: `${decla.salaires.specifique.nbHeures} heures`,
                            value: decla.salaires.specifique.montant,
                            info: "Montant total des heures spécifiques."
                        }
                    ].filter(Boolean) as CounterItem[]
                },
                {
                    title: "Indemnités",
                    items: [
                        {
                            label: "Total indemnités",
                            value: decla.indemnites.total,
                            info: "Somme totale des indemnités versées pour l'entretien, les repas et autres."
                        },
                        {
                            label: "Indemnités d'entretien",
                            value: decla.indemnites.entretien,
                            info: "Indemnités pour les frais d'entretien quotidien de l'enfant."
                        },
                        decla.indemnites.kilometriques > 0 && {
                            label: "Indemnités kilométriques",
                            value: decla.indemnites.kilometriques,
                            info: "Indemnités versées pour les frais de déplacement."
                        },
                        decla.indemnites.repas > 0 && {
                            label: "Indemnités repas",
                            value: decla.indemnites.repas,
                            info: "Indemnités pour les repas fournis à l'enfant."
                        }
                    ].filter(Boolean) as CounterItem[]
                },
                {
                    title: "Total rémunération",
                    items: [
                        {
                            label: "Salaire net",
                            subtitle: "(indemnités incluses)",
                            value: decla.salaires.aVerser,
                            info: "Salaire net total de l'assistante maternelle, incluant toutes les indemnités."
                        },
                        {
                            label: "Jours d'activité",
                            value: decla.jours.activite,
                            info: "Nombre de jours réels d'activité pour l'assistante maternelle durant le mois."
                        }
                    ]
                }
            ];

            setSections(sec);
            setIsLoading(false)
        } catch (e: any) {
            Toast.show({
                type: 'error',
                autoHide: true,
                visibilityTime: 1000,
                text1: e.message || "Error while fetching salaires data"
            })
        }
    }
    useEffect(() => {
        fetchData();
    }, [refresh, month])

    useFocusEffect(useCallback(
        () => {
            fetchData();
        },
        [refresh, month],
    )
    )

    const handleInfoPress = (item: CounterItem) => {
        setSelectedInfo(item);
        setDialogVisible(true);
    };

    const CompteurSection = ({ title, items }: SectionData) => (
        <Surface style={styles.card} elevation={1}>
            <Text style={[theme.fonts.titleMedium, styles.sectionTitle]}>{title}</Text>
            {items.map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                    <View style={styles.itemTextContainer}>
                        <Text style={theme.fonts.bodyMedium}>{item.label}</Text>
                        {item.subtitle && (
                            <Text style={[theme.fonts.bodySmall, styles.subtitle]}>
                                {item.subtitle}
                            </Text>
                        )}
                        <TouchableOpacity onPress={() => handleInfoPress(item)}>
                            <Text style={[styles.infoLink, theme.fonts.bodySmall]}>
                                Plus d'infos
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.itemValue, theme.fonts.bodyLarge, { color: theme.colors.primary }]}>{item.value} {(item.label == "Jours d'activité") ? "j" : "€"} </Text>
                </View>
            ))}
        </Surface>
    );

    if (isLoading) {
        return <LoadingScreen />
    }

    if (!decla) return null;

    return (
        <>
            <ScrollView style={styles.scrollView}>
                {!isValide && <HelpBox
                    style={styles.info}
                    text='Les chiffres ci-dessous découlent des événements ajoutés dans le planning partagé. Pensez à ajouter vos événements (congés, absences ou autres) pour mettre à jour les compteurs.'
                />}

                <View style={styles.container}>
                    <Text style={[theme.fonts.headlineSmall, styles.title]}>
                        Garde de {decla.enfant.prenom} {decla.enfant.nom}
                    </Text>

                    {sections.map((section, index) => (
                        <CompteurSection key={section.title} {...section} />
                    ))}
                </View>

                {isValide ? (
                    <View style={[styles.alreadyValidatedContainer, { marginHorizontal: 20, marginBottom: 15, borderRadius: 5, padding: 10, borderColor: theme.colors.primary, borderWidth: 1 }]}>
                        <Text style={[theme.fonts.bodyMedium, { color: theme.colors.primary }]}>
                            Cette déclaration a déjà été validée.
                        </Text>
                    </View>
                ) : (
                    <Button
                        onPress={() => navigation?.navigate("ValidDeclarationPage", { declaForContrat: decla, mois:month })}
                        mode='contained'
                        style={{ marginHorizontal: 20, marginBottom: 15, borderRadius: 5 }}
                    >
                        Validation de la déclaration
                    </Button>
                )}

            </ScrollView>

            <Portal>
                <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                    <Dialog.Title>{selectedInfo?.label}</Dialog.Title>
                    <Dialog.Content>
                        <Text style={theme.fonts.bodySmall}>{selectedInfo?.info}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Text
                            onPress={() => setDialogVisible(false)}
                            style={[styles.closeButton, theme.fonts.bodySmall]}
                        >
                            Fermer
                        </Text>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    )
}

export default DeclarationTab

const styles = StyleSheet.create({
    alreadyValidatedContainer: {
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        padding: 10, 
        borderRadius: 5, 
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    info: {
        marginTop: 20,
        marginHorizontal: 20
    },
    container: {
        padding: 20
    },
    title: {
        marginBottom: 20
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        marginBottom: 16,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    itemTextContainer: {
        flex: 1,
    },
    subtitle: {
        color: '#666666',
        marginTop: 2,
    },
    itemValue: {
        fontSize: 16,
        color: '#2196F3',
        fontWeight: '600',
        marginLeft: 16,
    },
    infoLink: {
        color: '#2196F3',
        fontSize: 12,
        marginTop: 4,
    },
    closeButton: {
        color: '#2196F3',
        padding: 8,
        marginRight: 8,
    }
})