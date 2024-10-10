import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { MD3Theme, Card, Paragraph, Title, List, Dialog, Portal, Button } from "react-native-paper";
import HelpBox from "../../pages/connected/ConfigurerContratPage/components/HelpBox";
import { styles } from "../../pages/connected/Home/HomeScreens/CongesScreen/styles";
import { CongeData, getDetailAcquisitionContrat, initialCongeData } from "../../utils/conges";
import { CongeItem } from "./CongeItem";
import React, { useContext, useEffect, useState } from "react";
import { InfoButton } from "./InfoButton";
import { getConfiguredContrat, getDetailConfiguredContrat } from "../../utils/contrat";
import Toast from "react-native-toast-message";
import { NavigationContext } from "@react-navigation/native";
import { connectedUserContext, UserContextType } from "../../../App";
import { getPeriodeReference, PeriodeReference } from "../../utils/date";
import { Body as ContratType } from "../../pages/connected/ConfigurerContratPage/classes";
import LoadingScreen from "../loading/LoadingScreens";
import { CongesAccordionList } from "./CongesAccordionList";

export const AcquisitionTab: React.FC<{ theme: MD3Theme, refreshValue:number }> = ({ theme, refreshValue }) => {

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [congesData, setCongesData] = useState<CongeData>(initialCongeData);
    const { connectedUser } = useContext<UserContextType>(connectedUserContext)
    const navigation = useContext(NavigationContext);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [periodeRef, setPeriodeRef] = useState<PeriodeReference>()

    const showToastError = function (error: any) {
        const message = error?.response?.data?.message || error?.message || error.toString();
        const description = error?.response?.data?.description || "";
        Toast.show({
            type: "error",
            text1: message,
            text2: (message != description) ? description : undefined
        })
        setTimeout(() => {
            Toast.hide();
        }, 2000);
    }

    const loadData = async function () {
        setIsLoading(true);
        
        try {
            const contratId = await getConfiguredContrat();
            
            if (!contratId) {
                throw new Error('Aucun contrat');
            }
    
            const contrat = await getDetailConfiguredContrat();
            const annee = getPeriodeReference((new Date()).toISOString().split('T')[0]).anneRef;
            const data = await getDetailAcquisitionContrat(contrat.id, annee);
    
            if (data) {
                setCongesData(data);
            }


            setPeriodeRef(getPeriodeReference((new Date()).toISOString().split('T')[0]))
        } catch (error) {
            showToastError(error);
            navigation?.reset({
                index: 0,
                routes: [{ name: (connectedUser.profile === 'PAJE_EMPLOYEUR') ? 'ConfigurerContrat' : 'NoContractScreen' }]
            });
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(function () {
        loadData();
    }, [refreshValue])

    const handleInfoPress = () => setModalVisible(true);

    <InfoButton onPress={handleInfoPress} theme={theme} />

    if (isLoading) {
        return <LoadingScreen />
    }

    return (
        <ScrollView>
            <Card style={styles.card}>
                <Card.Content>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Title style={[styles.sectionTitle, theme.fonts.titleLarge, { marginTop: 5 }]}>Congés payées acquis</Title>
                        <InfoButton onPress={handleInfoPress} theme={theme}></InfoButton>
                    </View>
                    {/* <HelpBox style={{ marginTop: 10 }} text='Le salarié a droit a 2.5 jours de congées par mois. Donc 30 jours (5 semaines) par an'></HelpBox> */}
                    <Paragraph style={[styles.paragraph, theme.fonts.bodyMedium]}>Les données indiqués ci-dessous seront modifiée aprés {periodeRef?.dateFin.toLocaleDateString()}.</Paragraph>
                    <CongeItem
                        value={congesData.disponible}
                        description="Congés payés disponibles"
                        date={'Compteur chargé le '+congesData.dateCreationCompteur}
                        theme={theme}
                    />
                    <CongeItem
                        value={congesData.encoursAcquisition}
                        description="Congés en cours d'acquisition"
                        date={'Compteur chargé le '+congesData.dateCreationCompteur}
                        theme={theme}
                    />

                    <Title style={[styles.sectionTitle, theme.fonts.titleLarge]}>Congés déjà posés</Title>
                    <Paragraph style={[styles.paragraph, theme.fonts.bodyMedium]}>Les congés indiqués ci-dessous ont été pris du {(new Date(congesData.dateCreationCompteur).toLocaleDateString())} à aujourd'hui.</Paragraph>
                    
                    <CongesAccordionList congesData={congesData} theme={theme} />
                    
                    <Text style={[styles.congeDate, theme.fonts.bodySmall]}>Depuis le {(new Date(congesData.dateCreationCompteur).toLocaleDateString())}</Text>
                </Card.Content>
            </Card>

            <Portal>
                <Dialog style={{width:'95%', marginHorizontal:10}} visible={modalVisible} onDismiss={() => setModalVisible(false)}>
                    <Dialog.Title>Comprendre vos congés payés</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph style={[theme.fonts.bodyMedium, { marginBottom: 10 }]}>
                            <Text style={theme.fonts.titleSmall}>Congés payés disponibles :</Text>
                            {'\n'}Ce sont les congés que vous pouvez utiliser immédiatement. Ils correspondent aux congés acquis pendant la période de référence précédente (du 1er juin au 31 mai).
                        </Paragraph>

                        <Paragraph style={[theme.fonts.bodyMedium, { marginBottom: 10 }]}>
                            <Text style={theme.fonts.titleSmall}>Congés en cours d'acquisition :</Text>
                            {'\n'}Ce sont les congés que vous êtes en train d'acquérir pendant la période de référence en cours. Ils seront disponibles à partir du 1er juin de l'année suivante.
                        </Paragraph>

                        <Paragraph style={[theme.fonts.bodyMedium, { marginBottom: 10 }]}>
                            <Text style={theme.fonts.titleSmall}>Comment sont-ils calculés ?</Text>
                            {'\n'}Vous acquérez 2,5 jours de congés payés par mois de travail effectif, soit 30 jours ouvrables (5 semaines) pour une année complète.
                        </Paragraph>

                        <Paragraph style={[theme.fonts.bodySmall]}>
                            La période de référence s'étend du 1er juin au 31 mai de l'année suivante.
                        </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setModalVisible(false)}>Fermer</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </ScrollView>
    );
}