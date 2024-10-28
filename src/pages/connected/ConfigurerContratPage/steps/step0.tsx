import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { Assmat } from "../classes";
import { getAssociatedAssmatByPajeIdParent } from "../../../../utils/user";
import { connectedUserContext } from "../../../../../App";
import User from "../../../../models/user";
import LoadingScreen from "../../../../components/loading/LoadingScreens";

const RenderStep0 = ({ setStep, setSelectedssmat }: { setStep: any, setSelectedssmat: any }) => {
    const [Assmatren, setAssmatren] = useState<Assmat[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { connectedUser }: { connectedUser: User } = useContext(connectedUserContext);

    const fetchAssmats = async () => {
        setIsLoading(true);
        if (connectedUser.pajeId) {
            const val: Assmat[] = await getAssociatedAssmatByPajeIdParent(connectedUser.pajeId);
            setAssmatren(val);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAssmats();
    }, []);

    const handleChildSelection = async (child: Assmat) => {
        setSelectedssmat(child);
        setStep(1);
    };

    if (isLoading) {
        return <LoadingScreen></LoadingScreen>
    }

    return (
        <View style={styles.main}>
            <Text style={styles.title}>Choix de l'assistante maternelle</Text>
            <Text style={styles.subtitle}>Pour quelle assistante maternelle, rattachée à votre compte voulez-vous configurer un contrat</Text>

            <ScrollView style={styles.listContainer}>
                {Assmatren.map((assmat, index) => (
                    <TouchableOpacity
                        style={styles.AssmatItem}
                        key={index}
                        onPress={() => { handleChildSelection(assmat) }}
                    >
                        <Text style={styles.AssmatName}>{assmat.nom + ' ' + assmat.prenom}</Text>
                        <Text style={styles.AssmatDob}>{assmat.pajeId}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Text style={styles.helpText}>
                Vous ne trouvez pas votre assistante maternelle dans la liste ? Contactez l'admin qu'il procède à son enregistrement.
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
    listContainer: {
        maxHeight: '80%',
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: "black",
        fontFamily: "Roboto-Bold",
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 16,
        color: "black",
        textAlign: "center",
        paddingHorizontal: 20,
        fontFamily: "Roboto-Regular",
    },
    AssmatItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: "90%",
        alignSelf: "center"
    },
    AssmatName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "black",
        fontFamily: "Roboto-Bold",
    },
    AssmatDob: {
        fontSize: 14,
        color: '#666',
        fontFamily: "Roboto-Regular",
    },
    helpText: {
        marginTop: 16,
        fontSize: 14,
        color: '#666',
        textAlign: "center",
        paddingHorizontal: 20,
        fontFamily: "Roboto-Regular",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "black",
        fontFamily: "Roboto-Regular",
    }
});

export default RenderStep0;
