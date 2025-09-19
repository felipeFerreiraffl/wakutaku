import type { JikanSeasonResponse } from "../types/jikanTypes.js";

export const mostFrequentTheme = (
  theme: "genres" | "demographics",
  data: JikanSeasonResponse,
  dataMap: Record<string, number>
): string => {
  let mostFrequentData = "";
  let maxCount = 0;

  if (theme === "genres") {
    // Busca os gêneros de todos os animes e inicia uma contagem relacionada ao tema
    data.data.forEach((list) =>
      list.genres.forEach((genre) => {
        dataMap[genre.name] = (dataMap[genre.name] || 0) + 1;
      })
    );

    // Loop que busca a contagem de cada tema
    for (const [genre, count] of Object.entries(dataMap)) {
      // Verifica se a contagem do tema for maior que outras
      if (count > maxCount) {
        // Atribui aos valores ao tema
        mostFrequentData = genre;
      }
    }
  } else if (theme === "demographics") {
    data.data.forEach((list) =>
      list.demographics.forEach((demography) => {
        dataMap[demography.name] = (dataMap[demography.name] || 0) + 1;
      })
    );

    for (const [demography, count] of Object.entries(dataMap)) {
      // Verifica se a contagem do tema for maior que outras
      if (count > maxCount) {
        // Atribui aos valores ao tema
        mostFrequentData = demography;
      }
    }
  }

  return mostFrequentData;
};
