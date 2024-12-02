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
import { MD3Colors, useTheme } from 'react-native-paper';
import { calculerDifferenceAvecPlanning } from '../../../../utils/date';
import { getDetailConfiguredContrat } from '../../../../utils/contrat';
import { generateGeneralId } from '../../../../utils/generateId';
import Toast from 'react-native-toast-message';
import { creerEvenement } from '../../../../utils/evenements/evenement';
import { AxiosError } from 'axios';

type RootStackParamList = {
  CreerAmplitudeEvenementPage: {
    month: SelectedMonth;
    familleEvenement: number;
  };
};

const CreerAmplitudeEvenementPage = ({ navigation, route, }: { navigation: NavigationProp<any>, route: RouteProp<RootStackParamList, 'CreerAmplitudeEvenementPage'> }) => {
  const { month, familleEvenement } = route.params;
  const {fonts} = useTheme()
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isContinueLoading, setIsContinueLoading] = useState<boolean>(false);
  const [listeTypesEvenemnts, setListeTypeEvenements] = useState<EventType[]>([]);
  const [selectedType, setSelectedType] = useState<EventType>();

  const [selectedDateDebut, setSelectedDateDebut] = useState<string | null>(null);
  const [selectedPeriodDebut, setSelectedPeriodDebut] = useState<'Matin' | 'Après-midi' | null>(null);

  const [selectedDateFin, setSelectedDateFin] = useState<string | null>(null);
  const [selectedPeriodFin, setSelectedPeriodFin] = useState<'Matin' | 'Après-midi' | null>(null);

  const [canContinue,setCanContinue] =useState<boolean>(false)
  const [event,setEvent]= useState<Evenement>(new Evenement())


  useEffect(() => {
   (async function () {
      var valid = !!selectedDateDebut && !!selectedDateFin && !!selectedPeriodDebut && !!selectedPeriodFin && !!selectedType;
      setCanContinue(valid);
      console.log(selectedDateDebut);
      
      if(!!selectedDateDebut && !!selectedDateFin && !!selectedPeriodDebut && !!selectedPeriodFin && selectedType){
        setIsContinueLoading(true)
        var amplitude:Amplitude = new  Amplitude()
        amplitude.debutAmplitude = selectedDateDebut
        amplitude.finAmplitude = selectedDateFin

        var newEvenement:Evenement = new Evenement()
        newEvenement.amplitude = amplitude
        newEvenement.dateDebut = selectedDateDebut
        newEvenement.dateFin = selectedDateFin
        newEvenement.debutEvenementMidi = (selectedPeriodDebut == "Après-midi")
        newEvenement.finEvenementMidi = (selectedPeriodFin == "Matin")
        newEvenement.travaille = isTravaille(selectedType)
        newEvenement.remunere = isRemunere(selectedType)
        newEvenement.debutMidi = (selectedPeriodDebut == "Après-midi")
        newEvenement.finMidi = (selectedPeriodFin == "Matin")
        
        const contrat = await getDetailConfiguredContrat()
        const [nbJours,nbHeures] = calculerDifferenceAvecPlanning(newEvenement.debutEvenementMidi, newEvenement.finEvenementMidi, selectedDateDebut,selectedDateFin,contrat.planning);
        const {typeRetournée,libelléExceptionnel} = getTypeAndLibele(selectedType)

        newEvenement.nbJours = nbJours
        newEvenement.nbHeures = nbHeures
        newEvenement.typeEvenement = selectedType.texte
        newEvenement.libelleExceptionnel = libelléExceptionnel
        newEvenement.contratsId.push(contrat.id);
        newEvenement.dateCreation = new Date().toISOString()
        newEvenement.id = generateGeneralId()
        newEvenement.amplitude.reel = nbJours
        newEvenement.amplitude.decompte = nbJours
        newEvenement.famille=familleEvenement

        setEvent(newEvenement);
        setIsContinueLoading(false)
      }  
   })();
  }, [selectedDateDebut,selectedDateFin,selectedPeriodDebut,selectedPeriodFin, selectedType])
  

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

  const pickerItems = listeTypesEvenemnts.map((eventType: EventType) => ({
    label: eventType.titre,
    value: eventType.texte,
  }));

  const handleSelectTypeEvenement = function (text: string) {
    const type = getTypeEventByText(text)

    if (type) {
      setSelectedType(type);
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
      }, 2000);
    }).finally(function () {
      setIsContinueLoading(false)
    })
  }

  return (
    <View style={styles.container}>
      <ScrollView style={{flex:1, width:"100%"}}>
        <Text style={[styles.label, fonts.titleLarge]}>Sélectionnez un type d'événement:</Text>
        <RNPickerSelect
          onValueChange={handleSelectTypeEvenement}
          items={pickerItems}
          placeholder={{ label: (listeTypesEvenemnts.length == 1) ?listeTypesEvenemnts[0].titre :'Choisissez un type...', value: (listeTypesEvenemnts.length == 1) ?listeTypesEvenemnts[0].titre : null }}
          style={pickerSelectStyles}
        />

        {selectedType && <HelpBox style={{ marginTop: 20 }} text={selectedType?.description}></HelpBox>}

        {selectedType && <Text style={[styles.text, fonts.bodyMedium]}> Debut de lévénement:  </Text>}

        {selectedType && <DateSelector
          selectedDate={selectedDateDebut}
          setSelectedDate={setSelectedDateDebut}
          selectedPeriod={selectedPeriodDebut}
          setSelectedPeriod={setSelectedPeriodDebut}
          month={month}
          needPeriod={true}
          text='Date de début'
          >
        </DateSelector>}

        {selectedType && <Text style={[styles.text, fonts.bodyMedium]}> Fin de lévénement:  </Text>}

        {selectedType && <DateSelector
          selectedDate={selectedDateFin}
          setSelectedDate={setSelectedDateFin}
          selectedPeriod={selectedPeriodFin}
          setSelectedPeriod={setSelectedPeriodFin}
          month={month}
          needPeriod={true}
          text='Date de fin'
          >
        </DateSelector>}
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
    fontWeight:'bold',
    color:"#fff"
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
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: 'black',
    textAlign: "center"
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

export default CreerAmplitudeEvenementPage;