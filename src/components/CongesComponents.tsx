import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { styles } from '../pages/connected/Home/HomeScreens/CongesScreen/styles';

interface CustomTabProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export const CustomTab: React.FC<CustomTabProps> = ({ label, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.tab, isActive && styles.activeTab]}
    onPress={onPress}
  >
    <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>{label}</Text>
  </TouchableOpacity>
);

interface CongeItemProps {
  value: number;
  description: string;
  date: string;
}

export const CongeItem: React.FC<CongeItemProps> = ({ value, description, date }) => (
  <View style={styles.congeItem}>
    <Text style={styles.congeValue}>{value}</Text>
    <Text style={styles.congeDescription}>{description}</Text>
    <Text style={styles.congeDate}>{date}</Text>
  </View>
);

interface InfoButtonProps {
  onPress: () => void;
  children: React.ReactNode;
}

export const InfoButton: React.FC<InfoButtonProps> = ({ onPress, children }) => (
  <Button
    mode="text"
    onPress={onPress}
    style={styles.infoButton}
    labelStyle={styles.infoButtonLabel}
  >
    {children}
  </Button>
);