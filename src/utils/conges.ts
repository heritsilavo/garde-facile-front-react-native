export interface CongeData {
  congesPayesDispo: number;
  congeEncoursDAcquisition: number;
  poseeCongePaye: number;
  poseeCongeSansSolde: number;
  poseeCongeExceptionnel: number;
  dateMiseAJour: string;
  dateCalculIndemnite: string;
}

export const initialCongeData: CongeData = {
  congesPayesDispo: 0,
  congeEncoursDAcquisition: 0,
  poseeCongePaye: 0,
  poseeCongeSansSolde: 2,
  poseeCongeExceptionnel: 2,
  dateMiseAJour: '01/06/2024',
  dateCalculIndemnite: '01/06/2024',
};