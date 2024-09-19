import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Calendar } from 'react-native-calendars';
import { SelectedMonth } from '../../CreerEvenementPage';
import { getDebutFinMois } from '../../../../../utils/date';

interface DateSelectorProps {
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  selectedPeriod?: 'Matin' | 'Après-midi' | null;
  setSelectedPeriod?: (period: 'Matin' | 'Après-midi' | null) => void;
  month:SelectedMonth,
  needPeriod?:boolean,
  text:string
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  setSelectedDate,
  selectedPeriod,
  setSelectedPeriod,
  month,
  needPeriod,
  text
}) => {
    const [visible, setVisible] = useState(false);

    const onClick = () => {
        setVisible(true);
    };

    const onDismiss = () => {
        setVisible(false);
    };

    const onDateSelect = (date: string) => {
        setSelectedDate(date);
        onDismiss();
    };

    const handlePeriodSelect = (period: 'Matin' | 'Après-midi') => {
        if (!!setSelectedPeriod) {
            setSelectedPeriod(period);
        }
    };

    return (
        <View style={{ width: "100%" }}>
            <View style={styles.addEventButtonContainer}>
                <TouchableOpacity
                    onPress={onClick}
                    style={styles.addEventButton}
                >
                    <Icon name="calendar-day" size={18} color="#FFF" style={styles.addEventButtonIcon} />
                    <Text style={styles.addEventButtonText}>
                        {selectedDate ? `${text}: ${selectedDate}` : text}
                    </Text>
                </TouchableOpacity>
            </View>

            {(selectedDate && needPeriod) && 
                <View style={styles.selectDebutFin}>
                    <TouchableOpacity 
                        onPress={() => handlePeriodSelect('Matin')} 
                        style={[styles.periodButton, selectedPeriod === 'Matin' && styles.selectedPeriod]}
                    >
                        <Text style={{color: (selectedPeriod != "Matin") ? "black" : "white"}}>Matin</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => handlePeriodSelect('Après-midi')} 
                        style={[styles.periodButton, selectedPeriod === 'Après-midi' && styles.selectedPeriod]}
                    >
                        <Text style={{color: (selectedPeriod != "Après-midi") ? "black" : "white"}}>Après-midi</Text>
                    </TouchableOpacity>
                </View>
            }

            <Portal>
                <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
                    <Calendar
                        initialDate={(new Date(month.year,month.monthIndex +1,1)).toISOString().split("T")[0]}
                        minDate={getDebutFinMois(month)[0]}
                        maxDate={getDebutFinMois(month)[1]}
                        disableMonthChange={true}
                        disableArrowLeft={true}
                        disableArrowRight={true}
                        onDayPress={(day: { dateString: string }) => onDateSelect(day.dateString)}
                        markedDates={{
                            [selectedDate || '']: { selected: true, marked: true, selectedColor: '#007AFF' },
                        }}
                    />
                </Modal>
            </Portal>
        </View>
    );
};

export default DateSelector;

const styles = StyleSheet.create({
    selectDebutFin: {
        width: "100%",
        marginTop: 15,
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    periodButton: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#007AFF',
        backgroundColor: '#FFF',
        width:'35%',
        justifyContent:'center',
        alignItems:'center'
    },
    selectedPeriod: {
        backgroundColor: '#007AFF',
        color: '#FFF',
    },
    addEventButtonContainer: {
        width: "100%",
        marginTop: 20,
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
        marginLeft: 10
    },
    addEventButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        marginHorizontal: 20,
        borderRadius: 10,
    },
});