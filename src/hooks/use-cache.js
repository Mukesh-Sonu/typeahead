import { useRef } from "react";

const getCurrentTimeStamp = () => Math.floor(Date.now() / 1000);

const useCache = (key, expirationDuration) => {
  const cacheRef = useRef(JSON.parse(localStorage.getItem(key)) || {});

  const setCache = (query, data) => {
    const timeStamp = getCurrentTimeStamp();
    cacheRef.current[query] = { data, timeStamp };
    localStorage.setItem(key, JSON.stringify(cacheRef.current));
  };

  const getCache = (query) => {
    const cachedData = cacheRef.current[query];

    if (cachedData) {
      const { data, timeStamp } = cachedData;

      if (getCurrentTimeStamp() - timeStamp < expirationDuration) {
        return data;
      } else {
        delete cacheRef.current[query];
        localStorage.setItem(key, JSON.stringify(cacheRef.current));
      }
    }

    return null;
  };

  return { setCache, getCache };
};

export default useCache;
