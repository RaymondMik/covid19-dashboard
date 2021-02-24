import React, { useState, useEffect, useReducer } from "react";
import {
  Switch,
  Route,
  Link,
  RouteComponentProps
} from "react-router-dom";
import Dashboard from "./dashboard";
import Regioni from "./routes/Regioni";
import Province from "./routes/Province";
import SourceLink from "./SourceLink";
import './App.css';
import { normalizeSearchStr } from "./utils";
import * as L from "./localisation.json";
import * as StaticRegioniProvinceNames from "./static.json";
import virusIcon from "./icons/virusIcon.svg";
import { InitialState, FormattedVaccini } from "./types";

const initialState: InitialState = { 
  data: [],
  totaleDosiVaccino: null,
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
    case "FETCH_DATA":
      return {
        ...state,
        isLoading: true
      }
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
    case "SET_TOTALE_VACCINI":
      return {
        ...state,
        totaleDosiVaccino: action.payload
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
    totaleDosiVaccino,
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
  const API_URL = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita";
  const VACCINI_API_URL = "https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/somministrazioni-vaccini-summary-latest.json";

  useEffect(() => {
    let fetchData: string = "";

    setSearchRegioni("");
    setSearchProvince("");
    setSearchRegioniSuggestion([]);
    setSearchProvinceSuggestion([]);

    const urlPathName = props.location.pathname.split("/");

    if (urlPathName[1] === "regioni" || urlPathName[1] === "province") {
      fetchData = urlPathName[1];
    } else {
      fetchData = "andamento-nazionale";
    }

    dispatch({ type: "FETCH_DATA" });

    // fetch vaccini data
    fetch(VACCINI_API_URL)
      .then(response => {
        if (!response.ok) {
          dispatch({ type: "HAS_ERRORED" });
        }

        return response.json();
      })
      .then((res) => {
          const formattedVaccini: FormattedVaccini = {};

          const totaleDosiVaccino = res.data
            .map((item: any) => {
              // here we also extract the data to be added to the formattedVaccini object
              const date: string = item.data_somministrazione.split("T")[0];
              if (!formattedVaccini[date]) {
                formattedVaccini[date] = item.totale;
              } else {
                formattedVaccini[date] = formattedVaccini[date] + item.totale;
              }

              return item;
            })
            .reduce((accumulator: number, currentValue: any) => accumulator + currentValue.totale, 0);

          dispatch({ type: "SET_TOTALE_VACCINI", payload: totaleDosiVaccino });

          // fetch epidemic data
          fetch(`${API_URL}-${fetchData}.json`)
            .then(response => {
              if (!response.ok) {
                dispatch({ type: "HAS_ERRORED" });
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
                // add vaccini to national data only
                const filteredDataWithVaccini = filteredData.map((item: any) => {
                  const searchIndex = item.data.split("T")[0]
                  if (formattedVaccini[searchIndex]) {
                    item.totale_dosi_vaccino = formattedVaccini[searchIndex];
                  }

                  return item;
                });
                dispatch({ type: "SET_ITALIA", payload: filteredDataWithVaccini });
              }     
            })
            .catch((e) => {
              console.error(e);
              dispatch({ type: "HAS_ERRORED" });
      });
    });
  }, [props.location.pathname, props.history]);

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
      if (suggestion.length > 0) {
        props.history.push(`/province/${normalizeSearchStr(suggestion)}`);
      }
    } else {
      setSearchRegioni(suggestion);
      setSearchRegioniSuggestion([]);
      if (suggestion.length > 0) {
        props.history.push(`/regioni/${normalizeSearchStr(suggestion)}`);
      }
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
        {!isLoading && hasErrored && (<h2>C'è stato un errore, ricarica la pagina per cortesia.</h2>)}
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
                totaleDosiVaccino={totaleDosiVaccino}
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
          urlPathName={props.location.pathname.split("/")}
        />
      </div>
    </div>
  );
}

export default App;
