import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Text, useTheme, Divider, Appbar } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ContratHistorique } from '../../../models/contrat-historique';
import LoadingScreen from '../../../components/loading/LoadingScreens';
import { getConfiguredContrat, getContratHistorique } from '../../../utils/contrat';
import Toast from 'react-native-toast-message';
import { motifHistorisationEnumFromKey } from '../../../utils/MotifHistorisationEnum';

type RootStackParamList = {
    HistoriqueContratList: undefined;
    DetailContratReadOnly: {
        contrat: ContratHistorique;
        isHistorique?: boolean;
    };
};

type HistoriqueContratListProps = NativeStackScreenProps<RootStackParamList, 'HistoriqueContratList'>;

const HistoriqueContratList: React.FC<HistoriqueContratListProps> = ({ navigation }) => {
    const { fonts } = useTheme();
    const [historiques, setHistoriques] = React.useState<ContratHistorique[]>([]);
    const [isLoading, setIsLoading] = useState(true)

    React.useEffect(() => {
        // Remplacer par votre appel API
        const fetchHistoriques = async () => {
            setIsLoading(true)
            try {
                const contratId = await getConfiguredContrat()
                if (!!contratId) {
                    const historiques = await getContratHistorique(contratId);
                    setHistoriques(historiques);
                } else throw new Error("Contrat non confugureé")
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: "Erreur",
                    visibilityTime: 1000,
                    autoHide: true
                })
            }
            setIsLoading(false)
        };

        fetchHistoriques();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const navigateToDetail = (historique: ContratHistorique) => {
        navigation.navigate('DetailContratReadOnly', {
            contrat: historique,
            isHistorique: true
        });
    };

    if (isLoading) {
        return <LoadingScreen></LoadingScreen>
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.appBar}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Historique des contrats" />
            </Appbar.Header>
            <ScrollView style={styles.scrollView}>
                {historiques.map((historique, index) => (
                    <TouchableOpacity
                        key={`${historique.id}-${historique.version}`}
                        onPress={() => navigateToDetail(historique)}
                        style={styles.touchable}
                        activeOpacity={0.7}
                    >
                        <Card style={styles.card}>
                            <Card.Content>
                                <View style={styles.headerRow}>
                                    <Text style={{ ...styles.version, ...fonts.titleMedium }}>
                                        Version {historique.version}
                                    </Text>
                                    <Text style={{ ...fonts.bodyMedium }}>
                                        {formatDate(historique.dateHistorisation)}
                                    </Text>
                                </View>

                                <Divider style={styles.divider} />

                                <View style={styles.detailRow}>
                                    <Text style={{ ...styles.label, ...fonts.bodyLarge }}>Motif:</Text>
                                    <Text style={{ ...styles.value, ...fonts.bodyMedium }}>
                                        {motifHistorisationEnumFromKey(historique.motifHistorisation)?.toString()}
                                    </Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={{ ...styles.label, ...fonts.bodyLarge }}>Modifié par:</Text>
                                    <Text style={{ ...styles.value, ...fonts.bodyMedium }}>
                                        {historique.utilisateurHistorisation}
                                    </Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={{ ...styles.label, ...fonts.bodyLarge }}>Enfant:</Text>
                                    <Text style={{ ...styles.value, ...fonts.bodyMedium }}>
                                        {`${historique.enfant.prenom} ${historique.enfant.nom}`}
                                    </Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={{ ...styles.label, ...fonts.bodyLarge }}>Salaire mensuel:</Text>
                                    <Text style={{ ...styles.value, ...fonts.bodyMedium }}>
                                        {`${historique.salaireMensuelNet.toFixed(2)}€`}
                                    </Text>
                                </View>
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1f1',
    },
    appBar: {
        elevation: 0,
        backgroundColor: 'transparent',
    },
    scrollView: {
        flex: 1,
    },
    touchable: {
        borderRadius: 10,
        marginVertical: 8,
    },
    card: {
        margin: 16,
        marginTop: 8,
        paddingVertical: 5, 
        paddingHorizontal: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    version: {
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
        marginVertical: 8,
    },
});

export default HistoriqueContratList;