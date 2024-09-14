export class ConfigContratData {
    sub: string;
    pajeCotiHash: string;
    pajeCotiNonce: string;
    stage: string;
    appVersion: string;
    mail: string;
    pajeId: string;
    profile: string;
    body: Body;
  
    constructor(data?: any) {
      if (data) {
        this.sub = data.sub;
        this.pajeCotiHash = data["paje.coti.hash"];
        this.pajeCotiNonce = data["paje.coti.nonce"];
        this.stage = data.stage;
        this.appVersion = data.appVersion;
        this.mail = data.mail;
        this.pajeId = data.pajeId;
        this.profile = data.profile;
        this.body = new Body(data.body);
      } else {
        this.sub = "";
        this.pajeCotiHash = "";
        this.pajeCotiNonce = "";
        this.stage = "";
        this.appVersion = "";
        this.mail = "";
        this.pajeId = "";
        this.profile = "";
        this.body = new Body();
      }
    }
}

export class Body {
id: string;
numeroPajeEmployeur: string; // Defini
numeroPajeSalarie: string; // Defini
assmat: Assmat; // Defini
parent: Parent; // Defini
enfant: Enfant; // Defini
modeDeGarde: string; // Defini
anneeComplete: boolean; // Defini
nbSemainesTravaillees: number; // Defini
planning: Planning[]; // Defini
indexJourRepos: number; // Defini
indexJoursChomes: number[]; // Defini
nbHeuresNormalesHebdo: number; // Defini
nbHeuresMajoreesHebdo: number; // Defini
nbHeuresSpecifiquesHebdo: number; // Defini
nbHeuresMajoreesMensu: number; // Defini
nbHeuresNormalesMensu: number; // Defini
nbJoursMensu: number; // Defini
salaireHoraireNet: number; // Defini
salaireHoraireBrut: number; // Defini
salaireHoraireComplementaireNet: number; // Defini
salaireHoraireComplementaireBrut: number; // Defini
salaireHoraireMajoreNet: number; // Defini
salaireHoraireMajoreBrut: number; // Defini
salaireMajore: number; // Defini
salaireMensuelNet: number; // Defini
enfantsAChargeSalarie: EnfantsAChargeSalarie; // Defini
codePostal: string; // Defini
joursFeriesTravailles: string[]; // Defini
remunerationCongesPayes: RemunerationCongesPayes; // Defini
dateDebut: string; // Defini
optionRepasQuotidien: boolean; // Defini
dateCreation: string; // Defini

constructor(data?: any) {
    if (data) {
    this.id = data.id;
    this.numeroPajeEmployeur = data.numeroPajeEmployeur;
    this.numeroPajeSalarie = data.numeroPajeSalarie;
    this.enfant = new Enfant(data.enfant);
    this.assmat = new Assmat(data.assmat);
    this.parent = new Parent(data.parent);
    this.modeDeGarde = data.modeDeGarde;
    this.anneeComplete = data.anneeComplete;
    this.nbSemainesTravaillees = data.nbSemainesTravaillees;
    this.planning = data.planning.map((item: any) => new Planning(item));
    this.indexJourRepos = data.indexJourRepos;
    this.indexJoursChomes = data.indexJoursChomes;
    this.nbHeuresNormalesHebdo = data.nbHeuresNormalesHebdo;
    this.nbHeuresMajoreesHebdo = data.nbHeuresMajoreesHebdo;
    this.nbHeuresSpecifiquesHebdo = data.nbHeuresSpecifiquesHebdo;
    this.nbHeuresMajoreesMensu = data.nbHeuresMajoreesMensu;
    this.nbHeuresNormalesMensu = data.nbHeuresNormalesMensu;
    this.nbJoursMensu = data.nbJoursMensu;
    this.salaireHoraireNet = data.salaireHoraireNet;
    this.salaireHoraireBrut = data.salaireHoraireBrut;
    this.salaireHoraireComplementaireNet = data.salaireHoraireComplementaireNet;
    this.salaireHoraireComplementaireBrut = data.salaireHoraireComplementaireBrut;
    this.salaireHoraireMajoreNet = data.salaireHoraireMajoreNet;
    this.salaireHoraireMajoreBrut = data.salaireHoraireMajoreBrut;
    this.salaireMajore = data.salaireMajore;
    this.salaireMensuelNet = data.salaireMensuelNet;
    this.enfantsAChargeSalarie = new EnfantsAChargeSalarie(data.enfantsAChargeSalarie);
    this.codePostal = data.codePostal;
    this.joursFeriesTravailles = data.joursFeriesTravailles;
    this.remunerationCongesPayes = new RemunerationCongesPayes(data.remunerationCongesPayes);
    this.optionRepasQuotidien = data.optionRepasQuotidien;
    this.dateDebut = data.dateDebut;
    this.dateCreation = data.dateCreation;
    } else {
    this.id = "";
    this.numeroPajeEmployeur = "";
    this.numeroPajeSalarie = "";
    this.enfant = new Enfant();
    this.assmat = new Assmat();
    this.parent = new Parent();
    this.modeDeGarde = "";
    this.anneeComplete = false;
    this.nbSemainesTravaillees = 0;
    this.planning = [];
    this.indexJourRepos = 0;
    this.indexJoursChomes = [];
    this.nbHeuresNormalesHebdo = 0;
    this.nbHeuresMajoreesHebdo = 0;
    this.nbHeuresSpecifiquesHebdo = 0;
    this.nbHeuresMajoreesMensu = 0;
    this.nbHeuresNormalesMensu = 0;
    this.nbJoursMensu = 0;
    this.salaireHoraireNet = 0;
    this.salaireHoraireBrut = 0;
    this.salaireHoraireComplementaireNet = 0;
    this.salaireHoraireComplementaireBrut = 0;
    this.salaireHoraireMajoreNet = 0;
    this.salaireHoraireMajoreBrut = 0;
    this.salaireMajore = 0;
    this.salaireMensuelNet = 0;
    this.enfantsAChargeSalarie = new EnfantsAChargeSalarie();
    this.codePostal = "";
    this.joursFeriesTravailles = [];
    this.remunerationCongesPayes = new RemunerationCongesPayes();
    this.optionRepasQuotidien = false;
    this.dateDebut = "";
    this.dateCreation = "";
    }
}
}

// Les autres classes nécessaires
export class Enfant {
nom: string;
prenom: string;
dateNaissance: string;

constructor(data?: any) {
    if (data) {
    this.nom = data.nom;
    this.prenom = data.prenom;
    this.dateNaissance = data.dateNaissance;
    } else {
    this.nom = "";
    this.prenom = "";
    this.dateNaissance = "";
    }
}
}

export class Assmat {
pajeId: string;
nom: string;
prenom: string;
civilite: string;
dateNaissance: string;
isMayotte: boolean;

constructor(data?: any) {
    if (data) {
    this.pajeId = data.pajeId;
    this.nom = data.nom;
    this.prenom = data.prenom;
    this.civilite = data.civilite;
    this.dateNaissance = data.dateNaissance;
    this.isMayotte = data.isMayotte;
    } else {
    this.pajeId = "";
    this.nom = "";
    this.prenom = "";
    this.civilite = "";
    this.dateNaissance = "";
    this.isMayotte = false;
    }
}
}

export class Parent {
pajeId: string;
nom: string;
prenom: string;
civilite: string;
dateNaissance: string;

constructor(data?: any) {
    if (data) {
    this.pajeId = data.pajeId;
    this.nom = data.nom;
    this.prenom = data.prenom;
    this.civilite = data.civilite;
    this.dateNaissance = data.dateNaissance;
    } else {
    this.pajeId = "";
    this.nom = "";
    this.prenom = "";
    this.civilite = "";
    this.dateNaissance = "";
    }
}
}

export class Planning {
    indexJour: number;
    trancheHoraire1: TrancheHoraire;
    trancheHoraire2: TrancheHoraire;

    constructor(data?: any) {
        if (data) {
            this.indexJour = data.indexJour;
            this.trancheHoraire1 = new TrancheHoraire(data.trancheHoraire1);
            this.trancheHoraire2 = new TrancheHoraire(data.trancheHoraire2);
        } else {
            this.indexJour = 0;
            this.trancheHoraire1 = new TrancheHoraire();
            this.trancheHoraire2 = new TrancheHoraire();
        }
    }
}

export class TrancheHoraire {
    heureDebut: number;
    heureFin: number;

    constructor(data?: any) {
        if (data) {
            this.heureDebut = data.heureDebut;
            this.heureFin = data.heureFin;
        } else {
            this.heureDebut = 0;
            this.heureFin = 0;
        }
    }
}

export class EnfantsAChargeSalarie {
    nbEnfantsMoins15Ans: number;
    existent: boolean;

    constructor(data?: {nbEnfantsMoins15Ans:number,existent:boolean}) {
        if (data) {
            this.nbEnfantsMoins15Ans = data.nbEnfantsMoins15Ans;
            this.existent = data.existent;
        } else {
            this.nbEnfantsMoins15Ans = 0;
            this.existent = false;
        }
    }
}

export class RemunerationCongesPayes {
    mode: string;
    mois: number;

    constructor(data?: {mode:string,mois:number}) {
        if (data) {
            this.mode = data.mode;
            this.mois = data.mois;
        } else {
            this.mode = '';
            this.mois = 0;
        }
    }
}

export class IndemniteType{
    entretien:number;
    isKilometrique:boolean;
    kilometrique:number;
    isRepas:boolean;
    repas:number;
    optionRepasQuotidien:boolean;

    constructor(data?: {optionRepasQuotidien:boolean, entretien:number, isKilometrique:boolean, kilometrique:number, isRepas:boolean, repas:number}) {
        if (data) {
            this.entretien = data.entretien
            this.isKilometrique = data.isKilometrique
            this.kilometrique = data.kilometrique
            this.isRepas = data.isRepas
            this.repas = data.repas
            this.optionRepasQuotidien = data.optionRepasQuotidien
        } else {
            this.entretien = 0
            this.isKilometrique = false
            this.kilometrique = 0
            this.isRepas = false
            this.repas = 0
            this.optionRepasQuotidien = false
        }
    }
}