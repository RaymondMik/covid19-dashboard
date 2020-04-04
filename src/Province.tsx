import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface ProvinceProps {
   data: any
   localisation: any
}

const Province = ({
   data,
   localisation
}: ProvinceProps) => {
   const [rawData, setRawData] = useState<any>([]);
   const [provinceData, setProvinceData] = useState<any>({});
  
   useEffect(() => {
      setRawData(data);
      aggregateProvinceData(data);
    
   }, [data])

   const aggregateProvinceData = (data: any) => {
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

      setProvinceData(provinceAggregated);
   }

   const filterProvince = (e: any) => {
      const filteredData = provinceData[e.target.value];

      if (filteredData) {
         setProvinceData({[e.target.value]: filteredData});
      } else if (Object.keys(provinceData).length === 1) {
         aggregateProvinceData(rawData);
      }
   }

   return (
      <div className="content">
         <h3>PROVINCE</h3>
         <div className="row">
            <div className="col-sm-12 col-md-4">
               <input 
                  type="text" 
                  name="" 
                  className="form-control filter-province" 
                  placeholder="Cerca provincia"
                  onChange={filterProvince}
               />
            </div>
         </div>
         <div className="row">
            {Object.keys(provinceData).map((provincia: string, i: number) => (
               <div className="col-sm-12 col-md-6 col-lg-4 details-panel-wrapper" key={i}>
                  <div className="details-panel">
                     <Link to={`/province/${provincia.toLowerCase().split(" ").join("")}`}> 
                        <div className="details-title">
                           <h4>{provincia}</h4>
                        </div>
                     </Link>
                     <div className="details-value">
                        <small>Totale casi: </small>
                        <p>{provinceData[provincia][provinceData[provincia].length - 1].totale_casi}</p>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

export default Province;