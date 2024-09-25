export class Evenement {
  id: string;
  contratsId: string[];
  dateCreation: string;
  dateDebut: string;
  dateFin: string;
  debutEvenementMidi: boolean;
  finEvenementMidi: boolean;
  famille: number;
  typeEvenement: string;
  travaille: boolean;
  remunere: boolean;
  nomJourFerie: string;
  debutMidi: boolean;
  finMidi: boolean;
  montant: number;
  nbKilometres: number;
  nbHeures: number;
  nbJours: number;
  amplitude: Amplitude;
  libelleExceptionnel: string | null;
  heureDebut: number; 
  heureFin: number; 
  repasALaChargeDuSalarie: boolean; 

  constructor(data?: {
    id?: string;
    contratsId?: string[];
    dateCreation?: string;
    dateDebut?: string;
    dateFin?: string;
    debutEvenementMidi?: boolean;
    finEvenementMidi?: boolean;
    famille?: number;
    typeEvenement?: string;
    travaille?: boolean;
    remunere?: boolean;
    nomJourFerie?: string;
    debutMidi?: boolean;
    finMidi?: boolean;
    montant?: number;
    nbKilometres?: number;
    nbHeures?: number;
    nbJours?: number;
    amplitude?: Amplitude;
    libelleExceptionnel?: string;
    heureDebut?: number; 
    heureFin?: number; 
    repasALaChargeDuSalarie?: boolean; 
  }) {
    this.id = data?.id || '';
    this.contratsId = data?.contratsId || [];
    this.dateCreation = data?.dateCreation || new Date().toISOString();
    this.dateDebut = data?.dateDebut || new Date().toISOString().split('T')[0];
    this.dateFin = data?.dateFin || new Date().toISOString().split('T')[0];
    this.debutEvenementMidi = data?.debutEvenementMidi || false;
    this.finEvenementMidi = data?.finEvenementMidi || false;
    this.famille = data?.famille || 0;
    this.typeEvenement = data?.typeEvenement || '';
    this.travaille = data?.travaille || false;
    this.remunere = data?.remunere || false;
    this.nomJourFerie = data?.nomJourFerie || '';
    this.debutMidi = data?.debutMidi || false;
    this.finMidi = data?.finMidi || false;
    this.montant = data?.montant || 0;
    this.nbKilometres = data?.nbKilometres || 0;
    this.nbHeures = data?.nbHeures || 0;
    this.nbJours = data?.nbJours || 0;
    this.amplitude = data?.amplitude ? new Amplitude(data.amplitude) : new Amplitude();
    this.libelleExceptionnel = data?.libelleExceptionnel || '';
    this.heureDebut = data?.heureDebut || 0; // Initialisation
    this.heureFin = data?.heureFin || 0; // Initialisation
    this.repasALaChargeDuSalarie = data?.repasALaChargeDuSalarie || true; // Initialisation
  }
}

export class Amplitude {
  debutAmplitude: string; // Type changé en string
  finAmplitude: string;   // Type changé en string
  decompte: number;
  reel: number;

  constructor(data?: {
    debutAmplitude?: string; // Type changé en string
    finAmplitude?: string;   // Type changé en string
    decompte?: number;
    reel?: number;
  }) {
    this.debutAmplitude = data?.debutAmplitude || new Date().toISOString().split('T')[0];
    this.finAmplitude = data?.finAmplitude || new Date().toISOString().split('T')[0];
    this.decompte = data?.decompte || 0;
    this.reel = data?.reel || 0;
  }
}
