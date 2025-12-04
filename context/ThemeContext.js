// context/ThemeContext.js
import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const colors = theme === "light"
    ? {
        background: "#ffffff",
        text: "#111111",
        subText: "#444444",
        card: "#f3f3f3",
        border: "#dcdcdc",
        buttonBackground: "#e6e6e6",
        buttonText: "#111111",
        pillBackground: "#2B6CB0",
        pillText: "#ffffff"
      }
    : {
        background: "#0d0d0d",
        text: "#f1f1f1",
        subText: "#bbbbbb",
        card: "#1a1a1a",
        border: "#333333",
        buttonBackground: "#222222",
        buttonText: "#ffffff",
        pillBackground: "#4A90E2",
        pillText: "#ffffff"
      };

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}