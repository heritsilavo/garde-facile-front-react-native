import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { DeclarationForContrat } from '../../../models/declaration';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, useTheme, Portal, Dialog, Surface, Appbar } from 'react-native-paper';

type RootStackParamList = {
    DetailDeclaration: {
        decla: DeclarationForContrat,
        title: string
    };
};
type DetailDeclaReadOnlyProps = NativeStackScreenProps<RootStackParamList, 'DetailDeclaration'>;

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

const DetailDeclaration: React.FC<DetailDeclaReadOnlyProps> = ({ route, navigation }) => {
    const { decla, title } = route.params;
    const theme = useTheme();
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedInfo, setSelectedInfo] = useState<CounterItem | null>(null);

    const sections: SectionData[] = [
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
                ...(decla.salaires.majore.montant > 0 ? [{
                    label: "Heures majorées",
                    subtitle: `${decla.salaires.majore.nbHeures} heures`,
                    value: decla.salaires.majore.montant,
                    info: "Montant total des heures de garde effectuées au taux majoré."
                }] : []),
                ...(decla.salaires.complementaire.montant > 0 ? [{
                    label: "Heures complémentaires",
                    subtitle: `${decla.salaires.complementaire.nbHeures} heures`,
                    value: decla.salaires.complementaire.montant,
                    info: "Montant total pour les heures complémentaires effectuées."
                }] : []),
                ...(decla.salaires.specifique.montant > 0 ? [{
                    label: "Heures spécifiques",
                    subtitle: `${decla.salaires.specifique.nbHeures} heures`,
                    value: decla.salaires.specifique.montant,
                    info: "Montant total des heures spécifiques."
                }] : [])
            ]
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
                ...(decla.indemnites.kilometriques > 0 ? [{
                    label: "Indemnités kilométriques",
                    value: decla.indemnites.kilometriques,
                    info: "Indemnités versées pour les frais de déplacement."
                }] : []),
                ...(decla.indemnites.repas > 0 ? [{
                    label: "Indemnités repas",
                    value: decla.indemnites.repas,
                    info: "Indemnités pour les repas fournis à l'enfant."
                }] : [])
            ]
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
                    <Text style={[styles.itemValue, theme.fonts.bodyLarge, { color: theme.colors.primary }]}>
                        {item.value} {(item.label === "Jours d'activité") ? "j" : "€"}
                    </Text>
                </View>
            ))}
        </Surface>
    );

    return (
        <>
            <View style={{ flex: 1 }}>
                <Appbar>
                    <Appbar.BackAction onPress={()=>navigation.goBack()}></Appbar.BackAction>
                    <Appbar.Content titleStyle={{color:'black'}} title={title}>
                    </Appbar.Content>
                </Appbar>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.container}>
                        <Text style={[theme.fonts.headlineSmall, styles.title]}>
                            Garde de {decla.enfant.prenom} {decla.enfant.nom}
                        </Text>

                        {sections.map((section) => (
                            <CompteurSection key={section.title} {...section} />
                        ))}
                    </View>
                </ScrollView>
            </View>

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

export default DetailDeclaration

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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