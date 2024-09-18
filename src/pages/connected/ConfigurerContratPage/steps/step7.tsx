import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from "react-native";
import HelpBox from "../components/HelpBox";
import { ListeJourFerie } from "../../../../utils/ListeJoursFerie";

const ListeCodesPostaux = [
  "75001",
  "75002",
  "75003",
  "75004",
  "75005",
  "75006",
  "75007",
  "75008",
  "75009",
  "75010",
  "75011",
  "75012",
  "75013",
  "75014",
  "75015",
  "75016",
  "75116",
  "75017",
  "75018",
  "75019",
  "75020",
  "75000"
];

interface RenderStep7Props {
  setStep: (step: number) => void;
  setCodePostateAndJourFerie: (codePostale: string, jourFerie: string[]) => void;
}

const RenderStep7: React.FC<RenderStep7Props> = ({ setStep, setCodePostateAndJourFerie }) => {
  const [codePostale, setCodePostale] = useState<string>("");
  const [codePostaleValide, setCodePostaleValide] = useState<boolean>(false);
  const [selectedHolidays, setSelectedHolidays] = useState<string[]>([]);

  const onChangeCodePostale = (code: string) => {
    const valide = validerCodePostale(code);
    setCodePostaleValide(valide);
    setCodePostale(code);
  };

  const validerCodePostale = (code: string): boolean => {
    return ListeCodesPostaux.includes(code);
  };

  const toggleHolidaySelection = (holiday: string) => {
    setSelectedHolidays((prevSelected) => {
      if (prevSelected.includes(holiday)) {
        return prevSelected.filter((item) => item !== holiday);
      } else {
        return [...prevSelected, holiday];
      }
    });
  };

  const onclickContinue = () => {
    setCodePostateAndJourFerie(codePostale, selectedHolidays);
    setStep(8)
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Jours Fériées</Text>
        <Text style={styles.subtitle}>
          Ajouter les jours feriées où l'enfant sera gardé
        </Text>
        <HelpBox text={"Les jours fériés chômés sont rémunérés sauf s'ils tombent lors d'une période d'absence. Si travaillés, ils sont majorés de 10%. Le 1er mai est majoré de 100%."}></HelpBox>

        <Text style={{ ...styles.subtitle, marginTop: 20 }}>
          Code Postale de l'assistant:
        </Text>
        <TextInput
          onChangeText={onChangeCodePostale}
          placeholder="ex: 75001"
          placeholderTextColor='gray'
          style={{ ...styles.input, borderColor: (codePostaleValide ? '#ccc' : 'red') }}
          keyboardType="numeric"
        />
        {!codePostaleValide && <Text style={{ color: "red", fontSize: 12, marginTop: 0 }}>le code postale est invalide</Text>}

        <Text style={styles.title2}>Sélectionnez les jours fériés</Text>
        {Object.values(ListeJourFerie).map((holiday) => (
          <TouchableOpacity
            key={holiday.type}
            style={[styles.holidayItem, selectedHolidays.includes(holiday.type) && styles.selectedHoliday]}
            onPress={() => toggleHolidaySelection(holiday.type)}
          >
            <Text style={styles.label}>{holiday.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity disabled={!codePostaleValide} style={{...styles.button,backgroundColor: (codePostaleValide ? '#0058c4' : '#b8cce6')}} onPress={onclickContinue}>
        <Text style={styles.buttonText}>Continuer</Text>
      </TouchableOpacity>
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
  title2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: "black",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    color: "black",
  },
  holidayItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  selectedHoliday: {
    backgroundColor: '#70a3c4', // Change background color when selected
  },
  label: {
    fontSize: 16,
    color: 'black',
  },
  button: {
    backgroundColor: '#007AFF',
    position: 'absolute',
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
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 16,
    width: '100%',
    color: "black",
    marginTop: 10,
  },
});

export default RenderStep7;