"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, stop } = useChat();
  const isLoading = status === "submitted" || status === "streaming";

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((message, index) => {
        const isAssistant = message.role === "assistant";
        const isLast = index === messages.length - 1;
        const isStreamingMessage =
          isAssistant && isLast && status === "streaming";
        const isUser = message.role === "user";
        return (
          <div
            key={message.id}
            className={`whitespace-pre-wrap mb-4 ${isUser ? "text-right" : "text-left"}`}
          >
            <strong>{isAssistant ? "AI:" : "User:"}</strong>

            {message.parts.map((part, i) => {
              if (part.type === "text") {
                return <div key={i}>{part.text}</div>;
              }

              if (part.type === "tool-weather") {
                if (part.state === "input-streaming") {
                  return (
                    <div
                      key={i}
                      className="mt-2 text-sm text-zinc-400 animate-pulse"
                    >
                      Fetching weather...
                    </div>
                  );
                }
                return (
                  <pre key={i} className="mt-2 rounded bg-zinc-800 p-2 text-xs">
                    {JSON.stringify(part.output, null, 2)}
                  </pre>
                );
              }

              return null;
            })}

            {isStreamingMessage && message.parts.length === 0 && (
              <div className="mt-2 text-sm text-zinc-400 animate-pulse">
                Loading...
              </div>
            )}
          </div>
        );
      })}

      <form
        onSubmit={handleSendMessage}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 mt-20"
      >
        <div className="flex items-end gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur px-4 py-3 shadow-lg">
          <div className="flex-1 flex items-center gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Send a message..."
              rows={4}
              disabled={isLoading}
              className="min-h-12 flex-1 resize-none bg-transparent text-zinc-100 placeholder:text-zinc-500 outline-none text-sm"
            />
          </div>
          <button
            type="submit"
            onClick={isLoading ? stop : undefined}
            disabled={isLoading || !input.trim()}
            className="max-h-100 rounded-md px-4 py-2 bg-blue-500 text-white border border-blue-500 transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600"
          >
            {isLoading ? "Stop" : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
