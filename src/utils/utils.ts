import axios from "axios";
import { SPRING_BOOT_URL } from "../constants/api";
import { getLoginToken, isLogedIn } from "./user";
import { getConfiguredContrat, getContratById } from "./contrat";
import AsyncStorage from "@react-native-async-storage/async-storage";
const CONTRAT_DE_L_ENFANT_SOUVENU = "contrat-souvenu"

/**
 * Supprimer un contrat avec les elements liées avec lui
 * @param idContrat 
 * @returns 
 */
export const actionEntrerAppli = async function () {
    const isLogged = await isLogedIn()
    if (isLogged) {
        const idContrat = await getConfiguredContrat();
        if (!idContrat) throw new Error("Aucun contrat configurée");
        else {
            const date = (new Date()).toISOString().split('T')[0];
            const token = await getLoginToken()
            
            const response = await axios.get(`${SPRING_BOOT_URL}/contrats/actionEntrerAppli/${idContrat}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    dateEntree: date
                }
            });
            return response
        }
    } else throw new Error("Vous n'etes pas connecté");
}

export const saveEnfantSouvenu = async function (contratId:string) {
    try {
        await AsyncStorage.setItem(CONTRAT_DE_L_ENFANT_SOUVENU, contratId);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * load the contratId from the async storage if exist
 * @returns contratId
 */
export const getEnfantSouvenu = async function () {
    try {
        const value = await AsyncStorage.getItem(CONTRAT_DE_L_ENFANT_SOUVENU);
        if (value) return value
        else return null
    } catch (error) {
        return null
    }
}

export const removeEnfantSouvenu = async function () {
    try {
        await AsyncStorage.removeItem(CONTRAT_DE_L_ENFANT_SOUVENU);
        return false;
    } catch (e) {
        return false;
    }
}

/**
 * verifier si un contrat est configurée dans l'pplication
 * @returns 
 */
export const isEnfantSouvenu = async function () {
    try {
        const value = await AsyncStorage.getItem(CONTRAT_DE_L_ENFANT_SOUVENU);

        if (value) {
            const contrat = await getContratById(value);
            return !!contrat && true;
        }
        else return false
    } catch (error) {
        return false
    }
}