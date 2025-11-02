// src/hooks/useMediaQuery.js
import { useState, useEffect } from 'react';

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = (event) => setMatches(event.matches);
    try {
        mediaQueryList.addEventListener('change', listener);
    } catch (e) {
        mediaQueryList.addListener(listener);
    }

    return () => {
        try {
            mediaQueryList.removeEventListener('change', listener);
        } catch (e) {
            mediaQueryList.removeListener(listener);
        }
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;