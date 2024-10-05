import { FamilleEvenement } from "./famille-evenement"

export interface EventType {
    titre: string;
    texte: string;
    famille: number;
    description: string;
}

export const TypeEvenement = {
    JOUR_FERIE: {
        titre: "Jour Férié",
        texte: "Jour férié",
        famille: FamilleEvenement.JOUR_FERIE,
        description: "Les jours fériés chômés sont rémunérés sauf s'ils tombent lors d'une période d'absence. Si travaillés, ils sont majorés de 10%. Le 1er mai est majoré de 100%."
    },
    SEMAINE_NON_TRAVAILLEE: {
        titre: "Semaine Non-Travaillée",
        texte: "Semaine non-travaillée",
        famille: FamilleEvenement.SEMAINE_NON_TRAVAILLEE,
        description: "Une semaine durant laquelle les employés ne sont pas tenus de travailler."
    },
    PERIODE_ADAPTATION: {
        titre: "Période d'Adaptation",
        texte: "Période d'adaptation",
        famille: FamilleEvenement.PERIODE_ADAPTATION,
        description: "Une période accordée pour permettre aux employés de s'adapter à un nouvel environnement ou à de nouvelles responsabilités."
    },
    HEURES_COMPLEMENTAIRES: {
        titre: "Heures Complémentaires",
        texte: "Heures complémentaires",
        famille: FamilleEvenement.HEURE_JOUR_COMPLEMENTAIRE,
        description: "Des heures de travail supplémentaires effectuées au-delà des heures normales."
    },
    JOURS_COMPLEMENTAIRES: {
        titre: "Jours Complémentaires",
        texte: "Jours complémentaires",
        famille: FamilleEvenement.HEURE_JOUR_COMPLEMENTAIRE,
        description: "Des jours supplémentaires de travail qui peuvent être rémunérés ou non."
    },
    INDEMNITES_REPAS: {
        titre: "Indemnités Repas",
        texte: "Repas",
        famille: FamilleEvenement.INDEMNITE,
        description: "Indemnités versées pour couvrir les frais de repas des employés pendant leurs heures de travail."
    },
    INDEMNITES_KM: {
        titre: "Indemnités Kilométriques",
        texte: "Kilométrique",
        famille: FamilleEvenement.INDEMNITE,
        description: "Indemnités versées pour couvrir les frais de déplacement en voiture personnelle pour des raisons professionnelles."
    },
    ENFANT_ABSENCE_FAMILIALE: {
        titre: "Absence Familiale",
        texte: "Absence familiale",
        famille: FamilleEvenement.ABSENCE_ENFANT,
        description: "Absence d'un parent pour s'occuper d'un enfant en raison de circonstances familiales."
    },
    ENFANT_ABSENCE_MALADIE: {
        titre: "Absence Maladie",
        texte: "Absence maladie",
        famille: FamilleEvenement.ABSENCE_ENFANT,
        description: "Absence d'un enfant en raison d'une maladie nécessitant des soins parentaux."
    },
    SALARIE_CONGES_MALADIE: {
        titre: "Congés Maladie",
        texte: "Congés maladie",
        famille: FamilleEvenement.ABSENCE_ASSMAT,
        description: "Congés pris par un salarié en raison d'une maladie ou d'une incapacité temporaire."
    },
    SALARIE_CONGES_PAYES: {
        titre: "Congés Payés",
        texte: "Congés payés",
        famille: FamilleEvenement.ABSENCE_ASSMAT,
        description: "Le salarié a droit a 2.5 jours de congées par mois. Donc 30jours(5 semmaines) par an"
    },
    SALARIE_CONGES_SANS_SOLDES: {
        titre: "Congés Sans Solde",
        texte: "Congés sans solde",
        famille: FamilleEvenement.ABSENCE_ASSMAT,
        description: "Congés durant lesquels le salarié ne reçoit pas de salaire."
    },
    SALARIE_CITOYEN_JDC: {
        titre: "Journée d'Appel de Préparation à la Défense (JAPD)",
        texte: "JAPD",
        famille: FamilleEvenement.ABSENCE_ASSMAT,
        description: "Participation à la Journée d'Appel de Préparation à la Défense (JAPD)."
    },
    SALARIE_PRO_FORMATION: {
        titre: "Formation Professionnelle",
        texte: "FORMATION",
        famille: FamilleEvenement.ABSENCE_ASSMAT,
        description: "Temps pris par un salarié pour suivre une formation professionnelle."
    },
    SALARIE_PARENTAL_MATERNITE: {
        titre: "Congé Maternité",
        texte: "MATERNITE",
        famille: FamilleEvenement.ABSENCE_ASSMAT,
        description: "Congé accordé à une mère après la naissance d'un enfant."
    },
    SALARIE_FAMILLE_NOUVEL_ENFANT: {
        titre: "Naissance ou Arrivée d'Enfant",
        texte: "NAISSANCE_OU_ARRIVEE_ENFANT",
        famille: FamilleEvenement.ABSENCE_ASSMAT,
        description: "Absence liée à la naissance ou à l'arrivée d'un nouvel enfant dans la famille."
    },
    SALARIE_FAMILLE_MARIAGE: {
        titre: "Mariage ou PACS",
        texte: "MARIAGE_OU_PACS",
        famille: FamilleEvenement.ABSENCE_ASSMAT,
        description: "Absence liée à la célébration du mariage ou du PACS."
    },
    SALARIE_FAMILLE_MARIAGE_ENFANT: {
        titre: "Mariage ou PACS Enfant",
        texte: "MARIAGE_OU_PACS_ENFANT",
        famille: FamilleEvenement.ABSENCE_ASSMAT,
        description: "Absence pour le mariage ou le PACS d'un enfant."
    },
    SALARIE_FAMILLE_DECES_CONJOINT: {
        titre: "Décès Conjoint/Partenaire/PACS/Concubin",
        texte: "DECES_EPOUX_PARTENAIRE_PACSE_CONCUBIN",
        famille: FamilleEvenement.ABSENCE_ASSMAT,
        description: "Absence due au décès du conjoint, partenaire PACS ou concubin."
    },
    SALARIE_FAMILLE_DECES_ENFANT: {
        titre: "Décès Enfant",
        texte: "DECES_ENFANT",
        famille: FamilleEvenement.ABSENCE_ASSMAT,
        description: "Absence due au décès d'un enfant."
    },
    SALARIE_FAMILLE_DECES_DESCENDANT: {
        titre: "Décès Descendant",
        texte: "DECES_DESCENDANT",
        famille: FamilleEvenement.ABSENCE_ASSMAT,
        description: "Absence due au décès d'un descendant (petit-enfant, etc.)."
    },
    SALARIE_FAMILLE_DECES_PARENT: {
        titre: "Décès Parent/Beau-Parent",
        texte: "DECES_PARENT_OU_BEAU_PARENT",
        famille: FamilleEvenement.ABSENCE_ASSMAT,
        description: "Absence due au décès d'un parent ou beau-parent."
    },
    SALARIE_FAMILLE_DECES_GRAN_PARENT: {
        titre: "Décès Grand-Parent",
        texte: "DECES_GRAND_PARENT",
        famille: FamilleEvenement.ABSENCE_ASSMAT,
        description: "Absence due au décès d'un grand-parent."
    },
    SALARIE_FAMILLE_DECES_FRATERNITE: {
        titre: "Décès Frère/Sœur",
        texte: "DECES_FRERE_OU_SOEUR",
        famille: FamilleEvenement.ABSENCE_ASSMAT,
        description: "Absence due au décès d'un frère ou d'une sœur."
    },
    SALARIE_FAMILLE_ANNONCE_HANDICAP: {
        titre: "Annonce Handicap Enfant",
        texte: "ANNONCE_HANDICAP_ENFANT",
        famille: FamilleEvenement.ABSENCE_ASSMAT,
        description: "Absence liée à l'annonce du handicap."
    }
}

export const TypeEvenementByFamille = {
    [FamilleEvenement.JOUR_FERIE]: [
        TypeEvenement.JOUR_FERIE
    ],
    [FamilleEvenement.SEMAINE_NON_TRAVAILLEE]: [
        TypeEvenement.SEMAINE_NON_TRAVAILLEE
    ],
    [FamilleEvenement.PERIODE_ADAPTATION]: [
        TypeEvenement.PERIODE_ADAPTATION
    ],
    [FamilleEvenement.HEURE_JOUR_COMPLEMENTAIRE]: [
        TypeEvenement.HEURES_COMPLEMENTAIRES,
        TypeEvenement.JOURS_COMPLEMENTAIRES
    ],
    [FamilleEvenement.INDEMNITE]: [
        TypeEvenement.INDEMNITES_REPAS,
        TypeEvenement.INDEMNITES_KM
    ],
    [FamilleEvenement.ABSENCE_ENFANT]: [
        TypeEvenement.ENFANT_ABSENCE_FAMILIALE,
        TypeEvenement.ENFANT_ABSENCE_MALADIE
    ],
    [FamilleEvenement.ABSENCE_ASSMAT]: [
        TypeEvenement.SALARIE_CONGES_MALADIE,
        TypeEvenement.SALARIE_CONGES_PAYES,
        TypeEvenement.SALARIE_CONGES_SANS_SOLDES,
        TypeEvenement.SALARIE_CITOYEN_JDC,
        TypeEvenement.SALARIE_PRO_FORMATION,
        TypeEvenement.SALARIE_PARENTAL_MATERNITE,
        TypeEvenement.SALARIE_FAMILLE_NOUVEL_ENFANT,
        TypeEvenement.SALARIE_FAMILLE_MARIAGE,
        TypeEvenement.SALARIE_FAMILLE_MARIAGE_ENFANT,
        TypeEvenement.SALARIE_FAMILLE_DECES_CONJOINT,
        TypeEvenement.SALARIE_FAMILLE_DECES_ENFANT,
        TypeEvenement.SALARIE_FAMILLE_DECES_DESCENDANT,
        TypeEvenement.SALARIE_FAMILLE_DECES_PARENT,
        TypeEvenement.SALARIE_FAMILLE_DECES_GRAN_PARENT,
        TypeEvenement.SALARIE_FAMILLE_DECES_FRATERNITE,
        TypeEvenement.SALARIE_FAMILLE_ANNONCE_HANDICAP
    ]
}

/**
 * Retrieves a list of event types based on the specified family identifier.
 *
 * @param {number} famille - The identifier for the family of events.
 * @returns {Array} - An array of event types associated with the given family.
 */
export function getListeTypesEvenementsByFamille(famille: number) {
    if (TypeEvenementByFamille[famille]) {
        return TypeEvenementByFamille[famille];
    } else {
        return [];
    }
}

/**
 * Recherche un type d'événement en fonction de son texte.
 *
 * @param {string} text - Le texte à rechercher.
 * @returns {EventType | null} - Un objet représentant le type d'événement, ou null si non trouvé.
 */
export function getTypeEventByText(text: string): EventType | null {
    var res = null
    Object.entries(TypeEvenement).forEach(([key, value]) => {
        if (value.texte === text) res = value
    });
    return res;
}

/**
 * Recherche un type d'événement en fonction du key.
 *
 * @param {string} text - Le key à rechercher.
 * @returns {EventType | null} - Un objet représentant le type d'événement, ou null si non trouvé.
 */
export function getTypeEventBykey(mykey: string): EventType | null {
    var res = null
    Object.entries(TypeEvenement).forEach(([key, value]) => {
        if (mykey === key) res = value
    });
    return res;
}


/**
 * Detarmine si un evenement est travaillée ou non
 * @param evenement 
 * @returns 
 */
export function isTravaille(evenement: EventType): boolean {
    // Liste des types d'événements considérés comme non travaillés
    const evenementsNonTravailles = [
        TypeEvenement.SEMAINE_NON_TRAVAILLEE,
        TypeEvenement.PERIODE_ADAPTATION,
        TypeEvenement.SALARIE_CONGES_MALADIE,
        TypeEvenement.SALARIE_CONGES_PAYES,
        TypeEvenement.SALARIE_CONGES_SANS_SOLDES,
        TypeEvenement.SALARIE_CITOYEN_JDC,
        TypeEvenement.SALARIE_PRO_FORMATION,
        TypeEvenement.SALARIE_PARENTAL_MATERNITE
    ];

    // Vérifier si l'événement est dans la liste des événements non travaillés
    if (evenementsNonTravailles.some(e => e.texte === evenement.texte)) {
        return false;
    }

    // Vérifier si l'événement appartient à la famille ABSENCE_ENFANT ou ABSENCE_ASSMAT
    if (evenement.famille === FamilleEvenement.ABSENCE_ENFANT ||
        evenement.famille === FamilleEvenement.ABSENCE_ASSMAT) {
        return false;
    }

    // Pour tous les autres types d'événements, on considère qu'ils sont travaillés
    return true;
}



/**
 * Détermine si un type d'événement est rémunéré.
 * 
 * @param {EventType} evenement - Le type d'événement à évaluer.
 * @returns {boolean} Retourne true si l'événement est rémunéré, false sinon.
 * 
 * @example
 * console.log(isRemunere(TypeEvenement.JOUR_FERIE)); // true
 * console.log(isRemunere(TypeEvenement.SALARIE_CONGES_SANS_SOLDES)); // false
 */
export function isRemunere(evenement: EventType): boolean {
    const evenementsNonRemuneres = [
        TypeEvenement.SEMAINE_NON_TRAVAILLEE,
        TypeEvenement.SALARIE_CONGES_SANS_SOLDES,
        TypeEvenement.SALARIE_CITOYEN_JDC,
        TypeEvenement.SALARIE_PRO_FORMATION
    ];

    if (evenementsNonRemuneres.some(e => e.texte === evenement.texte)) {
        return false;
    }

    // Les indemnités sont considérées comme une forme de rémunération
    if (evenement.famille === FamilleEvenement.INDEMNITE) {
        return true;
    }

    // Les absences liées aux enfants ne sont généralement pas rémunérées
    if (evenement.famille === FamilleEvenement.ABSENCE_ENFANT) {
        return false;
    }

    // Pour les absences de l'assistant maternel, on considère que seuls
    // les congés payés et certains événements familiaux sont rémunérés
    if (evenement.famille === FamilleEvenement.ABSENCE_ASSMAT) {
        const evenementsRemuneresAssmat = [
            TypeEvenement.SALARIE_CONGES_PAYES,
            TypeEvenement.SALARIE_CONGES_MALADIE,
            TypeEvenement.SALARIE_PARENTAL_MATERNITE,
            TypeEvenement.SALARIE_FAMILLE_MARIAGE,
            TypeEvenement.SALARIE_FAMILLE_MARIAGE_ENFANT,
            TypeEvenement.SALARIE_FAMILLE_DECES_CONJOINT,
            TypeEvenement.SALARIE_FAMILLE_DECES_ENFANT,
            TypeEvenement.SALARIE_FAMILLE_DECES_PARENT,
            TypeEvenement.SALARIE_FAMILLE_ANNONCE_HANDICAP
        ];
        return evenementsRemuneresAssmat.some(e => e.texte === evenement.texte);
    }

    // Par défaut, on considère que les autres types d'événements sont rémunérés
    return true;
}




/**
 * Récupère le type et le libellé en fonction du texte fourni dans l'objet EventType.
 *
 * Si `type.texte` appartient à un ensemble spécifique de valeurs, 
 * `typeRetournée` est défini en conséquence, et `libelléExceptionnel` est ajusté 
 * selon les règles définies.
 *
 * @param {EventType} type - L'objet contenant les informations sur l'événement.
 * @returns {{ typeRetournée: string, libelléExceptionnel: string|null }} - 
 * Un objet contenant le type retourné et un libellé exceptionnel, si applicable.
 */
export function getTypeAndLibele(type: EventType) {
    const congésPayés = ["Congés payés", "Congés sans solde", "Absence maladie", "Absence familiale", "Heures complémentaires", "Jours complémentaires", "Repas", "Kilométrique", "Période d'adaptation", "Jour férié", "Semaine non-travaillée", "Congés maladie"];
    const congésExceptionnels = ['NAISSANCE_OU_ARRIVEE_ENFANT', 'JAPD', 'MARIAGE_OU_PACS', 'MARIAGE_OU_PACS_ENFANT', 'DECES_EPOUX_PARTENAIRE_PACSE_CONCUBIN', 'DECES_ENFANT', 'DECES_DESCENDANT', 'DECES_PARENT_OU_BEAU_PARENT', 'DECES_FRERE_OU_SOEUR', 'DECES_GRAND_PARENT', 'ANNONCE_HANDICAP_ENFANT', 'FORMATION', 'MATERNITE'];

    let typeRetournée: string = type.texte;
    let libelléExceptionnel: string | null = null;

    if (congésExceptionnels.includes(type.texte)) {
        libelléExceptionnel = type.texte;
    }

    return { typeRetournée, libelléExceptionnel };
}