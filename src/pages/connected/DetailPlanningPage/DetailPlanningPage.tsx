import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Appbar, Text, Card, Surface, Chip, useTheme } from 'react-native-paper';
import { Body as Contrat, Planning } from '../ConfigurerContratPage/classes';
import { ContratHistorique } from '../../../models/contrat-historique';

// Format les minutes en un format heures:minutes
const formatMinutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}h:${mins.toString().padStart(2, '0')}`;
};

// Composant pour afficher un créneau horaire
const TimeSlotDisplay = ({ slot }: { slot: { heureDebut: number | null, heureFin: number | null } }) => {
  if (!slot.heureDebut || !slot.heureFin) {
    return <Chip icon="clock-outline" style={styles.chipInactive}>Aucun horaire</Chip>;
  }

  const { fonts } = useTheme();

  return (
    <View style={styles.timeSlotContainer}>
      <View style={styles.timeRow}>
        <Text style={[styles.timeText, fonts.bodyMedium, ]}>{formatMinutesToTime(slot.heureDebut)}</Text>
        <Text style={[styles.timeText, fonts.bodyMedium, ]}>à</Text>
        <Text style={[styles.timeText, fonts.bodyMedium, ]}>{formatMinutesToTime(slot.heureFin)}</Text>
      </View>
    </View>
  );
};

// Composant principal pour la page "Détail du Planning"
const DetailPlanningPage = ({ route, navigation }: { route: any, navigation: any }) => {
  const { contrat } = route.params;
  const planning: Planning[] = contrat.planning;

  const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar} elevated>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Détail du Planning" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <Surface style={styles.cardContainer} elevation={1}>
          <Text variant="titleLarge" style={styles.title}>Planning Hebdomadaire</Text>

          {planning.map((day, index) => (
            <Card key={index} style={styles.dayCard}>
              <Card.Content>
                <View style={styles.dayHeader}>
                  <Text variant="titleMedium">{DAYS[index]}</Text>
                </View>

                <View style={styles.timeSlots}>
                  <View style={styles.slotSection}>
                    <Text variant="bodyMedium" style={styles.slotLabel}>Tranche horaire 1</Text>
                    <TimeSlotDisplay slot={day.trancheHoraire1} />
                  </View>

                  {day.trancheHoraire2.heureDebut !== null && day.trancheHoraire2.heureFin !== null && (
                    <View style={styles.slotSection}>
                      <Text variant="bodyMedium" style={styles.slotLabel}>Tranche horaire 2</Text>
                      <TimeSlotDisplay slot={day.trancheHoraire2} />
                    </View>
                  )}
                </View>
              </Card.Content>
            </Card>
          ))}
        </Surface>
      </ScrollView>
    </View>
  );
};

export default DetailPlanningPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  appbar: {
    backgroundColor: '#ffffff',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  cardContainer: {
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 15,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  dayCard: {
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeSlots: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  slotSection: {
    width: '100%',
    marginBottom: 10,
  },
  slotLabel: {
    marginBottom: 5,
    color: '#666',
  },
  timeSlotContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginVertical: 5,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
  },
  timeLabel: {
    color: '#666',
    fontSize: 12,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  chipActive: {
    backgroundColor: '#E6F2FF',
    marginTop: 5,
  },
  chipInactive: {
    backgroundColor: '#F0F0F0',
  },
});