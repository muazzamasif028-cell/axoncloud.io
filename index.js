const express = require('express');
const app = express();

// Middleware (Zaroori hai crash rokne ke liye)
app.use(express.json());

// 1. DASHBOARD ROUTE
app.get('/admin/deploy', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
        <body style="background:#000;color:gold;font-family:monospace;padding:50px;text-align:center;border:5px solid #D4AF37;">
            <h1>🚀 AXON-CORE COMMAND v3.4</h1>
            <hr color="gold">
            <p style="color:#0f0;">[SYSTEM ONLINE] - 7 MINUTES REMAINING</p>
            <div style="margin-top:30px;">
                <input type="text" id="c" placeholder="Company Name..." style="padding:10px;width:250px;background:#111;color:gold;border:1px solid gold;">
                <button onclick="alert('Handshake Initiated!')" style="padding:10px;background:gold;color:black;font-weight:bold;cursor:pointer;">⚡ ACTIVATE</button>
            </div>
            <p style="margin-top:50px;color:#8CFF9E;">[Status] Ready for 20 Global Handshakes.</p>
        </body>
    `);
});

// 2. ROOT ROUTE (To keep Vercel happy)
app.get('/', (req, res) => {
    res.status(200).send('<h1>AXON ENGINE ACTIVE</h1><p>Navigate to /admin/deploy</p>');
});

// 3. THE CRITICAL EXPORT
module.exports = app;

