import React, { createContext, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Switch, Modal } from "react-native";
import { Planning } from "../classes";
import JoursPlanningItem, { JoursPlanningItemPropsType } from "../components/JoursPlanningItem";
import DaySelector, { LUNDI_ID } from "../components/DaySelector";
import { Button, IconButton, useTheme } from "react-native-paper";
import { calculateNbHoursAndDays } from "../fonctions";
import { ConfigContratContext } from "../ConfigurerContratPage";

const DIMANCHE_INDEX = 6;
interface RenderStep6Props {
  setStep: (step: number) => void;
  setPlanning: (plannings: Planning[], nbHeuresNormalesHebdo: number, nbHeuresNormalesMensu: number, nbJoursMensu: number, indexJourRepos: number, nbHeuresMajoreesHebdo: number, nbHeuresMajoreesMensu: number, nbHeuresSpecifiquesHebdo: number) => void;
}

export const jours: JoursPlanningItemPropsType[] = [
  { index: 0, text: 'Lundi', planning: new Planning() },
  { index: 1, text: 'Mardi', planning: new Planning() },
  { index: 2, text: 'Mercredi', planning: new Planning() },
  { index: 3, text: 'Jeudi', planning: new Planning() },
  { index: 4, text: 'Vendredi', planning: new Planning() }
];

export const weekends: JoursPlanningItemPropsType[] = [
  { index: 5, text: 'Samedi', planning: new Planning() },
  { index: 6, text: 'Dimanche', planning: new Planning() }
];

const RenderStep6: React.FC<RenderStep6Props> = ({ setStep, setPlanning }) => {
  const conf = useContext(ConfigContratContext)

  const { fonts } = useTheme()

  const [weekPlanning, setWeekPlanning] = useState<Planning[]>([]);
  const [gardeWeekend, setGardeWeekend] = useState(false);
  const [canContinue, setCanContinue] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [indexJourRepos, setIndexJourRepos] = useState<number>(DIMANCHE_INDEX);

  const [nbHeuresNormalesHebdo, setNbHeuresNormalesHebdo] = useState<number>(0);
  const [nbHeuresNormalesMensu, setNbHeuresNormalesMensu] = useState<number>(0);
  const [nbJoursMensu, setNbJoursMensu] = useState<number>(0);
  const [nbHeuresMajoreesHebdo, setNbHeuresMajoreesHebdo] = useState<number>(0);
  const [nbHeuresSpecifiquesHebdo, setNbHeuresSpecifiquesHebdo] = useState<number>(0);
  const [nbHeuresMajoreesMensu, setNbHeuresMajoreesMensu] = useState<number>(0);


  //Garde weekend
  useEffect(function () {
    if (!gardeWeekend && weekPlanning.length > 5) {
      weekPlanning.splice(5, 2);
    }
  }, [gardeWeekend]);

  //can continue
  useEffect(() => {
    if ((weekPlanning.length == 5 && !gardeWeekend) || (weekPlanning.length == 7 && gardeWeekend)) {
      setCanContinue(true);
    } else {
      setCanContinue(false);
    }
  }, [weekPlanning, gardeWeekend]);


  const onclickContinue = () => {
    setPlanning(weekPlanning, nbHeuresNormalesHebdo, nbHeuresNormalesMensu, nbJoursMensu, indexJourRepos, nbHeuresMajoreesHebdo, nbHeuresMajoreesMensu, nbHeuresSpecifiquesHebdo);
    setStep(7)
  };

  //Update needed values
  useEffect(function () {
    const [_nbHeuresNormalesHebdo, _nbHeuresNormalesMensu, _nbJoursMensu, _nbHeuresMajoreesHebdo, _nbHeuresSpecifiquesHebdo, _nbHeuresMajoreesMensu] = calculateNbHoursAndDays(weekPlanning, conf?.configContrat.body.nbSemainesTravaillees, indexJourRepos);

    setNbHeuresNormalesHebdo(_nbHeuresNormalesHebdo);
    setNbHeuresNormalesMensu(_nbHeuresNormalesMensu);
    setNbJoursMensu(_nbJoursMensu);
    setNbHeuresMajoreesHebdo(_nbHeuresMajoreesHebdo)
    setNbHeuresSpecifiquesHebdo(_nbHeuresSpecifiquesHebdo)
    setNbHeuresMajoreesMensu(_nbHeuresMajoreesMensu);

  }, [weekPlanning, conf, indexJourRepos])

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, fonts.titleLarge]}>Planning</Text>
        <Text style={[styles.subtitle, fonts.bodyMedium]}>
          Indiquer les Jours Et Horraire de garde prevus dans votre contrat. L'application Gere seulement les planning regulier.
        </Text>

        <View style={styles.switchContainer}>
          <Text style={[styles.label, fonts.bodyMedium]}>L'enfant est gardée le weekend</Text>
          <Switch
            value={gardeWeekend}
            onValueChange={() => setGardeWeekend(!gardeWeekend)}
          />
        </View>

        {jours.map((jour, index) => (
          <JoursPlanningItem weekPlanning={weekPlanning} setWeekPlanning={setWeekPlanning} key={index} jour={jour} />
        ))}

        {gardeWeekend && weekends.map((jour, index) => (
          <JoursPlanningItem weekPlanning={weekPlanning} setWeekPlanning={setWeekPlanning} key={index} jour={jour} />
        ))}

        <Text style={[styles.subtitle, fonts.bodyMedium]}>
          Sélectionner la journée non travaillée:
        </Text>

        <DaySelector selected={(!!indexJourRepos ? indexJourRepos : LUNDI_ID)} setSelected={setIndexJourRepos} />
      </ScrollView>

      <TouchableOpacity disabled={!canContinue} style={{ ...styles.button, backgroundColor: (canContinue ? '#0058c4' : '#b8cce6') }} onPress={onclickContinue}>
        <Text style={[styles.buttonText, fonts.bodyMedium]}>Continuer</Text>
      </TouchableOpacity>

      <IconButton
        style={styles.helpButton}
        icon="calculator-variant"
        iconColor="white"
        size={24}
        onPress={() => setShowHelpModal(true)}
      />

      <Modal visible={showHelpModal} animationType="fade" transparent>
        <View style={styles.helpModalContainer}>
          <View style={styles.helpModalContent}>
            <Text style={styles.helpModalTitle}>Calculs</Text>
            <Text style={styles.helpModalText}>
              Soit <Text style={{ fontWeight: 'bold' }}>{nbHeuresNormalesHebdo}</Text> heures par semmaine, <Text style={{ fontWeight: 'bold' }}>{nbHeuresNormalesMensu}</Text> heures par mois et <Text style={{ fontWeight: 'bold' }}>{nbJoursMensu}</Text> jours par mois.
              (<Text style={{ lineHeight: 30, fontWeight: 'bold' }}>{"nombre heures majorees Hebdo=" + nbHeuresMajoreesHebdo}</Text>, )
              (<Text style={{ lineHeight: 30, fontWeight: 'bold' }}>{"nombre heures majorees Mensu=" + nbHeuresMajoreesMensu}</Text>, )
              (<Text style={{ lineHeight: 30, fontWeight: 'bold' }}>{"nombre heures specifiques Hebdo=" + nbHeuresSpecifiquesHebdo}</Text> )
            </Text>
            <TouchableOpacity style={styles.helpModalCloseButton} onPress={() => setShowHelpModal(false)}>
              <Text style={styles.helpModalCloseButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80, // Space for the button
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
  },
  switchContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  button: {
    position: 'absolute', // Fixed position
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    color: 'black',
  },
  helpButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
  helpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  helpModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpModalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  helpModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black'
  },
  helpModalText: {
    fontSize: 16,
    marginBottom: 20,
    color: 'black'
  },
  helpModalCloseButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  helpModalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default RenderStep6;