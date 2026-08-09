/* ====================================================
   DECILLIONX — Main Application Script
   Company: DecillionX, SG Palaya, Bangalore 560029
   CEO: Santhana Stephen Raj (santhanastephen22@gmail.com)
   ==================================================== */

let globalDB = { employees: [], projects: [], clients: [], attendance: [], leaves: [], timesheets: [], invoices: [], tickets: [], contact_inquiries: [] };

async function initDatabase() {
  try {
    const res = await fetch('http://localhost:3000/api/store');
    globalDB = await res.json();
  } catch(e) {
    console.error("DB Fetch Error:", e);
  }
}

async function saveDB(key, data) {
  globalDB[key] = data;
  try {
    await fetch('http://localhost:3000/api/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, data })
    });
  } catch(e) { console.error("DB Save Error:", e); }
}

/* ---- GLOBAL STATE ---- */
let currentRole = null;
let currentUserId = null;

document.addEventListener('DOMContentLoaded', async () => {
  await initDatabase();
  initNavbar();
  initAISandbox();
  initTechFilter();
  initCostEstimator();
  initAIChatbot();
  initModals();
  initContactForm();
  initCareersPortal();
});

/* ---- NAVBAR ---- */
function initNavbar() {
  const nav = document.querySelector('.navbar');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40));
}

function hideAllPortals() {
  const main = document.getElementById('main-site');
  if (main) main.style.display = 'block';
}

/* ---- HELPERS ---- */
function allEmployees() { return globalDB.employees || []; }
function allProjects() { return globalDB.projects || []; }
function allAttendance() { return globalDB.attendance || []; }
function allLeaves() { return globalDB.leaves || []; }
function allTimesheets() { return globalDB.timesheets || []; }
function allInvoices() { return globalDB.invoices || []; }
function allTickets() { return globalDB.tickets || []; }

function getEmployee(id) { return (globalDB.employees||[]).find(e => e.id === id) || {}; }
function getClient(id) { return (globalDB.clients||[]).find(c => c.id === id) || {}; }
function getProject(id) { return (globalDB.projects||[]).find(p => p.id === id) || {}; }

/* =============================================
   ENGINEERING STACK SANDBOX (LIVE SIMULATION)
   ============================================= */
const sandboxDemos = {
  software: {
    title: 'Custom Enterprise ERP & CRM Software Architecture',
    code: `<span class="code-keyword">import</span> { DecillionX, ERPBuilder } <span class="code-keyword">from</span> <span class="code-string">'@decillionx/software-core'</span>;

<span class="code-comment">// Scaffold Enterprise ERP & Inventory Engine for Bangalore HQ</span>
<span class="code-keyword">const</span> erp = <span class="code-keyword">new</span> ERPBuilder({
  modules: [<span class="code-string">'Inventory'</span>, <span class="code-string">'HRMS'</span>, <span class="code-string">'Finance'</span>, <span class="code-string">'CRM'</span>],
  database: <span class="code-string">'PostgreSQL Cluster (SQLite Fallback)'</span>,
  location: <span class="code-string">'SG Palaya, Bangalore 560029'</span>
});

<span class="code-keyword">const</span> deployment = <span class="code-keyword">await</span> erp.<span class="code-function">deployProduction</span>({ cloud: <span class="code-string">'AWS ap-south-1'</span> });
console.log(deployment.status); <span class="code-comment">// → { status: 'Active', uptime: '99.99%' }</span>`
  },
  ai: {
    title: 'Custom LLM & AI RAG Agent Workflow Deployment',
    code: `<span class="code-keyword">import</span> { AgentCore, VectorStore } <span class="code-keyword">from</span> <span class="code-string">'@decillionx/ai-engine'</span>;

<span class="code-comment">// Initialize Intelligent RAG Document Search Agent</span>
<span class="code-keyword">const</span> agent = <span class="code-keyword">new</span> AgentCore({
  model: <span class="code-string">'DecillionX-Llama-3.1-70B'</span>,
  vectorStore: <span class="code-string">'Pinecone Vector DB (Bangalore Cluster)'</span>,
  temperature: <span class="code-highlight">0.15</span>
});

<span class="code-keyword">const</span> output = <span class="code-keyword">await</span> agent.<span class="code-function">analyzeContracts</span>(<span class="code-string">'legal_documents.pdf'</span>);
console.log(output); <span class="code-comment">// → { clausesParsed: 142, riskScore: '0.02' }</span>`
  },
  mobile: {
    title: 'Cross-Platform Web & Mobile Application Engineering',
    code: `<span class="code-keyword">import</span> { NextApp, MobileShell } <span class="code-keyword">from</span> <span class="code-string">'@decillionx/product-stack'</span>;

<span class="code-comment">// Build Cross-Platform Mobile & Next.js 15 Web Suite</span>
<span class="code-keyword">const</span> appSuite = <span class="code-keyword">new</span> NextApp({
  webFramework: <span class="code-string">'Next.js 15 App Router'</span>,
  mobileFramework: <span class="code-string">'React Native iOS & Android'</span>,
  backendAPI: <span class="code-string">'Node.js Express + SQLite'</span>
});

<span class="code-keyword">await</span> appSuite.<span class="code-function">buildAndDeploy</span>({ env: <span class="code-string">'production'</span> });
<span class="code-comment">// → Live Deployed to Vercel, Google Play & Apple App Store</span>`
  }
};

function initAISandbox() {
  const tabs = document.querySelectorAll('.sandbox-tabs .tab-btn');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tabKey = btn.dataset.tab;
      const data = sandboxDemos[tabKey];
      if (data) {
        document.getElementById('sandbox-title').textContent = data.title;
        document.getElementById('sandbox-code-display').innerHTML = data.code;
      }
    });
  });

  const runBtn = document.getElementById('run-sandbox-btn');
  const codeConsole = document.getElementById('sandbox-code-display');

  if (runBtn) {
    runBtn.addEventListener('click', function() {
      const origCode = codeConsole.innerHTML;
      this.disabled = true;
      this.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Executing Live Sandbox...`;

      codeConsole.innerHTML += `\n\n<span class="code-comment">// --- EXECUTING LIVE SIMULATION LOGS ---</span>\n`;
      setTimeout(() => {
        codeConsole.innerHTML += `<span class="code-keyword">[LOG 12:35:01]</span> <span class="code-string">Connecting to DecillionX Neural Node (SG Palaya, Bangalore)...</span>\n`;
        codeConsole.scrollTop = codeConsole.scrollHeight;
      }, 400);

      setTimeout(() => {
        codeConsole.innerHTML += `<span class="code-keyword">[LOG 12:35:02]</span> <span class="code-function">Executing microservices compilation and database handshake...</span>\n`;
        codeConsole.scrollTop = codeConsole.scrollHeight;
      }, 900);

      setTimeout(() => {
        codeConsole.innerHTML += `<span class="code-highlight">[SUCCESS 12:35:03]</span> <span class="code-string">Simulation completed cleanly in 0.14s! All systems nominal. Uptime 99.99%.</span>\n`;
        codeConsole.scrollTop = codeConsole.scrollHeight;

        runBtn.innerHTML = `<i class="fas fa-check-circle"></i> Simulation Complete`;
        runBtn.style.background = 'var(--accent-emerald)';
        runBtn.style.color = '#000';

        setTimeout(() => {
          runBtn.innerHTML = `<i class="fas fa-play"></i> Run Live Simulation`;
          runBtn.style.background = '';
          runBtn.style.color = '';
          runBtn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }
}

/* ---- TECH FILTER ---- */
function initTechFilter() {
  document.querySelectorAll('.tech-filter-bar .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tech-filter-bar .filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      document.querySelectorAll('.tech-matrix .tech-item').forEach(item => {
        item.style.display = (f==='all'||item.dataset.category===f) ? 'flex' : 'none';
      });
    });
  });
}

/* ---- COST ESTIMATOR ---- */
function initCostEstimator() {
  const scopeEl=document.getElementById('scope-slider'), valEl=document.getElementById('scope-val');
  const aiSel=document.getElementById('ai-tier-select'), platSel=document.getElementById('platform-select');
  const priceEl=document.getElementById('est-price-display'), timeEl=document.getElementById('est-time-display'), roiEl=document.getElementById('est-roi-display');
  if (!scopeEl||!priceEl) return;
  function update() {
    const w=parseInt(scopeEl.value), ai=parseFloat(aiSel.value||1.5), plat=parseFloat(platSel.value||1.3);
    valEl.textContent=w+' Weeks';
    const baseUsd=2500; const lo=Math.round(w*baseUsd*ai*plat*0.88/1000)*1000, hi=Math.round(w*baseUsd*ai*plat*1.12/1000)*1000;
    priceEl.textContent=`$${lo.toLocaleString('en-US')} – $${hi.toLocaleString('en-US')}`;
    timeEl.textContent=`${w} – ${w+3} Weeks`;
    if (roiEl) roiEl.textContent=`${(2.5+(ai*1.1)).toFixed(1)}x Efficiency`;
  }
  scopeEl.addEventListener('input',update); aiSel.addEventListener('change',update); platSel.addEventListener('change',update); update();
}

/* =============================================
   CHATBOT KNOWLEDGE ENGINE (END-TO-END INTELLIGENCE)
   ============================================= */
function initAIChatbot() {
  const widget = document.getElementById('chatbot-widget');
  const toggle = document.getElementById('chatbot-toggle');
  const win = document.getElementById('chatbot-window');
  const closeBtn = document.getElementById('close-chat');
  const sendBtn = document.getElementById('chat-send-btn');
  const input = document.getElementById('chat-input');
  const msgs = document.getElementById('chat-messages');

  if (!toggle || !win) return;

  // 1. Hover Auto-Open on Cursor Over
  let autoOpenTimer = null;

  widget.addEventListener('mouseenter', () => {
    win.classList.add('active');
  });

  // Auto-open after 4 seconds on page load
  autoOpenTimer = setTimeout(() => {
    if (!win.classList.contains('active')) {
      win.classList.add('active');
    }
  }, 4000);

  toggle.addEventListener('click', () => {
    win.classList.toggle('active');
  });

  closeBtn?.addEventListener('click', () => {
    win.classList.remove('active');
  });

  function addMsg(text, isUser = false) {
    const d = document.createElement('div');
    d.className = `msg ${isUser ? 'msg-user' : 'msg-bot'}`;
    d.innerHTML = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function handleUserQuery(q) {
    const text = q.trim();
    if (!text) return;
    addMsg(text, true);
    input.value = '';
    setTimeout(() => addMsg(getBotReply(text)), 400);
  }

  sendBtn?.addEventListener('click', () => handleUserQuery(input.value));
  input?.addEventListener('keypress', e => { if (e.key === 'Enter') handleUserQuery(input.value); });

  // 2. Clickable Prompt Chips
  document.querySelectorAll('.chat-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const ask = chip.dataset.ask;
      if (ask === 'services') handleUserQuery('What services do you offer?');
      else if (ask === 'estimator') handleUserQuery('How much does a project cost?');
      else if (ask === 'location') handleUserQuery('Where is your Bangalore office located?');
      else if (ask === 'ceo') handleUserQuery('Who is the Founder & CEO of DecillionX?');
      else if (ask === 'contact') handleUserQuery('How do I contact CEO Santhana Stephen Raj?');
    });
  });

  function getBotReply(qRaw) {
    const q = qRaw.trim().toLowerCase();

    // 1. Company Overview & About DecillionX
    if (q.includes('decillionx') || q.includes('about company') || q.includes('about decillionx') || q.includes('company profile') || q.includes('what is decillionx') || q.includes('tell me about') || q.includes('who are you') || q.includes('overview') || q.includes('company details')) {
      return `<strong>🏢 DecillionX Company Overview:</strong><br>` +
             `DecillionX is a premier IT Software & Artificial Intelligence Development company based in <strong>SG Palaya, Bangalore - 560029, India</strong>.<br><br>` +
             `• <strong>Founder & CEO:</strong> Mr. Santhana Stephen Raj<br>` +
             `• <strong>Core Focus:</strong> Custom Software (ERP, CRM, HRMS), AI & LLM Systems (RAG, PyTorch, LangChain), and Web & Mobile Apps.<br>` +
             `• <strong>Global Currency:</strong> Engagement costs in $ USD.<br>` +
             `• <strong>Official Email:</strong> santhanastephen22@gmail.com`;
    }

    // 2. Company Structure / Hierarchy / Divisions / Org Chart
    if (q.includes('structure') || q.includes('hierarchy') || q.includes('division') || q.includes('dept') || q.includes('department') || q.includes('org chart') || q.includes('team structure') || q.includes('org')) {
      return `<strong>🏛️ DecillionX Engineering Structure:</strong><br>` +
             `• <strong>Executive Leadership:</strong> Santhana Stephen Raj (Founder & CEO)<br>` +
             `• <strong>Software Systems Division:</strong> Principal Software Architect & Full-Stack Engineers<br>` +
             `• <strong>Neural AI Division:</strong> Chief AI & LLM Scientist & Machine Learning Engineers<br>` +
             `• <strong>Cloud & Infra Division:</strong> Head of Cloud Infrastructure & DevOps Engineers<br>` +
             `• <strong>Quality & Security Division:</strong> Lead QA & Security VAPT Specialists`;
    }

    // 3. Company Strategy / Vision / Mission / Values
    if (q.includes('strategy') || q.includes('vision') || q.includes('mission') || q.includes('value') || q.includes('goal') || q.includes('motto')) {
      return `<strong>🎯 DecillionX Strategy & Vision:</strong><br>` +
             `• <strong>Vision:</strong> To be the most trusted custom software & AI engineering partner for enterprise clients worldwide.<br>` +
             `• <strong>Mission:</strong> To deliver high-performance, cost-effective custom software and AI automation that solves complex operational challenges.<br>` +
             `• <strong>Core Values:</strong> Client-First Delivery, Engineering Excellence, Integrity, and Continuous Innovation.`;
    }

    // 4. CEO & Founder Details
    if (q.includes('ceo') || q.includes('founder') || q.includes('stephen') || q.includes('santhana') || q.includes('owner') || q.includes('head') || q.includes('chief') || q.includes('boss') || q.includes('leadership')) {
      return `<strong>👔 Founder & CEO Details:</strong><br>` +
             `• <strong>Name:</strong> Santhana Stephen Raj<br>` +
             `• <strong>Title:</strong> Founder & Chief Executive Officer<br>` +
             `• <strong>Bangalore HQ:</strong> SG Palaya, Bangalore - 560029, Karnataka, India<br>` +
             `• <strong>Direct Email:</strong> santhanastephen22@gmail.com<br>` +
             `• <strong>Direct Phone:</strong> +91-9342888529`;
    }

    // 5. Office Location & Bangalore Address
    if (q.includes('location') || q.includes('address') || q.includes('where') || q.includes('office') || q.includes('bangalore') || q.includes('sg palaya') || q.includes('pincode') || q.includes('560029') || q.includes('city') || q.includes('hq')) {
      return `<strong>📍 Corporate Headquarters:</strong><br>` +
             `DecillionX Enterprise Systems<br>` +
             `SG Palaya, Bangalore - 560029<br>` +
             `Karnataka, India.<br><br>` +
             `⏰ <strong>Hours:</strong> Monday – Saturday, 9:00 AM – 7:00 PM IST<br>` +
             `📧 <strong>Email:</strong> santhanastephen22@gmail.com`;
    }

    // 6. Contact & Direct Email Delivery
    if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('mobile') || q.includes('reach') || q.includes('call') || q.includes('inquiry') || q.includes('message') || q.includes('jio')) {
      return `<strong>✉️ Direct Contact Options:</strong><br>` +
             `• <strong>CEO Email:</strong> santhanastephen22@gmail.com<br>` +
             `• <strong>CEO Phone:</strong> +91-9342888529<br>` +
             `• <strong>Live Form:</strong> Submit the <em>"Send Us a Message"</em> form below—email is sent live to santhanastephen22@gmail.com and logged in SQLite!`;
    }

    // 7. End-to-End Development Services
    if (q.includes('service') || q.includes('offer') || q.includes('what do you do') || q.includes('capability') || q.includes('work') || q.includes('build') || q.includes('solution') || q.includes('develop')) {
      return `<strong>🛠️ End-to-End Services Offered:</strong><br>` +
             `1️⃣ <strong>Custom Software Development:</strong> Modular ERP, CRM, HRMS, Inventory & SaaS Billing.<br>` +
             `2️⃣ <strong>AI & ML Engineering:</strong> Custom LLM Fine-Tuning, RAG Document Search, Computer Vision.<br>` +
             `3️⃣ <strong>Web & Mobile Apps:</strong> Next.js 15, React Native (iOS & Android).<br>` +
             `4️⃣ <strong>Cloud & SaaS Architecture:</strong> AWS, Kubernetes Microservices, CI/CD.<br>` +
             `5️⃣ <strong>Data Engineering:</strong> ETL Pipelines, Real-Time Business Analytics.<br>` +
             `6️⃣ <strong>QA & VAPT Security:</strong> Automated Penetration Testing & Load Audits.`;
    }

    // 8. Software Development & ERP / CRM
    if (q.includes('erp') || q.includes('crm') || q.includes('software') || q.includes('inventory') || q.includes('hrms') || q.includes('billing')) {
      return `<strong>💻 Custom Software & ERP Systems:</strong><br>` +
             `We build tailored Enterprise ERP, CRM, HRMS, and multi-tenant SaaS billing platforms. Features include role-based security, workflow automation, inventory forecasting, and executive BI dashboards.`;
    }

    // 9. AI, Machine Learning & LLM Services
    if (q.includes('ai') || q.includes('ml') || q.includes('machine learning') || q.includes('llm') || q.includes('rag') || q.includes('genai') || q.includes('gpt') || q.includes('llama') || q.includes('vision') || q.includes('agent') || q.includes('model') || q.includes('deepseek')) {
      return `<strong>🧠 Complete AI, ML & LLM Services:</strong><br>` +
             `1️⃣ <strong>Custom LLM Fine-Tuning:</strong> Llama 3.1, Mistral, DeepSeek, GPT-4o model optimization.<br>` +
             `2️⃣ <strong>Enterprise RAG Architecture:</strong> High-precision vector search (Pinecone, Milvus, LangChain, LlamaIndex).<br>` +
             `3️⃣ <strong>Autonomous AI Agents:</strong> Multi-agent workflows (CrewAI, AutoGen, LangGraph).<br>` +
             `4️⃣ <strong>Computer Vision & OCR:</strong> Image recognition, facial verification, document parsing (OpenCV, YOLOv8).<br>` +
             `5️⃣ <strong>Voice AI & Multimodal:</strong> Speech-to-text, voice synthesis (Whisper, ElevenLabs).<br>` +
             `6️⃣ <strong>Predictive ML Analytics:</strong> Demand forecasting, customer churn, fraud detection (PyTorch, TensorFlow).`;
    }

    // 10. QA, GenAI QA & VAPT Security Testing
    if (q.includes('qa') || q.includes('testing') || q.includes('test') || q.includes('vapt') || q.includes('security') || q.includes('hallucination') || q.includes('red team') || q.includes('quality') || q.includes('audit')) {
      return `<strong>🧪 QA, GenAI QA & Security Testing Services:</strong><br>` +
             `1️⃣ <strong>GenAI QA & Hallucination Testing:</strong> LLM evaluation, RAG accuracy benchmarking (Ragas, TruLens, DeepEval).<br>` +
             `2️⃣ <strong>Prompt Robustness & Red-Teaming:</strong> Jailbreak defense, safety guardrails, AI threat modeling.<br>` +
             `3️⃣ <strong>End-to-End QA Automation:</strong> Playwright, Selenium cross-browser & mobile testing.<br>` +
             `4️⃣ <strong>VAPT Penetration Audits:</strong> OWASP Top 10 vulnerability assessment & API security testing.<br>` +
             `5️⃣ <strong>Performance & Load Testing:</strong> High-throughput SLA benchmarking using Apache JMeter.`;
    }

    // 10. Web & Mobile Apps
    if (q.includes('web') || q.includes('mobile') || q.includes('app') || q.includes('react') || q.includes('next') || q.includes('ios') || q.includes('android')) {
      return `<strong>📱 Web & Mobile App Engineering:</strong><br>` +
             `We design and deploy ultra-fast Next.js 15 web applications and React Native mobile apps for iOS and Android with 99.99% cloud availability.`;
    }

    // 11. Portals & Login Gateway
    if (q.includes('portal') || q.includes('login') || q.includes('dashboard') || q.includes('employee portal') || q.includes('admin portal') || q.includes('client portal') || q.includes('gate')) {
      return `<strong>🔑 Login Portals Access:</strong><br>` +
             `Click <strong>"Portals"</strong> in the top menu or visit <a href="login.html" style="color:var(--primary-cyan);font-weight:bold;">http://localhost:3000/login.html</a>.<br><br>` +
             `• <strong>Dual Auth Supported:</strong> Log in using Company Email OR Mobile Phone (Jio format)!<br>` +
             `• <strong>Employee Portal:</strong> Attendance Clock In/Out, Skills, Timesheets, Leaves.<br>` +
             `• <strong>Executive Admin Hub:</strong> CEO Live Attendance Monitor, Projects Launcher, Approvals, Contact Inbox.<br>` +
             `• <strong>Client Portal:</strong> Milestones, Invoices, Support Tickets.`;
    }

    // 12. Attendance & Employee Management
    if (q.includes('attendance') || q.includes('clock') || q.includes('leave') || q.includes('timesheet') || q.includes('employee tracking') || q.includes('time log')) {
      return `<strong>🕒 Employee Attendance & HR Tracking:</strong><br>` +
             `Employees log daily attendance (Clock In/Out verified for Bangalore HQ) in the Employee Portal. Weekly timesheets and leave requests are submitted for CEO Santhana Stephen Raj's approval in the Admin Hub.`;
    }

    // 13. Pricing & USD Cost Estimates
    if (q.includes('price') || q.includes('pricing') || q.includes('cost') || q.includes('budget') || q.includes('quote') || q.includes('dollar') || q.includes('usd') || q.includes('estimate') || q.includes('how much') || q.includes('$')) {
      return `<strong>💰 Investment & Pricing ($ USD Standard):</strong><br>` +
             `Software & AI engineering engagements range from <strong>$15,000 to $250,000+ USD</strong> depending on project scope, AI model complexity, and cloud architecture (timelines 4 to 24 weeks).<br><br>` +
             `💡 Use our interactive <strong>Project Estimator</strong> on the home page or click <strong>"Get Quote"</strong>!`;
    }

    // 14. Technology Stack (Java, Python, .NET, AI/ML, QA)
    if (q.includes('tech') || q.includes('technology') || q.includes('stack') || q.includes('java') || q.includes('python') || q.includes('.net') || q.includes('dotnet') || q.includes('c#') || q.includes('qa') || q.includes('testing') || q.includes('ai') || q.includes('ml')) {
      return `<strong>⚡ Enterprise Technology Stack:</strong><br>` +
             `☕ <strong>Java Division:</strong> Java 21, Spring Boot 3, Hibernate ORM, Microservices<br>` +
             `🐍 <strong>Python Division:</strong> Python 3.12, FastAPI, Django, Data Science<br>` +
             `🔷 <strong>.NET Core Division:</strong> C#, .NET 9 Core, ASP.NET Web API, Azure Cloud<br>` +
             `🧠 <strong>AI & ML Division:</strong> PyTorch, TensorFlow, LLM Fine-Tuning, RAG Architecture, Computer Vision<br>` +
             `🧪 <strong>QA & Security Division:</strong> Playwright, Selenium Web Automation, JMeter Load Testing, VAPT Audits`;
    }

    // 15. Portfolio & Case Studies
    if (q.includes('portfolio') || q.includes('case study') || q.includes('lakshmi') || q.includes('techbridge') || q.includes('nalanda') || q.includes('example') || q.includes('project')) {
      return `<strong>🏆 Enterprise Portfolio Highlights:</strong><br>` +
             `1️⃣ <strong>Lakshmi Industries:</strong> AI ERP System ($220,000 Engagement)<br>` +
             `2️⃣ <strong>TechBridge Solutions:</strong> Multi-Tenant Cloud SaaS Billing Engine ($150,000 Engagement)<br>` +
             `3️⃣ <strong>Nalanda Law Firm:</strong> AI Document Intelligence Engine ($120,000 Engagement)`;
    }

    // 16. How to Start / Hire Us
    if (q.includes('hire') || q.includes('start') || q.includes('begin') || q.includes('partner') || q.includes('proposal') || q.includes('contract')) {
      return `<strong>🚀 How to Start Your Project:</strong><br>` +
             `1) Fill out <strong>"Send Us a Message"</strong> below—email is sent live to CEO Santhana Stephen Raj.<br>` +
             `2) Click <strong>"Get Quote"</strong> in the header for a proposal.<br>` +
             `3) Email CEO directly at <strong>santhanastephen22@gmail.com</strong>.<br>` +
             `We schedule a strategy call within 24 hours!`;
    }

    // 17. Intelligent Help Guide for Unrecognized Inputs
    return `<strong>👋 Hello! DecillionX AI Assistant Here.</strong><br>` +
           `I can answer any details about our company! What would you like to know?<br><br>` +
           `• Ask <strong>"Tell me about DecillionX"</strong> for company profile<br>` +
           `• Ask <strong>"Who is the CEO?"</strong> for founder info<br>` +
           `• Ask <strong>"What services do you offer?"</strong> for ERP & AI solutions<br>` +
           `• Ask <strong>"Where is your office?"</strong> for Bangalore HQ details<br>` +
           `• Ask <strong>"How to login?"</strong> for Employee & Client portals<br>` +
           `• Ask <strong>"Pricing"</strong> for USD cost estimates<br>` +
           `• Ask <strong>"Company Structure"</strong> for org hierarchy`;
  }
}

/* ---- MODALS ---- */
function initModals() {
  document.querySelectorAll('.open-quote-modal').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();document.getElementById('quote-modal').classList.add('active');}));
  document.getElementById('modal-close-btn')?.addEventListener('click',()=>document.getElementById('quote-modal').classList.remove('active'));
  document.querySelectorAll('.modal-overlay').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('active');}));
  document.getElementById('modal-quote-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    const msg = document.getElementById('prop-status-msg');

    const payload = {
      fullName: document.getElementById('prop-name').value,
      companyName: document.getElementById('prop-company').value,
      email: document.getElementById('prop-email').value,
      phone: document.getElementById('prop-phone').value,
      industry: document.getElementById('prop-industry').value,
      serviceRequired: document.getElementById('prop-service').value,
      budget: document.getElementById('prop-budget').value,
      targetTimeline: document.getElementById('prop-timeline').value,
      scopeDeliverables: document.getElementById('prop-deliverables').value,
      businessObjectives: document.getElementById('prop-objectives').value
    };

    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Dispatching Proposal Alert to CEO Email...`;

    try {
      const res = await fetch('http://localhost:3000/api/proposals/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        this.closest('.modal-box').innerHTML = `
          <div style="text-align:center; padding:2rem 0">
            <div style="font-size:3.5rem; color:var(--accent-emerald); margin-bottom:1rem"><i class="fas fa-check-circle"></i></div>
            <h2 style="margin-bottom:0.5rem; color:#fff">Corporate Proposal Request Submitted!</h2>
            <p style="color:#cbd5e1; font-size:0.92rem; max-width:540px; margin:0.5rem auto 1.5rem auto; line-height:1.6">
              A comprehensive proposal model alert has been dispatched directly to CEO Santhana Stephen Raj (<span style="color:var(--primary-cyan)">santhanastephen22@gmail.com</span>) and stored in the DecillionX CRM Database.
            </p>
            <button class="btn btn-primary" onclick="document.getElementById('quote-modal').classList.remove('active')"><i class="fas fa-xmark"></i> Close Window</button>
          </div>
        `;
      } else {
        alert(data.message || 'Error submitting proposal request.');
        btn.disabled = false;
        btn.innerHTML = `<i class="fas fa-paper-plane"></i> Submit Proposal Request & Alert CEO Email`;
      }
    } catch(err) {
      alert('Network error dispatching proposal request.');
      btn.disabled = false;
      btn.innerHTML = `<i class="fas fa-paper-plane"></i> Submit Proposal Request & Alert CEO Email`;
    }
  });
}

/* =============================================
   CONTACT FORM SUBMISSION ("SEND US A MESSAGE")
   ============================================= */
function initContactForm() {
  const form = document.getElementById('main-contact-form');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent any default page jump / reload

    const inputs = form.querySelectorAll('input, select, textarea');
    const fullName = inputs[0]?.value || 'Prospective Client';
    const email = inputs[1]?.value || '';
    const phone = inputs[2]?.value || '';
    const company = inputs[3]?.value || '';
    const serviceNeeded = inputs[4]?.value || 'Custom Software & AI';
    const messageText = inputs[5]?.value || '';

    const btn = form.querySelector('button[type=submit]');
    const origText = btn.innerHTML;
    btn.innerHTML = `<i class="fas fa-paper-plane fa-spin"></i> Dispatching Email to CEO...`;
    btn.disabled = true;

    // 1. Local Database Persistence
    const inquiry = {
      id: 'INQ-' + Date.now(),
      fullName,
      email,
      phone,
      company,
      serviceNeeded,
      messageText,
      date: new Date().toLocaleDateString('en-IN'),
      deliveredTo: 'santhanastephen22@gmail.com',
      status: 'Delivered'
    };

    const currentInquiries = globalDB.contact_inquiries || [];
    currentInquiries.unshift(inquiry);
    await saveDB('contact_inquiries', currentInquiries);

    // 2. Real Email Dispatch to santhanastephen22@gmail.com via FormSubmit API
    try {
      await fetch('https://formsubmit.co/ajax/santhanastephen22@gmail.com', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `🚀 New Client Inquiry from ${fullName} (${company || 'DecillionX Website'})`,
          _captcha: 'false',
          FullName: fullName,
          ClientEmail: email,
          PhoneNumber: phone,
          CompanyName: company,
          ServiceRequested: serviceNeeded,
          Message: messageText,
          DeliveredTo: 'santhanastephen22@gmail.com'
        })
      });
    } catch(err) {
      console.log('FormSubmit API notice:', err);
    }

    btn.innerHTML = `<i class="fas fa-check-circle"></i> Email Dispatched to CEO!`;
    btn.style.background = 'var(--accent-emerald)';
    btn.style.color = '#000';

    showToast(`✅ Email sent to santhanastephen22@gmail.com & saved in CEO Admin Hub!`, 'success');
    form.reset();

    setTimeout(() => {
      btn.innerHTML = origText;
      btn.style.background = '';
      btn.style.color = '';
      btn.disabled = false;
    }, 4000);
  });
}

/* ---- TOAST NOTIFICATION ---- */
function showToast(msg, type='success') {
  const t = document.createElement('div');
  t.style.cssText = `position:fixed;bottom:95px;right:25px;z-index:9999;padding:1rem 1.5rem;background:${type==='success'?'rgba(0,245,160,0.18)':'rgba(255,71,87,0.18)'};border:1px solid ${type==='success'?'rgba(0,245,160,0.6)':'rgba(255,71,87,0.6)'};color:${type==='success'?'var(--accent-emerald)':'var(--accent-rose)'};border-radius:14px;font-weight:600;font-size:0.88rem;backdrop-filter:blur(16px);max-width:340px;box-shadow:0 10px 30px rgba(0,0,0,0.8);animation:fadeInUp 0.3s ease`;
  t.innerHTML = `<i class="fas ${type==='success'?'fa-check-circle':'fa-times-circle'}"></i> ${msg}`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 4500);
}

/* =============================================
   CAREERS & HIRING PORTAL SCRIPT
   ============================================= */
function initCareersPortal() {
  const container = document.getElementById('jobs-cards-container');
  if (!container) return;

  const jobs = globalDB.job_openings || [];
  renderJobCards(jobs, 'all');

  // Filter Buttons Event Listeners
  const filterBtns = document.querySelectorAll('#career-filter-bar button');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderJobCards(jobs, btn.dataset.filter);
    });
  });

  // Application Form Submit Listener
  const form = document.getElementById('form-job-apply');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const statusMsg = document.getElementById('apply-status-msg');
      const submitBtn = form.querySelector('button[type="submit"]');

      const payload = {
        jobId: document.getElementById('apply-job-id').value,
        jobTitle: document.getElementById('apply-job-title').value,
        fullName: document.getElementById('apply-name').value,
        email: document.getElementById('apply-email').value,
        phone: document.getElementById('apply-phone').value,
        experienceYears: document.getElementById('apply-experience').value,
        primarySkill: document.getElementById('apply-skill').value,
        companyType: document.getElementById('apply-company-type').value,
        coverNote: document.getElementById('apply-pitch').value,
        resumeContent: document.getElementById('apply-resume').value
      };

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Submitting & Dispatching Alert...`;

      try {
        const res = await fetch('http://localhost:3000/api/careers/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (data.success) {
          statusMsg.style.display = 'block';
          statusMsg.style.background = 'rgba(0, 245, 160, 0.15)';
          statusMsg.style.color = 'var(--accent-emerald)';
          statusMsg.style.border = '1px solid var(--accent-emerald)';
          statusMsg.innerHTML = `<i class="fas fa-check-circle"></i> ${data.message}`;

          showToast(`🎉 Resume submitted! Candidate alert dispatched to CEO Santhana Stephen Raj.`, 'success');
          form.reset();

          setTimeout(() => {
            closeJobApplyModal();
            statusMsg.style.display = 'none';
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="fas fa-paper-plane"></i> Submit Application & Dispatch Alert to CEO`;
          }, 3500);
        } else {
          alert(data.message || 'Submission failed.');
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<i class="fas fa-paper-plane"></i> Submit Application & Dispatch Alert to CEO`;
        }
      } catch (err) {
        alert('Network error submitting job application.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fas fa-paper-plane"></i> Submit Application & Dispatch Alert to CEO`;
      }
    });
  }
}

function renderJobCards(jobs, filterTag) {
  const container = document.getElementById('jobs-cards-container');
  if (!container) return;

  let filtered = jobs;
  if (filterTag !== 'all') {
    filtered = jobs.filter(j => {
      const skillsStr = Array.isArray(j.skills) ? j.skills.join(' ') : (j.skills || '');
      return (j.title || '').toLowerCase().includes(filterTag.toLowerCase()) ||
             (j.dept || '').toLowerCase().includes(filterTag.toLowerCase()) ||
             skillsStr.toLowerCase().includes(filterTag.toLowerCase());
    });
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:3rem; background:rgba(255,255,255,0.03); border-radius:20px; border:1px dashed rgba(255,255,255,0.1);">
        <i class="fas fa-search" style="font-size:2rem; color:var(--primary-cyan); margin-bottom:1rem;"></i>
        <h4>No openings found for "${filterTag}"</h4>
        <p style="color:#94a3b8; font-size:0.9rem">Submit a general application and our talent team will contact you when a matching engineering role opens.</p>
        <button class="btn btn-primary btn-sm" onclick="openJobApplyModal('GENERAL', 'General Engineering Application')" style="margin-top:1rem"><i class="fas fa-file-upload"></i> Submit General Resume</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(j => {
    const skillsList = Array.isArray(j.skills) ? j.skills : (j.skills || 'Tech').split(',');
    return `
      <div class="glass-card flex-col" style="padding:1.85rem; justify-content:space-between;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
            <span class="tagline-badge" style="font-size:0.7rem; padding:3px 10px; margin:0;"><i class="fas fa-location-dot"></i> ${j.location || 'SG Palaya, Bangalore'}</span>
            <span style="font-size:0.8rem; font-weight:700; color:var(--accent-emerald); font-family:var(--font-mono);">${j.salary || '$80,000 / yr'}</span>
          </div>
          <h3 style="font-size:1.18rem; margin-bottom:0.4rem; color:#fff;">${j.title}</h3>
          <div style="font-size:0.82rem; color:var(--primary-cyan); font-weight:600; margin-bottom:0.75rem;">${j.dept} • ${j.experience || '2+ Yrs'}</div>
          
          <p style="font-size:0.86rem; color:#94a3b8; line-height:1.55; margin-bottom:1.15rem;">${j.description}</p>
          
          <div style="font-size:0.78rem; font-weight:700; color:#cbd5e1; margin-bottom:0.4rem;">Target Experience & Company:</div>
          <div style="font-size:0.8rem; color:#a7f3d0; margin-bottom:1rem;"><i class="fas fa-building"></i> ${j.companyType || 'Enterprise Product / IT'}</div>

          <div style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom:1.5rem;">
            ${skillsList.map(s => `<span class="tech-tag" style="font-size:0.74rem;">${s.trim()}</span>`).join('')}
          </div>
        </div>

        <button class="btn btn-primary" style="width:100%; text-align:center;" onclick="openJobApplyModal('${j.id}', '${j.title.replace(/'/g, "\\'")}')">
          <i class="fas fa-paper-plane"></i> Apply Now & Submit Resume
        </button>
      </div>
    `;
  }).join('');
}

function openJobApplyModal(jobId, jobTitle) {
  const modal = document.getElementById('modal-job-apply');
  if (!modal) return;
  document.getElementById('apply-job-id').value = jobId;
  document.getElementById('apply-job-title').value = jobTitle;
  document.getElementById('modal-job-title-display').textContent = jobTitle;
  modal.classList.add('active');
}

function closeJobApplyModal() {
  const modal = document.getElementById('modal-job-apply');
  if (modal) modal.classList.remove('active');
}
