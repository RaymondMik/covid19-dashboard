import React from "react";

import Tiles from "./Tiles";
import Evolution from "./Evolution";
import Daily from "./Daily";
import PositiveCases from "./PositiveCases";
import SearchSuggestion from "./SearchSuggestion";
import { Data } from "../types";

import { parseDate } from "../utils";

interface DashboardProps {
   COLORS: string[];
   data: Data[];
   totaleDosiVaccino: number;
   dataSetTitle: string,
   handleDailySelect: (e: any) => void;
   hideForProvince: boolean,
   handleClickSearch: (e: any) => void;
   handleSearchRegion: (e: any) => void;
   handleSearchProvince: (e: any) => void;
   hasErrored: boolean,
   isLoading: boolean,
   localisation: any;
   noData: boolean,
   searchRegioni: string,
   searchProvince: string,
   selectedDateDaily: string;
   selectedDatePositive: string;
   searchProvinceSuggestion: string[];
   searchRegioniSuggestion: string[];
   handleClickSuggestion: (search: string, type: string) => void;
   handlePositiveSelect: (e: any) => void;
}

const Dashboard = ({
   COLORS,
   data,
   totaleDosiVaccino,
   dataSetTitle,
   hideForProvince,
   handleClickSearch,
   handleSearchRegion,
   handleSearchProvince,
   hasErrored,
   isLoading,
   localisation,
   noData,
   searchRegioni,
   searchProvince,
   selectedDateDaily,
   selectedDatePositive,
   handleDailySelect,
   handlePositiveSelect,
   searchProvinceSuggestion,
   searchRegioniSuggestion,
   handleClickSuggestion,
}: DashboardProps) => (
   <>
      <div className="row">
         <div className="col-sm-12">
            <div className="search-container">
               <form className="row" onSubmit={handleClickSearch} autoComplete="off">
                  <div className="col-sm-12 col-md-4">
                     <label 
                        className={`search-label  ${searchProvince ? "disabled" : ""}`}
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
                     {searchRegioniSuggestion.length > 0 && (
                        <SearchSuggestion
                           suggestionArray={searchRegioniSuggestion}
                           handleClickSuggestion={handleClickSuggestion}
                           type="regioni"
                        />
                     )}
                  </div>
                  <div className="col-sm-12 col-md-4">
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
                     {searchProvinceSuggestion.length > 0 && (
                        <SearchSuggestion
                           suggestionArray={searchProvinceSuggestion}
                           handleClickSuggestion={handleClickSuggestion}
                           type="province"
                        />
                     )}
                  </div>
                  <div className="col-sm-12 col-md-4">
                     <button 
                        type="submit"
                        className="btn btn-success search-button"
                     >
                        {`Cerca ${searchRegioni ? "per regione" : searchProvince ? "per provincia" : ""}`}
                     </button>
                  </div>
               </form>
                     {!isLoading && !hasErrored && noData && (
                        <span>Dati non trovati!</span>
                     )}
            </div>
            <header className="panel">
               <div className="row">
                  <div className="col-xs-12 col-md-6">
                     <div className="header-title">
                        <div className="title-place">
                           <h3>{dataSetTitle}</h3>
                           {dataSetTitle === "Italia" && <p>Popolazione residente: 60 milioni 317mila (fonte: <a href="https://www.istat.it/it/archivio/238447" target="blank">ISTAT</a>)</p>}
                           <p>{localisation.header} {parseDate(data[data.length - 1].data)}</p>
                        </div>
                     </div>
                  </div>
                  <div className="col-xs-12 col-md-6">
                     <div className="title-details">
                        <p>Casi totali: {data[data.length - 1].totale_casi.toLocaleString("it")}</p>
                        {!hideForProvince ? (
                           <p>Tamponi totali: {data[data.length - 1].tamponi.toLocaleString("it")}</p>
                        ) : (
                           <small>Per le province sono disponibili solo i casi totali</small>
                        )}
                     </div>
                  </div>
               </div>
               
            </header>
         </div>
      </div>
      <div className="row">
         {!hideForProvince && (
            <Tiles 
               data={data}
               totaleDosiVaccino={totaleDosiVaccino}
               localisation={localisation}
            />
         )}
      </div>
      <div className="row">
         <div className="col-lg-12">
            <Evolution
               data={data}
               COLORS={COLORS}
               localisation={localisation}
               hideForProvince={hideForProvince}
               cssClass="situation-evolution-lg"
            />
         </div>
      </div>
      <>
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
      </>
   </>
);

export default Dashboard;