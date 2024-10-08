// HomePage.tsx
import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import PlanningScreen from './HomeScreens/PlanningScreen';
import LoadingScreen from '../../../components/loading/LoadingScreens';
import { NavigationProp } from '@react-navigation/native';
import ProfileScreen from './HomeScreens/ProfileScreen';
import { connectedUserContext, UserContextType } from '../../../../App';
import CongeScreen from './HomeScreens/CongesScreen/CongeScreen';
import { BaseRoute } from 'react-native-paper/lib/typescript/components/BottomNavigation/BottomNavigation';
import { Body as ContratType } from '../ConfigurerContratPage/classes';
import { getConfiguredContrat, getContratById, getContratByPajeIdParentAndSalarie, getDetailConfiguredContrat } from '../../../utils/contrat';

const DeclarationRoute = () => <Text>Declaration</Text>;

export interface ConfiguredContratContextProps {
  configuredContrat: ContratType;
  setConfiguredContrat: React.Dispatch<React.SetStateAction<ContratType>>;
}

export const configuredContratContext = React.createContext<ConfiguredContratContextProps>({
  configuredContrat: new ContratType(),
  setConfiguredContrat: () => { },
});

const HomePage = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: 'Planning',
      title: 'Planning',
      focusedIcon: 'calendar-month-outline',
      unfocusedIcon: 'calendar-month-outline'
    },
    {
      key: 'Declaration',
      title: 'Déclaration',
      focusedIcon: 'file-document',
      unfocusedIcon: 'file-document'
    },
    {
      key: 'Conges',
      title: 'Congés',
      focusedIcon: 'palm-tree',
      unfocusedIcon: 'palm-tree'
    },
    {
      key: 'Profile',
      title: 'Profile',
      focusedIcon: 'face-woman-profile',
      unfocusedIcon: 'face-woman-profile'
    },
  ]);

  const [dataLoaded, setDataLoaded] = React.useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = React.useState<boolean>(true);
  const [listeContrat, setListeContrat] = React.useState<ContratType[]>([]);
  const [refreshPlanningValue, setRefreshPlanningValue] = React.useState<Date>(new Date());
  const [refreshCongesValue, setRefreshCongesValue] = React.useState<number>(0);
  const [configuredContrat, setConfiguredContrat] = React.useState<ContratType>(new ContratType());

  const { connectedUser } = React.useContext<UserContextType>(connectedUserContext);

  const fetchContratEnfant = React.useCallback(async () => {
    setIsLoadingProfile(true);
    try {
      const listeContrats: ContratType[] = await getContratByPajeIdParentAndSalarie(
        configuredContrat.parent.pajeId,
        configuredContrat.assmat.pajeId
      );
      setListeContrat(listeContrats);
    } catch (error) {
      console.error('Error fetching contrat enfant:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [configuredContrat]);

  React.useEffect(() => {
    const initializeContrat = async () => {
      try {
        const contratId = await getConfiguredContrat();
        if (!contratId) {
          navigation.navigate(
            connectedUser.profile === "PAJE_EMPLOYEUR"
              ? "ElementsAMunirPage"
              : "SelectParentpage"
          );
          return;
        }

        const contratData: ContratType = await getDetailConfiguredContrat();
        setConfiguredContrat(contratData);
        setDataLoaded(true);
      } catch (error) {
        console.error('Error initializing contrat:', error);
      }
    };

    initializeContrat();
  }, [connectedUser, navigation]);

  const handleChangeIndex = React.useCallback((newIndex: number) => {
    setIndex(newIndex);
    if (newIndex === 3) {
      fetchContratEnfant();
    }
  }, [fetchContratEnfant]);

  const handleTabPress = React.useCallback(({ route }: { route: BaseRoute }) => {
    if (route.key === 'Profile') {
      fetchContratEnfant();
    } else if (route.key === 'Planning') {
      setRefreshPlanningValue(new Date());
    } else if (route.key === 'Conges') {
      setRefreshCongesValue(prev => prev + 1);
    }
  }, [fetchContratEnfant, refreshCongesValue]);

  const renderScene = React.useMemo(
    () =>
      BottomNavigation.SceneMap({
        Planning: () => <PlanningScreen refreshValue={refreshPlanningValue} />,
        Declaration: DeclarationRoute,
        Conges: () => <CongeScreen refreshValue={refreshCongesValue}></CongeScreen>,
        Profile: () => ( 
          <ProfileScreen
            isLoading={isLoadingProfile}
            setIsLoading={setIsLoadingProfile}
            listeContrat={listeContrat}
          />
        ),
      }),
    [refreshPlanningValue,refreshCongesValue, isLoadingProfile, listeContrat]
  );

  if (!dataLoaded) {
    return <LoadingScreen />;
  }

  return (
    <configuredContratContext.Provider value={{ configuredContrat, setConfiguredContrat }}>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={handleChangeIndex}
        onTabPress={handleTabPress}
        renderScene={renderScene}
        activeColor='#0088ff'
      />
    </configuredContratContext.Provider>
  );
};

export default HomePage;