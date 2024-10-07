import { Body as Contrat } from "../pages/connected/ConfigurerContratPage/classes";

export type ContratHistorique = Contrat & {
    id: number;
    dateHistorisation: string;
    utilisateurHistorisation: string;
    motifHistorisation: string;
    version: number;
    contratId: string;
};