import axios from "axios";
import { SPRING_BOOT_URL } from "../constants/api";
import { getLoginToken, isLogedIn } from "./user";
import { DeclarationForContrat, DeclarationInfo } from "../models/declaration";
import { DeclarationType } from "../models/declaration_type";
import { Mois } from "./date";

/**
 * Resupere les infos dans la declaration
 * @param pajeIdParent 
 * @param pajeIdAssmat 
 * @param annee 
 * @param mois 
 * @returns 
 */
export const getDeclarationInfo = async function (pajeIdParent: string, pajeIdAssmat: string, annee: number, mois: number): Promise<DeclarationInfo> {
    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken()
        const response = await axios.get(`${SPRING_BOOT_URL}/declaration/getDeclarationInfo`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                pajeIdParent,
                pajeIdAssmat,
                annee,
                mois
            }
        });

        return response.data
    } else throw new Error("Vous n'etes pas connecté");
}

export interface ComptesInfoType {
    enfantAbsenceMaladie: number;
    enfantAbsebceFamiliale: number;
    assmatCongesPayes: number;
    assmatCongesSansSolde: number;
    assmatArretMaladie: number;
    assmatCongesExceptionnels: number;
    nbJoursGardeReel: number;
    nbJoursDactivitePrevu: number;
}

interface ContratComptesInfo {
    key: string;
    value: ComptesInfoType;
}

/**
 * Transforme les données de la déclaration en liste de ComptesInfoType par contrat
 * @param declaration Les données de la déclaration
 * @returns Array<ContratComptesInfo>
 */
function transformToComptesInfoByContract(declaration: DeclarationInfo): Array<ContratComptesInfo> {
    // Récupérer tous les IDs de contrats
    const contratIds = Object.keys(declaration.absences);

    // Transformer chaque contrat
    return contratIds.map(contratId => {
        const absences = declaration.absences[contratId];
        const jours = declaration.jours.contrats[contratId];

        // Créer l'objet ComptesInfoType pour ce contrat
        const comptesInfo: ComptesInfoType = {
            enfantAbsenceMaladie: absences.enfant.maladie,
            enfantAbsebceFamiliale: absences.enfant.familiales,
            assmatCongesPayes: absences.assmat.payees,
            assmatCongesSansSolde: absences.assmat.sansSolde,
            assmatArretMaladie: absences.assmat.maladie,
            assmatCongesExceptionnels: absences.assmat.exceptionelles,
            nbJoursGardeReel: jours.activite,
            nbJoursDactivitePrevu: 0
        };

        // Retourner l'objet au format demandé
        return {
            key: contratId,
            value: comptesInfo
        };
    });
}

/**
 * Get les detail ddes compteurs
 * @param contratId 
 * @param annee 
 * @param mois 
 * @returns 
 */
export const getCompteurInfo = async function (contratId: string, annee: number, mois: number) {
    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken()
        const response = await axios.get(`${SPRING_BOOT_URL}/compteur/getCompteForMonth`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                contratId,
                annee,
                mois
            }
        });
        return response.data
    } else throw new Error("Vous n'etes pas connecté");
}

export const saveDeclaration = async function (decla: DeclarationType) {
    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken()
        const response = await axios.post(`${SPRING_BOOT_URL}/declaration`, decla, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data
    } else throw new Error("Vous n'etes pas connecté");
}


export const getDetailSalaireForMonth = async function (contratId: string, annee: number, mois: number): Promise<DeclarationForContrat> {
    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken()
        const response = await axios.get(`${SPRING_BOOT_URL}/declaration/getDetailSalaireForMonth`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                contratId,
                annee,
                mois
            }
        });
        return response.data
    } else throw new Error("Vous n'etes pas connecté");
}


export const getDeclaByContratAndPeriod = async function (contratId: string, annee: number, mois: number): Promise<DeclarationForContrat | null> {
    const isLogged = await isLogedIn()
    if (isLogged) {
        const token = await getLoginToken()
        const response = await axios.get(`${SPRING_BOOT_URL}/declaration/getDeclaByContratAndPeriod`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                contratId,
                annee,
                mois
            }
        });
        if (!!response.data) {
            var data: DeclarationForContrat = convertFromDeclarationType(response.data);
            return data;
        } else return null
        return response.data
    } else throw new Error("Vous n'etes pas connecté");
}

export async function getHistoriqueDeclaForContrat(contratId:string):Promise<DeclarationForContrat[]> {
    const isLogged = await isLogedIn();
    if (isLogged) {
        const token = await getLoginToken()
        const {data}:{data:DeclarationType[]} = await axios.get(`${SPRING_BOOT_URL}/declaration/getHistoriqueDecla`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                contratId
            }
        });
        return data.map(d => convertFromDeclarationType(d));
    } else throw new Error("Vous n'etes pas connecté");
}

export function convertToDeclarationType(declarationForContrat: DeclarationForContrat, mois: Mois): DeclarationType {
    return {
        id: 0, // A définir ou générer si nécessaire
        uuid: '', // Générer un UUID si requis
        annee: mois.year,
        mois: mois.monthIndex,
        methodeRemunerationCongesPayes: "", // A définir ou générer si nécessaire
        declaration_date: new Date().toISOString(),
        numeroPajeEmployeur: "", // A définir ou générer si nécessaire
        numeroPajeSalarie: "", // A définir ou générer si nécessaire
        indemnites: {
            contrats: {
                [declarationForContrat.contrat]: {
                    repas: declarationForContrat.indemnites.repas,
                    kilometriques: declarationForContrat.indemnites.kilometriques,
                    total: declarationForContrat.indemnites.total,
                    autres: declarationForContrat.indemnites.autres,
                    entretien: declarationForContrat.indemnites.entretien,
                }
            },
            total: declarationForContrat.indemnites,
        },
        infoPaje: {
            dtPrelevementPrevisionnelle: (new Date()).toISOString().split("T")[0],
            dtVersementPrevisionnelle: (new Date()).toISOString().split("T")[0],
            mntApreleverParPaje: 0,
            mntAverserParPaje: 0,
            mntCotiEmplAcharge: 0,
            mntCotiPriseEnChargeOdpf: 0,
            mntCotisations: 0,
            mntEmplAverserSalarie: 0,
            mntEmplCmgRemuneration: 0,
            mntImpotPas: 0,
            mntSalaireNetApayerApresPas: 0,
            mntSalaireNetImposable: 0,
            txPas: 0,
            dateVirement: (new Date()).toISOString().split("T")[0],
            indcDeclPajemploiPlus: false
        },
        absences: {
            [declarationForContrat.contrat]: {
                assmat: {
                    exceptionelles: declarationForContrat.absences.assmat.exceptionelles,
                    maladie: declarationForContrat.absences.assmat.maladie,
                    payees: declarationForContrat.absences.assmat.payees,
                    sansSolde: declarationForContrat.absences.assmat.sansSolde,
                },
                enfant: {
                    familiales: declarationForContrat.absences.enfant.familiales,
                    maladie: declarationForContrat.absences.enfant.maladie,
                }
            }
        },
        jours: {
            contrats: {
                [declarationForContrat.contrat]: {
                    activite: declarationForContrat.jours.activite,
                    activiteADeclarer: declarationForContrat.jours.activiteADeclarer,
                    reels: declarationForContrat.jours.reels,
                }
            },
            total: declarationForContrat.jours,
        },
        contrats: [
            {
                id: declarationForContrat.contrat,
                enfant: declarationForContrat.enfant.prenom+" "+declarationForContrat.enfant.nom,
                methodeRemunerationCongesPayes: "", // A définir ou générer si nécessaire
            }
        ],
        salaires: {
            contrats: {
                [declarationForContrat.contrat]: {
                    normal: declarationForContrat.salaires.normal,
                    congesPayes: declarationForContrat.salaires.congesPayes,
                    majore: declarationForContrat.salaires.majore,
                    specifique: declarationForContrat.salaires.specifique,
                    aVerser: declarationForContrat.salaires.aVerser,
                    net: declarationForContrat.salaires.net,
                    complementaire: declarationForContrat.salaires.complementaire,
                }
            },
            total: declarationForContrat.salaires,
        },
    };
}


export function convertFromDeclarationType(declaration: DeclarationType): DeclarationForContrat {
    const contratId = declaration.contrats[0].id; // Supposons qu'il y a toujours au moins un contrat

    return {
        contrat: contratId,
        absences: {
            assmat: {
                exceptionelles: declaration.absences[contratId].assmat.exceptionelles,
                maladie: declaration.absences[contratId].assmat.maladie,
                payees: declaration.absences[contratId].assmat.payees,
                sansSolde: declaration.absences[contratId].assmat.sansSolde,
            },
            enfant: {
                familiales: declaration.absences[contratId].enfant.familiales,
                maladie: declaration.absences[contratId].enfant.maladie,
            }
        },
        salaires: {
            normal: {
                montant: declaration.salaires.contrats[contratId].normal.montant,
                nbHeures: declaration.salaires.contrats[contratId].normal.nbHeures,
            },
            congesPayes: {
                montant: declaration.salaires.contrats[contratId].congesPayes.montant,
                nbJours: declaration.salaires.contrats[contratId].congesPayes.nbJours,
            },
            majore: {
                montant: declaration.salaires.contrats[contratId].majore.montant,
                nbHeures: declaration.salaires.contrats[contratId].majore.nbHeures,
            },
            specifique: {
                montant: declaration.salaires.contrats[contratId].specifique.montant,
                nbHeures: declaration.salaires.contrats[contratId].specifique.nbHeures,
            },
            complementaire: {
                montant: declaration.salaires.contrats[contratId].complementaire.montant,
                nbHeures: declaration.salaires.contrats[contratId].complementaire.nbHeures,
            },
            aVerser: declaration.salaires.contrats[contratId].aVerser,
            net: declaration.salaires.contrats[contratId].net,
        },
        indemnites: {
            repas: declaration.indemnites.contrats[contratId].repas,
            kilometriques: declaration.indemnites.contrats[contratId].kilometriques,
            total: declaration.indemnites.contrats[contratId].total,
            autres: declaration.indemnites.contrats[contratId].autres,
            entretien: declaration.indemnites.contrats[contratId].entretien,
        },
        jours: {
            activite: declaration.jours.contrats[contratId].activite,
            activiteADeclarer: declaration.jours.contrats[contratId].activiteADeclarer,
            reels: declaration.jours.contrats[contratId].reels,
        },
        isAnnualContract: false, // Valeur par défaut ou générée en fonction de vos besoins
        nbHeuresMensualisees: 0, // À calculer ou définir
        nbHeuresQuiAuraientDuEtreEffectuees: 0, // À calculer ou définir
        nbHeuresMajoreesBase: 0, // À calculer ou définir
        salaireMensuelNet: 0, // À calculer ou définir
        enfant: {
            id: 0, // Définir en fonction des données de votre application
            nom: declaration.contrats[0].enfant,
            prenom: "", // À compléter si nécessaire
            dateNaissance: "", // À compléter si nécessaire
        },
        nbHeuresNormalesAbsence: 0, // À définir ou calculer
        nbHeuresMajoreesAbsence: 0, // À définir ou calculer
        nbHeuresMajoreesAAjouter: 0, // À définir ou calculer
    };
}
