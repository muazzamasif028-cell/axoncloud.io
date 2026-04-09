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

// AI Initialization
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// DASHBOARD
app.get('/', (req, res) => {
    const isAdmin = req.query.key === PLATFORM_MASTER_KEY;
    const count = activeNodes.length;
    res.send(`
        <body style="background:#000; color:gold; font-family:monospace; text-align:center; padding:50px;">
            <div style="border:5px double gold; padding:40px; background:#050505; max-width:850px; margin:auto;">
                <h1>🛡️ AXON COMMAND CENTER</h1>
                <p style="color:#0f0;">STATUS: \${isAdmin ? 'GOD-MODE ACTIVE' : 'READ-ONLY'}</p>
                <h2>NODES: \${count} | REVENUE: $\${(count * REVENUE_PER_NODE).toLocaleString()}</h2>
            </div>
        </body>
    `);
});

// AI CHAT
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

// ✅ VERCEL REQUIRES THIS EXPORT
module.exports = app;
