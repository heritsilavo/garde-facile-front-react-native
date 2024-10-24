import axios from "axios";
import { SPRING_BOOT_URL } from "../constants/api";
import { getLoginToken, isLogedIn } from "./user";
import { DeclarationInfo } from "../models/declaration_info";

/**
 * Resupere les infos dans la declaration
 * @param pajeIdParent 
 * @param pajeIdAssmat 
 * @param annee 
 * @param mois 
 * @returns 
 */
export const getDeclarationInfo = async function (pajeIdParent: string, pajeIdAssmat: string, annee: number, mois: number):Promise<DeclarationInfo> {
    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken()
        const response = await axios.get(`${SPRING_BOOT_URL}/declaration/getDeclarationInfo`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                pajeIdParent,
                pajeIdAssmat,
                annee,
                mois
            }
        });

        return response.data
    } else throw new Error("Vous n'etes pas connecté");
}

export interface ComptesInfoType {
    enfantAbsenceMaladie: number;
    enfantAbsebceFamiliale: number;
    assmatCongesPayes: number;
    assmatCongesSansSolde: number;
    assmatArretMaladie: number;
    assmatCongesExceptionnels: number;
    nbJoursGardeReel: number;
    nbJoursDactivitePrevu: number;
}

interface ContratComptesInfo {
    key: string;
    value: ComptesInfoType;
}

/**
 * Transforme les données de la déclaration en liste de ComptesInfoType par contrat
 * @param declaration Les données de la déclaration
 * @returns Array<ContratComptesInfo>
 */
function transformToComptesInfoByContract(declaration: DeclarationInfo): Array<ContratComptesInfo> {
    // Récupérer tous les IDs de contrats
    const contratIds = Object.keys(declaration.absences);

    // Transformer chaque contrat
    return contratIds.map(contratId => {
        const absences = declaration.absences[contratId];
        const jours = declaration.jours.contrats[contratId];

        // Créer l'objet ComptesInfoType pour ce contrat
        const comptesInfo: ComptesInfoType = {
            enfantAbsenceMaladie: absences.enfant.maladie,
            enfantAbsebceFamiliale: absences.enfant.familiales,
            assmatCongesPayes: absences.assmat.payees,
            assmatCongesSansSolde: absences.assmat.sansSolde,
            assmatArretMaladie: absences.assmat.maladie,
            assmatCongesExceptionnels: absences.assmat.exceptionelles,
            nbJoursGardeReel: jours.activite,
            nbJoursDactivitePrevu: 0
        };

        // Retourner l'objet au format demandé
        return {
            key: contratId,
            value: comptesInfo
        };
    });
}

/**
 * Get les detail ddes compteurs
 * @param contratId 
 * @param annee 
 * @param mois 
 * @returns 
 */
export const getCompteurInfo = async function (contratId: string, annee: number, mois: number) {
    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken()
        const response = await axios.get(`${SPRING_BOOT_URL}/compteur/getCompteForMonth`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                contratId,
                annee,
                mois
            }
        });
        return response.data
    } else throw new Error("Vous n'etes pas connecté");
}