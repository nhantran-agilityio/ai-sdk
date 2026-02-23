import {
  streamText,
  UIMessage,
  convertToModelMessages,
  stepCountIs,
  createUIMessageStream,
  createUIMessageStreamResponse,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { getWeather } from "@/lib/ai/tools/get-weather";
import { createOpenAI } from "@ai-sdk/openai";

export async function POST(req: Request) {
  try {
    const { messages, apiKey }: { messages: UIMessage[], apiKey: string } = await req.json();
    const openai = createOpenAI({
      apiKey,
    });
  
    const stream = createUIMessageStream({
      execute: async ({ writer: dataStream }) => {
        const result = streamText({
          model: openai("gpt-4o-mini"),
          // Agent Instruction (system message)
          system: `
            You are a weather-only assistant.

            Rules:
            - You only answer weather-related questions.
            - If the question is not about weather, politely refuse.
            - For weather data, always use getWeather tool.
            - Never fabricate weather information.
            `,
          messages: await convertToModelMessages(messages),
          stopWhen: stepCountIs(5),
          tools: {
            getWeather,
          },
          toolChoice: "auto",
          temperature: 0.2,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 8192,
        });
        dataStream.merge(result.toUIMessageStream());
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
