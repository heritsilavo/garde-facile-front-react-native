import React, { useContext, useEffect, useState, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import PlanningMonthSelector from '../../../../components/PlanningMonthSelector';
import { configuredContratContext } from '../Home';
import { calculerDifferenceAvecPlanning, obtenirSemaines, Semaine } from '../../../../utils/date';
import SelectSemmaineNonTravailleModal from '../Pages/SelectSemmaineNonTravaillePage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationContext, useNavigation } from '@react-navigation/native';
import { Amplitude, Evenement } from '../../../../models/evenements';
import EventsList from '../../../../components/EventsList';
import { creerEvenement, deleteEvenement, getEvenementsByContratAndPeriode } from '../../../../utils/evenements/evenement';
import { getConfiguredContrat, getDetailConfiguredContrat } from '../../../../utils/contrat';
import { getTypeAndLibele, getTypeEventByText, isRemunere, isTravaille, TypeEvenement } from '../../../../utils/evenements/enum-type-evenement';
import { generateGeneralId } from '../../../../utils/generateId';
import Toast from 'react-native-toast-message';
import ModalDeleteEvent from '../../../../components/ModalDeleteEvent';
import ModalDetailEvent from '../../../../components/ModalDetailEvent';
import { Body as ContratEntity } from '../../ConfigurerContratPage/classes';
import { getJourFerieByLabel, getJourFerieByText } from '../../../../utils/ListeJoursFerie';
interface SelectedMonth {
  year: number;
  monthIndex: number;
}

const PlanningScreen = ({ refreshValue }: { refreshValue: Date }) => {
  const { fonts } = useTheme()
  const [selectedMonth, setSelectedMonth] = useState<SelectedMonth>({ year: 0, monthIndex: 0 });
  const { configuredContrat } = useContext(configuredContratContext);
  const [modalVisible, setModalVisible] = useState(false);

  const [loadEvents, setLoadEvents] = useState<boolean>(true);
  const [events, setEvents] = useState<Evenement[]>([]);

  const navigation = useContext(NavigationContext);

  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false)
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false)
  const [selectedEvent, setSelectedEvent] = useState<Evenement>(new Evenement())



  const fetchEvents = useCallback(async () => {
    if (!loadEvents) {
      setLoadEvents(true);
      const contratId = await getConfiguredContrat();
      if (!!contratId) {
        var listeEvenement = await getEvenementsByContratAndPeriode(contratId, selectedMonth.monthIndex, selectedMonth.year);

        setEvents(listeEvenement);
        setLoadEvents(false);
      }
    }else setLoadEvents(false)
  }, [selectedMonth]);

  useEffect(() => {
    (async () => {
      const now = new Date();
      now.setMilliseconds(0)
      now.setSeconds(0)
      now.setMinutes(0)
      now.setHours(0)
      var month = { year: now.getFullYear(), monthIndex: now.getMonth() + 1 };
      var dateDebutContrat = new Date(configuredContrat.dateDebut)
      var monthDebutContrat = { year: dateDebutContrat.getFullYear(), monthIndex: dateDebutContrat.getMonth() + 1 };
      if (now.getTime() < dateDebutContrat.getTime()) setSelectedMonth(monthDebutContrat);
      else setSelectedMonth(month);
      
      await fetchEvents();
    })();
  }, [refreshValue]);

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [fetchEvents])
  );


  const onclickAddSemmaineNonTravaille = () => {
    setModalVisible(true);
  };

  const handleConfirmSelection = async (selectedWeeks: Semaine[]) => {
    const createEventPromises = selectedWeeks.map(async (week) => {
      try {
        const newEvenement: Evenement = new Evenement();
        
        newEvenement.numeroSemaine = week.numeroSemaine;
        newEvenement.modifiable = true;

        const amplitude: Amplitude = new Amplitude();

        amplitude.debutAmplitude = week.dateDebut.toISOString().split('T')[0];
        amplitude.finAmplitude = week.dateFin.toISOString().split('T')[0];
        newEvenement.amplitude = amplitude;
        newEvenement.dateDebut = amplitude.debutAmplitude;
        newEvenement.dateFin = amplitude.finAmplitude;
        newEvenement.debutEvenementMidi = false;
        newEvenement.finEvenementMidi = false;
        newEvenement.travaille = isTravaille(TypeEvenement.SEMAINE_NON_TRAVAILLEE);
        newEvenement.remunere = isRemunere(TypeEvenement.SEMAINE_NON_TRAVAILLEE);
        newEvenement.debutMidi = false;
        newEvenement.finMidi = false;

        const contrat = await getDetailConfiguredContrat();
        const [nbJours, nbHeures] = calculerDifferenceAvecPlanning(
          newEvenement.debutEvenementMidi,
          newEvenement.finEvenementMidi,
          newEvenement.dateDebut,
          newEvenement.dateFin,
          contrat.planning
        );

        newEvenement.nbJours = nbJours;
        newEvenement.nbHeures = nbHeures;
        newEvenement.typeEvenement = TypeEvenement.SEMAINE_NON_TRAVAILLEE.texte;
        newEvenement.libelleExceptionnel = null;
        newEvenement.contratsId.push(contrat.id);
        newEvenement.dateCreation = new Date().toISOString();
        newEvenement.id = generateGeneralId();
        newEvenement.amplitude.reel = nbJours;
        newEvenement.amplitude.decompte = nbJours;
        newEvenement.famille = TypeEvenement.SEMAINE_NON_TRAVAILLEE.famille;

        return await creerEvenement(newEvenement);
      } catch (error) {
        return Promise.reject(error);
      }
    });

    try {
      const results = await Promise.allSettled(createEventPromises);
      let successCount = 0;
      let errorCount = 0;

      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          successCount++;
          console.log("Événement ajouté avec succès:", result.value.data);
        } else {
          errorCount++;
          const error = result.reason;
          const message = error?.response?.data?.message || error?.message || error.toString();
          const description = error?.response?.data?.description || "";
        }
      });

      if (successCount > 0) {
        Toast.show({
          type: "success",
          text1: `${successCount} événement(s) ajouté(s) avec succès`,
          visibilityTime: 2000,
        });
      }
      if (errorCount > 0) {
        Toast.show({
          type: "error",
          text1: `Erreur lors de l'ajout de ${errorCount} événement(s)`,
          text2: "Veuillez vérifier les détails dans la console",
          visibilityTime: 3000,
        });
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || error.toString();
      const description = error?.response?.data?.description || "";
      Toast.show({
        type: "error",
        text1: message,
        text2: message !== description ? description : undefined,
        visibilityTime: 3000,
      });
    } finally {
      setSelectedMonth((oldValue) => ({ ...oldValue }));
    }
  };

  const handleAddEvenement = function () {
    navigation?.navigate("CreerEvenementPage", {
      month: {...selectedMonth, monthIndex:selectedMonth.monthIndex - 1}, //-1 car zero based ny month retra any am comp
    });
  }

  const renderAddSemmaineNonTravailleeButton = () => {
    var isSemmaineNonTravailleExiste = false
    events.forEach(E => {
      if (getTypeEventByText(E.typeEvenement)?.texte == TypeEvenement.SEMAINE_NON_TRAVAILLEE.texte) {
        isSemmaineNonTravailleExiste = true
      }
    });
    if (isSemmaineNonTravailleExiste) {
      return (
        <Card style={styles.greenCard}>
          <Card.Content style={styles.greenCardContent}>
            <Icon name="check-circle" size={24} color="#4CAF50" />
            <Text style={{ ...styles.greenCardText, ...fonts.bodyMedium }}>Semaine(s) non travaillée(s) déjà ajoutée(s)</Text>
          </Card.Content>
        </Card>
      );
    } else {
      return (
        <Button
          onPress={onclickAddSemmaineNonTravaille}
          style={{ ...styles.button, ...fonts.bodyLarge }}
          mode="contained"
          icon="calendar-blank-outline"
        >
          Ajouter une semaine non travaillée
        </Button>
      );
    }
  };

  const onClickDelete = function (event: Evenement) {
    setSelectedEvent(event)
    setDeleteModalVisible(true);
  }
  
  const onConfirmDelete = async function (event: Evenement) {
    return deleteEvenement(event.id).then(response => {
      fetchEvents();
      Toast.show({
        type:"info", 
        autoHide:true,
        text1:"Suppression reussi",
        visibilityTime:1500
      })
    }).catch(()=>{
      Toast.show({
        type:"error", 
        autoHide:true,
        visibilityTime:1500,
        text1:"Erreur pendant la suppression"
      })
    })
  }

  const onClickShowDetails = function (event: Evenement) {
    setSelectedEvent(event)
    setDetailModalVisible(true)
    console.log("DETAIL, EVENEMENT: ", event);
  }

  return (
    <View style={styles.container}>
      <Text style={{ ...styles.title, ...fonts.titleLarge }}>Planning</Text>
      <PlanningMonthSelector
        contrat={configuredContrat}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />

      {!loadEvents && renderAddSemmaineNonTravailleeButton()}

      <EventsList onDelete={onClickDelete} onShowDetails={onClickShowDetails} loading={loadEvents} setIsLoading={setLoadEvents} events={events} setEvents={setEvents} />

      <SelectSemmaineNonTravailleModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        onConfirm={handleConfirmSelection}
        semaines={obtenirSemaines({...selectedMonth, monthIndex:selectedMonth.monthIndex - 1})} //-1 car zero based ny month retra any am comp
      />


      <ModalDeleteEvent
        visible={deleteModalVisible}
        event={selectedEvent}
        onDismiss={() => setDeleteModalVisible(false)}
        onConfirm={onConfirmDelete}
      />

      <ModalDetailEvent
        visible={detailModalVisible}
        event={selectedEvent}
        onDismiss={() => setDetailModalVisible(false)}
      />

      <View style={styles.addEventButtonContainer}>
        <TouchableOpacity
          onPress={handleAddEvenement}
          style={styles.addEventButton}
        >
          <Icon name="add-circle-outline" size={24} color="#FFF" style={styles.addEventButtonIcon} />
          <Text style={{ ...styles.addEventButtonText, ...fonts.bodyMedium }}>Ajouter un événement</Text>
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
    fontSize: 20,
    margin: 10,
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
  greenCard: {
    backgroundColor: '#E8F5E9',
    width: '90%',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  greenCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greenCardText: {
    color: '#4CAF50',
    marginLeft: 10,
    fontWeight: 'bold',
  },
});

export default PlanningScreen;