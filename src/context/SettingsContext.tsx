"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { client, urlFor } from "@/sanity/client";
import { siteConfig } from "@/config/site.config";

interface StoreSettings {
  storeName?: string;
  logo?: any;
  whatsappLink?: string;
  phone?: string;
  email?: string;
  address?: string;
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  linkedin?: string;
  heroTitle?: string;
  heroSubtitle?: string;
}

interface SettingsContextType {
  storeName: string;
  logoUrl: string;
  whatsappLink: string;
  phone: string;
  email: string;
  address: string;
  instagram: string;
  tiktok: string;
  facebook: string;
  linkedin: string;
  heroTitle: string;
  heroSubtitle: string;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  storeName: siteConfig.brand.name,
  logoUrl: siteConfig.brand.logo,
  whatsappLink: siteConfig.hero.whatsappLink,
  phone: siteConfig.contact.phone || "+58 412-0000000",
  email: siteConfig.contact.email,
  address: "Av. Principal, Caracas, Venezuela",
  instagram: "",
  tiktok: "",
  facebook: "",
  linkedin: "",
  heroTitle: siteConfig.hero.title,
  heroSubtitle: siteConfig.hero.subtitle,
  isLoading: true,
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await client.fetch(`*[_type == "settings"][0]`);
        setSettings(data);
      } catch (e) {
        console.error("Error fetching store settings:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const logoUrl = settings?.logo ? urlFor(settings.logo).url() : siteConfig.brand.logo;
  const storeName = settings?.storeName || siteConfig.brand.name;
  const whatsappLink = settings?.whatsappLink || siteConfig.hero.whatsappLink;
  const phone = settings?.phone || "+58 412-0000000";
  const email = settings?.email || siteConfig.contact.email;
  const address = settings?.address || "Atención Nacional 24/7";
  const instagram = settings?.instagram || "";
  const tiktok = settings?.tiktok || "";
  const facebook = settings?.facebook || "";
  const linkedin = settings?.linkedin || "";
  const heroTitle = settings?.heroTitle || siteConfig.hero.title;
  const heroSubtitle = settings?.heroSubtitle || siteConfig.hero.subtitle;

  return (
    <SettingsContext.Provider value={{ storeName, logoUrl, whatsappLink, phone, email, address, instagram, tiktok, facebook, linkedin, heroTitle, heroSubtitle, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);