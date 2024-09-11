import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { TransitionSpecs } from '@react-navigation/stack';

import Login from './src/pages/auth/Login';
import HomePage from './src/pages/connected/Home/Home'
import ElementsAMunirPage from './src/pages/ElementsAMunirPage/ElementsAMunirPage';
import CompatibiliteeContrat from './src/pages/CompatibiliteeContrat/CompatibiliteeContrat';
import ContractConfigurationComponent from './src/pages/connected/ConfigurerContratPage/ConfigurerContratPage';


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

const App = () => {
  const config={
    transitionSpec: {
      open: TransitionSpecs.TransitionIOSSpec,
      close: TransitionSpecs.TransitionIOSSpec,
    },
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  }

  return (
    <PaperProvider theme={lightTheme}>
      <NavigationContainer>
        <View style={styles.container}>
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="ConfigurerContrat">
            
            <Stack.Screen options={{ cardShadowEnabled: true, ...config}} name="Login" component={Login} />
            <Stack.Screen options={{ cardShadowEnabled: true, ...config}} name="ElementsAMunirPage" component={ElementsAMunirPage} />
            <Stack.Screen options={{ cardShadowEnabled: true, ...config}} name="CompatibiliteDuContratPage" component={CompatibiliteeContrat} />
            <Stack.Screen options={{ cardShadowEnabled: true }} name="ConfigurerContrat" component={ContractConfigurationComponent} />
            <Stack.Screen options={{ cardShadowEnabled: true }} name="Home" component={HomePage} />
            {/*
            <Stack.Screen options={{ cardShadowEnabled: true }} name="PdfViewer">
              {(props) => <PdfViewer {...props} />}
            </Stack.Screen> */}
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Fond noir
  },
});

export default App;
