import enTranslation from "@translation/en/translation.json";
import ptBrTranslation from "@translation/pt-BR/translation.json";
import i18n from "i18next";
import languageDetector from "i18next-browser-languagedetector";
import i18nBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

// // Arquivo padrão de tradução
// export const defaultNS = "translation";

// // Recursos e traduções
// export const resources = {
//   en: {
//     translation: enTranslation,
//   },
//   ptBr: {
//     translation: ptBrTranslation,
//   },
// } as const;

// Configuração do i18next
i18n
  .use(i18nBackend)
  .use(initReactI18next)
  .use(languageDetector)
  .init({
    fallbackLng: "pt-BR",
    ns: ["translation"],
    // defaultNS,
    // resources,

    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    interpolation: {
      escapeValue: true,
    },
  });

export default i18n;
