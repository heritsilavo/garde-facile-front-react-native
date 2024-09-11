import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { ConfigContratContext } from "../ConfigurerContratPage";
import RenderStep6 from "./step6";

interface RenderStep7Props {
    setStep: (step: number) => void;
    setCodePostateAndJourFerie: (codePostale:string,jourFerie:string[]) => void;
}

const RenderStep7: React.FC<RenderStep7Props> = ({ setStep, setCodePostateAndJourFerie }) => {

    const onclickContinue = function() {
        
    }
    
    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Jours Fériées</Text>
                <Text style={styles.subtitle}>
                    Ajouter les jours feriées où l'enfant sera gardé
                </Text>
                <Text style={styles.title2}>Jours fériées travaillées</Text>
            </ScrollView>
    
            <TouchableOpacity>
                <Text style={styles.buttonText}>Continuer</Text>
            </TouchableOpacity>

        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
      },
      scrollView: {
        flex: 1,
      },
      scrollContent: {
        paddingBottom: 80, // Space for the button
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: "black",
      },
      title2: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: "black",
      },
      subtitle: {
        fontSize: 16,
        marginBottom: 10,
        color: "black",
      },
      switchContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'center',
      },
      button: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        alignItems: 'center',
        borderRadius: 8,
      },
      buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
      },
      label: {
        fontSize: 16,
        color: 'black',
      },
      helpButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: '#007AFF',
        borderRadius: 20,
      },
      helpButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
      },
      helpModalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      helpModalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        width: '80%',
      },
      helpModalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color:'black'
      },
      helpModalText: {
        fontSize: 16,
        marginBottom: 20,
        color:'black'
      },
      helpModalCloseButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
      },
      helpModalCloseButtonText: {
        color: '#fff',
        fontSize: 16,
      },
    });
    
    export default RenderStep7;