import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import { darkTheme, lightTheme } from "../theme/colors";

const ThemeContext = createContext(null);
const STORAGE_KEY = "app_theme_mode"; // "dark" | "light" | "system"

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState("dark");

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setMode(saved);
        } else {
          const sys = Appearance.getColorScheme();
          setMode(sys === "light" ? "light" : "dark");
        }
      } catch (e) {
        // تجاهل الخطأ والاعتماد على الوضع الافتراضي
      }
    })();
  }, []);

  const changeMode = async (newMode) => {
    setMode(newMode);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newMode);
    } catch (e) {}
  };

  const theme = mode === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode: changeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useAppTheme يجب أن يُستخدم داخل ThemeProvider");
  return ctx;
}
