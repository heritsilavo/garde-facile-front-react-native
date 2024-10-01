import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import moment from 'moment';
import MonthSelectorCalendar from 'react-native-month-selector';

interface RenderStep4Props {
    setStep: (step: number) => void;
    setModePayementConge: (params: { mode: string; mois: number }) => void;
}

interface ModePayement {
    type: string;
    titre: string;
    description: string;
}

const PAYMENT_MODES: ModePayement[] = [
    {
        type: 'EN_JUIN',
        titre: 'Paiement une seule fois en juin',
        description: "L'intégralité de l'indemnité de congés payés sera versée en juin"
    },
    {
        type: 'LORS_PRISE_CONGES_PRINCIPAUX',
        titre: 'Paiement lors de la prise des congés principaux',
        description: "L'intégralité de l'indemnité de congés payés sera versée le mois de la prise des congés principaux"
    },
    {
        type: 'LORS_PRISE_CONGES',
        titre: 'Paiement au fur et à mesure de la prise des congés',
        description: "L'indemnité est versée proportionnellement au nombre de jours posés par mois"
    }
];

const RenderStep4: React.FC<RenderStep4Props> = ({ setStep, setModePayementConge }) => {
    const [modePayement, setModePayement] = useState<ModePayement | undefined>();
    const [selectedMonth, setSelectedMonth] = useState(moment());
    const moisPriseConge = selectedMonth.month() + 1;

    const handleMonthChange = (month: moment.Moment) => setSelectedMonth(month);

    const onClickContinue = () => {
        if (!modePayement) return;

        const params = { 
            mode: modePayement.type, 
            mois: modePayement.type === 'LORS_PRISE_CONGES_PRINCIPAUX' ? moisPriseConge : -1 
        };
        setModePayementConge(params);
        setStep(5);
    };

    const isButtonDisabled = useMemo(() => {
        if (!modePayement) return true;
        if (modePayement.type === 'LORS_PRISE_CONGES_PRINCIPAUX' && !moisPriseConge) return true;
        return false;
    }, [modePayement, moisPriseConge]);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Modalités de paiement des congés payés</Text>
                <Text style={styles.subtitle}>
                    Sélectionnez votre modalité de paiement des indemnités de congés payés 
                </Text>
                {PAYMENT_MODES.map((modalite, index) => (
                    <View key={modalite.type}>
                        <TouchableOpacity 
                            style={[
                                styles.modaliteItem,
                                modalite.type === modePayement?.type && styles.selectedModaliteItem
                            ]}
                            onPress={() => setModePayement(modalite)}
                        >
                            <Text style={styles.typeName}>{modalite.titre}</Text>
                            <Text style={styles.typeDescription}>{modalite.description}</Text>
                        </TouchableOpacity>

                        {modalite.type === 'LORS_PRISE_CONGES_PRINCIPAUX' && modePayement?.type === 'LORS_PRISE_CONGES_PRINCIPAUX' && (
                            <View style={styles.monthSelectorContainer}>
                                <Text style={styles.monthSelectorLabel}>Sélectionnez le mois de la prise des congés :</Text>
                                <MonthSelectorCalendar
                                    selectedDate={selectedMonth}
                                    onMonthTapped={handleMonthChange}
                                    maxDate={moment().endOf('year')}
                                />
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    onPress={onClickContinue} 
                    disabled={isButtonDisabled}
                    style={[styles.button, isButtonDisabled && styles.disabledButton]}
                >
                    <Text style={styles.buttonText}>Continuer</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: "black",
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 16,
        color: "black",
        textAlign: 'center',
    },
    buttonContainer: {
        padding: 16,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 16,
        alignItems: 'center',
        borderRadius: 8,
    },
    disabledButton: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modaliteItem: {
        padding: 16,
        borderWidth: 0.5,
        borderRadius: 5,
        marginBottom: 10,
        borderColor: '#ccc',
    },
    selectedModaliteItem: {
        borderWidth: 1,
        backgroundColor: '#f1f1f1',
    },
    typeName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "black",
    },
    typeDescription: {
        fontSize: 14,
        color: '#666',
    },
    monthSelectorContainer: {
        marginTop: 10,
    },
    monthSelectorLabel: {
        color: "black",
        marginBottom: 10,
    },
});

export default RenderStep4;