import React from "react";
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { parseDate, getDailyIncrement } from "../utils";

interface DailyProps {
  COLORS: string[];
  data: any;
  handleDailySelect: (e: any) => void;
  localisation: any;
  selectedDateDaily: string;
}

const Daily = ({
  COLORS,
  data,
  handleDailySelect,
  localisation,
  selectedDateDaily
}: DailyProps) => {
  const selectedDateIndex = Object.values(data).findIndex((obj: any) => obj.data === selectedDateDaily);
  const selectedData = data.filter((datum: any) => datum.data === selectedDateDaily);

  if (!selectedData.length) {
    return null;
  }

  return (
    <section className="panel situation-daily">
      <h3 className="section-title">{localisation.daily}</h3>
      <select 
        className="select-day"
        value={selectedDateDaily} 
        onChange={handleDailySelect}
      >
        {
          data.map((data: any, i: number) => (
            <option key={i} value={data.data}>{parseDate(data.data)}</option>
          ))
        }
      </select>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={selectedData} barGap="5%">
          <CartesianGrid stroke="#636363" strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#ccc"/>
          <YAxis stroke="#ccc" />
          <Tooltip contentStyle={{backgroundColor: "#282c34"}}/>
          <Bar dataKey="totale_positivi" name={localisation.positives} barSize={60} fill={COLORS[0]} />
          <Bar dataKey="dimessi_guariti" name={localisation.recovered} barSize={60} fill={COLORS[1]} />
          <Bar dataKey="deceduti" name={localisation.deaths} barSize={60} fill={COLORS[2]} />
        </BarChart>
      </ResponsiveContainer>
      <ul>
        <li>
          <span className="positive-details__icon" style={{ backgroundColor: COLORS[0]}}/>
          {localisation.positives}: {data[selectedDateIndex].totale_positivi} ({getDailyIncrement(data[selectedDateIndex - 1].totale_positivi, data[selectedDateIndex].totale_positivi)})
        </li>
        <li>
          <span className="positive-details__icon" style={{ backgroundColor: COLORS[1]}}/>
          {localisation.recovered}: {data[selectedDateIndex].dimessi_guariti} ({getDailyIncrement(data[selectedDateIndex - 1].dimessi_guariti, data[selectedDateIndex].dimessi_guariti)})
        </li>
        <li>
          <span className="positive-details__icon" style={{ backgroundColor: COLORS[2]}}/>
          {localisation.deaths}: {data[selectedDateIndex].deceduti} ({getDailyIncrement(data[selectedDateIndex - 1].deceduti, data[selectedDateIndex].deceduti)})
        </li>
      </ul>
    </section>
  );
};

 export default Daily;