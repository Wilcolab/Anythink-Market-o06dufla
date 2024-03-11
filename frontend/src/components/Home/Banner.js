import React, { useState, useEffect} from "react";
import logo from "../../imgs/logo.png";

const SearchBox = ({ onSearchTextChange }) => {
  const [searchText, setSearchText] = useState('');
  useEffect(() => onSearchTextChange(searchText), [searchText]);

  return (
    <>
      <input type="text" id="search-box" value={searchText} onChange={e => setSearchText(e.target.value)} />
    </>
  )
}

const Banner = ({ onSearchTextChange }) => {
  return (
    <div className="banner text-white">
      <div className="container p-4 text-center">
        <img src={logo}/>
        <div>
          <span>A place to </span>
          <span id="get-part">get </span>
          <SearchBox onSearchTextChange={onSearchTextChange} />
          <span> the cool stuff.</span>
        </div>
      </div>
    </div>
  );
};

export default Banner;
