import AsyncStorage from "@react-native-async-storage/async-storage";
import { IndemniteEntity } from "../models/indemnites";
import { ConfigContratData } from "../pages/connected/ConfigurerContratPage/classes";
import { SPRING_BOOT_URL } from "../constants/api";
import { getLoginToken, getUserByPajeId, isLogedIn } from "./user";
import axios from "axios";

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
export const saveConfiguredContrat = async function (contratId:string) {
    try {
        await AsyncStorage.setItem(CONFIG_CONTRAT,contratId);
        return true;
    } catch (error) {
        return false;       
    }
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
    try{
        await AsyncStorage.removeItem(CONFIG_CONTRAT);
        return false;
    }catch (e){
        return false;
    }
}

/**
 * verifier si un contrat est configurée dans l'pplication
 * @returns 
 */
export const isContratConfiguree =async function () {
    try {
        const value = await AsyncStorage.getItem(CONFIG_CONTRAT);
        if (value) return true
        else return false
    } catch (error) {
        return false
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
    }else throw new Error("Vous n'etes pas connecté");
}

/**
 * creer un indemnitée
 * @param indemnite 
 * @returns 
 */
export const createIndemniteForContrat = async function (indemnite : IndemniteEntity) {
    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken()
        const dto = {
            uuid: indemnite.uuid,
            entretien:indemnite.entretien,
            repas: indemnite.repas,
            kilometrique: indemnite.kilometrique
        }
        const response = await axios.post(`${SPRING_BOOT_URL}/contrats/${indemnite.contrat}/indemnites`, dto, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data
    }else throw new Error("Vous n'etes pas connecté");
}

/**
 * get contrat data by id
 * @param constratId 
 * @returns contrat
 */
export const getContratById=async function (constratId:string) {
    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken()
        const response = await axios.get(`${SPRING_BOOT_URL}/contrats/${constratId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params:{
                simple:false
            }
        });
        return response.data
    }else throw new Error("Vous n'etes pas connecté");
}

/**
 * Recupere les details
 * @returns 
 */
export const getDetailConfiguredContrat = async function () {
    const configuredContrat = await getConfiguredContrat()
    if (configuredContrat) {
        var contrat = await getContratById(configuredContrat);
        var assmat = await getUserByPajeId(contrat.numeroPajeSalarie)
        var parent = await getUserByPajeId(contrat.numeroPajeEmployeur)
        contrat.assmat = assmat.data
        contrat.parent = parent.data
        return contrat
    }else return null
}