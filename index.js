const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// 🛡️ DATA VAULT (Memory + Persistence Logic)
let activeNodes = []; 
const REVENUE_PER_NODE = 5000000;
const PLATFORM_MASTER_KEY = "MUAZZAM-ALPHA-786";

// --- 🖥️ SUPREME COMMAND CENTER ---
app.get('/', (req, res) => {
    const userKey = req.query.key;
    const isAdmin = userKey === PLATFORM_MASTER_KEY;

    res.send(`
        <body style="background:#000; color:gold; font-family:monospace; text-align:center; padding:20px;">
            <div style="border:5px double gold; padding:40px; background:#050505; max-width:1000px; margin:auto; box-shadow: 0 0 50px gold;">
                <h1 style="letter-spacing:10px; text-shadow: 0 0 10px gold;">🛡️ AXON SECURE VAULT</h1>
                
                <div id="statsSection" style="display:flex; justify-content:space-around; margin:40px 0; background:#111; padding:20px; border:1px solid #222;">
                    <div><p style="color:#666;">CONNECTED NODES</p><h2 id="nodeCount" style="font-size:40px;">0</h2></div>
                    <div><p style="color:#666;">TOTAL REVENUE</p><h2 id="revCount" style="color:#0f0; font-size:40px;">$0</h2></div>
                </div>

                <div style="text-align:left; border-top:1px solid gold; padding-top:20px;">
                    <h3 id="viewTitle">INITIALIZING SECURE UPLINK...</h3>
                    <div id="roomContainer"></div>
                </div>

                ${isAdmin ? `
                <div style="margin-top:40px; background:#0a0a0a; border:1px dashed gold; padding:20px;">
                    <h3>OWNER PANEL: DEPLOY NEW CLIENT</h3>
                    <input id="cName" type="text" placeholder="Company Name..." style="background:#000; color:gold; border:1px solid gold; padding:15px; width:60%;">
                    <button onclick="deploy()" style="background:gold; color:#000; padding:15px; border:none; font-weight:bold; cursor:pointer;">GENERATE KEY</button>
                    <p id="newKey" style="color:cyan; margin-top:10px;"></p>
                </div>
                ` : ''}
            </div>

            <script>
                // 🔐 PERSISTENCE LOGIC: Data ko browser mein save rakhna
                let localData = JSON.parse(localStorage.getItem('axon_vault')) || [];
                const isAdmin = ${isAdmin};
                const userKey = "${userKey}";

                function updateUI() {
                    const container = document.getElementById('roomContainer');
                    const filtered = isAdmin ? localData : localData.filter(n => n.id === userKey);
                    
                    document.getElementById('nodeCount').innerText = filtered.length;
                    document.getElementById('revCount').innerText = "$" + (filtered.length * 5000000).toLocaleString();
                    document.getElementById('viewTitle').innerText = isAdmin ? "ALL CLIENT ROOMS" : "YOUR PRIVATE ACCESS";

                    container.innerHTML = filtered.map(node => \`
                        <div style="margin:15px 0; padding:20px; border:1px solid #222; background:#080808; display:flex; justify-content:space-between; align-items:center; border-left: 5px solid gold;">
                            <div>
                                <b style="font-size:18px; color:gold;">\${node.name}</b><br>
                                <small style="color:#444;">ID: \${node.id} | DEPLOYED: \${node.time}</small>
                            </div>
                            <button onclick="window.location.href='/room/\${node.id}'" 
                                style="background:transparent; color:gold; border:1px solid gold; padding:10px 20px; cursor:pointer; font-weight:bold; transition: 0.3s;"
                                onmouseover="this.style.background='gold'; this.style.color='black';"
                                onmouseout="this.style.background='transparent'; this.style.color='gold';">
                                ACCESS ROOM
                            </button>
                        </div>
                    \`).join('');
                }

                async function deploy() {
                    const name = document.getElementById('cName').value;
                    if(!name) return;
                    const id = 'AXON-' + Math.random().toString(36).substr(2, 5).toUpperCase();
                    const entry = { id: id, name: name, time: new Date().toLocaleTimeString() };
                    
                    localData.push(entry);
                    localStorage.setItem('axon_vault', JSON.stringify(localData));
                    document.getElementById('newKey').innerText = "COPY THIS LINK FOR CLIENT: ?key=" + id;
                    updateUI();
                }

                updateUI();
            </script>
        </body>
    `);
});

// --- 🚪 THE PRIVATE ROOM ---
app.get('/room/:id', (req, res) => {
    res.send(`
        <body style="background:#000; color:cyan; font-family:monospace; text-align:center; padding-top:100px;">
            <div style="border:2px solid cyan; display:inline-block; padding:50px; box-shadow: 0 0 20px cyan;">
                <h1>ACCESS GRANTED: ROOM \${req.params.id}</h1>
                <p>Welcome to your encrypted workspace.</p>
                <button onclick="window.history.back()" style="background:cyan; color:black; border:none; padding:10px 20px; cursor:pointer;">EXIT VAULT</button>
            </div>
        </body>
    `);
});

module.exports = app;
