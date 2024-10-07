import React from "react";

const SuggestionList = ({
  suggestions = [],
  onSuggestionClick,
  highlightText,
  dataKey,
  selectedIndex,
}) => {
  const getHightLightedText = (text, highlightText) => {
    const parts = text.split(new RegExp(`(${highlightText})`, "gi"));

    return (
      <span>
        {parts.map((part, index) => {
          return (
            <b
              key={index}
              style={{
                color:
                  part.toLowerCase() === highlightText.toLowerCase()
                    ? "#1c7ed6"
                    : "black",
              }}
            >
              {part}
            </b>
          );
        })}
      </span>
    );
  };

  return (
    <>
      {suggestions.map((suggestion, index) => {
        let currentSuggestion = dataKey ? suggestion[dataKey] : suggestion;
        return (
          <li
            className="suggestion-item"
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            id={`suggestion-${index}`}
            role="option"
            aria-selected={selectedIndex === index}
          >
            {getHightLightedText(currentSuggestion, highlightText)}
          </li>
        );
      })}
    </>
  );
};

export default SuggestionList;
