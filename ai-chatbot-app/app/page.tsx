"use client";
import { useState } from "react";
import { useChat } from "@ai-sdk/react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/button";

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
      <h1>This is home page</h1>
    </div>
  );
}
