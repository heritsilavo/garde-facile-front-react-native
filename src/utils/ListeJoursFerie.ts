export interface JourFerie {
    type: string;
    text: string;
    date: string | null;
}

interface ListeJourFerie {
    [key: string]: JourFerie;
}

export const ListeJourFerie: ListeJourFerie = {
    JOUR_AN: {
      type: 'JOUR_AN',
      text: "Jour de l'An",
      date: "1er janvier"
    },
    PAQUES: {
      type: 'PAQUES',
      text: "Lundi de Pâques",
      date: null
    },
    FETE_TRAVAIL: {
      type: 'FETE_TRAVAIL',
      text: "Fête du Travail",
      date: "1er mai"
    },
    ARMISTICE: {
      type: 'ARMISTICE',
      text: "Armistice",
      date: "11 novembre"
    },
    ASCENSION: {
      type: 'ASCENSION',
      text: "Fête de l'Ascension",
      date: null
    },
    PENTECOTE: {
      type: 'PENTECOTE',
      text: "Lundi de Pentecôte",
      date: null
    },
    FETE_NATIONALE: {
      type: 'FETE_NATIONALE',
      text: "Fête Nationale",
      date: null
    },
    ASSOMPTION: {
      type: 'ASSOMPTION',
      text: "Assomption",
      date: "15 août"
    },
    TOUSSAINT: {
      type: 'TOUSSAINT',
      text: "Toussaint",
      date: "1er novembre"
    },
    ARMISTICE_1918: {
      type: 'ARMISTICE_1918',
      text: "Armistice 1918",
      date: "11 novembre"
    },
    NOEL: {
      type: 'NOEL',
      text: "Noël",
      date: "25 décembre"
    },
    SAINT_ETIENNE: {
      type: 'SAINT_ETIENNE',
      text: "Saint-Etienne",
      date: "26 décembre"
    },
    VENDREDI_SAINT: {
      type: 'VENDREDI_SAINT',
      text: "Vendredi Saint",
      date: null
    },
    ABOLITION_ESCLAVAGE: {
      type: 'ABOLITION_ESCLAVAGE',
      text: "Abolition de l'esclavage",
      date: null
    },
    JEUDI_MI_CAREME: {
      type: 'JEUDI_MI_CAREME',
      text: "Jeudi de la Mi-Carême",
      date: null
    },
    ARRIVEE_EVANGILE: {
      type: 'ARRIVEE_EVANGILE',
      text: "Arrivée de l'Evangile",
      date: null
    },
    FETE_AUTONOMIE: {
      type: 'FETE_AUTONOMIE',
      text: "Fête de l'autonomie",
      date: null
    },
    SAINT_PIERRE_CHANEL: {
      type: 'SAINT_PIERRE_CHANEL',
      text: "Saint Pierre Chanel",
      date: null
    },
    FETE_CITOYENNETE: {
      type: 'FETE_CITOYENNETE',
      text: "Fête de la citoyenneté",
      date: null
    },
    FETE_DU_TERRITOIRE: {
      type: 'FETE_DU_TERRITOIRE',
      text: "Fête du Territoire",
      date: null
    }
};

export function getJourFerieByType(type: string) {
    return ListeJourFerie[type];
}
