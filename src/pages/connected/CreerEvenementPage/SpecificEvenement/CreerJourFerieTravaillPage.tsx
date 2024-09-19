import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { SelectedMonth } from '../CreerEvenementPage';
import { EventType, getListeTypesEvenementsByFamille, getTypeAndLibele, getTypeEventByText, isRemunere, isTravaille, TypeEvenement } from '../../../../utils/evenements/enum-type-evenement';
import LoadingScreen from '../../../../components/loading/LoadingScreens';
import RNPickerSelect from 'react-native-picker-select';
import HelpBox from '../../ConfigurerContratPage/components/HelpBox';
import DateSelector from './components/DateSelector';
import { Amplitude, Evenement } from '../../../../models/evenements';
import { ScrollView } from 'react-native-gesture-handler';
import { MD3Colors } from 'react-native-paper';
import { calculerDifferenceAvecPlanning } from '../../../../utils/date';
import { getDetailConfiguredContrat } from '../../../../utils/contrat';
import { generateGeneralId } from '../../../../utils/generateId';
import Toast from 'react-native-toast-message';
import { creerEvenement } from '../../../../utils/evenements/evenement';
import { AxiosError } from 'axios';
import { getJourFerieByType, getListeJourFerieByMonth, JourFerie, ListeJourFerie } from '../../../../utils/ListeJoursFerie';

type RootStackParamList = {
  CreerJourFerieTravaillPage: {
    month: SelectedMonth;
    familleEvenement: number;
  };
};

const CreerJourFerieTravaillPage = ({ navigation, route, }: { navigation: NavigationProp<any>, route: RouteProp<RootStackParamList, 'CreerJourFerieTravaillPage'> }) => {
  const { month, familleEvenement } = route.params;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isContinueLoading, setIsContinueLoading] = useState<boolean>(false);
  const [listeTypesEvenemnts, setListeTypeEvenements] = useState<EventType[]>([]);
  const [selectedType, setSelectedType] = useState<EventType>();
  const [selectedJourFerie, setSelectedJourFerie] = useState<JourFerie>();

  const [canContinue,setCanContinue] =useState<boolean>(false)
  const [event,setEvent]= useState<Evenement>(new Evenement())


  useEffect(() => {
   (async function () {
      var valid = !!selectedJourFerie;
      setCanContinue(valid);
      
      if(selectedType && !!selectedJourFerie){
        
        
        var newEvenement:Evenement = new Evenement()
        newEvenement.typeEvenement = selectedType.texte;
        newEvenement.libelleExceptionnel = null
        newEvenement.dateDebut = selectedJourFerie.getDate(month.year)
        newEvenement.dateFin = selectedJourFerie.getDate(month.year)
        newEvenement.travaille = isTravaille(selectedType)
        newEvenement.remunere = isRemunere(selectedType)
        newEvenement.famille = selectedType.famille
        newEvenement.id = generateGeneralId()
        var amplitude:Amplitude = new Amplitude({
          debutAmplitude: selectedJourFerie.getDate(month.year),
          finAmplitude: selectedJourFerie.getDate(month.year),
          reel:1.0,
          decompte:1.0
        })
        newEvenement.amplitude = amplitude
        newEvenement.debutEvenementMidi = false
        newEvenement.finEvenementMidi = false
        
        const contrat = await getDetailConfiguredContrat()
        
        newEvenement.contratsId.push(contrat.id);
        newEvenement.dateCreation = new Date().toISOString()

        newEvenement.nomJourFerie = selectedJourFerie.type
        setEvent(newEvenement);
      }  
   })();
  }, [selectedType,selectedJourFerie])
  

  useEffect(() => {
    const types = getListeTypesEvenementsByFamille(familleEvenement);
    setListeTypeEvenements(types);
    if (types.length === 1) {
      setSelectedType(types[0]);
    }

    setIsLoading(false);
  }, [familleEvenement]); 

  if (isLoading) {
    return <LoadingScreen />;
  }

  const pickerItems = getListeJourFerieByMonth(month).map((holyday: JourFerie) => ({
    label: holyday.text + "  " + holyday.getDate(month.year),
    value: holyday.type,
  }));

  const handleSelectJourFerie = function (text: string) {
    const jourFerie = getJourFerieByType(text)

    if (jourFerie) {
      setSelectedJourFerie(jourFerie)
    }
  }

  const handleReturn = function () {
    navigation.navigate("Home")
  }

  const handleClickContinue = function () {
    setIsContinueLoading(true)
    creerEvenement(event).then(({data}) => {
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
  }

  return (
    <View style={styles.container}>
      <ScrollView style={{flex:1,width:'100%'}}>
        <Text style={styles.title}>Jour ferié travaillée</Text>
        {selectedType && <HelpBox style={{ marginTop: 20 }} text={selectedType?.description}></HelpBox>}
        <Text style={{...styles.text,marginBottom:10,fontSize:14}}>Selectionner un Jour feriées:</Text>
        <RNPickerSelect
          onValueChange={handleSelectJourFerie}
          items={pickerItems}
          placeholder={{ label: 'Choisissez un jour ferie...', value: null }}
          style={pickerSelectStyles}
        />



      </ScrollView>
      
      <View style={styles.btnsContainer}>
          <TouchableOpacity disabled={isContinueLoading} onPress={handleReturn} style={{...styles.btn,...styles.annulerBtn}}>
            <Text style={{...styles.btnText}}>Annuler</Text>
          </TouchableOpacity>

          <TouchableOpacity disabled={!canContinue || isContinueLoading} onPress={handleClickContinue} style={{...styles.btn, ...styles.continueBtn,backgroundColor:canContinue?"#007AFF":MD3Colors.neutral50,  opacity:canContinue?1:0.5}}>
            { isContinueLoading ?  <ActivityIndicator style={{...styles.btnText}} color="#FFFFFF" /> : <Text style={{...styles.btnText}}>Continuer</Text> }
          </TouchableOpacity>
      </View>


    </View>
  );
};

const styles = StyleSheet.create({
    title:{
        color:'black',
        fontSize:24,
        fontWeight:"bold"
    },
  continueBtn:{
   
  },
  annulerBtn:{
    backgroundColor:MD3Colors.error50,
  },
  btn:{
    borderWidth:0.5,
    borderColor:'blue',
    borderRadius:10,
    width:'40%',
    alignItems:'center',
    justifyContent:'center'
  },
  btnText:{
    padding:8,
    fontWeight:'bold'
  },
  btnsContainer:{
    marginTop:10,
    width:"100%",
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  text:{
    color:'black',
    width:'100%',
    marginTop:15
  },
  description:{
    color:'black',
    width:'100%',
    marginTop:15,
    fontSize:14,

  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: 'black'
  },
  selectedText: {
    marginTop: 20,
    fontSize: 16,
    color: 'blue',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    color: '#333333',
    paddingRight: 30, // To account for the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    color: '#333333',
  },
});

export default CreerJourFerieTravaillPage;