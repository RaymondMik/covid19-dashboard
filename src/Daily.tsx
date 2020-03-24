import React from "react";
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { parseDate, getDailyIncrement } from "./utils";

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
  const selectedDateIndex = Object.values(data).findIndex((obj: any) => obj.date === selectedDateDaily);
  const selectedData = data.filter((datum: any) => datum.date === selectedDateDaily);

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
            <option key={i} value={data.date}>{parseDate(data.date)}</option>
          ))
        }
      </select>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={selectedData} barGap="5%">
          <CartesianGrid />
          <XAxis dataKey="name" stroke="#FFF"/>
          <YAxis stroke="#FFF" />
          <Tooltip contentStyle={{backgroundColor: "#282c34"}}/>
          <Bar dataKey="positivi" name={localisation.positives} barSize={60} fill={COLORS[0]} />
          <Bar dataKey="guariti" name={localisation.recovered} barSize={60} fill={COLORS[1]} />
          <Bar dataKey="deceduti" name={localisation.deceased} barSize={60} fill={COLORS[2]} />
        </BarChart>
      </ResponsiveContainer>
      <ul>
        <li>
          <span className="positive-details__icon" style={{ backgroundColor: COLORS[0]}}/>
          {localisation.positives}: {data[selectedDateIndex].positivi} ({getDailyIncrement(data[selectedDateIndex - 1].positivi, data[selectedDateIndex].positivi)})&#42;
        </li>
        <li>
          <span className="positive-details__icon" style={{ backgroundColor: COLORS[1]}}/>
          {localisation.recovered}: {data[selectedDateIndex].guariti} ({getDailyIncrement(data[selectedDateIndex - 1].guariti, data[selectedDateIndex].guariti)})&#42;
        </li>
        <li>
          <span className="positive-details__icon" style={{ backgroundColor: COLORS[2]}}/>
          {localisation.deceased}: {data[selectedDateIndex].deceduti} ({getDailyIncrement(data[selectedDateIndex - 1].deceduti, data[selectedDateIndex].deceduti)})&#42;
        </li>
      </ul>
  </section>)
 };

 export default Daily;