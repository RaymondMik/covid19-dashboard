import React  from "react";
import { getDailyIncrement } from "../utils";
import { Data } from "../types";

interface TilesProps {
   data: Data[];
   localisation: any;
   totaleDosiVaccino: number;
 }

const Tiles = ({
   data,
   localisation,
   totaleDosiVaccino
}: TilesProps) => {
  const isRegione: boolean = window.location.pathname.split("/")[1] === "regioni";
  const casiTamponi: string = Number((data[data.length -1].totale_casi / data[data.length -1].tamponi * 100).toFixed(2)).toLocaleString("it");
  const tassoMortalita: string = Number((data[data.length -1].deceduti / data[data.length -1].totale_casi * 100).toFixed(2)).toLocaleString("it");
  const totaleVaccini = totaleDosiVaccino > 999999 ? totaleDosiVaccino.toLocaleString("it").split(".")[0] + "M" : totaleDosiVaccino;

  return (
  <>
    <div className="col-sm-6 col-md-6 col-lg-2 details-panel-wrapper">
      <div className="details-panel">
        <div className="details-title">
          <h4>{localisation.positives}</h4>
        </div>
        <div className="details-value">
          <p>{data[data.length -1].totale_positivi.toLocaleString("it")}</p>
      
          <span className="value-difference">
            ({getDailyIncrement(data[data.length -2].totale_positivi, data[data.length -1].totale_positivi, false)})
          </span>
        </div>
      </div>
    </div>
    {isRegione ? (
      <div className="col-sm-6 col-md-6 col-lg-2 details-panel-wrapper">
        <div className="details-panel">
          <div className="details-title">
            <h4>{localisation.recovered}</h4>
          </div>
          <div className="details-value">
            <p>{data[data.length -1].dimessi_guariti.toLocaleString("it")}</p>
            <span className="value-difference">({getDailyIncrement(data[data.length -2].dimessi_guariti, data[data.length -1].dimessi_guariti)})</span>
          </div>
        </div>
      </div>
    ) : (
      <div className="col-sm-6 col-md-6 col-lg-2 details-panel-wrapper">
        <div className="details-panel">
          <div className="details-title">
            <h4>{localisation.vaccinated}</h4>
          </div>
          <div className="details-value">
            <p>{totaleVaccini}</p>
            <span className="value-difference">-</span>
          </div>
        </div>
      </div>
    )}
    <div className="col-sm-6 col-md-6 col-lg-2 details-panel-wrapper">
      <div className="details-panel">
        <div className="details-title">
          <h4>{localisation.deaths}</h4>
        </div>
        <div className="details-value">
          <p>{data[data.length -1].deceduti.toLocaleString("it")}</p>
          <span className="value-difference">({getDailyIncrement(data[data.length -2].deceduti, data[data.length -1].deceduti)})</span>
        </div>
      </div>
    </div>
    <div className="col-sm-6 col-md-6 col-lg-2 details-panel-wrapper">
      <div className="details-panel">
        <div className="details-title">
          <h4>{localisation.totalHospitalized}</h4>
        </div>
        <div className="details-value">
          <p>{data[data.length -1].totale_ospedalizzati.toLocaleString("it")}</p>
          <span className="value-difference">({getDailyIncrement(data[data.length -2].totale_ospedalizzati, data[data.length -1].totale_ospedalizzati)})</span>
        </div>
      </div>
    </div>
    <div className="col-sm-6 col-md-6 col-lg-2 details-panel-wrapper">
      <div className="details-panel">
        <div className="details-title">
          <h4>{localisation.casiTamponi}</h4>
        </div>
        <div className="details-value">
          <p>{casiTamponi}%</p>
          <span className="value-difference">-</span>
        </div>
      </div>
    </div>
    <div className="col-sm-6 col-md-6 col-lg-2 details-panel-wrapper">
      <div className="details-panel">
        <div className="details-title">
          <h4>{localisation.mortalityRate}</h4>
        </div>
        <div className="details-value">
          <p>{tassoMortalita}%</p>
          <span className="value-difference">-</span>
        </div>
      </div>
    </div>
  </>
);}

export default Tiles;