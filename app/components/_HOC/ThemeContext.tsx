import React, { createContext, useContext } from "react"
import { colors, spacing, typography } from "../../theme"

const ThemeContext = createContext({
  colors,
  spacing,
  typography,
})

export const useTheme = () => useContext(ThemeContext)
