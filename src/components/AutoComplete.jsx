import React, { useEffect, useState, useRef } from "react";
import SuggestionList from "./SuggestionList";
import "./style.css";
import useCache from "../hooks/use-cache";

const AutoComplete = ({
  placeholder,
  fetchSuggesstions,
  staticData,
  onChange,
  onSelect,
  onFocus,
  onBlur,
  customLoading = "Loading",
  dataKey,
  customStyles,
  caching = true,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionsListRef = useRef(null);
  const { setCache, getCache } = useCache("autoComplete", 3600);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
  };

  const getSuggestions = async (query) => {
    setError(null);

    const cachedSuggestions = getCache(query);
    console.log(cachedSuggestions, "cachedSuggestions");
    if (caching && cachedSuggestions) {
      setSuggestions(cachedSuggestions);
    } else {
      setLoading(true);

      try {
        let result;

        if (staticData) {
          result = staticData.filter((item) =>
            item.toLowerCase().includes(query.toLowerCase())
          );
        } else if (fetchSuggesstions) {
          result = await fetchSuggesstions(query);
        }

        setCache(query, result);
        setSuggestions(result);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch suggesstions");
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }
  };

  const onSuggestionClick = (suggestion) => {
    setInputValue(dataKey ? suggestion[dataKey] : suggestion);
    onSelect(suggestion);
    setSuggestions([]);
  };

  const scrollIntoView = (index) => {
    if (suggestionsListRef.current) {
      const suggestionsListRefElements =
        suggestionsListRef.current.getElementsByTagName("li");

      if (suggestionsListRefElements[index]) {
        suggestionsListRefElements[index].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case "ArrowDown":
        setSelectedIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % suggestions.length;
          scrollIntoView(newIndex);
          return newIndex;
        });
        break;

      case "ArrowUp":
        setSelectedIndex((prevIndex) => {
          const newIndex =
            (prevIndex - 1 + suggestions.length) % suggestions.length;
          scrollIntoView(newIndex);
          return newIndex;
        });
        break;

      case "Enter":
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          onSuggestionClick(suggestions[selectedIndex]);
        }
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    // if (inputValue.length > 1) {
    //   getSuggestions(inputValue);
    // } else {
    //   setSuggestions([]);
    // }
    setSelectedIndex(-1);
    const handler = setTimeout(() => {
      if (inputValue.length > 1) {
        getSuggestions(inputValue);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  return (
    <>
      <h2>Auto complete / Typeahead</h2>
      <div className="container">
        <input
          value={inputValue}
          placeholder={placeholder}
          style={customStyles}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
          aria-autocomplete="list"
          aria-controls="suggestions-list"
          aria-activedescendant={`suggestion-${selectedIndex}`}
        />

        {(suggestions.length > 0 || loading || error) && (
          <ul
            ref={suggestionsListRef}
            className="suggestions-list"
            role="list-box"
          >
            {error && <div className="error">{error}</div>}
            {loading && <div className="loading">{customLoading}</div>}
            <SuggestionList
              suggestions={suggestions}
              onSuggestionClick={onSuggestionClick}
              highlightText={inputValue}
              dataKey={dataKey}
              selectedIndex={selectedIndex}
            />
          </ul>
        )}
      </div>
    </>
  );
};

export default AutoComplete;
