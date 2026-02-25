import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
    pdmiiSidebar: [
        {
            type: "category",
            label: "Módulo 1 — UI Declarativa e Kotlin",
            collapsed: false,
            items: [
                "pdmii/aula-01",
                "pdmii/aula-02",
                "pdmii/aula-03",
                "pdmii/aula-04",
            ],
        },
        {
            type: "category",
            label: "Módulo 2 — State Management e Networking",
            items: [
                "pdmii/aula-05",
                "pdmii/aula-06",
                "pdmii/aula-07",
                "pdmii/aula-08",
            ],
        },
        {
            type: "category",
            label: "Módulo 3 — Quiz Flow e Progresso",
            items: [
                "pdmii/aula-09",
                "pdmii/aula-10",
                "pdmii/aula-11",
                "pdmii/aula-12",
            ],
        },
        {
            type: "category",
            label: "Módulo 4 — Auth e Gamificação",
            items: [
                "pdmii/aula-13",
                "pdmii/aula-14",
                "pdmii/aula-15",
                "pdmii/aula-16",
            ],
        },
        {
            type: "category",
            label: "Módulo 5 — Finalização e DevOps",
            items: [
                "pdmii/aula-17",
                "pdmii/aula-18",
                "pdmii/aula-19",
                "pdmii/aula-20",
            ],
        },
    ],

    pdmiSidebar: [
        {
            type: "category",
            label: "Módulo 1 — Fundamentos de UI e Expo",
            collapsed: false,
            items: [
                "pdmi/aula-01",
                "pdmi/aula-02",
                "pdmi/aula-03",
                "pdmi/aula-04",
            ],
        },
        {
            type: "category",
            label: "Módulo 2 — Autenticação e Integração",
            items: [
                "pdmi/aula-05",
                "pdmi/aula-06",
                "pdmi/aula-07",
                "pdmi/aula-08",
            ],
        },
        {
            type: "category",
            label: "Módulo 3 — Quiz e Lógica de Negócio",
            items: [
                "pdmi/aula-09",
                "pdmi/aula-10",
                "pdmi/aula-11",
                "pdmi/aula-12",
            ],
        },
        {
            type: "category",
            label: "Módulo 4 — Gamificação e Perfil",
            items: [
                "pdmi/aula-13",
                "pdmi/aula-14",
                "pdmi/aula-15",
                "pdmi/aula-16",
            ],
        },
        {
            type: "category",
            label: "Módulo 5 — Polish e Entrega",
            items: [
                "pdmi/aula-17",
                "pdmi/aula-18",
                "pdmi/aula-19",
                "pdmi/aula-20",
            ],
        },
    ],

    ldmSidebar: [
        {
            type: "category",
            label: "Módulo 1 — Shared Architecture",
            collapsed: false,
            items: ["ldm/aula-01", "ldm/aula-02", "ldm/aula-03", "ldm/aula-04"],
        },
        {
            type: "category",
            label: "Módulo 2 — Backend com Ktor Server",
            items: ["ldm/aula-05", "ldm/aula-06", "ldm/aula-07", "ldm/aula-08"],
        },
        {
            type: "category",
            label: "Módulo 3 — Lógica Avançada e Gamificação",
            items: ["ldm/aula-09", "ldm/aula-10", "ldm/aula-11", "ldm/aula-12"],
        },
        {
            type: "category",
            label: "Módulo 4 — CMS Desktop",
            items: ["ldm/aula-13", "ldm/aula-14", "ldm/aula-15", "ldm/aula-16"],
        },
        {
            type: "category",
            label: "Módulo 5 — Integração e DevOps",
            items: ["ldm/aula-17", "ldm/aula-18", "ldm/aula-19", "ldm/aula-20"],
        },
    ],
};

export default sidebars;
