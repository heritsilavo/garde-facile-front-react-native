import { NavigationProp, RouteProp } from '@react-navigation/native';
import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView,Image } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo'
import { FamilleEvenement, getFamilleExentText } from '../../../utils/evenements/famille-evenement';
import HelpBox from '../ConfigurerContratPage/components/HelpBox';

export interface SelectedMonth {
  year: number;
  monthIndex: number;
}

type RootStackParamList = {
  CreerEvenementPage: {
    month: SelectedMonth;
  };
};


const CreerEvenementPage = ({ navigation,route } : {navigation: NavigationProp<any>, route: RouteProp<RootStackParamList, 'CreerEvenementPage'>}) => {

    const { month } = route.params;

    const handleQuit  =function (){
        navigation.goBack();
    }

   const  handleSelection = (value:number) =>{
        if ((value === FamilleEvenement.ABSENCE_ASSMAT) || (value === FamilleEvenement.ABSENCE_ENFANT) ) {
          //Amplitude Evenement
          navigation.navigate("CreerAmplitudeEvenementPage", {
            month,
            familleEvenement:value
          });

        }else if (value === FamilleEvenement.JOUR_FERIE) {
          //CreerJourFerieTravaillPage
          navigation.navigate("CreerJourFerieTravaillPage", {
            month,
            familleEvenement:value
          });
        }else if(value == FamilleEvenement.INDEMNITE){

        }else if (value == FamilleEvenement.HEURE_JOUR_COMPLEMENTAIRE){

        }else if (value == FamilleEvenement.PERIODE_ADAPTATION){

        }else if (value == FamilleEvenement.SEMAINE_NON_TRAVAILLEE){

        }
    }

    return (
    <View style={styles.container}>
        <View style={styles.quitButtonContainer}>
            <TouchableOpacity onPress={handleQuit} style={styles.quitButton}>
                <Icon name="squared-cross" size={24} color="#000" style={styles.quitButtonIcon} />
            </TouchableOpacity>
        </View>

        <Text style={styles.title}> Ajouter un événement éxceptionnel </Text>
        
        {
            Object.entries(FamilleEvenement).map(([key,value],index) => (
                <TouchableOpacity 
                        style={styles.ListItem} 
                        key={index} 
                        onPress={() => {handleSelection(value)}}
                    >
                        <Text style={styles.ListItemText}>{getFamilleExentText(key)}</Text>
                    </TouchableOpacity>
            ))
        }

        <HelpBox style={{width:"90%", marginTop:20}} text="selectionner le type d'événement"></HelpBox>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    alignItems:"center"
  },
  title:{
    fontSize:20,
    color:'black',
    fontWeight:'bold',
    textAlign:'center',
    marginTop:50,
    marginBottom:20
  },
  ListItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: "90%",
    alignSelf: "center"
    },
    ListItemText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: "black"
    },
  quitButtonContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  quitButton: {
    backgroundColor: '#f1f1f1',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quitButtonIcon: {
    marginRight: 5,
  },
  quitButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default CreerEvenementPage;