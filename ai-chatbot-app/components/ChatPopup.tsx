"use client";

import { Fragment, useState } from "react";
import { useChat } from "@ai-sdk/react";

import { cn, parseChatError } from "@/lib/utils";
import {
    Conversation,
    ConversationContent,
    ConversationScrollButton,
} from "@/components/Conversation";
import { Loading } from "@/components/Loading";
import { Message, MessageContent } from "@/components/Message";
import { ResponseMessages } from "@/components/Response";
import { Textarea } from "@/components/TextArea";
import { Button } from "@/components/Button";
import { useOpenAIKey } from "@/app/providers/OpenAIKeyProvider";
import ChatIcon from "./icons/chat-icon";

export default function ChatbotPopup() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const { apiKey } = useOpenAIKey();
    const { messages, sendMessage, status, stop, error } = useChat();
    const isLoading = status === "submitted" || status === "streaming";

    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim()) return;
        // sendMessage({ text: input });
        sendMessage(
            { text: input },
            {
                body: { apiKey }
            })
        setInput("");
    };

    return (
        <>
            {/* Floating Button */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    disabled={!apiKey}
                    className="fixed bottom-6 right-6 z-50 rounded-full bg-black text-white shadow-xl hover:scale-110 transition"
                >

                    <ChatIcon />
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
                                {error && (
                                    <div className="text-red-500 text-sm">
                                        <p>
                                            {parseChatError(error)}
                                        </p>
                                    </div>
                                )}
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
                                type={isLoading ? "button" : "submit"}
                                onClick={isLoading ? stop : undefined}
                                disabled={!isLoading && !input.trim()}
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
