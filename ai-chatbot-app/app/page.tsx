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
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          Loading...
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <div key={message.id} className="whitespace-pre-wrap">
              {message.role === "user" ? "User: " : "AI: "}
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case "text":
                    return <div key={`${message.id}-${i}`}>{part.text}</div>;
                  case "tool-weather":
                    return (
                      <pre key={`${message.id}-${i}`}>
                        {JSON.stringify(part, null, 2)}
                      </pre>
                    );
                }
              })}
            </div>
          ))}
        </>
      )}

      <form
        onSubmit={handleSendMessage}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4"
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
