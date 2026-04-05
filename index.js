const express = require('express');
const app = express();

// 1. DASHBOARD ROUTE (The Mission Hub)
app.get('/admin/deploy', (req, res) => {
    res.send(`
        <body style="background:#000;color:gold;font-family:monospace;padding:50px;text-align:center;border:5px solid #D4AF37;">
            <h1>🚀 AXON-CORE COMMAND LIVE</h1>
            <hr color="gold">
            <p style="color:#0f0;">[SYSTEM READY] - MISSION: 20 GLOBAL HANDSHAKES</p>
            <div style="margin-top:30px;">
                <input type="text" id="c" placeholder="Enter Company Name..." style="padding:10px;width:250px;background:#111;color:gold;border:1px solid gold;">
                <button onclick="alert('Node Secured!')" style="padding:10px;background:gold;color:black;font-weight:bold;cursor:pointer;">⚡ ACTIVATE</button>
            </div>
            <p style="margin-top:50px;color:#8CFF9E;">[System] All nodes online. Ready for deployment.</p>
        </body>
    `);
});

// 2. FALLBACK (Prevents "Cannot GET" Errors)
app.get('*', (req, res) => {
    res.send('<h1>🚀 AXON ENGINE RUNNING</h1><p>Go to <a href="/admin/deploy" style="color:gold;">/admin/deploy</a></p>');
});

// 3. THE CRITICAL EXPORT (For Vercel)
module.exports = app;

