import { Planning } from "./classes";

const SAMEDI_INDEX = 5;
const SEUIL_NB_HEURES_NORMALES_HEBDO = 46;

export function calculateNbHoursAndDays(data: Planning[],nbSemainesTravailleesParAn: number | undefined, indexJoursRepos:number) {


if (data.length > 0) {
    
    //Semmaine normale
    let totalHeuresParSemmaine = 0;
    let {week,weekEnd} = separeWeekAndWeekEndAndRemoveJoursRepos(data,indexJoursRepos)
    week.forEach((planningJour: Planning) => {
      totalHeuresParSemmaine += getNbHeureParJour(planningJour);
    });

    //Majore
    let nbHeuresMajoreesHebdo = 0
    if (totalHeuresParSemmaine > SEUIL_NB_HEURES_NORMALES_HEBDO) {
      nbHeuresMajoreesHebdo = totalHeuresParSemmaine - SEUIL_NB_HEURES_NORMALES_HEBDO
      totalHeuresParSemmaine=SEUIL_NB_HEURES_NORMALES_HEBDO
    }

    //Heures Specifiques: heures travaillé les weekends
    let nbHeuresSpecifiquesHebdo= 0
    if (!!weekEnd.length) {
      weekEnd.forEach((planningJour: Planning) => {
        nbHeuresSpecifiquesHebdo += getNbHeureParJour(planningJour);
      });
    }

    const nbSemainesTravaillees = nbSemainesTravailleesParAn || 52;

    //nbHeuresMajoreesMensu
    let nbHeuresMajoreesMensu = Math.floor((nbHeuresMajoreesHebdo * nbSemainesTravaillees) / 12)


    // Calcul des heures par mois en moyenne (nbSemainesTravaillees divisé par 12)
    const nbHeureParMois = Math.floor((totalHeuresParSemmaine * nbSemainesTravaillees) / 12);

    // Calcul du nombre de jours travaillés par mois
    const nbJoursParMois = Math.floor((week.length * nbSemainesTravaillees) / 12);

    return [totalHeuresParSemmaine, nbHeureParMois, nbJoursParMois,nbHeuresMajoreesHebdo,nbHeuresSpecifiquesHebdo, nbHeuresMajoreesMensu];
  }

  return [0, 0, 0, 0, 0, 0];
};

/**
 * Separe le weekend du week
 * @param data 
 * @returns {Planning[],Planning[]}
 */
function separeWeekAndWeekEndAndRemoveJoursRepos(data:Planning[],indexJourRepos:number){
    let week = [...data]
    
    //Remove jours repos
    let iJoursRepos = -1
    week.forEach((element,i) => {
      if(element.indexJour == indexJourRepos) iJoursRepos = i
    });
    if(iJoursRepos != -1) week.splice(iJoursRepos,1);

    //Remove and save weekend from 'week'
    let weekEndStart = -1;
    let weekEnd:Planning[]=[]
    week.forEach((element,i) => {
      if(element.indexJour == SAMEDI_INDEX) weekEndStart=i;
    });
    if(weekEndStart!=-1) weekEnd=week.splice(weekEndStart);

    return {week,weekEnd}
}



/**
 * Retourne le nombre d'heure pour une journee
 */
const getNbHeureParJour = function (JPlanning:Planning) {
  let nbHduJ = 0

  // Calcul des heures pour trancheHoraire1 (en millisecondes, donc division par 3600000)
  if (!!JPlanning.trancheHoraire1.heureDebut && !!JPlanning.trancheHoraire1.heureFin) {
    nbHduJ += (JPlanning.trancheHoraire1.heureFin - JPlanning.trancheHoraire1.heureDebut) / 3600000;
  }

  // Si trancheHoraire2 est présente, on l'ajoute
  if (!!JPlanning.trancheHoraire2.heureDebut && !!JPlanning.trancheHoraire2.heureFin) {
    nbHduJ += (JPlanning.trancheHoraire2.heureFin - JPlanning.trancheHoraire2.heureDebut) / 3600000;
  }

  return nbHduJ
}