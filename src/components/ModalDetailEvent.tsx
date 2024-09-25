import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView } from 'react-native';
import { Modal, Portal, IconButton } from 'react-native-paper';
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
    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.header}>
                        <IconButton
                            icon={() => (
                                <MaterialCommunityIcons name="close-circle" size={24} color="#2c3e50" />
                            )}
                            onPress={onDismiss}
                            style={styles.closeButton}
                        />
                    </View>
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <Text style={styles.title}>{getTypeEventByText(event.typeEvenement)?.titre}</Text>
                        <Text style={styles.date}>{getDescriptionByEvent(event)}</Text>
                        <Text style={styles.description}>{getTypeEventByText(event.typeEvenement)?.description}</Text>
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 16,
        paddingVertical: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        maxHeight: '90%',
        height:'45%',
        
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
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 12,
        color: '#2c3e50',
    },
    date: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#7f8c8d',
    },
    description: {
        fontSize: 18,
        lineHeight: 28,
        textAlign: 'left',
        color: '#34495e',
    },
});

export default ModalDetailEvent;