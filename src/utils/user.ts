import axios from 'axios';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SPRING_BOOT_URL } from '../constants/api';
import { Assmat, Enfant } from '../pages/connected/ConfigurerContratPage/classes';

export interface LoginRequest{
    pajeId: string,
    password: string
}
const TOKEN_NAME='my-login-token';
const PAJE_ID='paje-id';

export const loginUser = (loginData : LoginRequest) => {
    return axios.post(`${SPRING_BOOT_URL}/login`, loginData);
};

export const saveLoginToken = async function (token:string,pajeId:string) {
    try {
        await AsyncStorage.setItem(TOKEN_NAME,token);
        await AsyncStorage.setItem(PAJE_ID,pajeId);
        return true;
    } catch (error) {
        return false;       
    }
}

export const getLoginToken = async function () {
    try {
        const value = await AsyncStorage.getItem(TOKEN_NAME);
        if (value) return value
        else return null
    } catch (error) {
        return null       
    }
}

export const getPajeId = async function () {
    try {
        const value = await AsyncStorage.getItem(PAJE_ID);
        if (value) return value
        else return null
    } catch (error) {
        return null       
    }
}

export const logout = async function () {
    try{
        await AsyncStorage.removeItem(TOKEN_NAME);
        await AsyncStorage.removeItem(PAJE_ID);
        return false;
    }catch (e){
        return false;
    }
}

export const isLogedIn =async function () {
    try {
        const value = await AsyncStorage.getItem(TOKEN_NAME);
        const response = await axios.get(`${SPRING_BOOT_URL}/testTokenUser`,{
            headers:{
                'Authorization':`Bearer ${value}`
            }
        });

        if (!!response.data) return true
        else return false
    } catch (error) {
        return false
    }
}

export const getUserByPajeId =async ( pajeId: string ) =>{
    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken()
        return axios.get(`${SPRING_BOOT_URL}/users/${pajeId}`,{
            headers:{
                'Authorization':`Bearer ${token}`
            }
        });
    }else throw new Error("Vous n'etes pas connecté");
}

export const getAssociatedAssmatByPajeIdParent=async function (pajeIdParent:string) {
    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken()
        const response =await axios.get(`${SPRING_BOOT_URL}/AssociationComptes/getByPajeIdParent/${pajeIdParent}`,{
            headers:{
                'Authorization':`Bearer ${token}`
            }
        });
        if (!!response.data?.length) {
            let assmatList: Assmat[] = []
            for (const association of response.data) {
                let A =await getUserByPajeId(association.pajeIdSalarie);
                assmatList.push(A.data)
            }
            
            return assmatList;
        }else return []
    }else throw new Error("Vous n'etes pas connecté");
}

export const getEnfantByPajeIdParent : (pajeIdParent: string) => Promise<Enfant[]> =async function (pajeIdParent:string) {
    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken()
        const response =await axios.get(`${SPRING_BOOT_URL}/enfants/parent/${pajeIdParent}`,{
            headers:{
                'Authorization':`Bearer ${token}`
            }
        });
        console.log("Enfants", response.data);
        
        return response.data
    }else throw new Error("Vous n'etes pas connecté");
}