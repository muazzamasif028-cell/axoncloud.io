const express = require('express');
const cors = require('cors');
const { Storage } = require('@google-cloud/storage');
const vision = require('@google-cloud/vision');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { GoogleGenerativeAI } = require("@google-generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// 🛡️ THE OMEGA DATABASE & AI ENGINE
let activeNodes = [];
const REVENUE_PER_NODE = 5000000;
const PLATFORM_MASTER_KEY = "MUAZZAM-ALPHA-786"; 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🔌 GOOGLE CLOUD CONFIG (AUTO-CLEAN PROTOCOL)
const getCleanKey = () => {
    const rawKey = process.env.G_PRIVATE_KEY;
    if (!rawKey) return undefined;
    return rawKey.replace(/\\n/g, '\n').replace(/\n/g, '\n');
};

const gConfig = {
    projectId: process.env.G_PROJECT_ID,
    credentials: {
        client_email: process.env.G_CLIENT_EMAIL,
        private_key: getCleanKey(),
    },
};

const storage = new Storage(gConfig);
const visionClient = new vision.ImageAnnotatorClient(gConfig);

// 👁️ AXON-VISION: Image Analysis
async function scanAsset(imageUrl) {
    try {
        const [result] = await visionClient.labelDetection(imageUrl);
        return result.labelAnnotations.map(label => label.description).slice(0, 3).join(', ');
    } catch (e) { return "Scan Offline"; }
}

// 🤖 AI CHATBOT ENDPOINT (Where the magic happens)
app.post('/api/chat', async (req, res) => {
    const { prompt } = req.body;
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt || "Hello");
        const response = await result.response;
        res.json({ reply: response.text() });
    } catch (error) {
        res.status(500).json({ error: "AI Offline: Check GEMINI_API_KEY" });
    }
});

// 🔌 THE HANDSHAKE (Data Storage)
app.post('/api/website-handshake', async (req, res) => {
    const { fullName, companyName, email, plan, imageUrl } = req.body;
    try {
        let aiTags = imageUrl ? await scanAsset(imageUrl) : "Verified Data";
        const newNode = {
            name: companyName || "Independent Node",
            commander: fullName || "Guest",
            contact: email,
            tags: aiTags,
            plan: plan || "BASIC",
            timestamp: new Date().toLocaleString()
        };
        activeNodes.push(newNode);
        res.json({ success: true, message: "MISSION FINISHED: NODE SECURED" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- 🖥️ COMMAND CENTER UI ---
app.get('/', (req, res) => {
    const isAdmin = req.query.key === PLATFORM_MASTER_KEY;
    const count = activeNodes.length;
    const totalRev = (count * REVENUE_PER_NODE).toLocaleString();

    res.send(`
        <body style="background:#000; color:gold; font-family:monospace; text-align:center; padding:50px;">
            <div style="border:5px double gold; padding:40px; background:#050505; max-width:850px; margin:auto;">
                <h1>🛡️ AXON COMMAND CENTER</h1>
                <p style="color:#0f0;">SYSTEM STATUS: ${isAdmin ? 'GOD-MODE ACTIVE' : 'READ-ONLY'}</p>
                <div style="display:flex; justify-content:space-around; margin:30px 0; border-bottom:1px solid #222; padding-bottom:20px;">
                    <div><p>NODES</p><h2>${count}</h2></div>
                    <div><p>REVENUE</p><h2 style="color:#0f0;">$${totalRev}</h2></div>
                </div>
                <div style="background:#111; border:1px solid gold; height:150px; padding:15px; color:#666; overflow-y:auto;">
                    ${count > 0 ? 'All Systems Online. Monitoring Handshakes...' : 'Waiting for Handshakes...'}
                </div>
                ${isAdmin ? '<button style="background:lime; color:black; padding:15px; width:100%; margin-top:20px; font-weight:bold; cursor:pointer;" onclick="alert(\'Transferring Funds...\')">WITHDRAW TO BANK/JAZZCASH</button>' : ''}
            </div>
        </body>
    `);
});

module.exports = app;
