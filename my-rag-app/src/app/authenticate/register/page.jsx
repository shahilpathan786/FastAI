"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../component/AuthContext";
import { register as apiRegister, login as apiLogin } from "../../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      await apiRegister(formData.name, formData.email, formData.password);
      
      const loginResponse = await apiLogin(formData.email, formData.password);
      
      if (loginResponse.data) {
        const { access_token, ...userData } = loginResponse.data;
        login(userData, access_token);
        router.push("/");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
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

        .password-strength {
          height: 4px;
          background: rgba(99, 102, 241, 0.1);
          border-radius: 2px;
          overflow: hidden;
          margin-top: 6px;
        }

        .strength-bar {
          height: 100%;
          background: linear-gradient(90deg, #ef4444, #f59e0b, #10b981);
          background-size: 300% 100%;
          transition: all 0.3s ease;
          border-radius: 2px;
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
              Join Now
            </h1>
            <p className="text-slate-400 text-sm">Create your account to start learning</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                minLength="2"
                className="input-field w-full px-4 py-3 rounded-lg text-white placeholder-slate-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder=""
                required
                minLength="6"
                className="input-field w-full px-4 py-3 rounded-lg text-white placeholder-slate-500 outline-none"
              />
              <div className="password-strength">
                <div
                  className="strength-bar"
                  style={{
                    width: `${Math.min(formData.password.length * 10, 100)}%`,
                    backgroundPosition: `${(formData.password.length * 10)}% 0`,
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
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
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-700/50" />
            <span className="text-xs text-slate-500 uppercase">Or</span>
            <div className="flex-1 h-px bg-slate-700/50" />
          </div>

          <div className="text-center">
            <p className="text-slate-400 text-sm">
              Already have an account?{" "}
              <Link href="/authenticate/login" className="text-blue-400 font-semibold hover:text-blue-300 transition">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
