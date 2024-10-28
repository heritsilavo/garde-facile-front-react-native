import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'

import LoadingScreen from '../../../components/loading/LoadingScreens'
import { NavigationContext, useFocusEffect } from '@react-navigation/native'
import { getHistoriqueDeclaForContrat } from '../../../utils/declaration'
import { DeclarationForContrat } from '../../../models/declaration'
import { Appbar, Text, useTheme } from 'react-native-paper'
import { getConfiguredContrat } from '../../../utils/contrat'

const HistoriqueDeclarationList = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [historique, setHistorique] = useState<DeclarationForContrat[]>([]);
    const { colors, fonts } = useTheme();
    const navigation = useContext(NavigationContext)

    const getDatas = useCallback(async () => {
        setIsLoading(true)
        const contratId = await getConfiguredContrat();
        if (contratId) {
            var hist = await getHistoriqueDeclaForContrat(contratId);
            console.log("HISTORIQUE: ", JSON.stringify(hist));

            setHistorique(hist);
            setIsLoading(false)
        } else navigation?.navigate('Home');
    }, [navigation])

    const getMoisAnnee = (declaration: DeclarationForContrat) => {
        const date = new Date();
        var mois = date.toLocaleString('fr-FR', { month: 'long' });
        mois = mois.charAt(0).toUpperCase() + mois.slice(1);
        return `${mois} ${date.getFullYear()}`;
    }

    useFocusEffect(
        useCallback(() => {
            getDatas()
        }, [getDatas])
    )

    if (isLoading) {
        return <LoadingScreen></LoadingScreen>
    }

    return (
        <View style={{ flex: 1 }}>
            <Appbar>
                <Appbar.BackAction onPress={navigation?.goBack}></Appbar.BackAction>
                <Appbar.Content titleStyle={fonts.titleMedium} title="Historique des déclarations"></Appbar.Content>
            </Appbar>
            <ScrollView style={{ flex: 1 }}>
                {/* <Text style={[fonts.titleLarge, styles.title]}>Historique des déclarations</Text> */}
                {historique.map((declaration, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.declarationCard}
                        onPress={() => {
                            // Navigation vers les détails de la déclaration
                            navigation?.navigate('DetailDeclaration', { decla: declaration, title: getMoisAnnee(declaration) })
                        }}
                    >
                        <Text style={[styles.moisAnnee, fonts.titleMedium]}>{getMoisAnnee(declaration)}</Text>
                        <Text style={[styles.enfantName, fonts.bodyMedium]}>
                            {declaration.enfant.prenom} {declaration.enfant.nom}
                        </Text>
                        <Text style={[styles.montant, fonts.bodyMedium]}>
                            Salaire net : {declaration.salaires.net}€
                        </Text>
                        <Text style={[styles.heures, fonts.bodySmall]}>
                            {declaration.jours.activite} jours d'activité
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <Text style={[fonts.labelSmall, styles.info]}>Le déclaration qui sont déja validées</Text>
        </View>
    )
}

export default HistoriqueDeclarationList

const styles = StyleSheet.create({
    info:{
        textAlign:'center',
        marginBottom:10,
        opacity:0.6
    },
    title: {
        textAlign: 'center',
        marginTop: 15,
        marginBottom: 20
    },
    declarationCard: {
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginVertical: 8,
        padding: 16,
        borderRadius: 8,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    moisAnnee: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333'
    },
    enfantName: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4
    },
    montant: {
        fontSize: 16,
        color: '#2E7D32',
        marginBottom: 4
    },
    heures: {
        fontSize: 14,
        color: '#666'
    }
})