"use client";
import { useState } from "react";
import { useOpenAIKey } from "@/app/providers/OpenAIKeyProvider";
import { Input } from "./input"
import { Button } from "./button"

export function ApiKeyModal() {
    const { apiKey, setApiKey } = useOpenAIKey();
    const [input, setInput] = useState("");

    if (apiKey) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70">
            <div className="bg-zinc-900 p-6 rounded-xl w-140 space-y-4 flex flex-col items-center justify-center">
                <h2 className="text-lg font-semibold">Enter OpenAI API Key</h2>

                <Input
                    type="password"
                    className="w-full p-2 rounded bg-zinc-800"
                    placeholder="openAPI key"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />

                <Button
                    className="w-1/2 bg-blue-600 py-2 rounded flex"
                    onClick={() => setApiKey(input)}
                >
                    Save
                </Button>
            </div>
        </div>
    );
}
