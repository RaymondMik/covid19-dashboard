import React, { useState, useEffect } from "react";
import {
  Switch,
  Route,
  Link
} from "react-router-dom";

import Dashboard from "./dashboard";
import Regioni from "./Regioni";
import Province from "./Province";
import SourceLink from "./SourceLink";

import './App.css';
import { normalizeSearchStr } from "./utils";

import * as L from "./localisation.json";
import * as S from "./static.json";
import virus from "./icons/virus.svg";

function App (props: any) {
  const [data, setData] = useState<any>([]);
  const [dataSetTitle, setDataSetTitle] = useState<string>("");
  const [searchRegioni, setSearchRegioni] = useState<string>("");
  const [searchProvince, setSearchProvince] = useState<string>("");
  const [selectedDateDaily, setSelectedDateDaily] = useState<string>("");
  const [selectedDatePositive, setSelectedDatePositive] = useState<string>("");
  const [hideForProvince, setHideForProvince] = useState<boolean>(false);
  const [isMobileNavOpen, setMobileNavOpen] =  useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<string>("IT");
  const [searchProvinceSuggestion, setSearchProvinceSuggestion] = useState<string[]>([]);
  const [searchRegioniSuggestion, setSearchRegioniSuggestion] = useState<string[]>([]);

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
      .then(res => {
        let filteredData: any = res;

        if (urlPathName[1] === "regioni") {
          if (urlPathName[2]) {
            filteredData = res.filter((datum: any) => normalizeSearchStr(datum.denominazione_regione) === urlPathName[2]);
          }

          if (!filteredData.length) {
            setNoData(true);
            setIsLoading(false);
          } else {
            setData(filteredData);
            setSelectedDateDaily(filteredData[filteredData.length - 1].data);
            setSelectedDatePositive(filteredData[filteredData.length - 1].data);
            setDataSetTitle(filteredData[filteredData.length - 1].denominazione_regione);
            setHideForProvince(false);
            setNoData(false);
            setIsLoading(false);
          }  
        } else if (urlPathName[1] === "province") {
          if (urlPathName[2]) {
            filteredData = res.filter((datum: any) => normalizeSearchStr(datum.denominazione_provincia) === urlPathName[2]);
          }

          if (!filteredData.length) {
            setNoData(true);
            setIsLoading(false);
          } else {
            setData(filteredData);
            setSelectedDateDaily(filteredData[filteredData.length - 1].data);
            setSelectedDatePositive(filteredData[filteredData.length - 1].data);
            setDataSetTitle(filteredData[filteredData.length - 1].denominazione_provincia);
            setHideForProvince(true);
            setNoData(false);
            setIsLoading(false);
          }
        } else {
          setData(filteredData);
          setSelectedDateDaily(filteredData[filteredData.length - 1].data);
          setSelectedDatePositive(filteredData[filteredData.length - 1].data);
          setDataSetTitle("Italia");
          setHideForProvince(false);
          setNoData(false);
          setIsLoading(false);
        }     
      })
      .catch((e) => {
        console.error(e);
        setHasErrored(true);
        setIsLoading(false);
      });
  }, [props.location.pathname, props.history]);

  const handleSearchRegion = (e: any) => {
    if (searchProvince.length > 0) {
      setSearchProvince("");
    }

    const matches:string[] = [];

    S.regioni.forEach((regione: string) => {
      if (e.target.value.length > 0 && regione.toLowerCase().startsWith(e.target.value.trim().toLowerCase())) {
        matches.push(regione);
      } 
    });

    setSearchRegioniSuggestion(matches);

    setSearchRegioni(e.target.value);
  }

  const handleSearchProvince = (e: any) => {
    if (searchRegioni.length > 0) {
      setSearchRegioni("");
    }

    const matches:string[] = [];

    S.provincie.forEach((provincia: string) => {
      if (e.target.value.length > 0 && provincia.toLowerCase().startsWith(e.target.value.trim().toLowerCase())) {
        matches.push(provincia);
      } 
    });

    setSearchProvinceSuggestion(matches);

    setSearchProvince(e.target.value);
  }

  const handleClickSuggestion = (suggestion: string, type: string) => {
    if (type === "province") {
      setSearchProvince(suggestion);
      setSearchProvinceSuggestion([]);
    } else {
      setSearchRegioni(suggestion);
      setSearchRegioniSuggestion([]);
    }
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

  // const handleChangeLang = (lang: string) => setCurrentLanguage(lang)

  const toggleMobileNavbar = () => setMobileNavOpen(!isMobileNavOpen);

  //@ts-ignore
  const localisation: any = L.default[currentLanguage];

  return (
    <div className="app">
      <nav className="navbar navbar-dark navbar-expand-md bg-dark justify-content-between sitenav">
        <div className="container">
          <Link to="/" className="navbar-brand site-title-container">
            <img src={virus} className="site-icon" alt="icona che rappresenta la forma del virus COVID-19" />
            <h2>{localisation.title}</h2>
          </Link>
          <button 
            className={`navbar-toggler ${!isMobileNavOpen ? "collapsed" : ""}`} 
            type="button" 
            data-toggle="collapse" 
            data-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded={isMobileNavOpen}
            aria-label="Toggle navigation"
            onClick={toggleMobileNavbar}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse order-0 ${isMobileNavOpen ? "show" : ""}`} id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/regioni">Regioni</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/province">Province</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
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
          EN EN
        </span>
      </div> */}
      
      <div className="container content">
        {isLoading && !hasErrored && (<div className="loading"></div>)}
        {!isLoading && hasErrored && (<h2>Error</h2>)}
        {!isLoading && noData && !data.length && (<h2>404 not found</h2>)}
        {!isLoading && !hasErrored && data.length > 0 && (
          <Switch>
            <Route exact path="/regioni">
              <Regioni
                data={data}
                localisation={localisation}
                COLORS={COLORS}
              />
            </Route>
            <Route exact path="/province">
              <Province 
                data={data}
                localisation={localisation}
              />
            </Route>
            <Route path={["/", "/province/:provinceId", "/regioni/:regioneId"]}>
              <Dashboard
                COLORS={COLORS}
                data={data}
                dataSetTitle={dataSetTitle}
                hideForProvince={hideForProvince}
                handleClickSearch={handleClickSearch}
                handleSearchRegion={handleSearchRegion}
                handleSearchProvince={handleSearchProvince}
                hasErrored={hasErrored}
                isLoading={isLoading}
                localisation={localisation}
                noData={noData}
                searchRegioni={searchRegioni}
                searchProvince={searchProvince}
                searchProvinceSuggestion={searchProvinceSuggestion}
                searchRegioniSuggestion={searchRegioniSuggestion}
                handleClickSuggestion={handleClickSuggestion}
                selectedDateDaily={selectedDateDaily}
                selectedDatePositive={selectedDatePositive}
                handleDailySelect={handleDailySelect}
                handlePositiveSelect={handlePositiveSelect}
              />
            </Route>
          </Switch>
        )}
        <SourceLink
          localisation={localisation}
        />
      </div>
    </div>
  );
}

export default App;
