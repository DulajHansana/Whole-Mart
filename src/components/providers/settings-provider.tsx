
"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode, createElement } from 'react';
import * as LucideIcons from 'lucide-react';

// A subset of icons for the user to choose from.
export const availableIcons = {
  HardHat: LucideIcons.HardHat,
  Building2: LucideIcons.Building2,
  Factory: LucideIcons.Factory,
  Store: LucideIcons.Store,
  Briefcase: LucideIcons.Briefcase,
  ClipboardCheck: LucideIcons.ClipboardCheck,
} as const;

export type AvailableIconName = keyof typeof availableIcons;

interface Settings {
  appName: string;
  appLogo: AvailableIconName;
  hourlyRate: number;
}

interface SettingsContextType extends Settings {
  setAppName: (name: string) => void;
  setAppLogo: (logo: AvailableIconName) => void;
  setHourlyRate: (rate: number) => void;
  LogoComponent: React.ReactNode;
}

const defaultSettings: Settings = {
  appName: 'Whole Mart',
  appLogo: 'Store',
  hourlyRate: 200,
};

export const SettingsContext = createContext<SettingsContextType>({
  ...defaultSettings,
  setAppName: () => {},
  setAppLogo: () => {},
  setHourlyRate: () => {},
  LogoComponent: createElement(LucideIcons.Store),
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [appName, setAppNameState] = useState(defaultSettings.appName);
  const [appLogo, setAppLogoState] = useState<AvailableIconName>(defaultSettings.appLogo);
  const [hourlyRate, setHourlyRateState] = useState(defaultSettings.hourlyRate);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedAppName = localStorage.getItem('appName');
      const storedAppLogo = localStorage.getItem('appLogo') as AvailableIconName;
      const storedHourlyRate = localStorage.getItem('hourlyRate');
      if (storedAppName) {
        setAppNameState(storedAppName);
      }
      if (storedAppLogo && availableIcons[storedAppLogo]) {
        setAppLogoState(storedAppLogo);
      }
      if (storedHourlyRate) {
        setHourlyRateState(parseFloat(storedHourlyRate));
      }
    } catch (error) {
        console.error("Could not load settings from localStorage", error);
    }
  }, []);

  const setAppName = (name: string) => {
    setAppNameState(name);
    if(isMounted) localStorage.setItem('appName', name);
  };

  const setAppLogo = (logo: AvailableIconName) => {
    setAppLogoState(logo);
    if(isMounted) localStorage.setItem('appLogo', logo);
  };
  
  const setHourlyRate = (rate: number) => {
    setHourlyRateState(rate);
    if(isMounted) localStorage.setItem('hourlyRate', String(rate));
  };

  const LogoComponent = React.useMemo(() => {
    // Return default on server or before mount to avoid hydration mismatch
    if (!isMounted) {
      const DefaultIcon = availableIcons[defaultSettings.appLogo];
      return createElement(DefaultIcon);
    }
    const Icon = availableIcons[appLogo];
    return Icon ? createElement(Icon) : null;
  }, [appLogo, isMounted]);

  // Avoid hydration mismatch by returning default values until mounted
  const value = { 
    appName: isMounted ? appName : defaultSettings.appName, 
    appLogo, 
    hourlyRate: isMounted ? hourlyRate : defaultSettings.hourlyRate,
    setAppName, 
    setAppLogo, 
    setHourlyRate,
    LogoComponent 
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
