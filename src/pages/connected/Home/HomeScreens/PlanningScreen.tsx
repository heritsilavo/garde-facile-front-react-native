import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import PlanningMonthSelector from '../../../../components/loading/PlanningMonthSelector';
import { configuredContratContext, configuredContratContextProps } from '../Home';
import { obtenirSemaines, Semaine } from '../../../../utils/date';
import SelectSemmaineNonTravailleModal from '../Pages/SelectSemmaineNonTravaillePage';

interface SelectedMonth {
  year: number;
  monthIndex: number;
}

const PlanningScreen = () => {
  const [selectedMonth, setSelectedMonth] = useState<SelectedMonth>({ year: 0, monthIndex: 0 });
  const { configuredContrat } = useContext<configuredContratContextProps>(configuredContratContext);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const now = new Date();
    setSelectedMonth({ year: now.getFullYear(), monthIndex: now.getMonth() });
  }, []);

  const onclickAddSemmaineNonTravaille = () => {
    setModalVisible(true);
  };

  const handleConfirmSelection = (selectedWeeks: Semaine[]) => {
    console.log("Semaines non travaillées sélectionnées:", selectedWeeks);
    // Ajoutez ici la logique pour traiter les semaines sélectionnées
  };

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
    </View>
  );
};

export default PlanningScreen;

// ... styles restent inchangés

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:"#e1e1e1"
    },
    title:{
        color:'black',
        fontWeight:'bold',
        fontSize:20,
        margin:10
    },
    eventViewer:{
        flex:1,
        width:'100%',
    },
    button: {
        backgroundColor: '#007AFF',
        width:'90%',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 8,
    },
        buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
})