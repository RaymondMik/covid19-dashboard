import { FormattedVaccini } from "./types";

export const parseDate = (date: string): string => {
   const splitDate: string[] = date.split("-");
   const splitTime = `${splitDate[2].split("T")[1].split(":")[0]}:${splitDate[2].split("T")[1].split(":")[1]}`;
   const splitDay = splitDate[2].split("T")[0];

   return `${splitDay}/${splitDate[1]}/${splitDate[0]}, ${splitTime}`;
}

export const normalizeSearchStr = (str: string) => str.split(" ").join("").toLowerCase();

interface getDailyIncrement {
   prevData: number;
   currData: number, 
   showPercentage?: boolean,
   showPlusSign?: boolean,
   showNegative?: boolean
}

// calculate daily increment and parse string as required
export const getDailyIncrement = ({ 
   prevData,
   currData,
   showPercentage = true,
   showNegative = true,
   showPlusSign = true
}: getDailyIncrement): string => {
   const difference: number = currData - prevData;
   const percentageDifference: number = (difference / prevData) * 100;

   const sign = showPlusSign ? difference > 0 ? "+" : "" : "";
   const numericValue = showNegative ? showPercentage ? percentageDifference.toFixed(2).toString() : difference.toString() : difference < 0 ? "↔" : showPercentage ? percentageDifference.toFixed(2).toString() : difference.toString();
   const percentSign = showNegative && showPercentage ? "%" : "";

   return difference !== 0 ? sign + numericValue + percentSign : "↔";
};

interface vacciniObject {
   index: number;
   data_somministrazione: string; 
   area: string; 
   totale: number; 
   sesso_maschile: number; 
   sesso_femminile: number; 
   prima_dose: number; 
   seconda_dose: number; 
   pregressa_infezione: number;
   dose_aggiuntiva: number;
   dose_booster: number;
   codice_NUTS1: string; 
   codice_NUTS2: string; 
   codice_regione_ISTAT: number;
   nome_area: string; 
}

export const formatVaccineData = (data: [vacciniObject]): FormattedVaccini => {
   const formattedVaccini: FormattedVaccini = {};

   for (let i = 0; i < data.length; i++) {
      const dateGiven = data[i].data_somministrazione.split("T")[0];

      if (!formattedVaccini[dateGiven]) {
         formattedVaccini[dateGiven] = data[i].totale;
       } else {
         formattedVaccini[dateGiven] = formattedVaccini[dateGiven] + data[i].totale;
       }
   }

   return formattedVaccini;
}

// export const getHeaderText = (currentLanguage: string, lastElementHeader: string, localisedHeader: string, localisedMonths: any) => {
//    const regex = /gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre/gi;

//    const monthsPortion = lastElementHeader.split(":")[1];
//    const parsedMonthsPortion = currentLanguage === "IT" ? monthsPortion : monthsPortion.replace(regex, (match: string) => {
//       if (currentLanguage === "EN") {
//          return localisedMonths[match]
//       }
// 
//       return match
//    }).replace("ore", "at");

//    return localisedHeader + parsedMonthsPortion;
// }
