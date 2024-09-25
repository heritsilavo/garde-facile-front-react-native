import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Evenement } from '../models/evenements';
import { Modal, Portal, Button } from 'react-native-paper';
import { getTypeEventByText } from '../utils/evenements/enum-type-evenement';

interface ModalDeleteEventProps {
    visible: boolean;
    onDismiss: () => void;
    onConfirm: (event: Evenement) => Promise<void>;
    event: Evenement;
}

const ModalDeleteEvent: React.FC<ModalDeleteEventProps> = ({ visible, onDismiss, onConfirm, event }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    

    const handleConfirm = async () => {
        setIsLoading(true);
        await onConfirm(event);
        setIsLoading(false);
        onDismiss();
    };

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
                <SafeAreaView style={styles.safeArea}>
                    <Text style={styles.title}>Confirmer la suppression</Text>
                    <Text style={styles.subtitle}>
                        Vous voulez vraiment supprimer l'événement <Text style={styles.boldText}>{getTypeEventByText(event.typeEvenement)?.titre}</Text> ?
                    </Text>

                    <View style={styles.buttonContainer}>
                        <Button
                            mode="outlined"
                            onPress={onDismiss}
                            style={[styles.button, styles.cancelButton]}
                            disabled={isLoading}
                        >
                            Annuler
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleConfirm}
                            style={[styles.button, styles.confirmButton]}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#ffffff" size="small" />
                            ) : (
                                'Confirmer'
                            )}
                        </Button>
                    </View>
                </SafeAreaView>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: '#f9f9f9',
        margin: 20,
        borderRadius: 10,
        overflow: 'hidden',
        height: '40%',
    },
    safeArea: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#0056b3',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#555',
    },
    boldText: {
        fontWeight: 'bold',
        color: '#333',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        width: '48%',
    },
    cancelButton: {
        backgroundColor: '#e0e0e0',
        borderColor: '#b0b0b0',
    },
    confirmButton: {
        backgroundColor: '#d1213c',
    },
});

export default ModalDeleteEvent;