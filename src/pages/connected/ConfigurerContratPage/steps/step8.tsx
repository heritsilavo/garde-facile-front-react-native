import React, { useState, useContext, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { ConfigContratContext } from '../ConfigurerContratPage';
import HelpBox from '../components/HelpBox';

interface RenderStep8Props {
  setStep: (step: number) => void;
  setSalaires: (
    salaireHoraireNet: number,
    salaireHoraireBrut: number,
    salaireHoraireComplementaireNet: number,
    salaireHoraireComplementaireBrut: number,
    salaireHoraireMajoreNet: number,
    salaireHoraireMajoreBrut: number,
    salaireMajore: number,
    salaireMensuelNet: number
  ) => void;
}

const deuxChiffreApresVirgule = function (nbr:number) {
    return Math.round(nbr * 100)/100
}

const RenderStep8: React.FC<RenderStep8Props> = ({ setStep, setSalaires }) => {
  const configContratContext = useContext(ConfigContratContext);
  const configContrat = configContratContext?.configContrat;

  const [salaireNetHeureNormale, setSalaireNetHeureNormale] = useState('');
  const [salaireNetHeureComplementaire, setSalaireNetHeureComplementaire] = useState('');
  const [salaireNetHeureMajoree, setSalaireNetHeureMajoree] = useState('');

  const [canContinue,setCanContinue]=useState<boolean>(false)

  const calculateSalaires = () => {
    const salaireHoraireNet = parseFloat(salaireNetHeureNormale);
    const salaireHoraireComplementaireNet = parseFloat(salaireNetHeureComplementaire);
    const salaireHoraireMajoreNet = parseFloat(salaireNetHeureMajoree);

    // Assuming a 22% tax rate for the conversion from net to gross
    const taxRate = 0.22;
    const salaireHoraireBrut = deuxChiffreApresVirgule(salaireHoraireNet / (1 - taxRate));
    const salaireHoraireComplementaireBrut = deuxChiffreApresVirgule(salaireHoraireComplementaireNet / (1 - taxRate));
    const salaireHoraireMajoreBrut = deuxChiffreApresVirgule(salaireHoraireMajoreNet / (1 - taxRate));

    // Using ConfigContrat values for calculation if available
    const heuresNormalesMensu = configContrat?.body.nbHeuresNormalesMensu || 151.67; // Default to 151.67 if not available
    const salaireMensuelNet = salaireHoraireNet * heuresNormalesMensu;

    const salaireMajore = salaireHoraireMajoreNet - salaireHoraireNet;

    setSalaires(
      salaireHoraireNet,
      salaireHoraireBrut,
      salaireHoraireComplementaireNet,
      salaireHoraireComplementaireBrut,
      salaireHoraireMajoreNet,
      salaireHoraireMajoreBrut,
      salaireMajore,
      salaireMensuelNet
    );
  };
  
  useEffect(function() {
    setCanContinue(!!salaireNetHeureComplementaire && !!salaireNetHeureMajoree && !!salaireNetHeureNormale)
  },[salaireNetHeureNormale,salaireNetHeureComplementaire,salaireNetHeureMajoree])

  const onclickContinue = () => {
    calculateSalaires();
    setStep(9);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Salaires</Text>
        <Text style={styles.subtitle}>Saisissez vos salaires horaires  <Text style={{fontWeight:'bold'}}>en salaire net</Text>.</Text>

        <Text style={styles.title2}>Heures normales</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Entrez le salaire net heure normale</Text>
          <TextInput
            style={styles.input}
            value={salaireNetHeureNormale}
            onChangeText={setSalaireNetHeureNormale}
            keyboardType="numeric"
            placeholder="ex: 4€"
            placeholderTextColor="#999"
          />
        </View>
        <HelpBox text='Heures ajoutées au contrat et en decà de 46 heures par semmaine.'></HelpBox>

        <Text style={styles.title2}>Heures complémentaires</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Entrez le salaire net heure complémentaire</Text>
          <TextInput
            style={styles.input}
            value={salaireNetHeureComplementaire}
            onChangeText={setSalaireNetHeureComplementaire}
            keyboardType="numeric"
            placeholder="Ex: 4€"
            placeholderTextColor="#999"
          />
        </View>
        <HelpBox text='Heures ajoutées au planning et en decà de 46 heures par semmaine.'></HelpBox>
        
        <Text style={styles.title2}>Heures majorées</Text>
        <View style={styles.inputContainer}>
        <Text style={styles.label}>Entrez le salaire net heure majorée</Text>
          <TextInput
            style={styles.input}
            value={salaireNetHeureMajoree}
            onChangeText={setSalaireNetHeureMajoree}
            keyboardType="numeric"
            placeholder="Ex: 4€"
            placeholderTextColor="#999"
          />
        </View>
        <HelpBox text='Heures travaillées au-delà de 46 heures par semmaine, prévue ou non au contrat.'></HelpBox>
        
      </ScrollView>
      

      <TouchableOpacity disabled={!canContinue} style={{ ...styles.button, backgroundColor: (canContinue ? '#0058c4' : '#b8cce6') }} onPress={onclickContinue}>
        <Text style={styles.buttonText}>Continuer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
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
    fontSize: 20,
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
    marginBottom: 5,
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
});

export default RenderStep8;