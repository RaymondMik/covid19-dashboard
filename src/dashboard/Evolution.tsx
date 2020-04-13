import React from "react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface EvolutionProps {
  COLORS: string[];
  data: any;
  localisation: any;
  hideForProvince?: boolean;
  cssClass: string
}

const Evolution = ({
  COLORS,
  data,
  localisation,
  hideForProvince,
  cssClass
}: EvolutionProps ) => {
  const mappedData = data.map((datum: any) => { 
    datum.name = `${datum.data.split("-")[2].split("T")[0]}/${datum.data.split("-")[1]}`;
    return datum;
  });

  return (
    <section className={`panel ${cssClass}`}>
      <h3 className="section-title">{localisation.evolution}</h3>
      {hideForProvince ? (
        <ResponsiveContainer>
          <LineChart data={mappedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid stroke="#636363" strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#eee"/>
            <YAxis stroke="#eee" />
            <Tooltip contentStyle={{backgroundColor: "#282c34"}}/>
            <Legend 
            iconType={"plainline"}
            iconSize={12}
            />
            <Line type="monotone" dataKey="totale_casi" dot={false} strokeWidth={3} name={data.data} stroke={COLORS[1]} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer>
          <LineChart data={mappedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 0 }}
            >
            <CartesianGrid stroke="#636363" strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#eee"/>
            <YAxis stroke="#eee" />
            <Tooltip contentStyle={{backgroundColor: "#282c34"}}/>
            <Legend 
              iconType={"plainline"}
              iconSize={12}
            />
            <Line type="monotone" dataKey="totale_positivi" dot={false} strokeWidth={3} name={data.data} stroke={COLORS[0]} />
            <Line type="monotone" dataKey="dimessi_guariti" dot={false} strokeWidth={3} name={data.data} stroke={COLORS[1]} />
            <Line type="monotone" dataKey="deceduti" dot={false} strokeWidth={3} name={data.data} stroke={COLORS[2]} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </section>
 )};

 export default Evolution;
 