import axios from "axios";
import { SPRING_BOOT_URL } from "../constants/api";
import { getLoginToken, isLogedIn } from "./user";


export type CongeType = {
  id: string,
  typeEvenement: string,
  dateDebut: string,
  dateFin: string
}

export interface CongeData {
  disponible: number;
  encoursAcquisition: number;
  nbJourCongesPayesPose: number;
  nbJourCongesSansSoldePose: number;
  nbJourCongesExceptionnelPose: number;
  dateCreationCompteur: string;
  listeCongesPayes: CongeType[];
  listeCongesSansSolde: CongeType[];
  listeCongesExceptionnels: CongeType[];
}

export const initialCongeData: CongeData = {
  disponible: 0,
  encoursAcquisition: 0,
  nbJourCongesPayesPose: 0,
  nbJourCongesSansSoldePose: 2,
  nbJourCongesExceptionnelPose: 2,
  dateCreationCompteur: '01/06/2024',
  listeCongesPayes: [],
  listeCongesSansSolde: [],
  listeCongesExceptionnels: []
};

type ModeType = 'EN_JUIN' | 'LORS_PRISE_CONGES_PRINCIPAUX' | 'LORS_PRISE_CONGES'

export interface ModePayement {
  type: ModeType;
  titre: string;
  description: string;
}

export const PAYMENT_MODES: ModePayement[] = [
  {
    type: 'EN_JUIN',
    titre: 'Paiement une seule fois en juin',
    description: "L'intégralité de l'indemnité de congés payés sera versée en juin"
  },
  {
    type: 'LORS_PRISE_CONGES_PRINCIPAUX',
    titre: 'Paiement lors de la prise des congés principaux',
    description: "L'intégralité de l'indemnité de congés payés sera versée le mois de la prise des congés principaux"
  },
  {
    type: 'LORS_PRISE_CONGES',
    titre: 'Paiement au fur et à mesure de la prise des congés',
    description: "L'indemnité est versée proportionnellement au nombre de jours posés par mois"
  }
];


export const getModePayement = function (type: ModeType): ModePayement | undefined {
  return PAYMENT_MODES.find(mode => (mode.type === type));
}


export const getDetailAcquisitionContrat = async function (idContrat: string, annee: number) : Promise<CongeData> {
  const isLogged = await isLogedIn()
  if (isLogged) {
    const token = await getLoginToken()
    const response = await axios.get(`${SPRING_BOOT_URL}/compteur/getAcquisitionCongesPayesByPeriodeAndContrat`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        idContrat: idContrat,
        annee: annee
      }
    });
    console.log("Data", response.data);

    return response.data
  } else throw new Error("Vous n'etes pas connecté");
}