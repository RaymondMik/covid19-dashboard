import React, { useState, useEffect } from "react";
import './App.css';

import Evolution from "./Evolution";
import Daily from "./Daily";
import PositiveCases from "./PositiveCases";

import { getHeaderText, getDailyIncrement } from "./utils";

import * as L from "./localisation.json";

function App() {
  const [data, setData] = useState<any>({});
  const [selectedDateDaily, setSelectedDateDaily] = useState<string>("");
  const [selectedDatePositive, setSelectedDatePositive] = useState<string>("");
  const [currentLanguage, setCurrentLanguage] = useState<string>("IT");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // const [data, isLoading] = useFetch("https://c-scraper-it.firebaseio.com/data.json");

  const COLORS = ["#1BC98E", "#f8f9fa", "#E64759"];



  useEffect(() => {
    fetch("https://c-scraper-it.firebaseio.com/data.json")
      .then(response => response.json())
      .then(data => {
        let dataArray = [];

        for (let datum in data) {
          dataArray.push(data[datum]);
        }

        setData(dataArray);
        setSelectedDateDaily(dataArray[dataArray.length - 1].date);
        setSelectedDatePositive(dataArray[dataArray.length - 1].date);
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
    <div className="container-fluid app">
      <nav>
        <h2>{localisation.title}</h2>
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
      <div className="content">
        {isLoading ? (<div className="loading"></div>) : (
          <div className="row">
            <div className="col-md-12 col-lg-8">
              <header className="panel"><h4>{getHeaderText(currentLanguage, data[data.length -1].header, localisation.header, localisation.months)}</h4>
                <div className="daily-numbers">
                  <span style={{color: COLORS[0]}}>
                    {localisation.positives}: {data[data.length -1].positivi} <span className="percentage-increase">{getDailyIncrement(data[data.length -2].positivi, data[data.length -1].positivi)}&#42;</span>
                  </span>
                  <span  style={{color: COLORS[1]}}>
                    {localisation.recovered}: {data[data.length -1].guariti} <span className="percentage-increase">{getDailyIncrement(data[data.length -2].guariti, data[data.length -1].guariti)}&#42;</span>
                  </span>
                  <span  style={{color: COLORS[2]}}>
                    {localisation.deceased}: {data[data.length -1].deceduti} <span className="percentage-increase">{getDailyIncrement(data[data.length -2].deceduti, data[data.length -1].deceduti)}&#42;</span>
                  </span>
                </div>
              </header>
              <Evolution 
                data={data}
                COLORS={COLORS}
                localisation={localisation}
              />
              { getSourceLink("d-none d-lg-block") }
            </div>
            <div className="col-md-12 col-lg-4">
              <Daily
                data={data}
                selectedDateDaily={selectedDateDaily}
                handleDailySelect={handleDailySelect}
                COLORS={COLORS}
                localisation={localisation}
              />
              <PositiveCases
                data={data}
                selectedDatePositive={selectedDatePositive}
                handlePositiveSelect={handlePositiveSelect}
                COLORS={COLORS}
                localisation={localisation}
              />
              { getSourceLink("d-xs-block d-sm-block d-md-block d-lg-none") }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
