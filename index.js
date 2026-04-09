const express = require('express');
const cors = require('cors');
// ✅ SAHI: Slash (/) wala rasta
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

// --- DASHBOARD ---
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
                <div style="display:flex; justify-content:space-around; margin:30px 0;">
                    <div><p>NODES</p><h2>${count}</h2></div>
                    <div><p>REVENUE</p><h2 style="color:#0f0;">$${totalRev}</h2></div>
                </div>
            </div>
        </body>
    `);
});

// --- AI CHAT ENGINE ---
app.post('/api/chat', async (req, res) => {
    if (!genAI) return res.status(500).json({ error: "GEMINI_API_KEY Missing" });
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

// ✅ VERCEL EXPORT (Iske niche kuch nahi hona chahiye)
module.exports = app;
