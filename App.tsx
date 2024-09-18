import React, { createContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { TransitionSpecs } from '@react-navigation/stack';

import Login from './src/pages/auth/Login';
import HomePage from './src/pages/connected/Home/Home'
import ElementsAMunirPage from './src/pages/connected/ElementsAMunirPage/ElementsAMunirPage';
import CompatibiliteeContrat from './src/pages/connected/CompatibiliteeContrat/CompatibiliteeContrat';
import ContractConfigurationComponent from './src/pages/connected/ConfigurerContratPage/ConfigurerContratPage';
import { getPajeId, getUserByPajeId, isLogedIn, logout } from './src/utils/user';
import { isContratConfiguree, removeConfiguredContrat } from './src/utils/contrat';
import User from './src/models/user';
import LoadingScreen from './src/components/loading/LoadingScreens';
import CreerEvenementPage from './src/pages/connected/CreerEvenementPage/CreerEvenementPage';
import CreerAmplitudeEvenementPage from './src/pages/connected/CreerEvenementPage/SpecificEvenement/CreerAmplitudeEvenementPage';

import Toast from 'react-native-toast-message';
import CreerJourFerieTravaillPage from './src/pages/connected/CreerEvenementPage/SpecificEvenement/CreerJourFerieTravaillPage';

const Stack = createStackNavigator();

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    text: "#EDECEC",
    background: "#121212", // Fond principal
    surface: "#1E1E1E", // Fond secondaire
    primary: "#BB86FC", // Couleur principale
    secondary: "#03DAC6", // Couleur secondaire
    accent: "#FF4081", // Couleur d'accent
    placeholder: "#B0BEC5", // Couleur des espaces réservés
    disabled: "#B0BEC5", // Couleur désactivée
  }
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    text: "#121212", // Couleur du texte
    background: "#F5F5F5", // Fond principal
    surface: "#FFFFFF", // Fond secondaire
    primary: "#6200EE", // Couleur principale
    secondary: "#03DAC6", // Couleur secondaire
    accent: "#FF4081", // Couleur d'accent
    placeholder: "#939393", // Couleur des espaces réservés
    disabled: "#939393", // Couleur désactivée
  }
};

export const connectedUserContext =createContext<{connectedUser:User,setConnectedUser:any} | undefined>(undefined);

const App = () => {
  const config={
    transitionSpec: {
      open: TransitionSpecs.TransitionIOSSpec,
      close: TransitionSpecs.TransitionIOSSpec,
    },
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  }

  const [isLoading,setIsLoading]=useState<boolean>(true)
  const [defaultRoute,setDefaultRoute]=useState<string>("Login")
  const [connectedUser,setConnectedUser]=useState<User>(new User())

  useEffect(function() {
    (async function () {
      //await logout();
      //await removeConfiguredContrat();
      if (!(await isLogedIn())) { //Non Connectée
        setDefaultRoute("Login")
      }else{ //Connectée
        const pajeId = await getPajeId()
        let loggedUser:User=new User();
        if (pajeId) {
          const response = await getUserByPajeId(pajeId)
          loggedUser=response.data
          setConnectedUser(loggedUser)
        }

        //Verififier la configuration d'un contrat
        const isContratConfigured = await isContratConfiguree()
        if (isContratConfigured) setDefaultRoute("Home")
        else setDefaultRoute("ElementsAMunirPage")
      }
      setIsLoading(false)
    })();
  },[])

  useEffect(function () {
    console.log(connectedUser);
    
  },[connectedUser])

  return (
    <PaperProvider theme={lightTheme}>
      <NavigationContainer>
        <connectedUserContext.Provider value={{connectedUser,setConnectedUser}}>
          {
            isLoading?
              <LoadingScreen></LoadingScreen>
              :
              <View style={styles.container}>
                <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={defaultRoute}>
                  <Stack.Screen options={{ cardShadowEnabled: true, ...config}} name="Login" component={Login} />
                  <Stack.Screen options={{ cardShadowEnabled: true, ...config}} name="ElementsAMunirPage" component={ElementsAMunirPage} />
                  <Stack.Screen options={{ cardShadowEnabled: true, ...config}} name="CompatibiliteDuContratPage" component={CompatibiliteeContrat} />
                  <Stack.Screen options={{ cardShadowEnabled: true, ...config}} name="ConfigurerContrat" component={ContractConfigurationComponent} />
                  <Stack.Screen options={{ cardShadowEnabled: true, ...config}} name="Home" component={HomePage} />
                  <Stack.Screen name="CreerEvenementPage" component={CreerEvenementPage} options={{ cardShadowEnabled: true }}/>
                  <Stack.Screen name="CreerAmplitudeEvenementPage" component={CreerAmplitudeEvenementPage} options={{ cardShadowEnabled: true }}/>
                  <Stack.Screen name="CreerJourFerieTravaillPage" component={CreerJourFerieTravaillPage} options={{ cardShadowEnabled: true }}/>
                </Stack.Navigator>
                <Toast
                  position='top'
                  bottomOffset={20}
                />
              </View>
          }
        </connectedUserContext.Provider>
      </NavigationContainer>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color:'black'
  },
});

export default App;