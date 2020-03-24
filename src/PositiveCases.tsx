import React, { useState, useEffect } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { parseDate } from "./utils";

const PositiveCases = (props: any) => {
   const [positiveCaseData, setPositiveCaseData] = useState<Array<any>>([]);
 
   useEffect(() => {
     const formatKey = (key: string) => {
       switch(key) {
         case "isolamentoDomiciliare":
           return "In isolamento domiciliare";
         case "ricoveratiConSintomi":
           return "Ricoverati con sintomi";
         case "terapiaIntensiva":
           return "In terapia intensiva";
         default:
           return key;
       }
     }

     const selectedData = props.data.find((datum: any) => datum.date === props.selectedDatePositive);
     const keys = ["isolamentoDomiciliare", "ricoveratiConSintomi", "terapiaIntensiva"];
     let mappedPositiveData: any[] = [];

     Object.entries(selectedData.dettaglioPositivi).forEach(([key, value]) => {
       // @ts-ignore
       const percentage: string = `${(value / selectedData.positivi * 100).toFixed(2)}%`;
       if (keys.includes(key)) {
         mappedPositiveData.push({name: formatKey(key), value, percentage});
       }
     });
   
     setPositiveCaseData(mappedPositiveData);
     // eslint-disable-next-line
   }, [props.selectedDatePositive])


  const mapLabel = (name: string) => {
    if (name === "Ricoverati con sintomi") {
      return props.localisation.hospitalized;
    } else if (name === "In terapia intensiva") {
      return props.localisation.therapy;
    } else {
      return props.localisation.isolated;
    }
  }
 
   return (
     <section className="panel situation-details">
       <h3 className="section-title">{props.localisation.positiveCases}</h3>
       {<select
         className="select-day"
         value={props.selectedDatePositive} 
         onChange={props.handlePositiveSelect}
       >
         {
           props.data.map((data: any, i: number) => (
             data.dettaglioPositivi && <option key={i} value={data.date}>{parseDate(data.date)}</option>
           ))
         }
       </select>}
       <ResponsiveContainer width="100%" height={300}>
         <PieChart margin={{ top: 30, right: 35, left: 35, bottom: 35 }}>
           <Pie data={positiveCaseData} dataKey="value" cx="50%" cy="50%" innerRadius={0} outerRadius="100%" fill="#82ca9d">
             {
               positiveCaseData.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={props.COLORS[index % props.COLORS.length]}/>)
             }
           </Pie>
         </PieChart>
       </ResponsiveContainer>
       <ul className="positive-details">{positiveCaseData.map((data: any, i: number) => (
         <li key={i}>
           <span className="positive-details__icon" style={{ backgroundColor: props.COLORS[i]}}/>{`${mapLabel(data.name)}: ${data.value} (${data.percentage})`}&#42;
         </li>))}
       </ul>
     </section>
   );
 };

 export default PositiveCases;