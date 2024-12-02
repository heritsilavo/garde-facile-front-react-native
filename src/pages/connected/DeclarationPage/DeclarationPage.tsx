import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
    Text,
    Button,
    Surface,
    useTheme,
    Portal,
    Dialog,
    Appbar,
    IconButton,
} from 'react-native-paper';
import { NavigationContext } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LoadingScreen from '../../../components/loading/LoadingScreens';
import { connectedUserContext } from '../../../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DeclarationForContrat } from '../../../models/declaration';
import { convertToDeclarationType, saveDeclaration } from '../../../utils/declaration';
import { DeclarationType } from '../../../models/declaration_type';
import { generateGeneralId } from '../../../utils/generateId';
import { Body as Contrat } from '../ConfigurerContratPage/classes';
import { getDetailConfiguredContrat } from '../../../utils/contrat';
import { Mois } from '../../../utils/date';

interface DialogState {
    visible: boolean;
    title: string;
    content: string;
    onConfirm?: ()=>any
}

type RootStackParamList = {
    ValidDeclarationPage: {
        declaForContrat: DeclarationForContrat,
        mois: Mois
    };
};
type DetailContratReadOnlyProps = NativeStackScreenProps<RootStackParamList, 'ValidDeclarationPage'>;

const ValidDeclarationPage: React.FC<DetailContratReadOnlyProps> = ({ route }) => {
    const theme = useTheme();
    const navigation = useContext(NavigationContext);
    const insets = useSafeAreaInsets();
    const { connectedUser } = useContext(connectedUserContext);
    const { declaForContrat, mois } = route.params;

    const [dialogState, setDialogState] = useState<DialogState>({
        visible: false,
        title: 'Informations',
        content: 'Contenu d\'aide et informations supplémentaires...',
        onConfirm: () => {}
    });

    const [isValidating, setIsValidating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [declaType, setDeclaType] = useState<DeclarationType>();
    const [isDateValid, setisDateValid] = useState(false);

    const showDialog = (title: string, content: string): void => {
        setDialogState({ visible: true, title, content });
    };

    const showConfirmDialod = (title: string, content: string, onConfirm:()=>any): void => {
        setDialogState({ visible: true, title, content, onConfirm:onConfirm });
    }

    const hideDialog = (): void => {
        setDialogState(prev => ({ ...prev, visible: false }));
    };

    const handleInfoPress = (): void => {
        showDialog(
            'Informations complémentaires',
            'La validation de votre déclaration est une étape importante qui finalise le processus de déclaration mensuelle. ' +
            'Une fois validée, vous ne pourrez plus modifier les informations pour ce mois. ' +
            'Nous vous conseillons d\'attendre le dernier moment possible pour valider, ' +
            'afin de prendre en compte d\'éventuels changements de dernière minute.'
        );
    };

    const onValidate = async () => {
        if (declaType) {
            hideDialog();
            setIsValidating(true);
            try {
                await saveDeclaration(declaType)
                navigation?.navigate('CurrentMonthDeclaration');
            } catch (error:any) {
                const message = error?.response?.data?.message || error?.message || error.toString();
                const description = error?.response?.data?.description || "";
                showDialog(message || 'Erreur',description || 'Une erreur est survenue lors de la validation.');
            } finally {
                setIsValidating(false);
            }
        }
    };

    const fetchDatas = async () => {
        setIsLoading(true);
        const contrat: Contrat = await getDetailConfiguredContrat()
        var data: DeclarationType = convertToDeclarationType(declaForContrat);
        data.uuid = generateGeneralId();
        data.numeroPajeEmployeur = contrat.numeroPajeEmployeur;
        data.numeroPajeSalarie = contrat.numeroPajeSalarie;
        data.contrats[0].methodeRemunerationCongesPayes = contrat.remunerationCongesPayes.mode;
        setDeclaType(data);
        setIsLoading(false);
    };

    const verifDate = ()=>{
        var valid = false;
        const le25DuMois = new Date(`${mois.year}-${mois.monthIndex}-${25}`)
        console.log("le25DuMois: ", le25DuMois);
        
        const le5DuMoisSuivant = new Date(`${mois.year}-${mois.monthIndex+1}-${6}`)
        console.log("le5DuMoisSuivant: ", le5DuMoisSuivant);
        

        const today = new Date();
        valid = (le25DuMois.getTime()<=today.getTime() && today.getTime()<=le5DuMoisSuivant.getTime());
        console.log("DATE VALIDATION IS VALID?: ", valid);
        setisDateValid(valid);
        return valid;
    }

    useEffect(() => {
        verifDate()
        fetchDatas();
    }, []);

    if (isLoading) return <LoadingScreen />;

    const isEmployer = connectedUser.profile === "PAJE_EMPLOYEUR";
    const canValidate = isEmployer && !isValidating && isDateValid;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction onPress={() => navigation?.goBack()} />
                <Appbar.Content title="" />
                <IconButton
                    icon="help-circle-outline"
                    size={24}
                    onPress={() => showDialog(
                        'Aide',
                        'La validation de la déclaration est la dernière étape du processus mensuel. ' +
                        'Vérifiez bien toutes les informations avant de valider.'
                    )}
                />
            </Appbar.Header>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    <View style={styles.periodBox}>
                        <Text style={[styles.periodTitle, theme.fonts.titleLarge]}>
                            Période de déclaration
                        </Text>
                        <Text style={[styles.periodText, theme.fonts.bodyMedium]}>
                            Vous pouvez valider votre déclaration mensuelle dans la période autorisée.
                        </Text>
                        {!isEmployer && (
                            <Text style={[styles.periodText, theme.fonts.bodyMedium]}>
                                Seuls les parents employeurs peuvent valider la déclaration
                            </Text>
                        )}
                    </View>

                    <Surface style={styles.dateBox} elevation={2}>
                        <IconButton
                            icon="calendar"
                            size={24}
                            style={styles.calendarIcon}
                        />
                        <Text style={[styles.dateText, theme.fonts.bodyMedium]}>
                            Du 25 du mois en cours au 05 du mois suivant
                        </Text>
                    </Surface>

                    <Surface style={styles.warningBox} elevation={2}>
                        <View style={styles.warningHeader}>
                            <IconButton
                                icon="alert-circle"
                                size={24}
                                iconColor="#DC2626"
                                style={styles.warningIcon}
                            />
                            <Text style={[styles.warningTitle, theme.fonts.titleMedium]}>
                                Important
                            </Text>
                        </View>
                        <Text style={[styles.warningContent, theme.fonts.bodyMedium]}>
                            Attention : la validation est définitive. Une fois validée,
                            vous ne pourrez plus modifier votre déclaration pour ce mois.
                        </Text>
                        <Button
                            mode="text"
                            onPress={handleInfoPress}
                            style={styles.infoButton}
                        >
                            En savoir plus
                        </Button>
                    </Surface>
                </View>

                <Button
                    mode="contained"
                    style={[
                        styles.validateButton,
                        !canValidate && styles.validateButtonDisabled
                    ]}
                    contentStyle={styles.validateButtonContent}
                    onPress={() => {showConfirmDialod("Validation", "Voulez-vous variment valider la declaration ?", onValidate)}}
                    loading={isValidating}
                    disabled={!canValidate}
                >
                    {isValidating ? 'Validation en cours...' : 'Valider ma déclaration'}
                </Button>
            </ScrollView>

            <Portal>
                <Dialog visible={dialogState.visible} onDismiss={hideDialog}>
                    <Dialog.Title>{dialogState.title}</Dialog.Title>
                    <Dialog.Content>
                        <Text style={[styles.dialogContent, theme.fonts.bodyMedium]}>
                            {dialogState.content}
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button mode="text" onPress={hideDialog}>
                            Fermer
                        </Button>
                        {!!dialogState.onConfirm && <Button mode="text" onPress={dialogState.onConfirm}>
                            Ok
                        </Button>}
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FB',
    },
    header: {
        backgroundColor: 'white',
        elevation: 2,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 32,
    },
    periodBox: {
        marginBottom: 24,
    },
    periodTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1A2138',
        marginBottom: 16,
        letterSpacing: -0.5,
    },
    periodText: {
        fontSize: 16,
        color: '#4B5563',
        lineHeight: 24,
        marginTop: 8,
    },
    dateBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EEF2FF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
    },
    calendarIcon: {
        margin: 0,
        marginRight: 8,
    },
    dateText: {
        flex: 1,
        fontSize: 16,
        color: '#2563EB',
    },
    warningBox: {
        backgroundColor: '#FEF2F2',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    warningHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    warningIcon: {
        margin: 0,
        marginRight: 4,
    },
    warningTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#DC2626',
    },
    warningContent: {
        fontSize: 15,
        color: '#7F1D1D',
        lineHeight: 22,
    },
    infoButton: {
        marginTop: 8,
        alignSelf: 'flex-start',
    },
    validateButton: {
        marginTop: 20,
        marginBottom: 32,
        marginHorizontal: 32,
        height: 56,
        justifyContent: 'center',
        borderRadius: 16,
        backgroundColor: '#007AFF',
    },
    validateButtonDisabled: {
        backgroundColor: '#93C5FD',
    },
    validateButtonContent: {
        height: 56,
    },
    dialogContent: {
        lineHeight: 22,
    },
});

export default ValidDeclarationPage;
