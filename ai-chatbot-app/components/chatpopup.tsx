"use client";

import { Fragment, useState } from "react";
import { useChat } from "@ai-sdk/react";

import { cn } from "@/lib/utils";
import {
    Conversation,
    ConversationContent,
    ConversationScrollButton,
} from "@/components/conversation";
import { Loading } from "@/components/loading";
import { Message, MessageContent } from "@/components/message";
import { ResponseMessages } from "@/components/response";
import { Textarea } from "@/components/textarea";
import { Button } from "@/components/button";

export default function ChatbotPopup() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");

    const { messages, sendMessage, status, stop } = useChat();

    const isLoading = status === "submitted" || status === "streaming";

    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim()) return;
        sendMessage({ text: input });
        setInput("");
    };

    return (
        <>
            {/* Floating Button */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-black text-white shadow-xl hover:scale-110 transition"
                >
                    💬
                </button>
            )}

            {/* Popup */}
            {open && (
                <div className="fixed bottom-6 right-6 z-50 w-[420px] h-[650px] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900">
                        <span className="text-sm font-semibold text-white">
                            AI Assistant
                        </span>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-zinc-400 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Chat Content */}
                    <div className="flex-1 relative overflow-hidden">
                        <Conversation className="h-full">
                            <ConversationContent>
                                {messages.map((message) => (
                                    <div key={message.id}>
                                        {message.parts.map((part, i) => {
                                            switch (part.type) {
                                                case "text":
                                                    return (
                                                        <Fragment key={`${message.id}-${i}`}>
                                                            <Message from={message.role}>
                                                                <MessageContent
                                                                    variant="flat"
                                                                    from={message.role}
                                                                >
                                                                    <ResponseMessages>
                                                                        {part.text}
                                                                    </ResponseMessages>
                                                                </MessageContent>
                                                            </Message>
                                                        </Fragment>
                                                    );

                                                case "tool-weather":
                                                    return (
                                                        <Fragment key={`${message.id}-${i}`}>
                                                            <Message from="assistant">
                                                                <MessageContent from="assistant">
                                                                    {part.state === "input-streaming" && (
                                                                        <div className="flex items-center gap-2 text-sm text-zinc-400 animate-pulse">
                                                                            <span>🌦️</span>
                                                                            <span>Fetching weather…</span>
                                                                        </div>
                                                                    )}

                                                                    {part.state === "output-available" && (
                                                                        <pre className="rounded-md bg-zinc-800 p-3 text-xs text-zinc-100 overflow-auto">
                                                                            {JSON.stringify(
                                                                                part.output,
                                                                                null,
                                                                                2
                                                                            )}
                                                                        </pre>
                                                                    )}
                                                                </MessageContent>
                                                            </Message>
                                                        </Fragment>
                                                    );

                                                default:
                                                    return null;
                                            }
                                        })}
                                    </div>
                                ))}
                                {isLoading && <Loading />}
                            </ConversationContent>
                            <ConversationScrollButton />
                        </Conversation>
                    </div>

                    {/* Input */}
                    <form
                        onSubmit={handleSendMessage}
                        className="border-t border-zinc-800 bg-zinc-900 p-4"
                    >
                        <div className="flex items-end gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur px-4 py-3 shadow-lg">
                            <div className="flex-1 flex items-center gap-3">
                                <Textarea
                                    className={cn(
                                        "w-full resize-none rounded-none border-none p-3 shadow-none outline-none ring-0",
                                        "field-sizing-content bg-transparent dark:bg-transparent",
                                        "max-h-48 min-h-16",
                                        "focus-visible:ring-0"
                                    )}
                                    name="message"
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Send a message..."
                                    disabled={isLoading}
                                    value={input}
                                />
                            </div>
                            <Button
                                type="submit"
                                onClick={isLoading ? stop : undefined}
                                disabled={isLoading || !input.trim()}
                            >
                                {isLoading ? "Stop" : "Send"}
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
