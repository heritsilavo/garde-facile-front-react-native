import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Menu, IconButton, useTheme } from 'react-native-paper';
import { Evenement } from '../models/evenements';
import { EventType, getTypeEventByText, TypeEvenement } from '../utils/evenements/enum-type-evenement';
import { generateColorForEvent } from '../utils/evenements/famille-evenement';
import { getDescriptionByEvent } from '../utils/evenements/evenement';

const EventListItem: React.FC<{ event: Evenement, onDelete: (event: Evenement) => void, onDetails: (event: Evenement) => void }> = ({ event, onDelete, onDetails }) => {
    const {fonts} = useTheme()
    const [visible, setVisible] = useState(false);
    const eventType: EventType | null = getTypeEventByText(event.typeEvenement);
    const familleEvenement = eventType?.famille ?? 1;

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    

    return (
        <View style={[styles.container, { borderColor: generateColorForEvent(familleEvenement) }]}>
            <View style={styles.contentContainer}>
                <Text style={{...styles.titre, ...fonts.bodyLarge}}>{eventType?.titre || 'Événement inconnu'}</Text>
                <Text style={{...styles.desc, ...fonts.bodySmall}}>{getDescriptionByEvent(event)}</Text>
            </View>
            
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                    <IconButton
                        icon="dots-vertical"
                        onPress={openMenu}
                    />
                }
            >
                {/* <Menu.Item leadingIcon="trash-can-outline" onPress={() => { onDelete(event); closeMenu();}} title="Supprimer" /> */}
                <Menu.Item leadingIcon="information-outline" onPress={() => {onDetails(event); closeMenu();}} title="Détails" />
            </Menu>
        </View>
    );
};

export default EventListItem;

const styles = StyleSheet.create({
    container: {
        width: "90%",
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 10,
        borderLeftWidth: 8,
        paddingLeft: 10,
        paddingVertical: 7,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    contentContainer: {
        flex: 1
    },
    titre: {
        fontWeight: 'bold'
    },
    desc: {
        color: 'black'
    }
});