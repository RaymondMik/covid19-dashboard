import React  from "react";
import { parseDate } from "./utils";

interface HeaderProps {
   data: any
   localisation: any
}

const Header = ({
   data,
   localisation
}: HeaderProps) => (
   <header className="panel">
      <div className="header-title">
         <div className="title-place">
            <h3>Italia</h3>
            <p>{localisation.header} {parseDate(data[data.length -1].data)}</p>
         </div>
         <div className="title-details">
            <p>Casi totali: {data[data.length -1].totale_casi}</p>
            <p>Tamponi totali: {data[data.length -1].tamponi}</p>
         </div>
      </div>
      <div className="search-container">
         <label className="label-regione">Vedi dati per regione
            <input type="text" name="search-regione" className="form-control search-regione" placeholder="Inserisci nome regione" />
         </label>
         <label className="label-provincia">Vedi dati per provincia
            <input type="text" name="search-provincia" className="form-control search-provincia" placeholder="Inserisci nome provincia" />
         </label>
         <button type="button" className="btn btn-success search-button">Cerca</button>
      </div>
   </header>
);

export default Header;
