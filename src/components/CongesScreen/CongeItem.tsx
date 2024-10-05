import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, Button, MD3Theme } from 'react-native-paper';
import { styles } from '../../pages/connected/Home/HomeScreens/CongesScreen/styles';

interface CongeItemProps {
    value: number;
    description: string;
    date: string;
    theme: MD3Theme;
}

export const CongeItem: React.FC<CongeItemProps> = ({ value, description, date, theme }) => (
    <View style={styles.congeItem}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={[styles.congeValue, theme.fonts.displaySmall]}>
                {value}
            </Text>
            <Text style={[
                styles.congeValue, 
                theme.fonts.titleMedium, 
                { marginLeft: 4 }
            ]}>
                {value <= 1 ? " jour" : " jours"}
            </Text>
        </View>
        <Text style={[styles.congeDescription, theme.fonts.bodyMedium]}>
            {description}
        </Text>
        <Text style={[styles.congeDate, theme.fonts.bodySmall]}>
            {date}
        </Text>
    </View>
);