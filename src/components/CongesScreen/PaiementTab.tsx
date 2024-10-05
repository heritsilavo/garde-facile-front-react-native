import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, MD3Theme, Dialog, Portal } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {  getModePayement, ModePayement } from '../../utils/conges';
import { styles } from '../../pages/connected/Home/HomeScreens/CongesScreen/styles';
import { Body as ContratEntity } from '../../pages/connected/ConfigurerContratPage/classes';
import { getDetailConfiguredContrat } from '../../utils/contrat';
import LoadingScreen from '../loading/LoadingScreens';
import { getModeGardeByType, TypeModeGarde } from '../../utils/mode-de-garde';
import { getPeriodeReference, PeriodeReference } from '../../utils/date';
import { InfoButton } from './InfoButton';

export const PaiementTab: React.FC<{ theme: MD3Theme,refreshValue:number }> = ({ theme, refreshValue }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [modeGarde, setModeGarde] = useState<TypeModeGarde>()
    const [methode, setMethode] = useState<ModePayement>()
    const [periodeReference,setPeriodeReference] = useState<PeriodeReference>();

    const [modalContent, setModalContent] = useState("");
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const hideModal = () => { setModalVisible(false); setModalContent("") };
    const showModal = (content: string) => { setModalVisible(true); setModalContent(content) };

    const getDetailContrat = async () => {
        setIsLoading(true)
        
        const contrat: ContratEntity = await getDetailConfiguredContrat()

        setModeGarde(getModeGardeByType(contrat.modeDeGarde))
        setMethode(getModePayement(contrat.remunerationCongesPayes.mode));
        setPeriodeReference(getPeriodeReference(contrat.dateDebut));

        setIsLoading(false)
    }

    useEffect(() => {
        console.log("bbb");
        
        getDetailContrat()
    }, [refreshValue])

    if (isLoading) {
        return <LoadingScreen />
    }

    return (
        <ScrollView>
            <Card style={styles.card}>
                <Card.Content>
                    <Title style={[styles.title, theme.fonts.titleMedium]}>Congés payés:  {periodeReference?.dateDebut.getFullYear()}-{periodeReference?.dateFin.getFullYear()}</Title>

                    <View style={styles.dateContainer}>
                        <Icon name="calendar" size={18} color={theme.colors.primary} />
                        <Paragraph style={[styles.paragraph, theme.fonts.titleSmall]}>{methode?.titre}</Paragraph>
                    </View>
                    <Paragraph style={[styles.paragraph, theme.fonts.bodyMedium]}>{methode?.description}</Paragraph>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
                        <Title style={[styles.methodTitle, theme.fonts.titleSmall]}>Méthode du maintien de salaire</Title>
                        <InfoButton onPress={() => { showModal("La méthode du maintien de salaire consiste à verser le même salaire pendant les congés que celui qui aurait été perçu en travaillant.") }} theme={theme} />
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                        <Title style={[styles.methodTitle, theme.fonts.titleSmall]}>Méthode des 10% (du dixième)</Title>
                        <InfoButton onPress={() => { showModal("La méthode des 10% consiste à verser une indemnité égale à 10% de la rémunération totale brute perçue par le salarié au cours de la période de référence.") }} theme={theme} />
                    </View>

                    <Paragraph style={[styles.paragraph, theme.fonts.titleSmall, { marginTop: 16 }]}>{modeGarde?.titre}</Paragraph>
                    <Paragraph style={[styles.paragraph, theme.fonts.bodyMedium, { marginBottom: 24 }]}>{modeGarde?.desc}</Paragraph>

                </Card.Content>

                <Portal>
                    <Dialog visible={modalVisible} onDismiss={hideModal}>
                        <Dialog.Title>Information sur la méthode</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph style={theme.fonts.bodyMedium}>{modalContent}</Paragraph>
                            <Paragraph style={[{ marginTop: 16 }, theme.fonts.bodySmall]}>
                                La méthode la plus avantageuse pour le salarié sera automatiquement retenue.
                            </Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={hideModal}>Fermer</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </Card>
        </ScrollView>
    );
}