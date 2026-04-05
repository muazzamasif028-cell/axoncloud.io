const express = require('express');
const app = express();

// DASHBOARD ROUTE (The Vault)
app.get('/admin/deploy', (req, res) => {
    res.send(`
        <body style="background:#000;color:#FFD700;font-family:monospace;padding:50px;border:5px solid #D4AF37;text-align:center;">
            <h1 style="letter-spacing:5px;">🛡️ AXON-CORE COMMAND v3.4</h1>
            <p style="color:#0f0;">[SYSTEM ACTIVE] - REMAINING: 5 MINS</p>
            <div style="margin-top:30px; border:2px dashed gold; padding:20px;">
                <input type="text" id="node" placeholder="Tesla, Nvidia, etc..." style="padding:10px;width:300px;background:#111;color:gold;border:1px solid gold;">
                <button onclick="document.getElementById('status').innerText = '✅ HANDSHAKE COMPLETED: ' + document.getElementById('node').value; alert('ENTITY SECURED!')" style="padding:10px;background:gold;color:black;font-weight:bold;cursor:pointer;">⚡ ACTIVATE</button>
            </div>
            <h2 id="status" style="color:#0f0; margin-top:20px;"></h2>
            <p style="margin-top:50px;color:#8CFF9E;">NODES: 20/20 READY</p>
        </body>
    `);
});

// REDIRECT EVERYTHING TO DASHBOARD
app.get('*', (req, res) => {
    res.redirect('/admin/deploy');
});

module.exports = app;
