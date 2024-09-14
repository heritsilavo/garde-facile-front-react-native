import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Modal, Portal, Button, Checkbox } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Semaine } from '../../../../utils/date';

interface SelectSemmaineNonTravailleModalProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: (selectedWeeks: Semaine[]) => void;
  semaines: Semaine[];
}

const SelectSemmaineNonTravailleModal: React.FC<SelectSemmaineNonTravailleModalProps> = ({visible,onDismiss,onConfirm,semaines}) => {
  const [selectedWeeks, setSelectedWeeks] = useState<Semaine[]>([]);

  const toggleWeek = (week: Semaine) => {
    setSelectedWeeks((prevSelectedWeeks: Semaine[]) => {
      const index = prevSelectedWeeks.findIndex(s => s.numeroSemmaine === week.numeroSemmaine);
      if (index !== -1) {
        // La semaine est déjà sélectionnée, donc on la retire
        return prevSelectedWeeks.filter(s => s.numeroSemmaine !== week.numeroSemmaine);
      } else {
        // La semaine n'est pas sélectionnée, donc on l'ajoute
        return [...prevSelectedWeeks, week];
      }
    });
  };

  const handleConfirm = () => {
    onConfirm(selectedWeeks);
    onDismiss();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
        <SafeAreaView style={styles.safeArea}>
          <Text style={styles.title}>Sélection des semaines non travaillées</Text>
          <Text style={styles.subtitle}>
            Sélectionnez les semaines non travaillées pour ce mois-ci.
          </Text>
          
          <ScrollView style={styles.weeksList}>
            <Checkbox.Item
              label="Pas de semaine non travaillée"
              status={selectedWeeks.length === 0 ? 'checked' : 'unchecked'}
              onPress={() => setSelectedWeeks([])}
              style={styles.checkboxItem}
            />

            {semaines.map((semaine, index) => (
              <Checkbox.Item
                key={index}
                label={semaine.label}
                status={selectedWeeks.map(w => w.label).includes(semaine.label) ? 'checked' : 'unchecked'}
                onPress={() => toggleWeek(semaine)}
                style={styles.checkboxItem}
              />
            ))}
          </ScrollView>

          <Text style={styles.totalText}>
            Total : {selectedWeeks.length} semaine{selectedWeeks.length !== 1 ? 's' : ''} non travaillée{selectedWeeks.length !== 1 ? 's' : ''}
          </Text>

          <View style={styles.buttonContainer}>
            <Button mode="outlined" onPress={onDismiss} style={styles.button}>
              Annuler
            </Button>
            <Button mode="contained" onPress={handleConfirm} style={styles.button}>
              Confirmer
            </Button>
          </View>
        </SafeAreaView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 5,
    overflow: 'hidden',
    height:'95%'
  },
  safeArea: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    color: '#007AFF',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    color: '#666',
  },
  weeksList: {
    maxHeight: 400,
  },
  checkboxItem: {
    paddingVertical: 8,
  },
  totalText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    width: '40%',
  },
});

export default SelectSemmaineNonTravailleModal;