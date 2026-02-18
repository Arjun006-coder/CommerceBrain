import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "ai";
  content: string;
}

const initialMessages: Message[] = [
  {
    role: "ai",
    content:
      "👋 Welcome to CommerceBrain AI! I can help you analyze product performance, customer sentiment, and competitive landscape. Try asking:\n\n• *Why is this product underperforming?*\n• *What are the top customer complaints?*\n• *How does pricing compare to competitors?*",
  },
];

import { useDashboard } from "@/context/DashboardContext";
import { sendChatMessage } from "@/lib/api";

export function AIChatPanel() {
  const { data } = useDashboard();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setIsTyping(true);

    try {
      const productId = data?.product_info?.product_id;
      const res = await sendChatMessage(userMsg, productId);
      setMessages((prev) => [...prev, { role: "ai", content: res.response || "I couldn't generate a response." }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: "ai", content: "Sorry, I encountered an error." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 border-b border-border/30 px-4 py-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-md" style={{ background: 'var(--gradient-primary)' }}>
          <Sparkles className="h-3 w-3 text-primary-foreground" />
        </div>
        <h3 className="font-display text-xs font-bold tracking-wider text-foreground uppercase">AI Assistant</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 animate-fade-in-up ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
              style={{
                background: m.role === "ai" ? 'var(--gradient-primary)' : 'hsl(var(--muted))',
              }}
            >
              {m.role === "ai" ? <Bot className="h-3.5 w-3.5 text-primary-foreground" /> : <User className="h-3.5 w-3.5 text-foreground" />}
            </div>
            <div
              className="max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed"
              style={{
                background: m.role === "ai" ? 'hsl(var(--muted) / 0.5)' : 'var(--gradient-primary)',
                color: m.role === "ai" ? 'hsl(var(--foreground) / 0.85)' : 'hsl(var(--primary-foreground))',
              }}
            >
              {m.content.split("\n").map((line, j) => (
                <p key={j} className={j > 0 ? "mt-1" : ""}>
                  {line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/).map((part, k) => {
                    if (part.startsWith("**") && part.endsWith("**"))
                      return <strong key={k}>{part.slice(2, -2)}</strong>;
                    if (part.startsWith("*") && part.endsWith("*"))
                      return <em key={k}>{part.slice(1, -1)}</em>;
                    return part;
                  })}
                </p>
              ))}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 animate-fade-in-up">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ background: 'var(--gradient-primary)' }}>
              <Bot className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <div className="flex items-center gap-1.5 rounded-xl px-4 py-3" style={{ background: 'hsl(var(--muted) / 0.5)' }}>
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border/30 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask about product performance…"
            className="flex-1 rounded-lg border border-border/50 bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
          <button
            onClick={send}
            className="flex items-center justify-center rounded-lg px-3 text-primary-foreground transition-all hover:scale-105"
            style={{ background: 'var(--gradient-primary)' }}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
