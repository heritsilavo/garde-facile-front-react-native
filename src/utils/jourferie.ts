import axios from "axios";
import { SPRING_BOOT_URL } from "../constants/api";
import { getLoginToken, isLogedIn } from "./user";

export const getJourFeriesByCodePostale = async function (codePostale: string, annee:number) {
    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken()
        const response = await axios.get(`${SPRING_BOOT_URL}/jourFerie/getByCodePostale/${codePostale}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                annee:annee
            }
        });
        return response.data
    } else throw new Error("Vous n'etes pas connecté");
}