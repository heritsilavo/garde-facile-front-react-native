import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Card, Text, Title, Paragraph, Button, List, useTheme, MD3Theme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CongeData, initialCongeData } from '../../../../../utils/conges';
import { styles } from './styles';
import HelpBox from '../../../ConfigurerContratPage/components/HelpBox';
import { CongeItem } from '../../../../../components/CongesScreen/CongeItem';
import { CustomTab } from '../../../../../components/CongesScreen/CustomTab';
import { InfoButton } from '../../../../../components/CongesScreen/InfoButton';
import { AcquisitionTab } from '../../../../../components/CongesScreen/AcquisitionTab';
import { PaiementTab } from '../../../../../components/CongesScreen/PaiementTab';

const CongeScreen:React.FC<{refreshValue:number}> = ({refreshValue}) => {
    const [activeTab, setActiveTab] = useState<"ACQUISITION" | "PAIEMENT">("ACQUISITION");
    const theme = useTheme();

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <CustomTab
                    label="ACQUISITION"
                    isActive={activeTab === "ACQUISITION"}
                    onPress={() => {setActiveTab("ACQUISITION")}}
                    theme={theme}
                />
                <CustomTab
                    label="PAIEMENT"
                    isActive={activeTab === "PAIEMENT"}
                    onPress={() => {setActiveTab("PAIEMENT")}}
                    theme={theme}
                />
            </View>
            {
                (activeTab === "ACQUISITION") && <AcquisitionTab refreshValue={refreshValue} theme={theme} />
            }

            {
                (activeTab === "PAIEMENT") && <PaiementTab refreshValue={refreshValue} theme={theme} />
            }

        </View>
    );
};

export default CongeScreen;
