export default class User {
  civilite: string;
  dateNaissance: string;
  id: number;
  isMayotte: any;
  nom: string;
  pajeId: string;
  password: string;
  prenom: string;
  profile: "PAJE_EMPLOYEUR" | "PAJE_SALARIE";
  role: string;

  constructor(
    civilite: string = '',
    dateNaissance: string = '',
    id: number = 0,
    isMayotte: any = null,
    nom: string = '',
    pajeId: string = '',
    password: string = '',
    prenom: string = '',
    profile: "PAJE_EMPLOYEUR" | "PAJE_SALARIE" = "PAJE_EMPLOYEUR",
    role: string = ''
  ) {
    this.civilite = civilite;
    this.dateNaissance = dateNaissance;
    this.id = id;
    this.isMayotte = isMayotte;
    this.nom = nom;
    this.pajeId = pajeId;
    this.password = password;
    this.prenom = prenom;
    this.profile = profile;
    this.role = role;
  }
}