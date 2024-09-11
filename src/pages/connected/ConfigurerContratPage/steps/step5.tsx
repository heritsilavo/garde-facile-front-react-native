import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, } from "react-native";

interface RenderStep5Props {
    setStep: (step: number) => void;
    setEnfantAChargeSalariee: ({nbEnfantsMoins15Ans,existent}:{nbEnfantsMoins15Ans:number,existent:boolean}) => void;
}

const OUI = {
    value:true,
    text:'Oui'
}

const NON = {
    value:false,
    text:'Non'
}

const I_DUNO = {
    value:false,
    text:'Je ne sais pas'
}

const RenderStep5: React.FC<RenderStep5Props> = ({ setStep, setEnfantAChargeSalariee }) => {
    const [selected,setSelected]=useState<{value:boolean,text:string}>();
    const [existe,setExiste]= useState<boolean>();
    const [nombreEnfant,setNombreEnfant]=useState<number>(0);

    const onclickContinue = ()=>{
        if (selected) {
            setStep(6);
            setEnfantAChargeSalariee({existent:existe || false,nbEnfantsMoins15Ans:nombreEnfant})
        }
    }

    const onclickOne = (selected:any)=>{
        setSelected(selected)
        setExiste(selected.value)
        console.log(selected);
    }

    return (
        <ScrollView style={styles.scollView}>
            <View style={styles.container}>
                <Text style={styles.title}>Congées supplémentaires</Text>
                <Text style={styles.subtitle}>
                    Votre assistant maternel a le droit a des congées supplementaires pour chaque enfant à sa charge
                </Text>

                <Text style={{...styles.subtitle,fontWeight:'bold'}}>
                    ... a-t-elle des enfants a sa charge ?
                </Text>

                {
                    [OUI,NON,I_DUNO].map((item,index)=>(
                        <TouchableOpacity
                            style={{...styles.ModaliteItem, backgroundColor:(item.text == selected?.text)?'#f1f1f1':'#fff'}}
                            onPress={() => {onclickOne(item)}}
                        >
                            <Text style={styles.TypeName}>{item.text}</Text>
                        </TouchableOpacity>
                    ))
                }

                {
                    existe && (
                        <View style={{...styles.inputContainer}}>
                            <Text style={{color:"#000"}}>Nombre d'enfant de moins de 15 ans:</Text>
                            <TextInput onChangeText={(text:string)=>{setNombreEnfant(parseInt(text))}} style={styles.input} keyboardType="numeric"></TextInput>
                        </View>
                    )
                }
            </View>

            <TouchableOpacity style={{...styles.button,opacity:((selected?.text==NON.text) || (selected?.text==I_DUNO.text) || (selected?.text==OUI.text && nombreEnfant))?1:0.5}} disabled={((selected?.text==NON.text) || (selected?.text==I_DUNO.text) || (selected?.text==OUI.text && nombreEnfant))?false:true} onPress={onclickContinue}>
                <Text style={styles.buttonText}>Continuer</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scollView:{
        flex:1,
        display:'flex'
    },
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
        borderRadius:5,
        marginBottom:10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
        width: "90%",
        alignSelf: "center"
    },
    TypeName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "black",
        textAlign:'center'
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

export default RenderStep5;