const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// ✅ CORS Policy: Taake 2000 layers wali website aur dashboard aapas mein jur sakein
app.use(cors({ origin: '*' })); 
app.use(express.json());

// 🛡️ THE OMEGA VAULT
let activeNodes = [];
const REVENUE_PER_NODE = 5000000;
const PLATFORM_MASTER_KEY = "MUAZZAM-ALPHA-786";

// AI Initialization
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// --- 🖥️ COMMAND CENTER DASHBOARD ---
app.get('/', (req, res) => {
    const isAdmin = req.query.key === PLATFORM_MASTER_KEY;
    const count = activeNodes.length;
    const totalRev = (count * REVENUE_PER_NODE).toLocaleString();

    res.send(`
        <body style="background:#000; color:gold; font-family:monospace; text-align:center; padding:30px;">
            <div style="border:5px double gold; padding:40px; background:#050505; max-width:900px; margin:auto; box-shadow: 0 0 20px gold;">
                <h1 style="letter-spacing:10px;">🛡️ AXON COMMAND CENTER</h1>
                
                <p style="color:#0f0; border:1px solid #222; padding:10px; display:inline-block; background:#000;">
                    UPLINK STATUS: ${isAdmin ? 'GOD-MODE ACTIVE' : 'CONNECTED TO 2000 LAYERS'}
                </p>

                <div style="display:flex; justify-content:space-around; margin:40px 0; background:#111; padding:20px; border-radius:10px;">
                    <div><p style="color:#666;">ACTIVE NODES</p><h2 style="font-size:45px; margin:10px 0;">${count}</h2></div>
                    <div><p style="color:#666;">TOTAL REVENUE</p><h2 style="color:#0f0; font-size:45px; margin:10px 0;">$${totalRev}</h2></div>
                </div>

                <div style="border:1px dashed gold; padding:30px; background:#0a0a0a; margin-bottom:30px;">
                    <h3 style="color:gold;">DEPLOY NEW NODE</h3>
                    <input id="nodeName" type="text" placeholder="Node Identity..." 
                        style="background:#000; color:gold; border:1px solid gold; padding:15px; width:60%; font-family:monospace;">
                    <button onclick="sendCommand()" 
                        style="background:gold; color:black; border:none; padding:15px 30px; font-weight:bold; cursor:pointer; font-family:monospace;">
                        EXECUTE
                    </button>
                    <p id="feedback" style="margin-top:20px; font-size:14px; color:cyan;"></p>
                </div>

                <div style="text-align:left; border-top:1px solid #222; padding-top:20px;">
                    <p style="font-size:12px; color:#444;">Live Data Flowing from Main Website & Manual Inputs...</p>
                </div>
            </div>

            <script>
                async function sendCommand() {
                    const name = document.getElementById('nodeName').value;
                    const feedback = document.getElementById('feedback');
                    if(!name) return alert('Kucha likhein!');
                    
                    feedback.innerText = "ESTABLISHING HANDSHAKE...";
                    const res = await fetch('/api/website-handshake', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ companyName: name, fullName: 'ADMIN-MUAZZAM' })
                    });
                    if(res.ok) {
                        feedback.innerText = "SUCCESS: NODE ACTIVATED";
                        setTimeout(() => location.reload(), 1000);
                    } else {
                        feedback.innerText = "ERROR: LINK FAILED";
                    }
                }
            </script>
        </body>
    `);
});

// --- 🔌 THE HANDSHAKE ENDPOINT (Connection Point for Both) ---
app.post('/api/website-handshake', (req, res) => {
    const { companyName, fullName } = req.body;
    activeNodes.push({
        name: companyName || "Anonymous Node",
        commander: fullName || "System Uplink",
        time: new Date().toLocaleTimeString()
    });
    res.status(200).json({ success: true });
});

// --- 🤖 AI CHAT ENGINE ---
app.post('/api/chat', async (req, res) => {
    if (!genAI) return res.status(500).json({ error: "API Key Missing" });
    const { prompt } = req.body;
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt || "Hello");
        const response = await result.response;
        res.json({ reply: response.text() });
    } catch (error) {
        res.status(500).json({ error: "AI Engine Offline" });
    }
});

// ✅ FINAL EXPORT
module.exports = app;
