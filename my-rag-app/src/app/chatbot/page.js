"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../component/AuthContext";
import { apiFetch } from "../lib/api";

export default function ChatbotPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
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
      setMessages(JSON.parse(savedHistory));
    } else {
      setMessages([
        {
          role: "ai",
          content: `Hello ${user?.name || "student"}! I''m EduAI, your personal AI tutor. How can I help you today?`,
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
  }, [messages]);

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
          history: messages
        }),
      });

      const aiResponse = { role: "ai", content: data.reply };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error communicating with AI:", error);
      const aiResponse = { role: "ai", content: "Sorry, I am having trouble connecting to my brain right now. " };
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
        content: `Hello ${user?.name || "student"}! I''m EduAI, your personal AI tutor. How can I help you today?`,
      },
    ]);
  };

  const handleLogout = () => {
    localStorage.removeItem("chatHistory");
    logout();
    router.push("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-slate-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-black text-white w-full">
      <div className="flex-shrink-0 bg-slate-950/80 backdrop-blur-md border-t border-slate-800 px-6 py-4 flex justify-between items-center z-10 w-full mt-0">
        <div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            EduAI Chatbot
          </h1>
          <p className="text-sm text-slate-400">
            Chatting as:{" "}
            <span className="text-slate-200 font-medium">{user?.name}</span>
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleClearHistory}
            className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors border border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            Clear History
          </button>
          <button
            onClick={handleLogout}
            className="text-xs px-3 py-1.5 bg-red-900/40 hover:bg-red-800/60 text-red-200 rounded-md transition-colors border border-red-800/50 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex-shrink-0 flex items-center justify-center space-x-3 pb-3 pt-3 border-b border-slate-800 bg-slate-950 px-6">
        <span className="text-sm text-slate-400 mr-1">AI Mood:</span>
        <button
          onClick={() => setMode("Happy")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${mode === "Happy" ? "bg-green-500/20 text-green-400 border border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.2)]" : "bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400"}`}
        >
          Happy 
        </button>
        <button
          onClick={() => setMode("Sad")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${mode === "Sad" ? "bg-blue-500/20 text-blue-400 border border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]" : "bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400"}`}
        >
          Sad 
        </button>
        <button
          onClick={() => setMode("Angry")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${mode === "Angry" ? "bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]" : "bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400"}`}
        >
          Angry 
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 w-full max-w-4xl mx-auto space-y-6 min-h-[50vh]">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-4 shadow-md leading-relaxed ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-bl-sm px-5 py-5 shadow-sm flex space-x-2 items-center">
              <div
                className="w-2 h-2 rounded-full bg-slate-500 animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full bg-slate-500 animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full bg-slate-500 animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex-shrink-0 bg-gradient-to-t from-black via-black to-transparent p-4 pb-12 mt-auto">
        <form
          onSubmit={handleSendMessage}
          className="max-w-4xl mx-auto relative flex items-center"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything..."
            className="w-full bg-slate-900 border border-slate-700 rounded-full px-6 py-4 pr-16 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="absolute right-2 p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-blue-600 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <svg
              className="w-5 h-5 ml-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </form>
        <p className="text-center text-xs text-slate-500 mt-4">
          Chat history is saved locally in your browser.
        </p>
      </div>
    </div>
  );
}
