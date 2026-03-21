import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "/logo.svg";

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
    overflow-x:hidden; user-select:none; -webkit-user-select:none;
  }
  img { -webkit-user-drag:none; pointer-events:none; }
  button,a { pointer-events:auto; }

  body::before {
    content:''; position:fixed; inset:0;
    background-image:
      repeating-linear-gradient(0deg,transparent,transparent 28px,rgba(139,69,19,0.05) 28px,rgba(139,69,19,0.05) 29px),
      repeating-linear-gradient(90deg,transparent,transparent 28px,rgba(139,69,19,0.05) 28px,rgba(139,69,19,0.05) 29px);
    pointer-events:none; z-index:0;
  }

  .nav {
    position:fixed; top:0; left:0; right:0; z-index:100;
    display:flex; justify-content:space-between; align-items:center;
    padding:10px 40px;
    background:rgba(245,230,200,0.88); backdrop-filter:blur(8px);
    border-bottom:2px solid ${C.clay}33;
  }
  .nav-logo img { height:32px; }
  .nav-links { display:flex; gap:20px; align-items:center; }
  .nav-link { font-size:14px; color:${C.mud}; text-decoration:none; font-weight:600; transition:color 0.2s; }
  .nav-link:hover { color:${C.chai}; }
  .nav-cta {
    background:${C.mud}; color:${C.paper};
    padding:8px 20px; font-size:13px; font-weight:700;
    text-decoration:none; border:none; cursor:pointer; font-family:inherit;
    clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));
    transition:background 0.2s;
  }
  .nav-cta:hover { background:${C.chai}; }

  .nail {
    position:absolute; width:14px; height:14px; border-radius:50%;
    background:radial-gradient(circle at 35% 35%, #ddd, #555);
    border:1.5px solid #333; box-shadow:0 2px 6px rgba(0,0,0,0.4);
    z-index:5; pointer-events:none;
  }
  .nail::after { content:''; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:4px; height:4px; border-radius:50%; background:#333; }

  .tape { position:absolute; height:20px; border-radius:2px; background:${C.orange}; pointer-events:none; z-index:4; }
  .tape::before,.tape::after { content:''; position:absolute; top:0; bottom:0; width:7px; background:rgba(0,0,0,0.1); }
  .tape::before{left:0} .tape::after{right:0}

  @keyframes float-a { 0%,100%{transform:translateY(0) rotate(var(--r,0deg))} 50%{transform:translateY(-14px) rotate(var(--r,0deg))} }
  @keyframes float-b { 0%,100%{transform:translateY(0) rotate(var(--r,0deg))} 50%{transform:translateY(-10px) rotate(var(--r,0deg))} }

  .ftag { position:fixed; font-family:'SF Mono','Roboto Mono',monospace; font-size:11px; color:${C.clay}; opacity:0.15; pointer-events:none; white-space:nowrap; z-index:1; }

  .page-wrap { position:relative; z-index:2; padding:100px 24px 60px; max-width:1000px; margin:0 auto; }

  .page-title {
    font-family:'Bebas Neue',cursive;
    font-size:clamp(36px,6vw,72px);
    color:${C.mud}; letter-spacing:3px; margin-bottom:8px;
  }
  .page-sub { font-size:14px; color:${C.clay}; font-weight:500; margin-bottom:48px; line-height:1.6; }

  /* EXAMPLES GRID */
  .examples-grid { display:flex; gap:20px; flex-wrap:wrap; margin-bottom:80px; }
  .example-card {
    width:min(280px,100%); flex:1; min-width:200px;
    background:${C.paperdark};
    border:1.5px solid ${C.clay}44;
    padding:20px; position:relative;
    box-shadow:3px 4px 10px rgba(44,24,16,0.12);
    transition:transform 0.3s, box-shadow 0.3s;
  }
  .example-card:hover { box-shadow:5px 6px 16px rgba(44,24,16,0.2); }
  .example-card:nth-child(1){transform:rotate(-2.5deg)} .example-card:nth-child(1):hover{transform:rotate(0deg) scale(1.03)}
  .example-card:nth-child(2){transform:rotate(1.5deg) translateY(-6px)} .example-card:nth-child(2):hover{transform:rotate(0deg) scale(1.03)}
  .example-card:nth-child(3){transform:rotate(-1deg) translateY(4px)} .example-card:nth-child(3):hover{transform:rotate(0deg) scale(1.03)}
  .example-card:nth-child(4){transform:rotate(2.5deg) translateY(-4px)} .example-card:nth-child(4):hover{transform:rotate(0deg) scale(1.03)}
  .example-card:nth-child(5){transform:rotate(-3deg) translateY(6px)} .example-card:nth-child(5):hover{transform:rotate(0deg) scale(1.03)}
  .example-card:nth-child(6){transform:rotate(1deg) translateY(-8px)} .example-card:nth-child(6):hover{transform:rotate(0deg) scale(1.03)}
  .ex-loc { font-size:9px; letter-spacing:3px; text-transform:uppercase; color:${C.chai}; margin-bottom:8px; font-weight:700; }
  .ex-problem { font-size:13px; color:${C.mud}; font-weight:700; line-height:1.4; margin-bottom:8px; }
  .ex-solution { font-size:11px; color:${C.clay}; line-height:1.6; font-weight:500; margin-bottom:10px; }
  .ex-parts { font-size:10px; color:${C.chai}; font-weight:600; opacity:0.8; }

  /* FAQ */
  .faq-section { margin-top:80px; }
  .faq-title { font-family:'Bebas Neue',cursive; font-size:clamp(28px,4vw,52px); color:${C.mud}; letter-spacing:3px; margin-bottom:24px; }
  .faq-board { max-width:680px; position:relative; }
  .faq-item { border-bottom:1.5px solid ${C.clay}33; }
  .faq-btn {
    width:100%; background:none; border:none;
    display:flex; justify-content:space-between; align-items:center;
    padding:16px 0; cursor:pointer; font-family:inherit; text-align:left;
  }
  .faq-q { font-size:14px; color:${C.mud}; font-weight:700; }
  .faq-icon {
    width:20px; height:20px; border-radius:50%;
    background:radial-gradient(circle at 35% 35%, #ddd, #777);
    border:1px solid #444; flex-shrink:0; margin-left:12px;
    display:flex; align-items:center; justify-content:center;
    font-size:12px; color:#333; font-weight:700;
    box-shadow:0 1px 4px rgba(0,0,0,0.3); transition:transform 0.3s;
  }
  .faq-a { overflow:hidden; transition:max-height 0.4s ease; font-size:13px; color:${C.clay}; line-height:1.8; font-weight:500; }
  .faq-a-inner { padding-bottom:16px; }

  footer { position:relative; z-index:2; padding:20px 40px; display:flex; justify-content:space-between; align-items:center; border-top:1.5px solid ${C.clay}33; font-size:11px; color:${C.clay}; font-weight:500; letter-spacing:1px; }
  footer a { color:${C.chai}; text-decoration:none; }

  @media(max-width:768px){
    .nav{padding:10px 20px;}
    .nav-links a:not(.nav-cta){display:none;}
    footer{flex-direction:column;gap:8px;text-align:center;}
    .page-wrap{padding:80px 16px 40px;}
  }
`;

const FTAGS = [
  { text:"<div>",       top:"12%", left:"2%",  r:"-5deg", a:"float-a", d:4   },
  { text:"</examples>", top:"8%",  right:"3%", r:"4deg",  a:"float-b", d:4.5 },
  { text:"<problem />", top:"55%", left:"1%",  r:"-3deg", a:"float-a", d:5   },
  { text:"</faq>",      top:"72%", right:"2%", r:"6deg",  a:"float-b", d:3.8 },
];

const EXAMPLES = [
  { loc:"Patna, Bihar",         problem:"Streets flood every monsoon with zero warning",        solution:"ESP32 + ultrasonic + LoRa mesh → real-time SMS flood alerts",        parts:"ESP32, HC-SR04, LoRa, GSM, IP67 enclosure" },
  { loc:"Small Town, UP",       problem:"Stray cattle on highways cause fatal accidents at night", solution:"IR + LoRa nodes warn drivers 500m in advance",                    parts:"IR sensors, LoRa modules, LED matrix, LiPo" },
  { loc:"Coastal Kerala",       problem:"Fishermen have no real-time weather data before going to sea", solution:"Solar-powered LoRa buoy broadcasting wind + pressure",        parts:"BME280, anemometer, LoRa, solar panel, IP67" },
  { loc:"Industrial Gujarat",   problem:"Nobody measures air quality near factories — kids getting sick", solution:"PM2.5 + VOC sensor mesh with public data dashboard",         parts:"PMS5003, SGP30, ESP32, OLED" },
  { loc:"Lagos, Nigeria",       problem:"Borehole pumps fail silently — villages run dry for days", solution:"ESP32 + flow sensor + GSM → SMS alert on pump failure",          parts:"ESP32, YF-S201, SIM800L, waterproof enclosure" },
  { loc:"Nairobi, Kenya",       problem:"No soil moisture data — farmers overwater or lose crops", solution:"Capacitive sensor array + LoRa + farm dashboard",                parts:"Capacitive sensor, ESP32, LoRa, solar" },
];

const FAQS = [
  { q:"Who can apply?",                        a:"Any Hack Clubber aged 13–18. You don't need to be in a physical club — just be part of the Hack Club community." },
  { q:"How much grant money can I get?",       a:"Depends on your BOM. We fund what you actually need. ESP32 + sensors to solve a real problem? Great. Raspberry Pi 5 to blink an LED? We'll ask you to revise." },
  { q:"What if my submission gets rejected?",  a:"We tell you exactly what's missing. Fix it and resubmit. A rejection isn't the end — it's feedback." },
  { q:"Does the problem have to be from my city?", a:"It must be a real problem you personally witness. If you live there and see it — it counts. No armchair submissions." },
  { q:"What counts as 'deployed'?",            a:"Device physically at the problem location — not on your desk. Photo in situ + video demonstrating it working, both required." },
  { q:"Do I need a custom PCB?",               a:"Not necessarily. Perfboard or a well-documented build is fine. But schematics and docs must be complete and clean." },
  { q:"Can I work in a team?",                 a:"Yes. One submission per team, one grant per project. List all members in your README." },
];

function Nail({ style = {} }) { return <div className="nail" style={style} />; }
function Tape({ width = 80, style = {} }) { return <div className="tape" style={{ width, ...style }} />; }
function FadeIn({ children, style = {} }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)", transition: "opacity 0.6s ease, transform 0.6s ease", ...style }}>
      {children}
    </div>
  );
}

export default function Examples() {
  const [open, setOpen] = useState(null);

  return (
    <>
      <style>{css}</style>

      {FTAGS.map((t, i) => (
        <div key={i} className="ftag" style={{ top: t.top, left: t.left, right: t.right, "--r": t.r, animation: `${t.a} ${t.d}s ease-in-out ${i * 0.3}s infinite` }}>
          {t.text}
        </div>
      ))}

      <nav className="nav">
        <Link to="/" className="nav-logo"><img src={logo} alt="Jugaad" /></Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">← Home</Link>
          <a href="#faq" className="nav-link">FAQ</a>
          <a href="https://airtable.com" className="nav-cta">Submit →</a>
        </div>
      </nav>

      <div className="page-wrap">

        {/* EXAMPLES */}
        <FadeIn>
          <div className="page-title">Problems Worth Solving</div>
          <p className="page-sub">These aren't hypotheticals. These are real problems from real places.<br />What's broken in yours?</p>
          <div className="examples-grid">
            {EXAMPLES.map((c, i) => (
              <div key={i} className="example-card">
                <Nail style={{ position: "absolute", top: -7, left: "50%", transform: "translateX(-50%)" }} />
                <div className="ex-loc">📍 {c.loc}</div>
                <div className="ex-problem">{c.problem}</div>
                <div className="ex-solution">{c.solution}</div>
                <div className="ex-parts">→ {c.parts}</div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* FAQ */}
        <FadeIn>
          <div className="faq-section" id="faq">
            <div className="faq-title">Common Questions</div>
            <div className="faq-board">
              <Nail style={{ position: "absolute", top: -8, left: -8 }} />
              <Nail style={{ position: "absolute", top: -8, right: -8 }} />
              <Tape width={90} style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%) rotate(-2deg)" }} />
              {FAQS.map((f, i) => (
                <div key={i} className="faq-item">
                  <button className="faq-btn" onClick={() => setOpen(open === i ? null : i)}>
                    <span className="faq-q">{f.q}</span>
                    <div className="faq-icon" style={{ transform: open === i ? "rotate(45deg)" : "none" }}>+</div>
                  </button>
                  <div className="faq-a" style={{ maxHeight: open === i ? 200 : 0 }}>
                    <div className="faq-a-inner">{f.a}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

      </div>

      <footer>
        <span>Jugaad · A Hack Club YSWS Program</span>
        <span>jugaad.dino.icu</span>
        <a href="https://hackclub.com">hackclub.com →</a>
      </footer>
    </>
  );
}