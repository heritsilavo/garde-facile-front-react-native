import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Evenement } from '../models/evenements';
import { Modal, Portal, Button } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { getTypeEventByText } from '../utils/evenements/enum-type-evenement';

interface ModalDeleteEventProps {
    visible: boolean;
    onDismiss: () => void;
    onConfirm: (event: Evenement) => Promise<void>;
    event: Evenement;
}

const ModalDeleteEvent: React.FC<ModalDeleteEventProps> = ({ visible, onDismiss, onConfirm, event }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const theme = useTheme();

    const handleConfirm = async () => {
        setIsLoading(true);
        await onConfirm(event);
        setIsLoading(false);
        onDismiss();
    };

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles(theme).modalContainer}>
                <SafeAreaView style={styles(theme).safeArea}>
                    <Text style={styles(theme).title}>Confirmer la suppression</Text>
                    <Text style={styles(theme).subtitle}>
                        Vous voulez vraiment supprimer l'événement <Text style={styles(theme).boldText}>{getTypeEventByText(event.typeEvenement)?.titre}</Text> ?
                    </Text>

                    <View style={styles(theme).buttonContainer}>
                        <Button
                            mode="outlined"
                            onPress={onDismiss}
                            style={[styles(theme).button, styles(theme).cancelButton]}
                            disabled={isLoading}
                        >
                            Annuler
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleConfirm}
                            style={[styles(theme).button, styles(theme).confirmButton]}
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

const styles = (theme:any) => StyleSheet.create({
    modalContainer: {
        backgroundColor: theme.colors.background, // Utiliser la couleur de fond du thème
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
        fontFamily: theme.fonts.titleMedium.fontFamily, // Police pour le titre
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: theme.colors.primary, // Utiliser la couleur primaire du thème
    },
    subtitle: {
        fontSize: 16,
        fontFamily: theme.fonts.bodyMedium.fontFamily, // Police pour le sous-titre
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
        backgroundColor: theme.colors.error, // Utiliser la couleur d'erreur du thème
    },
});

export default ModalDeleteEvent;
