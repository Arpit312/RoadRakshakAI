import React, { useState, useEffect, useRef } from "react";

// ── GLOBAL STYLES & THEME ─────────────────────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
  
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  html, body, #root {
    width: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }

  :root {
    /* Light Theme */
    --bg: #F8FAFC; --bg2: #E2E8F0; 
    --surface: #FFFFFF; --surface2: #F8FAFC;
    --border: #E2E8F0; --border2: #CBD5E1;
    --text: #0F172A; --text2: #334155; 
    --muted: #64748B; --muted2: #94A3B8;
    
    /* Core Colors */
    --blue: #2563EB; --blue2: #3B82F6; --blue-lt: rgba(37, 99, 235, 0.1); --blue-md: rgba(37, 99, 235, 0.2);
    --red: #EF4444; --red-lt: rgba(239, 68, 68, 0.1);
    --orange: #F97316; --orange-lt: rgba(249, 115, 22, 0.1);
    --yellow: #F59E0B; --yellow-lt: rgba(245, 158, 11, 0.1);
    --green: #10B981; --green-lt: rgba(16, 185, 129, 0.1);
    
    --radius: 12px;
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    --shadow-md: 0 10px 20px rgba(0, 0, 0, 0.08);
  }

  .theme-wrapper[data-theme="dark"] {
    /* Pure Black Dark Theme Overrides */
    --bg: #000000; --bg2: #050505; 
    --surface: #121212; --surface2: #18181B;
    --border: #27272A; --border2: #3F3F46;
    --text: #F8FAFC; --text2: #E2E8F0; 
    --muted: #A1A1AA; --muted2: #71717A;
    --navy: #FFFFFF; --navy2: #F1F5F9;
    
    /* Neon glow adjustments for dark mode */
    --blue: #3B82F6; --blue2: #60A5FA;
    --blue-lt: rgba(59, 130, 246, 0.15); --blue-md: rgba(59, 130, 246, 0.3);
    
    --shadow: 0 4px 20px rgba(0,0,0,0.6);
    --shadow-md: 0 8px 30px rgba(0,0,0,0.8);
  }

  .theme-wrapper[data-theme="dark"] .ambient-bg {
    /* Hide ambient glow to keep background fully black in dark mode */
    display: none;
  }

  body {
    background-color: var(--bg);
    color: var(--text);
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  .theme-wrapper { 
    background-color: var(--bg); 
    color: var(--text); 
    font-family: 'Inter', sans-serif; 
    min-height: 100vh; 
    width: 100%;
    overflow-x: hidden; 
    transition: background-color 0.3s ease, color 0.3s ease; 
    position: relative;
  }

  h1,h2,h3,h4,h5 { font-family: 'Plus Jakarta Sans', sans-serif; color: var(--text); transition: color 0.3s ease; letter-spacing: -0.02em; }
  
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg2); }
  ::-webkit-scrollbar-thumb { background: var(--blue); border-radius: 3px; }
  
  input, select, textarea { color: var(--text) !important; background: var(--surface2) !important; border: 1px solid var(--border) !important; transition: all 0.2s ease; border-radius: 8px !important; }
  input::placeholder, textarea::placeholder { color: var(--muted) !important; }
  input:focus, select:focus, textarea:focus { border-color: var(--blue) !important; box-shadow: 0 0 0 3px var(--blue-lt) !important; outline: none; }
  
  /* Smooth Sliding Animations */
  @keyframes slideUpFade { 
    from { opacity: 0; transform: translateY(40px); } 
    to { opacity: 1; transform: translateY(0); } 
  }
  .animate-slide { animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  
  @keyframes fadeUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
  @keyframes typing { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }

  .text-gradient {
    background: linear-gradient(135deg, var(--blue), #8B5CF6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* Subtle Ambient Glow */
  .ambient-bg {
    position: fixed; inset: 0; z-index: -1;
    background: radial-gradient(circle at 50% -20%, rgba(59, 130, 246, 0.08) 0%, transparent 60%);
    pointer-events: none;
  }
`;

// ── GEMINI API CONFIGURATION ──────────────────────────────────────────────────
const apiKey = ""; // API key is automatically provided by the runtime environment

// Fallback simulated response if API fails
const simulateResponse = (text) => {
  const lowerInput = text.toLowerCase();
  if (lowerInput.includes("report") || lowerInput.includes("pothole") || lowerInput.includes("damage")) {
    return "To report a road issue, navigate to the 'Report' tab, upload a clear photo of the damage, and fill in the location details. Our AI will auto-assess the severity!";
  } else if (lowerInput.includes("track") || lowerInput.includes("status")) {
    return "You can track your complaint by going to the 'Track' tab and entering your unique Complaint ID (e.g., RR-2024-001).";
  } else if (lowerInput.includes("emergency") || lowerInput.includes("contact") || lowerInput.includes("112")) {
    return "If there is an immediate life-threatening emergency, please dial 112 (National Emergency Number) or 108. RoadRakshak is for infrastructure reporting.";
  } else if (lowerInput.includes("score") || lowerInput.includes("impact")) {
    return "The Emergency Impact Score is generated by our AI based on the image severity, road type, and proximity to crucial facilities (like hospitals).";
  } else if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey")) {
    return "Hello! I am the RoadRakshak AI Assistant. How can I help you make our roads safer today?";
  } else if (lowerInput.includes("map") || lowerInput.includes("radar") || lowerInput.includes("location")) {
    return "The 'Map' or 'Radar' tab provides a live, geospatial view of all active infrastructure threats within your region.";
  } else if (lowerInput.includes("analytics") || lowerInput.includes("stats") || lowerInput.includes("dashboard")) {
    return "Our Analytics dashboard gives government officials a bird's-eye view of threat distributions, resolution rates, and vulnerable sectors.";
  } else if (lowerInput.includes("who") || lowerInput.includes("about") || lowerInput.includes("mission")) {
    return "RoadRakshak is a smart civic infrastructure platform. We bridge the gap between citizens and municipal authorities using AI-driven reporting.";
  } else if (lowerInput.includes("login") || lowerInput.includes("auth") || lowerInput.includes("account")) {
    return "You can log in as a Citizen to report issues, or as an Admin (Government Official) to manage and resolve incoming infrastructure threats.";
  } else if (lowerInput.includes("help") || lowerInput.includes("support") || lowerInput.includes("guide")) {
    return "I'm here to help! You can ask me how to report an issue, track a complaint, or understand our AI scoring system.";
  } else if (lowerInput.includes("thank")) {
    return "You're very welcome! Let me know if you need anything else.";
  } else if (lowerInput.includes("bye") || lowerInput.includes("goodbye")) {
    return "Goodbye! Stay safe on the roads.";
  } else if (lowerInput.includes("authority") || lowerInput.includes("government") || lowerInput.includes("admin")) {
    return "Government officials use our Command Center to view prioritized tasks, dispatch teams, and update resolution statuses in real-time.";
  } else if (lowerInput.includes("privacy") || lowerInput.includes("security")) {
    return "We take your privacy seriously. Your reports are securely logged, and personal data is encrypted and only shared with verified municipal authorities.";
  } else if (lowerInput.includes("language") || lowerInput.includes("hindi")) {
    return "Currently, I operate primarily in English, but we are working on adding multi-language support (including Hindi) very soon!";
  }
  return "I'm still learning! You can ask me how to report an issue, track a complaint, or learn about the RoadRakshak platform.";
}

const callGeminiAPI = async (prompt) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const payload = { contents: [{ parts: [{ text: prompt }] }], systemInstruction: { parts: [{ text: "You are RoadRakshak AI, an intelligent, highly responsive, and concise assistant for a civic infrastructure platform. Provide clear, supportive, and professional answers regarding road maintenance, reporting issues, tracking resolutions, and using the platform's AI triage and spatial radar systems." }] } };
  const delays = [1000, 2000];
  
  if (!apiKey) {
    // Automatically fallback if no API key is present
    return new Promise(resolve => setTimeout(() => resolve(simulateResponse(prompt)), 1000));
  }

  for (let i = 0; i < 2; i++) {
    try {
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || simulateResponse(prompt);
    } catch (err) {
      if (i === 1) return simulateResponse(prompt);
      await new Promise(r => setTimeout(r, delays[i]));
    }
  }
};

// ── MOCK DATA ─────────────────────────────────────────────────────────────────
const MOCK_COMPLAINTS = [
  { id:"RR-2024-001", village:"Rampur",    issue:"Pothole",        severity:"Critical", score:92, status:"Pending",     img:"🕳️", date:"2024-01-15", desc:"Large potholes near school entrance causing daily accidents", author: "Ramesh K." },
  { id:"RR-2024-002", village:"Shivpur",   issue:"Waterlogging",   severity:"High",     score:75, status:"In Progress", img:"💧", date:"2024-01-16", desc:"Road flooded after rain, ambulance route blocked for 3 days", author: "Sunita D." },
  { id:"RR-2024-003", village:"Kothi",     issue:"Cracked Road",   severity:"Medium",   score:55, status:"Assigned",    img:"🛣️", date:"2024-01-17", desc:"Multiple cracks spreading across 200m stretch near main chowk", author: "Anil S." },
  { id:"RR-2024-004", village:"Berasia",   issue:"Road Blockage",  severity:"Critical", score:88, status:"Pending",     img:"🚧", date:"2024-01-18", desc:"Landslide debris blocking main village route since last week", author: "Pooja V." },
  { id:"RR-2024-005", village:"Mandideep", issue:"Damaged Culvert",severity:"High",     score:70, status:"Resolved",    img:"🌉", date:"2024-01-19", desc:"Culvert collapsed near fields, farmers unable to transport goods", author: "Amit M." },
];

const SEV_COL = { Critical:"var(--red)", High:"var(--orange)", Medium:"var(--yellow)", Low:"var(--green)" };
const SEV_BG  = { Critical:"var(--red-lt)", High:"var(--orange-lt)", Medium:"var(--yellow-lt)", Low:"var(--green-lt)" };
const STA_COL = { Pending:"var(--orange)", "In Progress":"var(--blue2)", Assigned:"#8B5CF6", Resolved:"var(--green)" };
const STA_BG  = { Pending:"var(--orange-lt)", "In Progress":"var(--blue-lt)", Assigned:"rgba(139, 92, 246, 0.15)", Resolved:"var(--green-lt)" };

// ── UI ATOMS ──────────────────────────────────────────────────────────────────
const Btn = ({ children, onClick, variant="primary", style={}, disabled=false, type="button" }) => {
  const base = { fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:"0.875rem",
    padding:"12px 24px", borderRadius:"8px", border:"1px solid transparent", cursor:disabled?"not-allowed":"pointer",
    transition:"all .2s ease", opacity:disabled?.5:1, display:"inline-flex", alignItems:"center", gap:"8px", justifyContent: "center" };
  const v = {
    primary:   { background:"var(--text)", color:"var(--bg)", boxShadow:"0 4px 14px rgba(0,0,0,0.1)" },
    secondary: { background:"transparent", color:"var(--text)", border:"1px solid var(--border)" },
    danger:    { background:"var(--red)", color:"#fff" },
    demo:      { background:"var(--surface2)", color:"var(--text)", border:"1px dashed var(--border2)" },
  };
  return <button type={type} onClick={onClick} disabled={disabled} style={{...base,...v[variant],...style}}
    onMouseEnter={e=>{ if(!disabled) e.currentTarget.style.transform="translateY(-2px)"; }}
    onMouseLeave={e=>{ e.currentTarget.style.transform=""; }}
  >{children}</button>;
};

const Card = ({ children, style={}, hover=false }) => (
  <div style={{ background:"var(--surface)", borderRadius:"var(--radius)",
    border:"1px solid var(--border)", padding:"24px", boxShadow:"var(--shadow)", transition:"all 0.3s ease", ...style }}
    onMouseEnter={e=>{ if(hover) { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="var(--shadow-md)"; e.currentTarget.style.borderColor="var(--blue-md)"; } }}
    onMouseLeave={e=>{ if(hover) { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="var(--shadow)"; e.currentTarget.style.borderColor="var(--border)"; } }}
  >
    {children}
  </div>
);

const Badge = ({ label, color, bg }) => (
  <span style={{ background:bg, color, border:`1px solid ${color}30`, borderRadius:"6px",
    padding:"4px 10px", fontSize:"0.7rem", fontWeight:700, fontFamily:"'Plus Jakarta Sans',sans-serif",
    whiteSpace:"nowrap", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
);

const ScoreRing = ({ score, size=80 }) => {
  const col = score>=80?"var(--red)":score>=60?"var(--orange)":score>=40?"var(--yellow)":"var(--green)";
  const bg  = score>=80?"var(--red-lt)":score>=60?"var(--orange-lt)":score>=40?"var(--yellow-lt)":"var(--green-lt)";
  const r=(size/2)-8, circ=2*Math.PI*r, dash=(score/100)*circ;
  return (
    <div style={{ position:"relative", width:size, height:size }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={bg} strokeWidth="8"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition:"stroke-dasharray 1.2s ease" }}/>
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontSize:size*.25+"px", fontWeight:800, fontFamily:"'Plus Jakarta Sans',sans-serif", color:col }}>{score}</span>
      </div>
    </div>
  );
};

const SocialLink = ({ children }) => (
  <a href="#" style={{ color: "var(--muted)", transition: "all 0.2s ease", display: "flex", alignItems: "center" }}
     onMouseEnter={e => { e.currentTarget.style.color = "var(--blue)"; e.currentTarget.style.transform = "scale(1.15)"; }}
     onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.transform = "scale(1)"; }}>
    {children}
  </a>
);

const SocialIconsBlock = () => (
  <>
    <SocialLink>
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
    </SocialLink>
    <SocialLink>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>
    </SocialLink>
    <SocialLink>
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
    </SocialLink>
  </>
);

const NavIcon = ({ name }) => {
  switch(name) {
    case 'home': return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
    case 'report': return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>;
    case 'track': return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
    case 'map': return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>;
    case 'about': return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
    case 'admin': return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="21"></line></svg>;
    case 'analytics': return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
    default: return null;
  }
};

// ── SPLASH INTRO ──────────────────────────────────────────────────────────────
const IntroScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.5s ease' }}>
      <div style={{ width: 80, height: 80, borderRadius: 20, background: 'var(--blue)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, marginBottom: 24, animation: 'fadeUp 0.6s ease', boxShadow: '0 8px 24px rgba(37,99,235,0.4)' }}>🛣️</div>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text)', animation: 'fadeUp 0.8s ease', letterSpacing: '2px', textTransform: 'uppercase' }}>ROADRAKSHAK</h1>
      <p style={{ color: 'var(--muted)', fontSize: '1rem', letterSpacing: '4px', marginTop: 8, animation: 'fadeUp 1s ease', textTransform: 'uppercase' }}>AI INFRASTRUCTURE PLATFORM</p>
    </div>
  );
};

// ── AUTH LOGIN PAGE ───────────────────────────────────────────────────────────
const AuthPage = ({ onLogin, toggleTheme, isDark }) => {
  const [tab, setTab] = useState("citizen");
  const [form, setForm] = useState({ phone: "", pass: "", govId: "" });
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    if (tab === "citizen") {
      if (form.phone && form.pass) {
        onLogin({ role: "citizen", name: "Citizen User", phone: form.phone });
      } else {
        setError("Please enter mobile number and password.");
      }
    } else {
      if (form.govId === "admin" && form.pass === "1234") {
        onLogin({ role: "admin", name: "System Administrator" });
      } else {
        setError("Invalid ID or Password. Try admin / 1234");
      }
    }
  };

  const inpStyles = { width: "100%", padding: "14px 16px", marginBottom: "20px", fontSize: "1rem" };
  const lblStyles = { display: "block", marginBottom: "8px", fontSize: "0.85rem", fontWeight: 700, color: "var(--text2)" };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", position: "relative" }}>
      <div className="ambient-bg" />
      
      {/* Header with Dark Mode */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "24px 32px", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <button onClick={toggleTheme} style={{ background: "transparent", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "var(--text)", transition: "transform 0.2s" }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} title="Toggle Theme">
          {isDark ? "☀️" : "🌙"}
        </button>
      </div>

      <div style={{ width: "100%", maxWidth: 440 }} className="animate-slide">
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg, var(--blue), var(--blue3))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", margin: "0 auto 16px", color: "#fff", boxShadow: "0 10px 30px var(--blue-md)" }}>🛡️</div>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase" }}>RoadRakshak</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginTop: 8, textTransform: "uppercase", letterSpacing: "1px" }}>Secure Access Portal</p>
        </div>

        <Card style={{ padding: "36px 28px" }}>
          <div style={{ display: "flex", background: "var(--surface2)", borderRadius: "8px", padding: "4px", marginBottom: "28px", border: "1px solid var(--border)" }}>
            <button onClick={() => { setTab("citizen"); setError(""); }} style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "none", background: tab === "citizen" ? "var(--surface)" : "transparent", color: tab === "citizen" ? "var(--text)" : "var(--muted)", fontWeight: 700, cursor: "pointer", transition: "all 0.2s", boxShadow: tab === "citizen" ? "var(--shadow)" : "none" }}>Citizen</button>
            <button onClick={() => { setTab("admin"); setError(""); }} style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "none", background: tab === "admin" ? "var(--surface)" : "transparent", color: tab === "admin" ? "var(--text)" : "var(--muted)", fontWeight: 700, cursor: "pointer", transition: "all 0.2s", boxShadow: tab === "admin" ? "var(--shadow)" : "none" }}>Admin</button>
          </div>

          {/* 1-Click Prototypes */}
          <div style={{ marginBottom: 24 }}>
             <Btn onClick={() => tab === "citizen" ? onLogin({ role: "citizen", name: "Demo Citizen", phone: "0000000000" }) : onLogin({ role: "admin", name: "System Administrator" })} variant="demo" style={{ width: "100%" }}>
               1-Click Login as {tab === "citizen" ? "Citizen" : "Admin"}
             </Btn>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0", color: "var(--muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }}/> OR <div style={{ flex: 1, height: 1, background: "var(--border)" }}/>
          </div>

          {error && <div style={{ background: "var(--red-lt)", color: "var(--red)", padding: "12px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600, marginBottom: "20px", border: "1px solid var(--red)" }}>{error}</div>}

          <form onSubmit={handleLogin}>
            {tab === "citizen" ? (
              <>
                <label style={lblStyles}>Mobile Number</label>
                <input type="tel" placeholder="Enter 10-digit number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inpStyles} />
                <label style={lblStyles}>Password</label>
                <input type="password" placeholder="Enter your password" value={form.pass} onChange={e => setForm({ ...form, pass: e.target.value })} style={inpStyles} />
              </>
            ) : (
              <>
                <label style={lblStyles}>Admin ID</label>
                <input placeholder="e.g. admin" value={form.govId} onChange={e => setForm({ ...form, govId: e.target.value })} style={inpStyles} />
                <label style={lblStyles}>Secret Key</label>
                <input type="password" placeholder="Enter password (1234)" value={form.pass} onChange={e => setForm({ ...form, pass: e.target.value })} style={inpStyles} />
              </>
            )}
            <Btn type="submit" variant="primary" style={{ width: "100%", padding: "14px", marginTop: "10px", fontSize: "1rem" }}>
              Authenticate
            </Btn>
          </form>
        </Card>
      </div>
    </div>
  );
};

// ── AI CHATBOT COMPONENT (GEMINI POWERED) ─────────────────────────────────────
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hello! I am the RoadRakshak AI. How can I assist you with infrastructure reporting today?", sender: "bot" }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const predefinedOptions = [
    "How to report a pothole?",
    "Track my complaint",
    "How is Impact Score calculated?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;
    const newMsg = { text: text, sender: "user" };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    const botResponse = await callGeminiAPI(text);
    
    setMessages(prev => [...prev, { text: botResponse, sender: "bot" }]);
    setIsTyping(false);
  };

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
      {isOpen && (
        <Card style={{ width: 360, height: 520, marginBottom: 20, padding: 0, display: "flex", flexDirection: "column", overflow: "hidden", animation: "fadeUp 0.3s ease", boxShadow: "var(--shadow-md)" }}>
          {/* Chat Header */}
          <div style={{ background: "var(--surface2)", borderBottom: "1px solid var(--border)", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: "1.5rem", background: "var(--bg)", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)" }}>🤖</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "1rem" }}>System AI</div>
                <div style={{ fontSize: "0.75rem", color: "var(--green)", display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, background: "var(--green)", borderRadius: "50%" }}></span> Online
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: "transparent", border: "none", color: "var(--text)", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
          </div>
          
          {/* Chat Messages */}
          <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, background: "var(--bg)" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.sender === "user" ? "flex-end" : "flex-start", maxWidth: "85%", animation: "fadeUp 0.3s ease" }}>
                <div style={{ 
                  background: m.sender === "user" ? "var(--text)" : "var(--surface)", 
                  color: m.sender === "user" ? "var(--bg)" : "var(--text)", 
                  padding: "12px 16px", 
                  borderRadius: m.sender === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", 
                  fontSize: "0.9rem", lineHeight: 1.5, 
                  border: m.sender === "user" ? "none" : "1px solid var(--border)",
                  boxShadow: "var(--shadow)"
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
               <div style={{ alignSelf: "flex-start", background: "var(--surface)", padding: "12px 16px", borderRadius: "16px 16px 16px 4px", border: "1px solid var(--border)" }}>
                 <span style={{ animation: "typing 1.4s infinite 0s" }}>.</span>
                 <span style={{ animation: "typing 1.4s infinite 0.2s" }}>.</span>
                 <span style={{ animation: "typing 1.4s infinite 0.4s" }}>.</span>
               </div>
            )}

            {/* Quick Menu Pills */}
            {!isTyping && messages[messages.length - 1].sender === "bot" && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {predefinedOptions.map((opt, idx) => (
                  <button key={idx} onClick={() => handleSend(opt)} style={{
                    background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)",
                    padding: "8px 12px", borderRadius: "20px", fontSize: "0.75rem", cursor: "pointer",
                    transition: "all 0.2s", fontWeight: 600
                  }} onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--text)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";}}>
                    {opt}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <div style={{ padding: "16px", borderTop: "1px solid var(--border)", background: "var(--surface)", display: "flex", gap: 12 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder="Ask something..." style={{ flex: 1, padding: "12px 16px", border: "1px solid var(--border)", borderRadius: "8px", background: "var(--bg)", color: "var(--text)", fontSize: "0.9rem", outline: "none" }} disabled={isTyping} />
            <button onClick={() => handleSend(input)} disabled={isTyping} style={{ background: "var(--text)", color: "var(--bg)", border: "none", borderRadius: "8px", width: 46, height: 46, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s" }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        </Card>
      )}
      
      {/* Floating Action Button */}
      <button onClick={() => setIsOpen(!isOpen)} style={{ 
        width: 60, height: 60, borderRadius: "50%", background: "var(--text)", 
        color: "var(--bg)", border: "none", fontSize: "1.8rem", cursor: "pointer", 
        boxShadow: "0 8px 24px rgba(0,0,0,0.3)", transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)", 
        display: "flex", alignItems: "center", justifyContent: "center",
        transform: isOpen ? "scale(0.9)" : "scale(1)"
      }} onMouseEnter={e => !isOpen && (e.currentTarget.style.transform = "scale(1.1) rotate(5deg)")} onMouseLeave={e => !isOpen && (e.currentTarget.style.transform = "scale(1) rotate(0deg)")}>
        {isOpen ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> : "💬"}
      </button>
    </div>
  );
};

// ── COMPACT NAVBAR ────────────────────────────────────────────────────────────
const Navbar = ({ page, setPage, user, onLogout, toggleTheme, isDark }) => (
  <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:1000,
    background:"var(--surface)", backdropFilter:"blur(24px)",
    borderBottom:"1px solid var(--border)", padding:"0 40px",
    display:"flex", alignItems:"center", justifyContent:"space-between", height:"76px",
    boxShadow:"var(--shadow)", width: "100%" }}>
    
    <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, var(--blue), transparent)", opacity: 0.6 }} />

    <div onClick={()=>setPage(user.role === 'admin' ? 'admin' : 'home')} style={{ display:"flex", alignItems:"center", gap:14, cursor:"pointer" }}>
      <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,var(--blue),var(--blue3))",
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.2rem", color: "#fff",
        boxShadow:"0 4px 15px var(--blue-lt)" }}>🛡️</div>
      <div>
        <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:"1.4rem", color:"var(--text)", lineHeight:1 }}>
          Road<span className="text-gradient">Rakshak</span>
        </div>
        <div style={{ fontSize:"0.65rem", color:"var(--muted)", letterSpacing:"1.5px", textTransform:"uppercase", marginTop: 4, fontWeight: 600 }}>AI Platform</div>
      </div>
    </div>
    
    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
      {/* Dynamic Main Nav Menu */}
      {user.role === "citizen" && [["home","home","Home"],["report","report","Report"],["track","track","Track"],["map","map","Map"],["about","about","About"]].map(([p,ic,l])=>(
        <button key={p} onClick={()=>setPage(p)} style={{
          background:page===p?"var(--blue-lt)":"transparent", color:page===p?"var(--blue)":"var(--muted)",
          border:page===p?"1px solid var(--blue)":"1px solid transparent",
          borderRadius:"20px", padding:"8px 20px", cursor:"pointer",
          fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:"0.9rem",
          transition:"all .3s cubic-bezier(0.2, 0.8, 0.2, 1)", display:"flex", alignItems:"center", gap:8,
          boxShadow: page===p?"0 0 15px var(--blue-lt)":"none"
        }} onMouseEnter={e=>{e.currentTarget.style.color=page===p?"var(--blue)":"var(--text)"; e.currentTarget.style.background=page===p?"var(--blue-lt)":"var(--surface2)";}} onMouseLeave={e=>{e.currentTarget.style.color=page===p?"var(--blue)":"var(--muted)"; e.currentTarget.style.background=page===p?"var(--blue-lt)":"transparent";}}>
          <NavIcon name={ic} /> <span style={{ display: "none", '@media (minWidth: 768px)': { display: "inline" } }}>{l}</span>
        </button>
      ))}

      {user.role === "admin" && [["admin","admin","Dashboard"],["analytics","analytics","Analytics"],["about","about","About"]].map(([p,ic,l])=>(
        <button key={p} onClick={()=>setPage(p)} style={{
          background:page===p?"var(--blue-lt)":"transparent", color:page===p?"var(--blue)":"var(--muted)",
          border:page===p?"1px solid var(--blue)":"1px solid transparent",
          borderRadius:"20px", padding:"8px 20px", cursor:"pointer",
          fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:"0.9rem",
          transition:"all .3s cubic-bezier(0.2, 0.8, 0.2, 1)", display:"flex", alignItems:"center", gap:8,
          boxShadow: page===p?"0 0 15px var(--blue-lt)":"none"
        }} onMouseEnter={e=>{e.currentTarget.style.color=page===p?"var(--blue)":"var(--text)"; e.currentTarget.style.background=page===p?"var(--blue-lt)":"var(--surface2)";}} onMouseLeave={e=>{e.currentTarget.style.color=page===p?"var(--blue)":"var(--muted)"; e.currentTarget.style.background=page===p?"var(--blue-lt)":"transparent";}}>
          <NavIcon name={ic} /> {l}
        </button>
      ))}

      <div style={{ display: "flex", gap: 16, alignItems: "center", margin: "0 12px" }}>
         <SocialIconsBlock />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16, background: "var(--bg)", padding: "6px 6px 6px 20px", borderRadius: "30px", border: "1px solid var(--border)", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <span style={{ fontSize: "0.9rem", fontWeight: 800 }}>{user.name}</span>
          <span style={{ fontSize: "0.65rem", color: "var(--blue)", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>{user.role}</span>
        </div>
        <Btn onClick={onLogout} variant="danger" style={{ padding:"10px 20px", fontSize:"0.85rem", borderRadius: "24px", boxShadow: "0 4px 10px var(--red-lt)" }}>
          Logout
        </Btn>
      </div>
    </div>
  </nav>
);

// ── PAGE: HOME (CITIZEN) ──────────────────────────────────────────────────────
const HomePage = ({ setPage }) => {
  const stats = [
    { icon:"📋", val:"1,247", label:"Total Reports",  color:"var(--text)" },
    { icon:"🚨", val:"89",    label:"Critical Issues", color:"var(--red)" },
    { icon:"✅", val:"934",   label:"Resolved",        color:"var(--green)" },
    { icon:"⏱️", val:"3.2d",  label:"Avg Resolution",  color:"var(--orange)" },
  ];
  
  return (
    <div style={{ paddingTop: 130 }} className="animate-slide">
      
      {/* Hero */}
      <div style={{ padding:"60px 40px 80px", textAlign:"center" }}>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h1 style={{ fontSize:"clamp(2.5rem, 6vw, 4.5rem)", fontWeight:800, lineHeight:1.15, marginBottom:24, color: "var(--text)" }}>
            Smart infrastructure for <br/><span style={{ color: 'var(--muted)' }}>safer communities.</span>
          </h1>
          <p style={{ fontSize:"1.15rem", color:"var(--muted)", maxWidth:600, margin:"0 auto 40px", lineHeight:1.7 }}>
            Report road damage instantly. Track live resolution status. Help authorities maintain secure routes using our AI-driven spatial platform.
          </p>
          <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
            <Btn onClick={()=>setPage("report")} style={{ padding:"16px 36px", fontSize:"1rem" }}>📸 Report Damage</Btn>
            <Btn onClick={()=>setPage("map")} variant="secondary" style={{ padding:"16px 36px", fontSize:"1rem" }}>🗺️ Local Radar</Btn>
          </div>
        </div>
      </div>

      <div style={{ padding:"0 40px 80px", width: "100%" }}>
        {/* Local Scan Radar Section */}
        <div style={{ marginBottom: 80 }}>
          <LocalRadar />
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:20, marginBottom:40 }}>
          {stats.map((s,i)=>(
            <Card key={i} hover={true} style={{ textAlign:"center" }}>
              <div style={{ fontSize:"2rem", margin:"0 auto 16px" }}>{s.icon}</div>
              <div style={{ fontSize:"2.5rem", fontWeight:800, fontFamily:"'Plus Jakarta Sans',sans-serif", color:s.color, lineHeight:1 }}>{s.val}</div>
              <div style={{ color:"var(--muted)", fontSize:"0.9rem", marginTop:8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</div>
            </Card>
          ))}
        </div>

        {/* Footer Strip */}
        <div style={{ marginTop: 60, padding: "40px 32px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", gap: 24 }}>
            <SocialIconsBlock />
          </div>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>© 2026 RoadRakshak AI Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

// ── LOCAL RADAR COMPONENT (10KM ANALYSIS) ─────────────────────────────────────
const LocalRadar = () => {
  const [scanning, setScanning] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setScanning(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card style={{ position: "relative", overflow: "hidden", padding: "40px", border: "1px solid var(--border)" }}>
      {/* Radar Animation Background */}
      <div style={{ position: "absolute", top: "-50%", left: "-50%", width: "200%", height: "200%", background: "conic-gradient(from 0deg, transparent 70%, var(--surface2) 100%)", borderRadius: "50%", animation: "spin 4s linear infinite", opacity: scanning ? 1 : 0.5, pointerEvents: "none", transition: "opacity 1s ease" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", height: "100%", border: "1px dashed var(--border)", borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "50%", height: "50%", border: "1px dashed var(--border)", borderRadius: "50%", pointerEvents: "none" }} />
      
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: "1.5rem", color: "var(--text)", fontWeight: 800 }}>AI Proximity Radar</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.95rem", marginTop: 4 }}>Scanning 10km radius from Indore, MP</p>
          </div>
          {scanning ? (
             <Badge label="SCANNING..." color="var(--blue)" bg="var(--blue-lt)" />
          ) : (
             <Badge label="SCAN COMPLETE" color="var(--green)" bg="var(--green-lt)" />
          )}
        </div>

        {scanning ? (
          <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
            <div style={{ width: 50, height: 50, border: "3px solid var(--border)", borderTopColor: "var(--text)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            <div style={{ color: "var(--text)", fontWeight: 600, letterSpacing: "2px" }}>ACQUIRING SATELLITE DATA</div>
          </div>
        ) : (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, marginBottom: 20 }}>
              <div style={{ background: "var(--surface2)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border)", textAlign: "center" }}>
                <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--red)" }}>14</div>
                <div style={{ fontSize: "0.8rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", marginTop: 4 }}>Active Threats</div>
              </div>
              <div style={{ background: "var(--surface2)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border)", textAlign: "center" }}>
                <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--orange)" }}>8</div>
                <div style={{ fontSize: "0.8rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", marginTop: 4 }}>Potholes Detected</div>
              </div>
              <div style={{ background: "var(--surface2)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border)", textAlign: "center" }}>
                <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--green)" }}>65%</div>
                <div style={{ fontSize: "0.8rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", marginTop: 4 }}>Overall Road Health</div>
              </div>
            </div>
            
            <div style={{ background: "var(--red-lt)", borderLeft: "4px solid var(--red)", padding: "16px", borderRadius: "8px" }}>
              <div style={{ fontWeight: 700, color: "var(--red)", marginBottom: 4 }}>⚠️ High Risk Zone Detected</div>
              <div style={{ fontSize: "0.95rem", color: "var(--text)", lineHeight: 1.5 }}>Multiple severe potholes located near A B Road intersection. Proceed with caution.</div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

// ── PAGE: ABOUT (ATTRACTIVE & MODERN) ─────────────────────────────────────────
const AboutPage = () => {
  return (
    <div style={{ paddingTop:130, minHeight:"100vh" }} className="animate-slide">
      <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 60, padding: "0 40px" }}>
        <div style={{ width: 80, height: 80, background: "var(--text)", color: "var(--bg)", borderRadius: 24, margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", boxShadow: "0 10px 30px var(--border)" }}>🛡️</div>
        <h1 style={{ fontSize:"3rem", fontWeight:800, color:"var(--text)", marginBottom:16 }}>About <span className="text-gradient">RoadRakshak</span></h1>
        <p style={{ color:"var(--muted)", fontSize:"1.2rem", lineHeight: 1.6 }}>Pioneering the future of civic infrastructure through crowd-sourced intelligence and automated threat triage.</p>
      </div>
      
      <div style={{ width: "100%", padding:"0 40px 80px" }}>
        <Card style={{ marginBottom: 40, borderLeft: "4px solid var(--blue)" }}>
          <h2 style={{ fontSize:"1.6rem", marginBottom: 16, color: "var(--text)" }}>Our Mission</h2>
          <p style={{ color: "var(--muted)", lineHeight: 1.8, fontSize: "1.05rem" }}>
            In rural and developing sectors, unmonitored road degradation leads to accidents, economic delays, and reduced quality of life. RoadRakshak bridges the massive gap between citizens and municipal authorities by providing a frictionless, AI-driven reporting pipeline. We turn every smartphone into a smart sensor for public safety.
          </p>
        </Card>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, marginBottom: 60 }}>
          <Card hover={true}>
            <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🎯</div>
            <h3 style={{ fontSize:"1.3rem", marginBottom: 12, color: "var(--text)" }}>Precision Triage</h3>
            <p style={{ color: "var(--muted)", lineHeight: 1.6, fontSize: "0.95rem" }}>
              Our AI models analyze uploaded imagery and cross-reference with GPS context to assign an accurate Emergency Impact Score, ensuring critical hazards are addressed immediately.
            </p>
          </Card>
          <Card hover={true}>
            <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontSize:"1.3rem", marginBottom: 12, color: "var(--text)" }}>Absolute Transparency</h3>
            <p style={{ color: "var(--muted)", lineHeight: 1.6, fontSize: "0.95rem" }}>
              Every submitted report is logged into a public-facing ledger. Citizens can track the real-time resolution status of their complaints, fostering trust in local governance.
            </p>
          </Card>
          <Card hover={true}>
            <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🤝</div>
            <h3 style={{ fontSize:"1.3rem", marginBottom: 12, color: "var(--text)" }}>Community Driven</h3>
            <p style={{ color: "var(--muted)", lineHeight: 1.6, fontSize: "0.95rem" }}>
              By lowering the barrier to reporting, we build a collaborative ecosystem where residents actively participate in the maintenance and safety of their own neighborhoods.
            </p>
          </Card>
        </div>

        <Card style={{ textAlign: "center", background: "var(--surface2)" }}>
          <h3 style={{ marginBottom: 12, fontSize: "1.2rem" }}>System Specifications</h3>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem", marginBottom: 8 }}>Version: 3.0.0 (RoadRakshak Protocol)</p>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>Engineered for optimal performance, accessibility, and AI integration.</p>
        </Card>
      </div>
    </div>
  );
};

// ── PAGE: REPORT ──────────────────────────────────────────────────────────────
const ReportPage = ({ setPage, addComplaint, user }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ village: "", issue: "", desc: "", lat: "", lng: "" });
  const [img, setImg]   = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const fileRef = useRef();

  const handleImg = e => {
    const f = e.target.files[0];
    if(f){ const r=new FileReader(); r.onload=ev=>setImg(ev.target.result); r.readAsDataURL(f); }
  };
  
  const gps = () => {
    setForm(f=>({...f, lat: "Connecting...", lng: ""}));
    setTimeout(() => {
      if(navigator.geolocation) navigator.geolocation.getCurrentPosition(
        p=>setForm(f=>({...f,lat:p.coords.latitude.toFixed(4),lng:p.coords.longitude.toFixed(4)})),
        ()=>setForm(f=>({...f,lat:"22.7196",lng:"75.8577"}))
      ); else setForm(f=>({...f,lat:"22.7196",lng:"75.8577"}));
    }, 1200);
  };
  
  const analyze = () => {
    if(!form.village||!form.issue) return alert("Required fields missing.");
    setAnalyzing(true);
    setTimeout(()=>{
      const sc={Pothole:85,Waterlogging:72,"Cracked Road":55,"Road Blockage":90,"Damaged Culvert":68,"Surface Erosion":38}[form.issue]||60;
      const sev=sc>=80?"Critical":sc>=60?"High":sc>=40?"Medium":"Low";
      const id=`RR-${new Date().getFullYear()}-${Math.floor(Math.random()*9000)+1000}`;
      
      const r = { id, severity: sev, score: sc, priority: sc>=80?"Critical":sc>=60?"Urgent":"Normal" };
      setResult(r);
      
      addComplaint({ ...r, ...form, author: user.name, img:"📸", status:"Pending", date:new Date().toISOString().slice(0,10), lat:parseFloat(form.lat)||22.7, lng:parseFloat(form.lng)||75.8 });
      
      setAnalyzing(false); setStep(3);
    }, 3000);
  };

  const inp = { width:"100%", padding:"14px 16px", fontSize:"1rem" };
  const lbl = { display:"block", marginBottom:8, fontSize:"0.85rem", fontWeight:600, color:"var(--text2)" };

  const stepDot = (n,i) => ({
    width:36, height:36, borderRadius:"50%", flexShrink:0,
    background:step>i?"var(--green)":step===i?"var(--text)":"var(--surface2)",
    color:step>i||step===i?"var(--bg)":"var(--muted2)",
    display:"flex", alignItems:"center", justifyContent:"center",
    fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:"0.9rem",
    transition:"all .3s", border: "1px solid var(--border)"
  });

  return (
    <div style={{ paddingTop:130, minHeight:"100vh" }} className="animate-slide">
      <div style={{ width: "100%", padding: "0 40px 80px" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize:"2rem", fontWeight:800, color:"var(--text)", marginBottom:4 }}>Report Hazard</h1>
            <p style={{ color:"var(--muted)", fontSize:"0.95rem" }}>Filing as <b style={{color:'var(--text)'}}>{user.name}</b></p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            {[["1","Upload"],["2","Details"],["3","Result"]].map(([n,l],i)=>(
              <React.Fragment key={n}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap: 6 }}>
                  <div style={stepDot(n,i+1)}>{step>i+1?"✓":n}</div>
                  <span style={{ fontSize:"0.7rem", fontWeight:step===i+1?700:500, color:step===i+1?"var(--text)":"var(--muted)", textTransform:"uppercase", letterSpacing:"1px" }}>{l}</span>
                </div>
                {i<2&&<div style={{ width:40, height:3, background:step>i+1?"var(--green)":"var(--border)", borderRadius:2, marginBottom: 20 }}/>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {step===1&&(
          <Card>
            <h3 style={{ marginBottom:8, fontSize:"1.3rem", fontWeight: 700 }}>📸 Upload Visual Evidence</h3>
            <p style={{ color:"var(--muted)", fontSize:"0.9rem", marginBottom:24 }}>Take a clear, wide-angle photo of the road damage to assist AI assessment.</p>
            <div onClick={()=>fileRef.current.click()} style={{
              border:"2px dashed var(--border)", borderRadius:16, padding:"60px 20px", textAlign:"center", cursor:"pointer",
              background:img?"var(--surface)":"var(--surface2)", transition:"all .2s",
              minHeight:250, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor="var(--text)"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
              {img&&img!=="demo"
                ? <img src={img} alt="preview" style={{ maxWidth:"100%", maxHeight:300, borderRadius:8, objectFit:"cover" }}/>
                : img==="demo"
                ? <div><div style={{ fontSize:"5rem", marginBottom:12 }}>🕳️</div><div style={{ fontWeight:700, color:"var(--text)", fontSize:"1.1rem" }}>Sample Active</div><div style={{ color:"var(--muted)", fontSize:"0.85rem", marginTop:4 }}>A.B. Road, Indore Region</div></div>
                : <><div style={{ width:72,height:72,borderRadius:20,background:"var(--surface)",border:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2rem",marginBottom:16, boxShadow:"var(--shadow)" }}>📷</div><p style={{ color:"var(--text)",fontWeight:600,marginBottom:6, fontSize:"1.1rem" }}>Tap to launch camera</p><p style={{ color:"var(--muted)",fontSize:"0.85rem" }}>Supports JPG, PNG (Max 10MB)</p></>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImg} style={{ display:"none" }}/>
            <div style={{ display:"flex", gap:16, marginTop:24 }}>
              {!img&&<Btn onClick={()=>{ setImg("demo"); setStep(2); }} variant="secondary" style={{ flex:1, padding:"16px" }}>Use Mock Data</Btn>}
              <Btn onClick={()=>setStep(2)} style={{ flex: img ? 1 : 'none', padding:"16px" }} disabled={!img}>Proceed to Details →</Btn>
            </div>
          </Card>
        )}

        {step===2&&(
          <Card>
            <h3 style={{ marginBottom:8, fontSize:"1.3rem", fontWeight: 700 }}>📋 Incident Context</h3>
            <p style={{ color:"var(--muted)", fontSize:"0.9rem", marginBottom:24 }}>Verify the location and categorize the threat.</p>
            
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
              <div>
                <label style={lbl}>Locality / Area Name <span style={{ color:"var(--red)" }}>*</span></label>
                <input value={form.village} onChange={e=>setForm(f=>({...f,village:e.target.value}))} placeholder="e.g. Vijay Nagar" style={inp}/>
              </div>
              <div>
                <label style={lbl}>Threat Classification <span style={{ color:"var(--red)" }}>*</span></label>
                <select value={form.issue} onChange={e=>setForm(f=>({...f,issue:e.target.value}))} style={inp}>
                  <option value="" style={{background: 'var(--surface)'}}>Select category...</option>
                  {["Pothole","Cracked Road","Waterlogging","Road Blockage","Damaged Culvert","Surface Erosion"].map(o=><option key={o} value={o} style={{background: 'var(--surface)'}}>{o}</option>)}
                </select>
              </div>
            </div>
            
            <div style={{ marginBottom:20 }}>
              <label style={lbl}>📍 GPS Telemetry</label>
              <div style={{ display:"flex", gap:12 }}>
                <input readOnly value={form.lat?`${form.lat}, ${form.lng}`:""} placeholder="Awaiting connection..." style={{...inp,flex:1, color:"var(--text)", fontFamily:"'Inter', monospace", fontWeight: 600 }}/>
                <Btn onClick={gps} variant="secondary" style={{ padding:"0 24px" }}>Acquire Link</Btn>
              </div>
            </div>

            <div style={{ marginBottom:32 }}>
              <label style={lbl}>Additional Observer Notes</label>
              <textarea value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} rows={3}
                placeholder="Mention specific landmarks or urgency context..." style={{...inp,resize:"vertical"}}/>
            </div>
            
            <div style={{ display:"flex", gap:16 }}>
              <Btn onClick={()=>setStep(1)} variant="secondary" style={{ padding:"16px 32px" }}>Back</Btn>
              <Btn onClick={analyze} style={{ flex:1, padding:"16px" }} disabled={!form.village||!form.issue}>Run AI Diagnostics 🤖</Btn>
            </div>
          </Card>
        )}

        {analyzing&&(
          <Card style={{ textAlign:"center", padding:"80px 24px", position:"relative", overflow:"hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "var(--border)", overflow: "hidden" }}>
               <div style={{ width: "50%", height: "100%", background: "var(--text)", animation: "slideIn 1s infinite alternate" }}/>
            </div>
            <div style={{ width:80,height:80,borderRadius:"50%",background:"var(--surface2)",border:"2px solid var(--text)",display:"flex",alignItems:"center",
              justifyContent:"center",fontSize:"2.5rem",margin:"0 auto 24px",animation:"spin 2s linear infinite" }}>⚙️</div>
            <h3 style={{ color:"var(--text)", marginBottom:8, fontSize: "1.4rem" }}>Analyzing Sector Data...</h3>
            <p style={{ color:"var(--muted)", fontSize:"0.95rem", marginBottom:32 }}>Neural network is cross-referencing visual input with threat matrices.</p>
          </Card>
        )}

        {step===3&&result&&(
          <div style={{ animation:"fadeUp .5s ease" }}>
            <div style={{ background:"var(--green-lt)", border:"1px solid var(--green)",
              borderRadius:16, padding:"20px 24px", marginBottom:24, display:"flex", alignItems:"center", gap:16 }}>
              <div style={{ width:48,height:48,borderRadius:"50%",background:"var(--green)",display:"flex",alignItems:"center",
                justifyContent:"center",fontSize:"1.4rem",color:"#fff",flexShrink:0 }}>✓</div>
              <div>
                <div style={{ fontWeight:800, color:"var(--green)", fontSize:"1.1rem" }}>INCIDENT LOGGED SUCCESSFULLY</div>
                <div style={{ fontSize:"0.9rem", color:"var(--text)", marginTop: 4 }}>Encrypted payload delivered to Regional Command.</div>
              </div>
            </div>
            
            <Card>
              <div style={{ textAlign:"center", marginBottom:32 }}>
                <div style={{ fontSize:"0.8rem", color:"var(--muted)", marginBottom:8, textTransform:"uppercase", letterSpacing:"2px", fontWeight: 700 }}>Tracking Identifier</div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:"2.5rem", color:"var(--text)", marginBottom:32 }}>{result.id}</div>
                
                <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}><ScoreRing score={result.score} size={120}/></div>
                <div style={{ fontSize:"0.85rem", color:"var(--muted)", marginBottom:24, fontWeight: 500 }}>Computed Impact Score</div>
                
                <div style={{ display:"flex", justifyContent:"center", gap:12, flexWrap:"wrap" }}>
                  <Badge label={`CLASS: ${result.severity.toUpperCase()}`} color={SEV_COL[result.severity]} bg={SEV_BG[result.severity]}/>
                  <Badge label={`STATE: PENDING`} color="var(--orange)" bg="var(--orange-bg)"/>
                </div>
              </div>
              
              <div style={{ background:"var(--surface2)", borderRadius:12, padding:"20px", marginBottom:24,
                fontSize:"0.9rem", color:"var(--text)", lineHeight:1.7, border:"1px solid var(--border)", borderLeft: "4px solid var(--text)" }}>
                <span style={{ fontWeight: 700 }}>PROTOCOL &gt;</span> Retain this identifier. Your report has entered the active triage queue and will be assigned to a dispatch unit shortly based on priority tier.
              </div>
              
              <div style={{ display:"flex", gap:16 }}>
                <Btn onClick={()=>setPage("track")} style={{ flex:1, padding: "16px" }}>Open Live Tracker</Btn>
                <Btn onClick={()=>{ setStep(1); setForm({village:"",issue:"",desc:"",lat:"",lng:""}); setImg(null); setResult(null); }}
                  variant="secondary" style={{ flex:1, padding: "16px" }}>Submit Another</Btn>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

// ── PAGE: TRACK ───────────────────────────────────────────────────────────────
const TrackPage = ({ complaints }) => {
  const [id, setId]         = useState("");
  const [found, setFound]   = useState(null);
  const [searched, setSearched] = useState(false);
  const search = () => { setSearched(true); setFound(complaints.find(c=>c.id.toLowerCase()===id.trim().toLowerCase())||null); };
  const tl = s => ["Pending","Assigned","In Progress","Resolved"].map((t,i)=>({ label:t, done:i<=["Pending","Assigned","In Progress","Resolved"].indexOf(s), active:t===s }));

  return (
    <div style={{ paddingTop:130, minHeight:"100vh" }} className="animate-slide">
      <div style={{ width: "100%", padding:"0 40px 80px" }}>
        
        <div style={{ textAlign:"center", marginBottom: 40 }}>
          <h1 style={{ fontSize:"2rem", fontWeight:800, color:"var(--text)", marginBottom:8 }}>Resolution Tracker</h1>
          <p style={{ color:"var(--muted)", fontSize:"1rem" }}>Monitor the live dispatch and repair status of your incident report.</p>
        </div>

        <Card style={{ marginBottom:24, padding: "32px 24px" }}>
          <label style={{ display:"block", marginBottom:12, fontSize:"0.9rem", fontWeight:700, color:"var(--text)" }}>Query Database by ID</label>
          <div style={{ display:"flex", gap:12, marginBottom:16 }}>
            <input value={id} onChange={e=>setId(e.target.value)} placeholder="e.g. RR-2024-001"
              onKeyDown={e=>e.key==="Enter"&&search()} style={{
              flex:1, padding:"16px 20px", fontSize:"1.05rem", fontWeight: 600 }} autoFocus/>
            <Btn onClick={search} style={{ padding: "0 32px" }}>Execute</Btn>
          </div>
          <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
            <span style={{ fontSize:"0.8rem", color:"var(--muted)" }}>RECENT QUERIES:</span>
            {["RR-2024-001","RR-2024-002"].map(s=>(
              <button key={s} onClick={()=>setId(s)} style={{ background:"var(--surface2)", border:"1px solid var(--border)",
                borderRadius:8, padding:"6px 12px", color:"var(--text)", cursor:"pointer", fontSize:"0.8rem", fontWeight:600, transition: "all 0.2s" }} onMouseEnter={e=>e.currentTarget.style.borderColor="var(--text)"} onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>{s}</button>
            ))}
          </div>
        </Card>

        {searched&&!found&&(
          <Card style={{ textAlign:"center", padding:"60px 24px", border: "1px solid var(--red-lt)", background: "var(--red-bg)" }}>
            <div style={{ fontSize:"3rem", marginBottom:16 }}>⚠️</div>
            <h3 style={{ color:"var(--red)", marginBottom:8, fontSize: "1.4rem" }}>Record Not Found</h3>
            <p style={{ color:"var(--text)", fontSize:"0.95rem" }}>The system returned 0 results for identifier "<b>{id}</b>". Please verify and retry.</p>
          </Card>
        )}

        {found&&(
          <Card style={{ animation:"fadeUp .4s ease", padding: "40px 32px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start",
              paddingBottom:24, borderBottom:"1px solid var(--border)", marginBottom:24, flexWrap:"wrap", gap:16 }}>
              <div>
                <div style={{ fontSize:"0.8rem", color:"var(--muted)", marginBottom:6, textTransform:"uppercase", letterSpacing:"2px", fontWeight: 700 }}>Identifier</div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:"1.8rem", color:"var(--text)" }}>{found.id}</div>
              </div>
              <Badge label={found.status.toUpperCase()} color={STA_COL[found.status]} bg={STA_BG[found.status]}/>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:24 }}>
              {[["📍 SECTOR",found.village],["⚠️ THREAT",found.issue],["📅 LOGGED",found.date],["👤 SOURCE",found.author]].map(([l,v])=>(
                <div key={l} style={{ background:"var(--surface2)", borderRadius:12, padding:"16px", border:"1px solid var(--border)" }}>
                  <div style={{ fontSize:"0.75rem", color:"var(--muted)", marginBottom:6, fontWeight: 700 }}>{l}</div>
                  <div style={{ fontWeight:600, color:"var(--text)", fontSize:"1rem" }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom:32 }}>
              <Badge label={`TIER: ${found.severity.toUpperCase()}`} color={SEV_COL[found.severity]} bg={SEV_BG[found.severity]}/>
            </div>

            {/* Timeline */}
            <div style={{ background:"var(--surface2)", borderRadius:16, padding:"24px", marginBottom:found.desc?24:0, border:"1px solid var(--border)", position: "relative" }}>
              <div style={{ fontSize:"0.8rem", fontWeight:800, color:"var(--text)", textTransform:"uppercase",
                letterSpacing:"1.5px", marginBottom:32, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Resolution Trajectory</div>
              
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", top: 18, left: 30, right: 30, height: 4, background: "var(--border)", borderRadius: 2, zIndex: 0 }}/>
                <div style={{ display:"flex", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
                  {tl(found.status).map((t,i,arr)=>(
                    <div key={t.label} style={{ display:"flex", flexDirection:"column", alignItems:"center", width: 70 }}>
                      
                      {i > 0 && <div style={{ position: "absolute", top: 18, left: `${(i-0.5)*(100/(arr.length-1))}%`, width: `${100/(arr.length-1)}%`, height: 4, background: t.done ? "var(--text)" : "transparent", transition: "all 0.5s", zIndex: -1 }}/>}
                      
                      <div style={{ width:40, height:40, borderRadius:"50%", flexShrink:0,
                        background:t.active?"var(--bg)":t.done?"var(--text)":"var(--surface)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        color:t.active?"var(--text)":t.done?"var(--bg)":"var(--muted)", fontWeight:800, fontSize:"1rem",
                        border:t.active?"2px solid var(--text)":t.done?"2px solid var(--text)":"2px solid var(--border)"}}>
                          {t.active ? <div style={{width:12, height:12, background:"var(--text)", borderRadius:"50%", animation:"pulse 1.5s infinite"}}/> : t.done ? "✓" : ""}
                      </div>
                      
                      <div style={{ marginTop:12, fontSize:"0.75rem", textAlign:"center", fontFamily:"'Plus Jakarta Sans',sans-serif",
                        color:t.active?"var(--text)":t.done?"var(--text)":"var(--muted)", fontWeight:t.active||t.done?700:500 }}>{t.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {found.desc&&(
              <div style={{ marginTop:24, padding:"16px 20px", background:"var(--surface2)", borderRadius:12, borderLeft:"4px solid var(--orange)" }}>
                <div style={{ fontSize:"0.75rem", fontWeight:800, color:"var(--orange)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:8 }}>Observer Attachment</div>
                <p style={{ fontSize:"0.95rem", lineHeight:1.6, color:"var(--text)" }}>"{found.desc}"</p>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

// ── PAGE: MAP ─────────────────────────────────────────────────────────────────
const MapPage = ({ complaints }) => {
  const [filter, setFilter]   = useState("all");
  const [selected, setSelected] = useState(null);
  const filtered = filter==="all"?complaints:filter==="critical"?complaints.filter(c=>c.severity==="Critical"||c.severity==="High"):complaints.filter(c=>c.status==="Resolved");
  const areas=["Rampur","Shivpur","Kothi","Berasia","Mandideep","Sehore"];
  const health={ Rampur:32, Shivpur:58, Kothi:71, Berasia:28, Mandideep:85, Sehore:65 };
  const pos={ "RR-2024-001":[100,210],"RR-2024-002":[210,145],"RR-2024-003":[330,240],"RR-2024-004":[450,160],"RR-2024-005":[165,340],"RR-2024-006":[470,325] };

  return (
    <div style={{ paddingTop:130, minHeight:"100vh" }} className="animate-slide">
      <div style={{ width: "100%", padding:"0 40px 60px" }}>
        
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:16, marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize:"2rem", fontWeight:800, color:"var(--text)", marginBottom:4 }}>Sector Radar</h1>
            <p style={{ color:"var(--muted)", fontSize:"0.95rem" }}>Live spatial distribution of active threats.</p>
          </div>
          <div style={{ display:"flex", gap:0, background:"var(--surface)", padding:6, borderRadius:12, border:"1px solid var(--border)", flexWrap:"wrap" }}>
            {[["all","GLOBAL VIEW"],["critical","CRITICAL ONLY"],["resolved","CLEARED NODES"]].map(([v,l])=>(
              <button key={v} onClick={()=>setFilter(v)} style={{
                background:filter===v?"var(--surface2)":"transparent",
                color:filter===v?"var(--text)":"var(--muted)", border:"1px solid transparent", borderColor: filter===v?"var(--border)":"transparent", borderRadius:8,
                padding:"8px 16px", cursor:"pointer", fontSize:"0.8rem", fontWeight:700,
                fontFamily:"'Plus Jakarta Sans',sans-serif", transition:"all .2s", whiteSpace:"nowrap" }}>{l}</button>
            ))}
          </div>
        </div>

        <div style={{ display:"flex", flexWrap:"wrap", gap:24 }}>
          <Card style={{ flex: "1 1 500px", padding:0, overflow:"hidden", minHeight:550, display: "flex", flexDirection: "column", position: "relative" }}>
            
            <div style={{ padding:"16px 24px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between", background:"var(--surface)", position:"relative", zIndex: 2, flexWrap:"wrap", gap:10 }}>
              <span style={{ fontSize:"0.85rem", color:"var(--muted)", fontWeight: 600, letterSpacing: "1px" }}>MAP_GRID: INDORE_R1 // ACTIVE: <b style={{ color:"var(--text)" }}>{filtered.length}</b></span>
              <span style={{ fontSize:"0.75rem", background:"var(--green-bg)", color:"var(--green)", padding:"4px 12px", borderRadius:8, fontWeight:800, border:"1px solid var(--green-lt)", letterSpacing: "1px" }}>● LIVE SENSOR</span>
            </div>
            
            <svg width="100%" height="100%" viewBox="0 0 600 460" style={{ background:"var(--bg)", display:"block", position: "relative", zIndex: 1, flex: 1, minHeight:300 }}>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border)" strokeWidth="1"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              <path d="M60 230 Q200 165 330 230 Q460 295 565 220" stroke="var(--border2)" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="8 8"/>
              <path d="M300 40 L300 440" stroke="var(--border2)" strokeWidth="4" fill="none"/>
              <path d="M80 90 Q280 200 520 140" stroke="var(--border)" strokeWidth="2" fill="none"/>
              
              {[["RAMPUR",100,210],["SHIVPUR",210,145],["KOTHI",330,240],["BERASIA",450,160],["MANDI",165,340],["SEHORE",470,325]].map(([name,x,y])=>(
              <text key={name} x={x} y={y+30} textAnchor="middle" fontSize="10" fill="var(--muted)" fontFamily="Inter" fontWeight="600" letterSpacing="1">{name}</text>
            ))}
            
            {filtered.map(c=>{
                const [x,y]=pos[c.id]||[200,200];
                const col=SEV_COL[c.severity];
                const sel=selected?.id===c.id;
                return (
                  <g key={c.id} onClick={()=>setSelected(sel?null:c)} style={{ cursor:"pointer" }}>
                    {c.severity==="Critical"&&<circle cx={x} cy={y} r={25} fill={col} opacity=".15" style={{ animation:"pulse 2s infinite" }}/>}
                    
                    {sel && (
                      <circle cx={x} cy={y} r={22} fill="none" stroke={col} strokeWidth="2" strokeDasharray="4 4" style={{animation: "spin 4s linear infinite", transformOrigin: `${x}px ${y}px`}}/>
                    )}

                    <circle cx={x} cy={y} r={sel?14:9} fill={col} stroke="var(--bg)" strokeWidth={2}
                      style={{ transition:"all .3s" }}/>
                    <text x={x} y={y-20} textAnchor="middle" fontSize={sel?12:0} fontFamily="Inter" fontWeight="800" fill="var(--text)">{c.village.toUpperCase()}</text>
                  </g>
                );
              })}
            </svg>
          </Card>

          <div style={{ flex: "1 1 300px", display:"flex", flexDirection:"column", gap:20 }}>
            {selected ? (
              <Card style={{ animation:"fadeIn .3s ease", border:`1px solid ${SEV_COL[selected.severity]}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
                  <h4 style={{ color:SEV_COL[selected.severity], fontSize:"1rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>Node Data</h4>
                  <button onClick={()=>setSelected(null)} style={{ background:"var(--surface2)", border:"none", borderRadius:8, width:32,height:32, cursor:"pointer", color:"var(--text)", fontSize:"1.2rem", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                </div>
                <div style={{ textAlign:"center", marginBottom:24 }}>
                  <div style={{ fontSize:"3rem" }}>{selected.img}</div>
                  <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, color:"var(--text)", marginTop:12, fontSize:"1.3rem" }}>{selected.village}</div>
                  <div style={{ fontSize:"0.85rem", color:"var(--muted)", marginTop:4 }}>{selected.id}</div>
                </div>
                
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:24 }}>
                  <div style={{ background:"var(--surface2)", borderRadius:8, padding:"12px", border:"1px solid var(--border)" }}>
                    <div style={{ fontSize:"0.7rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:4, fontWeight: 700 }}>Classification</div>
                    <div style={{ fontWeight:700, fontSize:"0.95rem", color:"var(--text)" }}>{selected.issue}</div>
                  </div>
                  <div style={{ background:"var(--surface2)", borderRadius:8, padding:"12px", border:"1px solid var(--border)" }}>
                    <div style={{ fontSize:"0.7rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:4, fontWeight: 700 }}>Source</div>
                    <div style={{ fontWeight:700, fontSize:"0.95rem", color:"var(--blue)" }}>{selected.author}</div>
                  </div>
                </div>
                
                <div style={{ display:"flex", justifyContent: "center", gap:12, marginBottom: 20 }}>
                  <Badge label={`TIER: ${selected.severity.toUpperCase()}`} color={SEV_COL[selected.severity]} bg={SEV_BG[selected.severity]}/>
                  <Badge label={`STATE: ${selected.status.toUpperCase()}`} color={STA_COL[selected.status]} bg={STA_BG[selected.status]}/>
                </div>
              </Card>
            ) : (
              <Card style={{ padding: "40px 24px", textAlign: "center" }}>
                 <div style={{ fontSize: "4rem", marginBottom: 20, opacity: 0.8, animation: "pulse 2s infinite" }}>🛰️</div>
                 <h4 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 8 }}>Awaiting Selection</h4>
                 <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.6 }}>Tap any illuminated node on the radar map to interface with its telemetry data.</p>
              </Card>
            )}

            <Card>
              <h4 style={{ marginBottom:20, fontSize:"1rem", color:"var(--text)", fontWeight: 700 }}>🏥 Sector Integrity</h4>
              {areas.map(a=>{
                const sc=health[a];
                const col=sc>=80?"var(--green)":sc>=60?"var(--yellow)":sc>=40?"var(--orange)":"var(--red)";
                const bg=sc>=80?"var(--green-bg)":sc>=60?"var(--yellow-bg)":sc>=40?"var(--orange-bg)":"var(--red-bg)";
                return (
                  <div key={a} style={{ marginBottom:16 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                      <span style={{ fontSize:"0.85rem", fontWeight:600, color: "var(--text)" }}>{a}</span>
                      <span style={{ fontSize:"0.8rem", fontWeight:800, color:col, background:bg, padding:"2px 8px", borderRadius:6 }}>{sc}%</span>
                    </div>
                    <div style={{ height:6, background:"var(--surface2)", borderRadius:3, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${sc}%`, background:col, borderRadius:3, transition:"width 1.2s ease" }}/>
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── PAGE: ADMIN DASHBOARD ─────────────────────────────────────────────────────
const AdminDashboard = ({ complaints, setComplaints, setPage }) => {
  const [filter, setFilter] = useState({ severity:"all", status:"all", search:"" });
  const [selectedActionId, setSelectedActionId] = useState(null);
  const [actionPlan, setActionPlan] = useState("");
  const [isPlanning, setIsPlanning] = useState(false);
  
  const pending = complaints.filter(c => c.status === "Pending" || c.status === "Assigned");
  const inProgress = complaints.filter(c => c.status === "In Progress");
  const resolved = complaints.filter(c => c.status === "Resolved");
  
  const filtered = complaints.filter(c=>{
    if(filter.severity!=="all"&&c.severity!==filter.severity) return false;
    if(filter.status!=="all"&&c.status!==filter.status) return false;
    if(filter.search&&!c.village.toLowerCase().includes(filter.search.toLowerCase())&&!c.id.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  const upd = (id,status)=>{ setComplaints(cs=>cs.map(c=>c.id===id?{...c,status}:c)); };

  const handleGeneratePlan = async (complaint) => {
    if(isPlanning) return;
    setSelectedActionId(complaint.id);
    setIsPlanning(true);
    setActionPlan("");
    const prompt = `Act as a municipal civil engineering assistant. Generate a brief, bulleted 3-step action plan and a short list of required materials to resolve a ${complaint.severity} severity '${complaint.issue}' in '${complaint.village}'. The citizen reported: '${complaint.desc}'. Keep it concise and professional.`;
    const plan = await callGeminiAPI(prompt);
    setActionPlan(plan);
    setIsPlanning(false);
  };

  const StatCard = ({ label, count, color, bg }) => (
    <Card style={{ padding: "24px", borderLeft: `4px solid ${color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "0.85rem", color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>{label}</div>
          <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--text)", lineHeight: 1 }}>{count}</div>
        </div>
        <div style={{ width: 50, height: 50, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
           <div style={{ width: 16, height: 16, borderRadius: "50%", background: color }}/>
        </div>
      </div>
    </Card>
  );

  const sel = { background:"var(--bg)", border:"1px solid var(--border)", borderRadius:"8px",
    padding:"10px 16px", color:"var(--text)", fontSize:"0.9rem", outline:"none", fontWeight: 500 };

  return (
    <div style={{ paddingTop:130, minHeight:"100vh" }} className="animate-slide">
      <div style={{ width: "100%", padding:"0 40px 80px" }}>
        
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:16, marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize:"2.2rem", fontWeight:800, color:"var(--text)", marginBottom:6 }}>Command Center</h1>
            <p style={{ color:"var(--muted)", fontSize:"1rem" }}>Master overview of regional infrastructure integrity.</p>
          </div>
          <Btn onClick={()=>setPage("analytics")} variant="secondary" style={{ padding: "12px 24px" }}>System Analytics →</Btn>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:20, marginBottom:32 }}>
          <StatCard label="Total Nodes" count={complaints.length} color="var(--text)" bg="var(--surface2)" />
          <StatCard label="Red Flags" count={pending.length} color="var(--red)" bg="var(--red-bg)" />
          <StatCard label="In Progress" count={inProgress.length} color="var(--purple, #b330ff)" bg="rgba(179, 48, 255, 0.15)" />
          <StatCard label="Secured" count={resolved.length} color="var(--green)" bg="var(--green-bg)" />
        </div>

        <Card style={{ marginBottom:20, padding:"20px" }}>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap", alignItems:"center" }}>
            <input value={filter.search} onChange={e=>setFilter(f=>({...f,search:e.target.value}))}
              placeholder="Search ID or Sector..." style={{ flex:1, minWidth:200,
              background:"var(--bg)", border:"1px solid var(--border)", borderRadius:"8px",
              padding:"10px 16px", color:"var(--text)", fontSize:"0.95rem", outline:"none" }}/>
            <select value={filter.severity} onChange={e=>setFilter(f=>({...f,severity:e.target.value}))} style={sel}>
              <option value="all">All Severities</option>
              {["Critical","High","Medium","Low"].map(s=><option key={s} value={s}>{s.toUpperCase()}</option>)}
            </select>
            <select value={filter.status} onChange={e=>setFilter(f=>({...f,status:e.target.value}))} style={sel}>
              <option value="all">All States</option>
              {["Pending","Assigned","In Progress","Resolved"].map(s=><option key={s} value={s}>{s.toUpperCase()}</option>)}
            </select>
            {(filter.search||filter.severity!=="all"||filter.status!=="all")&&(
              <Btn onClick={()=>setFilter({severity:"all",status:"all",search:""})} variant="danger" style={{ padding:"10px 20px" }}>Reset Filter</Btn>
            )}
          </div>
        </Card>

        <Card style={{ padding:0, overflow:"hidden", border: "1px solid var(--border)" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background:"var(--surface2)" }}>
                  <th style={{ padding:"16px 24px", fontSize:"0.8rem", color:"var(--muted)", fontWeight:700, textTransform:"uppercase", letterSpacing:"1px", borderBottom:"1px solid var(--border)" }}>ID & Location</th>
                  <th style={{ padding:"16px 24px", fontSize:"0.8rem", color:"var(--muted)", fontWeight:700, textTransform:"uppercase", letterSpacing:"1px", borderBottom:"1px solid var(--border)" }}>Source</th>
                  <th style={{ padding:"16px 24px", fontSize:"0.8rem", color:"var(--muted)", fontWeight:700, textTransform:"uppercase", letterSpacing:"1px", borderBottom:"1px solid var(--border)" }}>Threat Class</th>
                  <th style={{ padding:"16px 24px", fontSize:"0.8rem", color:"var(--muted)", fontWeight:700, textTransform:"uppercase", letterSpacing:"1px", borderBottom:"1px solid var(--border)" }}>Status</th>
                  <th style={{ padding:"16px 24px", fontSize:"0.8rem", color:"var(--muted)", fontWeight:700, textTransform:"uppercase", letterSpacing:"1px", borderBottom:"1px solid var(--border)", textAlign: "right" }}>Command Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c)=>(
                  <React.Fragment key={c.id}>
                    <tr style={{ borderBottom:"1px solid var(--border)", transition: "background 0.2s" }} onMouseEnter={e=>e.currentTarget.style.background="var(--surface2)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{ padding:"20px 24px" }}>
                        <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--text)", marginBottom: 4 }}>{c.id}</div>
                        <div style={{ fontSize: "0.85rem", color: "var(--muted)", fontFamily: "'JetBrains Mono', monospace" }}>{c.village.toUpperCase()}</div>
                      </td>
                      <td style={{ padding:"20px 24px", fontSize: "0.95rem", color: "var(--blue)", fontWeight: 600 }}>{c.author || "Unknown"}</td>
                      <td style={{ padding:"20px 24px" }}>
                        <div style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>{c.issue}</div>
                        <Badge label={c.severity.toUpperCase()} color={SEV_COL[c.severity]} bg={SEV_BG[c.severity]}/>
                      </td>
                      <td style={{ padding:"20px 24px" }}>
                        <Badge label={c.status.toUpperCase()} color={STA_COL[c.status]} bg={STA_BG[c.status]}/>
                      </td>
                      <td style={{ padding:"20px 24px", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", alignItems: "center" }}>
                          <Btn onClick={() => handleGeneratePlan(c)} disabled={isPlanning && selectedActionId === c.id} variant="secondary" style={{ padding: "8px 12px", fontSize: "0.8rem", borderColor: "var(--text)", color: "var(--text)" }}>
                            {isPlanning && selectedActionId === c.id ? "✨ Planning..." : "✨ AI Strategy"}
                          </Btn>
                          <select 
                            value={c.status} 
                            onChange={e => upd(c.id, e.target.value)}
                            style={{ padding: "8px 12px", fontSize: "0.85rem", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", cursor: "pointer", fontWeight: 600 }}
                          >
                            <option value="Pending">Set: PENDING</option>
                            <option value="Assigned">Set: ASSIGNED</option>
                            <option value="In Progress">Set: IN PROGRESS</option>
                            <option value="Resolved">Set: RESOLVED</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                    {selectedActionId === c.id && actionPlan && (
                      <tr style={{ background: "var(--surface2)" }}>
                        <td colSpan={5} style={{ padding: "24px 32px", borderBottom: "1px solid var(--border)" }}>
                          <div style={{ fontSize: "0.9rem", color: "var(--text)", fontWeight: 800, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: "1.2rem" }}>✨</span> AI Recommended Resolution Protocol
                          </div>
                          <div style={{ fontSize: "0.95rem", color: "var(--text)", lineHeight: 1.7, whiteSpace: "pre-wrap", background: "var(--bg)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border)" }}>{actionPlan}</div>
                          <div style={{ textAlign: "right" }}>
                            <Btn onClick={() => setSelectedActionId(null)} variant="secondary" style={{ marginTop: 16, padding: "8px 20px" }}>Dismiss Plan</Btn>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {filtered.length === 0 && <tr><td colSpan={5} style={{ padding: "60px", textAlign: "center", color: "var(--muted)", fontSize: "1rem" }}>No records match current parameters.</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ── PAGE: ANALYTICS ───────────────────────────────────────────────────────────
const AnalyticsPage = ({ complaints }) => {
  const byType={}, bySev={}, stDist={};
  complaints.forEach(c=>{ byType[c.issue]=(byType[c.issue]||0)+1; bySev[c.severity]=(bySev[c.severity]||0)+1; stDist[c.status]=(stDist[c.status]||0)+1; });

  const BarChart = ({ data, colorMap, title }) => {
    const max=Math.max(...Object.values(data),1);
    return (
      <Card>
        <h3 style={{ marginBottom:24, fontSize:"1.1rem", color:"var(--text)", fontWeight: 700 }}>{title}</h3>
        {Object.entries(data).map(([k,v])=>{
          const col=colorMap[k]||"var(--text)";
          return (
            <div key={k} style={{ marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:"0.9rem", color:"var(--text)", fontWeight: 500 }}>{k}</span>
                <span style={{ fontSize:"0.85rem", fontWeight:800, color:col }}>{v} Units</span>
              </div>
              <div style={{ height:10, background:"var(--surface2)", borderRadius:5, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${(v/max)*100}%`, background:col, borderRadius:5, transition:"width 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)" }}/>
              </div>
            </div>
          );
        })}
      </Card>
    );
  };

  const Donut = ({ data }) => {
    const total=Object.values(data).reduce((a,b)=>a+b,0)||1;
    let off=0;
    const segs=Object.entries(data).map(([k,v])=>{ const p=v/total; const s={k,v,p,off}; off+=p; return s; });
    const r=70,cx=100,cy=100;
    return (
      <Card style={{ display: "flex", flexDirection: "column" }}>
        <h3 style={{ marginBottom:24, fontSize:"1.1rem", color:"var(--text)", fontWeight: 700 }}>🎯 State Distribution</h3>
        <div style={{ display:"flex", alignItems:"center", gap:32, flexWrap:"wrap", flex: 1, justifyContent: "center" }}>
          <div style={{ position: "relative", width: 200, height: 200 }}>
             <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: "rotate(-90deg)" }}>
               {segs.map(({k,p,off})=>{
                 const col=STA_COL[k]||"var(--muted)";
                 const dash = p * 2 * Math.PI * r;
                 const offset = off * 2 * Math.PI * r;
                 return <circle key={k} cx={cx} cy={cy} r={r} fill="none" stroke={col} strokeWidth="20" strokeDasharray={`${dash} ${2*Math.PI*r}`} strokeDashoffset={-offset} style={{ transition: "all 1s" }}/>;
               })}
             </svg>
             <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", fontWeight: 800, color: "var(--text)" }}>
               {total}
             </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {Object.entries(data).map(([k,v])=>(
              <div key={k} style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:12,height:12,borderRadius:4,background:STA_COL[k]||"var(--muted)" }}/>
                <span style={{ fontSize:"0.9rem", color:"var(--text)", fontWeight: 500 }}>{k.toUpperCase()}: <b style={{ color: STA_COL[k] }}>{v}</b></span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  };

  const summary=[
    { label:"Resolution Rate", val:`${Math.round((complaints.filter(c=>c.status==="Resolved").length/complaints.length||0)*100)}%`, icon:"✓", color:"var(--green)", bg:"var(--green-bg)" },
    { label:"Avg Impact Score", val:Math.round(complaints.reduce((a,c)=>a+c.score,0)/complaints.length||0), icon:"⭐", color:"var(--orange)", bg:"var(--orange-bg)" },
    { label:"Red Flags", val:complaints.filter(c=>c.severity==="Critical"&&c.status==="Pending").length, icon:"🚨", color:"var(--red)", bg:"var(--red-bg)" },
    { label:"Affected Sectors", val:[...new Set(complaints.map(c=>c.village))].length, icon:"📍", color:"var(--blue)", bg:"var(--blue-bg)" },
  ];

  return (
    <div style={{ paddingTop:130, minHeight:"100vh" }} className="animate-slide">
      <div style={{ width: "100%", padding:"32px 40px 80px", animation:"fadeUp .4s ease" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:20, marginBottom:32 }}>
          {summary.map((s,i)=>(
            <Card key={i} style={{ display:"flex", alignItems:"center", gap: 16, padding: "24px" }}>
              <div style={{ fontSize:"2rem", color:s.color, background: s.bg, width: 60, height: 60, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize:"2rem", fontWeight:800, color:"var(--text)", lineHeight:1, marginBottom: 4 }}>{s.val}</div>
                <div style={{ color:"var(--muted)", fontSize:"0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</div>
              </div>
            </Card>
          ))}
        </div>

        <div style={{ display:"flex", flexWrap:"wrap", gap:24 }}>
          <div style={{ flex: "1 1 300px" }}>
             <BarChart data={byType} title="THREAT DISTRIBUTION" colorMap={{ Pothole:"var(--red)", Waterlogging:"var(--blue)","Cracked Road":"var(--yellow)","Road Blockage":"var(--orange)","Damaged Culvert":"var(--blue2)","Surface Erosion":"var(--green)" }}/>
          </div>
          <div style={{ flex: "1 1 300px" }}>
             <BarChart data={bySev} title="SEVERITY METRICS" colorMap={SEV_COL}/>
          </div>
          <div style={{ flex: "1 1 300px" }}>
             <Donut data={stDist}/>
          </div>
          
          <Card style={{ flex: "1 1 100%" }}>
            <h3 style={{ marginBottom:20, fontSize:"1.1rem", color:"var(--text)", fontWeight: 700 }}>🏆 Vulnerable Sectors</h3>
            {[...new Set(complaints.map(c=>c.village))].map((v,i)=>{
              const cnt=complaints.filter(c=>c.village===v).length;
              const avg=Math.round(complaints.filter(c=>c.village===v).reduce((a,c)=>a+c.score,0)/cnt);
              const isTop = i < 2;
              return (
                <div key={v} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 0", borderBottom:"1px solid var(--border)" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                    <div style={{ fontSize:"1.2rem", fontWeight: 800, color: isTop ? "var(--red)" : "var(--muted)" }}>0{i+1}</div>
                    <div>
                      <div style={{ fontSize:"1rem", fontWeight:700, color: "var(--text)" }}>{v.toUpperCase()}</div>
                      <div style={{ fontSize:"0.8rem", color:"var(--muted)", marginTop: 2 }}>{cnt} Detections</div>
                    </div>
                  </div>
                  <Badge label={`AVG S: ${avg}`} color={avg>=70?"var(--red)":avg>=50?"var(--orange)":"var(--yellow)"} bg="transparent"/>
                </div>
              );
            })}
          </Card>
        </div>
      </div>
    </div>
  );
};

// ── ROOT APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [user, setUser] = useState(null); 
  const [page, setPage] = useState("home");
  const [isDark, setIsDark] = useState(true);
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
  
  const addComplaint = c => setComplaints(cs=>[c,...cs]);

  useEffect(()=>{
    const s=document.createElement("style");
    s.textContent=globalStyles;
    document.head.appendChild(s);
    return()=>document.head.removeChild(s);
  },[]);

  const toggleTheme = () => setIsDark(!isDark);
  const handleLogout = () => { setUser(null); setPage("home"); };

  const renderPage = () => {
    if (user?.role === "admin") {
      switch(page) {
        case "admin": return <AdminDashboard complaints={complaints} setComplaints={setComplaints} setPage={setPage}/>;
        case "analytics": return <AnalyticsPage complaints={complaints}/>;
        case "about": return <AboutPage />;
        default: return <AdminDashboard complaints={complaints} setComplaints={setComplaints} setPage={setPage}/>;
      }
    } else {
      switch(page){
        case "home":   return <HomePage setPage={setPage}/>;
        case "report": return <ReportPage setPage={setPage} addComplaint={addComplaint} user={user}/>;
        case "track":  return <TrackPage complaints={complaints}/>;
        case "map":    return <MapPage complaints={complaints}/>;
        case "about":  return <AboutPage />;
        default:       return <HomePage setPage={setPage}/>;
      }
    }
  };

  if (showIntro) return <div className="theme-wrapper" data-theme={isDark ? "dark" : "light"}><IntroScreen onComplete={() => setShowIntro(false)} /></div>;

  if (!user) return <div className="theme-wrapper" data-theme={isDark ? "dark" : "light"}><AuthPage onLogin={(u) => { setUser(u); setPage(u.role === 'admin' ? 'admin' : 'home'); }} toggleTheme={toggleTheme} isDark={isDark} /></div>;

  return (
    <div className="theme-wrapper" data-theme={isDark ? "dark" : "light"}>
      <Navbar page={page} setPage={setPage} user={user} onLogout={handleLogout} toggleTheme={toggleTheme} isDark={isDark} />
      <div key={page} style={{ animation: "fadeIn 0.3s ease" }}>
        {renderPage()}
      </div>
      <Chatbot />
    </div>
  );
}  