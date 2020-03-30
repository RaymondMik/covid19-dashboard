import React, { useState, useEffect } from "react";

import Header from "./Header";
import Tiles from "./Tiles";
import Evolution from "./Evolution";
import Daily from "./Daily";
import PositiveCases from "./PositiveCases";

import './App.css';
import { normalizeSearchStr, parseDate } from "./utils";

import * as L from "./localisation.json";
import icon from "./icons/icon.svg";
import virus from "./icons/virus.svg";

function App (props: any) {
  const [data, setData] = useState<any>([]);
  const [dataSetTitle, setDataSetTitle] = useState<string>("");
  const [searchRegioni, setSearchRegioni] = useState<string>("");
  const [searchProvince, setSearchProvince] = useState<string>("");
  const [selectedDateDaily, setSelectedDateDaily] = useState<string>("");
  const [selectedDatePositive, setSelectedDatePositive] = useState<string>("");
  const [hideForProvince, setHideForProvince] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<string>("IT");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasErrored, setHasErrored] = useState<boolean>(false);
  const [noData, setNoData] = useState<boolean>(false);

  const COLORS = ["#009688", "#f8f9fa", "#E64759"];
  const API_URL = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita";

  useEffect(() => {
    let fetchData: string = "";
    const urlPathName = props.location.pathname.split("/");

    if (urlPathName[1] === "regioni" || urlPathName[1] === "province") {
      fetchData = urlPathName[1];
    } else {
      fetchData = "andamento-nazionale";
    }

    fetch(`${API_URL}-${fetchData}.json`)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }

        return response.json();
      })
      .then(data => {
        let filteredData: any = data;

        if (urlPathName[1] === "regioni") {
          filteredData = data.filter((datum: any) => normalizeSearchStr(datum.denominazione_regione) === urlPathName[2]);

          if (!filteredData.length) {
            setNoData(true);
            setIsLoading(false);
          } else {
            setData(filteredData);
            setSelectedDateDaily(filteredData[filteredData.length - 1].data);
            setSelectedDatePositive(filteredData[filteredData.length - 1].data);
            setDataSetTitle(filteredData[filteredData.length - 1].denominazione_regione);
            setHideForProvince(false);
            setIsLoading(false);
          }  
        } else if (urlPathName[1] === "province") {
          filteredData = data.filter((datum: any) => normalizeSearchStr(datum.denominazione_provincia) === urlPathName[2]);
          console.log(999, filteredData);

          if (!filteredData.length) {
            setNoData(true);
            setIsLoading(false);
          } else {
            setData(filteredData);
            setSelectedDateDaily(filteredData[filteredData.length - 1].data);
            setSelectedDatePositive(filteredData[filteredData.length - 1].data);
            setDataSetTitle(filteredData[filteredData.length - 1].denominazione_provincia);
            setHideForProvince(true);
            setIsLoading(false);
          }
        } else {
          setData(filteredData);
          setSelectedDateDaily(filteredData[filteredData.length - 1].data);
          setSelectedDatePositive(filteredData[filteredData.length - 1].data);
          setDataSetTitle("Italia");
          setHideForProvince(false);
          setIsLoading(false);
        }     
      })
      .catch((e) => {
        console.error(e);
        setHasErrored(true);
        setIsLoading(false);
      });
  }, [props.location.pathname]);

  const handleSearchRegion = (e: any) => {
    if (searchProvince.length > 0) {
      setSearchProvince("");
    }

    setSearchRegioni(e.target.value);
  }

  const handleSearchProvince = (e: any) => {
    if (searchRegioni.length > 0) {
      setSearchRegioni("");
    }

    setSearchProvince(e.target.value);
  }

  const handleClickSearch = (e: any) => {
    e.preventDefault();
    if (searchProvince.length > 0) {
      props.history.push(`/province/${normalizeSearchStr(searchProvince)}`);
      // navigate to type province with key
    } else if (searchRegioni.length > 0) {
      // navigate to type regioni with key
      props.history.push(`/regioni/${normalizeSearchStr(searchRegioni)}`);
    } else {
      return;
    }
  }

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
        href="https://github.com/pcm-dpc/COVID-19"
        target="_blank"
        rel="noopener noreferrer"
      >
        {localisation.disclaimer[1]}  
      </a>
      {localisation.disclaimer[2]}<br />
    </p>
  );

  return (
    <div className="container app">
      <nav>
        <div className="site-title-container">
          <img src={virus} className="site-icon" alt="icona che rappresenta la forma del virus COVID-19" />
          <h2>{localisation.title}</h2>
        </div>
        {/* <div>
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
        </div> */}
      </nav>
      <div className="container content">
        {isLoading && !hasErrored && (<div className="loading"></div>)}
        {!isLoading && hasErrored && (<h2>Error</h2>)}
        {!isLoading && !hasErrored && noData && (<h2>No Data muli!</h2>)}
        {!isLoading && !hasErrored && !noData && data.length > 0 && (
          <>
            <div className="row">
              <div className="col-lg-12">
                <header className="panel">
                  <div className="header-title">
                    <div className="title-place">
                        <h3>{dataSetTitle}</h3>
                        <p>{localisation.header} {parseDate(data[data.length - 1].data)}</p>
                    </div>
                    <div className="title-details">
                        <p>Casi totali: {data[data.length - 1].totale_casi}</p>
                        {!hideForProvince ? (
                          <p>Tamponi totali: {data[data.length - 1].tamponi}</p>
                        ) : (
                          <small>Per le province sono disponibili solo i casi totali</small>
                        )}
                    </div>
                  </div>
                  <div className="search-container">
                    <form onSubmit={handleClickSearch}>
                      <label 
                        className={`search-label  ${searchProvince? "disabled" : ""}`}
                      >
                        Vedi dati per regione
                          <input 
                            type="text" 
                            name="search-regione" 
                            className="form-control search-regione" 
                            placeholder="Inserisci nome regione" 
                            value={searchRegioni}
                            onChange={handleSearchRegion}
                          />
                      </label>
                      <label 
                        className={`search-label  ${searchRegioni ? "disabled" : ""}`}
                      >
                        Vedi dati per provincia
                          <input 
                            type="text" 
                            name="search-provincia" 
                            className="form-control search-provincia" 
                            placeholder="Inserisci nome provincia"
                            value={searchProvince}
                            onChange={handleSearchProvince}
                          />
                      </label>
                      <button 
                        type="submit"
                        className="btn btn-success search-button"
                      >
                        {`Cerca ${searchRegioni ? "per regione" : searchProvince ? "per provincia" : ""}`}
                      </button>
                    </form>
                  </div>
                </header>
                {!hideForProvince && (
                  <Tiles 
                    data={data}
                    localisation={localisation}
                  />
                )}
                <Evolution
                  data={data}
                  COLORS={COLORS}
                  localisation={localisation}
                  hideForProvince={hideForProvince}
                />
              </div>
            </div>
            {!hideForProvince && (
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
            )}
            { getSourceLink() }
          </>
        )}
      </div>
    </div>
  );
}

export default App;
