import React, { useState, useEffect, useReducer } from "react";
import {
  Switch,
  Route,
  Link,
  RouteComponentProps
} from "react-router-dom";
import CookieConsent from "react-cookie-consent";
import ReactGA from 'react-ga';
import Dashboard from "./dashboard";
import Regioni from "./routes/Regioni";
import Province from "./routes/Province";
import SourceLink from "./SourceLink";
import CookiePolicy from "./CookiePolicy";
import './App.css';
import { normalizeSearchStr } from "./utils";
import * as L from "./localisation.json";
import * as StaticRegioniProvinceNames from "./static.json";
import virusIcon from "./icons/virusIcon.svg";
import { InitialState } from "./types";

const initialState: InitialState = { 
  data: [],
  dataSetTitle: "",
  selectedDateDaily: "",
  selectedDatePositive: "",
  hideForProvince: false,
  currentLanguage: "IT",
  isLoading: false,
  hasErrored: false,
  noData: false
}

function reducer (state: InitialState, action: any) {
  switch (action.type) {
    case "SET_REGIONI":
      return {
        ...state,
        data: action.payload,
        selectedDateDaily: action.payload[action.payload.length - 1].data,
        selectedDatePositive: action.payload[action.payload.length - 1].data,
        dataSetTitle: action.payload[action.payload.length - 1].denominazione_regione,
        hideForProvince: false,
        noData: false,
        isLoading: false
      }
    case "SET_PROVINCE":
      return {
        ...state,
        data: action.payload,
        selectedDateDaily: action.payload[action.payload.length - 1].data,
        selectedDatePositive: action.payload[action.payload.length - 1].data,
        dataSetTitle: action.payload[action.payload.length - 1].denominazione_provincia,
        hideForProvince: true,
        noData: false,
        isLoading: false
      }
    case "SET_ITALIA":
      return {
        ...state,
        data: action.payload,
        dataSetTitle: "Italia",
        selectedDateDaily: action.payload[action.payload.length - 1].data,
        selectedDatePositive: action.payload[action.payload.length - 1].data,
        hideForProvince: false,
        noData: false,
        isLoading: false      
      }
    case "SET_NO_DATA":
      return {
        ...state,
        isLoading: false,
        noData: true
      }
    case "HAS_ERRORED":
      return {
        ...state,
        isLoading: false,
        hasErrored: true      
      }
    case "SET_SELECTED_DAILY":
      return {
        ...state,
        selectedDateDaily: action.payload
      }
    case "SET_SELECTED_DATE_POSITIVE":
      return {
        ...state,
        selectedDatePositive: action.payload
      }
    default:
      return state;
  }
}

type TParams = { id: string };

function App (props: RouteComponentProps<TParams>) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    data,
    dataSetTitle,
    selectedDateDaily,
    selectedDatePositive,
    hideForProvince,
    currentLanguage,
    isLoading,
    hasErrored,
    noData
  } = state;

  const [searchRegioni, setSearchRegioni] = useState<string>("");
  const [searchProvince, setSearchProvince] = useState<string>("");
  const [searchProvinceSuggestion, setSearchProvinceSuggestion] = useState<string[]>([]);
  const [searchRegioniSuggestion, setSearchRegioniSuggestion] = useState<string[]>([]);
  const [isMobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

  const COLORS = ["#009688", "#f8f9fa", "#E64759"];
  const COOKIE = "cvd19daticookie";
  const API_URL = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita";
  const urlPathName = props.location.pathname.split("/");

  useEffect(() => {
    let fetchData: string = "";

    setSearchRegioni("");
    setSearchProvince("");
    setSearchRegioniSuggestion([]);
    setSearchProvinceSuggestion([]);

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
            dispatch({ type: "SET_NO_DATA" });
          } else {
            dispatch({ type: "SET_REGIONI", payload: filteredData });
          }  
        } else if (urlPathName[1] === "province") {
          if (urlPathName[2]) {
            filteredData = res.filter((datum: any) => normalizeSearchStr(datum.denominazione_provincia) === urlPathName[2]);
          }

          if (!filteredData.length) {
            dispatch({ type: "SET_NO_DATA" });
          } else {
            dispatch({ type: "SET_PROVINCE", payload: filteredData });
          }
        } else {
          dispatch({ type: "SET_ITALIA", payload: filteredData });
        }     
      })
      .catch((e) => {
        console.error(e);
        dispatch({ type: "HAS_ERRORED" });
      });
  }, [props.location.pathname, props.history]);

  useEffect(() => {
    if (document.cookie.includes(COOKIE)) {
      initializeGA();
    }
  }, []);

  const initializeGA = () => {
    const trackingId = "UA-167513829-1";
    ReactGA.initialize(trackingId);
  }

  const handleSearchRegion = (e: any) => {
    if (searchProvince.length > 0) {
      setSearchProvince("");
    }

    const matches:string[] = [];

    StaticRegioniProvinceNames.regioni.forEach((regione: string) => {
      if (e.target.value.length > 0 && regione.toLowerCase().startsWith(e.target.value.trim().toLowerCase())) {
        matches.push(regione);
      } 
    });

    setSearchRegioniSuggestion(matches);
    setSearchProvinceSuggestion([]);

    setSearchRegioni(e.target.value);
  }

  const handleSearchProvince = (e: any) => {
    if (searchRegioni.length > 0) {
      setSearchRegioni("");
    }

    const matches:string[] = [];

    StaticRegioniProvinceNames.provincie.forEach((provincia: string) => {
      if (e.target.value.length > 0 && provincia.toLowerCase().startsWith(e.target.value.trim().toLowerCase())) {
        matches.push(provincia);
      } 
    });

    setSearchProvinceSuggestion(matches);
    setSearchRegioniSuggestion([]);

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

  const handleDailySelect = (e: any) => dispatch({ type: "SET_SELECTED_DAILY", payload: e.target.value });

  const handlePositiveSelect = (e: any) => dispatch({ type: "SET_SELECTED_DATE_POSITIVE", payload: e.target.value });

  const toggleMobileNavbar = () => setMobileNavOpen(!isMobileNavOpen);

  //@ts-ignore
  const localisation: any = L.default[currentLanguage];

  return (
    <div className="app">
      <nav className="navbar navbar-dark navbar-expand-md bg-dark justify-content-between sitenav">
        <div className="container">
          <Link to="/" className="navbar-brand site-title-container">
            <img src={virusIcon} className="site-icon" alt="icona che rappresenta la forma del virus COVID-19" />
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
                <Link className="nav-link" to="/">Home</Link>
              </li>
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
            <Route exact path="/cookie-policy">
              <CookiePolicy
                cookie={COOKIE}
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
          urlPathName={urlPathName}
        />
      </div>
      <CookieConsent
        acceptOnScroll={true}
        acceptOnScrollPercentage={50}
        onAccept={() => {
          initializeGA();
        }}
        location="bottom"
        buttonText="ACCETTO"
        cookieName={COOKIE}
        style={{ background: "#2B373B" }}
        buttonStyle={{ backgroundColor: "#2B373B", color: "#fff", fontSize: "1em" }}
        expires={365}
      >
        <span style={{ fontSize: ".9em" }}>Questo sito utilizza cookie tecnici di terze parti, <Link to="/cookie-policy">clicca qui</Link> per saperne di più. Chiudendo questo banner o scorrendo questa pagina acconsenti all'uso dei cookie.</span>
      </CookieConsent>
    </div>
  );
}

export default App;
