const express = require('express');
const cors = require('cors');
const app = express();

// ✅ CORS aur JSON parsing taake har jagah se connection mil sake
app.use(cors({ origin: '*' }));
app.use(express.json());

// 🛡️ MASTER KEY: Sirf aapke paas hogi (Owner Access)
const PLATFORM_MASTER_KEY = "MUAZZAM-ALPHA-786";

// --- 🖥️ CORE SYSTEM (Main Page) ---
app.get('/', (req, res) => {
    const userKey = req.query.key; // URL se key check karna (?key=...)
    const isAdmin = userKey === PLATFORM_MASTER_KEY;

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>AXON SECURE VAULT</title>
            <style>
                body { background: #000; color: gold; font-family: 'Courier New', monospace; text-align: center; padding: 20px; }
                .container { border: 5px double gold; padding: 40px; background: #050505; max-width: 1000px; margin: auto; box-shadow: 0 0 50px gold; }
                .stats-box { display: flex; justify-content: space-around; margin: 40px 0; background: #111; padding: 20px; border: 1px solid #222; }
                .node-card { margin: 15px 0; padding: 20px; border: 1px solid #222; background: #080808; display: flex; justify-content: space-between; align-items: center; border-left: 5px solid gold; border-radius: 5px; }
                .btn-access { background: transparent; color: gold; border: 1px solid gold; padding: 10px 20px; cursor: pointer; font-weight: bold; transition: 0.3s; }
                .btn-access:hover { background: gold; color: #000; }
                .owner-panel { margin-top: 50px; background: #0a0a0a; border: 1px dashed gold; padding: 30px; }
                input { background: #000; color: gold; border: 1px solid gold; padding: 15px; width: 60%; margin-bottom: 10px; }
                .btn-deploy { background: gold; color: #000; padding: 15px 30px; border: none; font-weight: bold; cursor: pointer; }
                .key-display { color: cyan; margin-top: 15px; font-weight: bold; word-break: break-all; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1 style="letter-spacing: 10px;">🛡️ AXON VAULT SYSTEM</h1>
                <p style="color: #0f0; border: 1px solid #333; padding: 5px; display: inline-block;">
                    ${isAdmin ? "OWNER ACCESS ACTIVE" : "SECURE CLIENT SESSION"}
                </p>

                <div class="stats-box">
                    <div><p style="color: #666;">NODES (FLATS)</p><h2 id="nodeCount" style="font-size: 45px; margin: 0;">0</h2></div>
                    <div><p style="color: #666;">TOTAL REVENUE</p><h2 id="revCount" style="color: #0f0; font-size: 45px; margin: 0;">$0</h2></div>
                </div>

                <div style="text-align: left;">
                    <h3 id="viewTitle" style="border-bottom: 1px solid gold; padding-bottom: 10px;">INITIALIZING SECURE LINK...</h3>
                    <div id="roomContainer"></div>
                </div>

                ${isAdmin ? `
                <div class="owner-panel">
                    <h3>🛠️ OWNER PANEL: DEPLOY NEW FLAT</h3>
                    <input id="cName" type="text" placeholder="Enter Company Name (e.g. Amazon)">
                    <button class="btn-deploy" onclick="deploy()">GENERATE ACCESS CARD</button>
                    <div id="newKey" class="key-display"></div>
                </div>
                ` : ''}
            </div>

            <script>
                // 🔐 STORAGE ENGINE: Data browser mein save rahega
                let vaultData = JSON.parse(localStorage.getItem('axon_vault_permanent')) || [];
                const isAdmin = ${isAdmin};
                const userKey = "${userKey}";

                function render() {
                    const container = document.getElementById('roomContainer');
                    // FILTER: Owner ko sab, Client ko sirf apna ID
                    const displayData = isAdmin ? vaultData : vaultData.filter(r => r.id === userKey);

                    document.getElementById('nodeCount').innerText = displayData.length;
                    document.getElementById('revCount').innerText = "$" + (displayData.length * 5000000).toLocaleString();
                    document.getElementById('viewTitle').innerText = isAdmin ? "ALL ACTIVE ROOMS" : "YOUR SECURE FLAT";

                    container.innerHTML = displayData.map(room => \`
                        <div class="node-card">
                            <div>
                                <b style="font-size: 20px;">🔑 \${room.name}</b><br>
                                <small style="color: #444;">ID: \${room.id} | CREATED: \${room.time}</small>
                            </div>
                            <button class="btn-access" onclick="window.location.href='/room/\${room.id}'">
                                ENTER ROOM
                            </button>
                        </div>
                    \`).join('');
                }

                function deploy() {
                    const name = document.getElementById('cName').value;
                    if(!name) return alert("Pehle Name likhein!");

                    // Unique Key Generate karna
                    const id = 'AXON-' + Math.random().toString(36).substr(2, 6).toUpperCase();
                    const newEntry = { id: id, name: name, time: new Date().toLocaleTimeString() };

                    vaultData.push(newEntry);
                    localStorage.setItem('axon_vault_permanent', JSON.stringify(vaultData));
                    
                    document.getElementById('newKey').innerHTML = "SUCCESS! SHARE THIS LINK WITH CLIENT:<br>https://" + window.location.host + "/?key=" + id;
                    render();
                }

                render();
            </script>
        </body>
        </html>
    `);
});

// --- 🚪 THE PRIVATE ROOM (Flat Interior) ---
app.get('/room/:id', (req, res) => {
    res.send(`
        <body style="background:#000; color:cyan; font-family:monospace; text-align:center; padding-top:100px;">
            <div style="border:2px solid cyan; display:inline-block; padding:50px; box-shadow: 0 0 30px cyan;">
                <h1 style="letter-spacing:5px;">ACCESS GRANTED</h1>
                <p style="color:gold;">WELCOME TO YOUR PRIVATE VAULT: [ \${req.params.id} ]</p>
                <hr style="border:1px solid #222; margin:20px 0;">
                <p>Yahan sirf aapka secure data aur services hain.</p>
                <button onclick="window.history.back()" style="background:cyan; color:black; border:none; padding:10px 20px; font-weight:bold; cursor:pointer;">EXIT ROOM</button>
            </div>
        </body>
    `);
});

module.exports = app;
