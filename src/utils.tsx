// import { useEffect, useState } from "react";

export const parseDate = (date: string) => {
   const splitDate: string[] = date.split("-");
   const splitTime = `${splitDate[2].split("T")[1].split(":")[0]}:${splitDate[2].split("T")[1].split(":")[1]}`;
   const splitDay = splitDate[2].split("T")[0];

   return `${splitDay}/${splitDate[1]}/${splitDate[0]}, ${splitTime}`;
}

export const normalizeSearchStr = (str: string) => str.split(" ").join("").toLowerCase();

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

export const getDailyIncrement = (prevData: number, currData: number, showPercentage: boolean = true) => {
   const difference: number = currData - prevData;
   const percentageDifference: number = showPercentage ? (difference / prevData) * 100 : difference;

   const incrementString = percentageDifference !== 0
      ? `${percentageDifference > 0 ? "+" : ""}${showPercentage ? percentageDifference.toFixed(2).toString() : percentageDifference.toFixed(0).toString()} ${showPercentage ? "%" : ""}`
      : "↔"

   return incrementString;
};
