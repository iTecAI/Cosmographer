import i18next, { i18n, TFunction } from "i18next";
import React, { createContext, useContext, useEffect, useState } from "react";
import * as langEn from "../resources/localization/en.json";

const LANGUAGES = {
    en: { translation: langEn },
};

const LocalizationContext = createContext<TFunction | null>(null);

export function LocalizationProvider(props: {
    language: keyof typeof LANGUAGES;
    children?: React.ReactNode | React.ReactNode[];
}) {
    const [translator, setTranslator] = useState<i18n | any>({});
    useEffect(() => {
        setTranslator(
            i18next.createInstance({
                lng: props.language,
                resources: LANGUAGES,
            })
        );
    }, [props.language]);

    return (
        <LocalizationContext.Provider value={(translator as i18n).t ?? null}>
            {props.children}
        </LocalizationContext.Provider>
    );
}
