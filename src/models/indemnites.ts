
export class IndemniteEntity {

    uuid: string;
    entretien: number;
    repas: number;
    kilometrique: number;
    contrat: string;

    constructor(data?: {
        uuid: string,
        entretien: number,
        repas: number,
        kilometrique: number,
        contrat: string,
    }) {
        if (data) {
            this.uuid = data.uuid;
            this.entretien = data.entretien;
            this.repas = data.repas;
            this.kilometrique = data.kilometrique;
            this.contrat = data.contrat;
        } else {
            this.uuid = "";
            this.entretien = 0;
            this.repas = 0;
            this.kilometrique = 0;
            this.contrat = "";
        }
    }
}