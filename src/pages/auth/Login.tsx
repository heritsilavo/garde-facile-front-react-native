import React, { useCallback, useContext, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import { getUserByPajeId, loginUser, saveLoginToken } from '../../utils/user';
import { isContratConfiguree } from '../../utils/contrat';
import { connectedUserContext } from '../../../App';
import User from '../../models/user';
import Toast from 'react-native-toast-message';
import { useTheme } from 'react-native-paper';

const INPUT_FIELDS = {
  IDENTIFIER: {
    placeholder: 'Identifiant',
    key: 'identifier'
  },
  PASSWORD: {
    placeholder: 'Mot de passe',
    key: 'password'
  }
};

const LoginPage = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [formData, setFormData] = useState({
    pajemploiId: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { setConnectedUser } = useContext(connectedUserContext);
  const { fonts } = useTheme();

  useFocusEffect(
    useCallback(() => {
      // Reset form state when screen comes into focus
      setFormData({ pajemploiId: '', password: '' });
      setIsLoading(false);
    }, [])
  );

  const handleInputChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const showErrorToast = (message: string = 'Impossible de se connecter') => {
    Toast.show({
      type: 'error',
      text1: message,
      visibilityTime: 3000,
      autoHide: true
    });
  };

  const handleNavigation = (loggedUser: User, isContratConfigured: boolean) => {
    const routes = {
      PAJE_EMPLOYEUR: isContratConfigured ? 'Home' : 'ElementsAMunirPage',
      DEFAULT: 'SelectParentpage'
    };

    const route = loggedUser.profile === 'PAJE_EMPLOYEUR' 
      ? routes.PAJE_EMPLOYEUR 
      : routes.DEFAULT;

    navigation.reset({
      index: 0,
      routes: [{ name: route }]
    });
  };

  const validateAndSubmit = async () => {
    const { pajemploiId, password } = formData;

    if (!pajemploiId || !password) {
      showErrorToast('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);

    try {
      const loginResult = await loginUser({ pajeId: pajemploiId, password });
      
      if (!loginResult?.data?.accessToken || loginResult.status !== 200) {
        throw new Error('Invalid login response');
      }

      const isTokenSaved = await saveLoginToken(loginResult.data.accessToken, pajemploiId);
      
      if (!isTokenSaved) {
        throw new Error('Failed to save token');
      }

      const userResponse = await getUserByPajeId(pajemploiId);
      const loggedUser = userResponse.data;
      setConnectedUser(loggedUser);

      const isContratConfigured = await isContratConfiguree();
      handleNavigation(loggedUser, isContratConfigured);

    } catch (error) {
      showErrorToast();
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = ({ placeholder, key }: { placeholder: string, key: string }) => (
    <TextInput
      key={key}
      style={[styles.input, fonts.bodyMedium]}
      placeholder={placeholder}
      placeholderTextColor="#8E8E93"
      value={formData[key === 'identifier' ? 'pajemploiId' : 'password']}
      onChangeText={handleInputChange(key === 'identifier' ? 'pajemploiId' : 'password')}
      secureTextEntry={key === 'password'}
      autoCapitalize="none"
      autoCorrect={false}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerContainer}>
            <Text style={[fonts.titleLarge, styles.title]}>
              Connexion
            </Text>
          </View>

          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: 'asset:/illustrations/login.png' }} 
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          <View style={styles.formContainer}>
            {[INPUT_FIELDS.IDENTIFIER, INPUT_FIELDS.PASSWORD].map(renderInput)}
          </View>

          <View style={styles.buttonContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#007AFF" />
            ) : (
              <TouchableOpacity 
                style={styles.loginButton} 
                onPress={validateAndSubmit}
                activeOpacity={0.8}
              >
                <Text style={[styles.loginButtonText, fonts.bodyMedium]}>
                  Continuer
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  container: {
    flex: 1
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 24
  },
  headerContainer: {
    alignItems: 'center',
    overflow:'visible',
    padding:10,
    marginTop:50
  },
  title: {
    fontSize: 32,
    color: '#000000',
    fontWeight: '600',
    paddingTop:10
  },
  imageContainer: {
    alignItems: 'center',
    marginTop:0,
  },
  image: {
    width:  200,
    height: 200
  },
  formContainer: {
    width: '100%',
    marginBottom: 24,
    gap: 16
  },
  input: {
    height: 56,
    borderColor: '#E5E5EA',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    width: '100%',
    color: '#000000',
    backgroundColor: '#FFFFFF'
  },
  buttonContainer: {
    width: '100%',
    marginTop: 8
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600'
  }
});

export default LoginPage;