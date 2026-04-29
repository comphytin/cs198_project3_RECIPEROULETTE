import React, { useState, useEffect, createContext } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [textColor, setTextColor] = useState('white');
  const [navbarColor, setNavBarColor] = useState('#bd7a7a');
  const [backgroundColor, setBackgroundColor] = useState('#ba7bcc');
  const [recommendColor, setRecommendColor] = useState('#298dcc');
      
  useEffect(() => {
    document.body.style.backgroundColor = backgroundColor;
  }, [backgroundColor]);

  const toggleTheme = () => {
      setTextColor(textColor === 'white' ? 'black': 'white');
      setNavBarColor(navbarColor === '#bd7a7a' ? '#ADE7E1' : '#bd7a7a');
      setBackgroundColor(backgroundColor === "#ba7bcc" ? "#ADC0FF": '#ba7bcc');
      setRecommendColor(recommendColor === '#298dcc' ? '#95d5fc' : '#298dcc');
  }


  return <ThemeContext.Provider value={{textColor, navbarColor, backgroundColor, recommendColor, toggleTheme}}>{children}</ThemeContext.Provider>;
}