import React from "react";
import { Link } from "react-router-dom";

interface ProvinceProps {
   data: any
   localisation: any
}

const Province = ({
   data,
   localisation
}: ProvinceProps) => {
   const provinceAggregated: any = {};

   data.forEach((datum: any, i: number) => {
      if (datum.denominazione_provincia === "In fase di definizione/aggiornamento") {
         return;
      } else if (!provinceAggregated[datum.denominazione_provincia]) {
         provinceAggregated[datum.denominazione_provincia] = [ datum ];
      } else {
         provinceAggregated[datum.denominazione_provincia].push(datum);
      }
   });

   console.log(333, provinceAggregated);
   return (
      <div className="content">
         <h3>PROVINCE</h3>
         <div className="row">
            {Object.keys(provinceAggregated).map((regione: string, i: number) => (
               <div className="col-sm-12 col-md-6 col-lg-4 details-panel-wrapper" key={i}>
                  <div className="details-panel">
                     <Link to={`/province/${regione.toLowerCase().split(" ").join("")}`}> 
                        <div className="details-title">
                           <h4>{regione}</h4>
                        </div>
                     </Link>
                     <div className="details-value">
                        <small>Totale casi: </small>
                        <p>{provinceAggregated[regione][provinceAggregated[regione].length - 1].totale_casi}</p>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

export default Province;