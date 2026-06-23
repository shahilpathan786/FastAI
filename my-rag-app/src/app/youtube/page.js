"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../component/AuthContext";
import { apiFetch } from "../lib/api";

export default function YouTubePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [youtubeLink, setYoutubeLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/authenticate/login");
    }
  }, [isAuthenticated, router]);

  const extractVideoId = (url) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes("youtube.com")) {
        return urlObj.searchParams.get("v");
      } else if (urlObj.hostname === "youtu.be") {
        return urlObj.pathname.slice(1);
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleProcess = async (e) => {
    e.preventDefault();
    
    if (!youtubeLink.trim()) {
      setError("Please enter a YouTube link");
      return;
    }

    const videoId = extractVideoId(youtubeLink);
    if (!videoId) {
      setError("Invalid YouTube URL. Please enter a valid YouTube link.");
      return;
    }

    setLoading(true);
    setError("");
    setSummary("");
    setNotes([]);

    try {
      const data = await apiFetch("/youtube-summary/", {
        method: "POST",
        body: JSON.stringify({
          youtube_url: youtubeLink,
        }),
      });

      setSummary(data.summary || "");
      setNotes(data.key_points || []);
      setYoutubeLink("");
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Failed to process the video. Please try again.");
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-[#050508] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&display=swap');
        
        .font-syne { font-family: 'Syne', sans-serif; }
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .anim-fade-up { animation: fadeUp 0.6s ease both; }
        
        .grid-bg {
          background-image:
            linear-gradient(rgba(99,130,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,130,255,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        
        .input-field {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(99, 102, 241, 0.2);
          transition: all 0.3s ease;
        }
        
        .input-field:focus {
          border-color: rgba(99, 102, 241, 0.6);
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.15);
          background: rgba(15, 23, 42, 0.9);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(99, 102, 241, 0.4);
        }
        
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      <div className="pointer-events-none fixed inset-0 z-0 grid-bg opacity-40" />
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }} />
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="anim-fade-up text-center mb-12">
            <h1 className="font-syne text-4xl md:text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              YouTube Summarizer
            </h1>
            <p className="text-slate-400 text-lg">
              Transform long videos into concise summaries instantly
            </p>
            <p className="text-slate-500 text-sm mt-2">
              Logged in as: <span className="text-slate-300 font-medium">{user?.name}</span>
            </p>
          </div>

          {/* Input Section */}
          <div className="anim-fade-up backdrop-blur-md bg-[#0f172a]/40 rounded-2xl p-8 border border-slate-800/50 mb-8">
            <form onSubmit={handleProcess}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  YouTube Link
                </label>
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="input-field flex-1 px-4 py-3 rounded-lg text-white placeholder-slate-500 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={loading || !youtubeLink.trim()}
                    className="btn-primary px-6 py-3 rounded-lg text-white font-bold whitespace-nowrap"
                  >
                    {loading ? "Analyzing..." : "Analyze"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                  {error}
                </div>
              )}
            </form>
          </div>

          {/* Results Section */}
          {(summary || notes.length > 0) && (
            <div className="anim-fade-up space-y-6">
              
              {/* Summary */}
              {summary && (
                <div className="backdrop-blur-md bg-[#0f172a]/40 rounded-2xl p-8 border border-slate-800/50">
                  <h2 className="text-2xl font-bold text-blue-400 mb-4"> Summary</h2>
                  <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed">
                    <p className="whitespace-pre-wrap">{summary}</p>
                  </div>
                </div>
              )}

              {/* Key Points */}
              {notes.length > 0 && (
                <div className="backdrop-blur-md bg-[#0f172a]/40 rounded-2xl p-8 border border-slate-800/50">
                  <h2 className="text-2xl font-bold text-purple-400 mb-4"> Key Points</h2>
                  <ul className="space-y-3">
                    {notes.map((note, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center text-xs font-bold text-purple-300">
                          {index + 1}
                        </span>
                        <span className="text-slate-300 leading-relaxed">{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Info */}
          {!summary && (
            <div className="anim-fade-up text-center p-12 backdrop-blur-md bg-[#0f172a]/40 rounded-2xl border border-slate-800/50">
              <div className="text-6xl mb-4"></div>
              <p className="text-slate-400 text-lg mb-3">
                Paste a YouTube link above to get started
              </p>
              <p className="text-slate-500 text-sm">
                Supports YouTube, YouTube Shorts, and other video formats
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
