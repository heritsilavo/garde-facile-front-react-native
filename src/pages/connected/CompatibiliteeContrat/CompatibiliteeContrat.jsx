import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Appbar } from 'react-native-paper';

const CompatibiliteeContrat = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* AppBar plus discret */}
      <Appbar.Header style={styles.appBar}>
        <Appbar.BackAction onPress={() => navigation.navigate("ElementsAMunirPage")} />
      </Appbar.Header>
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.center}>
          <Image source={{ uri: 'asset:/illustrations/documents_rafiki.png' }} style={styles.image} />
        </View>
        
        <View style={styles.spacing} />
        
        {/* Texte principal */}
        <Text style={styles.title}>Votre Contrat Est-il bien compatible ?</Text>
        
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
            <Text style={styles.listText}>Un contrat d'assistance maternelle</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listIcon}>●</Text>
            <Text style={styles.listText}>Un contrat CDI</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listIcon}>●</Text>
            <Text style={styles.listText}>
              Avec un planning de garde qui ne change pas d'une semaine à l'autre
            </Text>
          </View>
        </View>
        
        <View style={styles.flexSpacer} />
      </ScrollView>

      {/* Bouton */}
      <View style={styles.center}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("ConfigurerContrat")}
        >
          <Text style={styles.buttonText}>Mon contrat est compatible</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  appBar: {
    backgroundColor: 'transparent', // AppBar transparent pour un style plus discret
    elevation: 0, // Retirer l'ombre pour plus de légèreté
  },
  content: {
    padding: 16,
  },
  center: {
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#000',
    textAlign: 'center',
  },
  instruction: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
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
    marginVertical: 8,
  },
  listIcon: {
    color: '#007AFF',
    marginRight: 10,
    fontSize: 16,
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
    width: '90%',
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
  },
});

export default CompatibiliteeContrat;
