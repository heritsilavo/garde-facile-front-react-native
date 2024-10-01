import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import PlanningScreen from './HomeScreens/PlanningScreen';
import LoadingScreen from '../../../components/loading/LoadingScreens';
import User from '../../../models/user';
import { Body as ContratType } from '../ConfigurerContratPage/classes';
import { isLogedIn } from '../../../utils/user';
import { NavigationProp } from '@react-navigation/native';
import { getConfiguredContrat, getContratById, getContratByPajeIdParentAndSalarie, getDetailConfiguredContrat } from '../../../utils/contrat';
import ProfileScreen from './HomeScreens/ProfileScreen';
import { connectedUserContext, UserContextType } from '../../../../App';
import CongeScreen from './HomeScreens/CongesScreen/CongeScreen';
import { BaseRoute } from 'react-native-paper/lib/typescript/components/BottomNavigation/BottomNavigation';

const DecalrationRoute = () => <Text>Decalration</Text>;

const CongesRoute = () => <CongeScreen></CongeScreen>


export interface configuredContratContextProps{
  configuredContrat:ContratType;
  setConfiguredContrat: any;
}

export const configuredContratContext=React.createContext<configuredContratContextProps>({configuredContrat:new ContratType(), setConfiguredContrat:undefined});

const HomePage = ({ navigation }:{navigation:NavigationProp<any>}) => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'Planning', title: 'Planning', focusedIcon: 'calendar-month-outline', unfocusedIcon: 'calendar-month-outline'},
    { key: 'Decalration', title: 'Decalration', focusedIcon: 'file-document' },
    { key: 'Conges', title: 'Congés', focusedIcon: 'palm-tree' },
    { key: 'Profile', title: 'Profile', focusedIcon: 'face-woman-profile', unfocusedIcon: 'face-woman-profile' },
  ]);
  const [dataLoaded,setDataloaded] = React.useState(false)
  const [isLoadingProfile,setIsLoadingProfile] = React.useState<boolean>(true);
  const [ListeContrat, setListeContrat] = React.useState<ContratType[]>([])

  const [configuredContrat,setConfiguredContrat]= React.useState<ContratType>(new ContratType())

  const {connectedUser} = React.useContext<UserContextType>(connectedUserContext)

  const fetchContratEnfant = async () => {
    setIsLoadingProfile(true)
    
    const listeContrats: ContratType[] = await getContratByPajeIdParentAndSalarie(configuredContrat.parent.pajeId, configuredContrat.assmat.pajeId);
    setListeContrat(listeContrats);
    setIsLoadingProfile(false)
  }

  React.useEffect(function () {
    (async function () {
        const contratId:string = (await getConfiguredContrat()) || "";
        if(!contratId) {
          if (connectedUser.profile==="PAJE_EMPLOYEUR") {
            navigation.navigate("ElementsAMunirPage")
          } else{
            navigation.navigate("SelectParentpage")
          }
        }
        else{
          const response:ContratType = await getContratById(contratId);
          
          setConfiguredContrat(response);
          setDataloaded(true)
        }
    })();
  },[])

  const handleChangeIndex = (index:number) => {
    setIndex(index);
    if (index = 3) {
      fetchContratEnfant()
    }
  }

  const handleTabPress = function({route}:{route:BaseRoute}) {
    if (route.key === 'Profile') {
      fetchContratEnfant()
    }
  }

  const renderScene = BottomNavigation.SceneMap({
    Planning: PlanningScreen,
    Decalration: DecalrationRoute,
    Conges: CongesRoute,
    Profile: () => <ProfileScreen isLoading={isLoadingProfile} setIsLoading={setIsLoadingProfile} listeContrat={ListeContrat}/>,
  });

  return (
    dataLoaded ? 
      <configuredContratContext.Provider value={{configuredContrat,setConfiguredContrat}}>
        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={handleChangeIndex}
          onTabPress={handleTabPress}
          renderScene={renderScene}
          activeColor='#0088ff'
        />
      </configuredContratContext.Provider>
    :
    <LoadingScreen></LoadingScreen>
  );
};

export default HomePage;