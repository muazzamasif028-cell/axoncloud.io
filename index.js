const express = require('express');
const app = express();

const dashboardHTML = (req, res) => {
    res.send(`
        <body style="background:#000;color:gold;font-family:monospace;padding:50px;text-align:center;border:10px double gold;">
            <h1>🛡️ AXON-CORE COMMAND LIVE</h1>
            <p style="color:#0f0;">[SYSTEM SECURED] - FINAL COUNTDOWN</p>
            <div style="margin-top:30px;">
                <input type="text" id="n" placeholder="Company Name..." style="padding:10px;width:250px;background:#111;color:gold;border:1px solid gold;">
                <button onclick="alert('✅ HANDSHAKE COMPLETED: ' + document.getElementById('n').value)" style="padding:10px;background:gold;font-weight:bold;cursor:pointer;">⚡ ACTIVATE</button>
            </div>
            <p style="margin-top:50px;color:#8CFF9E;">STATUS: 20 NODES READY</p>
        </body>
    `);
};

app.get('/', dashboardHTML);
app.get('/admin/deploy', dashboardHTML);
app.get('*', dashboardHTML); 

module.exports = app;
