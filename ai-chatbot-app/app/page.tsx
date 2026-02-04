"use client";
import { Fragment, useState } from "react";
import { useChat } from "@ai-sdk/react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/button";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/conversation";
import { Loading } from "@/components/loading";
import { Message, MessageContent } from "@/components/message";
import { ResponseMessages } from "@/components/response";
import { Textarea } from "@/components/textarea";

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
    <div className="max-w-4xl mx-auto p-6 relative size-full h-[calc(100vh-4rem)]">
      <div className="flex flex-col h-full">
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
                            <MessageContent>
                              <ResponseMessages>{part.text}</ResponseMessages>
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
                                  {JSON.stringify(part.output, null, 2)}
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

        <form
          onSubmit={handleSendMessage}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 mt-20"
        >
          <div className="flex items-end gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur px-4 py-3 shadow-lg">
            <div className="flex-1 flex items-center gap-3">
              <Textarea
                className={cn(
                  "w-full resize-none rounded-none border-none p-3 shadow-none outline-none ring-0",
                  "field-sizing-content bg-transparent dark:bg-transparent",
                  "max-h-48 min-h-16",
                  "focus-visible:ring-0",
                )}
                name="message"
                onChange={(e) => {
                  setInput(e.target.value);
                }}
                placeholder="Send a message..."
                disabled={isLoading}
                value={input}
              />
            </div>
            <Button
              type="submit"
              onClick={isLoading ? stop : undefined}
              disabled={isLoading || !input.trim()}
              name="send-button"
            >
              {isLoading ? "Stop" : "Send"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
