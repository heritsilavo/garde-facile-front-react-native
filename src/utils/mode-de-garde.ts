export type TypeModeGarde = {
    type: 'A' | 'B',
    titre: string,
    desc: string,
}

export const type_A: TypeModeGarde = {
    type: 'A',
    titre: "52 semmaine de garde",
    desc: "L'enfant est gardé 47 semmaine par an, les 5 semmaines restantes sont des congées payées",
}

export const type_B: TypeModeGarde = {
    type: 'B',
    titre: "46 semmaine ou moins",
    desc: "L'enfant est gardé 46 semmaine ou moins par an, les semmaines restantes sont des congées payées ou des semmaines d'absences"
}

export const getModeGardeByType = function (type: 'A' | 'B') {
    return (type == 'A') ? type_A : type_B;
}