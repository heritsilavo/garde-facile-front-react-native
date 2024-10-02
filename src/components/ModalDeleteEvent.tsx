import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Evenement } from '../models/evenements';
import { Dialog, Portal, Button } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { getTypeEventByText } from '../utils/evenements/enum-type-evenement';

interface ModalDeleteEventProps {
    visible: boolean;
    onDismiss: () => void;
    onConfirm: (event: Evenement) => Promise<any>;
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
            <Dialog visible={visible} onDismiss={onDismiss} dismissable={!isLoading}>
                <Dialog.Title style={styles(theme).title}>Confirmer la suppression</Dialog.Title>
                <Dialog.Content>
                    <Text style={styles(theme).subtitle}>
                        Vous voulez vraiment supprimer l'événement <Text style={styles(theme).boldText}>{getTypeEventByText(event.typeEvenement)?.titre}</Text> ?
                    </Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onDismiss} mode="outlined" style={[styles(theme).button, styles(theme).cancelButton]} disabled={isLoading}>
                        Annuler
                    </Button>
                    <Button onPress={handleConfirm} mode="contained" style={[styles(theme).button, styles(theme).confirmButton]} disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator color="#ffffff" size="small" />
                        ) : (
                            'Confirmer'
                        )}
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

const styles = (theme:any) => StyleSheet.create({
    title: {
        fontSize: 24,
        fontFamily: theme.fonts.titleMedium.fontFamily,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: theme.colors.primary,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: theme.fonts.bodyMedium.fontFamily,
        textAlign: 'center',
        marginBottom: 20,
        color: '#555',
    },
    boldText: {
        fontWeight: 'bold',
        color: '#333',
    },
    button: {
        width: '48%',
    },
    cancelButton: {
        backgroundColor: '#e0e0e0',
        borderColor: '#b0b0b0',
    },
    confirmButton: {
        backgroundColor: theme.colors.error,
    },
});

export default ModalDeleteEvent;