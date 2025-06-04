"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/assests/icons";
import { useState, useEffect, useRef } from "react";
import { useChat } from "ai/react";
import { ChatInput } from "./chatInput";

export default function ChatBox() {
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        status,
        append,
    } = useChat({
        api: "/api/comerce-gpt",
    });
    const [isOpen, setIsOpen] = useState(false);
    const [hasWelcomed, setHasWelcomed] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        if (isOpen && !hasWelcomed) {
            append({
                role: "user",
                content: ""
            });
            setHasWelcomed(true);
        }
    }, [isOpen, hasWelcomed, append]);

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
                                .map((msg, idx) => (
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
                                ))}
                            {status === 'streaming' && (
                                <div className="text-[10px] text-gray-400 animate-pulse ml-6">Đang nhập...</div>
                            )}
                            <div ref={messagesEndRef} />
                        </ScrollArea>

                        <form onSubmit={handleSubmit} className="relative">
                            <ChatInput
                                className="text-[12px]"
                                placeholder="Aa"
                                value={input}
                                onChange={handleInputChange}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit();
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
