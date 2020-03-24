export const parseDate = (date: string) => {
   const splitDate = date.split("/");

   return `${splitDate[1]}/${splitDate[0]}/${splitDate[2]}`;
}

export const getHeaderText = (currentLanguage: string, lastElementHeader: string, localisedHeader: string, localisedMonths: any) => {
   const regex = /gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre/gi;

   const monthsPortion = lastElementHeader.split(":")[1];
   const parsedMonthsPortion = currentLanguage === "IT" ? monthsPortion : monthsPortion.replace(regex, (match: string) => {
      if (currentLanguage === "EN") {
         return localisedMonths[match]
      }

      return match
   }).replace("ore", "at");

   return localisedHeader + parsedMonthsPortion;
}

export const getDailyIncrement = (prevData: number, currData: number) => {
   const difference: number = currData - prevData;
   const percentageDifference: number = (difference / prevData) * 100;

   const incrementString = percentageDifference !== 0 
      ? `${percentageDifference > 0 ? "+" : ""}${percentageDifference.toFixed(0).toString()}%`
      : "↔"

   return incrementString 
};
