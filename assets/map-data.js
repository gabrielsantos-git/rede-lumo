// Presença da Rede Lumo por estado. Cada estado pode ter mais de uma rede de escolas.
const LUMO_STATES = {
    ba: {
        name: "Bahia",
        networks: [
            {
                name: "Carpe Diem",
                units: [
                    "Carpe Diem - Caculé",
                    "Carpe Diem - Dias Davilla",
                    "Carpe Diem - Feira de Santana",
                    "Carpe Diem - Litoral Norte",
                    "Carpe Diem - Mangabas",
                    "Carpe Diem - Sede/Matriz",
                    "Carpe Diem - Ondina",
                ],
            },
            {
                name: "Casa do Sol",
                units: ["Casa do Sol"],
            },
        ],
    },
    al: {
        name: "Alagoas",
        networks: [
            {
                name: "Carpe Diem",
                units: ["Carpe Diem - Maceió"],
            },
        ],
    },
    ce: {
        name: "Ceará",
        networks: [
            { name: "Aventurando", units: ["Aventurando"] },
            { name: "Exodus", units: ["Exodus"] },
            { name: "Conectivo", units: ["Conectivo"] },
            { name: "Paulo Freire", units: ["Paulo Freire"] },
            { name: "Renascer", units: ["Renascer"] },
        ],
    },
};
