import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert, Modal, FlatList } from 'react-native';
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import { getUserByPajeId, loginUser, saveLoginToken } from '../../utils/user';
import { getContratByPajeIdUser, isContratConfiguree } from '../../utils/contrat';
import { connectedUserContext } from '../../../App';
import User from '../../models/user';
import Toast from 'react-native-toast-message';

const LoginPage = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [pajemploiId, setPajemploiId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [salaries, setSalaries] = useState<string[]>();
  const { connectedUser, setConnectedUser } = useContext(connectedUserContext)

  useEffect(function () {
    setIsLoading(false);
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(false);
      setPajemploiId("")
      setPassword("")
    }, [])
  );

  const validateAndSubmit = async () => {
    if (!pajemploiId || !password) {
      Toast.show({
        type: 'error',
        text1: "Impossible de se connecter",
        autoHide: true
      })
    } else {
      console.log('Identifiant Pajemploi:', pajemploiId);
      console.log('Mot de passe:', password);

      setIsLoading(true)
      try {
        var result = await loginUser({ pajeId: pajemploiId, password: password });
        if (!!result && (result.status == 200) && !!result.data.accessToken) {
          const accessToken = result.data.accessToken
          //Save token
          const isTokenSaved = await saveLoginToken(accessToken, pajemploiId)
          if (isTokenSaved) {
            let loggedUser: User = new User();
            const response = await getUserByPajeId(pajemploiId)
            loggedUser = response.data
            setConnectedUser(loggedUser)

            //Verififier la configuration d'un contrat
            const isContratConfigured = await isContratConfiguree()
            console.log("PROFILE: ", loggedUser.profile);

            if (loggedUser.profile === "PAJE_EMPLOYEUR") {
              if (isContratConfigured) navigation.reset({
                index: 0,
                routes: [{ name: "Home" }]
              })
              else navigation.reset({
                index: 0,
                routes: [{ name: "ElementsAMunirPage" }]
              })
            } else {
              navigation.reset({
                index: 0,
                routes: [{ name: "SelectParentpage" }]
              })
            }
          } else throw new Error()
        } else {
          throw new Error()
        }
        setIsLoading(true)
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Impossible de se connecter',
          visibilityTime: 3000,
          autoHide: true
        })
        setIsLoading(false)
      }


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
    maxHeight: "90%"
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
