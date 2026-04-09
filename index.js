const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// 🛡️ OWNER MASTER KEY
const MASTER_KEY = "MUAZZAM-ALPHA-786";

app.get('/', (req, res) => {
    const userKey = req.query.key;
    const isAdmin = userKey === MASTER_KEY;

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>AXON COMMAND CENTER</title>
            <style>
                body { background:#000; color:gold; font-family:monospace; text-align:center; padding:20px; }
                .vault-card { border:5px double gold; padding:40px; background:#050505; max-width:900px; margin:auto; box-shadow: 0 0 50px gold; }
                .stats-grid { display:flex; justify-content:space-around; margin:30px 0; background:#111; padding:20px; border:1px solid #222; }
                .flat-unit { background:#0a0a0a; border:1px solid #333; margin:10px 0; padding:15px; display:flex; justify-content:space-between; align-items:center; border-left:5px solid gold; }
                input { background:#000; color:gold; border:1px solid gold; padding:15px; width:60%; font-family:monospace; }
                button { background:gold; color:black; border:none; padding:15px 30px; font-weight:bold; cursor:pointer; font-family:monospace; }
                button:hover { background:#fff; }
                .key-box { color:cyan; font-size:12px; margin-top:15px; border:1px dashed #444; padding:10px; display:none; }
            </style>
        </head>
        <body>
            <div class="vault-card">
                <h1>🛡️ AXON COMMAND CENTER</h1>
                <p style="color:\${isAdmin ? '#0f0' : 'red'};">[ MODE: \${isAdmin ? 'GOD-MODE' : 'SECURE-VIEW'} ]</p>

                <div class="stats-grid">
                    <div><p style="color:#666;">ACTIVE NODES</p><h2 id="nDisplay">0</h2></div>
                    <div><p style="color:#666;">TOTAL REVENUE</p><h2 id="rDisplay" style="color:#0f0;">$0</h2></div>
                </div>

                <div style="text-align:left;">
                    <h3 style="border-bottom:1px solid gold; padding-bottom:5px;">🔗 SECURE ACCESS TERMINAL</h3>
                    <div id="vaultList"></div>
                </div>

                \${isAdmin ? \`
                <div style="margin-top:40px; border-top:1px solid #222; padding-top:20px; background:#080808; padding:20px;">
                    <h3>DEPLOY NEW CLIENT FLAT</h3>
                    <input id="nodeInput" type="text" placeholder="Enter Company Name...">
                    <button onclick="createNewNode()">EXECUTE UPLINK</button>
                    <div id="keyBox" class="key-box"></div>
                </div>
                \` : ''}
            </div>

            <script>
                // 🔐 THE PERSISTENCE ENGINE
                let storage = JSON.parse(localStorage.getItem('axon_global_v2')) || [];
                const isAdmin = \${isAdmin};
                const currentKey = "\${userKey}";

                function refreshUI() {
                    const list = document.getElementById('vaultList');
                    // Logic: Owner sees all, Client sees only their specific key match
                    const visibleData = isAdmin ? storage : storage.filter(item => item.id === currentKey);
                    
                    document.getElementById('nDisplay').innerText = visibleData.length;
                    document.getElementById('rDisplay').innerText = "$" + (visibleData.length * 5000000).toLocaleString();

                    if(visibleData.length === 0) {
                        list.innerHTML = "<p style='color:#444;'>No active rooms found for this key.</p>";
                    } else {
                        list.innerHTML = visibleData.map(node => \`
                            <div class="flat-unit">
                                <span>🔑 <b>\${node.name.toUpperCase()}</b><br><small style="color:#444;">ID: \${node.id}</small></span>
                                <button onclick="location.href='/room/\${node.id}'">ENTER ROOM</button>
                            </div>
                        \`).join('');
                    }
                }

                function createNewNode() {
                    const name = document.getElementById('nodeInput').value;
                    if(!name) return alert("Please enter a name!");
                    
                    const newID = 'AXON-' + Math.random().toString(36).substr(2, 6).toUpperCase();
                    storage.push({ id: newID, name: name, time: new Date().toLocaleTimeString() });
                    
                    localStorage.setItem('axon_global_v2', JSON.stringify(storage));
                    
                    const keyBox = document.getElementById('keyBox');
                    keyBox.style.display = "block";
                    keyBox.innerText = "CLIENT ACCESS LINK: " + window.location.origin + "/?key=" + newID;
                    
                    document.getElementById('nodeInput').value = "";
                    refreshUI();
                }

                refreshUI();
            </script>
        </body>
        </html>
    `);
});

// --- 🚪 THE PRIVATE INTERIOR ---
app.get('/room/:id', (req, res) => {
    res.send(\`
        <body style="background:#000; color:cyan; font-family:monospace; text-align:center; padding-top:100px;">
            <div style="border:2px solid cyan; display:inline-block; padding:50px; box-shadow: 0 0 20px cyan;">
                <h1>ACCESS GRANTED: ROOM \${req.params.id}</h1>
                <p style="color:gold;">Privacy Protection Active</p>
                <hr style="border:1px solid #222;">
                <p>Welcome to the private layer of your company.</p>
                <button onclick="history.back()" style="background:cyan; border:none; padding:10px 20px; font-weight:bold; cursor:pointer;">RETURN TO DASHBOARD</button>
            </div>
        </body>
    \`);
});

module.exports = app;
