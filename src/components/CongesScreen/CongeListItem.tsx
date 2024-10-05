import { MD3Theme, List } from "react-native-paper";
import { styles } from "../../pages/connected/Home/HomeScreens/CongesScreen/styles";
import React from "react";

const CongeListItem: React.FC<{ title: string; description: string; theme: MD3Theme }> = React.memo(({
    title,
    description,
    theme
}) => (
    <List.Item
        title={title}
        description={description}
        left={props => <List.Icon {...props} icon="checkbox-marked-circle-outline" color={theme.colors.primary} />}
        titleStyle={styles.listItemTitle}
        descriptionStyle={styles.listItemDescription}
    />
));
