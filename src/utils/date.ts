import { Planning, TrancheHoraire } from "../pages/connected/ConfigurerContratPage/classes";
import { SelectedMonth } from "../pages/connected/CreerEvenementPage/CreerEvenementPage";

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
            label: `Du ${dateDebutSemaine.getDate()} au ${dateFinSemaine.getDate()} ${getNomMois(dateFinSemaine.getMonth())}`,
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
    planning: Planning[]
): [number, number] {
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    debut.setHours(debutEvenementMidi ? 12 : 0, 0, 0, 0);
    fin.setHours(finEvenementMidi ? 12 : 23, 59, 59, 999);

    const jours = Math.floor((fin.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    let heuresTotales = 0;

    for (let i = 0; i < jours; i++) {
        const jourCourant = new Date(debut);
        jourCourant.setDate(jourCourant.getDate() + i);
        const estPremierJour = i === 0;
        const estDernierJour = i === jours - 1;

        heuresTotales += calculerHeuresPourUnJour(
            jourCourant.getDay(),
            planning,
            estPremierJour && debutEvenementMidi,
            estDernierJour && finEvenementMidi
        );
    }

    return [jours, heuresTotales];
}

function calculerHeuresPourUnJour(
    jourSemaine: number, 
    planning: Planning[], 
    debutMidi: boolean, 
    finMidi: boolean
): number {
    const jourPlanning = planning.find(p => p.indexJour === jourSemaine);
    if (!jourPlanning) return 0;

    let heuresJour = 0;
    heuresJour += calculerHeuresTranche(jourPlanning.trancheHoraire1, debutMidi, finMidi);
    heuresJour += calculerHeuresTranche(jourPlanning.trancheHoraire2, debutMidi, finMidi);

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