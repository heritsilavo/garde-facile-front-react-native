import { Planning, TrancheHoraire } from "../pages/connected/ConfigurerContratPage/classes";
import { SelectedMonth } from "../pages/connected/CreerEvenementPage/CreerEvenementPage";
import { Body as ContratEntity } from "../pages/connected/ConfigurerContratPage/classes";

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
    let dateDebutSemaine = new Date(premierJourDuMois);
    dateDebutSemaine.setDate(dateDebutSemaine.getDate() - dateDebutSemaine.getDay() + 1);

    let numeroSemaine = 0;
    while (dateDebutSemaine <= dernierJourDuMois && semaines.length < 6) {
        const dateFinSemaine = new Date(dateDebutSemaine);
        dateFinSemaine.setDate(dateFinSemaine.getDate() + 6);

        semaines.push({
            dateDebut: new Date(dateDebutSemaine),
            dateFin: new Date(dateFinSemaine),
            label: `Du ${dateDebutSemaine.getDate()} ${(getNomMois(dateFinSemaine.getMonth()) != getNomMois(dateDebutSemaine.getMonth())) ? getNomMois(dateDebutSemaine.getMonth()) : "" } au ${dateFinSemaine.getDate()} ${getNomMois(dateFinSemaine.getMonth())}`,
            numeroSemaine: numeroSemaine,
        });

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
    console.log("JOURS%%%: ",jours);
    
    var nbJoursDecompte = 0
    for (let i = 0; i <= jours; i++) {
        const jourCourant = new Date(debut);
        jourCourant.setDate(jourCourant.getDate() + i);
        const estPremierJour = i === 0;
        const estDernierJour = i === jours;

        console.log("->",jourCourant.toString(),"$$",(jourCourant.getDay() == 0) ? 6 : jourCourant.getDay() -1)
        if (indexJourChome) {
            const nbH = calculerHeuresPourUnJour(
                (jourCourant.getDay() == 0) ? 6 : jourCourant.getDay() -1,
                planning,
                estPremierJour && debutEvenementMidi,
                estDernierJour && finEvenementMidi,
                indexJourChome
            );
            heuresTotales += nbH
            if(nbH) nbJoursDecompte += 1
        } else {
            heuresTotales += calculerHeuresPourUnJour(
                jourCourant.getDay(),
                planning,
                estPremierJour && debutEvenementMidi,
                estDernierJour && finEvenementMidi
            );
        }
    }
    console.log("JOURSDECOMPTE%%%: ",nbJoursDecompte);

    return [nbJoursDecompte, heuresTotales];
}

function calculerHeuresPourUnJour(
    jourSemaine: number,
    planning: Planning[],
    debutMidi: boolean,
    finMidi: boolean,
    indexJourChome?:number[]
): number {
    
    const jourPlanning = planning.find(p => p.indexJour === jourSemaine);
    if (!jourPlanning) return 0;
    if (!!indexJourChome && indexJourChome.includes(jourPlanning.indexJour)) {
        return 0;
    }

    let heuresJour = 0;
    heuresJour += calculerHeuresTranche(jourPlanning.trancheHoraire1, debutMidi, finMidi);
    heuresJour += calculerHeuresTranche(jourPlanning.trancheHoraire2, debutMidi, finMidi);

    console.log("%%%: ",jourPlanning.indexJour,heuresJour);

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
    nbDay:number
    nbHour:number
}

//NATAO REFA NANAO PAGE CREER PERIODE APDAPTATION, le eo ambony otra tsy mety
export function getDecompteBetweenTwoDays(debut:string,fin:string,contrat:ContratEntity):Decompte {
    var result:Decompte = {nbDay:0,nbHour:0};

    const dateDebut = new Date(debut);
    const dateFin = new Date (fin);
    
    const listeJourChomes = contrat.indexJoursChomes
    const plannings = contrat.planning

    const dateList: Date[] = fillDateList(dateDebut,dateFin);
    
    dateList.forEach(date => {
        var planning = getPlanningForDay(date,plannings);
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
            result.nbHour+=(tranche1+tranche2)
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

const getPlanningForDay = function (date:Date,planning:Planning[]) {
    var res = planning.find((p => p.indexJour === getCustomDay(date)));
    return res || null
}