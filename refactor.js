const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

// 1. Remove initDatabase and its call
code = code.replace(/function initDatabase\(\) \{[\s\S]*?\}\n/g, `
let globalDB = { employees: [], projects: [], clients: [], attendance: [], leaves: [], timesheets: [], invoices: [], tickets: [] };

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
`);

// 3. Replace allEmployees() etc
code = code.replace(/function allEmployees\(\) \{ return JSON\.parse\(localStorage\.getItem\('dx_employees'\) \|\| '\[\]'\); \}/g, "function allEmployees() { return globalDB.employees || []; }");
code = code.replace(/function allProjects\(\) \{ return JSON\.parse\(localStorage\.getItem\('dx_projects'\) \|\| '\[\]'\); \}/g, "function allProjects() { return globalDB.projects || []; }");
code = code.replace(/function allAttendance\(\) \{ return JSON\.parse\(localStorage\.getItem\('dx_attendance'\) \|\| '\[\]'\); \}/g, "function allAttendance() { return globalDB.attendance || []; }");
code = code.replace(/function allLeaves\(\) \{ return JSON\.parse\(localStorage\.getItem\('dx_leaves'\) \|\| '\[\]'\); \}/g, "function allLeaves() { return globalDB.leaves || []; }");
code = code.replace(/function allTimesheets\(\) \{ return JSON\.parse\(localStorage\.getItem\('dx_timesheets'\) \|\| '\[\]'\); \}/g, "function allTimesheets() { return globalDB.timesheets || []; }");
code = code.replace(/function allInvoices\(\) \{ return JSON\.parse\(localStorage\.getItem\('dx_invoices'\) \|\| '\[\]'\); \}/g, "function allInvoices() { return globalDB.invoices || []; }");
code = code.replace(/function allTickets\(\) \{ return JSON\.parse\(localStorage\.getItem\('dx_tickets'\) \|\| '\[\]'\); \}/g, "function allTickets() { return globalDB.tickets || []; }");

code = code.replace(/function getEmployee\(id\) \{ return \(JSON\.parse\(localStorage\.getItem\('dx_employees'\) \|\| '\[\]'\)\)\.find\(e => e\.id === id\) \|\| \{\}; \}/g, "function getEmployee(id) { return (globalDB.employees||[]).find(e => e.id === id) || {}; }");
code = code.replace(/function getClient\(id\) \{ return \(JSON\.parse\(localStorage\.getItem\('dx_clients'\) \|\| '\[\]'\)\)\.find\(c => c\.id === id\) \|\| \{\}; \}/g, "function getClient(id) { return (globalDB.clients||[]).find(c => c.id === id) || {}; }");
code = code.replace(/function getProject\(id\) \{ return \(JSON\.parse\(localStorage\.getItem\('dx_projects'\) \|\| '\[\]'\)\)\.find\(p => p\.id === id\) \|\| \{\}; \}/g, "function getProject(id) { return (globalDB.projects||[]).find(p => p.id === id) || {}; }");

// 4. In initAuthSystem
code = code.replace(/const emps = JSON\.parse\(localStorage\.getItem\('dx_employees'\) \|\| '\[\]'\);/g, "const emps = globalDB.employees || [];");
code = code.replace(/const clients = JSON\.parse\(localStorage\.getItem\('dx_clients'\) \|\| '\[\]'\);/g, "const clients = globalDB.clients || [];");

// 5. Replace localStorage.setItem('dx_XXX', JSON.stringify(XXX))
code = code.replace(/localStorage\.setItem\('dx_attendance', JSON\.stringify\(att\)\);/g, "saveDB('attendance', att);");
code = code.replace(/localStorage\.setItem\('dx_employees', JSON\.stringify\(emps\)\);/g, "saveDB('employees', emps);");
code = code.replace(/localStorage\.setItem\('dx_timesheets', JSON\.stringify\(ts\)\);/g, "saveDB('timesheets', ts);");
code = code.replace(/localStorage\.setItem\('dx_leaves', JSON\.stringify\(leaves\)\);/g, "saveDB('leaves', leaves);");
code = code.replace(/localStorage\.setItem\('dx_projects', JSON\.stringify\(projs\)\);/g, "saveDB('projects', projs);");
code = code.replace(/localStorage\.setItem\('dx_tickets', JSON\.stringify\(tickets\)\);/g, "saveDB('tickets', tickets);");

// 6. Make DOMContentLoaded async so we await initDatabase()
code = code.replace(/document\.addEventListener\('DOMContentLoaded', \(\) => \{/, "document.addEventListener('DOMContentLoaded', async () => {");
code = code.replace(/initDatabase\(\);/, "await initDatabase();");

fs.writeFileSync('js/main.js', code);
console.log("Refactoring complete");
