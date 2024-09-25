import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { UserContextType, connectedUserContext } from "../../../../App";
import { Parent } from "../ConfigurerContratPage/classes";
import { getAssociatedParentByPajeIdSalarie, logout } from "../../../utils/user";
import { Button } from "react-native-paper";
import { NavigationContext } from "@react-navigation/native";
import { getContratByPajeIdParentAndSalarie, saveConfiguredContrat } from "../../../utils/contrat";
import { Body as ContratEntity } from "../ConfigurerContratPage/classes";

const SelectParentpage = () => {

    const [Parents, setParents] = useState<Parent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { connectedUser, setConnectedUser } = useContext<UserContextType>(connectedUserContext);
    const navigation = useContext(NavigationContext);


    const fetchParents = async () => {
        setIsLoading(true);
        if (connectedUser.pajeId) {
            const val: Parent[] = await getAssociatedParentByPajeIdSalarie(connectedUser.pajeId)
            setParents(val);
            setIsLoading(false);
        }
        setIsLoading(false)
    };

    useEffect(() => {
        fetchParents();
    }, []);

    const handleChildSelection =async (parent: Parent) => {
        setIsLoading(true);
        const contrat:ContratEntity = await getContratByPajeIdParentAndSalarie(parent.pajeId,connectedUser.pajeId);
        let saved =  await saveConfiguredContrat(contrat.id)
        if (saved) {
            setIsLoading(false);
            navigation?.navigate('Home');
        }
        setIsLoading(false);
    };

    const handleLogOut =async function () {
        setIsLoading(true)
        await logout()
        navigation?.navigate("Login")
    }

    if (isLoading) {
        return (
            <View style={{ ...styles.main, justifyContent: "center" }}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Chargement en cours...</Text>
            </View>
        );
    }

    return (
        <View style={styles.main}>
            <Text style={styles.title}>Choix de l'employeur</Text>
            <Text style={styles.subtitle}>Pour quelle parent employeur, ratachée a votre compte voulez-vous configurer un contrat</Text>
            <ScrollView style={styles.listContainer}>
                {Parents.map((Parent, index) => (
                    <TouchableOpacity
                        style={styles.ParentItem}
                        key={index}
                        onPress={() => { handleChildSelection(Parent) }}
                    >
                        <Text style={styles.ParentName}>{Parent.nom + ' ' + Parent.prenom}</Text>
                        <Text style={styles.ParentDob}>{Parent.pajeId}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <Text style={styles.helpText}>
                Vous ne trouvez pas votre assistante maternelle dans la liste ? Contactez l'admin qu'il procède à son enregistrement.
            </Text>
            <Button
                mode="contained"
                onPress={handleLogOut}
                labelStyle={styles.label}
                style={styles.button}
                contentStyle={styles.content}
            >
                Se deconnecter
            </Button>
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
    listContainer: {
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
    ParentItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: "90%",
        alignSelf: "center"
    },
    ParentName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "black"
    },
    ParentDob: {
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
    },
    button: {
        backgroundColor: '#007AFF',
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 30,
        marginVertical:5,
        width:'90%'
    },
    content: {
        height: 50,
    },
    label: {
        fontSize: 18,
        color: 'white',
    },
});

export default SelectParentpage;