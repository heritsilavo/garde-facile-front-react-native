import { View } from "react-native";
import { MD3Theme, Title, Paragraph } from "react-native-paper";
import { CongeData } from "../../utils/conges";
import { CongeAccordionItem } from "./CongeAccordionItem";

interface CongesAccordionListProps {
    congesData: CongeData;
    theme: MD3Theme;
}

export const CongesAccordionList: React.FC<CongesAccordionListProps> = ({ congesData, theme }) => {
    return (
        <View>
            <Title style={[styles.sectionTitle, theme.fonts.titleLarge]}>Congés déjà posés</Title>
            <Paragraph style={[styles.paragraph, theme.fonts.bodyMedium]}>
                Les congés indiqués ci-dessous ont été pris depuis le {congesData.dateCreationCompteur}
            </Paragraph>
            
            <CongeAccordionItem
                title="Congés payés"
                count={congesData.nbJourCongesPayesPose}
                description="Congés payés"
                congesList={congesData.listeCongesPayes}
                theme={theme}
            />
            
            <CongeAccordionItem
                title="Congés sans solde"
                count={congesData.nbJourCongesSansSoldePose}
                description="Congés sans solde"
                congesList={congesData.listeCongesSansSolde}
                theme={theme}
            />
            
            <CongeAccordionItem
                title="Congés exceptionnels"
                count={congesData.nbJourCongesExceptionnelPose}
                description="Congés exceptionnels"
                congesList={congesData.listeCongesExceptionnels}
                theme={theme}
            />
        </View>
    );
};

const styles = {
    listItemTitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    listItemDescription: {
        fontSize: 14,
    },
    sectionTitle: {
        marginTop: 24,
        marginBottom: 8,
    },
    paragraph: {
        marginBottom: 16,
    },
};