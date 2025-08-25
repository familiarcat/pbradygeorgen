'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LcarsColors {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
}

interface LcarsThemeContextType {
    colors: LcarsColors;
    toggleTheme: () => void;
    isDark: boolean;
}

const defaultColors: LcarsColors = {
    primary: '#FF6B35',
    secondary: '#0047AB',
    accent: '#FFD700',
    background: '#000000',
    text: '#FFFFFF'
};

const LcarsThemeContext = createContext<LcarsThemeContextType | undefined>(undefined);

export function LcarsThemeProvider({ children }: { children: ReactNode }) {
    const [isDark, setIsDark] = useState(true);

    const colors = isDark ? defaultColors : {
        ...defaultColors,
        background: '#FFFFFF',
        text: '#000000'
    };

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    return (
        <LcarsThemeContext.Provider value={{ colors, toggleTheme, isDark }}>
            {children}
        </LcarsThemeContext.Provider>
    );
}

export function useLcarsTheme(): LcarsThemeContextType {
    const context = useContext(LcarsThemeContext);
    if (context === undefined) {
        throw new Error('useLcarsTheme must be used within a LcarsThemeProvider');
    }
    return context;
}
