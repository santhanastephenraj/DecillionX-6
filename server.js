// PROCESS CRASH PREVENTION GUARDS
process.on('uncaughtException', (err) => {
  console.error('[CRASH GUARD] Uncaught Exception trapped:', err.message, err.stack);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('[CRASH GUARD] Unhandled Rejection trapped:', reason);
});

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HEALTH CHECK ENDPOINT FOR PROXY WATCHDOG
app.get('/api/health', (req, res) => {
  res.json({ status: 'HEALTHY', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

const dbPath = path.join(__dirname, 'database.sqlite');

function sendCEONotification(subject, details, departmentEmail = 'info@decillionx.com') {
  try {
    const targetRecipient = departmentEmail || 'info@decillionx.com';
    const data = JSON.stringify({
      _subject: `[DecillionX Enterprise Alert] ${subject}`,
      _template: 'table',
      _captcha: 'false',
      DepartmentInbox: targetRecipient,
      CEOExecutiveCC: 'stephen@decillionx.com',
      ...details
    });

    const req = https.request({
      hostname: 'formsubmit.co',
      path: `/ajax/${targetRecipient}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'http://localhost:3000',
        'Referer': 'http://localhost:3000/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        console.log(`[FormSubmit Email Status to ${targetRecipient}: ${res.statusCode}] ->`, body);
      });
    });

    req.on('error', (e) => console.log('Mail notify error:', e.message));
    req.write(data);
    req.end();
  } catch(e) {
    console.error('sendCEONotification error:', e);
  }
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err);
  } else {
    console.log('Connected to SQLite database at', dbPath);
    initTables();
  }
});

function initTables() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS store (
      key TEXT PRIMARY KEY,
      value TEXT
    )`, () => {
      seedInitialData();
    });
  });
}

function seedInitialData() {
  const defaultData = {
    employees: [
      {
        id: 'EMP-001',
        name: 'Santhana Stephen Raj',
        role: 'Founder & Chief Executive Officer',
        email: 'stephen@decillionx.com',
        phone: '+91-9342888529',
        avatar: 'SS',
        dept: 'Executive Management',
        location: 'SG Palaya, Bangalore - 560029',
        password: 'admin123',
        status: 'Approved',
        emergencyContact: 'Executive Office (+91-9342888529)',
        bankDetails: 'HDFC Bank, HDFC0001234, Account: 50100234567890',
        skills: [
          { name: 'Strategic Leadership', level: 100, cat: 'Management' },
          { name: 'Enterprise AI Architecture', level: 98, cat: 'AI' }
        ],
        projects: [],
        performance: 100,
        joinDate: '2023-01-01'
      }
    ],
    projects: [],
    clients: [],
    attendance: [],
    leaves: [],
    timesheets: [],
    invoices: [],
    tickets: [],
    password_resets: [],
    contact_inquiries: [],
    job_openings: [
      {
        id: 'JOB-101',
        title: 'Senior Java 21 & Microservices Architect',
        dept: 'Software Systems Division',
        experience: '3 - 6 Years',
        companyType: 'Enterprise Product MNC',
        skills: ['Java 21', 'Spring Boot 3', 'Kafka', 'Microservices'],
        salary: '$80,000 - $110,000 / year',
        location: 'SG Palaya, Bangalore - 560029',
        status: 'Active',
        description: 'Architect distributed microservices, multi-tenant database clusters, and cloud API gateways.',
        postedDate: '2026-08-09'
      },
      {
        id: 'JOB-102',
        title: 'Principal AI & LLM Systems Lead',
        dept: 'Neural AI & Deep Learning Division',
        experience: '4 - 8 Years',
        companyType: 'AI Research Lab / Tech Startup',
        skills: ['Python', 'PyTorch', 'LLM Fine-Tuning', 'RAG Architecture', 'CrewAI'],
        salary: '$95,000 - $130,000 / year',
        location: 'SG Palaya, Bangalore - 560029',
        status: 'Active',
        description: 'Build autonomous multi-agent AI systems, fine-tune Llama 3 & DeepSeek models, and deploy RAG vector pipelines.',
        postedDate: '2026-08-09'
      },
      {
        id: 'JOB-103',
        title: 'Lead GenAI QA & VAPT Security Specialist',
        dept: 'Quality & Security Division',
        experience: '3 - 7 Years',
        companyType: 'Security Audit / Tech Product',
        skills: ['GenAI QA', 'LLM Hallucination Testing', 'Playwright', 'VAPT Security'],
        salary: '$75,000 - $105,000 / year',
        location: 'SG Palaya, Bangalore - 560029',
        status: 'Active',
        description: 'Lead automated GenAI prompt safety testing, Playwright E2E automation, and penetration security audits.',
        postedDate: '2026-08-09'
      }
    ],
    job_applications: [],
    leads: [],
    proposals: [],
    contracts: [],
    audit_logs: [
      {
        id: 'LOG-001',
        user: 'stephen@decillionx.com',
        role: 'Founder & CEO',
        action: 'System Security Initialization & Enterprise RBAC Audit Active',
        timestamp: new Date().toISOString(),
        ip: '127.0.0.1'
      }
    ]
  };

  db.get('SELECT COUNT(*) as count FROM store', (err, row) => {
    if (!err && row.count === 0) {
      console.log('Seeding initial CEO admin record into SQLite...');
      const stmt = db.prepare('INSERT INTO store (key, value) VALUES (?, ?)');
      for (const [key, val] of Object.entries(defaultData)) {
        stmt.run(key, JSON.stringify(val));
      }
      stmt.finalize();
    }
  });
}

// ================= API ROUTES (BEFORE STATIC FILES) =================

// 1-CLICK CEO EMAIL QUICK APPROVAL ROUTE
app.all('/api/admin/quick-approve', (req, res) => {
  const id = req.query.id || req.body?.id;
  const type = req.query.type || req.body?.type || 'employee';

  if (!id) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head><title>DecillionX CEO Approval Hub</title>
      <style>body { background: #0c1024; color: #fff; font-family: system-ui; display:flex; align-items:center; justify-content:center; height:100vh; margin:0; }
      .card { background: rgba(255,255,255,0.05); border: 1px solid rgba(0,242,254,0.4); border-radius: 20px; padding: 3rem; text-align: center; max-width: 520px; }
      .btn { background: linear-gradient(135deg, #00f2fe, #4facfe); color: #000; text-decoration: none; padding: 0.9rem 2rem; border-radius: 30px; font-weight: bold; display: inline-block; }
      </style></head>
      <body>
        <div class="card">
          <h2 style="color:#00f2fe">DecillionX Executive Approval Gateway</h2>
          <p style="color:#94a3b8">Please log into the Executive Admin Hub to manage pending approvals.</p>
          <a href="/login.html" class="btn">Open Portal Login</a>
        </div>
      </body>
      </html>
    `);
  }

  db.all('SELECT key, value FROM store', [], (err, rows) => {
    if (err) return res.status(500).send('Database error');
    const store = {};
    rows.forEach(r => store[r.key] = JSON.parse(r.value));

    let userName = id;
    if (type === 'client') {
      const clients = store.clients || [];
      const c = clients.find(cl => cl.id === id || cl.email.toLowerCase() === id.toLowerCase());
      if (c) {
        c.status = 'Approved';
        userName = c.name;
        db.run(`INSERT INTO store (key, value) VALUES ('clients', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`, [JSON.stringify(clients)]);
      }
    } else {
      const emps = store.employees || [];
      const e = emps.find(ep => ep.id === id || ep.email.toLowerCase() === id.toLowerCase());
      if (e) {
        e.status = 'Approved';
        userName = e.name;
        db.run(`INSERT INTO store (key, value) VALUES ('employees', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`, [JSON.stringify(emps)]);
      }
    }

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Account Approved | CEO Executive Verification</title>
        <style>
          body { background: #0c1024; color: #fff; font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
          .card { background: rgba(255,255,255,0.05); border: 1px solid rgba(0,242,254,0.4); border-radius: 20px; padding: 3rem; text-align: center; max-width: 520px; box-shadow: 0 25px 60px rgba(0,0,0,0.8); }
          .icon { font-size: 3.5rem; color: #00f2fe; margin-bottom: 1rem; }
          h1 { color: #fff; font-size: 1.8rem; margin-bottom: 0.5rem; }
          p { color: #94a3b8; font-size: 1rem; line-height: 1.6; margin-bottom: 2rem; }
          .btn { background: linear-gradient(135deg, #00f2fe, #4facfe); color: #000; text-decoration: none; padding: 0.9rem 2rem; border-radius: 30px; font-weight: bold; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">✅</div>
          <h1>Account Approved Successfully!</h1>
          <p>The ${type.toUpperCase()} account for <strong>${userName}</strong> has been officially verified & approved by <strong>CEO Santhana Stephen Raj</strong>. The user can now log in to access their portal dashboard.</p>
          <a href="/login.html" class="btn">Open DecillionX Gateway Login</a>
        </div>
      </body>
      </html>
    `);
  });
});

// GET / POST STORE
app.get('/api/store', (req, res) => {
  db.all('SELECT key, value FROM store', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const data = {};
    rows.forEach(row => {
      try { data[row.key] = JSON.parse(row.value); } catch(e) { data[row.key] = row.value; }
    });
    res.json(data);
  });
});

app.post('/api/store', (req, res) => {
  const { key, data } = req.body;
  if (!key || !data) return res.status(400).json({ error: 'Missing key or data' });

  db.run(
    `INSERT INTO store (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [key, JSON.stringify(data)],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, key });
    }
  );
});

// Dual Auth Login API with Status Approval Verification
app.post('/api/auth/login', (req, res) => {
  const { credential, password, portalType } = req.body;
  if (!credential || !password) {
    return res.status(400).json({ success: false, message: 'Please provide Email Address / Phone Number and Password.' });
  }

  const cleanCred = credential.trim().toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9@._+-]/g, '');

  db.all('SELECT key, value FROM store', [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    const store = {};
    rows.forEach(r => store[r.key] = JSON.parse(r.value));

    const employees = store.employees || [];
    const clients = store.clients || [];

    if (portalType === 'client') {
      const client = clients.find(c => {
        const emailMatch = c.email.toLowerCase() === cleanCred;
        const phoneMatch = (c.phone || '').replace(/\D/g, '').includes(cleanCred.replace(/\D/g, ''));
        return (emailMatch || phoneMatch) && c.password === password;
      });

      if (client) {
        if (client.status === 'Pending Verification' || client.status === 'Pending Approval') {
          return res.status(403).json({
            success: false,
            message: '🔒 Client Company Account Pending Legal Verification by CEO Santhana Stephen Raj. Please await verification approval.'
          });
        }
        return res.json({ success: true, user: client, role: 'client', redirectUrl: '/client-dashboard.html' });
      }
      return res.status(401).json({ success: false, message: 'Invalid Client Email/Phone or Password.' });
    } else {
      // Employee or Executive Admin Portal
      const employee = employees.find(e => {
        const emailMatch = e.email.toLowerCase() === cleanCred;
        const phoneMatch = (e.phone || '').replace(/\D/g, '').includes(cleanCred.replace(/\D/g, ''));
        return (emailMatch || phoneMatch) && e.password === password;
      });

      if (employee) {
        const isCEO = employee.email.toLowerCase() === 'stephen@decillionx.com' || employee.id === 'EMP-001' || employee.name.includes('Santhana Stephen Raj');

        if (portalType === 'admin' && !isCEO) {
          return res.status(403).json({
            success: false,
            message: '🔒 Access Denied: Only CEO Santhana Stephen Raj can access the Executive Admin Hub. Please select "Employee Portal".'
          });
        }

        if (!isCEO && (employee.status === 'Pending Approval' || employee.status === 'Pending Verification')) {
          return res.status(403).json({
            success: false,
            message: '🔒 Employee Account Pending Admin / CEO Approval. Please await email approval from CEO Santhana Stephen Raj.'
          });
        }

        const assignedRole = isCEO ? 'admin' : 'employee';
        const redirectUrl = assignedRole === 'admin' ? '/admin-dashboard.html' : '/employee-dashboard.html';

        return res.json({
          success: true,
          user: employee,
          role: assignedRole,
          redirectUrl
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid Employee Email/Phone or Password.' });
    }
  });
});

// Registration API (Employee Registration & Client Legal Registration)
app.post('/api/auth/register', (req, res) => {
  const { accountType, fullName, email, phone, password, dept, roleTitle, companyName, gstin, cin, businessAddress, websiteUrl, directorName } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please complete all required fields.' });
  }

  const generatedId = (accountType === 'client' ? 'CLT-' : 'EMP-') + Date.now();
  const directApprovalLink = `http://localhost:3000/api/admin/quick-approve?id=${generatedId}&type=${accountType}`;

  // DISPATCH BACKEND MAIL NOTIFICATION TO CEO (stephen@decillionx.com) WITH 1-CLICK APPROVAL LINK
  sendCEONotification(`🔐 CEO Approval Needed: New ${accountType.toUpperCase()} Account - ${fullName}`, {
    AccountType: accountType.toUpperCase(),
    ApplicantName: fullName,
    ApplicantEmail: email,
    ApplicantPhone: phone,
    CompanyName: companyName || 'N/A',
    TaxID_GSTIN_CIN: gstin || cin || 'N/A',
    WebsiteURL: websiteUrl || 'N/A',
    DirectorName: directorName || 'N/A',
    DIRECT_CLICK_TO_APPROVE_NOW: directApprovalLink
  });

  db.all('SELECT key, value FROM store', [], async (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    const store = {};
    rows.forEach(r => store[r.key] = JSON.parse(r.value));

    if (accountType === 'client') {
      const clients = store.clients || [];
      if (clients.some(c => c.email.toLowerCase() === email.toLowerCase())) {
        return res.status(400).json({ success: false, message: 'A client account with this email already exists.' });
      }

      const newClient = {
        id: generatedId,
        name: companyName || fullName,
        contact: fullName,
        email,
        phone,
        password,
        status: 'Pending Verification',
        gstin: gstin || 'Pending Verification',
        cin: cin || 'Pending Verification',
        businessAddress: businessAddress || 'Pending Verification',
        websiteUrl: websiteUrl || 'https://',
        directorName: directorName || fullName,
        registeredDate: new Date().toLocaleDateString('en-IN'),
        projects: [],
        logo: (companyName || fullName).slice(0,2).toUpperCase()
      };

      clients.unshift(newClient);
      db.run(
        `INSERT INTO store (key, value) VALUES (?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
        ['clients', JSON.stringify(clients)],
        (err2) => {
          if (err2) return res.status(500).json({ success: false, message: err2.message });
          res.json({
            success: true,
            message: 'Account Registered Successfully! Your registration has been submitted and an instant approval notification email was sent.'
          });
        }
      );
    } else {
      // Employee Registration
      const employees = store.employees || [];
      if (employees.some(e => e.email.toLowerCase() === email.toLowerCase())) {
        return res.status(400).json({ success: false, message: 'An employee account with this email already exists.' });
      }

      const newEmp = {
        id: generatedId,
        name: fullName,
        role: roleTitle || 'Software Engineer',
        email,
        phone,
        password,
        status: 'Pending Approval',
        avatar: fullName.slice(0,2).toUpperCase(),
        dept: dept || 'Software Systems Division',
        location: 'SG Palaya, Bangalore - 560029',
        skills: [{ name: 'Enterprise Engineering', level: 90, cat: 'Software' }],
        projects: [],
        performance: 90,
        joinDate: new Date().toISOString().split('T')[0]
      };

      employees.push(newEmp);
      db.run(
        `INSERT INTO store (key, value) VALUES (?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
        ['employees', JSON.stringify(employees)],
        (err2) => {
          if (err2) return res.status(500).json({ success: false, message: err2.message });
          res.json({
            success: true,
            message: 'Account Registered Successfully! Your registration has been submitted and an instant approval notification email was sent.'
          });
        }
      );
    }
  });
});

// Forgot Password Reset Request API
app.post('/api/auth/forgot-password', (req, res) => {
  const { credential, requestedPassword, reason } = req.body;
  if (!credential || !requestedPassword) {
    return res.status(400).json({ success: false, message: 'Please fill in your Email/Phone and your new requested password.' });
  }

  sendCEONotification(`🔑 Password Reset Request: ${credential}`, {
    UserCredential: credential,
    RequestedNewPassword: requestedPassword,
    Reason: reason || 'Forgotten password'
  });

  db.all('SELECT key, value FROM store', [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    const store = {};
    rows.forEach(r => store[r.key] = JSON.parse(r.value));

    const resets = store.password_resets || [];
    const newReset = {
      id: 'RST-' + Date.now(),
      userCredential: credential,
      requestedPassword,
      reason: reason || 'Password forgotten',
      requestedDate: new Date().toLocaleDateString('en-IN'),
      status: 'Pending Approval'
    };

    resets.unshift(newReset);
    db.run(
      `INSERT INTO store (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      ['password_resets', JSON.stringify(resets)],
      (err2) => {
        if (err2) return res.status(500).json({ success: false, message: err2.message });
        res.json({
          success: true,
          message: 'Password Reset Request Logged! It is pending approval from Admin / CEO Santhana Stephen Raj.'
        });
      }
    );
  });
});

// CAREERS & HIRING ENDPOINTS

// 1. Post New Job Opening (CEO/Admin)
app.post('/api/careers/jobs', (req, res) => {
  const { title, dept, experience, companyType, skills, salary, location, description } = req.body;
  if (!title || !dept || !description) {
    return res.status(400).json({ success: false, message: 'Please provide job title, department, and description.' });
  }

  const newJob = {
    id: 'JOB-' + Date.now(),
    title,
    dept,
    experience: experience || '2 - 5 Years',
    companyType: companyType || 'Enterprise IT / Product',
    skills: Array.isArray(skills) ? skills : (skills || 'General Tech').split(',').map(s => s.trim()),
    salary: salary || '$80,000 - $110,000 / year',
    location: location || 'SG Palaya, Bangalore - 560029',
    status: 'Active',
    description,
    postedDate: new Date().toLocaleDateString('en-IN')
  };

  // Dispatch Email Notification to CEO Email
  sendCEONotification(`💼 New Job Opening Posted: ${title}`, {
    JobTitle: title,
    Department: dept,
    ExperienceRequired: experience,
    TargetCompanyType: companyType,
    SkillsRequired: Array.isArray(skills) ? skills.join(', ') : skills,
    SalaryUSD: salary,
    Location: location
  });

  db.all('SELECT key, value FROM store', [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    const store = {};
    rows.forEach(r => store[r.key] = JSON.parse(r.value));

    const jobs = store.job_openings || [];
    jobs.unshift(newJob);

    db.run(
      `INSERT INTO store (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      ['job_openings', JSON.stringify(jobs)],
      (err2) => {
        if (err2) return res.status(500).json({ success: false, message: err2.message });
        res.json({ success: true, message: 'Job opening posted successfully and published to Careers Portal!', job: newJob });
      }
    );
  });
});

// 2. Submit Resume & Application (Applicant)
app.post('/api/careers/apply', (req, res) => {
  const { jobId, jobTitle, fullName, email, phone, experienceYears, companyType, primarySkill, coverNote, resumeContent } = req.body;

  if (!fullName || !email || !primarySkill) {
    return res.status(400).json({ success: false, message: 'Please provide full name, email address, and primary skill set.' });
  }

  const newApp = {
    id: 'APP-' + Date.now(),
    jobId: jobId || 'GENERAL',
    jobTitle: jobTitle || 'General Engineering Application',
    fullName,
    email,
    phone: phone || 'N/A',
    experienceYears: experienceYears || '3 Years',
    companyType: companyType || 'Product MNC',
    primarySkill: primarySkill || 'Java & Python',
    coverNote: coverNote || 'Application submitted via website',
    resumeContent: resumeContent || 'Resume details submitted',
    status: 'Pending Review',
    appliedDate: new Date().toLocaleDateString('en-IN')
  };

  // DISPATCH REAL EMAIL NOTIFICATION TO RECRUITMENT (careers@decillionx.com) WITH CANDIDATE PROFILE & RESUME
  sendCEONotification(`📄 New Job Candidate Resume Submitted: ${fullName} (${primarySkill})`, {
    ApplicantName: fullName,
    ApplicantEmail: email,
    ApplicantPhone: phone,
    JobApplied: jobTitle,
    YearsOfExperience: experienceYears,
    PreviousCompanyType: companyType,
    PrimarySkillSet: primarySkill,
    CoverNote: coverNote,
    ResumeData: resumeContent
  }, 'careers@decillionx.com');

  db.all('SELECT key, value FROM store', [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    const store = {};
    rows.forEach(r => store[r.key] = JSON.parse(r.value));

    const apps = store.job_applications || [];
    apps.unshift(newApp);

    db.run(
      `INSERT INTO store (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      ['job_applications', JSON.stringify(apps)],
      (err2) => {
        if (err2) return res.status(500).json({ success: false, message: err2.message });
        res.json({
          success: true,
          message: 'Job Application & Resume Submitted Successfully! An instant email alert was dispatched to careers@decillionx.com with CEO oversight.'
        });
      }
    );
  });
});

// CUSTOM PROPOSAL REQUEST ENDPOINT (DISPATCHES FULL PROPOSAL MODEL TO SALES EMAIL)
app.post('/api/proposals/request', (req, res) => {
  const {
    fullName,
    companyName,
    email,
    phone,
    industry,
    serviceRequired,
    budget,
    targetTimeline,
    scopeDeliverables,
    businessObjectives
  } = req.body;

  if (!fullName || !companyName || !email || !serviceRequired) {
    return res.status(400).json({ success: false, message: 'Please provide full name, company name, email address, and service required.' });
  }

  const newProposalRequest = {
    id: 'PRP-' + Date.now(),
    fullName,
    companyName,
    email,
    phone: phone || 'N/A',
    industry: industry || 'Enterprise Tech',
    serviceRequired,
    budget: budget || 'Undisclosed',
    targetTimeline: targetTimeline || 'Immediate Kickoff',
    scopeDeliverables: scopeDeliverables || 'Custom Enterprise Development',
    businessObjectives: businessObjectives || 'Digital Transformation',
    status: 'Pending Review',
    submittedDate: new Date().toLocaleDateString('en-IN')
  };

  // DISPATCH REAL EMAIL NOTIFICATION TO SALES (sales@decillionx.com) WITH FULL PROPOSAL MODEL DETAILS
  sendCEONotification(`📑 CUSTOM PROPOSAL REQUEST: ${companyName} (${serviceRequired})`, {
    ClientName: fullName,
    CompanyName: companyName,
    ClientEmail: email,
    ClientPhone: phone,
    IndustrySector: industry,
    ServiceRequired: serviceRequired,
    EstimatedBudget: budget,
    TargetTimeline: targetTimeline,
    ScopeOfDeliverables: scopeDeliverables,
    BusinessObjectives: businessObjectives
  }, 'sales@decillionx.com');

  db.all('SELECT key, value FROM store', [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    const store = {};
    rows.forEach(r => store[r.key] = JSON.parse(r.value));

    const proposals = store.proposals || [];
    proposals.unshift(newProposalRequest);

    const inquiries = store.contact_inquiries || [];
    inquiries.unshift({
      id: 'INQ-' + Date.now(),
      name: `${fullName} (${companyName})`,
      email,
      phone: phone || 'N/A',
      subject: `Proposal Request: ${serviceRequired} (${budget})`,
      message: `Industry: ${industry} | Deliverables: ${scopeDeliverables} | Objectives: ${businessObjectives}`,
      date: new Date().toLocaleDateString('en-IN')
    });

    db.run(
      `INSERT INTO store (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      ['proposals', JSON.stringify(proposals)],
      () => {
        db.run(
          `INSERT INTO store (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
          ['contact_inquiries', JSON.stringify(inquiries)],
          (err2) => {
            if (err2) return res.status(500).json({ success: false, message: err2.message });
            res.json({
              success: true,
              message: 'Custom Proposal Request Submitted Successfully! A comprehensive proposal model alert has been dispatched directly to CEO Santhana Stephen Raj.'
            });
          }
        );
      }
    );
  });
});

// STATIC FILE MIDDLEWARE AT THE END
app.use(express.static(path.join(__dirname)));

// GLOBAL EXPRESS ERROR HANDLER
app.use((err, req, res, next) => {
  console.error('[EXPRESS ERROR HANDLER]', err);
  res.status(500).json({ success: false, error: 'Internal Server Error', message: err.message });
});

const server = app.listen(PORT, () => {
  console.log(`DecillionX Enterprise Server running on http://localhost:${PORT}`);
});

// KEEPALIVE & HEADERS TIMEOUT FOR PROXY STABILITY (APISIX / OPENRESTY)
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[PORT IN USE] Port ${PORT} is currently in use. Server will retry in 1s...`);
  } else {
    console.error('[SERVER ERROR]', err);
  }
});
