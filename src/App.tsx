import React, { useState, useEffect } from "react";
import './App.css';
import { parseDate } from "./utils";

import Evolution from "./Evolution";
import Daily from "./Daily";
import PositiveCases from "./PositiveCases";

import { getDailyIncrement } from "./utils";

import * as L from "./localisation.json";
import icon from "./icons/icon.svg";

function App() {
  const [data, setData] = useState<any>({});
  const [selectedDateDaily, setSelectedDateDaily] = useState<string>("");
  const [selectedDatePositive, setSelectedDatePositive] = useState<string>("");
  const [currentLanguage, setCurrentLanguage] = useState<string>("IT");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // const [data, isLoading] = useFetch("https://c-scraper-it.firebaseio.com/data.json");

  const COLORS = ["#1BC98E", "#f8f9fa", "#E64759"];

  useEffect(() => {
    // fetch("https://c-scraper-it.firebaseio.com/data.json")
    fetch("https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json")
      .then(response => response.json())
      .then(data => {

        console.log(999, data);

        setData(data);
        setSelectedDateDaily(data[data.length - 1].data);
        setSelectedDatePositive(data[data.length - 1].data);
        setIsLoading(false);
      });
  }, []);

  const handleDailySelect = (e: any) => setSelectedDateDaily(e.target.value);
  const handlePositiveSelect = (e: any) => setSelectedDatePositive(e.target.value);
  const handleChangeLang = (lang: string) => setCurrentLanguage(lang)

  //@ts-ignore
  const localisation: any = L.default[currentLanguage];

  const getSourceLink = (cssClass?: string) => (
    <p className={`source-link ${cssClass}`}>
      <p className="explain-increment">{localisation.increment}</p>
      {localisation.disclaimer[0]}  
      <a
        className="link"
        href="http://www.salute.gov.it/portale/nuovocoronavirus/dettaglioContenutiNuovoCoronavirus.jsp?lingua=italiano&id=5351&area=nuovoCoronavirus&menu=vuoto"
        target="_blank"
        rel="noopener noreferrer"
      >
        {localisation.disclaimer[1]}  
      </a>
      {localisation.disclaimer[2]}<br />{localisation.disclaimer[3]}<code>GET https://c-scraper-it.firebaseio.com/data.json</code>
    </p>
  );

  return (
    <div className="container app">
      <nav>
        <div className="site-title-container">
          <img src={icon} className="site-icon" alt="icona che rappresenta la forma del virus COVID-19" />
          <h2>{localisation.title}</h2>
        </div>
        <div>
          <span 
            className={`language-selection ${currentLanguage === "IT" ? "selected" : ""}`}
            onClick={() => handleChangeLang("IT")}
          >
              IT
          </span>
          <span 
            className={`language-selection ${currentLanguage === "EN" ? "selected" : ""}`}
            onClick={() => handleChangeLang("EN")}
          >
            EN
          </span>
        </div>
      </nav>
      <div className="container content">
        {isLoading ? (<div className="loading"></div>) : (
          <>
            <div className="row">
              <div className="col-lg-12">
                <header className="panel">
                  <div className="header-title">
                    <div className="title-place">
                      <h3>Italia</h3>
                      <p> {localisation.header} {parseDate(data[data.length -1].data)}</p>
                    </div>
                    <div className="title-details">
                      <p>Casi totali: {data[data.length -1].totale_casi}</p>
                      <p>Tamponi totali: {data[data.length -1].tamponi}</p>
                    </div>
                  </div>
                </header>
                <div className="details-continer">
                  <div className="details-panel">
                    <div className="details-title">
                      <h4>{localisation.positives}</h4>
                    </div>
                    <div className="details-value">
                      <p>{data[data.length -1].totale_attualmente_positivi}</p>
                      <span className="value-difference">{getDailyIncrement(data[data.length -2].totale_attualmente_positivi, data[data.length -1].totale_attualmente_positivi)}</span>
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
                <Evolution
                  data={data}
                  COLORS={COLORS}
                  localisation={localisation}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 col-lg-6">
                <Daily
                  data={data}
                  selectedDateDaily={selectedDateDaily}
                  handleDailySelect={handleDailySelect}
                  COLORS={COLORS}
                  localisation={localisation}
                />
              </div>
              <div className="col-md-12 col-lg-6">
                <PositiveCases
                  data={data}
                  selectedDatePositive={selectedDatePositive}
                  handlePositiveSelect={handlePositiveSelect}
                  COLORS={COLORS}
                  localisation={localisation}
                />
               
              </div>
            </div>
          </>
        )}
      </div>
      { getSourceLink() }
    </div>
  );
}

export default App;
