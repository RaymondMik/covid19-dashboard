import React from "react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const Evolution = (props: any) => (
   <section className="panel situation-evolution">
     <h3 className="section-title">{props.evolution}</h3>
     <ResponsiveContainer>
       <LineChart data={props.data}
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
         <Line type="monotone" dataKey="positivi" dot={false} strokeWidth={4.5} name={props.localisation.positives} stroke={props.COLORS[0]} />
         <Line type="monotone" dataKey="guariti" dot={false} strokeWidth={4.5} name={props.localisation.recovered} stroke={props.COLORS[1]} />
         <Line type="monotone" dataKey="deceduti" dot={false} strokeWidth={4.5} name={props.localisation.deceased} stroke={props.COLORS[2]} />
       </LineChart>
     </ResponsiveContainer>
   </section>
 );

 export default Evolution;
 