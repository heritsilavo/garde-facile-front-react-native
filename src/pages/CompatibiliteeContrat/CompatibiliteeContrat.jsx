import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView,Image } from 'react-native';

const CompatibiliteeContrat = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.navigate("ElementsAMunirPage")}>
          <Text style={styles.backButton}>{"< Back"}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.center}>
        <Image source={{ uri: 'asset:/illustrations/documents_rafiki.png' }} style={styles.image} />
        </View>
        <View style={styles.spacing} />
        {/* Texte principal */}
        <Text style={styles.title}>
          Votre Contrat Est-il bien compatible ?
        </Text>
        <View style={styles.spacing} />
        {/* Texte d'instruction */}
        <Text style={styles.instruction}>
          Pour continuer, votre contrat doit être :
        </Text>
        <View style={styles.smallSpacing} />
        {/* Liste des éléments */}
        <View>
          <View style={styles.listItem}>
            <Text style={styles.listIcon}>●</Text>
            <Text style={styles.listText}>
              Un contrat d'assistance maternelle
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listIcon}>●</Text>
            <Text style={styles.listText}>
              Un contrat CDI
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listIcon}>●</Text>
            <Text style={styles.listText}>
              Avec un planning de garde qui ne change pas d'une semaine à l'autre
            </Text>
          </View>
        </View>
        <View style={styles.flexSpacer} />
        {/* Bouton */}
        <View style={styles.center}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.buttonText}>Mon contrat est compatible</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  backButton: {
    color: '#007AFF',
    fontSize: 16,
  },
  content: {
    padding: 16,
  },
  center: {
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#000',
  },
  instruction: {
    fontSize: 16,
    color: '#000',
  },
  spacing: {
    height: 20,
  },
  smallSpacing: {
    height: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  listIcon: {
    color: '#000',
    marginRight: 10,
    fontSize: 12,
  },
  listText: {
    fontSize: 16,
    color: '#000',
  },
  flexSpacer: {
    flex: 1,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  }
});

export default CompatibiliteeContrat;
