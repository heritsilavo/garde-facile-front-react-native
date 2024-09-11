import axios from 'axios';
import Config from 'react-native-config';

export const signupUser = async (signupData) => {
  console.log({ Config })
  try {
    const response = await axios.post(`${Config.APP_API_URL}/users/signup`, signupData);
    return response.data; // Renvoie les données de réponse, y compris le token
  } catch (error) {
    console.log(error);
  }
};

export const loginUser = async (loginData) => {
  console.log({ Config })
  try {
    const response = await axios.post(`${Config.APP_API_URL}/users/login`, loginData);
    return response.data;
  } catch (error) {
    console.log(error)
  }
};

