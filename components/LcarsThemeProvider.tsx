'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import '@/styles/classic.css'; // Ensure this is your LCARS theme stylesheet

interface LcarsThemeContextProps {
  colorScheme: 'primary' | 'secondary' | 'accent';
}

const LcarsThemeContext = createContext<LcarsThemeContextProps>({
  colorScheme: 'primary',
});

export const useLcarsTheme = () => useContext(LcarsThemeContext);

interface LcarsThemeProviderProps {
  children: ReactNode;
  colorScheme?: 'primary' | 'secondary' | 'accent';
}

const LcarsThemeProvider = ({
  children,
  colorScheme = 'primary',
}: LcarsThemeProviderProps) => {
  return (
    <LcarsThemeContext.Provider value={{ colorScheme }}>
      <div className={`lcars-theme lcars-${colorScheme}`}>
        {children}
      </div>
    </LcarsThemeContext.Provider>
  );
};

export default LcarsThemeProvider;