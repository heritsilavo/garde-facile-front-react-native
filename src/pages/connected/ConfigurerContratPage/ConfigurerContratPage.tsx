import { NavigationProp } from '@react-navigation/native';
import React, { createContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import RenderStep1 from './steps/step1';
import RenderStep2 from './steps/step2';
import { ConfigContratData, Enfant, Planning } from './classes';
import RenderStep3 from './steps/step3';
import RenderStep4 from './steps/step4';
import { RemunerationCongesPayes,EnfantsAChargeSalarie } from './classes'
import RenderStep5 from './steps/step5';
import RenderStep6 from './steps/step6';
import RenderStep7 from './steps/step7';

export const ConfigContratContext = createContext<{
  configContrat: ConfigContratData;
  setConfigContrat: React.Dispatch<React.SetStateAction<ConfigContratData>>;
} | null>(null);


const ContractConfigurationComponent = ({ navigation }:{navigation:NavigationProp<any>}) => {
  const [step, setStep] = useState<number>(7);
  const [configContrat, setConfigContrat] = useState<ConfigContratData>(new ConfigContratData());

  //Step 1
  const setSelectedChild = function(child:Enfant) {
    let newConfig:ConfigContratData = {...configContrat};
    newConfig.body.enfant = child;

    setConfigContrat(newConfig)
  }

  //Step 2
  const setDateDebut = function(date:string) {
    let newConfig:ConfigContratData = {...configContrat};
    newConfig.body.dateDebut = date
    
    setConfigContrat(newConfig)
  }

  //Step 3
  const setSemmaindeDeGarde = function(type:string,nbrSemmaine:number=46) {
    let newConfig:ConfigContratData = {...configContrat};
    newConfig.body.modeDeGarde = type;
    newConfig.body.nbSemainesTravaillees = nbrSemmaine;
    
    if (nbrSemmaine==52) {
      newConfig.body.anneeComplete = true;
    }

    setConfigContrat(newConfig)
  }

  //Step 4
  const setRemunerationCongesPayes = function({mode,mois}:{mode:string,mois:number}) {
    let newConfig:ConfigContratData = {...configContrat};
    newConfig.body.remunerationCongesPayes = new RemunerationCongesPayes({mode,mois});
    setConfigContrat(newConfig)
  }

  //Step 5
  const setEnfantAChargeSalariee = function ({nbEnfantsMoins15Ans,existent}:{nbEnfantsMoins15Ans:number, existent:boolean}) {
    let newConfig:ConfigContratData = {...configContrat};
    newConfig.body.enfantsAChargeSalarie = new EnfantsAChargeSalarie({existent,nbEnfantsMoins15Ans});
    setConfigContrat(newConfig)
  }

  //Step 6
  const setPlanning = function (plannings: Planning[],nbHeuresNormalesHebdo:number,nbHeuresNormalesMensu:number,nbJoursMensu:number,indexJourRepos:number,nbHeuresMajoreesHebdo:number,nbHeuresMajoreesMensu:number,nbHeuresSpecifiquesHebdo:number) {
    let newConfig:ConfigContratData = {...configContrat};
    newConfig.body.planning = plannings;
    newConfig.body.nbHeuresNormalesHebdo = nbHeuresNormalesHebdo;
    newConfig.body.nbHeuresNormalesMensu = nbHeuresNormalesMensu;
    newConfig.body.nbJoursMensu = nbJoursMensu;
    newConfig.body.indexJourRepos = indexJourRepos
    newConfig.body.nbHeuresMajoreesHebdo = nbHeuresMajoreesHebdo
    newConfig.body.nbHeuresMajoreesMensu = nbHeuresMajoreesMensu
    newConfig.body.nbHeuresSpecifiquesHebdo = nbHeuresSpecifiquesHebdo
    console.log(newConfig.body);
    
    setConfigContrat(newConfig)
  }

  //Step 7
  const setCodePostateAndJourFerie=  (codePostale:string,jourFerie:string[]) => {

  }
  
  const renderCurrentStep = () => {
    switch (step) {
      case 1: return <RenderStep1 setStep={setStep} setSelectedEnfant={setSelectedChild}/>;
      case 2: return <RenderStep2 setStep={setStep} setDateDebut={setDateDebut} />;
      case 3: return <RenderStep3 setStep={setStep} setSemmaindeDeGarde={setSemmaindeDeGarde} />;
      case 4: return <RenderStep4 setStep={setStep} setModePayementConge={setRemunerationCongesPayes} />;
      case 5: return <RenderStep5 setStep={setStep}  setEnfantAChargeSalariee={setEnfantAChargeSalariee} />;
      case 6: return <RenderStep6 setStep={setStep}  setPlanning={setPlanning} />;
      case 7: return <RenderStep7 setStep={setStep}  setCodePostateAndJourFerie={setCodePostateAndJourFerie} />;
      default: return null;
    }
  };

  return (
    <ConfigContratContext.Provider value={{ configContrat, setConfigContrat }}>
      <View style={styles.container}>
        <View style={{...styles.appBar,display:(step==1)?'none':'flex'}}>
          <TouchableOpacity onPress={()=>(setStep(()=>(step-1)))}>
            <Text style={{color:'#007AFF'}}> {'< Retour'} </Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          {renderCurrentStep()}
        </ScrollView>
        <TouchableOpacity 
          style={{...styles.button,display:([1,2,3,4,5,6,7].includes(step)?'none':'flex')}} 
          onPress={() => {
            console.log(configContrat);
          }}
        >
          <Text style={styles.buttonText}>Continuer</Text>
        </TouchableOpacity>
      </View>
    </ConfigContratContext.Provider>
    
  );
};

const styles = StyleSheet.create({
  appBar:{
    height:35,
    width:'100%',
    borderBottomWidth:0.3,
    borderBottomColor:'#f1f1f1'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
    height:"100%",
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