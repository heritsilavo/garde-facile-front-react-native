import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import PlanningScreen from './HomeScreens/PlanningScreen';
import LoadingScreen from '../../../components/loading/LoadingScreens';
import User from '../../../models/user';
import { Body as ContratType } from '../ConfigurerContratPage/classes';
import { isLogedIn } from '../../../utils/user';
import { NavigationProp } from '@react-navigation/native';
import { getConfiguredContrat, getContratById } from '../../../utils/contrat';
import ProfileScreen from './HomeScreens/ProfileScreen';
import { connectedUserContext, UserContextType } from '../../../../App';
const DecalrationRoute = () => <Text>Decalration</Text>;

const CongesRoute = () => <Text>Conges</Text>;


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

  const [configuredContrat,setConfiguredContrat]= React.useState<ContratType>(new ContratType())

  const {connectedUser} = React.useContext<UserContextType>(connectedUserContext)

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

  const renderScene = BottomNavigation.SceneMap({
    Planning: PlanningScreen,
    Decalration: DecalrationRoute,
    Conges: CongesRoute,
    Profile: ProfileScreen,
  });

  return (
    dataLoaded ? 
      <configuredContratContext.Provider value={{configuredContrat,setConfiguredContrat}}>
        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
          activeColor='#0088ff'
        />
      </configuredContratContext.Provider>
    :
    <LoadingScreen></LoadingScreen>
  );
};

export default HomePage;