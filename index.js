const express = require('express');
const { Storage } = require('@google-cloud/storage');
const vision = require('@google-cloud/vision');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(express.json());

// 🛡️ THE OMEGA DATABASE (Cloud Logic)
let activeNodes = []; 
const REVENUE_PER_NODE = 5000000;
const PLATFORM_MASTER_KEY = "MUAZZAM-ALPHA-786"; // 🔑 Sirf aapke liye

// 🔌 GOOGLE CLOUD CONFIG
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
const storage = new Storage({ projectId: 'linear-pursuit-492616-i8', credentials });
const visionClient = new vision.ImageAnnotatorClient({ credentials });

// 👁️ AXON-VISION: Image Analysis
async function scanAsset(imageUrl) {
    try {
        const [result] = await visionClient.labelDetection(imageUrl);
        return result.labelAnnotations.map(label => label.description).slice(0, 3).join(', ');
    } catch (e) { return "Scan Offline"; }
}

// 🔌 THE JUDGE & AUDITOR: Secure Handshake
app.post('/api/website-handshake', async (req, res) => {
    const { fullName, companyName, email, type, plan, imageUrl } = req.body;

    // 1. AUDITOR: Email Duplicate Check
    const alreadyExists = activeNodes.find(n => n.contact === email);
    if (alreadyExists) return res.status(400).json({ error: "ALERT: Entity already secured!" });

    try {
        let aiTags = imageUrl ? await scanAsset(imageUrl) : "Verified Data";
        
        // 2. THE JUDGE: User vs Company Logic
        if (type === 'COMPANY') {
            // Path: $5,000,000 Activation
            const session = await stripe.checkout.sessions.create({
                line_items: [{
                    price_data: {
                        currency: 'usd',
                        product_data: { name: `AXON NODE: ${companyName}` },
                        unit_amount: 500000000, // $5M
                    },
                    quantity: 1,
                }],
                mode: 'payment',
                success_url: `${req.headers.origin}/?status=success`,
                cancel_url: `${req.headers.origin}/?status=cancel`,
            });
            return res.json({ url: session.url });
        } 

        // Path: USER 14-Day Trial
        const newNode = {
            name: companyName || "Independent Node",
            commander: fullName || "Guest",
            contact: email,
            tags: aiTags,
            plan: plan || "BASIC",
            timestamp: new Date().toLocaleString(),
            status: "TRIAL-ACTIVE"
        };

        // Save to Google Cloud Bucket
        const bucket = storage.bucket('axon-nodes-vault');
        const blob = bucket.file(`${newNode.name}-${Date.now()}.json`);
        await blob.save(JSON.stringify(newNode));

        activeNodes.push(newNode);
        res.json({ success: true, message: "14-DAY TRIAL INITIATED" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- 🖥️ SUPREME COMMAND CENTER UI ---
app.get('/', (req, res) => {
    const isAdmin = req.query.key === PLATFORM_MASTER_KEY; // Admin Check

    let nodesList = activeNodes.map(node => `
        <div style="border-bottom:1px solid #333; padding:15px; text-align:left;">
            <span style="color:#0f0;">[${node.timestamp}]</span> 
            <b style="color:gold;">${node.name}</b> (${node.plan})
            <br><small style="color:#888;">AI Tags: ${node.tags} | Commander: ${node.commander}</small>
            ${isAdmin ? `<br><button style="color:red; background:none; border:1px solid red; cursor:pointer;">TERMINATE NODE</button>` : ''}
        </div>
    `).reverse().join('') || "<p style='color:#444;'>Waiting for Handshakes...</p>";

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>AXON-OMEGA | LIVE COMMAND</title>
            <style>
                body { background:#000; color:gold; font-family:monospace; margin:0; padding:40px; text-align:center; }
                .vault-box { border:10px double gold; padding:40px; background:#050505; max-width:900px; margin:auto; box-shadow:0 0 30px rgba(255,215,0,0.4); }
                .stats { display:flex; justify-content:space-around; margin:30px 0; border-bottom:1px solid #222; padding-bottom:20px; }
                .node-container { background:#111; border:1px solid gold; height:300px; overflow-y:auto; padding:15px; }
                .withdraw-btn { background: #0f0; color: #000; padding: 15px; font-weight: bold; border: none; cursor: pointer; display: ${isAdmin ? 'block' : 'none'}; width: 100%; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="vault-box">
                <h1>🛡️ AXON-CORE COMMAND LIVE</h1>
                <p style="color:#0f0;">[SOVEREIGN STATUS: ${isAdmin ? 'GOD-MODE ACTIVE' : 'READ-ONLY'}]</p>
                <div class="stats">
                    <div><p>NODES</p><h2>${activeNodes.length}</h2>
