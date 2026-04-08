const express = require('express');
const { Storage } = require('@google-cloud/storage');
const app = express();
app.use(express.json());

// 🛡️ THE OMEGA DATABASE (LIVE MEMORY)
let activeNodes = []; 
const REVENUE_PER_NODE = 5000000;

// 🔌 GOOGLE CLOUD CONFIGURATION
const storage = new Storage({
  projectId: 'linear-pursuit-492616-i8',
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS)
});

// 🔌 AXON-BRIDGE: SECURE INJECTION
app.post('/api/website-handshake', async (req, res) => {
    const { fullName, companyName, jobTitle, email } = req.body;
    
    const newNode = {
        name: companyName || "Unknown Entity",
        commander: fullName || "Guest",
        title: jobTitle || "N/A",
        contact: email || "N/A",
        timestamp: new Date().toLocaleString(),
        status: "SECURED"
    };

    try {
        // 🏛️ CLOUD VAULT INJECTION
        const bucket = storage.bucket('axon-nodes-vault');
        const blob = bucket.file(`${newNode.name}-${Date.now()}.json`);
        await blob.save(JSON.stringify(newNode));
        
        activeNodes.push(newNode); 
        console.log(`🛰️ NODE SECURED IN CLOUD: ${newNode.name}`);
        res.json({ success: true, message: "MISSION FINISHED: NODE SECURED IN CLOUD" });
    } catch (error) {
        console.error("Cloud Error:", error);
        res.status(500).json({ error: "Cloud Connection Failed" });
    }
});

// --- 🖥️ SUPREME COMMAND CENTER UI ---
app.get('/', (req, res) => {
    let nodesList = activeNodes.map(node => `
        <div style="border-bottom:1px solid #333; padding:10px; font-size:0.8rem; text-align:left;">
            <span style="color:#0f0;">[${node.timestamp}]</span> 
            <b style="color:gold;">${node.name}</b> - Secured by ${node.commander} (${node.title})
        </div>
    `).reverse().join('') || "<p style='color:#444;'>No Active Handshakes Yet...</p>";

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>AXON-OMEGA | LIVE COMMAND</title>
            <style>
                body { background:#000; color:gold; font-family:monospace; margin:0; padding:40px; text-align:center; }
                .vault-box { border:10px double gold; padding:40px; background:#050505; max-width:900px; margin:auto; box-shadow:0 0 30px rgba(255,215,0,0.2); }
                .node-container { background:#111; border:1px solid gold; margin-top:30px; height:250px; overflow-y:auto; padding:15px; }
                input { background:#000; border:1px solid gold; color:gold; padding:10px; width:250px; }
                button { background:gold; color:black; font-weight:bold; padding:10px 20px; cursor:pointer; border:none; transition:0.3s; }
                button:hover { background:white; }
            </style>
        </head>
        <body>
            <div class="vault-box">
                <h1>🛡️ AXON-CORE COMMAND LIVE</h1>
                <p style="color:#0f0;">[SYSTEM SOVEREIGN] - 2000 LAYERS ACTIVE</p>
                <div style="display:flex; justify-content:space-around; margin:30px 0; border-bottom:1px solid #222; padding-bottom:20px;">
                    <div><p style="color:#666;">ACTIVE NODES</p><h2>${activeNodes.length} / 200</h2></div>
                    <div><p style="color:#666;">REVENUE</p><h2 style="color:#0f0;">$${(activeNodes.length * REVENUE_PER_NODE).toLocaleString()}</h2></div>
                </div>
                <h3>🛰️ LIVE HANDSHAKE FEED</h3>
                <div class="node-container">${nodesList}</div>
                <div style="margin-top:40px;">
                    <input type="text" id="n" placeholder="Manual Injection (Company Name)...">
                    <button onclick="manualDeploy()">⚡ ACTIVATE NODE</button>
                </div>
            </div>
            <script>
                function manualDeploy() {
                    let n = document.getElementById('n').value;
                    if(!n) return;
                    fetch('/api/website-handshake', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({companyName: n, fullName: 'COMMANDER MUAZZAM', jobTitle: 'ALPHA-CORE'})
                    }).then(() => location.reload());
                }
            </script>
        </body>
        </html>
    `);
});

module.exports = app;
