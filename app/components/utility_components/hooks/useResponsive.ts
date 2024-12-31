import{useWindowDimensions}from'react-native';import{BreakpointConfig}from'../types'
export const BREAKPOINTS:BreakpointConfig={sm:640,md:965,lg:1024,xl:1280}
export const useResponsive=()=>{const{width:w,height:h}=useWindowDimensions();return{isSm:w>=BREAKPOINTS.sm,isMd:w>=BREAKPOINTS.md,isLg:w>=BREAKPOINTS.lg,isXl:w>=BREAKPOINTS.xl,isPortrait:h>w,width:w,height:h}}
