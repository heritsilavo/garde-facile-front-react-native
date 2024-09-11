import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, SectionListComponent } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { ConfigContratContext } from "../ConfigurerContratPage";
import moment from 'moment';
import MonthSelectorCalendar from 'react-native-month-selector';

interface RenderStep4Props {
    setStep: (step: number) => void;
    setModePayementConge: ({mode,mois}:{mode:string,mois:number}) => void;
}

interface ModePayement{
    type:string,
    titre:string,
    description:string
}

const months = [
    { label: 'Janvier', value: 1 },
    { label: 'Février', value: 2 },
    { label: 'Mars', value: 3 },
    { label: 'Avril', value: 4 },
    { label: 'Mai', value: 5 },
    { label: 'Juin', value: 6 },
    { label: 'Juillet', value: 7 },
    { label: 'Août', value: 8 },
    { label: 'Septembre', value: 9 },
    { label: 'Octobre', value: 10 },
    { label: 'Novembre', value: 11 },
    { label: 'Décembre', value: 12 },
  ];

const EN_JUIN={
    type:'EN_JUIN',
    titre:'Paiemennt une seule fois en juin',
    description:"L'integralité de l'indemmnitée de congés payes sera versée en juin"
}

const LORS_DE_LA_PRISE_DES_CONGES={
    type:'LORS_DE_LA_PRISE_DES_CONGES',
    titre:'Paiement lors de la prise des conges principaux',
    description:"L'integralité de l'indemnité de congées payés sera versées le mois de la prise des congés principaux"
}

const AU_FUR_ET_A_MESURE={
    type:'AU_FUR_ET_A_MESURE',
    titre:'Paiement au fur et a mesure de la prise des congés',
    description:"L'indemnité est versée proportionnelement au nombre de jours posées par mois"
}


const RenderStep4: React.FC<RenderStep4Props> = ({ setStep, setModePayementConge }) => {
    const [modePayement,setModePayement]=useState<ModePayement>()
    const [selectedMonth, setSelectedMonth] = useState(moment());
    const [moisPriseConge,setMoisPriseConge]=useState<number>()
    const conf = useContext(ConfigContratContext)


    const handleMonthChange = (month:any) => {
        setSelectedMonth(month);
        setMoisPriseConge(month.month()+1)
        console.log("Mois sélectionné (numéro) :", month.month() + 1);
    };


    const onclickOne = function(modalite: ModePayement) {
        setModePayement(modalite)
    }

    const onclickContinue = function(){
        if (modePayement?.type==EN_JUIN.type) {
            setModePayementConge({mode:modePayement.type,mois:moisPriseConge || -1})
            setStep(5);
        }else if (modePayement?.type==AU_FUR_ET_A_MESURE.type) {
            setModePayementConge({mode:modePayement.type,mois: moisPriseConge || -1})
            setStep(5);
        }else if ((modePayement?.type==LORS_DE_LA_PRISE_DES_CONGES.type) || moisPriseConge) {
            setModePayementConge({mode:LORS_DE_LA_PRISE_DES_CONGES.type,mois:moisPriseConge || -1})
            setStep(5);
        }else{
            throw new Error('Erreur lors du choix des modalitées de paiements')
        }
    }
    

    return (
        <ScrollView style={{flex:1}}>
            <View style={styles.container}>
                <Text style={styles.title}>Modalités de paiement des congés payés</Text>
                <Text style={styles.subtitle}>
                    Selectionner votre modalité de paiement des indemnitées des congées payés 
                </Text>
                {[EN_JUIN,LORS_DE_LA_PRISE_DES_CONGES,AU_FUR_ET_A_MESURE].map((modalite:ModePayement, index:number) => (index!=1)?(
                    <TouchableOpacity 
                        style={{...styles.ModaliteItem,borderWidth:(modalite.type == modePayement?.type)?1:0.5,backgroundColor:(modalite.type == modePayement?.type)?'#f1f1f1':'#fff'}} 
                        key={index} 
                        onPress={() => {onclickOne(modalite)}}
                    >
                        <Text style={styles.TypeName}>{modalite.titre}</Text>
                        <Text style={styles.TypeDob}>{modalite.description}</Text>
                    </TouchableOpacity>
                ):( //Sin Paiement lors de la prise des congée 
                    <View  key={index} >
                        <TouchableOpacity 
                            style={{...styles.ModaliteItem,borderWidth:(modalite.type == modePayement?.type)?1:0.5,backgroundColor:(modalite.type == modePayement?.type)?'#f1f1f1':'#fff'}} 
                            onPress={() => {onclickOne(modalite)}}
                        >
                            <Text style={styles.TypeName}>{modalite.titre}</Text>
                            <Text style={styles.TypeDob}>{modalite.description}</Text>
                        </TouchableOpacity>

                        <View style={{...styles.inputContainer,display:(modePayement?.type==LORS_DE_LA_PRISE_DES_CONGES.type)?'flex':'none'}}>
                            <Text style={{color:"#000"}}>Selectionner le mois de la prise des congées:</Text>
                            <MonthSelectorCalendar
                                selectedDate={selectedMonth}
                                onMonthTapped={handleMonthChange}
                                maxDate={moment().endOf('year')}
                            />
                        </View>

                    </View>

                ))}

               
            </View>
            <TouchableOpacity onPress={onclickContinue} disabled={((modePayement?.type==EN_JUIN.type) || (modePayement?.type==AU_FUR_ET_A_MESURE.type) || (modePayement?.type==LORS_DE_LA_PRISE_DES_CONGES.type && moisPriseConge))?false:true} style={{...styles.button,opacity:((modePayement?.type==EN_JUIN.type) || (modePayement?.type==AU_FUR_ET_A_MESURE.type) || (modePayement?.type==LORS_DE_LA_PRISE_DES_CONGES.type && moisPriseConge))?1:0.5}}>
                <Text style={styles.buttonText}>Continuer</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: "black",
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 16,
        color: "black",
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 16,
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 8,
      },
      buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
      },
      helpText: {
        marginTop: 16,
        fontSize: 14,
        color: '#666',
        textAlign: "center",
        paddingHorizontal: 20,
    },
    ModaliteItem: {
        padding: 16,
        borderWidth: 0.5,
        borderRadius:5,
        marginBottom:10,
        borderColor: '#ccc',
        width: "90%",
        alignSelf: "center"
    },
    TypeName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "black"
    },
    TypeDob: {
        fontSize: 14,
        color: '#666',
    },
    inputContainer:{
        width:'90%'
    },
    input:{
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 12,
        fontSize: 16,
        width: '100%',
        color: "black",
      }
});

export default RenderStep4;