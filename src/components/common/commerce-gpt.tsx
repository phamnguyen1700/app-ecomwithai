"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/assests/icons";
import { useState, useEffect, useRef } from "react";
import { ChatInput } from "./chatInput";
import { DotTyping } from "./dotTyping";
import ProductCardInChat from "./productCardInChat";

type Message = { role: string; content: string };

export default function ChatBox() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [isBotTyping, setIsBotTyping] = useState(false);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            // Gửi một message rỗng để trigger backend trả về câu chào
            sendMessage("", []);
        }
    }, [isOpen, messages.length]);

    // Hàm gửi message
    async function sendMessage(userMessage: string, currentMessages: Message[]) {
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setInput("");
        setIsBotTyping(true);
        try {
            const res = await fetch("/api/comerce-gpt", {
                method: "POST",
                body: JSON.stringify({ messages: [...currentMessages, { role: "user", content: userMessage }] }),
                headers: { "Content-Type": "application/json" },
            });
            if (!res.body) throw new Error("No response body");
            const reader = res.body.getReader();
            let assistantBuffer = "";
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = new TextDecoder().decode(value);
                chunk.split("\n").forEach(line => {
                    // Tool result (a:)
                    if (line.startsWith("a:")) {
                        try {
                            const data = JSON.parse(line.slice(2));
                            // Nếu là object toolCall với result
                            if (data.result && data.result.role === "assistant" && data.result.content) {
                                assistantBuffer += data.result.content;
                            }
                        } catch {
                            // Nếu là từng ký tự thì nối lại (tuỳ backend)
                            const char = line.slice(2).replace(/^"|"$/g, "");
                            assistantBuffer += char;
                        }
                    }
                    // Giao tiếp thường (f: hoặc 0:)
                    else if (line.startsWith("f:")) {
                        try {
                            const data = JSON.parse(line.slice(2));
                            // Nếu là object có content thì lấy content, nếu là từng token thì nối lại
                            if (typeof data === "string") {
                                assistantBuffer += data;
                            } else if (data.role === "assistant" && data.content) {
                                assistantBuffer += data.content;
                            }
                        } catch {
                            // Nếu là từng token kiểu 0:"..." thì cũng nối lại
                            if (line.startsWith('0:')) {
                                const token = line.slice(2).replace(/^"|"$/g, "");
                                assistantBuffer += token;
                            }
                        }
                    }
                    // 3. Nếu là từng token kiểu 0:"..."
                    else if (line.startsWith('0:')) {
                        const token = line.slice(2).replace(/^"|"$/g, "");
                        assistantBuffer += token;
                    }
                });
            }
            // Sau khi stream xong, nếu có nội dung assistant thì append vào UI
            if (assistantBuffer.trim()) {
                console.log("Assistant buffer:", assistantBuffer);
                setMessages(prev => [
                    ...prev,
                    { role: "assistant", content: assistantBuffer }
                ]);
            }
        } catch {
            setMessages(prev => [
                ...prev,
                { role: "assistant", content: "Có lỗi xảy ra, vui lòng thử lại." }
            ]);
        }
        setIsBotTyping(false);
    }

    // Xử lý submit form
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (input.trim()) sendMessage(input.trim(), messages);
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {!isOpen && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-10 h-10 shadow-lg bg-[color:var(--tertiary)] hover:bg-[color:var(--primary)]"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Icon name="bot" className="w-6 h-6" color="white" />
                </Button>
            )}
            {isOpen && (
                <Card className="w-[350px] border shadow-md">
                    <CardContent className="p-2 flex flex-col gap-2">
                        <div className="relative">
                            {/* Avatar + Tên */}
                            <div className="flex items-center gap-2">
                                <Avatar>
                                    <AvatarImage src="/avatar.png" />
                                    <AvatarFallback
                                        className="bg-[color:var(--tertiary)]"
                                    >
                                        <Icon
                                            name="bot"
                                            className="w-4 h-4"
                                            color="white"
                                        />
                                    </AvatarFallback>
                                </Avatar>
                                <span className="font-semibold">Tư vấn viên</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                                className="absolute top-0 right-0"
                            >
                                <Icon name="minus" className="w-4 h-4" />
                            </Button>
                        </div>

                        <ScrollArea className="h-64 rounded-md border p-2 space-y-2">
                            {messages
                                .filter((msg) => msg.content.trim() !== "")
                                .map((msg, idx) => {
                                    if (msg.role === "assistant") {
                                        let parsed;
                                        try {
                                            parsed = JSON.parse(msg.content);
                                        } catch {}
                                        if (parsed && parsed.type === "product-list" && Array.isArray(parsed.products)) {
                                            return (
                                                <div
                                                    key={idx}
                                                    className="flex items-end gap-2 mb-2 justify-start"
                                                >
                                                    <Avatar className="w-4 h-4">
                                                        <AvatarImage src="/avatar.png" />
                                                        <AvatarFallback className="bg-[color:var(--tertiary)]">
                                                            <Icon name="bot" className="w-2 h-2" color="white" />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div
                                                        className="p-2 rounded-lg max-w-xs text-[12px] whitespace-pre-wrap bg-[color:var(--secondary)] text-black self-start max-w-[60%]"
                                                    >
                                                        <div className="mb-2">{parsed.message}</div>
                                                        <div className="flex flex-col gap-1">
                                                            {parsed.products.map((product: any) => (
                                                                <ProductCardInChat key={product._id} product={product} compact />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    }
                                    // Mặc định: render như cũ
                                    return (
                                        <div
                                            key={idx}
                                            className={`flex items-end gap-2 mb-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                        >
                                            {msg.role !== "user" && (
                                                <Avatar className="w-4 h-4">
                                                    <AvatarImage src="/avatar.png" />
                                                    <AvatarFallback
                                                        className="bg-[color:var(--tertiary)]"
                                                    >
                                                        <Icon name="bot" className="w-2 h-2" color="white" />
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div
                                                className={`p-2 rounded-lg max-w-xs text-[12px] whitespace-pre-wrap ${msg.role === "user"
                                                        ? "bg-[color:var(--primary)] text-white self-end ml-auto max-w-[60%]"
                                                        : "bg-[color:var(--secondary)] text-black self-start max-w-[60%]"
                                                    }`}
                                            >
                                                {msg.content}
                                            </div>
                                        </div>
                                    );
                                })}
                            {isBotTyping && (
                                <div className="flex items-end gap-2 mb-2 justify-start">
                                    <Avatar className="w-4 h-4">
                                        <AvatarImage src="/avatar.png" />
                                        <AvatarFallback className="bg-[color:var(--tertiary)]">
                                            <Icon name="bot" className="w-2 h-2" color="white" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div
                                        className="p-2 rounded-lg max-w-xs text-[12px] bg-[color:var(--secondary)] text-black self-start max-w-[60%] flex items-center"
                                        style={{ minWidth: 36 }}
                                    >
                                        <DotTyping />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </ScrollArea>

                        <form onSubmit={handleSubmit} className="relative">
                            <ChatInput
                                className="text-[12px]"
                                placeholder="Aa"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }
                                }}
                            />
                            <Button
                                variant="link"
                                size="icon"
                                className="absolute right-0 top-1/2 -translate-y-1/2 p-2"
                                tabIndex={-1}
                                type="submit"
                            >
                                <Icon name="send" className="w-4 h-4" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
