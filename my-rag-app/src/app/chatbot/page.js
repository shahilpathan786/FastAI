"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../component/AuthContext";
import { apiFetch } from "../lib/api";

const MOODS = [
  { key: "Happy", label: "Happy" },
  { key: "Sad", label: "Sad" },
  { key: "Angry", label: "Angry" },
];

export default function ChatbotPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState("Happy");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/authenticate/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("chatHistory");
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      setMessages(parsed);
    } else {
      setMessages([
        {
          role: "ai",
          content: `Hey, ${user?.name || "Student"}. I'm Nexus AI — your intelligent learning companion. I adapt to your vibe, answer your questions, and make studying feel less like studying. What are we cracking today?`,
        },
      ]);
    }
  }, [user]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMessage = { role: "user", content: inputValue.trim() };
    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const data = await apiFetch("/api/chat/", {
        method: "POST",
        body: JSON.stringify({
          message: newUserMessage.content,
          mood: mode,
          history: messages,
        }),
      });

      const aiResponse = { role: "ai", content: data.reply };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error communicating with AI:", error);
      const aiResponse = {
        role: "ai",
        content: "Listen up — my connection just dropped. Give it another shot in a moment.",
      };
      setMessages((prev) => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    localStorage.removeItem("chatHistory");
    setMessages([
      {
        role: "ai",
        content: `Session reset. Ready for a fresh start, ${user?.name || "Student"} — what are we learning today?`,
      },
    ]);
  };

  const handleExit = () => {
    router.push("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#060610]">
        <div className="text-center">
          <div className="w-11 h-11 mx-auto mb-4 rounded-[10px] bg-gradient-to-br from-purple-500 to-orange-500 [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)] animate-pulse" />
          <p className="text-[#5050a0] text-sm">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const moodTheme = {
    Happy: { ring: "border-emerald-500/60 bg-[#0c1f15] shadow-[0_0_18px_rgba(34,197,94,0.2)] text-emerald-400", pip: "bg-emerald-400 shadow-[0_0_8px_#22c55e]", bubble: "border-[#0f2a1a] bg-[#080e10]" },
    Sad: { ring: "border-sky-500/60 bg-[#080f22] shadow-[0_0_18px_rgba(14,165,233,0.2)] text-sky-300", pip: "bg-sky-400 shadow-[0_0_8px_#0ea5e9]", bubble: "border-[#0a1828] bg-[#060810]" },
    Angry: { ring: "border-red-500/60 bg-[#1a0808] shadow-[0_0_18px_rgba(239,68,68,0.22)] text-red-300", pip: "bg-red-400 shadow-[0_0_8px_#ef4444]", bubble: "border-[#1e0808] bg-[#0c0406]" },
  };

  return (
    <div className="flex flex-col flex-1 bg-[#060610] text-white w-full relative overflow-hidden">
      {/* ambient background glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% -10%, rgba(168,85,247,0.08), transparent), radial-gradient(ellipse 40% 30% at 90% 90%, rgba(249,115,22,0.05), transparent)",
        }}
      />

      {/* HEADER */}
      <div className="flex-shrink-0 relative z-10 bg-[#08081a] border-b border-[#14142e] px-5 py-3.5 flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 flex items-center justify-center flex-shrink-0">
            <div
              className="w-11 h-11 flex items-center justify-center text-white text-lg font-bold italic tracking-tighter animate-[float_3s_ease-in-out_infinite]"
              style={{
                background: "linear-gradient(135deg, #a855f7, #f97316)",
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }}
            >
              N&times;
            </div>
            <div
              className="absolute -inset-1 rounded-full border border-purple-400/40 animate-[spin_6s_linear_infinite]"
            />
          </div>
          <div>
            <h1
              className="text-[17px] font-bold tracking-wide bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(90deg, #c084fc, #f97316, #f472b6)",
                backgroundSize: "200% auto",
              }}
            >
              NEXUS AI
            </h1>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleClearHistory}
            className="text-[11px] font-medium px-3 py-1.5 rounded-lg border border-[#1e1e3a] text-[#6060a0] hover:bg-[#12122a] hover:text-[#a0a0d0] hover:border-[#2e2e5a] transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleExit}
            className="text-[11px] font-medium px-3 py-1.5 rounded-lg border border-[#2d1020] text-[#e879a0] hover:bg-[#1a0a14] hover:border-[#7c2050] transition-colors"
          >
            Exit
          </button>
        </div>
      </div>

      {/* MOOD BAR */}
      <div className="flex-shrink-0 relative z-10 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#08081a] border-b border-[#14142e]">
        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#3a3a5a] mr-1.5">
          Vibe
        </span>
        {MOODS.map((m) => {
          const active = mode === m.key;
          const theme = moodTheme[m.key];
          return (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all flex items-center gap-1.5 ${
                active
                  ? theme.ring
                  : "border-[#1e1e3a] text-[#4a4a7a] bg-transparent hover:border-[#2e2e5a]"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${active ? theme.pip : "bg-[#3a3a5a]"}`} />
              {m.label}
            </button>
          );
        })}
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 w-full max-w-3xl mx-auto space-y-4 min-h-[50vh] relative z-10">
        {messages.map((msg, index) => {
          const isUser = msg.role === "user";
          const theme = moodTheme[mode];
          return (
            <div
              key={index}
              className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
                  isUser
                    ? "rounded-[10px] bg-[#0e0e22] border border-[#1e1e3a] text-[#5050a0]"
                    : "text-white"
                }`}
                style={
                  !isUser
                    ? {
                        background: "linear-gradient(135deg, #a855f7, #f97316)",
                        clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                      }
                    : undefined
                }
              >
                {isUser ? (user?.name?.[0]?.toUpperCase() || "S") : "N\u00d7"}
              </div>
              <div
                className={`max-w-[78%] sm:max-w-[72%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                  isUser
                    ? "text-white rounded-br-sm shadow-[0_4px_20px_rgba(168,85,247,0.3)]"
                    : `border rounded-bl-sm text-[#b8bcd8] ${theme.bubble}`
                }`}
                style={
                  isUser
                    ? { background: "linear-gradient(135deg, #7c3aed, #a855f7, #f97316)" }
                    : undefined
                }
              >
                {msg.content}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-end gap-2.5">
            <div
              className="w-8 h-8 flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #a855f7, #f97316)",
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }}
            >
              N&times;
            </div>
            <div className="bg-[#0c0c1e] border border-[#1a1a30] rounded-2xl rounded-bl-sm px-4 py-3.5 flex gap-1.5 items-center">
              <span className="w-[7px] h-[7px] rounded-full bg-[#2a2a3e] animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-[7px] h-[7px] rounded-full bg-[#2a2a3e] animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-[7px] h-[7px] rounded-full bg-[#2a2a3e] animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="flex-shrink-0 relative z-10 bg-[#08081a] border-t border-[#14142e] px-4 pt-3.5 pb-4">
        <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto">
          <div className="relative flex items-center gap-2.5 bg-[#0c0c22] border border-[#1a1a38] rounded-2xl pl-4 pr-1.5 py-1 focus-within:border-purple-500 focus-within:shadow-[0_0_0_1px_rgba(168,85,247,0.2),0_4px_24px_rgba(168,85,247,0.1)] transition-all">
            <span
              className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
              style={{ background: "linear-gradient(180deg, #a855f7, #f97316)" }}
            />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Drop your question, I'll handle the rest..."
              className="w-full bg-transparent border-none outline-none text-[#c8c8e8] placeholder-[#2e2e50] text-[13px] py-2.5"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-30 hover:scale-105 hover:shadow-[0_4px_16px_rgba(168,85,247,0.4)] flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
            >
              <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14" />
              </svg>
            </button>
          </div>
        </form>

        <p className="text-center text-[11px] text-[#20203a] mt-3 flex items-center justify-center gap-1.5">
          <span>crafted by</span>
          <span
            className="font-semibold text-xs bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(90deg, #a855f7, #f97316)" }}
          >
            Shahil Pathan
          </span>
          <span className="text-rose-600 text-[13px]">&#10084;</span>
        </p>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}