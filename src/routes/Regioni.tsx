import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Evolution from "../dashboard/Evolution";
import { Data } from "../types";

interface RegioniProps {
   COLORS: string[];
   data: Data[];
   localisation: any;
}

const Regioni = ({
   COLORS,
   data,
   localisation
}: RegioniProps) => {
   const [regioniData, setRegioniData] = useState<any>({});
   const [filteredRegioniData, setFilteredRegioniData] = useState<any>({});
   const [regioniNames, setRegioniNames] = useState<any>([]);

   useEffect(() => {
      aggregateRegioniData(data);
   }, [data])

   const aggregateRegioniData = (data: any) => {
      const regioniAggregated: any = {};

      data.forEach((datum: any, i: number) => {
         if (!datum.denominazione_regione || datum.denominazione_regione === "In fase di definizione/aggiornamento") {
            return;
         } else if (!regioniAggregated[datum.denominazione_regione]) {
            regioniAggregated[datum.denominazione_regione] = [ datum ];
            setRegioniNames((prevRegioniNames: string[]) => [...prevRegioniNames, datum.denominazione_regione]);
         } else {
            regioniAggregated[datum.denominazione_regione].push(datum);
         }
      });

      setRegioniData(regioniAggregated);
   }

   const filterRegioni = (e: any) => {
      let filteredRegions: any = {};

      regioniNames.forEach((regionName: string) => {
         if (regionName.toLowerCase().startsWith(e.target.value.trim().toLowerCase())) {
            filteredRegions[regionName] = regioniData[regionName];
         }
      });
      
      if (Object.keys(filteredRegions).length) {
         setFilteredRegioniData(filteredRegions);
      } 
   }
   
   const renderData = Object.keys(filteredRegioniData).length ? filteredRegioniData : regioniData;

   return (
      <div className="content">
         <h3>REGIONI</h3>
         <div className="row">
            <div className="col-sm-12 col-md-4">
               <input 
                  type="text" 
                  name="" 
                  className="form-control filter-regioni" 
                  placeholder="Cerca regione"
                  onChange={filterRegioni}
               />
            </div>
         </div>
         <div className="row">
            {Object.keys(renderData).length > 0 ? (
               Object.keys(renderData)
                  .sort((a: string, b: string) => (regioniData[b][regioniData[b].length - 1].totale_casi - regioniData[a][regioniData[a].length - 1].totale_casi))
                  .map((regione: string, i: number) => (
                     <div className="col-sm-12 col-md-6 col-lg-4 details-panel-wrapper" key={i}>
                        <div className="details-panel">
                           <Link to={`/regioni/${regione.toLowerCase().split(" ").join("")}`}> 
                              <div className="details-title">
                                 <h4>{regione}</h4>
                              </div>
                           </Link>
                           <div className="details-value">
                              <small>Totale casi: </small>
                              <p>{regioniData[regione][regioniData[regione].length - 1].totale_casi}</p>
                              <Evolution
                                 data={regioniData[regione]}
                                 COLORS={COLORS}
                                 localisation={localisation}
                                 cssClass="situation-evolution-sm"
                              />
                           </div>
                        </div>
                     </div>
            ))) : (
               <div className="loading"></div>
            )}
         </div>
      </div>
   );
};

export default Regioni;