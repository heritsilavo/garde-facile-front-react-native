import axios from "axios";
import { SPRING_BOOT_URL } from "../../constants/api";
import { Evenement } from "../../models/evenements";
import { getLoginToken, isLogedIn } from "../user";
import { getTypeEventByText, TypeEvenement } from "./enum-type-evenement";

/**
 * Creer une evenement
 * @param event 
 * @returns 
 */
export const creerEvenement = async function (event: Evenement) {
    console.log(event);

    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken()
        return axios.post(`${SPRING_BOOT_URL}/evenements`, event, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } else throw new Error("Vous n'etes pas connecté");
}

/**
 * Recuperer les evenement en fonction du contrat et du periode
 * @param contratId 
 * @param mois 
 * @param annee 
 * @returns 
 */
export const getEvenementsByContratAndPeriode = async function (contratId: string, mois: number, annee: number) {
    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken();
        const {data}:{data:Evenement[]} = await axios.get(`${SPRING_BOOT_URL}/evenements/findByContratIdAndPeriod`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                contratId: contratId,
                mois: mois,
                annee: annee
            }
        })
        return data
    } else throw new Error("Vous n'etes pas connecté");
}


export const getDescriptionByEvent = function (event:Evenement) {
    const eventType = getTypeEventByText(event.typeEvenement);
    
    if (!eventType) return "Description non disponible";

    switch (eventType.texte) {
        case TypeEvenement.PERIODE_ADAPTATION.texte:
            return `Du ${formatDate(event.dateDebut)} au ${formatDate(event.dateFin)}`;

        case TypeEvenement.JOUR_FERIE.texte:
            return `${event.nomJourFerie}${event.travaille ? ' (travaillé)' : ''}`;

        case TypeEvenement.SEMAINE_NON_TRAVAILLEE.texte:
            return `Du ${formatDate(event.dateDebut)} au ${formatDate(event.dateFin)}`;

        case TypeEvenement.HEURES_COMPLEMENTAIRES.texte:
            return `${(event.heureFin - event.heureDebut) / 60} heure(s) le ${formatDate(event.dateDebut)}`;

        case TypeEvenement.JOURS_COMPLEMENTAIRES.texte:
            return `${event.nbJours} jour(s) du ${formatDate(event.dateDebut)} au ${formatDate(event.dateFin)}`;

        case TypeEvenement.INDEMNITES_REPAS.texte:
            return `${event.montant}€ le ${formatDate(event.dateDebut)}`;

        case TypeEvenement.INDEMNITES_KM.texte:
            return `${event.nbKilometres} km le ${formatDate(event.dateDebut)}`;

        case TypeEvenement.ENFANT_ABSENCE_FAMILIALE.texte:

        case TypeEvenement.ENFANT_ABSENCE_MALADIE.texte:
            return `Du ${formatDate(event.dateDebut)} au ${formatDate(event.dateFin)}`;

        case TypeEvenement.SALARIE_CONGES_MALADIE.texte:

        case TypeEvenement.SALARIE_CONGES_PAYES.texte:

        case TypeEvenement.SALARIE_CONGES_SANS_SOLDES.texte:
            return `Du ${formatDate(event.dateDebut)} au ${formatDate(event.dateFin)}`;

        case TypeEvenement.SALARIE_CITOYEN_JDC.texte:
            return `Le ${formatDate(event.dateDebut)}`;

        case TypeEvenement.SALARIE_PRO_FORMATION.texte:
            return `Formation du ${formatDate(event.dateDebut)} au ${formatDate(event.dateFin)}`;

        case TypeEvenement.SALARIE_PARENTAL_MATERNITE.texte:
            return `Congé du ${formatDate(event.dateDebut)} au ${formatDate(event.dateFin)}`;

        case TypeEvenement.SALARIE_FAMILLE_NOUVEL_ENFANT.texte:

        case TypeEvenement.SALARIE_FAMILLE_MARIAGE.texte:

        case TypeEvenement.SALARIE_FAMILLE_MARIAGE_ENFANT.texte:
            return `Le ${formatDate(event.dateDebut)}`;

        case TypeEvenement.SALARIE_FAMILLE_DECES_CONJOINT.texte:

        case TypeEvenement.SALARIE_FAMILLE_DECES_ENFANT.texte:

        case TypeEvenement.SALARIE_FAMILLE_DECES_DESCENDANT.texte:

        case TypeEvenement.SALARIE_FAMILLE_DECES_PARENT.texte:

        case TypeEvenement.SALARIE_FAMILLE_DECES_GRAN_PARENT.texte:

        case TypeEvenement.SALARIE_FAMILLE_DECES_FRATERNITE.texte:
            return `Du ${formatDate(event.dateDebut)} au ${formatDate(event.dateFin)}`;

        case TypeEvenement.SALARIE_FAMILLE_ANNONCE_HANDICAP.texte:
            return `Le ${formatDate(event.dateDebut)}`;
        default:
            return `Du ${formatDate(event.dateDebut)} au ${formatDate(event.dateFin)}`;
    }
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
        throw new Error("Date invalide");
    }

    const jours = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

    const jour = date.getDate();
    const mois = date.getMonth() + 1; // Les mois commencent à 0
    const nomJour = jours[date.getDay()];

    const moisFormatte = mois.toString().padStart(2, '0');

    return `${nomJour} ${jour}/${moisFormatte}`;
}

/**
 * Recuperer les jours feries en fonction du contrat et du periode
 * @param contratId 
 * @param mois 
 * @param annee 
 * @returns 
 */
export const getJourFeriesByContratAndPeriode = async function (contratId: string, mois: number, annee: number) {
    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken();
        const {data}:{data:Evenement[]} = await axios.get(`${SPRING_BOOT_URL}/evenements/findJourFerieByContratIdAndPeriod`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                contratId: contratId,
                mois: mois,
                annee: annee
            }
        })
        return data
    } else throw new Error("Vous n'etes pas connecté");
}

/**
 * Recuperer les jours feries en fonction du contrat et du periode
 * @param contratId 
 * @param mois 
 * @param annee 
 * @returns 
 */
export const setIsJourFerieTravaille = async function (idEvenement: string, isTravaille: boolean) {
    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken();
        const {data}:{data:Evenement} = await axios.put(`${SPRING_BOOT_URL}/evenements/setIsJourFerieTravaille/${idEvenement}`,null, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                isTravaille: isTravaille
            }
        })
        return data
    } else throw new Error("Vous n'etes pas connecté");
}

/**
 * Supprimer un evenement
 * @param idEvenement id de l'evenement a supprimer
 */
export const deleteEvenement =async (idEvenement:string) => {
    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken();
        return axios.delete(`${SPRING_BOOT_URL}/evenements/${idEvenement}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    } else throw new Error("Vous n'etes pas connecté");
}