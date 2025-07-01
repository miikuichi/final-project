import React, { useState, useEffect } from "react";
import "./SearchBar.css";

const SearchBar = ({
  placeholder = "Search...",
  data = [],
  onFilter,
  searchKeys = ["firstName", "lastName"],
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!searchQuery) {
      onFilter(data);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = data.filter((item) => {
        return searchKeys.some((key) => {
          const value = item[key];
          return value && value.toString().toLowerCase().includes(query);
        });
      });
      onFilter(filtered);
    }
  }, [searchQuery, data, searchKeys, onFilter]);

  return (
    <div className={`search-bar-container ${className}`}>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
