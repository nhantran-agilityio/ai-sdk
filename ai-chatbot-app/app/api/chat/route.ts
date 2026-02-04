import {
  streamText,
  UIMessage,
  convertToModelMessages,
  stepCountIs,
  createUIMessageStream,
  createUIMessageStreamResponse,
} from 'ai';
import { openai } from "@ai-sdk/openai";
import { getWeather } from '@/lib/ai/tools/get-weather';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const stream = createUIMessageStream({
    execute: async ({ writer: dataStream }) => {
      const result = streamText({
        model: openai('gpt-4o-mini'),
        messages: await convertToModelMessages(messages),
        stopWhen: stepCountIs(5),
        tools: {
          getWeather,
        },
      });

      dataStream.merge(result.toUIMessageStream());
    },
  });

  return createUIMessageStreamResponse({ stream });
}