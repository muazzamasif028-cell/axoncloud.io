const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// 🛡️ DATA STORAGE (In-Memory for now)
let activeNodes = [];
const REVENUE_PER_NODE = 5000000;
const PLATFORM_MASTER_KEY = "MUAZZAM-ALPHA-786";

// --- 🖥️ SMART DASHBOARD ---
app.get('/', (req, res) => {
    const userKey = req.query.key;
    const isAdmin = userKey === PLATFORM_MASTER_KEY;
    
    // FILTER LOGIC: Admin ko sab dikhega, Client ko sirf apna ID
    let displayNodes = isAdmin ? activeNodes : activeNodes.filter(n => n.id === userKey);
    
    const count = isAdmin ? activeNodes.length : displayNodes.length;
    const totalRev = (count * REVENUE_PER_NODE).toLocaleString();

    res.send(`
        <body style="background:#000; color:gold; font-family:monospace; text-align:center; padding:20px;">
            <div style="border:5px double gold; padding:40px; background:#050505; max-width:1000px; margin:auto;">
                <h1>🛡️ AXON VAULT SYSTEM</h1>
                <p style="color:#0f0;">${isAdmin ? 'OWNER ACCESS: ALL ROOMS VISIBLE' : 'SECURE SESSION ACTIVE'}</p>

                <div style="display:flex; justify-content:space-around; margin:30px 0; background:#111; padding:20px;">
                    <div><p>NODES</p><h2>${count}</h2></div>
                    <div><p>REVENUE</p><h2 style="color:#0f0;">$${totalRev}</h2></div>
                </div>

                <div style="text-align:left; border-top:1px solid gold; padding-top:20px;">
                    <h3>${isAdmin ? 'ALL REGISTERED COMPANIES' : 'YOUR SECURE GATEWAY'}</h3>
                    <div id="roomContainer">
                        ${displayNodes.map(node => `
                            <div style="margin:10px 0; padding:15px; border:1px solid #222; display:flex; justify-content:space-between; align-items:center;">
                                <span>[${node.time}] <b>${node.name}</b></span>
                                <button onclick="window.location.href='/room/${node.id}'" 
                                    style="background:gold; color:black; border:none; padding:10px 20px; font-weight:bold; cursor:pointer;">
                                    ENTER ROOM
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                ${isAdmin ? `
                <div style="margin-top:30px; border:1px dashed gold; padding:20px;">
                    <h3>DEPLOY NEW CLIENT NODE</h3>
                    <input id="cName" type="text" placeholder="Company Name..." style="padding:10px;">
                    <button onclick="deploy()" style="padding:10px; background:gold;">GENERATE SECURE KEY</button>
                    <p id="newKey" style="color:cyan;"></p>
                </div>
                ` : ''}
            </div>

            <script>
                async function deploy() {
                    const name = document.getElementById('cName').value;
                    const id = 'AXON-' + Math.random().toString(36).substr(2, 9).toUpperCase();
                    await fetch('/api/website-handshake', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ companyName: name, id: id })
                    });
                    document.getElementById('newKey').innerText = "SHARE THIS KEY WITH CLIENT: ?key=" + id;
                    setTimeout(() => location.reload(), 3000);
                }
            </script>
        </body>
    `);
});

// --- 🔑 THE INDIVIDUAL ROOM (Flat Entry) ---
app.get('/room/:id', (req, res) => {
    const node = activeNodes.find(n => n.id === req.params.id);
    if (!node) return res.send("<h1>403: ACCESS DENIED</h1>");

    res.send(`
        <body style="background:#050505; color:cyan; font-family:monospace; text-align:center; padding:100px;">
            <div style="border:2px solid cyan; padding:50px; display:inline-block;">
                <h1>WELCOME TO ${node.name.toUpperCase()} VAULT</h1>
                <p>STATUS: PRIVACY ENCRYPTED</p>
                <hr>
                <p>Internal Data, Services, and Logs for ${node.name} only.</p>
                <button onclick="window.history.back()" style="background:cyan; border:none; padding:10px;">EXIT ROOM</button>
            </div>
        </body>
    `);
});

// --- 🔌 HANDSHAKE WITH UNIQUE ID ---
app.post('/api/website-handshake', (req, res) => {
    const { companyName, id } = req.body;
    activeNodes.push({
        id: id || 'EXT-' + Date.now(),
        name: companyName,
        time: new Date().toLocaleTimeString()
    });
    res.json({ success: true });
});

module.exports = app;
