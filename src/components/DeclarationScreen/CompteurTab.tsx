import { ScrollView, StyleSheet, Touchable, View } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useTheme, Text, Divider, Portal, Dialog } from 'react-native-paper';
import LoadingScreen from '../loading/LoadingScreens';
import { getDetailConfiguredContrat } from '../../utils/contrat';
import { Body as Contrat } from '../../pages/connected/ConfigurerContratPage/classes';
import { ComptesInfoType, getCompteurInfo } from '../../utils/declaration';
import { Mois } from '../../utils/date';
import HelpBox from '../../pages/connected/ConfigurerContratPage/components/HelpBox';
import { TouchableOpacity } from 'react-native-gesture-handler';


interface CounterItem {
    label: string;
    value: number;
    info: string;
}

interface SectionData {
    title: string;
    items: CounterItem[];
}

const CompteurTab = ({ refresh, month }: { refresh: Date; month: Mois }) => {
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [compteur, setCompteur] = useState<ComptesInfoType>();
    const [selectedContratId, setSelectedContratId] = useState<string>('');
    const [contratDetails, setContratDetails] = useState<Contrat>(new Contrat());
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedInfo, setSelectedInfo] = useState<CounterItem | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const contrat: Contrat = await getDetailConfiguredContrat();
            setContratDetails(contrat);
            const comptes = await getCompteurInfo(
                contrat.id,
                month.year,
                month.monthIndex
            );

            setCompteur(comptes);

            
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        } finally {
            setIsLoading(false);
        }
    }, [month, selectedContratId]);

    useEffect(() => {
        fetchData();
    }, [fetchData, refresh]);

    const handleInfoPress = (item: CounterItem) => {
        setSelectedInfo(item);
        setDialogVisible(true);
    };

    const CompteurSection = ({ title, items }: SectionData) => (
        <View style={styles.section}>
            <Text style={[theme.fonts.titleMedium, styles.sectionTitle]}>{title}</Text>
            {items.map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                    <Text style={styles.itemValue}>{item.value}</Text>
                    <View style={styles.itemTextContainer}>
                        <Text style={theme.fonts.bodyMedium}>{item.label}</Text>
                        <TouchableOpacity onPress={() => handleInfoPress(item)}>
                            <Text
                                style={[theme.fonts.bodySmall, styles.infoText]}
                            >
                                Plus d'infos
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>
            ))}
        </View>
    );

    if (isLoading) return <LoadingScreen />;

    const enfantName = `${contratDetails.enfant.prenom} ${contratDetails.enfant.nom}`;

    if (!compteur) return null;

    const sections: SectionData[] = [
        {
            title: "Absences de l'enfant",
            items: [
                {
                    label: "Jours d'absence maladie",
                    value: compteur.enfantAbsenceMaladie,
                    info: "Les jours d'absence pour maladie de l'enfant sont décomptés sur présentation d'un certificat médical."
                },
                {
                    label: "Jours d'absence familiale",
                    value: compteur.enfantAbsebceFamiliale,
                    info: "Les absences pour raisons familiales sont des événements exceptionnels liés à la famille de l'enfant."
                }
            ]
        },
        {
            title: "Congés de l'assistante maternelle",
            items: [
                {
                    label: "Congés payés",
                    value: compteur.assmatCongesPayes,
                    info: "Les congés payés sont calculés selon la convention collective des assistants maternels."
                },
                {
                    label: "Congés sans solde",
                    value: compteur.assmatCongesSansSolde,
                    info: "Périodes non rémunérées prises en accord avec l'employeur."
                },
                {
                    label: "Arrêt maladie",
                    value: compteur.assmatArretMaladie,
                    info: "Périodes d'arrêt de travail justifiées par un certificat médical."
                },
                {
                    label: "Congés exceptionnels",
                    value: compteur.assmatCongesExceptionnels,
                    info: "Congés accordés pour des événements familiaux particuliers."
                }
            ]
        },
        {
            title: "Compteur de jours",
            items: [
                {
                    label: "Jours de garde réels",
                    value: compteur.nbJoursGardeReel,
                    info: "Nombre effectif de jours où l'enfant a été gardé dans le mois."
                },
                {
                    label: "Jours d'activités prévus au contrat",
                    value: contratDetails.nbJoursMensu,
                    info: "Nombre de jours d'accueil prévus dans le contrat initial."
                }
            ]
        }
    ];

    return (
        <>
            <ScrollView style={styles.scrollView}>
                <HelpBox
                    style={styles.info}
                    text='Les chiffres ci-dessous découlent des événements ajoutés dans le planning partagé. Pensez à ajouter vos événements (congés, absences ou autres) pour mettre à jour les compteurs.'
                />

                <View style={styles.container}>
                    <Text style={[theme.fonts.headlineSmall, styles.title]}>
                        Garde de {enfantName}
                    </Text>

                    {sections.map((section, index) => (
                        <React.Fragment key={section.title}>
                            <CompteurSection {...section} />
                            {index < sections.length - 1 && <Divider style={styles.divider} />}
                        </React.Fragment>
                    ))}
                </View>
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
    );
};

export default CompteurTab;

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
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
    section: {
        marginBottom: 20
    },
    sectionTitle: {
        marginBottom: 10
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    itemValue: {
        fontSize: 24,
        fontWeight: 'bold',
        width: 60,
        marginRight: 10
    },
    itemTextContainer: {
        flex: 1
    },
    infoText: {
        color: 'blue',
        marginTop: 4
    },
    divider: {
        marginVertical: 20
    },
    closeButton: {
        color: 'blue',
        padding: 8,
        marginRight: 8
    }
});