const express = require('express');
const cors = require('cors');
const { Storage } = require('@google-cloud/storage');
const vision = require('@google-cloud/vision');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

let activeNodes = [];
const REVENUE_PER_NODE = 5000000;
const PLATFORM_MASTER_KEY = "MUAZZAM-ALPHA-786"; 

// 🔌 AUTO-FIX KEY CONFIG
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

// 🔌 HANDSHAKE ENDPOINT
app.post('/api/website-handshake', async (req, res) => {
    const { fullName, companyName, email, type, plan, imageUrl } = req.body;
    try {
        const newNode = {
            name: companyName || "Independent Node",
            commander: fullName || "Guest",
            contact: email,
            plan: plan || "BASIC",
            timestamp: new Date().toLocaleString()
        };
        activeNodes.push(newNode);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🖥️ COMMAND CENTER UI (NO BACKSLASHES HERE)
app.get('/', (req, res) => {
    const isAdmin = req.query.key === PLATFORM_MASTER_KEY;
    const nodesCount = activeNodes.length;
    const revenue = (nodesCount * REVENUE_PER_NODE).toLocaleString();

    res.send(`
        <body style="background:#000; color:gold; font-family:monospace; text-align:center; padding:50px;">
            <div style="border:5px double gold; padding:40px; background:#050505; max-width:850px; margin:auto;">
                <h1 style="letter-spacing:5px;">🛡️ AXON COMMAND CENTER</h1>
                <p style="color:#0f0;">SYSTEM STATUS: ${isAdmin ? 'GOD-MODE ACTIVE' : 'READ-ONLY'}</p>
                
                <div style="display:flex; justify-content:space-around; margin:30px 0; border-bottom:1px solid #222; padding-bottom:20px;">
                    <div>
                        <p style="color:gold;">NODES</p>
                        <h2 style="font-size:40px;">${nodesCount}</h2>
                    </div>
                    <div>
                        <p style="color:gold;">REVENUE</p>
                        <h2 style="color:#0f0; font-size:40px;">$${revenue}</h2>
                    </div>
                </div>

                <div style="background:#111; border:1px solid gold; height:200px; padding:20px; color:#555;">
                    ${nodesCount > 0 ? 'Nodes Online and Secured.' : 'Waiting for Handshakes...'}
                </div>

                ${isAdmin ? '<button style="background:lime; color:black; padding:15px; width:100%; margin-top:20px; font-weight:bold; cursor:pointer;">WITHDRAW TO BANK/JAZZCASH</button>' : ''}
            </div>
        </body>
    `);
});

module.exports = app;
