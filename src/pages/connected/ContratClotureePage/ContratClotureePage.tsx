import { Image, ScrollView, StyleSheet, Text, View, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Button, useTheme, Card, Divider, Dialog, Portal } from 'react-native-paper';
import { Body as ContratEntity } from '../ConfigurerContratPage/classes';
import { getDetailConfiguredContrat, removeConfiguredContrat } from '../../../utils/contrat';
import LoadingScreen from '../../../components/loading/LoadingScreens';
import { NavigationContext } from '@react-navigation/native';
import { connectedUserContext } from '../../../../App';

const ContratClotureePage = () => {
    const theme = useTheme()
    const navigation = useContext(NavigationContext)

    const [contrat, setContrat] = useState<ContratEntity>(new ContratEntity())
    const [isLoading, setIsLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const { connectedUser } = useContext(connectedUserContext)

    useEffect(function () {
        (async () => {
            setIsLoading(true);
            try {
                const c = await getDetailConfiguredContrat()
                setContrat(c);
            } catch (error) {
                Alert.alert('Erreur', 'Impossible de charger les détails du contrat');
            } finally {
                setIsLoading(false)
            }
        })();
    }, [])

    const onClickDetailContrat = function () {
        navigation?.navigate("DetailContratReadOnly", {
            contrat: contrat
        });
    }

    const handleRemoveContrat = async () => {
        setShowDialog(false);
        setIsLoading(true);
        try {
            await removeConfiguredContrat();
            navigation?.reset({
                index: 0,
                routes: [{
                    name: (connectedUser.profile === "PAJE_EMPLOYEUR"
                        ? "ElementsAMunirPage"
                        : "SelectParentpage")
                }]
            });
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de supprimer le contrat');
        } finally {
            setIsLoading(false);
        }
    };

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
            textAlign: 'center',
        },
        buttonContainer: {
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: theme.colors.outline,
            gap: 12,
        },
        image: {
            width: 220,
            height: 220,
            marginBottom: 20,
        },
        center: {
            alignItems: 'center',
        },
        card: {
            marginVertical: 16,
            padding: 16,
            backgroundColor: theme.colors.surfaceVariant,
        },
        dateText: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.primary,
            textAlign: 'center',
            marginTop: 8,
        },
        dialogContent: {
            color: "black"
        },
        dialogActions: {
            padding: 16,
            justifyContent: 'flex-end',
            gap: 8,
        }
    });

    if (isLoading) {
        return <LoadingScreen />
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                <View style={styles.center}>
                    <Image
                        source={{ uri: 'asset:/illustrations/resiliation.png' }}
                        style={styles.image}
                    />
                </View>

                <Card style={styles.card}>
                    <Text style={[styles.explanationText, theme.fonts.bodyLarge]}>
                        La date de fin de ce contrat est arrivée
                    </Text>
                    <Text style={[styles.dateText, theme.fonts.titleLarge]}>
                        {new Date(contrat.dateFin).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </Text>
                </Card>
            </ScrollView>

            <Divider />

            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    onPress={onClickDetailContrat}
                    icon="file-document-outline"
                >
                    Détail du contrat
                </Button>

                <Button
                    mode="contained"
                    onPress={() => setShowDialog(true)}
                    buttonColor={theme.colors.error}
                    icon="delete-outline"
                >
                    Délier le contrat
                </Button>
            </View>

            <Portal>
                <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
                    <Dialog.Title>Confirmation</Dialog.Title>
                    <Dialog.Content>
                        <Text style={[styles.dialogContent, theme.fonts.bodyMedium]}>
                            Êtes-vous sûr de vouloir délier ce contrat ?
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions style={styles.dialogActions}>
                        <Button onPress={() => setShowDialog(false)}>
                            Annuler
                        </Button>
                        <Button
                            onPress={handleRemoveContrat}
                            textColor={theme.colors.error}
                        >
                            Délier
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    )
}

export default ContratClotureePage