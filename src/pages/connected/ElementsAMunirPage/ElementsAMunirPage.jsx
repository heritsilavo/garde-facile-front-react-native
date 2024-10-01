import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { logout } from '../../../utils/user';

const ElementsAMunirPage = ({ navigation }) => {
  const handleLogout = async function () {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });

  }

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => { }}></TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out-outline" size={28} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.center}>
          <Image source={{ uri: 'asset:/illustrations/signing_a_contract.png' }} style={styles.image} />
        </View>

        <View style={styles.spacing} />

        <Text style={styles.title}>
          Je configure l'application avec mon contrat
        </Text>

        <View style={styles.spacing} />

        <Text style={styles.instruction}>
          Afin de configurer l'application, munissez-vous des éléments suivants:
        </Text>

        <View style={styles.smallSpacing} />

        <View>
          <View style={styles.listItem}>
            <Icon name="checkmark-circle" size={20} color="green" style={styles.listIcon} />
            <Text style={styles.listText}>Le contrat signé avec l'assistant maternelle</Text>
          </View>
          <View style={styles.listItem}>
            <Icon name="checkmark-circle" size={20} color="green" style={styles.listIcon} />
            <Text style={styles.listText}>Le nombre d'enfants de votre assistant maternelle et leurs âges</Text>
          </View>
        </View>

        <View style={styles.flexSpacer} />
      </ScrollView>

      {/* Bouton "Continuer" */}
      <View style={styles.center}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("CompatibiliteDuContratPage")}
        >
          <Text style={styles.buttonText}>Continuer</Text>
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
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F5F5F5',
    elevation: 1,
  },
  logoutButton: {
    paddingHorizontal: 10,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
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
  image: {
    width: 220,
    height: 220,
    marginBottom: 20,
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
    marginVertical: 5,
  },
  listIcon: {
    marginRight: 10,
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
});

export default ElementsAMunirPage;
