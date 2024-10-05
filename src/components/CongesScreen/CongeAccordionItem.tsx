import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { List, Text, MD3Theme } from 'react-native-paper';
import { CongeType } from '../../utils/conges';
import { styles } from '../../pages/connected/Home/HomeScreens/CongesScreen/styles';
import { getTypeEventBykey, getTypeEventByText } from '../../utils/evenements/enum-type-evenement';


interface CongeAccordionItemProps {
    title: string;
    count: number;
    description: string;
    congesList: CongeType[];
    theme: MD3Theme;
}

export const CongeAccordionItem: React.FC<CongeAccordionItemProps> = ({ 
    title, 
    count, 
    description, 
    congesList,
    theme 
}) => {
    const [expanded, setExpanded] = useState(false);

    const handlePress = () => {
        setExpanded(!expanded);
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    };

    return (
        <List.Accordion
            title={`${count} ${count <= 1 ? 'jour' : 'jours'}`}
            description={description}
            left={props => (
                <List.Icon {...props} icon="checkbox-marked-circle-outline" color={theme.colors.primary} />
            )}
            expanded={expanded}
            onPress={handlePress}
            titleStyle={[styles.listItemTitle, theme.fonts.titleMedium]}
            descriptionStyle={[styles.listItemDescription, theme.fonts.bodyMedium]}
            style={{ backgroundColor: theme.colors.background }}
        >
            {congesList.length === 0 ? (
                <List.Item
                    title="Aucun congé posé"
                    titleStyle={[theme.fonts.bodyMedium, { color: theme.colors.onSurfaceVariant }]}
                    style={{ paddingLeft: 12 }}
                />
            ) : (
                congesList.map((conge, index) => (
                    <List.Item
                        key={conge.id}
                        title={getTypeEventBykey(conge.typeEvenement)?.titre}
                        description={`Du ${formatDate(conge.dateDebut)} au ${formatDate(conge.dateFin)}`}
                        titleStyle={[theme.fonts.bodyMedium]}
                        descriptionStyle={[theme.fonts.bodySmall, { color: theme.colors.onSurfaceVariant }]}
                        style={{
                            paddingLeft: 12,
                            borderWidth: 1,
                            borderRadius: 5,
                            marginVertical: 5,
                            marginHorizontal: 10,
                            borderLeftWidth: 8,
                            borderColor: theme.colors.primary,
                            backgroundColor: 'white'
                        }}
                    />
                ))
            )}
        </List.Accordion>
    );
};