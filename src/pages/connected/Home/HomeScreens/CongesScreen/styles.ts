// pages/connected/Home/HomeScreens/CongesScreen/styles.ts
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

const getStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f0f0f0',
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      elevation: 4,
    },
    tab: {
      flex: 1,
      paddingVertical: 16,
      alignItems: 'center',
    },
    activeTab: {
      borderBottomWidth: 3,
      borderBottomColor: '#007AFF',
    },
    tabLabel: {
      fontSize: 14,
      fontFamily: theme.fonts.labelMedium.fontFamily, // Police pour l'étiquette de l'onglet
      fontWeight: 'bold',
      color: '#888',
    },
    activeTabLabel: {
      color: '#007AFF',
      fontFamily: theme.fonts.labelMedium.fontFamily, // Appliquer la police ici
    },
    card: {
      margin: 16,
      borderRadius: 8,
      elevation: 4,
    },
    title: {
      fontSize: 20,
      fontFamily: theme.fonts.titleMedium.fontFamily, // Police pour le titre
      fontWeight: 'bold',
      color: '#007AFF',
      marginBottom: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: theme.fonts.titleMedium.fontFamily, // Police pour le titre de section
      fontWeight: 'bold',
      color: '#007AFF',
      marginTop: 24,
      marginBottom: 8,
    },
    dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    dateText: {
      marginLeft: 8,
      fontSize: 14,
      fontFamily: theme.fonts.bodyMedium.fontFamily, // Police pour le texte de la date
      color: '#555',
    },
    paragraph: {
      fontSize: 14,
      lineHeight: 20,
      fontFamily: theme.fonts.bodyMedium.fontFamily, // Police pour le paragraphe
      color: '#333',
      marginBottom: 8,
    },
    congeItem: {
      marginVertical: 16,
    },
    congeValue: {
      fontSize: 32,
      fontFamily: theme.fonts.displayLarge.fontFamily, // Police pour la valeur de congé
      fontWeight: 'bold',
      color: '#007AFF',
    },
    congeDescription: {
      fontSize: 16,
      fontFamily: theme.fonts.bodyMedium.fontFamily, // Police pour la description de congé
      color: '#333',
      marginTop: 4,
    },
    congeDate: {
      fontSize: 12,
      fontFamily: theme.fonts.bodySmall.fontFamily, // Police pour la date de congé
      color: '#666',
      marginTop: 4,
    },
    listItemTitle: {
      fontSize: 18,
      fontFamily: theme.fonts.titleMedium.fontFamily, // Police pour le titre de l'élément de liste
      fontWeight: 'bold',
      color: '#007AFF',
    },
    listItemDescription: {
      fontSize: 14,
      fontFamily: theme.fonts.bodyMedium.fontFamily, // Police pour la description de l'élément de liste
      color: '#555',
    },
    infoButton: {
      alignSelf: 'flex-start',
      marginVertical: 8,
    },
    infoButtonLabel: {
      color: '#007AFF',
      fontSize: 14,
      fontFamily: theme.fonts.bodyMedium.fontFamily, // Police pour l'étiquette du bouton d'information
    },
    outlinedButton: {
      borderColor: '#007AFF',
      borderWidth: 2,
      marginVertical: 16,
    },
    methodTitle: {
      fontSize: 16,
      fontFamily: theme.fonts.titleMedium.fontFamily, // Police pour le titre de la méthode
      fontWeight: 'bold',
      color: '#007AFF',
      marginTop: 16,
      marginBottom: 4,
    },
  });
};

export const styles =getStyles()