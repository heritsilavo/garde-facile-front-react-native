import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert, Modal, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';

const LoginPage = ({ navigation }:{ navigation:NavigationProp<any> }) => {
  const [pajemploiId, setPajemploiId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [salaries, setSalaries] = useState<string[]>();

  // Simuler la récupération des données avec un délai
  const fetchSalaries:() => Promise<string[]> = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simule un délai d'une seconde
    setIsLoading(false);
    return ['VALERIE VIDAL', 'ANTOINE NOBILE'];
  };

  // Affiche le menu de sélection des salariés
  const showSalarieSelectionMenu = async () => {
    const fetchedSalaries = await fetchSalaries();
    setSalaries(fetchedSalaries);
    setModalVisible(true); // Affiche le modal
  };

  const handleSalarieSelection = (salarie:any) => {
    console.log(`Salarié sélectionné : ${salarie}`);
    setModalVisible(false); // Cache le modal après la sélection

    navigation.navigate('ElementsAMunirPage')
  };

  const validateAndSubmit = () => {
    if (!pajemploiId || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
    } else {
      console.log('Identifiant Pajemploi:', pajemploiId);
      console.log('Mot de passe:', password);

      showSalarieSelectionMenu();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={{ color: "black", fontSize: 30 }}>Connexion</Text>
        <Image source={{ uri: 'asset:/illustrations/login.png' }} style={styles.image} />
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Identifiant"
            placeholderTextColor={"#a2a3a2"}
            value={pajemploiId}
            onChangeText={setPajemploiId}
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor={"#a2a3a2"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        {isLoading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <TouchableOpacity style={styles.loginButton} onPress={validateAndSubmit}>
            <Text style={styles.loginButtonText}>Continuer</Text>
          </TouchableOpacity>
        )}
        <View style={styles.links}>
          <TouchableOpacity onPress={() => console.log('Pas de compte Pajemploi?')}>
            <Text style={styles.linkText}>Pas de encore de compte?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Identifiant Pajemploi oublié?')}>
            <Text style={styles.linkText}>Identifiant oublié?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Mot de passe oublié?')}>
            <Text style={styles.linkText}>Mot de passe oublié?</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal personnalisé pour la sélection des salariés */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sélectionnez le salarié a rattacher au contrat </Text>
            <FlatList
              data={salaries}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.salarieItem}
                  onPress={() => handleSalarieSelection(item)}
                >
                  <Text style={styles.salarieText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={[styles.salarieItem, { backgroundColor: '#ccc',marginTop:10,borderRadius:3 }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.salarieText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  innerContainer: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  form: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 16,
    width: '100%',
    color: "black",
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  links: {
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 14,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    maxHeight:"90%"
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "black",
  },
  salarieItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    width: '100%',
    alignItems: 'center',
  },
  salarieText: {
    fontSize: 18,
    color: "black",
  },
});

export default LoginPage;
