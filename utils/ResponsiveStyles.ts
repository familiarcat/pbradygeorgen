/**
 * ResponsiveStyles.ts
 *
 * A utility for applying responsive styles consistently across components
 * following the Salinger philosophy of simplified interfaces and predictive interactions.
 */

// Breakpoints following the Salinger philosophy
export const breakpoints = {
  mobile: 480,    // Mobile phones
  tablet: 768,    // Tablets
  laptop: 1024,   // Laptops
  desktop: 1280,  // Desktop screens
  wide: 1440      // Wide screens
};

// Spacing scale following the Salinger philosophy
export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  xxl: '3rem'      // 48px
};

// Font sizes following the Salinger philosophy
export const fontSizes = {
  xs: '0.75rem',   // 12px
  sm: '0.875rem',  // 14px
  md: '1rem',      // 16px
  lg: '1.25rem',   // 20px
  xl: '1.5rem',    // 24px
  xxl: '2rem'      // 32px
};

// Media query helpers
export const media = {
  mobile: `@media (max-width: ${breakpoints.mobile}px)`,
  tablet: `@media (min-width: ${breakpoints.mobile + 1}px) and (max-width: ${breakpoints.tablet}px)`,
  laptop: `@media (min-width: ${breakpoints.tablet + 1}px) and (max-width: ${breakpoints.laptop}px)`,
  desktop: `@media (min-width: ${breakpoints.laptop + 1}px) and (max-width: ${breakpoints.desktop}px)`,
  wide: `@media (min-width: ${breakpoints.desktop + 1}px)`,

  // Shorthand helpers
  belowTablet: `@media (max-width: ${breakpoints.tablet}px)`,
  belowLaptop: `@media (max-width: ${breakpoints.laptop}px)`,
  aboveTablet: `@media (min-width: ${breakpoints.tablet + 1}px)`,
  aboveMobile: `@media (min-width: ${breakpoints.mobile + 1}px)`,

  // Platform-specific media queries
  touch: `@media (hover: none) and (pointer: coarse)`,
  mouse: `@media (hover: hover) and (pointer: fine)`,

  // iOS-specific media query
  ios: `@supports (-webkit-touch-callout: none)`
};

// Helper for responsive font sizes
export const responsiveFontSize = (defaultSize: string, mobileSize?: string, tabletSize?: string) => {
  return {
    fontSize: defaultSize,
    [media.tablet]: tabletSize ? { fontSize: tabletSize } : {},
    [media.mobile]: mobileSize ? { fontSize: mobileSize } : {}
  };
};

// Helper for responsive spacing
export const responsiveSpacing = (property: string, defaultValue: string, mobileValue?: string, tabletValue?: string) => {
  const styles: Record<string, any> = {
    [property]: defaultValue
  };

  if (mobileValue) {
    styles[media.mobile] = { [property]: mobileValue };
  }

  if (tabletValue) {
    styles[media.tablet] = { [property]: tabletValue };
  }

  return styles;
};

// Helper for responsive layouts
export const responsiveLayout = {
  // Flex column on mobile, row on larger screens
  rowToColumn: {
    display: 'flex',
    flexDirection: 'row',
    [media.mobile]: {
      flexDirection: 'column'
    }
  },

  // Grid with responsive columns
  grid: (columns: { mobile: number, tablet: number, desktop: number }) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${columns.desktop}, 1fr)`,
    [media.tablet]: {
      gridTemplateColumns: `repeat(${columns.tablet}, 1fr)`
    },
    [media.mobile]: {
      gridTemplateColumns: `repeat(${columns.mobile}, 1fr)`
    }
  }),

  // Bento box layout (Salinger philosophy)
  bento: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.md,
    [media.mobile]: {
      gap: spacing.sm
    }
  },

  // Bento box item
  bentoItem: (width: { mobile: string, tablet: string, desktop: string }) => ({
    flex: `0 0 ${width.desktop}`,
    [media.tablet]: {
      flex: `0 0 ${width.tablet}`
    },
    [media.mobile]: {
      flex: `0 0 ${width.mobile}`
    }
  })
};

// Touch-friendly styles following Salinger philosophy and Hesse's mathematical approach
// Platform detection hook for client-side components
// Hook to handle viewport height for mobile browsers
export const useViewportHeight = () => {
  // This should only be used in client components
  if (typeof window === 'undefined') {
    return;
  }

  // Set CSS variable for viewport height
  const setViewportHeight = () => {
    // First we get the viewport height and multiply it by 1% to get a value for a vh unit
    const vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  // Set the height initially
  setViewportHeight();

  // Add event listener for resize and orientation change
  window.addEventListener('resize', setViewportHeight);
  window.addEventListener('orientationchange', setViewportHeight);

  // Clean up
  return () => {
    window.removeEventListener('resize', setViewportHeight);
    window.removeEventListener('orientationchange', setViewportHeight);
  };
};

// Platform detection hook for client-side components
export const usePlatformInfo = () => {
  // This should only be used in client components
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isIOS: false,
      isAndroid: false,
      hasTouchCapability: false
    };
  }

  // Detect mobile devices
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Detect iOS devices
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  // Detect Android devices
  const isAndroid = /Android/i.test(navigator.userAgent);

  // Detect touch capability
  const hasTouchCapability = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Detect screen size
  const screenWidth = window.innerWidth;
  const isMobile = screenWidth <= breakpoints.mobile;
  const isTablet = screenWidth > breakpoints.mobile && screenWidth <= breakpoints.tablet;
  const isDesktop = screenWidth > breakpoints.tablet;

  return {
    isMobile: isMobile || (isMobileDevice && !isTablet),
    isTablet,
    isDesktop: isDesktop && !isMobileDevice,
    isIOS,
    isAndroid,
    hasTouchCapability,
    screenWidth
  };
};

export const touchFriendly = {
  // Standard button with appropriate touch target size
  button: {
    minHeight: '44px',
    minWidth: '44px',
    padding: `${spacing.sm} ${spacing.md}`,
    [media.touch]: {
      padding: `${spacing.md} ${spacing.lg}`,
      // Add subtle feedback for touch devices
      transition: 'transform 0.1s ease, opacity 0.1s ease',
      '&:active': {
        transform: 'scale(0.98)',
        opacity: 0.9
      }
    }
  },

  // Input fields optimized for touch
  input: {
    height: '44px',
    padding: `${spacing.sm} ${spacing.md}`,
    [media.touch]: {
      fontSize: fontSizes.lg,
      // Increase tap target for better usability
      '&::placeholder': {
        fontSize: fontSizes.md
      }
    }
  },

  // Dropdown menus optimized for touch
  dropdown: {
    [media.touch]: {
      // Ensure dropdown items are easily tappable
      '& > *': {
        minHeight: '44px',
        padding: `${spacing.md} ${spacing.lg}`,
        display: 'flex',
        alignItems: 'center'
      }
    },
    // Position at bottom on mobile
    [media.mobile]: {
      position: 'fixed',
      bottom: '5%',
      left: '5%',
      right: '5%',
      width: '90%',
      maxHeight: '80vh',
      overflowY: 'auto',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    }
  },

  // Remove hover effects on touch devices
  noHoverOnTouch: {
    [media.touch]: {
      '&:hover': {
        // Reset any hover styles
        background: 'inherit',
        color: 'inherit',
        transform: 'none'
      }
    }
  },

  // Active state for touch devices (replaces hover)
  touchActiveState: {
    [media.touch]: {
      '&:active': {
        // Apply styles that would normally be on hover
        opacity: 0.8,
        transform: 'scale(0.98)'
      }
    }
  },

  // iOS-specific fixes
  iosFixes: {
    [media.ios]: {
      // Fix for iOS button styling
      '-webkit-appearance': 'none',
      '-webkit-tap-highlight-color': 'transparent',
      // Fix for iOS momentum scrolling
      '-webkit-overflow-scrolling': 'touch',
      // Fix for iOS text size adjustment
      '-webkit-text-size-adjust': '100%',
      // Fix for iOS input zoom
      fontSize: '16px' // Prevents zoom on input focus
    }
  },

  // Safe area insets for modern iOS devices
  safeAreaInsets: {
    [media.ios]: {
      paddingBottom: 'env(safe-area-inset-bottom)',
      paddingTop: 'env(safe-area-inset-top)',
      paddingLeft: 'env(safe-area-inset-left)',
      paddingRight: 'env(safe-area-inset-right)'
    }
  },

  // Prevent pull-to-refresh on mobile
  preventPullToRefresh: {
    [media.touch]: {
      overscrollBehavior: 'none',
      touchAction: 'pan-x pan-y'
    }
  }
};
