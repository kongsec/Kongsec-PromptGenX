import { useState, useEffect, useRef } from "react";

const uid = () => Math.random().toString(36).slice(2, 9);
const nowTime = () => new Date().toLocaleTimeString("en-US", { hour12: false });

const MODULES = [
  { id: "enhancer", icon: "◈", label: "Prompt Enhancer", tag: "CORE" },
  { id: "recon",    icon: "⬡", label: "Recon Generator", tag: "MOD" },
  { id: "js",       icon: "◇", label: "JS Hunter",       tag: "MOD" },
  { id: "urlscan",  icon: "◉", label: "URLScan Hunter",  tag: "MOD" },
  { id: "report",   icon: "▦", label: "Report Writer",   tag: "MOD" },
];
const DIFFICULTIES = ["Beginner", "Intermediate", "Elite"];
const MODELS = ["Claude", "GPT", "Gemini"];

const SYS = {
  enhancer: `You are a senior prompt engineering specialist for bug bounty automation. Transform the following basic prompt into an elite, production-ready AI prompt that includes:
- A specific expert role definition
- Environment assumptions (Ubuntu/WSL2, bash, python3, go tooling)
- Strict constraints (authorized targets only, passive/safe methods only)
- Detailed output format requirements (JSON/CSV/Markdown)
- Error handling and retry logic requirements
- Structured logging with timestamps
- CLI flag specifications (--target, --output, --verbose, --threads)
- Performance tuning guidance
- Modular, testable code structure
- ETHICAL constraints explicitly stated
Return ONLY the enhanced prompt, no commentary.`,
  recon: `You are a senior reconnaissance automation engineer for authorized bug bounty programs. Enhance this prompt to generate a comprehensive passive recon script covering:
- Subdomain enumeration (passive: crt.sh, dnsdumpster, subfinder)
- DNS resolution and live host detection
- HTTP/HTTPS probing with status codes
- Technology fingerprinting
- Wayback Machine URL collection
- Structured JSON/CSV output with timestamps
- Rate limiting
- Modular bash/python3 implementation
- CLI: --domain, --output-dir, --threads, --format
Return ONLY the enhanced prompt.`,
  js: `You are an elite JavaScript analysis engineer for bug bounty programs. Enhance this prompt to generate a JS endpoint hunter that:
- Fetches and parses JavaScript files from a target domain
- Extracts API endpoints, secret patterns, and sensitive paths via regex
- Integrates with gau/waybackurls for JS file discovery
- Outputs findings to JSON with severity classification
- Includes false-positive filtering
- CLI: --target, --depth, --output, --secrets-only
Return ONLY the enhanced prompt.`,
  urlscan: `You are a threat intelligence and URL analysis engineer. Enhance this prompt to build a URLScan.io integration tool that:
- Queries URLScan.io API for historical scans of target domains
- Extracts interesting endpoints, cookies, headers, and DOM data
- Identifies exposed admin panels, API routes, and sensitive paths
- Outputs structured JSON report with risk scores
- Handles API pagination and rate limits
- CLI: --domain, --api-key, --since, --output
Return ONLY the enhanced prompt.`,
  report: `You are a senior penetration testing report writer. Enhance this prompt to generate a professional vulnerability report that:
- Follows standard structure: Summary, Impact, Steps to Reproduce, Evidence, Remediation
- Includes CVSS 3.1 score
- Maps to OWASP Top 10 / CWE
- Provides clear reproducible PoC steps
- Formats for HackerOne/Bugcrowd standards
- Professional, factual tone
Return ONLY the enhanced prompt.`,
};

const DIFF_SUFFIX = {
  Beginner: "\n\nKeep the output simple and well-commented for learning. Prioritize clarity.",
  Intermediate: "\n\nBalance clarity with production features. Include error handling, logging, and modular structure.",
  Elite: "\n\nGenerate production-grade elite code with advanced error handling, concurrency, structured logging, JSON schema validation, unit test stubs, and Dockerfile. Expert-level audience.",
};
const MODEL_SUFFIX = {
  Claude: "\n\nOptimize for Claude: use XML tags for structure, leverage extended thinking, format constraints clearly.",
  GPT: "\n\nOptimize for GPT-4: use markdown headers, numbered lists, and clear system/user role separation.",
  Gemini: "\n\nOptimize for Gemini: use clear section delimiters and explicit output format instructions.",
};

function GridBG() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    const ctx = c.getContext("2d");
    let id, t = 0;
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      const cw = c.width / 40, ch = c.height / 22;
      ctx.strokeStyle = "rgba(0,200,255,0.045)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= 40; x++) { ctx.beginPath(); ctx.moveTo(x*cw,0); ctx.lineTo(x*cw,c.height); ctx.stroke(); }
      for (let y = 0; y <= 22; y++) { ctx.beginPath(); ctx.moveTo(0,y*ch); ctx.lineTo(c.width,y*ch); ctx.stroke(); }
      t += 0.007;
      for (let x = 0; x <= 40; x += 4) for (let y = 0; y <= 22; y += 3) {
        const a = (Math.sin(t + x*0.3 + y*0.5)*0.5+0.5)*0.3;
        ctx.fillStyle = `rgba(0,200,255,${a})`;
        ctx.beginPath(); ctx.arc(x*cw, y*ch, 1.5, 0, Math.PI*2); ctx.fill();
      }
      const sy = (Math.sin(t*0.4)*0.5+0.5)*c.height;
      const g = ctx.createLinearGradient(0,sy-80,0,sy+80);
      g.addColorStop(0,"rgba(0,200,255,0)"); g.addColorStop(0.5,"rgba(0,200,255,0.03)"); g.addColorStop(1,"rgba(0,200,255,0)");
      ctx.fillStyle = g; ctx.fillRect(0,sy-80,c.width,160);
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}} />;
}

function AuthGate({ onAuth }) {
  const [checked, setChecked] = useState(false);
  const [booting, setBooting] = useState(false);
  const [lines, setLines] = useState([]);
  const bootSeq = [
    "INITIALIZING KONGSEC INTELLIGENCE LAYER...",
    "LOADING ENCRYPTION MODULES... OK",
    "ETHICS GATE MODULE: ACTIVE",
    "AUTHORIZED RESEARCH PROTOCOLS: LOADED",
    "VERIFYING OPERATOR CLEARANCE...",
    "ACCESS GRANTED. WELCOME, OPERATOR.",
  ];
  const go = () => {
    if (!checked) return;
    setBooting(true);
    let i = 0;
    const iv = setInterval(() => {
      setLines(p => [...p, bootSeq[i]]); i++;
      if (i >= bootSeq.length) { clearInterval(iv); setTimeout(onAuth, 700); }
    }, 300);
  };
  return (
    <div style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(0,4,14,0.97)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{border:"1px solid rgba(0,200,255,0.25)",background:"rgba(0,12,30,0.96)",backdropFilter:"blur(24px)",padding:"48px 52px",maxWidth:540,width:"90%",boxShadow:"0 0 80px rgba(0,200,255,0.08),inset 0 0 80px rgba(0,200,255,0.015)",position:"relative"}}>
        {[{top:8,left:8,borderTop:"1px solid #00c8ff",borderLeft:"1px solid #00c8ff"},{top:8,right:8,borderTop:"1px solid #00c8ff",borderRight:"1px solid #00c8ff"},{bottom:8,left:8,borderBottom:"1px solid #00c8ff",borderLeft:"1px solid #00c8ff"},{bottom:8,right:8,borderBottom:"1px solid #00c8ff",borderRight:"1px solid #00c8ff"}].map((s,i)=><div key={i} style={{position:"absolute",width:12,height:12,...s}} />)}
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{color:"rgba(0,200,255,0.45)",fontSize:9,letterSpacing:7,marginBottom:10,fontFamily:"'Courier New',monospace"}}>KONGSEC INTELLIGENCE SYSTEMS</div>
          <div style={{color:"#ff4040",fontSize:12,letterSpacing:4,marginBottom:20,fontFamily:"'Courier New',monospace",textShadow:"0 0 12px rgba(255,64,64,0.5)"}}>⚠ AUTHORIZED USE ONLY ⚠</div>
          <div style={{color:"#00c8ff",fontSize:20,fontWeight:700,letterSpacing:3,fontFamily:"'Courier New',monospace",textShadow:"0 0 24px rgba(0,200,255,0.4)"}}>OPERATOR CLEARANCE REQUIRED</div>
        </div>
        <p style={{color:"rgba(160,210,255,0.65)",fontSize:12,lineHeight:1.8,marginBottom:28,fontFamily:"'Courier New',monospace"}}>
          This system is exclusively for authorized bug bounty research and security assessment. Unauthorized use is strictly prohibited and may be subject to legal action.
        </p>
        {!booting ? (
          <>
            <label style={{display:"flex",alignItems:"flex-start",gap:12,cursor:"pointer",marginBottom:28}}>
              <div onClick={()=>setChecked(!checked)} style={{width:16,height:16,border:`1px solid ${checked?"#00c8ff":"rgba(0,200,255,0.25)"}`,background:checked?"rgba(0,200,255,0.15)":"transparent",flexShrink:0,marginTop:2,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s",boxShadow:checked?"0 0 12px rgba(0,200,255,0.25)":"none"}}>
                {checked && <span style={{color:"#00c8ff",fontSize:11}}>✓</span>}
              </div>
              <span style={{color:"rgba(160,210,255,0.75)",fontSize:11,fontFamily:"'Courier New',monospace",lineHeight:1.6}}>I confirm I am an authorized security researcher and will only use this system for legitimate, permissioned bug bounty activities.</span>
            </label>
            <button onClick={go} disabled={!checked} style={{width:"100%",padding:14,background:checked?"rgba(0,200,255,0.09)":"rgba(0,200,255,0.02)",border:`1px solid ${checked?"rgba(0,200,255,0.45)":"rgba(0,200,255,0.08)"}`,color:checked?"#00c8ff":"rgba(0,200,255,0.25)",fontFamily:"'Courier New',monospace",fontSize:12,letterSpacing:5,cursor:checked?"pointer":"not-allowed",transition:"all 0.3s",boxShadow:checked?"0 0 24px rgba(0,200,255,0.1)":"none"}}>
              AUTHENTICATE OPERATOR
            </button>
          </>
        ) : (
          <div style={{fontFamily:"'Courier New',monospace",fontSize:11,color:"#00c8ff"}}>
            {lines.map((l,i)=><div key={i} style={{marginBottom:7,opacity:0.85}}><span style={{color:"rgba(0,200,255,0.35)",marginRight:8}}>[{String(i).padStart(2,"0")}]</span>{l}</div>)}
            {lines.length < bootSeq.length && <span style={{animation:"blink 0.8s infinite"}}>█</span>}
          </div>
        )}
      </div>
    </div>
  );
}

function Console({ logs }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [logs]);
  return (
    <div ref={ref} style={{height:108,background:"rgba(0,4,12,0.92)",borderTop:"1px solid rgba(0,200,255,0.08)",fontFamily:"'Courier New',monospace",fontSize:11,overflowY:"auto",padding:"8px 18px",flexShrink:0}}>
      <div style={{color:"rgba(0,200,255,0.3)",fontSize:9,letterSpacing:3,marginBottom:5}}>SYS CONSOLE</div>
      {logs.map((l,i)=>(
        <div key={i} style={{marginBottom:3}}>
          <span style={{color:"rgba(0,200,255,0.3)"}}>[{l.t}] </span>
          <span style={{color:l.type==="error"?"#ff6b6b":l.type==="success"?"#00ffb3":"rgba(160,210,255,0.55)"}}>{l.msg}</span>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [mod, setMod] = useState("enhancer");
  const [tab, setTab] = useState("editor");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [diff, setDiff] = useState("Intermediate");
  const [model, setModel] = useState("Claude");
  const [opts, setOpts] = useState({logging:true,tests:false,docker:false,ci:false});
  const [logs, setLogs] = useState([
    {t:nowTime(),msg:"KONGSEC INTELLIGENCE CONSOLE v2.4 INITIALIZED",type:"success"},
    {t:nowTime(),msg:"Ethics gate active. Authorized operators only.",type:"info"},
  ]);
  const [history, setHistory] = useState(()=>{ try{return JSON.parse(localStorage.getItem("kx_hist")||"[]")}catch{return[]} });
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  const addLog = (msg, type="info") => setLogs(p=>[...p.slice(-59),{t:nowTime(),msg,type}]);

  const buildSys = () => {
    let s = SYS[mod] || SYS.enhancer;
    s += DIFF_SUFFIX[diff];
    s += MODEL_SUFFIX[model];
    const ex=[];
    if(opts.logging) ex.push("Include structured logging with timestamps and log levels.");
    if(opts.tests) ex.push("Include unit test stubs and example test cases.");
    if(opts.docker) ex.push("Include a production-ready Dockerfile.");
    if(opts.ci) ex.push("Include a GitHub Actions CI workflow YAML.");
    if(ex.length) s+="\n\nAdditional requirements:\n"+ex.map(e=>`- ${e}`).join("\n");
    return s;
  };

  const enhance = async () => {
    if (!input.trim()) { addLog("ERROR: No input prompt provided.", "error"); return; }
    setLoading(true); setOutput("");
    addLog(`Enhancing via ${model} optimization layer · ${diff} tier...`,"info");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system:buildSys(),
          messages:[{role:"user",content:input}],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b=>b.text||"").join("")||"";
      setOutput(text);
      addLog("Enhancement complete. Output ready for deployment.","success");
      const entry={id:uid(),mod,diff,model,input,output:text,ts:new Date().toISOString()};
      const nh=[entry,...history].slice(0,50);
      setHistory(nh); localStorage.setItem("kx_hist",JSON.stringify(nh));
    } catch(e) { addLog(`NETWORK ERROR: ${e.message}`,"error"); }
    finally { setLoading(false); }
  };

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); addLog("Prompt copied to clipboard.","success"); setTimeout(()=>setCopied(false),2000); };
  const dl = (ext) => { const b=new Blob([output],{type:"text/plain"}); const u=URL.createObjectURL(b); const a=document.createElement("a"); a.href=u; a.download=`kongsec-prompt.${ext}`; a.click(); addLog(`Exported as .${ext}`,"success"); };
  const filtered = history.filter(h=>!search||h.input.toLowerCase().includes(search.toLowerCase())||h.mod.includes(search));

  if (!authed) return (
    <>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}} body{margin:0;padding:0;overflow:hidden}`}</style>
      <GridBG />
      <AuthGate onAuth={()=>setAuthed(true)} />
    </>
  );

  const timeStr = new Date().toLocaleTimeString("en-US",{hour12:false});
  const activeMod = MODULES.find(m=>m.id===mod);

  return (
    <div style={{minHeight:"100vh",background:"#000a1a",color:"#c8e8ff",fontFamily:"'Courier New',monospace",display:"flex",flexDirection:"column",position:"relative"}}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        body{margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:rgba(0,200,255,0.02)}
        ::-webkit-scrollbar-thumb{background:rgba(0,200,255,0.18);border-radius:2px}
        textarea{resize:none;outline:none}
        textarea:focus{border-color:rgba(0,200,255,0.45)!important;box-shadow:0 0 24px rgba(0,200,255,0.06)!important}
        input{outline:none}
        input:focus{border-color:rgba(0,200,255,0.45)!important}
      `}</style>
      <GridBG />

      {/* TOP BAR */}
      <div style={{position:"relative",zIndex:10,background:"rgba(0,5,16,0.9)",backdropFilter:"blur(24px)",borderBottom:"1px solid rgba(0,200,255,0.1)"}}>
        <div style={{display:"flex",alignItems:"center",padding:"0 20px",height:50,gap:16}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:30,height:30,border:"1px solid rgba(0,200,255,0.35)",display:"flex",alignItems:"center",justifyContent:"center",color:"#00c8ff",fontSize:15,boxShadow:"0 0 16px rgba(0,200,255,0.2)",flexShrink:0}}>◈</div>
            <div>
              <div style={{fontSize:12,fontWeight:700,letterSpacing:3,color:"#00c8ff",textShadow:"0 0 12px rgba(0,200,255,0.3)"}}>KONGSEC</div>
              <div style={{fontSize:7,color:"rgba(0,200,255,0.35)",letterSpacing:2}}>PROMPT INTELLIGENCE CONSOLE</div>
            </div>
          </div>
          <div style={{display:"flex",gap:3,marginLeft:"auto"}}>
            {[["EDITOR","editor"],["HISTORY","history"]].map(([label,t])=>(
              <button key={t} onClick={()=>setTab(t)} style={{padding:"5px 14px",background:tab===t?"rgba(0,200,255,0.1)":"transparent",border:`1px solid ${tab===t?"rgba(0,200,255,0.35)":"rgba(0,200,255,0.08)"}`,color:tab===t?"#00c8ff":"rgba(0,200,255,0.4)",fontSize:8,letterSpacing:2,cursor:"pointer",transition:"all 0.2s"}}>{label}</button>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:20,marginLeft:12}}>
            <span style={{fontSize:9,color:"rgba(0,200,255,0.3)",letterSpacing:1}}>{timeStr} UTC</span>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:"#00ffb3",boxShadow:"0 0 8px #00ffb3",animation:"pulse 2s infinite"}}/>
              <span style={{fontSize:8,color:"#00ffb3",letterSpacing:2}}>ONLINE</span>
            </div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",padding:"4px 20px",borderTop:"1px solid rgba(0,200,255,0.05)",background:"rgba(0,3,10,0.5)"}}>
          <span style={{fontSize:8,color:"rgba(0,200,255,0.3)",letterSpacing:2}}>SYSTEM STATUS: <span style={{color:"#00ffb3"}}>ALL MODULES NOMINAL</span></span>
          <span style={{fontSize:8,color:"#ff4040",letterSpacing:3,marginLeft:"auto",textShadow:"0 0 8px rgba(255,64,64,0.3)"}}>⚠ AUTHORIZED RESEARCH USE ONLY</span>
        </div>
      </div>

      {/* BODY */}
      <div style={{flex:1,display:"flex",position:"relative",zIndex:10,overflow:"hidden"}}>
        {/* SIDEBAR */}
        <div style={{width:192,borderRight:"1px solid rgba(0,200,255,0.07)",background:"rgba(0,4,14,0.6)",backdropFilter:"blur(12px)",flexShrink:0,overflowY:"auto",display:"flex",flexDirection:"column"}}>
          <div style={{padding:"14px 0"}}>
            <div style={{fontSize:7,color:"rgba(0,200,255,0.28)",letterSpacing:4,padding:"0 16px",marginBottom:8}}>MODULES</div>
            {MODULES.map(m=>(
              <div key={m.id} onClick={()=>{setMod(m.id);setTab("editor");}} style={{padding:"8px 16px",cursor:"pointer",background:mod===m.id?"rgba(0,200,255,0.08)":"transparent",borderLeft:`2px solid ${mod===m.id?"#00c8ff":"transparent"}`,transition:"all 0.2s"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{color:mod===m.id?"#00c8ff":"rgba(0,200,255,0.28)",fontSize:13,flexShrink:0}}>{m.icon}</span>
                  <div>
                    <div style={{fontSize:10,color:mod===m.id?"#00c8ff":"rgba(160,210,255,0.5)"}}>{m.label}</div>
                    <div style={{fontSize:7,color:"rgba(0,200,255,0.2)",letterSpacing:2}}>{m.tag}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{margin:"0 16px",height:"1px",background:"rgba(0,200,255,0.06)"}}/>

          <div style={{padding:"14px 0"}}>
            <div style={{fontSize:7,color:"rgba(0,200,255,0.28)",letterSpacing:4,padding:"0 16px",marginBottom:8}}>OPTIONS</div>
            {Object.entries(opts).map(([k,v])=>(
              <label key={k} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 16px",cursor:"pointer"}}>
                <div onClick={()=>setOpts(o=>({...o,[k]:!o[k]}))} style={{width:13,height:13,border:`1px solid ${v?"#00c8ff":"rgba(0,200,255,0.2)"}`,background:v?"rgba(0,200,255,0.12)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s",boxShadow:v?"0 0 8px rgba(0,200,255,0.2)":"none"}}>
                  {v&&<span style={{color:"#00c8ff",fontSize:9}}>✓</span>}
                </div>
                <span style={{fontSize:9,color:"rgba(160,210,255,0.42)"}}>{k.charAt(0).toUpperCase()+k.slice(1)}</span>
              </label>
            ))}
          </div>

          <div style={{margin:"0 16px",height:"1px",background:"rgba(0,200,255,0.06)"}}/>

          <div style={{padding:"14px 0"}}>
            <div style={{fontSize:7,color:"rgba(0,200,255,0.28)",letterSpacing:4,padding:"0 16px",marginBottom:8}}>DIFFICULTY</div>
            {DIFFICULTIES.map(d=>(
              <div key={d} onClick={()=>setDiff(d)} style={{padding:"6px 16px",cursor:"pointer",background:diff===d?"rgba(0,200,255,0.06)":"transparent",borderLeft:`2px solid ${diff===d?"rgba(0,200,255,0.5)":"transparent"}`,transition:"all 0.2s"}}>
                <span style={{fontSize:10,color:diff===d?"#00c8ff":"rgba(160,210,255,0.38)"}}>{d}</span>
              </div>
            ))}
          </div>

          <div style={{margin:"0 16px",height:"1px",background:"rgba(0,200,255,0.06)"}}/>

          <div style={{padding:"14px 0"}}>
            <div style={{fontSize:7,color:"rgba(0,200,255,0.28)",letterSpacing:4,padding:"0 16px",marginBottom:8}}>TARGET MODEL</div>
            {MODELS.map(m=>(
              <div key={m} onClick={()=>setModel(m)} style={{padding:"6px 16px",cursor:"pointer",background:model===m?"rgba(0,255,180,0.05)":"transparent",borderLeft:`2px solid ${model===m?"rgba(0,255,180,0.4)":"transparent"}`,transition:"all 0.2s"}}>
                <span style={{fontSize:10,color:model===m?"#00ffb3":"rgba(160,210,255,0.38)"}}>{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN PANEL */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {tab === "editor" ? (
            <div style={{flex:1,overflowY:"auto",padding:"20px 24px",display:"flex",flexDirection:"column",gap:16}}>
              {/* Header */}
              <div style={{display:"flex",alignItems:"center",gap:12,paddingBottom:12,borderBottom:"1px solid rgba(0,200,255,0.07)"}}>
                <span style={{color:"#00c8ff",fontSize:20}}>{activeMod?.icon}</span>
                <div>
                  <div style={{fontSize:11,color:"#00c8ff",letterSpacing:2}}>{activeMod?.label.toUpperCase()}</div>
                  <div style={{fontSize:8,color:"rgba(0,200,255,0.28)",letterSpacing:2}}>MODE: {diff.toUpperCase()} · TARGET: {model.toUpperCase()}</div>
                </div>
              </div>

              {/* Input */}
              <div>
                <div style={{fontSize:8,color:"rgba(0,200,255,0.38)",letterSpacing:3,marginBottom:6}}>▸ INPUT PROMPT</div>
                <textarea
                  value={input} onChange={e=>setInput(e.target.value)}
                  placeholder={`Enter your basic prompt here...\n\nExample: "write a recon script to enumerate subdomains and check for live hosts"`}
                  rows={7}
                  style={{width:"100%",boxSizing:"border-box",background:"rgba(0,8,22,0.85)",border:"1px solid rgba(0,200,255,0.12)",color:"#c8e8ff",fontFamily:"'Courier New',monospace",fontSize:12,padding:14,lineHeight:1.7,transition:"all 0.3s"}}
                />
              </div>

              {/* Enhance Button */}
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <button onClick={enhance} disabled={loading} style={{padding:"11px 28px",background:loading?"rgba(0,200,255,0.03)":"rgba(0,200,255,0.09)",border:`1px solid ${loading?"rgba(0,200,255,0.1)":"rgba(0,200,255,0.38)"}`,color:loading?"rgba(0,200,255,0.22)":"#00c8ff",fontSize:10,letterSpacing:4,cursor:loading?"not-allowed":"pointer",transition:"all 0.3s",boxShadow:loading?"none":"0 0 24px rgba(0,200,255,0.07)",display:"flex",alignItems:"center",gap:8}}>
                  {loading ? (
                    <><span style={{display:"inline-block",width:9,height:9,border:"1px solid rgba(0,200,255,0.5)",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/> PROCESSING...</>
                  ) : "◈ ENHANCE PROMPT"}
                </button>
                {output && <span style={{fontSize:8,color:"rgba(0,255,180,0.5)",letterSpacing:2}}>✓ OUTPUT READY</span>}
              </div>

              {/* Output */}
              {output && (
                <div style={{animation:"fadeUp 0.4s ease"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <div style={{fontSize:8,color:"#00ffb3",letterSpacing:3}}>▸ ENHANCED OUTPUT · READY FOR DEPLOYMENT</div>
                    <div style={{display:"flex",gap:6}}>
                      <button onClick={copy} style={{padding:"4px 12px",fontSize:8,letterSpacing:2,cursor:"pointer",background:copied?"rgba(0,255,180,0.1)":"transparent",border:`1px solid ${copied?"rgba(0,255,180,0.4)":"rgba(0,200,255,0.18)"}`,color:copied?"#00ffb3":"rgba(0,200,255,0.45)",transition:"all 0.2s"}}>{copied?"✓ COPIED":"COPY"}</button>
                      <button onClick={()=>dl("txt")} style={{padding:"4px 12px",fontSize:8,letterSpacing:2,cursor:"pointer",background:"transparent",border:"1px solid rgba(0,200,255,0.18)",color:"rgba(0,200,255,0.45)",transition:"all 0.2s"}}>EXPORT .TXT</button>
                      <button onClick={()=>dl("md")} style={{padding:"4px 12px",fontSize:8,letterSpacing:2,cursor:"pointer",background:"transparent",border:"1px solid rgba(0,200,255,0.18)",color:"rgba(0,200,255,0.45)",transition:"all 0.2s"}}>EXPORT .MD</button>
                    </div>
                  </div>
                  <div style={{background:"rgba(0,8,22,0.9)",border:"1px solid rgba(0,255,180,0.12)",padding:16,maxHeight:380,overflowY:"auto",fontSize:12,lineHeight:1.75,color:"rgba(190,235,210,0.88)",whiteSpace:"pre-wrap",boxShadow:"0 0 40px rgba(0,255,180,0.03)"}}>
                    {output}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>
              <div style={{fontSize:8,color:"rgba(0,200,255,0.38)",letterSpacing:3,marginBottom:12}}>PROMPT HISTORY ({history.length} RECORDS)</div>
              <input
                value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Search history..."
                style={{width:"100%",boxSizing:"border-box",background:"rgba(0,8,22,0.85)",border:"1px solid rgba(0,200,255,0.12)",color:"#c8e8ff",fontFamily:"'Courier New',monospace",fontSize:11,padding:"8px 12px",marginBottom:14,transition:"all 0.2s"}}
              />
              {filtered.length===0 ? (
                <div style={{color:"rgba(0,200,255,0.28)",fontSize:11}}>No records found.</div>
              ) : filtered.map(h=>(
                <div key={h.id}
                  onClick={()=>{setInput(h.input);setOutput(h.output||"");setMod(h.mod);setTab("editor");addLog(`Loaded record ${h.id}`,"info");}}
                  style={{border:"1px solid rgba(0,200,255,0.09)",padding:12,marginBottom:8,background:"rgba(0,8,22,0.5)",cursor:"pointer",transition:"all 0.2s"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(0,200,255,0.28)"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(0,200,255,0.09)"}
                >
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <span style={{fontSize:8,color:"#00c8ff",letterSpacing:2}}>{h.mod.toUpperCase()} · {h.diff} · {h.model}</span>
                    <span style={{fontSize:8,color:"rgba(0,200,255,0.28)"}}>{new Date(h.ts).toLocaleDateString()}</span>
                  </div>
                  <div style={{fontSize:11,color:"rgba(160,210,255,0.6)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.input}</div>
                </div>
              ))}
            </div>
          )}
          <Console logs={logs} />
        </div>
      </div>
    </div>
  );
}
