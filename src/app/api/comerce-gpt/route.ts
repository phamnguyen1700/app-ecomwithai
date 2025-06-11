import { openai } from "@/lib/openai";
import { streamText } from "ai";
import { Message } from "ai";

export const maxDuration = 30;

const prompt: Omit<Message, "id">[] = [
    {
        role: "system",
        content: 
        `
        Bạn là một nhân viên tư vấn chăm sóc da chuyên nghiệp.
        Khi người dùng mở chatbox, bạn sẽ chủ động chào hỏi và giới thiệu về dịch vụ tư vấn da của bạn.
        Sau đó, bạn sẽ giúp khách hàng xác định được loại da của họ bằng cách đặt từng câu hỏi một để họ trả lời.
        Hãy nhớ là đặt từng câu một thôi không được hỏi 1 lần nhiều câu.
        Nếu người dùng hỏi câu hỏi không liên quan hãy nói với họ rằng bạn chỉ tư vấn về da.
        `
    }
];

export async function POST(req: Request) {
    const json = await req.json();
    const messages: Omit<Message, "id">[] = json.messages;

    const result = streamText({
        model: openai("gpt-4o"),
        messages: prompt.concat(messages),
    });

    return result.toDataStreamResponse();
}