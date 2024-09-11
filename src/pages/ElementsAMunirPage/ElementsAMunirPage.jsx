import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';

const ElementsAMunirPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.backButton}>{"< Back"}</Text>
        </TouchableOpacity>
      </View> */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.center}>
          <Image source={{ uri: 'asset:/illustrations/signing_a_contract.png' }} style={styles.image} />
        </View>
        <View style={styles.spacing} />
        {/* Texte principal */}
        <Text style={styles.title}>
          Je configure l'application avec mon contrat
        </Text>
        <View style={styles.spacing} />
        {/* Texte d'instruction */}
        <Text style={styles.instruction}>
          Afin de configurer l'application munissez-vous des éléments suivants:
        </Text>
        <View style={styles.smallSpacing} />
        {/* Liste des éléments */}
        <View>
          <View style={styles.listItem}>
            <Text style={styles.listIcon}>✔️</Text>
            <Text style={styles.listText}>
              Le contrat signé avec l'assistant maternelle
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listIcon}>✔️</Text>
            <Text style={styles.listText}>
              Le nombre d'enfant de votre assistant maternelle et leurs âges
            </Text>
          </View>
        </View>
        <View style={styles.flexSpacer} />
        {/* Bouton */}
        <View style={styles.center}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate("CompatibiliteDuContratPage")}
          >
            <Text style={styles.buttonText}>Continuer</Text>
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
    display:'flex',
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
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
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
    color: 'green',
    marginRight: 10,
  },
  listText: {
    fontSize: 16,
    color: '#000',
  },
  flexSpacer: {
    flex: 1,
    height:20
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
});

export default ElementsAMunirPage;
