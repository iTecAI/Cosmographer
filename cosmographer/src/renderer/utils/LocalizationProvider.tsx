import i18next, { i18n, TFunction } from "i18next";
import React, { createContext, useContext, useEffect, useState } from "react";
import * as langEn from "../resources/localization/en.json";

const LANGUAGES = {
    en: { translation: langEn },
};

const LocalizationContext = createContext<typeof i18next.t | null>(null);

export function LocalizationProvider(props: {
    language: keyof typeof LANGUAGES;
    children?: React.ReactNode | React.ReactNode[];
}) {
    useEffect(() => {
        i18next.init({
            lng: props.language,
            resources: LANGUAGES,
        });
    }, []);

    useEffect(() => {
        if (i18next.isInitialized) {
            i18next.changeLanguage(props.language);
        }
    }, [props.language, i18next.isInitialized]);

    return (
        <LocalizationContext.Provider
            value={i18next.isInitialized ? i18next.t : null}
        >
            {props.children}
        </LocalizationContext.Provider>
    );
}

export function useTranslation(): typeof i18next.t {
    const tFunction = useContext(LocalizationContext);
    return tFunction ?? (((key: string, ...args: any[]) => key) as any);
}
