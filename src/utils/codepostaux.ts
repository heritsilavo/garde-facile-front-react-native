import axios from "axios";
import { SPRING_BOOT_URL } from "../constants/api";
import { getLoginToken, isLogedIn } from "./user";

export const getAllCodePostaux = async function (): Promise<string[]> {
    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken()
        const response = await axios.get(`${SPRING_BOOT_URL}/jourFerie/getCodePostaux`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        return response.data
    } else throw new Error("Vous n'etes pas connecté");
}