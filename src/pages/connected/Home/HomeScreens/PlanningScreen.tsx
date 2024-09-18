import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from 'react-native-paper';
import PlanningMonthSelector from '../../../../components/loading/PlanningMonthSelector';
import { configuredContratContext, configuredContratContextProps } from '../Home';
import { obtenirSemaines, Semaine } from '../../../../utils/date';
import SelectSemmaineNonTravailleModal from '../Pages/SelectSemmaineNonTravaillePage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationContext, useNavigation } from '@react-navigation/native';
import { Evenement } from '../../../../models/evenements';

interface SelectedMonth {
  year: number;
  monthIndex: number;
}

const PlanningScreen = () => {
  const [selectedMonth, setSelectedMonth] = useState<SelectedMonth>({ year: 0, monthIndex: 0 });
  const { configuredContrat } = useContext<configuredContratContextProps>(configuredContratContext);
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useContext(NavigationContext)

  useEffect(() => {
    const now = new Date();
    setSelectedMonth({ year: now.getFullYear(), monthIndex: now.getMonth() });
  }, []);

  const onclickAddSemmaineNonTravaille = () => {
    setModalVisible(true);
  };

  const handleConfirmSelection = (selectedWeeks: Semaine[]) => {
    const newEvenement:Evenement = new Evenement();
    // Diniho tsara
  };

  const handleAddEvenement = function() {
    navigation?.navigate("CreerEvenementPage", {
      month:selectedMonth,
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Planning</Text>
      <PlanningMonthSelector
        dateDebutContrat={configuredContrat.dateDebut}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />
      <Button
        onPress={onclickAddSemmaineNonTravaille}
        style={styles.button}
        mode="contained"
        icon="calendar-blank-outline"
      >
        Ajouter une semaine non travaillée
      </Button>
      <ScrollView style={styles.eventViewer}>
        {/* Contenu du planning */}
      </ScrollView>
      <SelectSemmaineNonTravailleModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        onConfirm={handleConfirmSelection}
        semaines={obtenirSemaines(selectedMonth)}
      />
      <View style={styles.addEventButtonContainer}>
        <TouchableOpacity
          onPress={handleAddEvenement}
          style={styles.addEventButton}
        >
          <Icon name="add-circle-outline" size={24} color="#FFF" style={styles.addEventButtonIcon} />
          <Text style={styles.addEventButtonText}>Ajouter un événement</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: "#e1e1e1",
  },
  title: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
    margin: 10,
  },
  eventViewer: {
    flex: 1,
    width: '100%',
  },
  button: {
    backgroundColor: '#007AFF',
    width: '90%',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addEventButtonContainer: {
    position: 'absolute',
    bottom: 20,
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
  addEventButton: {
    backgroundColor: '#007AFF',
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addEventButtonIcon: {
    marginRight: 5,
  },
  addEventButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default PlanningScreen;