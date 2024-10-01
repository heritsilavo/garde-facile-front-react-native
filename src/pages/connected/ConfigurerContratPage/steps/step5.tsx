import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { ConfigContratContext } from "../ConfigurerContratPage";

interface RenderStep5Props {
    setStep: (step: number) => void;
    setEnfantAChargeSalariee: (params: { nbEnfantsMoins15Ans: number; existent: boolean }) => void;
}

interface Option {
    value: boolean;
    text: string;
}

const OPTIONS: Option[] = [
    { value: true, text: 'Oui' },
    { value: false, text: 'Non' },
    { value: false, text: 'Je ne sais pas' }
];

const RenderStep5: React.FC<RenderStep5Props> = ({ setStep, setEnfantAChargeSalariee }) => {
    const [selected, setSelected] = useState<Option | undefined>();
    const [nombreEnfant, setNombreEnfant] = useState<string>('');
    const configContrat = useContext(ConfigContratContext);

    const onClickContinue = () => {
        if (selected) {
            setStep(6);
            setEnfantAChargeSalariee({
                existent: selected.value,
                nbEnfantsMoins15Ans: selected.value ? parseInt(nombreEnfant) || 0 : 0
            });
        }
    };

    const isButtonDisabled = !selected || (selected.value && !nombreEnfant);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Enfant à charge du salarié</Text>
                <Text style={styles.subtitle}>
                    Votre assistant maternel a le droit à des congés supplémentaires pour chaque enfant à sa charge
                </Text>

                <Text style={styles.question}>
                    {configContrat?.configContrat.body.assmat.nom} {configContrat?.configContrat.body.assmat.prenom} a-t-elle des enfants à sa charge ?
                </Text>

                {OPTIONS.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.modaliteItem,
                            item.text === selected?.text && styles.selectedModaliteItem
                        ]}
                        onPress={() => setSelected(item)}
                    >
                        <Text style={styles.typeName}>{item.text}</Text>
                    </TouchableOpacity>
                ))}

                {selected?.value && (
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Nombre d'enfants de moins de 15 ans :</Text>
                        <TextInput
                            onChangeText={setNombreEnfant}
                            style={styles.input}
                            keyboardType="numeric"
                            value={nombreEnfant}
                        />
                    </View>
                )}
            </ScrollView>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, isButtonDisabled && styles.disabledButton]}
                    disabled={isButtonDisabled}
                    onPress={onClickContinue}
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
        padding: 16,
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
    question: {
        fontSize: 16,
        marginBottom: 16,
        color: "black",
        fontWeight: 'bold',
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
        borderRadius: 5,
        marginBottom: 10,
        borderWidth: 0.5,
        borderColor: '#ccc',
    },
    selectedModaliteItem: {
        backgroundColor: '#f1f1f1',
        borderWidth: 1,
    },
    typeName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "black",
        textAlign: 'center',
    },
    inputContainer: {
        width: '100%',
        marginTop: 16,
    },
    inputLabel: {
        color: "black",
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        color: "black",
    },
});

export default RenderStep5;