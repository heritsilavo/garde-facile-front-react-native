export const FamilleEvenement = {
    ABSENCE_ASSMAT:1, //Amplitude Evenement
    ABSENCE_ENFANT:2, //Amplitude Evenement
    HEURE_JOUR_COMPLEMENTAIRE:3,
    INDEMNITE:4,
    PERIODE_ADAPTATION:5,
    SEMAINE_NON_TRAVAILLEE:6,
    JOUR_FERIE:7, //Amplitude Evenement
}

export const getFamilleExentText = function (key: string) {
    switch (key) {
        case "ABSENCE_ASSMAT":
            return "Absence de l'assistante maternelle";
        case "ABSENCE_ENFANT":
            return "Absence de l'enfant";
        case "HEURE_JOUR_COMPLEMENTAIRE":
            return "Heure ou jour complémentaire";
        case "INDEMNITE":
            return "Indemnité";
        case "PERIODE_ADAPTATION":
            return "Période d'adaptation";
        case "SEMAINE_NON_TRAVAILLEE":
            return "Semaine non travaillée";
        case "JOUR_FERIE":
            return "Jour férié travaillée";
        default:
            return "inconnu";
    }
}