export interface Mois {
    year: number;
    monthIndex: number;
}

export interface Semaine {
    dateDebut: Date;
    dateFin: Date;
    label: string;
    numeroSemmaine: number; // Ajouté pour stocker le numéro de la semaine
}

export function obtenirSemaines(mois: Mois): Semaine[] {
    const { year, monthIndex } = mois;
    const semaines: Semaine[] = [];

    // Calculer le premier jour du mois
    const premierJourDuMois = new Date(year, monthIndex, 1);
    // Calculer le dernier jour du mois
    const dernierJourDuMois = new Date(year, monthIndex + 1, 0);

    // Initialiser la date de début de la première semaine
    let dateDebutSemaine = new Date(premierJourDuMois);
    // Ajuster pour commencer à partir du lundi
    dateDebutSemaine.setDate(dateDebutSemaine.getDate() - dateDebutSemaine.getDay() + 1);

    // Initialiser le numéro de la semaine
    let numeroSemmaine = 0;

    // Boucle pour créer les semaines
    while ((dateDebutSemaine <= dernierJourDuMois || dateDebutSemaine.getMonth() === monthIndex + 1) && semaines.length <= 4) {
        const dateFinSemaine = new Date(dateDebutSemaine);
        dateFinSemaine.setDate(dateFinSemaine.getDate() + 6);

        // Créer le label
        const label = `Du ${dateDebutSemaine.getDate()} au ${dateFinSemaine.getDate()} ${getNomMois(dateFinSemaine.getMonth())}`;

        // Ajouter la semaine à la liste avec le numéro de la semaine
        semaines.push({
            dateDebut: new Date(dateDebutSemaine),
            dateFin: new Date(dateFinSemaine),
            label: label,
            numeroSemmaine: numeroSemmaine, // Affectation du numéro de la semaine
        });

        // Passer à la semaine suivante
        dateDebutSemaine.setDate(dateDebutSemaine.getDate() + 7);
        numeroSemmaine++; // Incrémenter le numéro de la semaine
    }

    return semaines;
}

// Fonction pour obtenir le nom du mois
function getNomMois(index: number): string {
    const nomsMois = [
        "janvier", "février", "mars", "avril", "mai", "juin",
        "juillet", "août", "septembre", "octobre", "novembre", "décembre"
    ];
    return nomsMois[index];
}