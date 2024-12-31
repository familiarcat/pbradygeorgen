import{ReactNode}from'react';import{ViewStyle,StyleProp,LayoutChangeEvent,ViewProps,DimensionValue}from'react-native'
export interface BentoTheme{baseHue?:number;depth?:number;colorModifiers?:{saturation?:number;lightness?:number}}
export type BentoBaseProps=ViewProps&{children?:ReactNode;theme?:BentoTheme;testID?:string;onLayout?:(e:LayoutChangeEvent)=>void}
export interface BreakpointConfig{sm:number;md:number;lg:number;xl:number}
export type CustomDimension=DimensionValue|'100vh'
