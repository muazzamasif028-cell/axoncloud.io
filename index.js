const express = require('express');
const cors = require('cors');
const { Storage } = require('@google-cloud/storage');
const vision = require('@google-cloud/vision');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_123');
// ✅ FIXED: Sahi library name slash (/) ke sath
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// 🛡️ THE OMEGA DATABASE
let activeNodes = [];
const REVENUE_PER_NODE = 5000000;
const PLATFORM_MASTER_KEY = "MUAZZAM-ALPHA-786";

// AI Initialization (Safe Mode)
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// 🤖 AI CHAT ENGINE
app.post('/api/chat', async (req, res) => {
    if (!genAI) return res.status(500).json({ error: "GEMINI_API_KEY Missing in Vercel" });
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

// 🔌 THE HANDSHAKE (Data Storage)
app.post('/api/website-handshake', async (req, res) => {
    const { fullName, companyName, email, plan } = req.body;
    try {
        const newNode = {
            name: companyName || "Independent Node",
            commander: fullName || "Guest",
            contact: email,
            plan: plan || "BASIC",
            timestamp: new Date().toLocaleString()
        };
        activeNodes.push(newNode);
        res.json({ success: true, message: "MISSION FINISHED" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🖥️ COMMAND CENTER UI (The Dashboard)
app.get('/', (req, res) => {
    const isAdmin = req.query.key === PLATFORM_MASTER_KEY;
    const count = activeNodes.length;
    const totalRev = (count * REVENUE_PER_NODE).toLocaleString();

    res.send(`
        <body style="background:#000; color:gold; font-family:monospace; text-align:center; padding:50px;">
            <div style="border:5px double gold; padding:40px; background:#050505; max-width:850px; margin:auto;">
                <h1>🛡️ AXON COMMAND CENTER</h1>
                <p style="color:#0f0;">STATUS: ${isAdmin ? 'GOD-MODE ACTIVE' : 'READ-ONLY'}</p>
                <div style="display:flex; justify-content:space-around; margin:30px 0;">
                    <div><p>NODES</p><h2>${count}</h2></div>
                    <div><p>REVENUE</p><h2 style="color:#0f0;">$${totalRev}</h2></div>
                </div>
                <div style="margin-top:20px; color:#333; font-size:10px;">
                    AXON-CORE v3.5.0 | Build: 2026-04-09
                </div>
            </div>
        </body>
    `);
});

// ✅ FINAL EXPORT (Must be at the very bottom)
module.exports = app;
