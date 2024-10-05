import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, Button, MD3Theme } from 'react-native-paper';
import { styles } from '../../pages/connected/Home/HomeScreens/CongesScreen/styles';

interface CustomTabProps {
    label: string;
    isActive: boolean;
    onPress: () => void;
    theme: MD3Theme;
}

export const CustomTab: React.FC<CustomTabProps> = ({ label, isActive, onPress, theme }) => (
    <TouchableOpacity
        style={[styles.tab, isActive && styles.activeTab]}
        onPress={onPress}
    >
        <Text style={[styles.tabLabel, isActive && styles.activeTabLabel,theme.fonts.labelMedium]}>{label}</Text>
    </TouchableOpacity>
);