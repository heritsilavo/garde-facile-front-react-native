import axios from "axios";
import { SPRING_BOOT_URL } from "../constants/api";
import { getLoginToken, isLogedIn } from "./user";

export async function getIndemniteByContratId(contratId:string) {
    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken()
        const response = await axios.get(`${SPRING_BOOT_URL}/indemnite/${contratId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data
    }else throw new Error("Vous n'etes pas connecté");
}

export async function updateEntretieByContraId(contratId: string, entretien: number) {
    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken()
        
        try {
            const response = await axios.post(
                `${SPRING_BOOT_URL}/indemnite/${contratId}/updateEntretien`,
                null, // pas de corps de requête
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        entretien: entretien
                    }
                }
            );

            return response.data
        } catch (error: any) {
            console.error('Erreur lors de la mise à jour de l\'indemnité d\'entretien:', error.message);
            if (error.response) {
                console.error('Statut de la réponse:', error.response.status);
                console.error('Données de la réponse:', error.response.data);
            }
            throw error;
        }
    } else throw new Error("Vous n'êtes pas connecté");
}


export async function updateKilometriqueByContraId(contratId: string, kilometrique: number) {
    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken()
        
        try {
            const response = await axios.post(
                `${SPRING_BOOT_URL}/indemnite/${contratId}/updateKilometrique`,
                null, // pas de corps de requête
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        nbKilometre:kilometrique
                    }
                }
            );

            return response.data
        } catch (error: any) {
            console.error('Erreur lors de la mise à jour de l\'indemnité kilometrique:', error.message);
            if (error.response) {
                console.error('Statut de la réponse:', error.response.status);
                console.error('Données de la réponse:', error.response.data);
            }
            throw error;
        }
    } else throw new Error("Vous n'êtes pas connecté");
}


export async function updateRepasByContraId(contratId: string, repas: number) {
    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken()
        
        try {
            const response = await axios.post(
                `${SPRING_BOOT_URL}/indemnite/${contratId}/updateRepas`,
                null, // pas de corps de requête
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        repas:repas
                    }
                }
            );

            return response.data
        } catch (error: any) {
            console.error('Erreur lors de la mise à jour de l\'indemnité repas:', error.message);
            if (error.response) {
                console.error('Statut de la réponse:', error.response.status);
                console.error('Données de la réponse:', error.response.data);
            }
            throw error;
        }
    } else throw new Error("Vous n'êtes pas connecté");
}