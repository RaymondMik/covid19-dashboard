import React from "react";
import { Link } from "react-router-dom";
import Evolution from "./dashboard/Evolution";

interface RegioniProps {
   COLORS: string[]
   data: any
   localisation: any
}

const Regioni = ({
   COLORS,
   data,
   localisation
}: RegioniProps) => {
   console.log(888, data);
   const regioniAggregated: any = {};

   data.forEach((datum: any, i: number) => {
      if (!regioniAggregated[datum.denominazione_regione]) {
         regioniAggregated[datum.denominazione_regione] = [ datum ];
      } else {
         regioniAggregated[datum.denominazione_regione].push(datum);
      }
   });

   return (
      <div className="content">
         <h3>REGIONI</h3>
         <div className="row">
            {Object.keys(regioniAggregated).map((regione: string, i: number) => {
               console.log(999, regione);
               return (
               <div className="col-sm-12 col-md-6 col-lg-4 details-panel-wrapper" key={i}>
                  <div className="details-panel">
                     <Link to={`/regioni/${regione.toLowerCase().split(" ").join("")}`}> 
                        <div className="details-title">
                           <h4>{regione}</h4>
                        </div>
                     </Link>
                     <div className="details-value">
                        <small>Totale casi: </small>
                        <p>{regioniAggregated[regione][regioniAggregated[regione].length - 1].totale_casi}</p>
                        <Evolution
                           data={regioniAggregated[regione]}
                           COLORS={COLORS}
                           localisation={localisation}
                           cssClass="situation-evolution-sm"
                        />
                     </div>
                  </div>
               </div>
            )})}
         </div>
      </div>
   );
};

export default Regioni;