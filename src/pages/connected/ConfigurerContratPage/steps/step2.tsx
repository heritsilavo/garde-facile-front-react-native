import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { ConfigContratContext } from "../ConfigurerContratPage";
import { useTheme } from "react-native-paper";

interface RenderStep2Props {
    setStep: (step: number) => void;
    setDateDebut: (date: string) => void;
}

const RenderStep2: React.FC<RenderStep2Props> = ({ setStep, setDateDebut }) => {
    const [selectedDay, setSelectedDay] = useState<DateData>();
    const conf = useContext(ConfigContratContext)
    const { fonts } = useTheme()

    const onPressDay = (day: DateData) => {
        setSelectedDay(day);
        setDateDebut(day.dateString)
    };

    const onclickContinue = function () {
        setStep(3);
    }


    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={[styles.title, fonts.titleLarge, {textAlign:"center"}]}>Choisissez la date de début du contrat</Text>
                <Calendar
                    onDayPress={onPressDay}
                    markedDates={{
                        [selectedDay?.dateString || '']: { selected: true, selectedColor: 'blue' }
                    }}
                />
            </View>
            <Text style={[styles.helpText, fonts.bodyMedium]}>
                correspondant au 1er jourde travail incluant la periode d'adaptation au travail et au periode d'essai.
            </Text>
            <TouchableOpacity onPress={onclickContinue} disabled={(selectedDay) ? false : true} style={{ ...styles.button, opacity: (selectedDay) ? 1 : 0.5 }}>
                <Text style={[styles.buttonText, fonts.bodyMedium]}>Continuer</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: "black",
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 16,
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    helpText: {
        marginTop: 16,
        fontSize: 14,
        color: '#666',
        textAlign: "center",
        paddingHorizontal: 20,
    },
});

export default RenderStep2;