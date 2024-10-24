import { SelectedMonth } from "../pages/connected/CreerEvenementPage/CreerEvenementPage";

export interface JourFerie {
    type: string;
    text: string;
    date: string | null;
    month: number;
    getDate: (year: number) => string;
}

interface ListeJourFerieType {
    [key: string]: JourFerie;
}

export const ListeJourFerie: ListeJourFerieType = {
    JOUR_AN: {
        type: 'JOUR_AN',
        text: "Jour de l'An",
        date: "1er janvier",
        month: 0,
        getDate: (year: number) => `${year}-01-01`
    },
    PAQUES: {
        type: 'PAQUES',
        text: "Lundi de Pâques",
        date: null,
        month: 3, // Généralement en avril
        getDate: (year: number) => {
            // Calcul de la date de Pâques (algorithme de Meeus/Jones/Butcher)
            const a = year % 19;
            const b = Math.floor(year / 100);
            const c = year % 100;
            const d = Math.floor(b / 4);
            const e = b % 4;
            const f = Math.floor((b + 8) / 25);
            const g = Math.floor((b - f + 1) / 3);
            const h = (19 * a + b - d - g + 15) % 30;
            const i = Math.floor(c / 4);
            const k = c % 4;
            const l = (32 + 2 * e + 2 * i - h - k) % 7;
            const m = Math.floor((a + 11 * h + 22 * l) / 451);
            const month = Math.floor((h + l - 7 * m + 114) / 31);
            const day = ((h + l - 7 * m + 114) % 31) + 1;
            const easterDate = new Date(year, month - 1, day);
            const easterMonday = new Date(easterDate.setDate(easterDate.getDate() + 1));
            return easterMonday.toISOString().split('T')[0];
        }
    },
    FETE_TRAVAIL: {
        type: 'FETE_TRAVAIL',
        text: "Fête du Travail",
        date: "1er mai",
        month: 4,
        getDate: (year: number) => `${year}-05-01`
    },
    ARMISTICE: {
        type: 'ARMISTICE',
        text: "Armistice",
        date: "11 novembre",
        month: 10,
        getDate: (year: number) => `${year}-11-11`
    },
    ASCENSION: {
        type: 'ASCENSION',
        text: "Fête de l'Ascension",
        date: null,
        month: 4, // Généralement en mai
        getDate: (year: number) => {
            const easterDate = new Date(ListeJourFerie.PAQUES.getDate(year)!);
            const ascensionDate = new Date(easterDate.setDate(easterDate.getDate() + 39));
            return ascensionDate.toISOString().split('T')[0];
        }
    },
    PENTECOTE: {
        type: 'PENTECOTE',
        text: "Lundi de Pentecôte",
        date: null,
        month: 5, // Généralement en juin
        getDate: (year: number) => {
            const easterDate = new Date(ListeJourFerie.PAQUES.getDate(year)!);
            const pentecoteDate = new Date(easterDate.setDate(easterDate.getDate() + 50));
            return pentecoteDate.toISOString().split('T')[0];
        }
    },
    FETE_NATIONALE: {
        type: 'FETE_NATIONALE',
        text: "Fête Nationale",
        date: "14 juillet",
        month: 6,
        getDate: (year: number) => `${year}-07-14`
    },
    ASSOMPTION: {
        type: 'ASSOMPTION',
        text: "Assomption",
        date: "15 août",
        month: 7,
        getDate: (year: number) => `${year}-08-15`
    },
    TOUSSAINT: {
        type: 'TOUSSAINT',
        text: "Toussaint",
        date: "1er novembre",
        month: 10,
        getDate: (year: number) => `${year}-11-01`
    },
    ARMISTICE_1918: {
        type: 'ARMISTICE_1918',
        text: "Armistice 1918",
        date: "11 novembre",
        month: 10,
        getDate: (year: number) => `${year}-11-11`
    },
    NOEL: {
        type: 'NOEL',
        text: "Noël",
        date: "25 décembre",
        month: 11,
        getDate: (year: number) => `${year}-12-25`
    },
    SAINT_ETIENNE: {
        type: 'SAINT_ETIENNE',
        text: "Saint-Etienne",
        date: "26 décembre",
        month: 11,
        getDate: (year: number) => `${year}-12-26`
    },
    VENDREDI_SAINT: {
        type: 'VENDREDI_SAINT',
        text: "Vendredi Saint",
        date: null,
        month: 3, // Généralement en avril
        getDate: (year: number) => {
            const easterDate = new Date(ListeJourFerie.PAQUES.getDate(year)!);
            const vendrediSaintDate = new Date(easterDate.setDate(easterDate.getDate() - 3));
            return vendrediSaintDate.toISOString().split('T')[0];
        }
    },
    ABOLITION_ESCLAVAGE: {
        type: 'ABOLITION_ESCLAVAGE',
        text: "Abolition de l'esclavage",
        date: null,
        month: 4, // Date variable selon les régions
        getDate: (year: number) => {
            // Note: Cette date varie selon les régions. Ici, nous utilisons la date pour la Martinique à titre d'exemple.
            return `${year}-05-22`;
        }
    },
    JEUDI_MI_CAREME: {
        type: 'JEUDI_MI_CAREME',
        text: "Jeudi de la Mi-Carême",
        date: null,
        month: 2, // Généralement en mars
        getDate: (year: number) => {
            const easterDate = new Date(ListeJourFerie.PAQUES.getDate(year)!);
            const miCaremeDate = new Date(easterDate.setDate(easterDate.getDate() - 24));
            return miCaremeDate.toISOString().split('T')[0];
        }
    },
    ARRIVEE_EVANGILE: {
        type: 'ARRIVEE_EVANGILE',
        text: "Arrivée de l'Evangile",
        date: null,
        month: 2, // Date fixe à définir
        getDate: (year: number) => {
            // Note: Cette date est spécifique à la Polynésie française. Utilisons une date hypothétique.
            return `${year}-03-05`;
        }
    },
    FETE_AUTONOMIE: {
        type: 'FETE_AUTONOMIE',
        text: "Fête de l'autonomie",
        date: null,
        month: 5, // Date fixe à définir
        getDate: (year: number) => {
            // Note: Cette date est spécifique à la Polynésie française. Utilisons une date hypothétique.
            return `${year}-06-29`;
        }
    },
    SAINT_PIERRE_CHANEL: {
        type: 'SAINT_PIERRE_CHANEL',
        text: "Saint Pierre Chanel",
        date: null,
        month: 3, // 28 avril
        getDate: (year: number) => `${year}-04-28`
    },
    FETE_CITOYENNETE: {
        type: 'FETE_CITOYENNETE',
        text: "Fête de la citoyenneté",
        date: null,
        month: 6, // Date fixe à définir
        getDate: (year: number) => {
            // Note: Cette date est spécifique à la Nouvelle-Calédonie. Utilisons une date hypothétique.
            return `${year}-07-24`;
        }
    },
    FETE_DU_TERRITOIRE: {
        type: 'FETE_DU_TERRITOIRE',
        text: "Fête du Territoire",
        date: null,
        month: 6, // Date fixe à définir
        getDate: (year: number) => {
            // Note: Cette date est spécifique à Wallis-et-Futuna. Utilisons une date hypothétique.
            return `${year}-07-29`;
        }
    }
};

export function getJourFerieByType(type: string) {
    return ListeJourFerie[type];
}

export function getListeJourFerieByMonth(selectedMonth: SelectedMonth): JourFerie[] {
    const { year, monthIndex } = selectedMonth;

    return Object.values(ListeJourFerie).filter(jourFerie => {
        const date = jourFerie.getDate(year);
        if (date) {
            const [yearStr, monthStr] = date.split('-');
            const jourFerieMonth = parseInt(monthStr) - 1;
            return jourFerieMonth === monthIndex;
        }
        return false;
    });
}

export function getJourFerieByText(text: string): JourFerie | undefined {
    return Object.values(ListeJourFerie).find(jourFerie => jourFerie.text.toLowerCase() === text.toLowerCase());
}

export function getJourFerieByLabel(label: string): JourFerie | undefined {
    const holidays = [
        { code: "JOUR_AN", label: "Jour de l'An" },
        { code: "PAQUES", label: "Le Lundi de Pâques" },
        { code: "FETE_TRAVAIL", label: "Fête du travail" },
        { code: "ARMISTICE", label: "Armistice" },
        { code: "ASCENSION", label: "Fête de l'Ascension" },
        { code: "PENTECOTE", label: "Lundi de Pentecôte" },
        { code: "FETE_NATIONALE", label: "Fête Nationale" },
        { code: "ASSOMPTION", label: "Assomption" },
        { code: "TOUSSAINT", label: "Toussaint" },
        { code: "ARMISTICE_1918", label: "Armistice 1918" },
        { code: "NOEL", label: "Noël" },
        { code: "SAINT_ETIENNE", label: "Saint-Etienne" },
        { code: "VENDREDI_SAINT", label: "Vendredi Saint" },
        { code: "ABOLITION_ESCLAVAGE", label: "Abolition de l'esclavage" },
        { code: "JEUDI_MI_CAREME", label: "Jeudi de la Mi-Carême" },
        { code: "ARRIVEE_EVANGILE", label: "Arrivée de l'Evangile" },
        { code: "FETE_AUTONOMIE", label: "Fête de l'autonomie" },
        { code: "SAINT_PIERRE_CHANEL", label: "Saint Pierre Chanel" },
        { code: "FETE_CITOYENNETE", label: "Fête de la citoyenneté" },
        { code: "FETE_DU_TERRITOIRE", label: "Fête du Territoire" }
    ];

    const foundHoliday = holidays.find(holiday => holiday.label === label);

    if (foundHoliday) {
        return ListeJourFerie[foundHoliday.code as keyof ListeJourFerieType];
    }

    return undefined; // Retourne undefined si aucun jour férié trouvé
}


export const getListeJourFerieByText = function (liste:string[]):JourFerie[] {
    const res:JourFerie[] = [];
    liste.forEach(element => {
        var jf = getJourFerieByText(element);
        if (jf) {
            res.push(jf);
        }
    });

    return res;
}