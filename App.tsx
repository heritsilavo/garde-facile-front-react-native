import React, { createContext, useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme, configureFonts } from 'react-native-paper';
import { TransitionSpecs } from '@react-navigation/stack';

import Login from './src/pages/auth/Login';
import HomePage from './src/pages/connected/Home/Home'
import ElementsAMunirPage from './src/pages/connected/ElementsAMunirPage/ElementsAMunirPage';
import CompatibiliteeContrat from './src/pages/connected/CompatibiliteeContrat/CompatibiliteeContrat';
import ContractConfigurationComponent from './src/pages/connected/ConfigurerContratPage/ConfigurerContratPage';
import { getPajeId, getUserByPajeId, isLogedIn, logout } from './src/utils/user';
import { getContratByPajeIdUser, isContratConfiguree, removeConfiguredContrat } from './src/utils/contrat';
import User from './src/models/user';
import LoadingScreen from './src/components/loading/LoadingScreens';
import CreerEvenementPage from './src/pages/connected/CreerEvenementPage/CreerEvenementPage';
import CreerAmplitudeEvenementPage from './src/pages/connected/CreerEvenementPage/SpecificEvenement/CreerAmplitudeEvenementPage';

import Toast from 'react-native-toast-message';
import CreerJourFerieTravaillPage from './src/pages/connected/CreerEvenementPage/SpecificEvenement/CreerJourFerieTravaillPage';
import CreateIndemniteePage from './src/pages/connected/CreerEvenementPage/SpecificEvenement/CreateIndemniteePage';
import ContratProfile from './src/pages/connected/ContratProfile/ContratProfile';
import CreerHeureComplementairePage from './src/pages/connected/CreerEvenementPage/SpecificEvenement/CreerHeureComplementairePage';
import CreerPeriodeAdaptationPage from './src/pages/connected/CreerEvenementPage/SpecificEvenement/CreerPeriodeAdaptationPage';
import NoContractScreen from './src/pages/connected/NoContrat/NoContratScreen';
import SelectParentpage from './src/pages/connected/SelectParentPage/SelectParentPage';

const Stack = createStackNavigator();

const fontConfig = {
  web: {
    regular: {
      fontFamily: 'Roboto-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Roboto-Medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Roboto-Light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Roboto-Thin',
      fontWeight: 'normal',
    },
    labelMedium: {
      fontFamily: 'Roboto-Medium',
      fontWeight: 'normal',
    },
    labelLarge: {
      fontFamily: 'Roboto-Bold',
      fontWeight: 'bold',
    },
  },
  ios: {
    regular: {
      fontFamily: 'Roboto-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Roboto-Medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Roboto-Light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Roboto-Thin',
      fontWeight: 'normal',
    },
    labelMedium: {
      fontFamily: 'Roboto-Medium',
      fontWeight: 'normal',
    },
    labelLarge: {
      fontFamily: 'Roboto-Bold',
      fontWeight: 'bold',
    },
  },
  android: {
    regular: {
      fontFamily: 'Roboto-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Roboto-Medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Roboto-Light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Roboto-Thin',
      fontWeight: 'normal',
    },
    labelMedium: {
      fontFamily: 'Roboto-Medium',
      fontWeight: 'normal',
    },
    labelLarge: {
      fontFamily: 'Roboto-Bold',
      fontWeight: 'bold',
    },
  }
} as const;

const fontsConfig = {
  displaySmall: {
    fontFamily: Platform.select({
      web: 'Roboto-Bold, "Helvetica Neue", Helvetica, Arial, sans-serif',
      ios: 'System',
      default: 'Roboto-Bold',
    }),
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 44,
    fontSize: 36,
  },
  displayMedium: {
    fontFamily: Platform.select({
      web: 'Roboto-Bold, "Helvetica Neue", Helvetica, Arial, sans-serif',
      ios: 'System',
      default: 'Roboto-Bold',
    }),
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 52,
    fontSize: 45,
  },
  displayLarge: {
    fontFamily: Platform.select({
      web: 'Roboto-Bold, "Helvetica Neue", Helvetica, Arial, sans-serif',
      ios: 'System',
      default: 'Roboto-Bold',
    }),
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 64,
    fontSize: 57,
  },
  headlineSmall: {
    fontFamily: Platform.select({
      web: 'Roboto-Regular, "Helvetica Neue", Helvetica, Arial, sans-serif',
      ios: 'System',
      default: 'Roboto-Regular',
    }),
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 32,
    fontSize: 24,
  },
  headlineMedium: {
    fontFamily: Platform.select({
      web: 'Roboto-Regular, "Helvetica Neue", Helvetica, Arial, sans-serif',
      ios: 'System',
      default: 'Roboto-Regular',
    }),
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 36,
    fontSize: 28,
  },
  headlineLarge: {
    fontFamily: Platform.select({
      web: 'Roboto-Regular, "Helvetica Neue", Helvetica, Arial, sans-serif',
      ios: 'System',
      default: 'Roboto-Regular',
    }),
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 40,
    fontSize: 32,
  },
  titleSmall: {
    fontFamily: Platform.select({
      web: 'Roboto-Medium, "Helvetica Neue", Helvetica, Arial, sans-serif',
      ios: 'System',
      default: 'Roboto-Medium',
    }),
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 20,
    fontSize: 14,
  },
  titleMedium: {
    fontFamily: Platform.select({
      web: 'Roboto-Medium, "Helvetica Neue", Helvetica, Arial, sans-serif',
      ios: 'System',
      default: 'Roboto-Medium',
    }),
    fontWeight: '500',
    letterSpacing: 0.15,
    lineHeight: 24,
    fontSize: 16,
  },
  titleLarge: {
    fontFamily: Platform.select({
      web: 'Roboto-Regular, "Helvetica Neue", Helvetica, Arial, sans-serif',
      ios: 'System',
      default: 'Roboto-Regular',
    }),
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 28,
    fontSize: 22,
  },
  labelSmall: {
    fontFamily: Platform.select({
      web: 'Roboto-Medium, "Helvetica Neue", Helvetica, Arial, sans-serif',
      ios: 'System',
      default: 'Roboto-Medium',
    }),
    fontWeight: '500',
    letterSpacing: 0.5,
    lineHeight: 16,
    fontSize: 11,
  },
  labelMedium: {
    fontFamily: Platform.select({
      web: 'Roboto-Medium, "Helvetica Neue", Helvetica, Arial, sans-serif',
      ios: 'System',
      default: 'Roboto-Medium',
    }),
    fontWeight: '500',
    letterSpacing: 0.5,
    lineHeight: 16,
    fontSize: 12,
  },
  labelLarge: {
    fontFamily: Platform.select({
      web: 'Roboto-Medium, "Helvetica Neue", Helvetica, Arial, sans-serif',
      ios: 'System',
      default: 'Roboto-Medium',
    }),
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 20,
    fontSize: 14,
  },
  bodySmall: {
    fontFamily: Platform.select({
      web: 'Roboto-Regular, "Helvetica Neue", Helvetica, Arial, sans-serif',
      ios: 'System',
      default: 'Roboto-Regular',
    }),
    fontWeight: '400',
    letterSpacing: 0.4,
    lineHeight: 16,
    fontSize: 12,
  },
  bodyMedium: {
    fontFamily: Platform.select({
      web: 'Roboto-Regular, "Helvetica Neue", Helvetica, Arial, sans-serif',
      ios: 'System',
      default: 'Roboto-Regular',
    }),
    fontWeight: '400',
    letterSpacing: 0.25,
    lineHeight: 20,
    fontSize: 14,
  },
  bodyLarge: {
    fontFamily: Platform.select({
      web: 'Roboto-Regular, "Helvetica Neue", Helvetica, Arial, sans-serif',
      ios: 'System',
      default: 'Roboto-Regular',
    }),
    fontWeight: '400',
    letterSpacing: 0.15,
    lineHeight: 24,
    fontSize: 16,
  },
} as const;

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
  },
  fonts: configureFonts({ config: fontsConfig })
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
  },
  fonts: configureFonts({ config: fontsConfig })
};

export interface UserContextType {
  connectedUser: User;
  setConnectedUser: any;
}

export const connectedUserContext = createContext<UserContextType>({ connectedUser: new User(), setConnectedUser: null });

const App = () => {
  const config = {
    transitionSpec: {
      open: TransitionSpecs.TransitionIOSSpec,
      close: TransitionSpecs.TransitionIOSSpec,
    },
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  }

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [defaultRoute, setDefaultRoute] = useState<string>("Login")
  const [connectedUser, setConnectedUser] = useState<User>(new User())

  useEffect(function () {
    (async function () {
      if (!(await isLogedIn())) {
        setDefaultRoute("Login")
      } else {
        const pajeId = await getPajeId()
        let loggedUser: User = new User();
        if (pajeId) {
          const response = await getUserByPajeId(pajeId)
          loggedUser = response.data
          setConnectedUser(loggedUser)
        }

        console.log(loggedUser);


        if (loggedUser.profile == "PAJE_EMPLOYEUR") {
          const isContratConfigured = await isContratConfiguree()
          if (isContratConfigured) setDefaultRoute("Home")
          else setDefaultRoute("ElementsAMunirPage");
        } else {
          const contrats: any[] = await getContratByPajeIdUser(loggedUser.pajeId);
          if (!contrats.length) setDefaultRoute("NoContractScreen");
          else setDefaultRoute("SelectParentpage");
        }
      }
      setIsLoading(false)
    })();
  }, [])

  return (
    <PaperProvider theme={lightTheme}>
      <NavigationContainer>
        <connectedUserContext.Provider value={{ connectedUser, setConnectedUser }}>
          {
            isLoading ?
              <LoadingScreen></LoadingScreen>
              :
              <View style={styles.container}>
                <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={defaultRoute}>
                  <Stack.Screen options={{ cardShadowEnabled: true, ...config }} name="Login" component={Login} />
                  <Stack.Screen options={{ cardShadowEnabled: true, ...config }} name="ElementsAMunirPage" component={ElementsAMunirPage} />
                  <Stack.Screen options={{ cardShadowEnabled: true, ...config }} name="CompatibiliteDuContratPage" component={CompatibiliteeContrat} />
                  <Stack.Screen options={{ cardShadowEnabled: true, ...config }} name="NoContractScreen" component={NoContractScreen} />
                  <Stack.Screen options={{ cardShadowEnabled: true, ...config }} name="Home" component={HomePage} />
                  <Stack.Screen options={{ cardShadowEnabled: true, ...config }} name="ConfigurerContrat" component={ContractConfigurationComponent} />
                  <Stack.Screen name="CreerEvenementPage" component={CreerEvenementPage} options={{ cardShadowEnabled: true }} />
                  <Stack.Screen name="CreerAmplitudeEvenementPage" component={CreerAmplitudeEvenementPage} options={{ cardShadowEnabled: true }} />
                  <Stack.Screen name="CreerJourFerieTravaillPage" component={CreerJourFerieTravaillPage} options={{ cardShadowEnabled: true }} />
                  <Stack.Screen name="CreateIndemniteePage" component={CreateIndemniteePage} options={{ cardShadowEnabled: true }} />
                  <Stack.Screen name="CreerHeureComplementairePage" component={CreerHeureComplementairePage} options={{ cardShadowEnabled: true }} />
                  <Stack.Screen name="CreerPeriodeAdaptationPage" component={CreerPeriodeAdaptationPage} options={{ cardShadowEnabled: true }} />
                  <Stack.Screen options={{ cardShadowEnabled: true, ...config }} name="ContratProfile" component={ContratProfile} />
                  <Stack.Screen name="SelectParentpage" component={SelectParentpage} />
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
    color: 'black'
  },
});

export default App;