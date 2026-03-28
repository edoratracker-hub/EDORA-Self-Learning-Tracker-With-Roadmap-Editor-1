"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MessageSquare, Minus, Send, Loader2, ShieldAlert } from "lucide-react";

const TRACKER_BASE = "http://localhost:3000";
const POLL_INTERVAL = 3000; // 3 seconds

interface ChatMessage {
    id: string;
    sender: string;
    senderImage: string | null;
    text: string;
    timestamp: string;
    isOwn: boolean;
}

interface EdoraEditorChatProps {
    classroomId: string;
    userId: string;
}

export const EdoraEditorChat = ({ classroomId, userId }: EdoraEditorChatProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isMember, setIsMember] = useState<boolean | null>(null); // null = loading
    const scrollRef = useRef<HTMLDivElement>(null);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Scroll to bottom whenever messages change
    const scrollToBottom = useCallback(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, []);

    // Fetch messages
    const fetchMessages = useCallback(async () => {
        try {
            const res = await fetch(
                `${TRACKER_BASE}/api/classroom/external/${classroomId}/chat?userId=${userId}`
            );
            const data = await res.json();
            if (data.success) {
                setMessages(data.messages);
                setIsMember(true);
            } else if (res.status === 403) {
                setIsMember(false);
            }
        } catch {
            // Silently fail on poll errors
        }
    }, [classroomId, userId]);

    // Initial load + start polling when chat is open
    useEffect(() => {
        if (!isOpen) {
            if (pollRef.current) clearInterval(pollRef.current);
            return;
        }

        setLoading(true);
        fetchMessages().finally(() => setLoading(false));

        // Poll for new messages
        pollRef.current = setInterval(fetchMessages, POLL_INTERVAL);

        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [isOpen, fetchMessages]);

    // Scroll to bottom when messages update
    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Send a message
    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || sending) return;

        setSending(true);
        try {
            const res = await fetch(
                `${TRACKER_BASE}/api/classroom/external/${classroomId}/chat`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, text: input.trim() }),
                }
            );
            const data = await res.json();
            if (data.success) {
                setInput("");
                await fetchMessages(); // Immediately fetch to show the new message
            }
        } catch {
            // Ignore
        }
        setSending(false);
    };

    // Format timestamp
    const formatTime = (ts: string) => {
        const date = new Date(ts);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    // Avatar helper
    const getInitials = (name: string) =>
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

    return (
        <>
            {/* Floating Toggle */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 p-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center hover:-translate-y-1 animate-in zoom-in-90 fade-in"
                    aria-label="Open Chat"
                >
                    <MessageSquare className="w-6 h-6" />
                    {/* Unread indicator dot */}
                    {messages.length > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full ring-2 ring-background" />
                    )}
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-[340px] sm:w-[380px] h-[500px] max-h-[85vh] bg-background border border-border rounded-xl shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom-5 fade-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between p-3.5 border-b border-border bg-muted/20 rounded-t-xl">
                        <div className="flex items-center gap-2.5">
                            <div className="bg-blue-500/10 p-1.5 rounded-lg border border-blue-500/20">
                                <MessageSquare className="w-4 h-4 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">Classroom Chat</h3>
                                <p className="text-[10px] text-muted-foreground">
                                    {messages.length} message{messages.length !== 1 ? "s" : ""}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors"
                            title="Minimize"
                            aria-label="Minimize Chat"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                    </div>

                    {/* --- Not a member state --- */}
                    {isMember === false && (
                        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-muted-foreground gap-3">
                            <ShieldAlert className="w-10 h-10 stroke-[1.5] text-red-400/60" />
                            <div>
                                <p className="font-medium text-sm text-foreground">Access Denied</p>
                                <p className="text-xs mt-1">
                                    Only invited classroom members can participate in this chat.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* --- Loading --- */}
                    {isMember === null && loading && (
                        <div className="flex-1 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        </div>
                    )}

                    {/* --- Chat Body --- */}
                    {isMember === true && (
                        <>
                            <div
                                ref={scrollRef}
                                className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 text-sm"
                            >
                                {messages.length === 0 && !loading && (
                                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-3 opacity-60">
                                        <MessageSquare className="w-10 h-10 stroke-[1.5]" />
                                        <p className="text-center">
                                            No messages yet.
                                            <br />
                                            Start the conversation!
                                        </p>
                                    </div>
                                )}

                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex gap-2 ${msg.isOwn ? "flex-row-reverse" : ""}`}
                                    >
                                        {/* Avatar */}
                                        {!msg.isOwn && (
                                            <span className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-semibold text-white shrink-0 mt-0.5 ring-1 ring-border overflow-hidden">
                                                {msg.senderImage ? (
                                                    <img
                                                        src={msg.senderImage}
                                                        alt={msg.sender}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    getInitials(msg.sender)
                                                )}
                                            </span>
                                        )}

                                        {/* Bubble */}
                                        <div
                                            className={`max-w-[75%] rounded-xl px-3 py-2 ${
                                                msg.isOwn
                                                    ? "bg-blue-500 text-white rounded-br-sm"
                                                    : "bg-muted rounded-bl-sm"
                                            }`}
                                        >
                                            {!msg.isOwn && (
                                                <p className="text-[10px] font-semibold text-blue-400 mb-0.5">
                                                    {msg.sender}
                                                </p>
                                            )}
                                            <p className="text-[13px] leading-snug break-words">{msg.text}</p>
                                            <p
                                                className={`text-[9px] mt-1 ${
                                                    msg.isOwn ? "text-blue-200" : "text-muted-foreground"
                                                }`}
                                            >
                                                {formatTime(msg.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input */}
                            <div className="p-3 border-t border-border bg-muted/10 rounded-b-xl">
                                <form
                                    onSubmit={handleSend}
                                    className="relative flex items-center"
                                >
                                    <input
                                        type="text"
                                        placeholder="Type your message..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        className="w-full bg-background border border-border rounded-full pl-4 pr-11 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow text-foreground placeholder:text-muted-foreground shadow-sm"
                                        disabled={sending}
                                    />
                                    <button
                                        type="submit"
                                        disabled={sending || !input.trim()}
                                        className="absolute right-1.5 p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors flex items-center justify-center shadow-sm disabled:opacity-50"
                                        aria-label="Send Message"
                                    >
                                        {sending ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : (
                                            <Send className="w-3.5 h-3.5 -ml-0.5" />
                                        )}
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
};
