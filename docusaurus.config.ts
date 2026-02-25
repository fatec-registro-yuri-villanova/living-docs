import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
    title: "MergeSkills Docs",
    tagline: "Documentação Viva — Programação para Dispositivos Móveis",
    favicon: "img/favicon.ico",

    url: "https://fatec-registro-yuri-villanova.github.io",
    baseUrl: "/living-docs/",

    organizationName: "fatec-registro-yuri-villanova",
    projectName: "living-docs",

    onBrokenLinks: "warn",
    onBrokenMarkdownLinks: "warn",

    i18n: {
        defaultLocale: "pt-BR",
        locales: ["pt-BR"],
    },

    presets: [
        [
            "classic",
            {
                docs: {
                    sidebarPath: "./sidebars.ts",
                    editUrl:
                        "https://github.com/fatec-registro-yuri-villanova/living-docs/edit/main/",
                    routeBasePath: "/",
                },
                blog: false,
                theme: {
                    customCss: "./src/css/custom.css",
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        colorMode: {
            defaultMode: "dark",
            disableSwitch: false,
            respectPrefersColorScheme: false,
        },
        navbar: {
            title: "MergeSkills",
            logo: {
                alt: "MergeSkills Logo",
                src: "img/logo.svg",
            },
            items: [
                {
                    type: "docSidebar",
                    sidebarId: "pdmiiSidebar",
                    position: "left",
                    label: "PDMII — Android Nativo",
                },
                {
                    type: "docSidebar",
                    sidebarId: "pdmiSidebar",
                    position: "left",
                    label: "PDMI — React Native",
                },
                {
                    type: "docSidebar",
                    sidebarId: "ldmSidebar",
                    position: "left",
                    label: "LDM — Backend & CMS",
                },
                {
                    href: "https://github.com/fatec-registro-yuri-villanova",
                    label: "GitHub",
                    position: "right",
                },
            ],
        },
        footer: {
            style: "dark",
            links: [
                {
                    title: "Disciplinas",
                    items: [
                        { label: "PDMII — Android Nativo", to: "/pdmii/aula-01" },
                        { label: "PDMI — React Native", to: "/pdmi/aula-01" },
                        { label: "LDM — Backend & CMS", to: "/ldm/aula-01" },
                    ],
                },
                {
                    title: "Ecossistema",
                    items: [
                        {
                            label: "MergeSkills App",
                            href: "https://github.com/fatec-registro-yuri-villanova",
                        },
                        {
                            label: "Design System",
                            href: "https://github.com/fatec-registro-yuri-villanova",
                        },
                    ],
                },
            ],
            copyright: `© ${new Date().getFullYear()} FATEC Registro — Prof. Yuri Villanova. Built with Docusaurus.`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
            additionalLanguages: ["kotlin", "bash", "json", "sql", "groovy"],
        },
    } satisfies Preset.ThemeConfig,
};

export default config;
