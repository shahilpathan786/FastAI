"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── Neural Network Canvas ───────────────────────────────────────────────────
function NeuralCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    // Nodes
    const NODE_COUNT = 55;
    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2.5 + 1.5,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.02,
    }));

    // Signal particles travelling along edges
    const signals = [];
    const SIGNAL_COLORS = ["#60a5fa", "#a78bfa", "#34d399", "#f472b6"];
    let frame = 0;

    const animate = () => {
      ctx.clearRect(0, 0, W(), H());

      // Edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const MAX = 130;
          if (dist < MAX) {
            const alpha = (1 - dist / MAX) * 0.18;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99,130,255,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();

            // Occasionally spawn a signal
            if (frame % 90 === 0 && Math.random() < 0.04) {
              signals.push({
                from: i,
                to: j,
                t: 0,
                speed: 0.008 + Math.random() * 0.012,
                color: SIGNAL_COLORS[Math.floor(Math.random() * SIGNAL_COLORS.length)],
              });
            }
          }
        }
      }

      // Nodes
      nodes.forEach((n) => {
        n.pulse += n.pulseSpeed;
        const glowR = n.r + Math.sin(n.pulse) * 1.2;

        // Glow
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR * 5);
        grad.addColorStop(0, "rgba(99,130,255,0.25)");
        grad.addColorStop(1, "rgba(99,130,255,0)");
        ctx.beginPath();
        ctx.arc(n.x, n.y, glowR * 5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(147,197,253,0.85)";
        ctx.fill();

        // Move
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W()) n.vx *= -1;
        if (n.y < 0 || n.y > H()) n.vy *= -1;
      });

      // Signals
      for (let s = signals.length - 1; s >= 0; s--) {
        const sig = signals[s];
        sig.t += sig.speed;
        if (sig.t >= 1) { signals.splice(s, 1); continue; }
        const a = nodes[sig.from];
        const b = nodes[sig.to];
        const px = a.x + (b.x - a.x) * sig.t;
        const py = a.y + (b.y - a.y) * sig.t;

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = sig.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = sig.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      frame++;
      requestAnimationFrame(animate);
    };

    const raf = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}

// ─── Stat Counter ────────────────────────────────────────────────────────────
function StatItem({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-300 to-purple-400 font-mono">
        {value}
      </span>
      <span className="text-xs uppercase tracking-widest text-slate-500">{label}</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [displayText, setDisplayText] = useState("");
  const fullText = "welcome to fast AI";
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    let currentIndex = 0;
    const id = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayText(fullText.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(id);
      }
    }, 120);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const check = () => setHasLoggedIn(!!localStorage.getItem("userName"));
    check();
    window.addEventListener("userLogin", check);
    return () => window.removeEventListener("userLogin", check);
  }, []);

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=DM+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; }

        .font-syne { font-family: 'Syne', sans-serif; }
        .font-mono-dm { font-family: 'DM Mono', monospace; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes borderGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
          50%       { box-shadow: 0 0 32px 4px rgba(99,102,241,0.25); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes scanline {
          0%   { top: 0%; }
          100% { top: 100%; }
        }

        .anim-fade-up  { animation: fadeUp 0.8s ease both; }
        .anim-fade-in  { animation: fadeIn 1s ease both; }
        .delay-1 { animation-delay: 0.15s; }
        .delay-2 { animation-delay: 0.3s; }
        .delay-3 { animation-delay: 0.5s; }
        .delay-4 { animation-delay: 0.7s; }
        .delay-5 { animation-delay: 0.9s; }

        .shimmer-text {
          background: linear-gradient(90deg, #93c5fd 0%, #c4b5fd 30%, #f9a8d4 50%, #c4b5fd 70%, #93c5fd 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 48px -12px rgba(99,102,241,0.2);
          border-color: rgba(99,102,241,0.4);
        }

        .btn-primary {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .btn-primary:hover::after { opacity: 1; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(99,102,241,0.4); }
        .btn-primary span { position: relative; z-index: 1; }

        .neural-border {
          animation: borderGlow 3s ease-in-out infinite;
        }

        .float-icon { animation: float 4s ease-in-out infinite; }

        .scanline-overlay::after {
          content: '';
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(99,130,255,0.4), transparent);
          animation: scanline 3s linear infinite;
        }

        .grid-bg {
          background-image:
            linear-gradient(rgba(99,130,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,130,255,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .badge-glow {
          box-shadow: 0 0 16px rgba(99,102,241,0.25);
        }

        .tag-pill {
          background: rgba(30,30,60,0.6);
          border: 1px solid rgba(99,130,255,0.2);
          backdrop-filter: blur(4px);
        }
      `}</style>

      <main
        className="font-syne flex flex-col min-h-screen bg-[#050508] text-white overflow-x-hidden grid-bg"
      >
        {/* ── Top noise grain overlay ── */}
        <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "128px" }} />

        {/* ── Radial glow blobs ── */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }} />
          <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full opacity-8"
            style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)" }} />
        </div>

        <div className="relative z-10 flex flex-col items-center px-6 pt-20 pb-24 max-w-6xl mx-auto w-full gap-16">

          {/* ── HERO ── */}
          <section className="w-full flex flex-col items-center text-center gap-8">

            {/* Badge */}
            <div className={`anim-fade-up font-mono-dm inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs tracking-widest uppercase text-blue-300 badge-glow tag-pill ${mounted ? "" : "opacity-0"}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI-Powered Learning Experience
            </div>

            {/* Headline */}
            <h1 className={`anim-fade-up delay-1 text-5xl md:text-7xl font-black tracking-tight leading-[1.05] ${mounted ? "" : "opacity-0"}`}>
              <span className="shimmer-text capitalize">{displayText}</span>
              <span className="animate-pulse text-blue-400 font-light ml-1">|</span>
            </h1>

            <p className={`anim-fade-up delay-2 text-lg text-slate-400 max-w-xl leading-relaxed ${mounted ? "" : "opacity-0"}`}>
              Your intelligent learning assistant that adapts to your unique study style.
              Learn faster, remember more, and excel in every subject.
            </p>

            {/* CTA */}
            <div className={`anim-fade-up delay-3 min-h-[3.5rem] flex items-center ${mounted ? "" : "opacity-0"}`}>
              {hasLoggedIn ? (
                <Link href="/chatbot">
                  <button className="btn-primary px-8 py-4 rounded-2xl text-white font-bold text-base">
                    <span>Open Chatbot →</span>
                  </button>
                </Link>
              ) : (
                <p className="font-mono-dm text-xs text-slate-500 tracking-wider italic">
                  Log in to unlock the AI Chatbot
                </p>
              )}
            </div>

            {/* Stats row */}
            <div className={`anim-fade-up delay-4 w-full max-w-lg flex justify-around pt-4 ${mounted ? "" : "opacity-0"}`}>
              <StatItem value="10K+" label="Learners" />
              <div className="w-px bg-slate-800" />
              <StatItem value="98%" label="Accuracy" />
              <div className="w-px bg-slate-800" />
              <StatItem value="24/7" label="Available" />
            </div>
          </section>

          {/* ── NEURAL NETWORK HERO VISUAL ── */}
          <div className={`anim-fade-in delay-3 w-full relative rounded-3xl overflow-hidden neural-border scanline-overlay ${mounted ? "" : "opacity-0"}`}
            style={{
              border: "1px solid rgba(99,130,255,0.2)",
              background: "linear-gradient(135deg, rgba(10,10,30,0.9), rgba(5,5,20,0.95))",
              height: "340px",
            }}>
            {/* Corner accents */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-blue-500/50 rounded-tl-lg" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-blue-500/50 rounded-tr-lg" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-purple-500/50 rounded-bl-lg" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-purple-500/50 rounded-br-lg" />

            {/* Canvas */}
            <NeuralCanvas />

            {/* Overlay label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-3">
              <div className="font-mono-dm text-xs tracking-[0.3em] uppercase text-blue-400/60">
                Neural Learning Engine
              </div>
              <div className="text-4xl md:text-5xl font-black text-white/10 select-none tracking-tight">
                FAST AI
              </div>
              <div className="flex gap-2 mt-2">
                {["Math", "Science", "History", "Code", "Language"].map((t) => (
                  <span key={t} className="tag-pill px-2.5 py-0.5 rounded-full text-xs text-slate-400 font-mono-dm">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── FEATURE CARDS ── */}
          <section className={`anim-fade-up delay-4 w-full grid md:grid-cols-3 gap-6 ${mounted ? "" : "opacity-0"}`}>

            {/* Card 1 */}
            <div className="card-hover bg-[#0d0d1a] p-7 rounded-2xl border border-slate-800/80 flex flex-col gap-5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center float-icon"
                style={{ background: "linear-gradient(135deg, #1d4ed8, #3b82f6)", boxShadow: "0 8px 24px rgba(59,130,246,0.3)" }}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <div className="font-mono-dm text-xs text-blue-400/70 tracking-widest uppercase mb-1">01 —</div>
                <h3 className="text-lg font-bold text-white mb-2">Adaptive Learning</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  AI maps your strengths and gaps in real time, building a personalized curriculum that grows with you.
                </p>
              </div>
            </div>

            {/* Card 2 — featured, larger glow */}
            <div className="card-hover bg-[#0d0d1a] p-7 rounded-2xl border border-purple-900/60 flex flex-col gap-5"
              style={{ boxShadow: "0 0 40px rgba(139,92,246,0.08)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center float-icon"
                style={{ background: "linear-gradient(135deg, #7c3aed, #a78bfa)", boxShadow: "0 8px 24px rgba(139,92,246,0.35)", animationDelay: "1s" }}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="font-mono-dm text-xs text-purple-400/70 tracking-widest uppercase mb-1">02 —</div>
                <h3 className="text-lg font-bold text-white mb-2">Instant Feedback</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Get step-by-step explanations the moment you answer. No waiting — your learning never pauses.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="card-hover bg-[#0d0d1a] p-7 rounded-2xl border border-slate-800/80 flex flex-col gap-5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center float-icon"
                style={{ background: "linear-gradient(135deg, #065f46, #10b981)", boxShadow: "0 8px 24px rgba(16,185,129,0.3)", animationDelay: "2s" }}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="font-mono-dm text-xs text-emerald-400/70 tracking-widest uppercase mb-1">03 —</div>
                <h3 className="text-lg font-bold text-white mb-2">24/7 Availability</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Your AI tutor never sleeps. Study at midnight, sunrise, or anywhere in between — on any device.
                </p>
              </div>
            </div>

          </section>

          {/* ── BOTTOM CTA STRIP ── */}
          <div className={`anim-fade-up delay-5 w-full rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 ${mounted ? "" : "opacity-0"}`}
            style={{
              background: "linear-gradient(135deg, rgba(30,27,75,0.7), rgba(17,24,39,0.8))",
              border: "1px solid rgba(99,102,241,0.2)",
            }}>
            <div>
              <h2 className="text-2xl font-black text-white mb-1">Ready to learn smarter?</h2>
              <p className="text-slate-400 text-sm">Join thousands of students already using Fast AI.</p>
            </div>
            {hasLoggedIn ? (
              <Link href="/chatbot">
                <button className="btn-primary px-7 py-3.5 rounded-xl font-bold text-sm whitespace-nowrap">
                  <span>Start Learning →</span>
                </button>
              </Link>
            ) : (
              <button className="btn-primary px-7 py-3.5 rounded-xl font-bold text-sm whitespace-nowrap opacity-60 cursor-not-allowed" disabled>
                <span>Log In to Begin</span>
              </button>
            )}
          </div>

        </div>
      </main>
    </>
  );
}