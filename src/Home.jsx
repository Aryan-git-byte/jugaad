import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../public/logo.svg";

const C = {
  mud: "#2C1810", clay: "#8B4513", dust: "#C4956A",
  chai: "#D4892A", paper: "#F5E6C8", paperdark: "#E8D5A3",
  smoke: "#1A1208", ink: "#0D0805", orange: "#ff8c37", red: "#ec3750",
};

const css = `
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior:smooth; }
  body {
    background:${C.paper};
    font-family:'Fredoka','Nunito',system-ui,sans-serif;
    overflow-x:hidden;
    user-select:none;
    -webkit-user-select:none;
  }
  img { -webkit-user-drag:none; pointer-events:none; }
  button,a { pointer-events:auto; }

  body::before {
    content:'';
    position:fixed; inset:0;
    background-image:
      repeating-linear-gradient(0deg,transparent,transparent 28px,rgba(139,69,19,0.05) 28px,rgba(139,69,19,0.05) 29px),
      repeating-linear-gradient(90deg,transparent,transparent 28px,rgba(139,69,19,0.05) 28px,rgba(139,69,19,0.05) 29px);
    pointer-events:none; z-index:0;
  }

  /* NAV */
  .nav {
    position:fixed; top:0; left:0; right:0; z-index:100;
    display:flex; justify-content:space-between; align-items:center;
    padding:10px 40px;
    background:rgba(245,230,200,0.88);
    backdrop-filter:blur(8px);
    border-bottom:2px solid ${C.clay}33;
  }
  .nav-logo img { height:32px; }
  .nav-links { display:flex; gap:20px; align-items:center; }
  .nav-link {
    font-size:14px; color:${C.mud}; text-decoration:none;
    font-weight:600; transition:color 0.2s;
  }
  .nav-link:hover { color:${C.chai}; }
  .nav-cta {
    background:${C.mud}; color:${C.paper};
    padding:8px 20px; font-size:13px; font-weight:700;
    text-decoration:none; border:none; cursor:pointer; font-family:inherit;
    clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));
    transition:background 0.2s;
  }
  .nav-cta:hover { background:${C.chai}; }

  /* NAIL */
  .nail {
    position:absolute;
    width:14px; height:14px; border-radius:50%;
    background:radial-gradient(circle at 35% 35%, #ddd, #555);
    border:1.5px solid #333;
    box-shadow:0 2px 6px rgba(0,0,0,0.4);
    z-index:5; pointer-events:none;
  }
  .nail::after {
    content:''; position:absolute; top:50%; left:50%;
    transform:translate(-50%,-50%);
    width:4px; height:4px; border-radius:50%; background:#333;
  }

  /* TAPE */
  .tape {
    position:absolute; height:20px; border-radius:2px;
    background:${C.orange}; pointer-events:none; z-index:4;
  }
  .tape::before,.tape::after {
    content:''; position:absolute; top:0; bottom:0; width:7px;
    background:rgba(0,0,0,0.1);
  }
  .tape::before{left:0} .tape::after{right:0}

  /* FLOATY TAGS */
  .ftag {
    position:fixed;
    font-family:'SF Mono','Roboto Mono',monospace;
    font-size:11px; color:${C.clay};
    opacity:0.18; pointer-events:none; white-space:nowrap;
    z-index:1;
  }

  @keyframes float-a { 0%,100%{transform:translateY(0) rotate(var(--r,0deg))} 50%{transform:translateY(-14px) rotate(var(--r,0deg))} }
  @keyframes float-b { 0%,100%{transform:translateY(0) rotate(var(--r,0deg))} 50%{transform:translateY(-10px) rotate(var(--r,0deg))} }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }
  @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(6px)} }
  @keyframes fadein { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

  /* SECTIONS */
  section { position:relative; z-index:2; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:100px 24px 60px; }

  /* HERO */
  .hero-inner { display:flex; flex-direction:column; align-items:center; gap:0; }
  .hero-logo-wrap { position:relative; transform:rotate(-2deg); }
  .hero-logo-wrap img { height:clamp(100px,18vw,200px); display:block; }

  .hero-tagline-wrap { position:relative; margin-top:16px; }
  .hero-tagline {
    background:${C.mud}; color:${C.paper};
    padding:10px 28px;
    font-family:'Bebas Neue',cursive;
    font-size:clamp(16px,2.8vw,26px);
    letter-spacing:4px; transform:rotate(1deg); display:block;
  }

  .hero-badge {
    margin-top:18px; display:flex; gap:8px; align-items:center;
    font-size:11px; letter-spacing:3px; text-transform:uppercase;
    color:${C.clay}; font-weight:600;
  }
  .hero-badge-dot {
    width:6px; height:6px; border-radius:50%; background:${C.red};
    animation:pulse 1.5s infinite;
  }

  .scroll-hint {
    position:absolute; bottom:24px; left:50%;
    transform:translateX(-50%);
    font-size:10px; letter-spacing:3px; text-transform:uppercase;
    color:${C.clay}; opacity:0.45;
    animation:bounce 2.2s ease-in-out infinite;
  }

  /* WHAT */
  .what-card {
    max-width:680px; width:100%;
    background:${C.paper};
    border:1.5px solid ${C.clay}44;
    padding:36px 40px;
    position:relative;
    box-shadow:4px 5px 14px rgba(44,24,16,0.15);
    transform:rotate(-1.5deg);
  }
  .what-card h2 {
    font-family:'Bebas Neue',cursive;
    font-size:clamp(36px,6vw,64px);
    color:${C.mud}; letter-spacing:2px; line-height:1; margin-bottom:16px;
  }
  .what-card h2 em { color:${C.chai}; font-style:normal; }
  .what-card p { font-size:15px; line-height:1.8; color:${C.mud}; font-weight:500; margin-bottom:12px; }
  .what-quote {
    margin-top:20px;
    background:${C.chai}18; border-left:3px solid ${C.chai};
    padding:14px 16px; font-size:13px; color:${C.mud}; font-weight:600; line-height:1.7;
  }

  /* HOW */
  .how-inner { display:flex; flex-direction:column; align-items:center; width:100%; }
  .how-title {
    font-family:'Bebas Neue',cursive;
    font-size:clamp(28px,4vw,52px);
    color:${C.mud}; letter-spacing:3px; margin-bottom:32px;
  }
  .steps-row { display:flex; gap:20px; flex-wrap:wrap; justify-content:center; }
  .step-card {
    width:min(220px,80vw);
    background:${C.paper};
    border:1.5px solid ${C.clay}44;
    padding:22px; position:relative;
    box-shadow:3px 4px 10px rgba(44,24,16,0.13);
  }
  .step-card:nth-child(1){transform:rotate(-3deg)}
  .step-card:nth-child(2){transform:rotate(1.5deg) translateY(-10px)}
  .step-card:nth-child(3){transform:rotate(-2deg)}
  .step-num { font-family:'Bebas Neue',cursive; font-size:52px; color:${C.chai}; opacity:0.3; position:absolute; top:8px; right:12px; line-height:1; }
  .step-icon { font-size:28px; margin-bottom:10px; }
  .step-title { font-family:'Bebas Neue',cursive; font-size:24px; color:${C.mud}; margin-bottom:8px; letter-spacing:1px; }
  .step-desc { font-size:12px; line-height:1.7; color:${C.clay}; font-weight:500; }
  .step-tag { display:inline-block; margin-top:12px; font-size:9px; letter-spacing:2px; text-transform:uppercase; padding:3px 8px; border:1px solid ${C.chai}; color:${C.chai}; }

  /* REQUIREMENTS */
  .req-row { display:flex; gap:20px; flex-wrap:wrap; justify-content:center; }
  .req-card {
    width:min(300px,88vw);
    background:${C.paper};
    border:1.5px solid ${C.clay}44;
    padding:26px; position:relative;
    box-shadow:3px 4px 10px rgba(44,24,16,0.13);
  }
  .req-card:nth-child(1){transform:rotate(-2deg)}
  .req-card:nth-child(2){transform:rotate(1.5deg) translateY(-8px)}
  .req-title { font-family:'Bebas Neue',cursive; font-size:20px; letter-spacing:2px; margin-bottom:14px; }
  .req-item { display:flex; gap:10px; font-size:12px; line-height:1.6; color:${C.mud}; margin-bottom:10px; font-weight:500; }
  .req-arrow { color:${C.chai}; flex-shrink:0; font-weight:700; }
  .req-note { margin-top:14px; background:${C.chai}15; border-left:3px solid ${C.chai}; padding:10px 12px; font-size:11px; line-height:1.7; color:${C.mud}; font-weight:600; }

  /* SUBMIT */
  .submit-card {
    max-width:560px; width:100%;
    background:${C.mud}; padding:48px 40px;
    position:relative; transform:rotate(-1deg);
    text-align:center;
    box-shadow:6px 8px 20px rgba(44,24,16,0.3);
  }
  .submit-card h2 { font-family:'Bebas Neue',cursive; font-size:clamp(40px,7vw,80px); color:${C.paper}; line-height:0.95; margin-bottom:16px; letter-spacing:2px; }
  .submit-card h2 em { color:${C.orange}; font-style:normal; }
  .submit-card p { font-size:13px; color:${C.dust}; line-height:1.8; margin-bottom:32px; font-weight:500; }
  .submit-btn {
    display:inline-block; background:${C.orange}; color:${C.ink};
    padding:16px 44px; font-family:'Bebas Neue',cursive;
    font-size:22px; letter-spacing:3px; text-decoration:none;
    clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px));
    transition:all 0.2s; border:none; cursor:pointer;
  }
  .submit-btn:hover { background:${C.chai}; transform:translate(-3px,-3px); box-shadow:5px 5px 0 rgba(0,0,0,0.3); }
  .submit-note { margin-top:20px; font-size:10px; letter-spacing:2px; text-transform:uppercase; color:${C.dust}; opacity:0.5; }

  /* FOOTER */
  footer {
    position:relative; z-index:2;
    padding:20px 40px; display:flex; justify-content:space-between; align-items:center;
    border-top:1.5px solid ${C.clay}33;
    font-size:11px; color:${C.clay}; font-weight:500; letter-spacing:1px;
  }
  footer a { color:${C.chai}; text-decoration:none; }
  footer a:hover { color:${C.mud}; }

  @media(max-width:768px){
    .nav{padding:10px 20px;}
    .nav-links a:not(.nav-cta){display:none;}
    .steps-row{flex-direction:column;align-items:center;}
    .req-row{flex-direction:column;align-items:center;}
    footer{flex-direction:column;gap:8px;text-align:center;}
    section{padding:80px 16px 40px;}
  }
`;

const FTAGS = [
  { text:"<div>",       top:"12%", left:"3%",  r:"-5deg", a:"float-a", d:4   },
  { text:"</fix>",      top:"8%",  right:"4%", r:"4deg",  a:"float-b", d:4.5 },
  { text:"<problem />", top:"55%", left:"2%",  r:"-3deg", a:"float-a", d:5   },
  { text:"</solution>", top:"70%", right:"3%", r:"6deg",  a:"float-b", d:3.8 },
  { text:"<jugaad>",    top:"35%", right:"2%", r:"-7deg", a:"float-a", d:4.2 },
  { text:"</grant>",    top:"82%", left:"4%",  r:"3deg",  a:"float-b", d:4.8 },
  { text:"<build />",   top:"25%", left:"5%",  r:"-4deg", a:"float-a", d:3.6 },
  { text:"<deploy>",    top:"88%", right:"5%", r:"5deg",  a:"float-b", d:4.3 },
];

function Nail({ style = {} }) {
  return <div className="nail" style={style} />;
}
function Tape({ width = 80, style = {} }) {
  return <div className="tape" style={{ width, ...style }} />;
}
function FadeIn({ children, style = {} }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)", transition: "opacity 0.6s ease, transform 0.6s ease", ...style }}>
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <style>{css}</style>

      {/* Floating tags */}
      {FTAGS.map((t, i) => (
        <div key={i} className="ftag" style={{ top: t.top, left: t.left, right: t.right, "--r": t.r, animation: `${t.a} ${t.d}s ease-in-out ${i * 0.3}s infinite` }}>
          {t.text}
        </div>
      ))}

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="nav-logo"><img src={logo} alt="Jugaad" /></a>
        <div className="nav-links">
          <Link to="/examples" className="nav-link">Examples</Link>
          <Link to="/examples#faq" className="nav-link">FAQ</Link>
          <a href="#submit" className="nav-cta">Submit →</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section>
        <FadeIn>
          <div className="hero-inner">
            <div className="hero-logo-wrap">
              <Nail style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)" }} />
              <img src={logo} alt="JUGAAD" />
            </div>
            <div className="hero-tagline-wrap">
              <Tape width={80} style={{ position: "absolute", top: -9, left: 16, transform: "rotate(-7deg)" }} />
              <span className="hero-tagline">Your city is broken. Build the fix.</span>
            </div>
            <div className="hero-badge">
              <div className="hero-badge-dot" />
              A Hack Club YSWS Program
            </div>
          </div>
        </FadeIn>
        <div className="scroll-hint">scroll to explore ↓</div>
        <img src="https://assets.hackclub.com/flag-standalone-bw.svg" alt="Hack Club" style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", height: 52, opacity: 0.75, pointerEvents: "none" }} />
      </section>

      {/* ── WHAT IS JUGAAD ── */}
      <section>
        <FadeIn>
          <div className="what-card">
            <Nail style={{ position: "absolute", top: -8, left: -8 }} />
            <Nail style={{ position: "absolute", top: -8, right: -8 }} />
            <Tape width={100} style={{ position: "absolute", top: -10, left: 40, transform: "rotate(-4deg)" }} />
            <h2>Not a <em>hack.</em><br />A real fix.</h2>
            <p>Jugaad (जुगाड़) is the philosophy of frugal, resourceful innovation. When the system fails you, you build around it — not with infinite resources, but with what you have, where you are.</p>
            <p>This program flips the script: instead of building for a portfolio, you build because your street needs it. Your school needs it. Your city needs it.</p>
            <div className="what-quote">"Where there is a problem, there is also a solution."</div>
          </div>
        </FadeIn>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section>
        <FadeIn>
          <div className="how-inner">
            <div className="how-title">How Jugaad Works</div>
            <div className="steps-row">
              {[
                { num:"01", icon:"🔍", title:"Identify", tag:"You Submit", desc:"Find a real problem in your locality. Document it with photos. Submit problem statement + proposed solution + full repo with schematics, PCB, firmware, and photos of the problem." },
                { num:"02", icon:"⚖️", title:"Review",   tag:"We Evaluate", desc:"We go through your submission. Incomplete docs or vague problems get rejected with feedback. Solid? We approve and evaluate your BOM. No overbuilding." },
                { num:"03", icon:"💸", title:"Grant",    tag:"You Build", desc:"Grant approved based on BOM. Source parts locally — faster than shipping. Build it, deploy it where the problem lives, then submit photo + video proof." },
              ].map((s, i) => (
                <div key={s.num} className="step-card">
                  <Nail style={{ position: "absolute", top: -7, left: "50%", transform: "translateX(-50%)" }} />
                  <Tape width={60} style={{ position: "absolute", top: -9, left: "50%", transform: `translateX(-50%) rotate(${i % 2 === 0 ? -8 : 6}deg)` }} />
                  <div className="step-num">{s.num}</div>
                  <div className="step-icon">{s.icon}</div>
                  <div className="step-title">{s.title}</div>
                  <p className="step-desc">{s.desc}</p>
                  <div className="step-tag">{s.tag}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── REQUIREMENTS ── */}
      <section>
        <FadeIn>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, width: "100%" }}>
            <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "clamp(28px,4vw,48px)", color: C.mud, letterSpacing: 3 }}>What You Need to Ship</div>
            <div className="req-row">
              <div className="req-card">
                <Nail style={{ position: "absolute", top: -7, left: 20 }} />
                <Tape width={80} style={{ position: "absolute", top: -9, left: 14, transform: "rotate(-4deg)" }} />
                <div className="req-title" style={{ color: C.chai }}>Before Review — Repo Must Have</div>
                {["Schematic files", "PCB layout files", "Gerber files", "CAD files (if applicable)", "Firmware / source code", "README.md", "Photos of people facing the problem"].map((item, i) => (
                  <div key={i} className="req-item"><span className="req-arrow">→</span><span>{item}</span></div>
                ))}
              </div>
              <div className="req-card">
                <Nail style={{ position: "absolute", top: -7, right: 20 }} />
                <Tape width={80} style={{ position: "absolute", top: -9, right: 14, transform: "rotate(4deg)" }} />
                <div className="req-title" style={{ color: C.mud }}>After Building — Proof</div>
                {["Photo of deployed device at location", "Video explaining + demonstrating live"].map((item, i) => (
                  <div key={i} className="req-item"><span className="req-arrow" style={{ color: C.mud }}>✓</span><span>{item}</span></div>
                ))}
                <div className="req-note">Grant calculated from your approved BOM — we fund what you actually need, nothing more.</div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── SUBMIT ── */}
      <section id="submit">
        <FadeIn>
          <div className="submit-card">
            <Nail style={{ position: "absolute", top: -8, left: -8 }} />
            <Nail style={{ position: "absolute", top: -8, right: -8 }} />
            <Tape width={90} style={{ position: "absolute", top: -10, right: 40, transform: "rotate(5deg)" }} />
            <h2>Fix Something<br /><em>Real.</em></h2>
            <p>Tell us the problem. Show us your solution.<br />Get funded. Build it. Deploy it.</p>
            <button className="submit-btn" style={{opacity:0.6, cursor:"not-allowed"}}>Coming Soon</button>
            <p className="submit-note">A Hack Club YSWS · Open to ages 13–18 worldwide</p>
          </div>
        </FadeIn>
      </section>

      {/* FOOTER */}
      <footer>
        <span>Jugaad · A Hack Club YSWS Program</span>
        <span>jugaad.dino.icu</span>
        <a href="https://hackclub.com">hackclub.com →</a>
      </footer>
    </>
  );
}