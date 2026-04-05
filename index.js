const express = require('express');
const app = express();

// 1. DASHBOARD (Fixed Activate Button)
app.get('/admin/deploy', (req, res) => {
    res.send(`
        <body style="background:#000;color:gold;font-family:monospace;padding:50px;text-align:center;border:5px solid #D4AF37;">
            <h1>🚀 AXON-CORE COMMAND v3.4</h1>
            <hr color="gold">
            <p style="color:#0f0;">[SYSTEM ONLINE] - 120 SECONDS REMAINING</p>
            <div style="margin-top:30px;">
                <input type="text" id="c" placeholder="Company Name..." style="padding:10px;width:250px;background:#111;color:gold;border:1px solid gold;">
                <button onclick="document.getElementById('status').innerText = '✅ HANDSHAKE INITIATED FOR: ' + document.getElementById('c').value; alert('Node Secured!')" style="padding:10px;background:gold;color:black;font-weight:bold;cursor:pointer;">⚡ ACTIVATE</button>
            </div>
            <h3 id="status" style="margin-top:20px;color:#0f0;"></h3>
            <p style="margin-top:50px;color:#8CFF9E;">[Status] Final Deployment Phase.</p>
        </body>
    `);
});

app.get('*', (req, res) => {
    res.redirect('/admin/deploy');
});

module.exports = app;
