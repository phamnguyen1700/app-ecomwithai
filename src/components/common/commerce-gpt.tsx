"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/assests/icons";
import { useState } from "react";
import { useChat } from "ai/react";

export default function ChatBox() {
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
    } = useChat({
        api: "/api/comerce-gpt",
    });
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {!isOpen && (

                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-12 h-12 shadow-lg bg-blue-500 hover:bg-blue-600"
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
                                    <AvatarFallback>
                                        <Icon
                                            name="bot"
                                            className="w-4 h-4"
                                        />
                                    </AvatarFallback>
                                </Avatar>
                                <span className="font-semibold">Nhân viên ảo</span>
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
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`p-2 rounded-lg max-w-xs text-sm whitespace-pre-wrap ${msg.role === "user"
                                        ? "bg-black text-white self-end ml-auto text-xs m-2 w-fit"
                                        : "bg-gray-200 text-black self-start text-xs w-fit"
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="text-xs text-gray-400 animate-pulse">Đang nhập...</div>
                            )}
                        </ScrollArea>

                        <form onSubmit={handleSubmit} className="relative mt-2">
                            <Input
                                placeholder="Aa"
                                className="pr-10"
                                value={input}
                                onChange={handleInputChange}
                            />
                            <Button
                                variant="ghost"
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
