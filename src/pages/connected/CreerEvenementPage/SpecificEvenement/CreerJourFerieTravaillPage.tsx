import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import { ScrollView } from 'react-native-gesture-handler';
import { MD3Colors, Text, Checkbox, Card } from 'react-native-paper';
import { Evenement } from '../../../../models/evenements';
import { getJourFeriesByContratAndPeriode, setIsJourFerieTravaille } from '../../../../utils/evenements/evenement';
import { getConfiguredContrat } from '../../../../utils/contrat';
import LoadingScreen from '../../../../components/loading/LoadingScreens';
import HelpBox from '../../ConfigurerContratPage/components/HelpBox';
import { getTypeEventByText } from '../../../../utils/evenements/enum-type-evenement';

type RootStackParamList = {
  CreerJourFerieTravaillPage: {
    month: { monthIndex: number, year: number };
    familleEvenement: number;
  };
};

const CreerJourFerieTravaillPage = ({ 
  navigation, 
  route 
}: { 
  navigation: NavigationProp<any>, 
  route: RouteProp<RootStackParamList, 'CreerJourFerieTravaillPage'> 
}) => {
  const { month, familleEvenement } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [listeJourFerie, setListeJourFerie] = useState<Evenement[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Evenement>();
  const [isTravaille, setIsTravaille] = useState(false);

  useEffect(() => {
    const fetchJoursFeries = async () => {
      const contratId = await getConfiguredContrat();
      if (contratId) {
        const jours = await getJourFeriesByContratAndPeriode(contratId, month.monthIndex + 1, month.year);
        setListeJourFerie(jours);
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "ConfigurerContrat" }]
        });
      }
      setIsLoading(false);
    };

    fetchJoursFeries();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const handleSelectJourFerie = (evenementId: string) => {
    const selected = listeJourFerie.find(e => e.id === evenementId);
    setSelectedEvent(selected);
    // Set default value to selectedEvent.travaille
    setIsTravaille(selected?.travaille || false);
  };

  const handleReturn = () => navigation.navigate("Home");

  const handleClickContinue = async () => {
    if (selectedEvent) {
      setIsLoading(true);
      await setIsJourFerieTravaille(selectedEvent.id, isTravaille);
      setIsLoading(false);
      navigation.navigate("Home");
    }
  };

  const pickerItems = listeJourFerie.map(j => ({ label: j.nomJourFerie, value: j.id }));

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text variant="headlineMedium" style={styles.title}>Jour férié travaillé</Text>
        {selectedEvent && <HelpBox style={styles.helpBox} text={getTypeEventByText(selectedEvent.typeEvenement)?.description || ""} />}
        <Text variant="bodyLarge" style={styles.label}>Sélectionner un jour férié :</Text>
        
        <RNPickerSelect
          onValueChange={handleSelectJourFerie}
          items={pickerItems}
          placeholder={{ label: 'Choisissez un jour férié...', value: null }}
          style={pickerSelectStyles}
        />
        {selectedEvent && (
          <Card style={styles.selectedEventCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.selectedEventTitle}>Jour férié sélectionné :</Text>
              <Text variant="bodyLarge" style={styles.selectedEventName}>{selectedEvent.nomJourFerie}</Text>
              <Text variant="bodyMedium" style={styles.selectedEventDate}>
                Date : {new Date(selectedEvent.dateDebut).toLocaleDateString()}
              </Text>
            </Card.Content>
          </Card>
        )}
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={isTravaille ? 'checked' : 'unchecked'}
            onPress={() => setIsTravaille(!isTravaille)}
            color={MD3Colors.primary50}
          />
          <Text variant="bodyMedium" style={styles.checkboxLabel}>Jour férié travaillé</Text>
        </View>
      </ScrollView>

      <View style={styles.btnsContainer}>
        <TouchableOpacity onPress={handleReturn} style={[styles.btn, styles.annulerBtn]}>
          <Text style={styles.btnText}>Annuler</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleClickContinue} 
          style={[styles.btn, styles.continueBtn, { opacity: selectedEvent ? 1 : 0.5 }]}
          disabled={!selectedEvent}
        >
          <Text style={styles.btnText}>Continuer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  title: {
    marginBottom: 20,
    color: MD3Colors.primary40,
    fontWeight: 'bold',
  },
  helpBox: {
    marginTop: 20,
    marginBottom: 20,
  },
  label: {
    marginBottom: 10,
    color: MD3Colors.neutral60,
    fontWeight: '600',
  },
  selectedEventCard: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#E9DDFF",
    borderRadius: 12,
    elevation: 4,
  },
  selectedEventTitle: {
    color: "#21005E",
    fontWeight: 'bold',
    marginBottom: 8,
  },
  selectedEventName: {
    color: "#21005E",
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  selectedEventDate: {
    color: "#21005E",
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    elevation: 2,
  },
  checkboxLabel: {
    marginLeft: 8,
    color: MD3Colors.neutral60,
    fontWeight: '500',
  },
  btnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  btn: {
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    elevation: 3,
  },
  btnText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
  },
  annulerBtn: {
    backgroundColor: MD3Colors.error50,
  },
  continueBtn: {
    backgroundColor: MD3Colors.primary50,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: MD3Colors.neutral20,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    color: MD3Colors.neutral80,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: MD3Colors.neutral20,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    color: MD3Colors.neutral80,
  },
});

export default CreerJourFerieTravaillPage;