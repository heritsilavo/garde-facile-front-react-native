import { StyleSheet, Text, View, Dimensions, TextInput, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SelectedMonth } from '../CreerEvenementPage';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import DateSelector from './components/DateSelector';
import { MD3Colors } from 'react-native-paper';
import { Evenement } from '../../../../models/evenements';
import { isRemunere, isTravaille, TypeEvenement } from '../../../../utils/evenements/enum-type-evenement';
import { generateGeneralId } from '../../../../utils/generateId';
import { getConfiguredContrat, getDetailConfiguredContrat } from '../../../../utils/contrat';
import HelpBox from '../../ConfigurerContratPage/components/HelpBox';
import Toast from 'react-native-toast-message';
import { creerEvenement } from '../../../../utils/evenements/evenement';
import { getIndemniteByContratId } from '../../../../utils/indemnite';

const { width } = Dimensions.get('window');

type RootStackParamList = {
    CreateIndemniteePage: {
        month: SelectedMonth;
        familleEvenement: number;
    };
};

enum TypeIndemnite {
    kilometrique = "kilometrique",
    repas = "repas",
}

const CreateIndemniteePage = ({ navigation, route }: { navigation: NavigationProp<any>, route: RouteProp<RootStackParamList, 'CreateIndemniteePage'> }) => {
    const [typeIndemnite, setTypeIndemnite] = useState<TypeIndemnite>(TypeIndemnite.repas);
    const [canContinue, setCanContinue] = useState<boolean>(false);
    const [isContinueLoading, setIsContinueLoading] = useState<boolean>(false);
    
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [montant, setMontant] = useState<number>(0);
    const [nbKilometre, setNbKilometre] = useState<number>(0);

    useEffect(() => {
      var valid = !!selectedDate && !!montant
      if(typeIndemnite == TypeIndemnite.kilometrique) valid = valid && !!nbKilometre

      setCanContinue(valid)
    }, [selectedDate,montant,nbKilometre,typeIndemnite])
    
    const [loadValues,setLoadValues]=useState<boolean>(false)

    useEffect(() => {
        (async function () {
            setLoadValues(true);
            const contratId = await getConfiguredContrat()

            if (contratId) {
                const indemnite = await getIndemniteByContratId(contratId);
                if (typeIndemnite==TypeIndemnite.kilometrique) {
                    setMontant(indemnite.kilometrique)
                } else setMontant(indemnite.repas)

                setLoadValues(false)
            }
        })();
    }, [typeIndemnite])
    
    
    const { familleEvenement, month } = route.params;

    const handleReturn = () => navigation.navigate("Home");

    const handleClickContinue =async () => {
        setIsContinueLoading(true)
        if (!!montant && !!selectedDate) {
            const newEvenement:Evenement = new Evenement()

            if(typeIndemnite===TypeIndemnite.repas) newEvenement.typeEvenement = TypeEvenement.INDEMNITES_REPAS.texte;
            else newEvenement.typeEvenement = TypeEvenement.INDEMNITES_KM.texte;

            newEvenement.famille = familleEvenement
            newEvenement.libelleExceptionnel = null

            newEvenement.dateDebut = selectedDate
            newEvenement.dateFin = selectedDate
            newEvenement.debutEvenementMidi = false
            newEvenement.finEvenementMidi = false

            if (typeIndemnite==TypeIndemnite.repas) {
                newEvenement.travaille = isTravaille(TypeEvenement.INDEMNITES_REPAS)
                newEvenement.remunere = isRemunere(TypeEvenement.INDEMNITES_REPAS)
            }else{
                newEvenement.travaille = isTravaille(TypeEvenement.INDEMNITES_KM)
                newEvenement.remunere = isRemunere(TypeEvenement.INDEMNITES_KM)
            }

            newEvenement.id = generateGeneralId()

            const contrat =await getDetailConfiguredContrat()
            newEvenement.contratsId.push(contrat.id)
            newEvenement.dateCreation = new Date().toISOString()

            newEvenement.montant = montant
            if(typeIndemnite==TypeIndemnite.kilometrique) newEvenement.nbKilometres = nbKilometre

            console.log("INDEMNITE: ",newEvenement);
            
            creerEvenement(newEvenement).then(({data}) => {
                console.log("idEvenement ajoutée: ",data);
                Toast.show({
                  type:"success",
                  text1: "Evenement ajoutée avec succées",
                  autoHide:true
                });
                navigation.navigate("Home")
              }).catch(function (error) {
                const message = error?.response?.data?.message || error?.message || error.toString();
                const description = error?.response?.data?.description || "";
                Toast.show({
                  type:"error",
                  text1: message,
                  text2: (message != description) ? description : undefined
                })
                setTimeout(() => {
                  Toast.hide();
                }, 2500);
              }).finally(function () {
                setIsContinueLoading(false)
              })

        }else{
            setIsContinueLoading(false)
            Toast.show({
                autoHide:true,
                text1:"Information Invalide",
                type:"error"
            })
        }

    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ajouter des indemnités</Text>

            <SwitchTypeIndemnite typeIndemnite={typeIndemnite} setTypeIndemnite={setTypeIndemnite} />

            {
                !loadValues ? 
                <GetValue
                    typeIndemnite={typeIndemnite}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    month={month}
                    montant={montant}
                    nbKilometre={nbKilometre}
                    setMontant={setMontant}
                    setNbKilometre={setNbKilometre}
                />:
                <View style={{flex:1,justifyContent:'center'}}>
                    <Text> <ActivityIndicator></ActivityIndicator> </Text>
                </View>
            }

            <View style={styles.btnsContainer}>
                <TouchableOpacity disabled={isContinueLoading} onPress={handleReturn} style={[styles.btn, styles.annulerBtn]}>
                    <Text style={styles.btnText}>Annuler</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    disabled={!canContinue || isContinueLoading}
                    onPress={handleClickContinue}
                    style={[
                        styles.btn,
                        styles.continueBtn,
                        { backgroundColor: canContinue ? "#007AFF" : MD3Colors.neutral50, opacity: canContinue ? 1 : 0.5 }
                    ]}
                >
                    {isContinueLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.btnText}>Continuer</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const SwitchTypeIndemnite = ({ typeIndemnite, setTypeIndemnite }: { typeIndemnite: TypeIndemnite, setTypeIndemnite: (type: TypeIndemnite) => void }) => (
    <View style={styles.tabsContainer}>
        {Object.values(TypeIndemnite).map(type => (
            <TouchableOpacity
                key={type}
                style={[styles.tab, typeIndemnite === type && styles.tabSelected]}
                onPress={() => setTypeIndemnite(type)}
            >
                <Text style={[styles.tabText, typeIndemnite === type && styles.tabTextSelected]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
            </TouchableOpacity>
        ))}
    </View>
);

const GetValue = ({ 
    typeIndemnite, 
    selectedDate, 
    setSelectedDate, 
    month, 
    montant, 
    setMontant, 
    nbKilometre, 
    setNbKilometre 
}: { 
    typeIndemnite: TypeIndemnite, 
    selectedDate: string | null, 
    setSelectedDate: (date: string | null) => void, 
    month: SelectedMonth, 
    montant: number, 
    setMontant: (value: number) => void, 
    nbKilometre: number, 
    setNbKilometre: (value: number) => void 
}) => (
    <ScrollView style={getValueStyle.container}>
        <HelpBox text={(typeIndemnite == TypeIndemnite.kilometrique)?TypeEvenement.INDEMNITES_KM.description:TypeEvenement.INDEMNITES_REPAS.description}></HelpBox>

        <DateSelector
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            month={month}
            needPeriod={false}
            text="Date"
        />

        <View style={getValueStyle.inputContainer}>
            <Text style={getValueStyle.label}>Montant :</Text>
            <TextInput
                onChangeText={text => setMontant(parseInt(text) || 0)}
                placeholder="ex: 5€"
                style={getValueStyle.input}
                keyboardType="numeric"
                value={!!montant?montant.toString():""}
            />
        </View>

        {typeIndemnite === TypeIndemnite.kilometrique && (
            <View style={getValueStyle.inputContainer}>
                <Text style={getValueStyle.label}>Nombre de kilomètres :</Text>
                <TextInput
                    onChangeText={text => setNbKilometre(parseInt(text) || 0)}
                    placeholder="ex: 100"
                    style={getValueStyle.input}
                    keyboardType="numeric"
                />
            </View>
        )}
    </ScrollView>
);

export default CreateIndemniteePage;

const getValueStyle = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        padding: 15,
    },
    inputContainer: {
        marginTop: 15,
    },
    label: {
        color: "#000",
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginTop: 12,
        fontSize: 16,
        width: '100%',
        color: "black",
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f4f4f4',
    },
    title: {
        color: '#333',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    tabsContainer: {
        width: '100%',
        flexDirection: 'row',
        overflow: 'hidden',
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabSelected: {
        backgroundColor: '#707070'
    },
    tabText: {
        fontSize: 16,
        color: '#555',
        fontWeight: '500',
    },
    tabTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    btn: {
        width: (width / 2) - 30,
        borderWidth: 1,
        borderColor: '#007BFF',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        padding: 8,
        fontWeight: 'bold',
    },
    btnsContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    annulerBtn: {
        backgroundColor: MD3Colors.error50,
    },
    continueBtn: {},
});
