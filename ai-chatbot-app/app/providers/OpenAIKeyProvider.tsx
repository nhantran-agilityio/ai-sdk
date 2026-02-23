// app/providers/OpenAIKeyProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

const OpenAIKeyContext = createContext<{
    apiKey: string | null;
    setApiKey: (key: string) => void;
}>({
    apiKey: null,
    setApiKey: () => { },
});

export function OpenAIKeyProvider({ children }: { children: React.ReactNode }) {
    const [apiKey, setApiKeyState] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("OPENAI_API_KEY");
        if (saved) setApiKeyState(saved);
    }, []);

    const setApiKey = (key: string) => {
        localStorage.setItem("OPENAI_API_KEY", key);
        setApiKeyState(key);
    };

    return (
        <OpenAIKeyContext.Provider value={{ apiKey, setApiKey }}>
            {children}
        </OpenAIKeyContext.Provider>
    );
}

export const useOpenAIKey = () => useContext(OpenAIKeyContext);
