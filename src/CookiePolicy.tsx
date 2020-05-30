import React from "react";

interface CookiesProps {
   cookie: string
}

const CookiePolicy = ({ cookie }: CookiesProps) => (
   <div className="content">
      <h3>Cookie Policy</h3>
      <div className="row">
         <div className="col-sm-12">
         <p>{
            `Questo sito utilizza un cookie di profilazione anonima di terze parti (Google Analytics con IP anonimizzato di Google Inc.), ed un cookie tecnico proprietario denominato "${cookie}".`
         }</p>
         <p>Google Analytics è un servizio di analisi web che utilizza i dati personali raccolti in forma anonimizzata allo scopo di tracciare ed esaminare l'utilizzo di questo sito, produrre report e condividerli con gli altri servizi di Google.
         </p>
         <a href="https://policies.google.com/technologies/partner-sites?hl=it" target="blank">Privacy Policy di Google Analytics</a><br />
         <a href="https://tools.google.com/dlpage/gaoptout?hl=it" target="blank">Disattiva Google Analytics sul tuo browser</a>
         
         <br />
         <br />
         </div>
      </div>
   </div>
);

export default CookiePolicy;