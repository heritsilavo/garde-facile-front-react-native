import axios from "axios";
import { SPRING_BOOT_URL } from "../../constants/api";
import { Evenement } from "../../models/evenements";
import { getLoginToken, isLogedIn } from "../user";


export const creerEvenement=async function (event:Evenement) {
    console.log(event);
    
    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken()
        return axios.post(`${SPRING_BOOT_URL}/evenements`,event, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }else throw new Error("Vous n'etes pas connecté");
}