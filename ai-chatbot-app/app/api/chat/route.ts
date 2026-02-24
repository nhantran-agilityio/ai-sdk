import {
  streamText,
  UIMessage,
  convertToModelMessages,
  stepCountIs,
  createUIMessageStream,
  createUIMessageStreamResponse,
  LoadAPIKeyError
} from "ai";
import { getWeather } from "@/lib/ai/tools/get-weather";
import { createOpenAI } from "@ai-sdk/openai";
import { mapOpenAIErrorToCode, mapOpenAIErrorToMessage } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { messages, apiKey }: { messages: UIMessage[]; apiKey: string } =
      await req.json();

    const openai = createOpenAI({ apiKey });

    const stream = createUIMessageStream<UIMessage>({
      execute: async ({ writer }): Promise<void> => {
        const result = streamText({
          model: openai("gpt-4o-mini"),
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
          tools: { getWeather },
          toolChoice: "auto",
          temperature: 0.2,
          topP: 0.9,
          maxOutputTokens: 500,
          onError({ error }) {
            console.error("Stream error:", error);
          
            writer.write({
              type: "error",
              errorText: JSON.stringify({
                code: mapOpenAIErrorToCode(error),
                message: mapOpenAIErrorToMessage(error),
              }),
            });
          }
        });
    
        writer.merge(result.toUIMessageStream());
      },
    });
    
    return createUIMessageStreamResponse({ stream });

  } catch (error: unknown) {
    if (error instanceof LoadAPIKeyError) {
      return Response.json(
        {
          error: "AI service is not configured (missing API key)",
        },
        { status: 400 }
      );
    }

    console.error("Server error:", error);

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}