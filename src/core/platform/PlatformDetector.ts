/**
 * PlatformDetector.ts
 * 
 * A utility for detecting the user's platform, operating system, and browser.
 * This helps apply platform-specific optimizations while maintaining the Salinger philosophy
 * of simplified interfaces and predictive interactions across all devices.
 */

export type Platform = 'mobile' | 'tablet' | 'desktop';
export type OS = 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'other';
export type Browser = 'chrome' | 'safari' | 'firefox' | 'edge' | 'opera' | 'other';

export interface PlatformInfo {
  platform: Platform;
  os: OS;
  browser: Browser;
  isTouchDevice: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

/**
 * Detects the user's platform, operating system, and browser.
 * This function should be called client-side only.
 */
export const detectPlatform = (): PlatformInfo => {
  // Default to desktop if running on server
  if (typeof window === 'undefined') {
    return {
      platform: 'desktop',
      os: 'other',
      browser: 'other',
      isTouchDevice: false,
      isIOS: false,
      isAndroid: false,
      isMobile: false,
      isTablet: false,
      isDesktop: true
    };
  }

  const userAgent = window.navigator.userAgent;
  const platform = detectPlatformType(userAgent);
  const os = detectOS(userAgent);
  const browser = detectBrowser(userAgent);
  const isTouchDevice = detectTouchDevice();

  return {
    platform,
    os,
    browser,
    isTouchDevice,
    isIOS: os === 'ios',
    isAndroid: os === 'android',
    isMobile: platform === 'mobile',
    isTablet: platform === 'tablet',
    isDesktop: platform === 'desktop'
  };
};

/**
 * Detects if the device is a touch device.
 */
const detectTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - For older browsers
    navigator.msMaxTouchPoints > 0
  );
};

/**
 * Detects the platform type (mobile, tablet, desktop).
 */
const detectPlatformType = (userAgent: string): Platform => {
  // Tablet detection
  const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
    userAgent.toLowerCase()
  );

  if (isTablet) return 'tablet';

  // Mobile detection
  const isMobile = /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
    userAgent
  );

  if (isMobile) return 'mobile';

  // Default to desktop
  return 'desktop';
};

/**
 * Detects the operating system.
 */
const detectOS = (userAgent: string): OS => {
  const ua = userAgent.toLowerCase();

  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  if (/android/.test(ua)) return 'android';
  if (/windows/.test(ua)) return 'windows';
  if (/mac os/.test(ua)) return 'macos';
  if (/linux/.test(ua)) return 'linux';

  return 'other';
};

/**
 * Detects the browser.
 */
const detectBrowser = (userAgent: string): Browser => {
  const ua = userAgent.toLowerCase();

  if (/edge|edg/.test(ua)) return 'edge';
  if (/chrome/.test(ua) && !/chromium/.test(ua)) return 'chrome';
  if (/firefox/.test(ua)) return 'firefox';
  if (/safari/.test(ua) && !/chrome/.test(ua)) return 'safari';
  if (/opr\/|opera/.test(ua)) return 'opera';

  return 'other';
};

/**
 * A hook to use the platform detector in React components.
 * This should be used client-side only.
 */
export const usePlatformInfo = (): PlatformInfo => {
  if (typeof window === 'undefined') {
    // Default values for server-side rendering
    return {
      platform: 'desktop',
      os: 'other',
      browser: 'other',
      isTouchDevice: false,
      isIOS: false,
      isAndroid: false,
      isMobile: false,
      isTablet: false,
      isDesktop: true
    };
  }

  return detectPlatform();
};
