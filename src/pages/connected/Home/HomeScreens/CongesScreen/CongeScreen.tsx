import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Card, Text, Title, Paragraph, Button, List, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CongeData, initialCongeData } from '../../../../../utils/conges';
import { styles } from './styles';
import { CustomTab, CongeItem, InfoButton } from '../../../../../components/CongesComponents';
import HelpBox from '../../../ConfigurerContratPage/components/HelpBox';

const AcquisitionTab: React.FC<{ congeData: CongeData, theme: any }> = ({ congeData, theme }) => (
    <ScrollView>
        <Card style={styles.card}>
            <Card.Content>
                <Paragraph style={styles.paragraph}>Les congés indiqués ci-dessous seront mis à jour le {congeData.dateMiseAJour}.</Paragraph>
                <HelpBox style={{ marginTop: 10 }} text='Le salarié a droit a 2.5 jours de congées par mois. Donc 30 jours (5 semaines) par an'></HelpBox>
                <CongeItem
                    value={congeData.congesPayesDispo}
                    description="Congés payés disponibles"
                    date="Compteur chargé le 05/09/2023"
                />
                <CongeItem
                    value={congeData.congeEncoursDAcquisition}
                    description="Congés en cours d'acquisition"
                    date={`Disponibles à partir du ${congeData.dateMiseAJour}`}
                />
                <InfoButton onPress={() => { }}>Plus d'infos</InfoButton>
                <Title style={styles.sectionTitle}>Congés déjà posés</Title>
                <Paragraph style={styles.paragraph}>Les congés indiqués ci-dessous ont été pris du 05/09/2023 à aujourd'hui.</Paragraph>
                {[
                    { title: congeData.poseeCongePaye.toString(), description: "Congés payés" },
                    { title: congeData.poseeCongeSansSolde.toString(), description: "Congés sans solde" },
                    { title: congeData.poseeCongeExceptionnel.toString(), description: "Congés exceptionnels" },
                ].map((item, index) => (
                    <List.Item
                        key={index}
                        title={item.title}
                        description={item.description}
                        left={props => <List.Icon {...props} icon="checkbox-marked-circle-outline" color={theme.colors.primary} />}
                        titleStyle={styles.listItemTitle}
                        descriptionStyle={styles.listItemDescription}
                    />
                ))}
                <Text style={styles.congeDate}>Depuis le 05/09/2023</Text>
            </Card.Content>
        </Card>
    </ScrollView>
);

const PaiementTab: React.FC<{ congeData: CongeData, theme: any }> = ({ congeData, theme }) => (
    <ScrollView>
        <Card style={styles.card}>
            <Card.Content>
                <Title style={styles.title}>Congés payés: 2023-2024</Title>
                <View style={styles.dateContainer}>
                    <Icon name="calendar" size={18} color={theme.colors.primary} />
                    <Text style={styles.dateText}>Date de calcul de l'indemnité: {congeData.dateCalculIndemnite}</Text>
                </View>
                <Button mode="outlined" style={styles.outlinedButton}>Consulter les informations</Button>
                <Paragraph style={styles.paragraph}>L'enfant est gardé 46 semaines ou moins.</Paragraph>
                <Paragraph style={styles.paragraph}>Les semaines restantes sont des congés payés ou des semaines d'absence.</Paragraph>
                <Title style={styles.methodTitle}>Méthode du maintien de salaire</Title>
                <InfoButton onPress={() => { }}>Plus d'infos</InfoButton>
                <Title style={styles.methodTitle}>Méthode des 10% (du dixième)</Title>
                <InfoButton onPress={() => { }}>Plus d'infos</InfoButton>
                <Paragraph style={styles.paragraph}>Montant retenu sera calculé le {congeData.dateCalculIndemnite}</Paragraph>
                <Paragraph style={styles.paragraph}>Versé en une seule fois en août 2024</Paragraph>
            </Card.Content>
        </Card>
    </ScrollView>
);

const CongeScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<number>(0);
    const [congeData, setCongeData] = useState<CongeData>(initialCongeData);
    const theme = useTheme();

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <CustomTab
                    label="ACQUISITION"
                    isActive={activeTab === 0}
                    onPress={() => setActiveTab(0)}
                />
                <CustomTab
                    label="PAIEMENT"
                    isActive={activeTab === 1}
                    onPress={() => setActiveTab(1)}
                />
            </View>
            {activeTab === 0 ? <AcquisitionTab congeData={congeData} theme={theme} /> : <PaiementTab congeData={congeData} theme={theme} />}
        </View>
    );
};

export default CongeScreen;
