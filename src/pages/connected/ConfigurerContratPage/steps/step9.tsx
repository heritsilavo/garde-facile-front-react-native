import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, TouchableWithoutFeedback } from 'react-native';
import { IndemniteType } from '../classes';
import { Switch } from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';
import HelpBox from '../components/HelpBox';

interface RenderStep9Props {
  setStep: (step: number) => void;
  setIndemnites: (indemnite: IndemniteType) => void;
}

const RenderStep9: React.FC<RenderStep9Props> = ({ setStep, setIndemnites }) => {

    const [indemniteEntretienText,setIndemniteEntretienText] = useState<string>("");

    const [indemniteKilometriqueText,setIndemniteKilometriqueText] = useState<string>("");
    const [isIndemniteKilometriqueText,setIsIndemniteKilometriqueText] = useState<boolean>(false);
    
    const [indemniteRepasText,setIndemniteRepasText] = useState<string>("");
    const [isIndemniteRepasText,setIsIndemniteRepasText] = useState<boolean>(false);

    const [optionRepasQuotidien,setOptionRepasQuotidien]=useState<boolean>(false);

    //Can continue
    const [canContinue,setCanContinue]=useState<boolean>(false)
    useEffect(function() {
        if(!indemniteEntretienText) {
            setCanContinue(false)
        }
        else{
            const valideRepas =(!isIndemniteRepasText) || (isIndemniteRepasText && (!!indemniteRepasText))
            console.log(valideRepas);
            
            const valideKilometrique = (!isIndemniteKilometriqueText) || isIndemniteKilometriqueText && (!!indemniteKilometriqueText)
            setCanContinue(valideRepas && valideKilometrique)
        }
    },[indemniteEntretienText,indemniteKilometriqueText,isIndemniteKilometriqueText,indemniteRepasText,isIndemniteRepasText,optionRepasQuotidien])

    const onClickContinue = function () {
        const tmp:IndemniteType = new IndemniteType({
            entretien:parseInt(indemniteEntretienText),
            kilometrique:parseInt(indemniteKilometriqueText),
            repas:parseInt(indemniteRepasText),
            isKilometrique:isIndemniteKilometriqueText,
            isRepas:isIndemniteRepasText,
            optionRepasQuotidien:optionRepasQuotidien
        })

        setIndemnites(tmp);
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Indemnités</Text>
                <Text style={styles.subtitle}>
                    Rappel: Les indemnitées ne font pas partie du salaire et ne sont dues que pour les jours de presence de l'enfant
                </Text>
                <Text style={styles.title2}>Indemnités d'entretien</Text>
                <TextInput
                    style={styles.input}
                    value={indemniteEntretienText}
                    onChangeText={setIndemniteEntretienText}
                    keyboardType="numeric"
                    placeholder="indemnitée d'entretien en € par jour"
                    placeholderTextColor="#999"
                />

                <View style={styles.switchContainer}>
                    <Switch value={isIndemniteRepasText} onValueChange={()=>{ setIsIndemniteRepasText(()=>!isIndemniteRepasText) }}></Switch>
                    <Text style={styles.switchLabel}>Indemnitées repas</Text> 
                    <Text style={styles.switchLabel2}> (Optionelle)</Text>
                </View>

                {
                    isIndemniteRepasText && 
                    <View style={styles.indemnitesRepas}>
                        <TextInput
                            style={styles.input}
                            value={indemniteRepasText}
                            onChangeText={setIndemniteRepasText}
                            keyboardType="numeric"
                            placeholder="indemnitée repas en € par jour"
                            placeholderTextColor="#999"
                        />

                        <View style={styles.repasQuotidien}>
                            <CheckBox tintColors={{false:'gray'}} value={optionRepasQuotidien} onValueChange={()=>{ setOptionRepasQuotidien(()=>!optionRepasQuotidien) }}></CheckBox> 
                            <Text style={styles.repasQuotidienText}> Ajouter a tous les jours du planning </Text>
                        </View>
                        <HelpBox style={{marginTop:10}} text='Les indemnitée repas ne seront pas comptabilisées automatiquement. Vous pourrez les ajouter manuellement au planning'></HelpBox>
                    </View>
                }

                <View style={styles.switchContainer}>
                    <Switch value={isIndemniteKilometriqueText} onValueChange={()=>{ setIsIndemniteKilometriqueText(()=>!isIndemniteKilometriqueText) }}></Switch>
                    <Text style={styles.switchLabel}>Indemnitées kilometrique</Text>
                    <Text style={styles.switchLabel2}> (Optionelle)</Text>
                </View>

                {
                    isIndemniteKilometriqueText && 
                    <View style={styles.indemnitesKilometrique}>
                        <TextInput
                            style={styles.input}
                            value={indemniteKilometriqueText}
                            onChangeText={setIndemniteKilometriqueText}
                            keyboardType="numeric"
                            placeholder="indemnitée kilometrique en € par jour"
                            placeholderTextColor="#999"
                        />
                    </View>
                }
            </ScrollView>

            <TouchableOpacity disabled={!canContinue} style={{ ...styles.button, backgroundColor: (canContinue ? '#0058c4' : '#b8cce6') }} onPress={onClickContinue}>
                <Text style={styles.buttonText}>Continuer</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
  repasQuotidien:{
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-start'
  },
  repasQuotidienText: {
    marginLeft: 8,
    color:'black'
  },
  indemnitesRepas:{
    
  },
  indemnitesKilometrique:{

  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  title2: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop:22,
    color: "black",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    color: "black",
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: 'black',
  },
  switchLabel:{
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold'
  },
  switchLabel2:{
    fontSize: 14,
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: 'black',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop:16
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    marginTop:40,
  }
});

export default RenderStep9;