import React  from "react";
import { Link } from "react-router-dom";

interface SourceLinkProps {
   localisation: any;
   urlPathName: string;
}

const SourceLink = ({ localisation, urlPathName }: SourceLinkProps) => (
   <>
      <p className="source-link">
         {localisation.disclaimer[0]}  
         <a
            href="https://github.com/pcm-dpc/COVID-19"
            target="_blank"
            rel="noopener noreferrer"
         >
            {localisation.disclaimer[1]}  
         </a>
         {localisation.disclaimer[2]}
      </p>
      {urlPathName[1] !== "cookie-policy" && <span className="footer-info"><Link to="/cookie-policy">Cookie Policy</Link></span >}
      
      {/* <span className="footer-info"><a href="https://twitter.com/RMiklus" target="blank"> - Built by</a></span > */}
   </>
);

export default SourceLink;