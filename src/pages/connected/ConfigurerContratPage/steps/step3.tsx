import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { ConfigContratContext } from "../ConfigurerContratPage";
import { type_A, type_B } from "../../../../utils/mode-de-garde";
import { useTheme } from "react-native-paper";

interface RenderStep3Props {
    setStep: (step: number) => void;
    setSemmaindeDeGarde: (type: "A"|"B",nbrSem:number) => void;
}

const RenderStep3: React.FC<RenderStep3Props> = ({ setStep, setSemmaindeDeGarde }) => {
    const [selectedType,setType] = useState<string>();
    const [nbrSemmaine,setNbrSemmaine]=useState<number>(0);
    const {fonts} = useTheme()
    
    const conf = useContext(ConfigContratContext)

    const dateString = (new Date()).toISOString().split('T')[0]

    const onclickOne = function(type: any) {
        setType(type.type);
    }

    const onclickContinue = function(){
        if (selectedType==type_A.type) setSemmaindeDeGarde("A",52);
        else if(selectedType==type_B.type) setSemmaindeDeGarde("B",nbrSemmaine);
        else return;

        setStep(4)
    }
    

    return (
        <View style={{flex:1}}>
            <ScrollView contentContainerStyle={{alignItems:"center"}} style={styles.container}>
                <Text style={[styles.title, fonts.titleLarge]}>Acceuil annuel</Text>
                <Text style={[fonts.bodyMedium]}>
                    Il existe deux types de contrat selon le nombre de semmaine d'acceuil dans une années
                </Text>
                {[type_A,type_B].map((type, index) => (
                    <TouchableOpacity 
                        style={{...styles.TypeItem,borderWidth:(type.type == selectedType)?1:0.5,backgroundColor:(type.type == selectedType)?'#f1f1f1':'#fff'}} 
                        key={index} 
                        onPress={() => {onclickOne(type)}}
                    >
                        <Text style={styles.TypeName}>{type.titre}</Text>
                        <Text style={styles.TypeDob}>{type.desc}</Text>
                    </TouchableOpacity>
                ))}

                <View style={{...styles.inputContainer,display:(selectedType==type_B.type)?'flex':'none'}}>
                    <Text style={[{color:"#000"}, fonts.bodyMedium]}>Nombre de semmaine de garde:</Text>
                    <TextInput onChangeText={(text:string)=>{setNbrSemmaine(parseInt(text))}} style={styles.input} keyboardType="numeric"></TextInput>
                </View>
            </ScrollView>
            <TouchableOpacity onPress={onclickContinue} disabled={((selectedType=='A') || (selectedType=='B' && !!nbrSemmaine))?false:true} style={{...styles.button,opacity:((selectedType=='A') || (selectedType=='B' && nbrSemmaine))?1:0.5}}>
                <Text style={[styles.buttonText, fonts.bodyMedium]}>Continuer</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    TypeItem: {
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

export default RenderStep3;