import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { Button, MD3Colors, ActivityIndicator } from 'react-native-paper';
import DateSelector from './components/DateSelector';
import { NavigationContext, RouteProp } from '@react-navigation/native';
import { Evenement } from '../../../../models/evenements';
import { FamilleEvenement } from '../../../../utils/evenements/famille-evenement';
import { TypeEvenement } from '../../../../utils/evenements/enum-type-evenement';
import { generateGeneralId } from '../../../../utils/generateId';
import { getConfiguredContrat, getDetailConfiguredContrat } from '../../../../utils/contrat';
import Toast from 'react-native-toast-message';
import { creerEvenement } from '../../../../utils/evenements/evenement';
import { ConfigContratData } from '../../ConfigurerContratPage/classes';
import { calculerDifferenceAvecPlanning, getDecompteBetweenTwoDays } from '../../../../utils/date';
import HelpBox from '../../ConfigurerContratPage/components/HelpBox';

const { width } = Dimensions.get('window');

interface SelectedMonth {
    monthIndex: number;
    year: number;
}

type RootStackParamList = {
    CreerJourFerieTravaillPage: {
        month: SelectedMonth;
    };
};

const CreerPeriodeAdaptationPage = ({ route }: { route: RouteProp<RootStackParamList, 'CreerJourFerieTravaillPage'> }) => {
    const navigation = useContext(NavigationContext);
    const { month } = route.params

    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [canContinue, setCanContinue] = useState(false);
    const [isLoadingContinue, setIsLoadingContinue] = useState<boolean>(false);

    const handleSubmit = async () => {
        const contratId = await getConfiguredContrat();
        if (startDate && endDate && contratId) {
            setIsLoadingContinue(true);

            const newEvenement: Evenement = new Evenement();
            newEvenement.id = generateGeneralId();
            newEvenement.famille = FamilleEvenement.PERIODE_ADAPTATION;
            newEvenement.dateDebut = startDate;
            newEvenement.dateFin = endDate;
            newEvenement.typeEvenement = TypeEvenement.PERIODE_ADAPTATION.texte;
            newEvenement.contratsId.push(contratId);
            newEvenement.dateCreation = (new Date()).toISOString();
            newEvenement.travaille = true;
            newEvenement.remunere = true;
            newEvenement.libelleExceptionnel = null;
            const contrat = await getDetailConfiguredContrat()
            var res = getDecompteBetweenTwoDays(startDate, endDate, contrat);
            console.log(res);
            newEvenement.nbJours = res.nbDay
            newEvenement.nbHeures = res.nbHour

            creerEvenement(newEvenement).then(({ data }) => {
                console.log("Période d'adaptation ajoutée: ", data);
                Toast.show({
                    type: "success",
                    text1: "Période d'adaptation ajoutée avec succès",
                    autoHide: true
                });
                navigation?.navigate("Home");
            }).catch(function (error) {
                const message = error?.response?.data?.message || error?.message || error.toString();
                const description = error?.response?.data?.description || "";
                Toast.show({
                    type: "error",
                    text1: message,
                    text2: (message != description) ? description : undefined
                });
                setTimeout(() => {
                    Toast.hide();
                }, 2500);
            }).finally(function () {
                setIsLoadingContinue(false);
            });
        }
    };

    useEffect(() => {
        const isValid = !!startDate && !!endDate;
        setCanContinue(isValid);
    }, [startDate, endDate]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Créer une période d'adaptation</Text>
            

            <ScrollView style={{ width: "100%", flex: 1 }}>
                <HelpBox text={TypeEvenement.PERIODE_ADAPTATION.description}></HelpBox>

                <DateSelector
                    selectedDate={startDate}
                    setSelectedDate={setStartDate}
                    month={month}
                    needPeriod={false}
                    text="Date de début"
                />

                <DateSelector
                    selectedDate={endDate}
                    setSelectedDate={setEndDate}
                    month={month}
                    needPeriod={false}
                    text="Date de fin"
                />
            </ScrollView>

            <View style={styles.btnsContainer}>
                <TouchableOpacity
                    disabled={isLoadingContinue}
                    onPress={() => { navigation?.navigate('Home') }}
                    style={[styles.btn, styles.annulerBtn]}
                >
                    <Text style={styles.btnText}>Annuler</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    disabled={!canContinue || isLoadingContinue}
                    onPress={handleSubmit}
                    style={[
                        styles.btn,
                        styles.continueBtn,
                        {
                            backgroundColor: (canContinue && !isLoadingContinue) ? "#007AFF" : MD3Colors.neutral50,
                            opacity: (canContinue && !isLoadingContinue) ? 1 : 0.5
                        }
                    ]}
                >
                    {isLoadingContinue ? <ActivityIndicator color='white' /> : <Text style={styles.btnText}>Continuer</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f4f4f4',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    btnsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 30,
    },
    btn: {
        width: (width / 2) - 30,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    annulerBtn: {
        backgroundColor: MD3Colors.error50,
    },
    continueBtn: {
        backgroundColor: "#007AFF",
    },
});

export default CreerPeriodeAdaptationPage;