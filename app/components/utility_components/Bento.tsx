import React, { createContext, useContext } from "react"
import { View, StyleSheet, Platform, ViewStyle } from "react-native"
import { BentoBaseProps } from "./types"
import { createTheme, calculateColor, SPACING } from "./theme"
import { useResponsive } from "./hooks/useResponsive"
const ThemeContext = createContext(createTheme())
interface BentoContainerProps extends BentoBaseProps {
  direction?: "row" | "column" | "responsive"
  gap?: keyof typeof SPACING | number
  wrap?: boolean
  maxWidth?: number | string
  minHeight?: string | number
  adjustHeight?: boolean
  style?: ViewStyle
}
interface BentoItemProps extends BentoBaseProps {
  flex?: number
  minWidth?: number | string
  maxWidth?: number | string
  padding?: keyof typeof SPACING | number
  adjustHeight?: boolean
  style?: ViewStyle
}
export const BentoContainer: React.FC<BentoContainerProps> = ({
  children,
  style,
  theme,
  direction = "responsive",
  gap = "md",
  wrap = false,
  maxWidth,
  minHeight,
  adjustHeight = true,
  ...p
}) => {
  const { isMd } = useResponsive(),
    pT = useContext(ThemeContext),
    mT = {
      ...pT,
      ...theme,
      depth: (pT.depth || 0) + 1,
      colorModifiers: { ...pT.colorModifiers, ...theme?.colorModifiers },
    },
    fd = direction === "responsive" ? (isMd ? "row" : "column") : direction,
    gv = typeof gap === "string" ? SPACING[gap] : gap
  return (
    <ThemeContext.Provider value={mT}>
      <View
        style={[
          s.container,
          {
            flexDirection: fd,
            backgroundColor: calculateColor(mT),
            gap: gv,
            flexWrap: wrap ? "wrap" : "nowrap",
            maxWidth: typeof maxWidth === "string" ? parseInt(maxWidth) : maxWidth,
            minHeight,
            alignItems: fd === "row" ? "stretch" : undefined,
            justifyContent: "space-between",
            ...(Platform.OS === "web" ? { overflow: "hidden" } : {}),
          } as ViewStyle,
          style,
        ]}
        onLayout={(e) => adjustHeight && e.nativeEvent.layout.height === 0 && p.onLayout?.(e)}
        {...p}
      >
        {children}
      </View>
    </ThemeContext.Provider>
  )
}
export const BentoItem: React.FC<BentoItemProps> = ({
  children,
  style,
  flex,
  minWidth,
  maxWidth,
  padding = "md",
  adjustHeight = true,
  ...p
}) => {
  const t = useContext(ThemeContext),
    iT = { ...t, depth: (t.depth || 0) + 0.5 },
    pv = typeof padding === "string" ? SPACING[padding] : padding
  return (
    <View
      style={[
        s.item,
        {
          backgroundColor: calculateColor(iT),
          padding: pv,
          ...(flex !== undefined ? { flex } : {}),
          minWidth: typeof minWidth === "string" ? parseInt(minWidth) : minWidth,
          maxWidth: typeof maxWidth === "string" ? parseInt(maxWidth) : maxWidth,
          alignSelf: "stretch",
        } as ViewStyle,
        style,
      ]}
      onLayout={(e) => adjustHeight && e.nativeEvent.layout.height === 0 && p.onLayout?.(e)}
      {...p}
    >
      {children}
    </View>
  )
}
const s = StyleSheet.create({
  container: { borderRadius: 8, flex: 1, minHeight: 0 },
  item: { borderRadius: 6, flexShrink: 1 },
})
export const useBentoTheme = () => useContext(ThemeContext)
