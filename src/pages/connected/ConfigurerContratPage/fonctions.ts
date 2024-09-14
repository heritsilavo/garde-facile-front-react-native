import { Planning } from "./classes";

const SAMEDI_INDEX = 5;
const SEUIL_NB_HEURES_NORMALES_HEBDO = 2760; // 46 heures * 60 minutes

/**
 * Calcul du nombre d'heures et de jours travaillés par semaine et mois.
 * @param data Le planning des jours travaillés
 * @param nbSemainesTravailleesParAn Nombre de semaines travaillées par an
 * @param indexJoursRepos L'index du jour de repos
 * @returns [heures hebdomadaires, heures mensuelles, jours mensuels, heures majorées hebdomadaires, heures spécifiques hebdomadaires, heures majorées mensuelles]
 */
export function calculateNbHoursAndDays(data: Planning[], nbSemainesTravailleesParAn: number | undefined, indexJoursRepos: number) {

  if (data.length > 0) {
    
    // Semaine normale
    let totalMinutesParSemaine = 0;
    let { week, weekEnd } = separeWeekAndWeekEndAndRemoveJoursRepos(data, indexJoursRepos);
    
    week.forEach((planningJour: Planning) => {
      totalMinutesParSemaine += getNbMinutesParJour(planningJour);
    });

    // Heures majorées
    let nbMinutesMajoreesHebdo = 0;
    if (totalMinutesParSemaine > SEUIL_NB_HEURES_NORMALES_HEBDO) {
      nbMinutesMajoreesHebdo = totalMinutesParSemaine - SEUIL_NB_HEURES_NORMALES_HEBDO;
      totalMinutesParSemaine = SEUIL_NB_HEURES_NORMALES_HEBDO;
    }

    // Heures spécifiques : heures travaillées les week-ends
    let nbMinutesSpecifiquesHebdo = 0;
    if (!!weekEnd.length) {
      weekEnd.forEach((planningJour: Planning) => {
        nbMinutesSpecifiquesHebdo += getNbMinutesParJour(planningJour);
      });
    }

    const nbSemainesTravaillees = nbSemainesTravailleesParAn || 52;

    // Heures majorées par mois
    let nbHeuresMajoreesMensu = Math.floor((nbMinutesMajoreesHebdo * nbSemainesTravaillees) / (12 * 60));

    // Calcul des heures par mois en moyenne
    const nbHeureParMois = Math.floor((totalMinutesParSemaine * nbSemainesTravaillees) / (12 * 60));

    // Calcul du nombre de jours travaillés par mois
    const nbJoursParMois = Math.floor((week.length * nbSemainesTravaillees) / 12);

    return [totalMinutesParSemaine / 60, nbHeureParMois, nbJoursParMois, nbMinutesMajoreesHebdo / 60, nbMinutesSpecifiquesHebdo / 60, nbHeuresMajoreesMensu];
  }

  return [0, 0, 0, 0, 0, 0];
};

/**
 * Sépare la semaine du week-end et enlève les jours de repos
 * @param data Le planning de la semaine
 * @param indexJourRepos L'index du jour de repos
 * @returns {week, weekEnd} Semaine sans week-end et jour de repos
 */
function separeWeekAndWeekEndAndRemoveJoursRepos(data: Planning[], indexJourRepos: number) {
  let week = [...data];
  
  // Enlever les jours de repos
  let iJoursRepos = -1;
  week.forEach((element, i) => {
    if (element.indexJour === indexJourRepos) iJoursRepos = i;
  });
  if (iJoursRepos !== -1) week.splice(iJoursRepos, 1);

  // Séparer et enregistrer le week-end
  let weekEndStart = -1;
  let weekEnd: Planning[] = [];
  week.forEach((element, i) => {
    if (element.indexJour === SAMEDI_INDEX) weekEndStart = i;
  });
  if (weekEndStart !== -1) weekEnd = week.splice(weekEndStart);

  return { week, weekEnd };
}

/**
 * Convertit une heure au format 'HH:mm' en nombre total de minutes.
 * @param hour L'heure en format 'HH:mm'
 * @returns Le nombre total de minutes
 */
const hourToTotalMinutes = (hour: string): number => {
  const [hours, minutes] = hour.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Retourne le nombre de minutes travaillées pour une journée
 * @param JPlanning Le planning du jour
 * @returns Le nombre total de minutes travaillées dans la journée
 */
const getNbMinutesParJour = function (JPlanning: Planning) {
  let nbMinutesDuJour = 0;

  // Calcul des minutes pour trancheHoraire1
  if (!!JPlanning.trancheHoraire1.heureDebut && !!JPlanning.trancheHoraire1.heureFin) {
    nbMinutesDuJour += JPlanning.trancheHoraire1.heureFin - JPlanning.trancheHoraire1.heureDebut;
  }

  // Si trancheHoraire2 est présente, on l'ajoute
  if (!!JPlanning.trancheHoraire2.heureDebut && !!JPlanning.trancheHoraire2.heureFin) {
    nbMinutesDuJour += JPlanning.trancheHoraire2.heureFin - JPlanning.trancheHoraire2.heureDebut;
  }

  return nbMinutesDuJour;
};
