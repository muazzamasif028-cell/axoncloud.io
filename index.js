const express = require('express');
const cors = require('cors');
const { Storage } = require('@google-cloud/storage');
const vision = require('@google-cloud/vision');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// 🛡️ THE OMEGA DATABASE
let activeNodes = [];
const REVENUE_PER_NODE = 5000000;
const PLATFORM_MASTER_KEY = "MUAZZAM-ALPHA-786"; 

// 🔌 GOOGLE CLOUD CONFIG (THE COMMANDER'S SHIELD)
let googleCredentials;
try {
    const rawCreds = process.env.GOOGLE_CREDENTIALS;
    if (!rawCreds) throw new Error("GOOGLE_CREDENTIALS environment variable is missing!");
    
    googleCredentials = JSON.parse(rawCreds);
    
    // 🛡️ Fix for Private Key (The \n Issue in Vercel)
    if (googleCredentials.private_key) {
        googleCredentials.private_key = googleCredentials.private_key.replace(/\\n/g, '\n');
    }
} catch (err) {
    console.error("CRITICAL: Failed to parse Google Credentials ->", err.message);
}

const storage = new Storage({ 
    projectId: 'linear-pursuit-492616-i8', 
    credentials: googleCredentials 
});

const visionClient = new vision.ImageAnnotatorClient({ 
    credentials: googleCredentials 
});

// 👁️ AXON-VISION: Image Analysis
async function scanAsset(imageUrl) {
    try {
        const [result] = await visionClient.labelDetection(imageUrl);
        return result.labelAnnotations.map(label => label.description).slice(0, 3).join(', ');
    } catch (e) { 
        console.error("Vision Scan Error:", e.message);
        return "Scan Offline"; 
    }
}

// 🔌 THE HANDSHAKE ENDPOINT
app.post('/api/website-handshake', async (req, res) => {
    const { fullName, companyName, email, type, plan, imageUrl } = req.body;

    const alreadyExists = activeNodes.find(n => n.contact === email);
    if (alreadyExists) return res.status(400).json({ error: "ALERT: Entity already secured!" });

    try {
        let aiTags = imageUrl ? await scanAsset(imageUrl) : "Verified Data";
        
        if (type === 'COMPANY') {
            const session = await stripe.checkout.sessions.create({
                line_items: [{
                    price_data: {
                        currency: 'usd',
                        product_data: { name: `AXON NODE: ${companyName}` },
                        unit_amount: 500000000, 
                    },
                    quantity: 1,
                }],
                mode: 'payment',
                success_url: `${req.headers.origin}/?status=success`,
                cancel_url: `${req.headers.origin}/?status=cancel`,
            });
            return res.json({ url: session.url });
        } 

        const newNode = {
            name: companyName || "Independent Node",
            commander: fullName || "Guest",
            contact: email,
            tags: aiTags,
            plan: plan || "BASIC",
            timestamp: new Date().toLocaleString(),
            status: "SECURED"
        };

        // Saving to Storage
        try {
            const bucket = storage.bucket('axon-nodes-vault');
            const blob = bucket.file(`${newNode.name}-${Date.now()}.json`);
            await blob.save(JSON.stringify(newNode));
        } catch (storageErr) {
            console.error("Storage Save Failed:", storageErr.message);
        }

        activeNodes.push(newNode);
        res.json({ success: true, message: "MISSION FINISHED: NODE SECURED" });

    } catch (error) {
        console.error("Handshake Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// --- 🖥️ COMMAND CENTER UI ---
app.get('/', (req, res) => {
    const isAdmin = req.query.key === PLATFORM_MASTER_KEY;

    let nodesList = activeNodes.map(node => `
        <div style="border-bottom:1px solid #333; padding:15px; text-align:left;">
            <span style="color:#0f0;">[${node.timestamp}]</span> 
            <b style="color:gold;">${node.name}</b> (${node.plan})
            <br><small style="color:#888;">AI Tags: ${node.tags} | Commander: ${node.commander}</small>
        </div>
    `).reverse().join('') || "<p style='color:#444;'>Waiting for Handshakes...</p>";

    res.send(`
        <body style="background:#000; color:gold; font-family:monospace; text-align:center; padding:50px;">
            <div style="border:5px double gold; padding:40px; background:#050505; max-width:850px; margin:auto;">
                <h1>🛡️ AXON COMMAND CENTER</h1>
                <p style="color:#0f0;">SYSTEM STATUS: ${isAdmin ? 'GOD-MODE ACTIVE' : 'READ-ONLY'}</p>
                <div style="display:flex; justify-content:space-around; margin:30px 0; border-bottom:1px solid #222; padding-bottom:20px;">
                    <div><p>NODES</p><h2>${activeNodes.length}</h2></div>
                    <div><p>REVENUE</p><h2 style="color:#0f0;">$${(activeNodes.length * REVENUE_PER_NODE).toLocaleString()}</h2></div>
                </div>
                <div style="background:#111; border:1px solid gold; height:300px; overflow-y:auto; padding:15px;">${nodesList}</div>
                ${isAdmin ? \`<button style="background:lime; color:black; padding:15px; width:100%; margin-top:20px; font-weight:bold; cursor:pointer;" onclick="alert('Transferring to JazzCash/Bank...')">WITHDRAW TO BANK/JAZZCASH</button>\` : ''}
            </div>
        </body>
    `);
});

module.exports = app;
