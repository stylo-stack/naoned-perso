import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n, {
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
  resolveLanguage,
} from "@/i18n";

const STORAGE_KEY = "@app-language";

type LanguageContextValue = {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
  isLoading: boolean;
};

const LanguageContext = createContext<LanguageContextValue>({
  language: "fr",
  setLanguage: async () => {},
  isLoading: true,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("fr");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(async (stored) => {
      if (
        stored &&
        (SUPPORTED_LANGUAGES as readonly string[]).includes(stored)
      ) {
        const lang = stored as SupportedLanguage;
        setLanguageState(lang);
        await i18n.changeLanguage(lang);
      } else {
        const deviceLocale = Localization.getLocales()[0]?.languageCode ?? "fr";
        const lang = resolveLanguage(deviceLocale);
        setLanguageState(lang);
        await i18n.changeLanguage(lang);
      }
      setIsLoading(false);
    });
  }, []);

  const setLanguage = useCallback(async (lang: SupportedLanguage) => {
    await AsyncStorage.setItem(STORAGE_KEY, lang);
    setLanguageState(lang);
    await i18n.changeLanguage(lang);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
