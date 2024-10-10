import { Planning, TrancheHoraire } from "../pages/connected/ConfigurerContratPage/classes";
import { SelectedMonth } from "../pages/connected/CreerEvenementPage/CreerEvenementPage";
import { Body as ContratEntity } from "../pages/connected/ConfigurerContratPage/classes";
import { getLoginToken, isLogedIn } from "./user";
import axios from "axios";
import { SPRING_BOOT_URL } from "../constants/api";
import { getConfiguredContrat } from "./contrat";

export interface Mois {
    year: number;
    monthIndex: number;
}

export interface Semaine {
    dateDebut: Date;
    dateFin: Date;
    label: string;
    numeroSemaine: number;
}

export function obtenirSemaines(mois: Mois): Semaine[] {
    const { year, monthIndex } = mois;
    const semaines: Semaine[] = [];
    const premierJourDuMois = new Date(year, monthIndex, 1);
    const dernierJourDuMois = new Date(year, monthIndex + 1, 0);
    
    // On commence par le premier jour du mois
    let dateDebutSemaine = new Date(premierJourDuMois);
    
    // Si le premier jour n'est pas un lundi, on ajuste au lundi de cette semaine
    if (dateDebutSemaine.getDay() !== 1) {
        dateDebutSemaine.setDate(dateDebutSemaine.getDate() - dateDebutSemaine.getDay() + 1);
    }

    let numeroSemaine = 0;
    while (dateDebutSemaine <= dernierJourDuMois) {
        const dateFinSemaine = new Date(dateDebutSemaine);
        dateFinSemaine.setDate(dateFinSemaine.getDate() + 6);

        // Ajuster la date de fin si elle dépasse le mois
        const dateFinAjustee = new Date(Math.min(dateFinSemaine.getTime(), dernierJourDuMois.getTime()));

        // N'ajouter la semaine que si elle commence dans le mois courant
        if (dateDebutSemaine <= dernierJourDuMois) {
            // Ajuster la date de début si elle est avant le début du mois
            const dateDebutAjustee = new Date(Math.max(dateDebutSemaine.getTime(), premierJourDuMois.getTime()));

            semaines.push({
                dateDebut: new Date(dateDebutAjustee),
                dateFin: new Date(dateFinAjustee),
                label: `Du ${dateDebutAjustee.getDate()} au ${dateFinAjustee.getDate()} ${getNomMois(dateFinAjustee.getMonth())}`,
                numeroSemaine: numeroSemaine,
            });
        }

        dateDebutSemaine.setDate(dateDebutSemaine.getDate() + 7);
        numeroSemaine++;
    }

    return semaines;
}

function getNomMois(index: number): string {
    const nomsMois = [
        "janvier", "février", "mars", "avril", "mai", "juin",
        "juillet", "août", "septembre", "octobre", "novembre", "décembre"
    ];
    return nomsMois[index];
}

export function calculerDifferenceAvecPlanning(
    debutEvenementMidi: boolean,
    finEvenementMidi: boolean,
    dateDebut: string,
    dateFin: string,
    planning: Planning[],
    indexJourChome?: number[]
): [number, number] {
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    debut.setHours(debutEvenementMidi ? 12 : 0, 0, 0, 0);
    fin.setHours(finEvenementMidi ? 12 : 23, 59, 59, 999);

    var jours = Math.floor((fin.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    let heuresTotales = 0;
    console.log("JOURS%%%: ", jours);

    var nbJoursDecompte = 0
    for (let i = 0; i <= jours; i++) {
        const jourCourant = new Date(debut);
        jourCourant.setDate(jourCourant.getDate() + i);
        const estPremierJour = i === 0;
        const estDernierJour = i === jours;

        console.log("->", jourCourant.toString(), "$$", (jourCourant.getDay() == 0) ? 6 : jourCourant.getDay() - 1)
        if (indexJourChome) {
            const nbH = calculerHeuresPourUnJour(
                (jourCourant.getDay() == 0) ? 6 : jourCourant.getDay() - 1,
                planning,
                estPremierJour && debutEvenementMidi,
                estDernierJour && finEvenementMidi,
                indexJourChome
            );
            heuresTotales += nbH
            if (nbH) nbJoursDecompte += 1
        } else {
            heuresTotales += calculerHeuresPourUnJour(
                jourCourant.getDay(),
                planning,
                estPremierJour && debutEvenementMidi,
                estDernierJour && finEvenementMidi
            );
        }
    }
    console.log("JOURSDECOMPTE%%%: ", nbJoursDecompte);

    return [nbJoursDecompte, heuresTotales];
}

function calculerHeuresPourUnJour(
    jourSemaine: number,
    planning: Planning[],
    debutMidi: boolean,
    finMidi: boolean,
    indexJourChome?: number[]
): number {

    const jourPlanning = planning.find(p => p.indexJour === jourSemaine);
    if (!jourPlanning) return 0;
    if (!!indexJourChome && indexJourChome.includes(jourPlanning.indexJour)) {
        return 0;
    }

    let heuresJour = 0;
    heuresJour += calculerHeuresTranche(jourPlanning.trancheHoraire1, debutMidi, finMidi);
    heuresJour += calculerHeuresTranche(jourPlanning.trancheHoraire2, debutMidi, finMidi);

    console.log("%%%: ", jourPlanning.indexJour, heuresJour);

    return heuresJour;
}

function calculerHeuresTranche(tranche: TrancheHoraire, debutMidi: boolean, finMidi: boolean): number {
    if (tranche.heureDebut === null || tranche.heureFin === null) return 0;

    let debut = tranche.heureDebut;
    let fin = tranche.heureFin;

    if (debutMidi) debut = Math.max(debut, 720);
    if (finMidi) fin = Math.min(fin, 720);

    return Math.max(0, (fin - debut) / 60);
}

export function getDebutFinMois(month: SelectedMonth): [string, string] {
    const dateFromMonth = new Date(month.year, month.monthIndex, 1);
    const dateToMonth = new Date(month.year, month.monthIndex + 1, 0);

    return [
        dateFromMonth.toISOString().split('T')[0],
        dateToMonth.toISOString().split('T')[0]
    ];
}

export function convertirEnMinutes(heure: number, minute: number): number {
    return heure * 60 + minute;
}

export function convertirEnHeuresMinutes(totalMinutes: number): { heure: number, minute: number } {
    const heure = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    return { heure, minute };
}

type Decompte = {
    nbDay: number
    nbHour: number
}

//NATAO REFA NANAO PAGE CREER PERIODE APDAPTATION, le eo ambony otra tsy mety
export function getDecompteBetweenTwoDays(debut: string, fin: string, contrat: ContratEntity): Decompte {
    var result: Decompte = { nbDay: 0, nbHour: 0 };

    const dateDebut = new Date(debut);
    const dateFin = new Date(fin);

    const listeJourChomes = contrat.indexJoursChomes
    const plannings = contrat.planning

    const dateList: Date[] = fillDateList(dateDebut, dateFin);

    dateList.forEach(date => {
        var planning = getPlanningForDay(date, plannings);
        if (!listeJourChomes.includes(getCustomDay(date)) && !!planning) {
            result.nbDay += 1
            var tranche1 = 0;
            var tranche2 = 0;
            if (planning.trancheHoraire1.heureDebut && planning.trancheHoraire1.heureFin) {
                tranche1 = Math.floor((planning.trancheHoraire1.heureFin - planning.trancheHoraire1.heureDebut) / 60)
            }
            if (planning.trancheHoraire2.heureDebut && planning.trancheHoraire2.heureFin) {
                tranche2 = Math.floor((planning.trancheHoraire2.heureFin - planning.trancheHoraire2.heureDebut) / 60)
            }
            result.nbHour += (tranche1 + tranche2)
        }
    });

    return result;
}

const fillDateList = function (dateDebut: Date, dateFin: Date): Date[] {
    const dateList: Date[] = [];
    const date = new Date(dateDebut);

    while (date <= dateFin) {
        dateList.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }

    return dateList;
};

const getCustomDay = (date: Date): number => {
    const day = date.getDay();
    return (day === 0) ? 6 : day - 1;
};

const getPlanningForDay = function (date: Date, planning: Planning[]) {
    var res = planning.find((p => p.indexJour === getCustomDay(date)));
    return res || null
}

export type PeriodeReference = {
    anneRef: number,
    dateDebut: Date,
    dateFin: Date
}

export interface Month {
    label: string;
    year: number;
    monthIndex: number;
}

export const getPeriodeReference = function (dateStr: string): PeriodeReference {
    var date = new Date(dateStr);
    var anneRef = (date.getMonth() < 6) ? (date.getFullYear() - 1) : date.getFullYear();
    var dateDebut = new Date(anneRef, 6, 1);
    var dateFin = new Date(anneRef + 1, 5, 31);
    return { anneRef, dateDebut, dateFin }
}

const getNbMonthBetween2Dates = function (debut: Date, fin: Date) {
    if (fin < debut) throw new Error("La date debut doit être avant la date de fin");

    const nbYear = fin.getFullYear() - debut.getFullYear();
    const nbMonth = (nbYear * 12) + (fin.getMonth() - debut.getMonth());

    return nbMonth;
}

const isBetween = function (date: Date, debut: Date, fin: Date): boolean {
    // Normaliser les dates en enlevant les heures/minutes/secondes
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const normalizedDebut = new Date(debut.getFullYear(), debut.getMonth(), debut.getDate());
    const normalizedFin = new Date(fin.getFullYear(), fin.getMonth(), fin.getDate());

    // Convertir en timestamps pour la comparaison
    const timestamp = normalizedDate.getTime();
    const debutTimestamp = normalizedDebut.getTime();
    const finTimestamp = normalizedFin.getTime();

    return timestamp >= debutTimestamp && timestamp <= finTimestamp;
}

const isBetweenWithoutDay = function (date: Date, debut: Date, fin: Date): boolean {
    // Normaliser les dates en enlevant les jours/heures/minutes/secondes
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const normalizedDebut = new Date(debut.getFullYear(), debut.getMonth(), 1);
    const normalizedFin = new Date(fin.getFullYear(), fin.getMonth(), 1);

    // Convertir en timestamps pour la comparaison
    const timestamp = normalizedDate.getTime();
    const debutTimestamp = normalizedDebut.getTime();
    const finTimestamp = normalizedFin.getTime();

    return timestamp >= debutTimestamp && timestamp <= finTimestamp;
}

export const generateMonths = function (contrat: ContratEntity) {
    const periodeReference: PeriodeReference = getPeriodeReference((new Date()).toISOString().split('T')[0]);

    const nbMonth = getNbMonthBetween2Dates(periodeReference.dateDebut, periodeReference.dateFin);
    console.log("NB MONTH: %%%", nbMonth);

    const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Sept.', 'Octobre', 'Nov.', 'Déc.'
    ];

    const listeMonth: Month[] = [];

    let currentDate = new Date(periodeReference.dateDebut);

    console.log("CONTRAT", contrat.dateDebut, contrat.dateFin);


    for (let i = 0; i < nbMonth; i++) {

        if (isBetweenWithoutDay(currentDate, new Date(contrat.dateDebut), new Date(contrat.dateFin))) {
            listeMonth.push({
                label: `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`,
                monthIndex: currentDate.getMonth(),
                year: currentDate.getFullYear()
            });
        }

        // Incrémenter le mois
        let newMonth = currentDate.getMonth() + 1;
        if (newMonth === 12) {
            currentDate.setFullYear(currentDate.getFullYear() + 1);
            currentDate.setMonth(0);
        } else {
            currentDate.setMonth(newMonth);
        }
    }

    console.log("Liste Month:", listeMonth);
    return listeMonth;
}

export const generateMonthsAsync = async function ():Promise<Month[]> {
    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken()
        const contratId = await getConfiguredContrat();
        const anee = getPeriodeReference((new Date()).toISOString().split('T')[0]).anneRef;
        if (!contratId) throw new Error("Aucun contrat configurée");
        else {
            const response = await axios.get(`${SPRING_BOOT_URL}/contrats/getListeMois/${contratId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    annee: anee
                }
            });
            return response.data
        }
    } else throw new Error("Vous n'etes pas connecté");
}

/**
 * Returns the name of a month given its index (1-12).
 * @param index - The index of the month (1 for January, 2 for February, etc.)
 * @param locale - Optional locale string (default is 'en-US')
 * @returns The name of the month or undefined if the index is out of range
 */
export function getMonthNameByIndex(index: number, locale: string = 'en-US'): string | undefined {
    if (index < 1 || index > 12) {
        return undefined;
    }

    const date = new Date(2000, index - 1, 1);
    return date.toLocaleString(locale, { month: 'long' });
}