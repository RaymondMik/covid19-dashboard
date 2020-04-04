import React  from "react";

interface SourceLinkProps {
   localisation: any;
}

const SourceLink = ({ localisation }: SourceLinkProps) => (
   <p className="source-link">
      <p className="explain-increment">{localisation.increment}</p>
      {localisation.disclaimer[0]}  
      <a
         className="link"
         href="https://github.com/pcm-dpc/COVID-19"
         target="_blank"
         rel="noopener noreferrer"
      >
         {localisation.disclaimer[1]}  
      </a>
      {localisation.disclaimer[2]}<br />
   </p>
);

export default SourceLink;