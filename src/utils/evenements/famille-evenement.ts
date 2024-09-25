export const FamilleEvenement = {
    ABSENCE_ASSMAT: 1, //Amplitude Evenement
    ABSENCE_ENFANT: 2, //Amplitude Evenement
    HEURE_JOUR_COMPLEMENTAIRE: 3,
    INDEMNITE: 4,
    PERIODE_ADAPTATION: 5,
    SEMAINE_NON_TRAVAILLEE: 6,
    JOUR_FERIE: 7, //Amplitude Evenement
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

const getHueVariation = function (params: number) {
    switch (params) {
        case 1:
            return 0
        case 2:
            return -10
        case 3:
            return 10
        case 4:
            return -20
        case 5:
            return 20
        case 6:
            return -30
        case 7:
            return 15
        default:
            return 15
    }
}

export function generateColorForEvent(familleEvenement: number): string {
    const baseHue = 30; // Teinte pour orange
    const hueVariation = {
        1: 0,  // ABSENCE_ASSMAT -> Orange pur
        2: -10, // ABSENCE_ENFANT -> Un peu plus rouge
        3: 10, // HEURE_JOUR_COMPLEMENTAIRE -> Un peu plus jaune
        4: -20, // INDEMNITE -> Rouge intense
        5: 20, // PERIODE_ADAPTATION -> Jaune clair
        6: -30, // SEMAINE_NON_TRAVAILLEE -> Rouge très foncé
        7: 15, // JOUR_FERIE -> Jaune orangé
    };



    const hue = (baseHue + getHueVariation(familleEvenement)) % 360;

    // Générer la couleur en HSL et la convertir en hexadécimal
    const color = hslToHex(hue, 70, 50);
    return color;
}
// Convertir une couleur HSL en Hex
function hslToHex(h: number, s: number, l: number) {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
    } else if (300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}