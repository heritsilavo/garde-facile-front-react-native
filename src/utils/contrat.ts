import AsyncStorage from "@react-native-async-storage/async-storage";
import { IndemniteEntity } from "../models/indemnites";
import { ConfigContratData } from "../pages/connected/ConfigurerContratPage/classes";
import { SPRING_BOOT_URL } from "../constants/api";
import { getLoginToken, getUserByPajeId, isLogedIn } from "./user";
import axios from "axios";
import { Body as ContratEntity } from "../pages/connected/ConfigurerContratPage/classes";
import { ContratHistorique } from "../models/contrat-historique";
import { removeEnfantSouvenu } from "./utils";

export function generateId(): string {
    const generateSegment = (length: number): string => {
        const characters = '0123456789abcdef';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    return `${generateSegment(8)}-${generateSegment(4)}-${generateSegment(4)}-${generateSegment(4)}-${generateSegment(12)}`;
}

const CONFIG_CONTRAT = "configured-contrat";

/**
 * Save constratId in Async storage
 * @param contratId 
 * @returns boolean
 */
export const saveConfiguredContrat = async function (contratId: string) {
    try {
        await AsyncStorage.setItem(CONFIG_CONTRAT, contratId);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * creer un contrat
 * @param newContrat 
 * @returns 
 */
export const saveContratInDatabase = async function (newContrat: ConfigContratData) {
    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken()
        const response = await axios.post(`${SPRING_BOOT_URL}/contrats`, newContrat, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data
    } else throw new Error("Vous n'etes pas connecté");
}

/**
 * load the contratId from the async storage if exist
 * @returns contratId
 */
export const getConfiguredContrat = async function () {
    try {
        const value = await AsyncStorage.getItem(CONFIG_CONTRAT);
        if (value) return value
        else return null
    } catch (error) {
        return null
    }
}

/**
 * Supprimer l'id contrat de l'async storage
 * @returns 
 */
export const removeConfiguredContrat = async function () {
    try {
        await AsyncStorage.removeItem(CONFIG_CONTRAT);
        await removeEnfantSouvenu()
        return false;
    } catch (e) {
        return false;
    }
}

/**
 * verifier si un contrat est configurée dans l'pplication
 * @returns 
 */
export const isContratConfiguree = async function () {
    try {
        const value = await AsyncStorage.getItem(CONFIG_CONTRAT);

        if (value) {
            const contrat = await getContratById(value);
            return !!contrat && true;
        }
        else return false
    } catch (error) {
        return false
    }
}



/**
 * creer un indemnitée
 * @param indemnite 
 * @returns 
 */
export const createIndemniteForContrat = async function (indemnite: IndemniteEntity) {
    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken()
        const dto = {
            uuid: indemnite.uuid,
            entretien: indemnite.entretien,
            repas: indemnite.repas,
            kilometrique: indemnite.kilometrique
        }
        const response = await axios.post(`${SPRING_BOOT_URL}/contrats/${indemnite.contrat}/indemnites`, dto, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data
    } else throw new Error("Vous n'etes pas connecté");
}

/**
 * get contrat data by id
 * @param constratId 
 * @returns contrat
 */
export const getContratById = async function (constratId: string) {
    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken()
        const response = await axios.get(`${SPRING_BOOT_URL}/contrats/${constratId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                simple: false
            }
        });
        var contrat = response.data
        var assmat = await getUserByPajeId(contrat.numeroPajeSalarie)
        var parent = await getUserByPajeId(contrat.numeroPajeEmployeur)
        contrat.assmat = assmat.data
        contrat.parent = parent.data
        return contrat
    } else throw new Error("Vous n'etes pas connecté");
}

/**
 * Get contrat by PajeIdParent or pajeIdSalarie
 * @param pajeId PajeIdParent ou salarie
 * @returns 
 */
export const getContratByPajeIdUser = async function (pajeId: string) {
    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken()
        const response = await axios.get(`${SPRING_BOOT_URL}/contrats/paje/${pajeId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        return response.data
    } else throw new Error("Vous n'etes pas connecté");
}

export const getContratByPajeIdParentAndSalarie = async function (pajeIdParent: string, pajeIdSalarie: string) {
    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken()
        const response = await axios.get(`${SPRING_BOOT_URL}/contrats/byUsers/${pajeIdSalarie}/${pajeIdParent}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        return response.data
    } else throw new Error("Vous n'etes pas connecté");
}

/**
 * Recupere les details
 * @returns 
 */
export const getDetailConfiguredContrat = async function () {
    const configuredContrat = await getConfiguredContrat()
    if (configuredContrat) {
        var contrat = await getContratById(configuredContrat);
        return contrat
    } else return null
}

/**
 * Supprimer un contrat avec les elements liées avec lui
 * @param idContrat 
 * @returns 
 */
export const deleteContrat = async function (idContrat: string) {
    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken()
        const response = await axios.delete(`${SPRING_BOOT_URL}/contrats/${idContrat}/delete`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        return response.data
    } else throw new Error("Vous n'etes pas connecté");
}


export const recupererContratBySalarieParentAndEnfant = async function (pajeIdParent: string, pajeIdSalarie: string, idEnfant: number) {
    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken()
        const response = await axios.get(`${SPRING_BOOT_URL}/contrats/byUsersAndEnfants/${pajeIdSalarie}/${pajeIdParent}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                idEnfant: idEnfant
            }
        });
        return response.data
    } else throw new Error("Vous n'etes pas connecté");
}

type ModifType = "MODE_GARDE" | "RENUMERATION_CONGES_PAYES" | "MODIF_SALAIRE" | "MODIF_DATE_FIN";
export const modifierContrat = async (champs: ModifType, contrat: ContratEntity) => {
    const isLogged = await isLogedIn()
    if (isLogged) {
        
        const token = await getLoginToken()
        const contratId = await getConfiguredContrat()
        // S'assurer que l'ID du contrat est présent dans l'URL
        if (!contratId) {
            throw new Error("L'ID du contrat est requis");
        }

        const response = await axios.put(
            `${SPRING_BOOT_URL}/contrats/${contratId}`,
            contrat,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    champs: champs
                }
            }
        );
        
        return response.data;
    } 
    throw new Error("Vous n'êtes pas connecté");
}

export const getContratHistorique =async function (idContrat:string):Promise<ContratHistorique[]> {
    const isLogged = await isLogedIn()
    if (isLogged) {
        
        const token = await getLoginToken()
        const contratId = await getConfiguredContrat()
        
        if (!contratId) {
            throw new Error("L'ID du contrat est requis");
        }

        const response = await axios.get(
            `${SPRING_BOOT_URL}/contrats/getHistorique/${idContrat}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        var historiques:ContratHistorique[] = response.data
        var newHists = [];
        for (const element of historiques) {
            var assmat = (await getUserByPajeId(element.numeroPajeSalarie)).data
            var parent = (await getUserByPajeId(element.numeroPajeEmployeur)).data
            newHists.push({...element, assmat, parent})
        }
        
        return newHists;
    } 
    throw new Error("Vous n'êtes pas connecté");
}