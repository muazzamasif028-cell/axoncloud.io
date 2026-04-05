const express = require('express');
const app = express();

// 1. Root Route (Testing ke liye)
app.get('/', (req, res) => {
    res.send('<h1>🚀 AXON-CORE ENGINE IS LIVE</h1><p>Navigate to /admin/deploy to start Handshakes.</p>');
});

// 2. Dashboard Route (Jo missing hai)
app.get('/admin/deploy', (req, res) => {
    res.send(`
        <body style="background:#000;color:#FFD700;font-family:monospace;padding:50px;border:5px solid #D4AF37;">
            <h1>🛡️ AXON-CORE COMMAND v3.4</h1>
            <hr border="1" color="gold">
            <h3>STATUS: <span style="color:#0f0;">🟠 ONLINE</span> | NODES: 20/20</h3>
            <div style="margin-top:30px;">
                <input type="text" id="node" placeholder="Company Name..." style="padding:10px;width:300px;background:#111;color:gold;border:1px solid gold;">
                <button onclick="alert('Node Secured!')" style="padding:10px;background:gold;color:black;font-weight:bold;cursor:pointer;">⚡ ACTIVATE HANDSHAKE</button>
            </div>
            <p style="margin-top:50px;color:#8CFF9E;">[System] Ready for Global Entity Deployment...</p>
        </body>
    `);
});

// 3. Vercel Export (Sab se zaroori)
module.exports = app;

