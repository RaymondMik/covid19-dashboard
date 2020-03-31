import React  from "react";
import { getDailyIncrement } from "./utils";

interface TilesProps {
   data: any
   localisation: any
 }

const Tiles = ({
   data,
   localisation
}: TilesProps) => (
   <div className="details-continer">
   <div className="details-panel">
     <div className="details-title">
       <h4>{localisation.positives}</h4>
     </div>
     <div className="details-value">
       <p>{data[data.length -1].totale_positivi}</p>
       <span className="value-difference">{getDailyIncrement(data[data.length -2].totale_positivi, data[data.length -1].totale_positivi)}</span>
     </div>
   </div>
   <div className="details-panel">
     <div className="details-title">
       <h4>{localisation.casiTamponi}</h4>
     </div>
     <div className="details-value">
       <p>{(data[data.length -1].totale_casi / data[data.length -1].tamponi * 100).toFixed(2)}%</p>
     </div>
   </div>
   <div className="details-panel">
     <div className="details-title">
       <h4>{localisation.totalHospitalized}</h4>
     </div>
     <div className="details-value">
       <p>{data[data.length -1].totale_ospedalizzati}</p>
       <span className="value-difference">{getDailyIncrement(data[data.length -2].totale_ospedalizzati, data[data.length -1].totale_ospedalizzati)}</span>
     </div>
   </div>
   <div className="details-panel">
     <div className="details-title">
       <h4>{localisation.recovered}</h4>
     </div>
     <div className="details-value">
       <p>{data[data.length -1].dimessi_guariti}</p>
       <span className="value-difference">{getDailyIncrement(data[data.length -2].dimessi_guariti, data[data.length -1].dimessi_guariti)}</span>
     </div>
   </div>
   <div className="details-panel">
     <div className="details-title">
       <h4>{localisation.deaths}</h4>
     </div>
     <div className="details-value">
       <p>{data[data.length -1].deceduti}</p>
       <span className="value-difference">{getDailyIncrement(data[data.length -2].deceduti, data[data.length -1].deceduti)}</span>
     </div>
   </div>
 </div>
);

export default Tiles;