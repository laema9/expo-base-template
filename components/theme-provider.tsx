import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const systemColorScheme = useColorScheme(); // 'dark' | 'light' | null

  // Charger le thème depuis AsyncStorage au démarrage
  useEffect(() => {
    AsyncStorage.getItem(storageKey).then((stored) => {
      if (stored === "dark" || stored === "light" || stored === "system") {
        setThemeState(stored);
      }
    });
  }, [storageKey]);

  // Mettre à jour le thème
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    AsyncStorage.setItem(storageKey, newTheme).catch(console.error);
  };

  // Déterminer le thème effectif (system / light / dark)
  const effectiveTheme =
    theme === "system" ? systemColorScheme || "light" : theme;

  return (
    <ThemeProviderContext.Provider value={{ theme: effectiveTheme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
