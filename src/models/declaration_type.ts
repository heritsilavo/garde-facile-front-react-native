export interface DeclarationType {
    id: number;
    uuid: string;
    annee: number;
    mois: number;
    methodeRemunerationCongesPayes: string;
    declaration_date: string;
    numeroPajeEmployeur: string;
    numeroPajeSalarie: string;
    indemnites: IndemniteType;
    infoPaje: InfoPajeType;
    absences: AssmatEtEnfantType;
    jours: JoursType;
    contrats: ContratType[];
    salaires: DeclaInfoSalaireType; // Ajout du type salaires
}

export interface InfoPajeType {
    dtPrelevementPrevisionnelle: string;
    dtVersementPrevisionnelle: string;
    mntApreleverParPaje: number;
    mntAverserParPaje: number;
    mntCotiEmplAcharge: number;
    mntCotiPriseEnChargeOdpf: number;
    mntCotisations: number;
    mntEmplAverserSalarie: number;
    mntEmplCmgRemuneration: number;
    mntImpotPas: number;
    mntSalaireNetApayerApresPas: number;
    mntSalaireNetImposable: number;
    txPas: number;
    dateVirement: string;
    indcDeclPajemploiPlus: boolean;
}

interface JourContrat {
    activite: number;
    activiteADeclarer: number;
    reels: number;
}

interface JourTotal {
    activite: number;
    activiteADeclarer: number;
    reels: number;
}

export interface JoursType {
    contrats: {
        [key: string]: JourContrat;
    };
    total: JourTotal;
}

interface IndemniteContrat {
    autres: number;
    entretien: number;
    kilometriques: number;
    repas: number;
    total: number;
}

export interface IndemniteType {
    contrats: {
        [key: string]: IndemniteContrat;
    };
    total: {
        autres: number;
        entretien: number;
        kilometriques: number;
        repas: number;
        total: number;
    };
}

interface AssmatAbsence {
    exceptionelles: number;
    maladie: number;
    payees: number;
    sansSolde: number;
}

interface EnfantAbsence {
    familiales: number;
    maladie: number;
}

export interface AssmatEtEnfantType {
    [key: string]: {
        assmat: AssmatAbsence;
        enfant: EnfantAbsence;
    };
}

export interface DeclarationContrat {
    id: string;
    declarationId: string;
    contratId: string;
}

export interface ContratType {
    id: string;
    enfant: string;
    methodeRemunerationCongesPayes: string;
}

// Définition du type pour 'salaires'
export interface DeclaInfoSalaireType {
    contrats: {
        [key: string]: DeclaInfoSalaireContrat;
    };
    total: DeclaInfoSalaireContrat;
}

// Définition des montants et heures pour salaires
export interface DeclaInfoMontantHeures {
    montant: number;
    nbHeures: number;
}

// Structure de déclaration de salaire pour chaque contrat
export interface DeclaInfoSalaireContrat {
    normal: DeclaInfoMontantHeures;
    congesPayes: {
        montant: number;
        nbJours: number;
    };
    majore: DeclaInfoMontantHeures;
    specifique: DeclaInfoMontantHeures;
    aVerser: number;
    net: number;
    complementaire: DeclaInfoMontantHeures;
}
