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

  selectedData[0].incremento_positivi = data[selectedDateIndex - 1] ? getDailyIncrement({
    prevData: data[selectedDateIndex - 1].totale_positivi,
    currData: data[selectedDateIndex].totale_positivi, 
    showPercentage: false,
    showPlusSign: false,
    showNegative: false
  }) : data[selectedDateIndex].totale_positivi;

  selectedData[0].incremento_guariti = data[selectedDateIndex - 1] ? getDailyIncrement({
    prevData: data[selectedDateIndex - 1].dimessi_guariti,
    currData: data[selectedDateIndex].dimessi_guariti, 
    showPercentage: false,
    showPlusSign: false,
    showNegative: false
  }) : data[selectedDateIndex].dimessi_guariti;

  selectedData[0].incremento_deceduti = data[selectedDateIndex - 1] ? getDailyIncrement({
    prevData: data[selectedDateIndex - 1].deceduti,
    currData: data[selectedDateIndex].deceduti, 
    showPercentage: false,
    showPlusSign: false,
    showNegative: false
  }) : data[selectedDateIndex].deceduti;

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
          <XAxis dataKey="name" stroke="#eee" tick={{fontSize: 12}} />
          <YAxis stroke="#eee" tick={{fontSize: 12}} />
          <Tooltip cursor={false} contentStyle={{backgroundColor: "#282c34"}}/>
          <Bar dataKey="incremento_positivi" name={localisation.positives} barSize={60} fill={COLORS[0]} />
          <Bar dataKey="incremento_guariti" name={localisation.recovered} barSize={60} fill={COLORS[1]} />
          <Bar dataKey="incremento_deceduti" name={localisation.deaths} barSize={60} fill={COLORS[2]} />
        </BarChart>
      </ResponsiveContainer>
      <ul>
        <li>
          <span className="positive-details__icon" style={{ backgroundColor: COLORS[0]}}/>
          {localisation.positives}: {selectedData[0].incremento_positivi}
        </li>
        <li>
          <span className="positive-details__icon" style={{ backgroundColor: COLORS[1]}}/>
          {localisation.recovered}: {selectedData[0].incremento_guariti}
        </li>
        <li>
          <span className="positive-details__icon" style={{ backgroundColor: COLORS[2]}}/>
          {localisation.deaths}: {selectedData[0].incremento_deceduti}
        </li>
      </ul>
    </section>
  );
};

 export default Daily;