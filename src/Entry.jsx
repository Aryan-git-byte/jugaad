import { useState, useEffect } from "react";
import logo from "../public/logo.svg";

const C = {
  mud: "#2C1810", clay: "#8B4513", dust: "#C4956A",
  chai: "#D4892A", paper: "#F5E6C8", electric: "#00FF88",
  smoke: "#1A1208", ink: "#0D0805", orange: "#ff8c37",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Coiny&display=swap');

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html, body, #root { width:100%; height:100%; overflow:hidden; font-family:monospace; user-select:none; -webkit-user-select:none; }
  img { -webkit-user-drag:none; user-drag:none; pointer-events:none; }
  button { pointer-events:auto; font-family:monospace; }

  .hc-flag {
    position:absolute; top:12; left:50%; transform:translateX(-50%);
    height:48px; z-index:20; opacity:0;
    transition:opacity 0.4s ease;
  }
  .hc-icon {
    position:absolute; bottom:20px; right:20px;
    height:32px; z-index:20; opacity:0;
    transition:opacity 0.4s ease;
  }

  @keyframes crt-on {
    0%   { transform:scaleY(0.002) scaleX(1.1); filter:brightness(8); }
    10%  { transform:scaleY(0.08) scaleX(1.04); filter:brightness(4); }
    25%  { transform:scaleY(1) scaleX(1); filter:brightness(1.8); }
    45%  { filter:brightness(1); }
    60%  { filter:brightness(0.8); }
    75%  { filter:brightness(1.05); }
    100% { filter:brightness(1); }
  }

  @keyframes slam {
    0%   { transform:rotate(-3deg) scale(2.8) translateY(-60px); opacity:0; filter:blur(20px); }
    55%  { transform:rotate(-3deg) scale(0.93) translateY(5px);  opacity:1; filter:blur(0); }
    70%  { transform:rotate(-3deg) scale(1.04) translateY(-2px); }
    84%  { transform:rotate(-3deg) scale(0.98) translateY(1px); }
    100% { transform:rotate(-3deg) scale(1) translateY(0); }
  }

  @keyframes scanline { 0%{top:-6%} 100%{top:106%} }

  @keyframes flicker {
    0%,38%,40%,73%,75%,100%{opacity:1}
    39%{opacity:0.3} 74%{opacity:0.6}
  }

  @keyframes glitch-a {
    0%,100%{clip-path:inset(20% 0 60% 0);transform:rotate(-3deg) translate(-6px,0)}
    33%    {clip-path:inset(65% 0 10% 0);transform:rotate(-3deg) translate(6px,0)}
    66%    {clip-path:inset(45% 0 35% 0);transform:rotate(-3deg) translate(-3px,0)}
  }
  @keyframes glitch-b {
    0%,100%{clip-path:inset(55% 0 25% 0);transform:rotate(-3deg) translate(6px,0)}
    33%    {clip-path:inset(10% 0 75% 0);transform:rotate(-3deg) translate(-5px,0)}
    66%    {clip-path:inset(75% 0 8%  0);transform:rotate(-3deg) translate(3px,0)}
  }

  @keyframes float-a { 0%,100%{transform:translateY(0) rotate(var(--r))} 50%{transform:translateY(-16px) rotate(var(--r))} }
  @keyframes float-b { 0%,100%{transform:translateY(0) rotate(var(--r))} 50%{transform:translateY(-10px) rotate(var(--r))} }
  @keyframes float-c { 0%,100%{transform:translateY(0) rotate(var(--r))} 50%{transform:translateY(-20px) rotate(var(--r))} }

  @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes fadeup  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

  .entry-root {
    position:fixed; inset:0;
    background:${C.paper};
    display:flex; flex-direction:column;
    align-items:center; justify-content:center;
    overflow:hidden; cursor:default;
    animation:crt-on 1s cubic-bezier(0.22,1,0.36,1) forwards;
  }

  .scanline {
    position:absolute; left:0; right:0; height:3px;
    background:rgba(0,0,0,0.04);
    animation:scanline 4s linear infinite;
    pointer-events:none; z-index:50;
  }

  .crt-lines {
    position:absolute; inset:0; pointer-events:none; z-index:40;
    background:repeating-linear-gradient(
      0deg, transparent, transparent 3px,
      rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px
    );
  }

  .vignette {
    position:absolute; inset:0; pointer-events:none; z-index:41;
    background:radial-gradient(ellipse at center, transparent 50%, rgba(44,24,16,0.35) 100%);
  }

  .flicker-layer {
    position:absolute; inset:0; pointer-events:none; z-index:42;
    animation:flicker 7s linear infinite;
  }

  /* Floating tags */
  .tag {
    position:absolute;
    font-family:'SF Mono','Roboto Mono',monospace;
    font-size:11px; color:${C.clay};
    opacity:0.22; user-select:none; pointer-events:none;
    white-space:nowrap; letter-spacing:1px;
  }

  /* Tape strips */
  .tape {
    position:absolute; height:18px; border-radius:2px;
    background:${C.orange}; pointer-events:none;
    transition:opacity 0.35s ease;
  }
  .tape::before,.tape::after {
    content:''; position:absolute; top:0; bottom:0; width:6px;
    background:rgba(0,0,0,0.12);
  }
  .tape::before{left:0} .tape::after{right:0}

  /* Corner nails */
  .nail {
    position:absolute; width:11px; height:11px; border-radius:50%;
    background:radial-gradient(circle at 38% 38%, #d0d0d0, #555);
    border:1px solid #333; pointer-events:none;
    transition:opacity 0.3s ease;
    box-shadow:0 2px 4px rgba(0,0,0,0.3);
  }
  .nail::after {
    content:''; position:absolute; top:50%; left:50%;
    transform:translate(-50%,-50%);
    width:3px; height:3px; border-radius:50%; background:#444;
  }

  /* Logo container — tilted, pinned at top */
  .logo-wrap {
    position:relative; z-index:10; margin-top:20px;
    animation:slam 0.65s cubic-bezier(0.22,1,0.36,1) 1s both;
  }
  .logo-wrap img {
    height:clamp(130px, 24vw, 260px);
    display:block; filter:none;
  }

  /* Nail pinning logo */
  .logo-pin {
    position:absolute; top:-10px; left:50%;
    transform:translateX(-50%);
    width:18px; height:18px; border-radius:50%; z-index:12;
    background:radial-gradient(circle at 35% 35%, #e0e0e0, #555);
    border:1.5px solid #2a2a2a;
    box-shadow:0 3px 8px rgba(0,0,0,0.45);
    opacity:0; transition:opacity 0.3s ease;
  }
  .logo-pin::after {
    content:''; position:absolute; top:50%; left:50%;
    transform:translate(-50%,-50%);
    width:5px; height:5px; border-radius:50%; background:#333;
  }

  .glitch-layer {
    position:absolute; inset:0;
    display:flex; align-items:center; justify-content:center;
    pointer-events:none; overflow:hidden;
  }

  .tagline {
    margin-top:20px; z-index:10; opacity:0;
    font-family:monospace;
    font-size:clamp(13px,2vw,16px);
    letter-spacing:2px; text-transform:uppercase;
    color:${C.mud}; text-align:center; min-height:22px;
  }

  .cursor {
    display:inline-block; width:2px; height:0.85em;
    background:${C.clay}; vertical-align:middle; margin-left:2px;
    animation:blink 0.7s step-end infinite;
  }

  .stat-row {
    margin-top:28px; display:flex; gap:0;
    z-index:10; opacity:0; align-items:center;
  }
  .stat-item {
    font-family:'Coiny', cursive;
    font-size:clamp(16px,2.2vw,22px);
    letter-spacing:2px; color:${C.mud};
  }
  .stat-item span { color:${C.chai}; }
  .stat-sep {
    width:1px; height:20px; background:${C.clay};
    opacity:0.4; margin:0 16px;
  }

  .enter-btn {
    margin-top:40px; z-index:10; opacity:0;
    font-family:'Coiny', cursive;
    font-size:18px; letter-spacing:3px;
    background:${C.mud}; color:${C.paper};
    border:none; padding:14px 40px; cursor:pointer;
    clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px));
    transition:background 0.2s, transform 0.15s;
  }
  .enter-btn:hover {
    background:${C.chai}; color:${C.ink};
    transform:translate(-2px,-2px);
  }

  .exit-flash {
    position:fixed; inset:0; background:${C.ink};
    opacity:0; pointer-events:none; z-index:9999;
    transition:opacity 0.08s;
  }
  .exit-flash.on { opacity:1; }
`;

const TAGLINE = "Fix what's broken in your city.";

const TAGS = [
  { text:"<div>",       pos:{top:"11%", left:"5%"},   anim:"float-a", dur:3.8, delay:0,   r:"-5deg" },
  { text:"</fix>",      pos:{top:"8%",  right:"6%"},  anim:"float-b", dur:4.2, delay:0.3, r:"4deg"  },
  { text:"<problem />", pos:{top:"68%", left:"4%"},   anim:"float-c", dur:5,   delay:0.6, r:"-3deg" },
  { text:"</solution>", pos:{top:"74%", right:"5%"},  anim:"float-a", dur:4.5, delay:0.2, r:"6deg"  },
  { text:"<hack>",      pos:{top:"42%", right:"3%"},  anim:"float-b", dur:3.6, delay:0.8, r:"-7deg" },
  { text:"</jugaad>",   pos:{top:"38%", left:"2%"},   anim:"float-c", dur:4.8, delay:1,   r:"3deg"  },
  { text:"<deploy />",  pos:{top:"86%", left:"55%"},  anim:"float-a", dur:4.1, delay:0.5, r:"-4deg" },
  { text:"<build>",     pos:{top:"85%", left:"18%"},  anim:"float-b", dur:3.9, delay:0.9, r:"5deg"  },
  { text:"</grant>",    pos:{top:"18%", left:"38%"},  anim:"float-c", dur:5.2, delay:1.2, r:"-2deg" },
];

const TAPES = [
  { width:130, pos:{top:"15%",  left:"2%"},         rotate:"-13deg", delay:"1.5s" },
  { width:90,  pos:{top:"72%",  right:"3%"},         rotate:"9deg",   delay:"1.7s" },
  { width:70,  pos:{top:"28%",  right:"1%"},         rotate:"-5deg",  delay:"1.9s" },
  { width:110, pos:{bottom:"8%",left:"6%"},          rotate:"6deg",   delay:"1.6s" },
];

const NAILS = [
  { pos:{top:14, left:14},   delay:"1.4s" },
  { pos:{top:14, right:14},  delay:"1.5s" },
  { pos:{bottom:14, left:14}, delay:"1.6s" },
  { pos:{bottom:14, right:14},delay:"1.7s" },
];

export default function Entry({ onEnter }) {
  const [phase, setPhase]       = useState("boot");
  const [typed, setTyped]       = useState("");
  const [glitching, setGlitching] = useState(false);
  const [decorOn, setDecorOn]   = useState(false);
  const [flash, setFlash]       = useState(false);

  // boot → logo after CRT
  useEffect(() => {
    const t = setTimeout(() => setPhase("logo"), 1000);
    return () => clearTimeout(t);
  }, []);

  // glitch on slam → type
  useEffect(() => {
    if (phase !== "logo") return;
    const tG1 = setTimeout(() => setGlitching(true),  650);
    const tG2 = setTimeout(() => setGlitching(false), 810);
    const tT  = setTimeout(() => setPhase("type"),    1150);
    return () => { clearTimeout(tG1); clearTimeout(tG2); clearTimeout(tT); };
  }, [phase]);

  // typewriter
  useEffect(() => {
    if (phase !== "type") return;
    const el = document.getElementById("jg-tagline");
    if (el) el.style.animation = "fadeup 0.4s ease forwards";
    let i = 0;
    const iv = setInterval(() => {
      if (i <= TAGLINE.length) { setTyped(TAGLINE.slice(0, i)); i++; }
      else {
        clearInterval(iv);
        setTimeout(() => {
          const sr = document.getElementById("jg-stats");
          if (sr) sr.style.animation = "fadeup 0.4s ease forwards";
          setDecorOn(true);
          // show logo nail
          const pin = document.getElementById("jg-pin");
          if (pin) pin.style.opacity = "1";
        }, 200);
        setTimeout(() => setPhase("ready"), 900);
      }
    }, 36);
    return () => clearInterval(iv);
  }, [phase]);

  useEffect(() => {
    if (phase !== "ready") return;
  }, [phase]);

  function go() {
    if (phase !== "ready") return;
    setFlash(true);
    setTimeout(() => onEnter(), 180);
  }

  return (
    <>
      <style>{css}</style>
      <div className={`exit-flash${flash ? " on" : ""}`} />

      <div className="entry-root">
        <div className="scanline" />
        <div className="crt-lines" />
        <div className="vignette" />
        <div className="flicker-layer" />

        {/* HC branding */}
        <img
          src="https://assets.hackclub.com/flag-standalone-bw.svg"
          className="hc-flag"
          alt="Hack Club"
          style={{ opacity: decorOn ? 0.7 : 0, transitionDelay: "1.8s" }}
        />
        <img
          src="https://assets.hackclub.com/icon-rounded.svg"
          className="hc-icon"
          alt="Hack Club"
          style={{ opacity: decorOn ? 0.6 : 0, transitionDelay: "2s" }}
        />

        {/* Floating tags */}
        {TAGS.map((t, i) => (
          <div key={i} className="tag" style={{
            ...t.pos, "--r": t.r,
            animation:`${t.anim} ${t.dur}s ease-in-out ${t.delay}s infinite`,
          }}>{t.text}</div>
        ))}

        {/* Tape strips */}
        {TAPES.map((t, i) => (
          <div key={i} className="tape" style={{
            width: t.width, ...t.pos,
            transform:`rotate(${t.rotate})`,
            opacity: decorOn ? 1 : 0,
            transitionDelay: t.delay,
          }} />
        ))}

        {/* Corner nails */}
        {NAILS.map((n, i) => (
          <div key={i} className="nail" style={{
            ...n.pos,
            opacity: decorOn ? 1 : 0,
            transitionDelay: n.delay,
          }} />
        ))}

        {/* Logo — tilted, nail pin on top */}
        <div className="logo-wrap">
          <div id="jg-pin" className="logo-pin" />
          <img src={logo} alt="JUGAAD" draggable={false} />
          {glitching && (
            <>
              <div className="glitch-layer" style={{animation:"glitch-a 0.11s steps(1) infinite"}}>
                <img src={logo} alt="" style={{height:"clamp(130px,24vw,260px)", filter:"hue-rotate(190deg) saturate(4)", opacity:0.75}} />
              </div>
              <div className="glitch-layer" style={{animation:"glitch-b 0.14s steps(1) infinite"}}>
                <img src={logo} alt="" style={{height:"clamp(130px,24vw,260px)", filter:"hue-rotate(90deg) saturate(3) brightness(1.5)", opacity:0.65}} />
              </div>
            </>
          )}
        </div>

        {/* Tagline */}
        <div id="jg-tagline" className="tagline">
          {typed}<span className="cursor" />
        </div>

        {/* Tagline pills */}
        <div id="jg-stats" className="stat-row">
          <div className="stat-item">Your Problem</div>
          <div className="stat-sep" />
          <div className="stat-item">Your Solution</div>
          <div className="stat-sep" />
          <div className="stat-item">Your <span>JUGAAD</span></div>
        </div>

        {/* Enter button */}
        {phase === "ready" && (
          <button
            className="enter-btn"
            style={{animation:"fadeup 0.4s ease forwards"}}
            onClick={e => { e.stopPropagation(); go(); }}
          >
            Submit Your Problem →
          </button>
        )}
      </div>
    </>
  );
}
