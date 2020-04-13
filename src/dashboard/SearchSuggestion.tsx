import React from "react";

interface SearchSuggestionProps {
   suggestionArray: string[];
   handleClickSuggestion: (search: string, type: string) => void;
   type: string;
}

const SearchSuggestion = ({ suggestionArray, handleClickSuggestion, type }: SearchSuggestionProps) => (
   <ul className="search-suggestion">
      {suggestionArray.map((search: string, index: number) => (
         <li key={index} onClick={() => { handleClickSuggestion(search, type) }}>
            {search}
         </li>
      ))}
   </ul>
);

export default SearchSuggestion;