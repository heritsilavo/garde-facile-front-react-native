import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Switch, Button, TouchableOpacity, StyleSheet, NativeEventEmitter, NativeModules } from 'react-native';
import { Planning, TrancheHoraire } from '../classes';
import { Chip } from 'react-native-paper';
import TimePicker from './TimePicker';

export interface JoursPlanningItemPropsType {
    index: number,
    text: string,
    planning: Planning
}

const hourToInt = (hour: string): number => {
    const [hours, minutes] = hour.split(':').map(Number);
    return hours * 60 + minutes;
}

const intToHour = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
}

const JoursPlanningItem = ({ jour, weekPlanning, setWeekPlanning }:{jour:JoursPlanningItemPropsType, weekPlanning: Planning[], setWeekPlanning: any}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [avecCoupure, setAvecCoupure] = useState(false);
    const [defini, setDefini] = useState<boolean>(false);
    const [tranche1Debut, setTranche1Debut] = useState<string>();
    const [tranche1Fin, setTranche1Fin] = useState<string>();
    const [tranche2Debut, setTranche2Debut] = useState<string>();
    const [tranche2Fin, setTranche2Fin] = useState<string>();

    // Other logic remains the same...

    return (
        <View style={{ ...styles.container, borderColor: (defini ? 'green' : 'orange') }}>
            {/* Header Section */}
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={styles.header}>
                <Text style={styles.headerText}>
                    {jour.text}
                </Text>
                <Text style={styles.toggleText}>{isExpanded ? '-' : '+'}</Text>
            </TouchableOpacity>

            {/* Details Section */}
            {isExpanded && (
                <View style={styles.details}>
                    <View style={styles.switchContainer}>
                        <Text style={styles.label}>Avec coupure</Text>
                        <Switch
                            value={avecCoupure}
                            onValueChange={() => setAvecCoupure(!avecCoupure)}
                        />
                    </View>
                    {/* Additional time inputs and controls here... */}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        fontFamily: 'Roboto-Bold', // Utilisation de la police personnalisée Roboto-Bold
    },
    toggleText: {
        fontSize: 18,
        color: 'black',
        fontFamily: 'Roboto-Regular', // Utilisation de la police personnalisée Roboto-Regular
    },
    details: {
        marginTop: 10,
        fontFamily: 'Roboto-Regular',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'Roboto-Regular',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 5,
        width: '40%',
        marginLeft: 10,
        marginRight: 10,
        textAlign: 'center',
        color: 'black',
        fontFamily: 'Roboto-Regular',
    },
});

export default JoursPlanningItem;
