import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "./site-settings";

const SiteSettingsContext = createContext<SiteSettings>(DEFAULT_SITE_SETTINGS);

export function SiteSettingsProvider({
  value,
  children,
}: {
  value: SiteSettings;
  children: ReactNode;
}) {
  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings(): SiteSettings {
  return useContext(SiteSettingsContext);
}
