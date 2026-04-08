const express = require('express');
const { Storage } = require('@google-cloud/storage');
const vision = require('@google-cloud/vision'); // 👁️ Vision Engine
const app = express();
app.use(express.json());

// 🛡️ THE OMEGA DATABASE
let activeNodes = []; 
const REVENUE_PER_NODE = 5000000;

// 🔌 GOOGLE CLOUD CONFIG
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
const storage = new Storage({ projectId: 'linear-pursuit-492616-i8', credentials });
const visionClient = new vision.ImageAnnotatorClient({ credentials });

// 👁️ AXON-VISION: IMAGE ANALYSIS FUNCTION
async function scanAsset(imageUrl) {
    try {
        const [result] = await visionClient.labelDetection(imageUrl);
        const labels = result.labelAnnotations.map(label => label.description);
        console.log("Axon-Vision Scan Results:", labels);
        return labels;
    } catch (e) {
        return ["Scan Failed"];
    }
}

// 🔌 AXON-BRIDGE: SECURE INJECTION
app.post('/api/website-handshake', async (req, res) => {
    const { fullName, companyName, jobTitle, imageUrl } = req.body;
    
    // Auto-Scan if image is provided
    let aiTags = imageUrl ? await scanAsset(imageUrl) : ["No Visual Data"];

    const newNode = {
        name: companyName || "Unknown Entity",
        commander: fullName || "Guest",
        tags: aiTags.slice(0, 3).join(', '), // Sirf top 3 AI results dikhayega
        timestamp: new Date().toLocaleString(),
        status: "SECURED"
    };

    try {
        const bucket = storage.bucket('axon-nodes-vault');
        const blob = bucket.file(`${newNode.name}-${Date.now()}.json`);
        await blob.save(JSON.stringify(newNode));
        
        activeNodes.push(newNode); 
        res.json({ success: true, message: "MISSION FINISHED: NODE & VISION SECURED" });
    } catch (error) {
        res.status(500).json({ error: "Cloud Connection Failed" });
    }
});

// --- 🖥️ SUPREME COMMAND CENTER UI ---
app.get('/', (req, res) => {
    let nodesList = activeNodes.map(node => `
        <div style="border-bottom:1px solid #333; padding:10px; font-size:0.8rem; text-align:left;">
            <span style="color:#0f0;">[${node.timestamp}]</span> 
            <b style="color:gold;">${node.name}</b> - Secured by ${node.commander} 
            <br><small style="color:#888;">AI Tags: ${node.tags}</small>
        </div>
    `).reverse().join('') || "<p style='color:#444;'>No Active Handshakes Yet...</p>";

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>AXON-OMEGA | LIVE COMMAND</title>
            <style>
                body { background:#000; color:gold; font-family:monospace; margin:0; padding:40px; text-align:center; }
                .vault-box { border:10px double gold; padding:40px; background:#050505; max-width:900px; margin:auto; }
                .node-container { background:#111; border:1px solid gold; margin-top:30px; height:250px; overflow-y:auto; padding:15px; }
                button { background:gold; color:black; font-weight:bold; padding:10px 20px; cursor:pointer; border:none; }
            </style>
        </head>
        <body>
            <div class="vault-box">
                <h1>🛡️ AXON-CORE COMMAND LIVE</h1>
                <div style="display:flex; justify-content:space-around; margin:30px 0;">
                    <div><p>ACTIVE NODES</p><h2>${activeNodes.length} / 200</h2></div>
                    <div><p>REVENUE</p><h2 style="color:#0f0;">$${(activeNodes.length * REVENUE_PER_NODE).toLocaleString()}</h2></div>
                </div>
                <h3>🛰️ LIVE HANDSHAKE FEED (VISION ENABLED)</h3>
                <div class="node-container">${nodesList}</div>
                <div style="margin-top:40px;">
                    <input type="text" id="n" placeholder="Company Name...">
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
                        body: JSON.stringify({companyName: n, fullName: 'COMMANDER MUAZZAM'})
                    }).then(() => location.reload());
                }
            </script>
        </body>
        </html>
    `);
});

module.exports = app;
