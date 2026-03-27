"use client";
import {createContext, useContext, useState, useEffect} from "react";

type Theme = "dark" | "light";

const ThemeContext = createContext<{
    theme: Theme,
    setTheme: (t: Theme) => void;
    toggleTheme: () => void;
}>({
    theme: "dark",
    setTheme: () => {},
    toggleTheme: () => {},
});

export const ThemeProvider = ({children} : {children : React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>("dark");

    useEffect(() => {
        const stored = localStorage.getItem("theme") as Theme | null;

        if (stored) {
            setTheme(stored);
        } 
        else {
            const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setTheme(systemPrefersDark ? "dark" : "light");
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <ThemeContext.Provider value={{theme, setTheme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext);