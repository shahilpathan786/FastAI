"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../component/AuthContext";
import { login as apiLogin } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await apiLogin(email, password);
      
      if (response.data) {
        const { access_token, ...userData } = response.data;
        login(userData, access_token);
        router.push("/chatbot");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white flex items-center justify-center p-4">
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

      <div className="relative z-10 w-full max-w-md">
        <div className="anim-fade-up backdrop-blur-md bg-[#0f172a]/40 rounded-2xl p-8 border border-slate-800/50">
          
          <div className="mb-8 text-center">
            <h1 className="font-syne text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Welcome Back
            </h1>
            <p className="text-slate-400 text-sm">Sign in to continue learning</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input-field w-full px-4 py-3 rounded-lg text-white placeholder-slate-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
                required
                minLength="6"
                className="input-field w-full px-4 py-3 rounded-lg text-white placeholder-slate-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 rounded-lg text-white font-bold text-base mt-6"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-700/50" />
            <span className="text-xs text-slate-500 uppercase">Or</span>
            <div className="flex-1 h-px bg-slate-700/50" />
          </div>

          <div className="text-center">
            <p className="text-slate-400 text-sm">
              Don''t have an account?{" "}
              <Link href="/authenticate/register" className="text-blue-400 font-semibold hover:text-blue-300 transition">
                Register here
              </Link>
            </p>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 text-blue-300 text-xs">
            Demo: You can use any email and password (min 6 chars) to register first
          </div>
        </div>
      </div>
    </div>
  );
}
