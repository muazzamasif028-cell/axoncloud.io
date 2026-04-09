const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// 🛡️ DATA STORAGE
let activeNodes = [];
const REVENUE_PER_NODE = 5000000;
const PLATFORM_MASTER_KEY = "MUAZZAM-ALPHA-786";

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// --- DASHBOARD (With Input Feature) ---
app.get('/', (req, res) => {
    const isAdmin = req.query.key === PLATFORM_MASTER_KEY;
    const count = activeNodes.length;
    const totalRev = (count * REVENUE_PER_NODE).toLocaleString();

    res.send(`
        <body style="background:#000; color:gold; font-family:monospace; text-align:center; padding:50px;">
            <div style="border:5px double gold; padding:40px; background:#050505; max-width:850px; margin:auto;">
                <h1>🛡️ AXON COMMAND CENTER</h1>
                <p style="color:#0f0; border:1px solid #222; padding:10px; display:inline-block;">
                    STATUS: ${isAdmin ? 'GOD-MODE ACTIVE' : 'READ-ONLY'}
                </p>

                <div style="display:flex; justify-content:space-around; margin:30px 0; border-bottom:1px solid #222; padding-bottom:20px;">
                    <div><p>NODES</p><h2 style="font-size:40px;">${count}</h2></div>
                    <div><p>REVENUE</p><h2 style="color:#0f0; font-size:40px;">$${totalRev}</h2></div>
                </div>

                <div style="margin-top:30px; background:#111; padding:20px; border:1px dashed gold;">
                    <h3>ENTER COMMAND / ADD NODE</h3>
                    <input id="nodeName" type="text" placeholder="Node Name..." style="padding:10px; width:60%;">
                    <button onclick="sendCommand()" style="padding:10px; background:gold; color:black; font-weight:bold; cursor:pointer;">EXECUTE</button>
                    <p id="feedback" style="color:cyan; font-size:12px; margin-top:10px;"></p>
                </div>

                <script>
                    async function sendCommand() {
                        const name = document.getElementById('nodeName').value;
                        const feedback = document.getElementById('feedback');
                        if(!name) return alert('Kucha likhein!');
                        
                        feedback.innerText = "SENDING TO CORE...";
                        const res = await fetch('/api/website-handshake', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ companyName: name, fullName: 'Admin' })
                        });
                        if(res.ok) {
                            feedback.innerText = "SUCCESS: NODE ACTIVATED";
                            setTimeout(() => location.reload(), 1000);
                        } else {
                            feedback.innerText = "ERROR: LINK FAILED";
                        }
                    }
                </script>
            </div>
        </body>
    `);
});

// --- API TO RECEIVE DATA ---
app.post('/api/website-handshake', async (req, res) => {
    const { companyName, fullName } = req.body;
    activeNodes.push({ name: companyName, commander: fullName, time: new Date() });
    res.json({ success: true });
});

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

module.exports = app;
