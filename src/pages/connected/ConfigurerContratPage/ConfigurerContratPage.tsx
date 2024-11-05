import { NavigationProp, RouteProp } from '@react-navigation/native';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import RenderStep1 from './steps/step1';
import RenderStep2 from './steps/step2';
import { RemunerationCongesPayes, EnfantsAChargeSalarie, Assmat, Parent } from './classes'
import { ConfigContratData, Enfant, Planning, IndemniteType } from './classes';
import RenderStep3 from './steps/step3';
import RenderStep4 from './steps/step4';
import RenderStep5 from './steps/step5';
import RenderStep6 from './steps/step6';
import RenderStep7 from './steps/step7';
import RenderStep8 from './steps/step8';
import RenderStep9 from './steps/step9';
import { IndemniteEntity } from '../../../models/indemnites';
import RenderStep0 from './steps/step0';
import { connectedUserContext } from '../../../../App';
import User from '../../../models/user';
import { createIndemniteForContrat, generateId, saveConfiguredContrat, saveContratInDatabase } from '../../../utils/contrat';
import { Appbar } from 'react-native-paper';
import LoadingScreen from '../../../components/loading/LoadingScreens';

export const ConfigContratContext = createContext<{
  configContrat: ConfigContratData;
  setConfigContrat: React.Dispatch<React.SetStateAction<ConfigContratData>>;
} | null>(null);

export const indemniteEntityContext = createContext<{
  indemniteEntity: IndemniteEntity;
  setIndemniteEntity: React.Dispatch<React.SetStateAction<IndemniteEntity>>;
} | null>(null);

type RootStackParamList = {
  ConfigurerContrat: {
    assmat?: Assmat,
    parent?: Parent
  };
};

const ContractConfigurationComponent = ({ navigation, route }: { navigation: NavigationProp<any>, route: RouteProp<RootStackParamList, 'ConfigurerContrat'> }) => {
  const [step, setStep] = useState<number>(0);
  const [configContrat, setConfigContrat] = useState<ConfigContratData>(new ConfigContratData());
  const [indemniteEntity, setIndemniteEntity] = useState<IndemniteEntity>(new IndemniteEntity)
  const { connectedUser, setConnectedUser }: { connectedUser: User, setConnectedUser: any } | any = useContext(connectedUserContext)
  const [loading, setLoading] = useState<boolean>(false);

  const routeParams = route.params;

  //Add parent
  useEffect(function () {
    if (!!routeParams?.parent && !!routeParams?.assmat) {
      let newConfig: ConfigContratData = { ...configContrat };
      newConfig.body.parent = routeParams?.parent;
      newConfig.body.assmat = routeParams?.assmat;
      newConfig.body.numeroPajeEmployeur = routeParams?.parent.pajeId;
      newConfig.body.numeroPajeSalarie = routeParams?.assmat.pajeId;
      setConfigContrat(newConfig);
      setStep(1);
    }
    else {
      const parentEmployeur: Parent = new Parent();
      parentEmployeur.civilite = connectedUser.civilite
      parentEmployeur.dateNaissance = connectedUser.dateNaissance
      parentEmployeur.nom = connectedUser.nom
      parentEmployeur.prenom = connectedUser.prenom
      parentEmployeur.pajeId = connectedUser.pajeId

      let newConfig: ConfigContratData = { ...configContrat };
      newConfig.body.parent = parentEmployeur;
      newConfig.body.numeroPajeEmployeur = parentEmployeur.pajeId;
      setConfigContrat(newConfig)
    }
  }, [])


  //Step 0
  const setSelectedAssMat = function (assmat: Assmat) {
    let newConfig: ConfigContratData = { ...configContrat };
    newConfig.body.assmat = assmat;
    newConfig.body.numeroPajeSalarie = assmat.pajeId;
    setConfigContrat(newConfig)
  }

  //Step 1
  const setSelectedChild = function (child: Enfant) {
    let newConfig: ConfigContratData = { ...configContrat };
    newConfig.body.enfant = child;

    setConfigContrat(newConfig)
  }

  //Step 2
  const setDateDebut = function (date: string) {
    let newConfig: ConfigContratData = { ...configContrat };
    newConfig.body.dateDebut = date

    setConfigContrat(newConfig)
  }

  //Step 3
  const setSemmaindeDeGarde = function (type: "A"|"B", nbrSemmaine: number = 46) {
    let newConfig: ConfigContratData = { ...configContrat };
    newConfig.body.modeDeGarde = type;
    newConfig.body.nbSemainesTravaillees = nbrSemmaine;

    if (nbrSemmaine == 52) {
      newConfig.body.anneeComplete = true;
    }

    setConfigContrat(newConfig)
  }

  //Step 4
  const setRemunerationCongesPayes = function ({ mode, mois }: { mode: 'EN_JUIN' | 'LORS_PRISE_CONGES_PRINCIPAUX' | 'LORS_PRISE_CONGES', mois: number }) {
    let newConfig: ConfigContratData = { ...configContrat };
    newConfig.body.remunerationCongesPayes = new RemunerationCongesPayes({ mode, mois });
    setConfigContrat(newConfig)
  }

  //Step 5
  const setEnfantAChargeSalariee = function ({ nbEnfantsMoins15Ans, existent }: { nbEnfantsMoins15Ans: number, existent: boolean }) {
    let newConfig: ConfigContratData = { ...configContrat };
    newConfig.body.enfantsAChargeSalarie = new EnfantsAChargeSalarie({ existent, nbEnfantsMoins15Ans });
    setConfigContrat(newConfig)
  }

  //Step 6
  const setPlanning = function (plannings: Planning[], nbHeuresNormalesHebdo: number, nbHeuresNormalesMensu: number, nbJoursMensu: number, indexJourRepos: number, nbHeuresMajoreesHebdo: number, nbHeuresMajoreesMensu: number, nbHeuresSpecifiquesHebdo: number) {
    let newConfig: ConfigContratData = { ...configContrat };
    newConfig.body.planning = plannings;
    newConfig.body.nbHeuresNormalesHebdo = nbHeuresNormalesHebdo;
    newConfig.body.nbHeuresNormalesMensu = nbHeuresNormalesMensu;
    newConfig.body.nbJoursMensu = nbJoursMensu;
    newConfig.body.indexJourRepos = indexJourRepos
    newConfig.body.nbHeuresMajoreesHebdo = nbHeuresMajoreesHebdo
    newConfig.body.nbHeuresMajoreesMensu = nbHeuresMajoreesMensu
    newConfig.body.nbHeuresSpecifiquesHebdo = nbHeuresSpecifiquesHebdo
    setConfigContrat(newConfig)
  }

  //Step 7
  const setCodePostateAndJourFerie = (codePostale: string, jourFerie: string[]) => {
    let newConfig: ConfigContratData = { ...configContrat };
    newConfig.body.codePostal = codePostale;
    newConfig.body.joursFeriesTravailles = [...jourFerie];

    setConfigContrat(newConfig)
  }

  //Step 8
  const setSalaires = (salaireHoraireNet: number, salaireHoraireBrut: number, salaireHoraireComplementaireNet: number, salaireHoraireComplementaireBrut: number, salaireHoraireMajoreNet: number, salaireHoraireMajoreBrut: number, salaireMajore: number, salaireMensuelNet: number) => {
    let newConfig: ConfigContratData = { ...configContrat };
    newConfig.body.salaireHoraireBrut = salaireHoraireBrut;
    newConfig.body.salaireHoraireNet = salaireHoraireNet;
    newConfig.body.salaireHoraireComplementaireNet = salaireHoraireComplementaireNet;
    newConfig.body.salaireHoraireComplementaireBrut = salaireHoraireComplementaireBrut;
    newConfig.body.salaireHoraireMajoreNet = salaireHoraireMajoreNet;
    newConfig.body.salaireHoraireMajoreBrut = salaireHoraireMajoreBrut;
    newConfig.body.salaireMajore = salaireMajore;
    newConfig.body.salaireMensuelNet = salaireMensuelNet;

    setConfigContrat(newConfig)
  }

  //Step 9
  const setIndemnites = async (indemnite: IndemniteType) => {
    setLoading(true)
    let newContrat: ConfigContratData = { ...configContrat };
    newContrat.body.id = generateId()
    newContrat.body.optionRepasQuotidien = indemnite.optionRepasQuotidien;
    newContrat.body.dateCreation = (new Date()).toISOString();
    setConfigContrat(newContrat)
    //Save contrat
    const contratId = await saveContratInDatabase(newContrat);

    let newIndemniteEntity = new IndemniteEntity()
    newIndemniteEntity.uuid = generateId();
    newIndemniteEntity.contrat = contratId
    newIndemniteEntity.entretien = indemnite.entretien
    newIndemniteEntity.repas = indemnite.repas
    newIndemniteEntity.kilometrique = indemnite.kilometrique

    //Save indemnite
    const indemniteId = await createIndemniteForContrat(newIndemniteEntity);

    //Async storage
    await saveConfiguredContrat(contratId);

    setLoading(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }]
    })
  }

  const renderCurrentStep = () => {
    switch (step) {
      case 0: return <RenderStep0 setStep={setStep} setSelectedssmat={setSelectedAssMat} />;
      case 1: return <RenderStep1 setStep={setStep} setSelectedEnfant={setSelectedChild} />;
      case 2: return <RenderStep2 setStep={setStep} setDateDebut={setDateDebut} />;
      case 3: return <RenderStep3 setStep={setStep} setSemmaindeDeGarde={setSemmaindeDeGarde} />;
      case 4: return <RenderStep4 setStep={setStep} setModePayementConge={setRemunerationCongesPayes} />;
      case 5: return <RenderStep5 setStep={setStep} setEnfantAChargeSalariee={setEnfantAChargeSalariee} />;
      case 6: return <RenderStep6 setStep={setStep} setPlanning={setPlanning} />;
      case 7: return <RenderStep7 setStep={setStep} setCodePostateAndJourFerie={setCodePostateAndJourFerie} />;
      case 8: return <RenderStep8 setStep={setStep} setSalaires={setSalaires} />;
      case 9: return <RenderStep9 setStep={setStep} setIndemnites={setIndemnites} />;
      default: return null;
    }
  };

  if (loading) {
    return <LoadingScreen></LoadingScreen>
  }

  return (
    <indemniteEntityContext.Provider value={{ indemniteEntity, setIndemniteEntity }}>
      <ConfigContratContext.Provider value={{ configContrat, setConfigContrat }}>
        <View style={styles.container}>
          {((!routeParams?.parent && !routeParams?.assmat &&  step > 0) || (step > 1)) && (
            <Appbar.Header>
              <Appbar.BackAction onPress={() => setStep(step - 1)} />
            </Appbar.Header>
          )}
          <ScrollView contentContainerStyle={styles.content}>
            {
              renderCurrentStep()
            }
          </ScrollView>
        </View>
      </ConfigContratContext.Provider>
    </indemniteEntityContext.Provider>
  );
};

const styles = StyleSheet.create({
  appBar: {
    height: 35,
    width: '100%',
    borderBottomWidth: 0.3,
    borderBottomColor: '#f1f1f1'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
    height: "100%",
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ContractConfigurationComponent;