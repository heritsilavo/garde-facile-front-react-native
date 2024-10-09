import axios from "axios";
import { SPRING_BOOT_URL } from "../constants/api";
import { getLoginToken, isLogedIn } from "./user";
import { getConfiguredContrat } from "./contrat";

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