import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useTheme } from 'react-native-paper';

interface DaySelectorProps {
  selected: number;
  setSelected: (value: number) => void;
}

// Days of the week array
export const LUNDI_ID = 1000;
const daysOfWeek = [
  { id: LUNDI_ID, name: 'Lundi' },
  { id: 1, name: 'Mardi' },
  { id: 2, name: 'Mercredi' },
  { id: 3, name: 'Jeudi' },
  { id: 4, name: 'Vendredi' },
  { id: 5, name: 'Samedi' },
  { id: 6, name: 'Dimanche' },
];

const DaySelector: React.FC<DaySelectorProps> = ({ selected, setSelected }) => {
  const { fonts } = useTheme(); // Access theme fonts

  // Map days to picker items
  const pickerItems = daysOfWeek.map(day => ({
    label: day.name,
    value: day.id,
  }));

  const onSelectOne = function (day: number) {
    setSelected(day === LUNDI_ID ? 0 : day);
  };

  const getName = function (id: number) {
    const day = daysOfWeek.find(element => element.id === id);
    return day ? day.name : "Aucun jour sélectionné";
  };

  return (
    <View style={styles.container}>
      <RNPickerSelect
        onValueChange={onSelectOne}
        items={pickerItems}
        value={selected}
        style={pickerSelectStyles}
        placeholder={{ label: 'Sélectionnez un jour', value: null }}
      />
      <Text style={[styles.selectedText, fonts.bodyMedium]}>
        Jour sélectionné: {getName(selected)}
      </Text>
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    width: '95%',
  },
  selectedText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
});

// Styles specifically for the picker input
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    color: '#333333',
    paddingRight: 30, // To account for the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    color: '#333333',
  },
});

export default DaySelector;
