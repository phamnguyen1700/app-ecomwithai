import { openai } from "@/lib/openai";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
    const json = await req.json();
    const messages = json.messages;

    const result = streamText({
        model: openai("gpt-4o"),
        messages,
    });

    return result.toDataStreamResponse();
}