import React  from "react";

interface SourceLinkProps {
   localisation: any;
}

const SourceLink = ({ localisation }: SourceLinkProps) => (
   <p className="source-link">
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
      <small>built by <a href="https://twitter.com/RMiklus" target="blank">@RMiklus</a></small>
   </p>
);

export default SourceLink;