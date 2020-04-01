import React from "react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const Evolution = (props: any) => {
  const mappedData = props.data.map((datum: any) => { 
    datum.name = `${datum.data.split("-")[2].split("T")[0]}/${datum.data.split("-")[1]}`;
    return datum;
  });

  return (
   <section className="panel situation-evolution">
     <h3 className="section-title">{props.localisation.evolution}</h3>
     {!props.hideForProvince ? (
      <ResponsiveContainer>
       <LineChart data={mappedData}
         margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
         <CartesianGrid strokeDasharray="3 3" />
         <XAxis dataKey="name" stroke="#FFF"/>
         <YAxis stroke="#FFF" />
         <Tooltip contentStyle={{backgroundColor: "#282c34"}}/>
         <Legend 
          iconType={"plainline"}
          iconSize={12}
         />
        <Line type="monotone" dataKey="totale_positivi" dot={false} strokeWidth={4.5} name={props.data.data} stroke={props.COLORS[0]} />
        <Line type="monotone" dataKey="dimessi_guariti" dot={false} strokeWidth={4.5} name={props.data.data} stroke={props.COLORS[1]} />
        <Line type="monotone" dataKey="deceduti" dot={false} strokeWidth={4.5} name={props.data.data} stroke={props.COLORS[2]} />
       </LineChart>
     </ResponsiveContainer>
     ) : (
      <ResponsiveContainer>
        <LineChart data={mappedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#FFF"/>
          <YAxis stroke="#FFF" />
          <Tooltip contentStyle={{backgroundColor: "#282c34"}}/>
          <Legend 
          iconType={"plainline"}
          iconSize={12}
          />
          <Line type="monotone" dataKey="totale_casi" dot={false} strokeWidth={4.5} name={props.data.data} stroke={props.COLORS[1]} />
        </LineChart>
      </ResponsiveContainer>
     )}
   </section>
 )};

 export default Evolution;
 