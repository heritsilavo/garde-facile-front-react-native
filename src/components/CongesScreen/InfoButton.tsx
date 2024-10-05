import { TouchableOpacity } from "react-native";
import { MD3Theme } from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const InfoButton: React.FC<{ onPress: () => void; theme: MD3Theme }> = ({ onPress, theme }) => (
    <TouchableOpacity
        onPress={onPress}
        style={{
            backgroundColor: theme.colors.primaryContainer,
            borderRadius: 12,
            padding: 4,
            marginLeft: 8,
        }}
    >
        <Icon name="information" size={16} color={theme.colors.primary} />
    </TouchableOpacity>
);