import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView } from 'react-native';
import { Modal, Portal, IconButton, useTheme } from 'react-native-paper';
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
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles(theme).modalContainer}>
                <SafeAreaView style={styles(theme).safeArea}>
                    <View style={styles(theme).header}>
                        <IconButton
                            icon={() => (
                                <MaterialCommunityIcons name="close-circle" size={24} color={theme.colors.outline} />
                            )}
                            onPress={onDismiss}
                            style={styles(theme).closeButton}
                        />
                    </View>
                    <ScrollView contentContainerStyle={styles(theme).scrollContent}>
                        <Text style={styles(theme).title}>{getTypeEventByText(event.typeEvenement)?.titre}</Text>
                        <Text style={styles(theme).date}>{getDescriptionByEvent(event)}</Text>
                        <Text style={styles(theme).description}>{getTypeEventByText(event.typeEvenement)?.description}</Text>
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        </Portal>
    );
};

const styles = (theme:any) => StyleSheet.create({
    modalContainer: {
        backgroundColor: theme.colors.background, // Utiliser la couleur de fond du thème
        margin: 20,
        borderRadius: 16,
        paddingVertical: 24,
        shadowColor: theme.colors.shadow, // Couleur de l'ombre
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        maxHeight: '90%',
        height: '45%',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    closeButton: {
        margin: -8,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 24,
        fontFamily: theme.fonts.titleMedium.fontFamily, // Appliquer la police pour le titre
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 12,
        color: theme.colors.text, // Utiliser la couleur du texte du thème
    },
    date: {
        fontSize: 16,
        fontFamily: theme.fonts.bodyMedium.fontFamily, // Appliquer la police pour la date
        textAlign: 'center',
        marginBottom: 20,
        color: theme.colors.placeholder, // Couleur pour la date
    },
    description: {
        fontSize: 18,
        lineHeight: 28,
        fontFamily: theme.fonts.bodyMedium.fontFamily, // Appliquer la police pour la description
        textAlign: 'left',
        color: theme.colors.text, // Couleur pour la description
    },
});

export default ModalDetailEvent;
