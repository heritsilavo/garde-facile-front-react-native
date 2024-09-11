import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Switch, TextInput, Button, TouchableOpacity, StyleSheet, NativeEventEmitter, NativeModules } from 'react-native';
import { Planning, TrancheHoraire } from '../classes';
import { Chip } from 'react-native-paper';
import TimePicker from './TimePicker';

export interface JoursPlanningItemPropsType{
    index: number,
    text: string,
    planning: Planning
}

const hourToInt = function (hour:string):number {
    // Set the constant date (September 9, 2024)
    const constantDate = new Date('2024-09-09T00:00:00Z');
    
    // Split the hour string into hours and minutes
    const [hours, minutes] = hour.split(':').map(Number);
    
    // Create a new date object with the constant date and the parsed time
    const dateTime = new Date(constantDate.getFullYear(), constantDate.getMonth(), constantDate.getDate(), hours, minutes);
    
    // Return the Unix timestamp 
    
    return dateTime.getTime();
}

const intToHour = function (timestamp: number): string {
    
    const dateTime = new Date(timestamp);
    
    // Extract hours and minutes from the date
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    
    // Format hours and minutes to ensure two digits
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    
    // Return the formatted time as 'HH:mm'
    return `${formattedHours}:${formattedMinutes}`;
};

const JoursPlanningItem = ({ jour,weekPlanning,setWeekPlanning }:{jour:JoursPlanningItemPropsType,weekPlanning:Planning[],setWeekPlanning:any}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [avecCoupure, setAvecCoupure] = useState(false);
    const [defini,setDefini]=useState<boolean>(false)

    const [tranche1Debut,setTranche1Debut] = useState<string>()
    const [tranche1Fin,setTranche1Fin] = useState<string>()
    const [tranche2Debut,setTranche2Debut] = useState<string>()
    const [tranche2Fin,setTranche2Fin] = useState<string>()

    //Tranche1
    const [tranche1,setTranche1]=useState<TrancheHoraire>();
    useEffect(function() {
        let tmp:TrancheHoraire = {heureDebut:hourToInt(tranche1Debut || ''),heureFin:hourToInt(tranche1Fin || '')}
        setTranche1(tmp);
    },[tranche1Debut,tranche1Fin])

    //Tranche2
    const [tranche2,setTranche2]=useState<TrancheHoraire>();
    useEffect(function() {
        let tmp:TrancheHoraire = {heureDebut:hourToInt(tranche2Debut || ''),heureFin:hourToInt(tranche2Fin || '')}
        setTranche2(tmp);

        
    },[tranche2Debut,tranche2Fin])

    //Planning
    const [planningDuJour,setPlanningDuJour] = useState<Planning>();
    const myEventEmitter = new NativeEventEmitter(NativeModules.RCTDeviceInfo);

    const changeOnWeekPlanning= (planning: Planning) => {
        setWeekPlanning((old:Planning[]) => {
            let tmpWeekPlann = [...old]
            let index = -1;
            
            old.forEach((P,i) => {
                if (P?.indexJour==planning.indexJour) {
                    index = planning.indexJour
                }
            });

            if (index==-1) tmpWeekPlann = [...old,planning]
            else {
                tmpWeekPlann[index] = planning
            }

            return tmpWeekPlann
        })
    }

    //Event Listener
    useEffect(() => {
        const listener = myEventEmitter.addListener('appliquerAuxAutresJours', ({emmiterIndex,planning}:{emmiterIndex:number,planning:Planning}) => {
            if (emmiterIndex!=jour.index) {//Pour les autres jours
                

                const withCoupure = (!!planning.trancheHoraire2.heureDebut && !!planning.trancheHoraire2.heureFin)
                
                const t1Debut = intToHour(planning.trancheHoraire1.heureDebut);
                const t1Fin = intToHour(planning.trancheHoraire1.heureFin);
                setTranche1Debut(t1Debut)
                setTranche1Fin(t1Fin)

                if (withCoupure) {
                    const t2Debut = intToHour(planning.trancheHoraire2.heureDebut);
                    const t2Fin = intToHour(planning.trancheHoraire2.heureFin);
                    setTranche2Debut(t2Debut)
                    setTranche2Fin(t2Fin)
                    setAvecCoupure(true);
                }else{
                    setAvecCoupure(false)
                }
            }
        });
      
        // Nettoyer l'écouteur lors du démontage du composant
        return () => {
          listener.remove();
        };
    }, []);
    
    useEffect(function() {
        let tmp:boolean =!!(tranche1?.heureDebut && tranche1?.heureFin);
        if (avecCoupure) {
            tmp = tmp && !!(tranche2?.heureDebut && tranche2?.heureFin);
        }
        setDefini(tmp);
        if (tmp && tranche1 && tranche2) { //Si planning du jour defini
            let planning:Planning = new Planning()
            planning.indexJour = jour.index
            planning.trancheHoraire1 = tranche1
            planning.trancheHoraire2 = tranche2

            setPlanningDuJour(planning)
            changeOnWeekPlanning(planning)
        }
    },[tranche1,tranche2,avecCoupure])


    function toggleExpanded() {
        setIsExpanded(!isExpanded);
    }

    //Handle Avec coupure
    useEffect(function () {
        if (!avecCoupure) {
            const tmp:TrancheHoraire = {heureDebut:NaN,heureFin:NaN};
            setTranche2(tmp)
        }
    },[avecCoupure])

    const onclickAppliOnAnotherDays = function () {
        if (defini) {
            myEventEmitter.emit('appliquerAuxAutresJours', {emmiterIndex:jour.index,planning:planningDuJour});
        }
    }

    return (
        <View style={{...styles.container,borderColor:(defini?'green':'orange')}}>
            {/* Header Section */}
            <TouchableOpacity onPress={toggleExpanded} style={styles.header}>
                <Text style={styles.headerText}>
                    {jour.text}
                    {/* {defini? <Chip>Defini</Chip> : null } */}
                </Text>
                <Text style={styles.toggleText}>{isExpanded ? '-' : '+'}</Text>
            </TouchableOpacity>

            {/* Details Section */}
            {isExpanded && (
                <View style={styles.details}>
                    <View style={styles.switchContainer}>
                        <Text style={styles.label}>Avec coupure</Text>
                        <Switch
                            value={avecCoupure}
                            onValueChange={() => setAvecCoupure(!avecCoupure)}
                        />
                    </View>

                    {avecCoupure && <Text style={{color:"black"}}>Tranche horaire 1: </Text>}
                    <View style={styles.timeContainer}>
                        <Text style={styles.label}>De</Text>
                        <TimePicker  placeholder='Heure début' setValue={(text: string) => { setTranche1Debut(text); } } value={tranche1Debut}></TimePicker>
                        
                        <Text style={styles.label}>À</Text>
                        <TimePicker placeholder='Heure fin' setValue={(text: string) => { setTranche1Fin(text); } } value={tranche1Fin}></TimePicker>
                    </View>

                    {
                        avecCoupure && (
                            <View>
                                <Text style={{color:"black"}}>Tranche horaire 2: </Text>
                                <View style={styles.timeContainer}>
                                    <Text style={styles.label}>De</Text>
                                    <TimePicker placeholder='Heure début' setValue={(text: string) => { setTranche2Debut(text); } } value={tranche2Debut}></TimePicker>
                                    
                                    <Text style={styles.label}>À</Text>
                                    <TimePicker placeholder='Heure fin' setValue={(text: string) => { setTranche2Fin(text); } } value={tranche2Fin}></TimePicker>
                                </View>
                            </View>
                        )
                    }

                    <Button disabled={!defini} title="Appliquer aux autres jours" color={defini?"#1976d2":"#a3cce6"} onPress={onclickAppliOnAnotherDays} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    afficheHeure:{
        color:'white',
        backgroundColor:'blue',
        borderRadius:10,
    },
    container: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width:'100%'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color:'black'
    },
    toggleText: {
        fontSize: 18,
        color:'black'
    },
    details: {
        marginTop: 10,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color:'black'
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 5,
        width: '40%',
        marginLeft: 10,
        marginRight: 10,
        textAlign: 'center',
        color:'black'
    },
});

export default JoursPlanningItem;