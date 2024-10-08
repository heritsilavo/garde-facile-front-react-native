import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
    useTheme,
    Appbar,
    Text,
    Button,
    Portal,
    Modal,
    Surface,
    Dialog,
    Paragraph
} from 'react-native-paper';
import { Calendar, DateData } from 'react-native-calendars';
import { connectedUserContext } from '../../../../App';
import { NavigationContext } from '@react-navigation/native';
import { Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import fonts from 'react-native-paper/lib/typescript/styles/fonts';
import LoadingScreen from '../../../components/loading/LoadingScreens';
import { Body as ContratType } from '../ConfigurerContratPage/classes';
import { getDetailConfiguredContrat, modifierContrat } from '../../../utils/contrat';
import Toast from 'react-native-toast-message';
import { tr } from 'react-native-paper-dates';

const ResiliationContratPage = () => {
    const theme = useTheme();
    const navigation = useContext(NavigationContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const { connectedUser } = useContext(connectedUserContext);
    const [showCofirmModal, setShowConfirmModal] = useState(false);
    const [contrat, setContrat] = useState<ContratType>(new ContratType());
    const [isLoading, setIsLoading] = useState(false);

    const handleDateSelect = (date: DateData) => {
        setSelectedDate(date.dateString);
        setModalVisible(false);
    };

    const handleCloreContrat = async () => {
        try {
            setShowConfirmModal(false);
            setIsLoading(true)
            const updatedContrat = { ...contrat, dateFin: selectedDate }
            await modifierContrat("MODIF_DATE_FIN", updatedContrat);
            setContrat(updatedContrat);
            setIsLoading(false)
            Toast.show({
                type: 'success',
                text1: 'Modification réussie',
                visibilityTime: 2000,
                autoHide: true,
            });
            navigation?.navigate("ContratProfile");
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Erreur lors de la modification de date',
                visibilityTime: 2000,
                autoHide: true,
            });
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true)
            const contrat: ContratType = await getDetailConfiguredContrat();
            setContrat(contrat);
            setIsLoading(false);
        }
        loadData();
    }, [])


    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        content: {
            padding: 16,
            flex: 1,
        },
        explanationText: {
            fontSize: 16,
            color: theme.colors.onSurface,
            marginBottom: 20,
            lineHeight: 24,
        },
        buttonContainer: {
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: theme.colors.outline,
        },
        modal: {
            backgroundColor: theme.colors.surface,
            padding: 20,
            margin: 20,
            borderRadius: 8,
        },
        calendar: {
            borderRadius: 8,
        },
        image: {
            width: 220,
            height: 220,
            marginBottom: 20,
        },
        center: {
            alignItems: 'center',
        },
        dateSelectionButton: {
            marginVertical: 16,
        },
        selectedDateContainer: {
            backgroundColor: theme.colors.surfaceVariant,
            padding: 16,
            borderRadius: 8,
            marginTop: 16,
            marginBottom: 30
        }
    });

    const isParentEmployeur = connectedUser.profile === "PAJE_EMPLOYEUR";

    if (isLoading) {
        return <LoadingScreen></LoadingScreen>
    }

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation?.goBack()} />
                <Appbar.Content title="Résiliation du contrat" />
            </Appbar.Header>

            <ScrollView style={styles.content}>
                <View style={styles.center}>
                    <Image
                        source={{ uri: 'asset:/illustrations/resiliation.png' }}
                        style={styles.image}
                    />
                </View>

                <Text style={[styles.explanationText, theme.fonts.bodyMedium]}>
                    Veuillez noter que seul le parent employeur est autorisé à effectuer la résiliation du contrat.

                </Text>

                <Button
                    mode="outlined"
                    icon="calendar"
                    onPress={() => setModalVisible(true)}
                    disabled={!isParentEmployeur}
                    style={styles.dateSelectionButton}
                >
                    {selectedDate ? 'Modifier la date de fin' : 'Sélectionner la date de fin'}
                </Button>

                {selectedDate && (
                    <Surface style={styles.selectedDateContainer}>
                        <Text style={[theme.fonts.titleMedium, { marginBottom: 4 }]}>
                            Date de fin sélectionnée
                        </Text>
                        <Text style={theme.fonts.bodyLarge}>
                            {new Date(selectedDate).toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Text>
                    </Surface>
                )}
            </ScrollView>

            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    onPress={() => { setShowConfirmModal(true) }}
                    disabled={!isParentEmployeur || !selectedDate}
                >
                    Clore le contrat
                </Button>
            </View>

            <Portal>
                <Dialog visible={showCofirmModal} onDismiss={() => { setShowConfirmModal(false) }}>
                    <Dialog.Title> Changer la date de cmoture du contrat </Dialog.Title>
                    <Dialog.Content>
                        <Paragraph style={theme.fonts.bodyMedium}>Êtes-vous sûr de vouloir changer la date de fin du contrat ?</Paragraph>

                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => { setShowConfirmModal(false) }}>Annuler</Button>
                        <Button onPress={handleCloreContrat}>Confirmer</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <Portal>
                <Modal
                    visible={modalVisible}
                    onDismiss={() => setModalVisible(false)}
                    contentContainerStyle={styles.modal}
                >
                    <Calendar
                        onDayPress={handleDateSelect}
                        minDate={contrat.dateDebut}
                        markedDates={{
                            [selectedDate]: { selected: true, selectedColor: theme.colors.primary }
                        }}
                        theme={{
                            todayTextColor: theme.colors.primary,
                            selectedDayBackgroundColor: theme.colors.primary,
                            arrowColor: theme.colors.primary,
                            textDayFontFamily: theme.fonts.bodyMedium.fontFamily,
                            textMonthFontFamily: theme.fonts.titleMedium.fontFamily,
                            textDayHeaderFontFamily: theme.fonts.bodyMedium.fontFamily,
                        }}
                    />
                </Modal>
            </Portal>
        </View>
    );
};

export default ResiliationContratPage;