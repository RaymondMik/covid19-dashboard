import React  from "react";

interface SourceLinkProps {
   localisation: any;
   urlPathName: string[];
}

const SourceLink = ({ localisation, urlPathName }: SourceLinkProps) => (
   <>
      <p className="source-link">
         {localisation.disclaimer[0]}  
         <a
            href="https://github.com/pcm-dpc/COVID-19"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "underline" }}
         >
            {localisation.disclaimer[1]}  
         </a>
         {localisation.disclaimer[2]}
         <a
            href="https://github.com/italia/covid19-opendata-vaccini"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "underline" }}
         >
            {localisation.disclaimer[3]}  
         </a>
         <br />{localisation.disclaimer[4]}
      </p>
      
      {/* <span className="footer-info"><a href="https://twitter.com/RMiklus" target="blank"> - Built by</a></span > */}
   </>
);

export default SourceLink;