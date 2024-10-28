import React, { useState, useCallback, useContext } from 'react';
import { View, StyleSheet, Text, Dimensions, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Button, Switch, MD3Colors, ActivityIndicator, useTheme } from 'react-native-paper';
import { TimePickerModal } from 'react-native-paper-dates';
import DateSelector from './components/DateSelector';
import { NavigationContext, RouteProp } from '@react-navigation/native';
import { Evenement } from '../../../../models/evenements';
import { FamilleEvenement } from '../../../../utils/evenements/famille-evenement';
import { TypeEvenement } from '../../../../utils/evenements/enum-type-evenement';
import { convertirEnMinutes } from '../../../../utils/date';
import { generateGeneralId } from '../../../../utils/generateId';
import { getConfiguredContrat } from '../../../../utils/contrat';
import Toast from 'react-native-toast-message';
import { creerEvenement } from '../../../../utils/evenements/evenement';
import { SelectedMonth } from '../CreerEvenementPage';

const { width } = Dimensions.get('window');

enum TypeComplementaire {
    heureComplementaire = "heureComplementaire",
    jourComplementaire = "jourComplementaire",
}

type RootStackParamList = {
    CreerHeureComplementairePage: {
        month: SelectedMonth;
        familleEvenement: number;
    };
};

const CreerHeureComplementairePage = ({ route }: { route: RouteProp<RootStackParamList, 'CreerHeureComplementairePage'> }) => {

    const navigation = useContext(NavigationContext);

    const [typeComplementaire, setTypeComplementaire] = useState<TypeComplementaire>(TypeComplementaire.heureComplementaire);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [startTime, setStartTime] = useState<string | null>(null);
    const [endTime, setEndTime] = useState<string | null>(null);
    const [visibleStartTime, setVisibleStartTime] = useState(false);
    const [visibleEndTime, setVisibleEndTime] = useState(false);
    const [repasALachargedusalarie, setRepasALachargedusalarie] = useState(false);
    const [canContinue, setCanContinue] = useState(false);
    const [isLoadingContinue, setIsLoadingContinue] = useState<boolean>(false)
    const {fonts} = useTheme()

    const { month } = route.params

    const onDismissStartTime = useCallback(() => {
        setVisibleStartTime(false);
    }, [setVisibleStartTime]);

    const onConfirmStartTime = useCallback(
        ({ hours, minutes }: { hours: number; minutes: number }) => {
            setVisibleStartTime(false);
            setStartTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
        },
        [setVisibleStartTime]
    );

    const onDismissEndTime = useCallback(() => {
        setVisibleEndTime(false);
    }, [setVisibleEndTime]);

    const onConfirmEndTime = useCallback(
        ({ hours, minutes }: { hours: number; minutes: number }) => {
            setVisibleEndTime(false);
            setEndTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
        },
        [setVisibleEndTime]
    );

    const handleSubmit = async () => {
        console.log('Type:', typeComplementaire);
        console.log('Date:', selectedDate);
        console.log('Start Time:', startTime);
        console.log('End Time:', endTime);
        if (typeComplementaire === TypeComplementaire.jourComplementaire) {
            console.log('Repas à la charge du salarié:', repasALachargedusalarie);
        }
        const contratId = await getConfiguredContrat()
        if (!!selectedDate && !!startTime && !!endTime && !!typeComplementaire && !!contratId) {
            setIsLoadingContinue(true)
            const debut = startTime.split(':')
            const heureDebut = convertirEnMinutes(parseInt(debut[0]), parseInt(debut[1]));
            const fin = endTime.split(':')
            const heureFin = convertirEnMinutes(parseInt(fin[0]), parseInt(fin[1]));

            console.log("HEBUT-FIN:", debut, fin);


            const newEvenement: Evenement = new Evenement();
            newEvenement.id = generateGeneralId()
            newEvenement.famille = FamilleEvenement.HEURE_JOUR_COMPLEMENTAIRE;
            newEvenement.dateDebut = selectedDate
            newEvenement.dateFin = selectedDate
            newEvenement.heureDebut = heureDebut
            newEvenement.heureFin = heureFin
            if (typeComplementaire === TypeComplementaire.jourComplementaire) {
                newEvenement.typeEvenement = TypeEvenement.JOURS_COMPLEMENTAIRES.texte
                newEvenement.repasALaChargeDuSalarie = repasALachargedusalarie
            } else {
                newEvenement.typeEvenement = TypeEvenement.HEURES_COMPLEMENTAIRES.texte
            }
            newEvenement.contratsId.push(contratId);
            newEvenement.dateCreation = (new Date()).toISOString()
            newEvenement.travaille = true
            newEvenement.remunere = true
            newEvenement.libelleExceptionnel = null

            console.log(newEvenement);


            creerEvenement(newEvenement).then(({ data }) => {
                console.log("idEvenement ajoutée: ", data);
                Toast.show({
                    type: "success",
                    text1: "Evenement ajoutée avec succées",
                    autoHide: true
                });
                navigation?.navigate("Home")

            }).catch(function (error) {
                const message = error?.response?.data?.message || error?.message || error.toString();
                const description = error?.response?.data?.description || "";
                Toast.show({
                    type: "error",
                    text1: message,
                    text2: (message != description) ? description : undefined
                })
                setTimeout(() => {
                    Toast.hide();
                }, 2500);

            }).finally(function () {
                setIsLoadingContinue(false)
            })
        }
    };

    React.useEffect(() => {
        const isValid = !!selectedDate && !!startTime && !!endTime;
        setCanContinue(isValid);
    }, [selectedDate, startTime, endTime]);

    return (
        <View style={styles.container}>
            <Text style={[styles.title, fonts.titleLarge]}>Créer {typeComplementaire === TypeComplementaire.heureComplementaire ? 'une heure' : 'un jour'} complémentaire</Text>

            <View style={styles.tabsContainer}>
                {Object.values(TypeComplementaire).map(type => (
                    <TouchableOpacity
                        key={type}
                        style={[styles.tab, typeComplementaire === type && styles.tabSelected]}
                        onPress={() => setTypeComplementaire(type)}
                    >
                        <Text style={[styles.tabText, typeComplementaire === type && styles.tabTextSelected, fonts.bodyMedium]}>
                            {type === TypeComplementaire.heureComplementaire ? 'Heure' : 'Jour'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView style={{ width: "100%", flex: 1 }}>
                <DateSelector
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    month={month}
                    needPeriod={false}
                    text="La date"
                />

                <Button onPress={() => setVisibleStartTime(true)} mode="outlined" style={[styles.button, fonts.bodyMedium]}>
                    {startTime ? `Heure de début: ${startTime}` : "Sélectionner l'heure de début"}
                </Button>

                <Button onPress={() => setVisibleEndTime(true)} mode="outlined" style={[styles.button, fonts.bodyMedium]}>
                    {endTime ? `Heure de fin: ${endTime}` : "Sélectionner l'heure de fin"}
                </Button>

                {typeComplementaire === TypeComplementaire.jourComplementaire && (
                    <View style={styles.switchContainer}>
                        <Text style={[{ color: "black" }, fonts.bodySmall]}>Repas à la charge du salarié</Text>
                        <Switch
                            value={repasALachargedusalarie}
                            onValueChange={setRepasALachargedusalarie}
                            color={MD3Colors.primary50}
                        />
                    </View>
                )}

                <TimePickerModal
                    visible={visibleStartTime}
                    onDismiss={onDismissStartTime}
                    onConfirm={onConfirmStartTime}
                    hours={startTime ? parseInt(startTime.split(':')[0]) : undefined}
                    minutes={startTime ? parseInt(startTime.split(':')[1]) : undefined}
                    inputFontSize={40}
                    label=''
                />

                <TimePickerModal
                    visible={visibleEndTime}
                    onDismiss={onDismissEndTime}
                    onConfirm={onConfirmEndTime}
                    hours={endTime ? parseInt(endTime.split(':')[0]) : undefined}
                    minutes={endTime ? parseInt(endTime.split(':')[1]) : undefined}
                    inputFontSize={40}
                    label=''
                />
            </ScrollView>

            <View style={styles.btnsContainer}>
                <TouchableOpacity disabled={isLoadingContinue} onPress={() => { navigation?.navigate('Home') }} style={[styles.btn, styles.annulerBtn]}>
                    <Text style={[styles.btnText, fonts.bodyMedium]}>Annuler</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    disabled={!canContinue || isLoadingContinue}
                    onPress={handleSubmit}
                    style={[
                        styles.btn,
                        styles.continueBtn,
                        { backgroundColor: (canContinue || isLoadingContinue) ? "#007AFF" : MD3Colors.neutral50, opacity: (canContinue || isLoadingContinue) ? 1 : 0.5 }
                    ]}
                >
                    {isLoadingContinue ? <ActivityIndicator color='white'></ActivityIndicator> : <Text style={[styles.btnText, fonts.bodyMedium]}>Continuer</Text>}
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
    button: {
        marginTop: 20,
    },
    tabsContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        borderRadius: 8,
        overflow: 'hidden',
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabSelected: {
        backgroundColor: '#007AFF',
    },
    tabText: {
        fontSize: 16,
        color: '#333',
    },
    tabTextSelected: {
        color: '#fff',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
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

export default CreerHeureComplementairePage;