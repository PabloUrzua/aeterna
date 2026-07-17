"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface TenantConfig {
  name: string;
  logoType: "icon" | "text" | "custom";
  logoText: string;
  primaryColor: string; // hex
  primaryColorHover: string; // hex
  primaryFg: string; // hex (for text on primaryColor)
  btnMainColor: string; // hex
  btnSecColor: string; // hex
  bgColor: string; // hex
  bgDarkColor: string; // hex
  fgColor: string; // hex
  fgDarkColor: string; // hex
  fontFamily: "serif" | "sans";
  domain: string;
  colorMeaning: string; // color psychology description
}

const defaultTenant: TenantConfig = {
  name: "Aeterna",
  logoType: "icon",
  logoText: "Aeterna Legacy",
  primaryColor: "#1E3A8A",
  primaryColorHover: "#1D4ED8",
  primaryFg: "#FFFFFF",
  btnMainColor: "#2563EB",
  btnSecColor: "#14B8A6",
  bgColor: "#F8FAFC",
  bgDarkColor: "#0F172A",
  fgColor: "#1F2937",
  fgDarkColor: "#F8FAFC",
  fontFamily: "sans",
  domain: "memoriales.aeterna.app",
  colorMeaning: "Azul Profundo: Transmite confianza, esperanza y solidez tecnológica para preservar recuerdos."
};

interface BrandingContextType {
  config: TenantConfig;
  updateConfig: (newConfig: Partial<TenantConfig>) => void;
  resetConfig: () => void;
  activePreset: string;
  applyPreset: (presetName: "aeterna" | "lapaz" | "elysium" | "aurora") => void;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export const presets: Record<string, TenantConfig> = {
  aeterna: { ...defaultTenant },
  lapaz: {
    name: "Funeraria La Paz",
    logoType: "text",
    logoText: "La Paz Memorial",
    primaryColor: "#14B8A6", // Turquesa Vital (Vida y esperanza)
    primaryColorHover: "#0D9488",
    primaryFg: "#FFFFFF",
    btnMainColor: "#14B8A6",
    btnSecColor: "#3B82F6",
    bgColor: "#F0FDFA", // Seda de Turquesa
    bgDarkColor: "#0B2524", // Fondo verde-azul profundo
    fgColor: "#115E59",
    fgDarkColor: "#F0FDFA",
    fontFamily: "serif",
    domain: "memoriales.funerarialapaz.cl",
    colorMeaning: "Turquesa Vital: Simboliza la frescura de la vida, la calma de la memoria y la esperanza en las futuras generaciones."
  },
  elysium: {
    name: "Elysium Gardens",
    logoType: "custom",
    logoText: "Elysium Legacy",
    primaryColor: "#3B82F6", // Azul Claro/Cielo (Calma e infinito)
    primaryColorHover: "#2563EB",
    primaryFg: "#FFFFFF",
    btnMainColor: "#3B82F6",
    btnSecColor: "#1E3A8A",
    bgColor: "#EFF6FF", // Lino de Cielo
    bgDarkColor: "#0F1E36", // Crepúsculo Profundo
    fgColor: "#1E3A8A",
    fgDarkColor: "#EFF6FF",
    fontFamily: "sans",
    domain: "legado.elysiumgardens.com",
    colorMeaning: "Azul Cielo: Evoca la paz del firmamento, la serenidad y la amplitud ilimitada de los recuerdos familiares."
  },
  aurora: {
    name: "Memorial Aurora",
    logoType: "icon",
    logoText: "Aurora Recuerdo",
    primaryColor: "#6366F1", // Índigo Espiritual (Lazos familiares y sabiduría)
    primaryColorHover: "#4F46E5",
    primaryFg: "#FFFFFF",
    btnMainColor: "#6366F1",
    btnSecColor: "#14B8A6",
    bgColor: "#F5F3FF", // Lirio Perlado
    bgDarkColor: "#121026", // Amatista Oscura
    fgColor: "#312E81",
    fgDarkColor: "#F5F3FF",
    fontFamily: "serif",
    domain: "recuerdos.auroramemorial.mx",
    colorMeaning: "Índigo Espiritual: Refleja la profundidad de los lazos familiares, la sabiduría y la preservación digital del árbol genealógico."
  }
};

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<TenantConfig>(defaultTenant);
  const [activePreset, setActivePreset] = useState<string>("aeterna");

  // Load from localstorage on client mount
  // Version key: bump this when the default palette changes to clear stale configs
  const PALETTE_VERSION = "v2-2026-07-14";
  useEffect(() => {
    const savedVersion = localStorage.getItem("aeterna_palette_version");
    if (savedVersion !== PALETTE_VERSION) {
      // Clear stale config from previous palette versions
      localStorage.removeItem("aeterna_tenant_config");
      localStorage.setItem("aeterna_palette_version", PALETTE_VERSION);
      return;
    }
    const saved = localStorage.getItem("aeterna_tenant_config");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
          setConfig(parsed);
          const matching = Object.keys(presets).find(
            (key) => presets[key].domain === parsed.domain
          );
          setActivePreset(matching || "custom");
        }, 0);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const updateConfig = (newConfig: Partial<TenantConfig>) => {
    setConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      localStorage.setItem("aeterna_tenant_config", JSON.stringify(updated));
      return updated;
    });
    setActivePreset("custom");
  };

  const applyPreset = (presetName: "aeterna" | "lapaz" | "elysium" | "aurora") => {
    const preset = presets[presetName];
    if (preset) {
      setConfig(preset);
      setActivePreset(presetName);
      localStorage.setItem("aeterna_tenant_config", JSON.stringify(preset));
    }
  };

  const resetConfig = () => {
    setConfig(defaultTenant);
    setActivePreset("aeterna");
    localStorage.setItem("aeterna_tenant_config", JSON.stringify(defaultTenant));
  };

  // Convert hex to rgb string format "r, g, b"
  const hexToRgb = (hex: string): string => {
    const cleanHex = hex.replace("#", "");
    const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
    const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
    const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
    return `${r}, ${g}, ${b}`;
  };

  return (
    <BrandingContext.Provider
      value={{ config, updateConfig, resetConfig, activePreset, applyPreset }}
    >
      <div
        style={
          {
            "--tenant-primary": config.primaryColor,
            "--tenant-primary-hover": config.primaryColorHover,
            "--tenant-primary-fg": config.primaryFg,
            "--tenant-btn-main": config.btnMainColor,
            "--tenant-btn-sec": config.btnSecColor,
            "--tenant-primary-rgb": hexToRgb(config.primaryColor),
            "--tenant-bg": config.bgColor,
            "--tenant-bg-dark": config.bgDarkColor,
            "--tenant-bg-dark-rgb": hexToRgb(config.bgDarkColor),
            "--tenant-fg": config.fgColor,
            "--tenant-fg-dark": config.fgDarkColor,
            fontFamily: config.fontFamily === "serif" ? "var(--font-playfair), Georgia, serif" : "var(--font-geist-sans), sans-serif",
          } as React.CSSProperties
        }
        className="contents"
      >
        {children}
      </div>
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error("useBranding debe usarse dentro de un BrandingProvider");
  }
  return context;
}
