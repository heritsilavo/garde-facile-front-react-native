export enum MotifHistorisationEnum {
    CREATION = "Création du contrat",
    MODIFICATION_GENERALE = "Modif du contrat",
    MODIFICATION_GARDE = "Modif de la garde",
    MODIFICATION_SALAIRE = "Modif du salaire",
    MODIFICATION_HORAIRES = "Modif des horaires",
    MODIFICATION_PLANNING = "Modif du planning",
    MODIFICATION_INDEMNITES = "Modif des indemnités",
    MODIFICATION_CONGES = "Modif des congés",
    MODIFICATION_ENFANTS = "Modif des infos enfants",
    MODIFICATION_EMPLOYEUR = "Modif des infos employeur",
    MODIFICATION_SALARIE = "Modif des infos salarié",
    RESILIATION = "Résiliation du contrat",
    SUSPENSION = "Suspension du contrat",
    RENOUVELLEMENT = "Renouvellement du contrat",
    AVENANT = "Avenant au contrat",
    AUTRE = "Autre modification",
}

/**
 * Récupère l'énumération à partir du libellé.
 *
 * @param libelle Le libellé recherché
 * @returns L'énumération correspondante ou `undefined` si non trouvée
 */
export function motifHistorisationEnumFromLibelle(libelle: string): MotifHistorisationEnum | undefined {
    const values = Object.values(MotifHistorisationEnum);
    return values.find((motif) => motif === libelle);
}

/**
 * Récupère l'énumération à partir de la clé.
 *
 * @param key La clé de l'énumération recherchée
 * @returns L'énumération correspondante ou `undefined` si non trouvée
 */
export function motifHistorisationEnumFromKey(key: string): MotifHistorisationEnum | undefined {
    const keys = Object.keys(MotifHistorisationEnum) as Array<keyof typeof MotifHistorisationEnum>;
    return keys.includes(key as keyof typeof MotifHistorisationEnum)
        ? MotifHistorisationEnum[key as keyof typeof MotifHistorisationEnum]
        : undefined;
}
