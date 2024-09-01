import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { StyleSheet, Dimensions } from "react-native"
import defaultTheme from "./defaultTheme"

interface ThemeContextType {
  theme: typeof defaultTheme
  dynamicStyles: ReturnType<typeof calculateDynamicStyles>
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export const useTheme = () => useContext(ThemeContext)

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState(defaultTheme)
  const [dynamicStyles, setDynamicStyles] = useState(
    calculateDynamicStyles(Dimensions.get("window").width),
  )

  useEffect(() => {
    const handleResize = () => {
      setDynamicStyles(calculateDynamicStyles(Dimensions.get("window").width))
    }

    Dimensions.addEventListener("change", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return <ThemeContext.Provider value={{ theme, dynamicStyles }}>{children}</ThemeContext.Provider>
}

function calculateDynamicStyles(screenWidth: number) {
  return StyleSheet.create({
    container: {
      flexDirection: screenWidth < 640 ? "column" : "row",
    },
    text: {
      fontSize: screenWidth < 600 ? 12 : screenWidth < 960 ? 14 : 16,
      lineHeight: screenWidth < 600 ? 18 : screenWidth < 960 ? 21 : 24,
    },
  })
}
