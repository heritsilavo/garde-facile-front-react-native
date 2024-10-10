import React from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';
import { Dialog, Portal, IconButton, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Evenement } from '../models/evenements';
import { getTypeEventByText } from '../utils/evenements/enum-type-evenement';
import { getDescriptionByEvent } from '../utils/evenements/evenement';

interface ModalDetailEventProps {
    visible: boolean;
    onDismiss: () => void;
    event: Evenement;
}

const ModalDetailEvent: React.FC<ModalDetailEventProps> = ({ visible, onDismiss, event }) => {
    const theme = useTheme();

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss} style={styles(theme).dialog}>
                <IconButton
                    icon={() => (
                        <MaterialCommunityIcons name="close-circle" size={24} color={theme.colors.outline} />
                    )}
                    onPress={onDismiss}
                    style={styles(theme).closeButton}
                />
                <Dialog.ScrollArea style={styles(theme).scrollArea}>
                    <ScrollView contentContainerStyle={styles(theme).scrollContent}>
                        <Text style={styles(theme).title}>{getTypeEventByText(event.typeEvenement)?.titre}</Text>
                        <Text style={styles(theme).date}>{getDescriptionByEvent(event)}</Text>
                        <Text style={styles(theme).description}>{getTypeEventByText(event.typeEvenement)?.description}</Text>
                    </ScrollView>
                </Dialog.ScrollArea>
            </Dialog>
        </Portal>
    );
};

const styles = (theme: any) => StyleSheet.create({
    dialog: {
        backgroundColor: theme.colors.background,
        margin: 20,
        borderRadius: 16,
        paddingVertical: 24,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        maxHeight: '90%',
    },
    scrollArea: {
        paddingHorizontal: 0,
    },
    closeButton: {
        position: 'absolute',
        right: 16,
        top: 16,
        zIndex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
    },
    title: {
        fontSize: 24,
        fontFamily: theme.fonts.titleMedium.fontFamily,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 12,
        color: theme.colors.text,
    },
    date: {
        fontSize: 16,
        fontFamily: theme.fonts.bodyMedium.fontFamily,
        textAlign: 'center',
        marginBottom: 20,
        color: theme.colors.placeholder,
    },
    description: {
        fontSize: 18,
        lineHeight: 28,
        fontFamily: theme.fonts.bodyMedium.fontFamily,
        textAlign: 'left',
        color: theme.colors.text,
    },
});

export default ModalDetailEvent;