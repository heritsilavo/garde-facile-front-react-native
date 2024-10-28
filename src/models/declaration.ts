interface MontantHeures {
    montant: number;
    nbHeures: number;
}

interface MontantJours {
    montant: number;
    nbJours: number;
}

interface ContratSalaire {
    normal: MontantHeures;
    congesPayes: MontantJours;
    majore: MontantHeures;
    specifique: MontantHeures;
    complementaire: MontantHeures;
    aVerser: number;
    net: number;
}

interface TotalSalaire {
    normal: MontantHeures;
    congesPayes: MontantJours;
    majore: MontantHeures;
    specifique: MontantHeures;
    complementaire: MontantHeures;
    aVerser: number;
    net: number;
}

interface AbsencesEnfant {
    familiales: number;
    maladie: number;
}

interface AbsencesAssmat {
    maladie: number;
    payees: number;
    sansSolde: number;
    exceptionelles: number;
}

interface Absences {
    enfant: AbsencesEnfant;
    assmat: AbsencesAssmat;
}

interface JoursContrat {
    activite: number;
    reels: number;
    activiteADeclarer: number;
}

interface Indemnites {
    repas: number;
    kilometriques: number;
    total: number;
    autres: number;
    entretien: number;
}

interface InfoPaje {
    mntSalaireNetImposable: number;
    txPas: number;
    mntCotiPriseEnChargeOdpf: number;
    dtPrelevementPrevisionnelle: string | null;
    mntEmplCmgRemuneration: number;
    mntCotisations: number;
    dtVersementPrevisionnelle: string | null;
    mntEmplAverserSalarie: number;
    mntSalaireNetApayerApresPas: number;
    mntCotiEmplAcharge: number;
    mntApreleverParPaje: number;
    mntAverserParPaje: number;
    mntImpotPas: number;
}

interface Contrat {
    methodeRemunerationCongesPayes: string;
    enfant: string;
    id: string;
}

export interface DeclarationInfo {
    id: string | null;
    annee: number;
    mois: number;
    numeroPajeSalarie: string;
    numeroPajeEmployeur: string;
    dateDeclaration: string | null;
    salaires: {
        contrats: { [key: string]: ContratSalaire };
        total: TotalSalaire;
    };
    infoPaje: InfoPaje;
    absences: { [key: string]: Absences };
    jours: {
        contrats: { [key: string]: JoursContrat };
        total: JoursContrat;
    };
    indemnites: {
        contrats: { [key: string]: Indemnites };
        total: Indemnites;
    };
    contrats: Contrat[];
}

export interface DeclarationForContrat {
    contrat: string;
    absences: Absences;
    salaires: ContratSalaire;
    indemnites: Indemnites;
    jours: JoursContrat;
    isAnnualContract: boolean;
    nbHeuresMensualisees: number;
    nbHeuresQuiAuraientDuEtreEffectuees: number;
    nbHeuresMajoreesBase: number;
    salaireMensuelNet: number;
    enfant: { id: number, nom: string, prenom: string, dateNaissance: string };
    nbHeuresNormalesAbsence: number;
    nbHeuresMajoreesAbsence: number;
    nbHeuresMajoreesAAjouter: number;
}