import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { Enfant } from "../classes";

const RenderStep1 = ({setStep, setSelectedEnfant}:{setStep:any, setSelectedEnfant:any}) => {
    const [Enfantren, setEnfantren] = useState<Enfant[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchEnfants = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const val: Enfant[] = [
            { nom: 'Kilian',prenom:'Dubois', dateNaissance: '13 décembre 2022' },
            { nom: 'Julie',prenom:'Dubois', dateNaissance: '28 août 2021' },
        ];
        setEnfantren(val);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchEnfants();
    }, []);
        
    if (isLoading) {
        return (
            <View style={{...styles.main, justifyContent: "center"}}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Chargement en cours...</Text>
            </View>
        );
    }

    const handleChildSelection = (child: Enfant) => {
        setSelectedEnfant(child);
        setStep(2);
    };

    return (
        <View style={styles.main}>
            <Text style={styles.title}>Choix de l'enfant</Text>
            <Text style={styles.subtitle}>Pour quel enfant gardé par ... souhaitez-vous configurer un contrat ?</Text>
            <ScrollView style={styles.listContainer}>
                {Enfantren.map((enfant, index) => (
                    <TouchableOpacity 
                        style={styles.EnfantItem} 
                        key={index} 
                        onPress={() => {handleChildSelection(enfant)}}
                    >
                        <Text style={styles.EnfantName}>{enfant.nom+' '+enfant.prenom}</Text>
                        <Text style={styles.EnfantDob}>{enfant.dateNaissance}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <Text style={styles.helpText}>
                Vous ne trouvez pas votre enfant dans la liste ? Contactez l'admin qu'il procède à son enregistrement.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
    },
    listContainer:{
        maxHeight: '80%',
        width: '100%', // ensure the scroll view takes the full width
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: "black"
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 16,
        color: "black",
        textAlign: "center",
        paddingHorizontal: 20,
    },
    EnfantItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: "90%",
        alignSelf: "center"
    },
    EnfantName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "black"
    },
    EnfantDob: {
        fontSize: 14,
        color: '#666',
    },
    helpText: {
        marginTop: 16,
        fontSize: 14,
        color: '#666',
        textAlign: "center",
        paddingHorizontal: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "black"
    }
});

export default RenderStep1;