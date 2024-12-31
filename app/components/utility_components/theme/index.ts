import{BentoTheme}from'../types'
export const SPACING={xs:4,sm:8,md:12,lg:16,xl:24}
export const createTheme=(c:BentoTheme={})=>({baseHue:210,depth:0,colorModifiers:{saturation:1,lightness:1,...c.colorModifiers},...c})
export const calculateColor=({baseHue=210,depth=0,colorModifiers={}}:BentoTheme)=>{const{saturation=1,lightness=1}=colorModifiers;return`hsl(${baseHue},${Math.max(90-depth*15*saturation,20)}%,${Math.min(95-depth*5*lightness,95)}%)`}
