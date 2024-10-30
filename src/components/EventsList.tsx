import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Evenement } from '../models/evenements'
import EventListItem from './EventListItem';
import LoadingScreen from './loading/LoadingScreens';

interface EventListeProps {
    loading: boolean;
    setIsLoading: any;
    events: Evenement[];
    setEvents: any,
    onDelete: any,
    onShowDetails: any
}

const EventsList = ({ loading, setIsLoading, events, setEvents, onDelete, onShowDetails }: EventListeProps) => {

    if (loading) {
        return <LoadingScreen></LoadingScreen>
    }

    return (
        <ScrollView contentContainerStyle={{alignItems:'center'}} style={styles.eventViewer}>
            {
                events.map((event, index) => (
                    <EventListItem onDelete={onDelete} onDetails={onShowDetails} event={event} key={index}></EventListItem>
                ))
            }
        </ScrollView>
    )
}

export default EventsList

const styles = StyleSheet.create({
    eventViewer: {
        flex: 1,
        width: '100%',
    },
})