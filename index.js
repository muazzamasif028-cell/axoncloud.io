const express = require('express');
const app = express();

// Middleware (Zaroori hai taake data handle ho sake)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Tactical UI Function
const dashboardHTML = (req, res) => {
    res.send(`
        <body style="background:#000;color:gold;font-family:monospace;padding:50px;text-align:center;border:10px double gold; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <h1 style="letter-spacing: 5px; text-shadow: 0 0 10px gold;">🛡️ AXON-CORE COMMAND LIVE</h1>
            <p style="color:#0f0; font-size: 1.2rem;">[SYSTEM SECURED] - FINAL COUNTDOWN</p>
            
            <div style="margin-top:30px; background: #111; padding: 30px; border-radius: 20px; border: 1px solid gold;">
                <input type="text" id="n" placeholder="Company Name..." style="padding:15px; width:250px; background:#000; color:gold; border:1px solid gold; outline:none; border-radius: 5px;">
                <button onclick="alert('✅ HANDSHAKE COMPLETED: ' + document.getElementById('n').value)" style="padding:15px; background:gold; color: black; font-weight:bold; cursor:pointer; border: none; border-radius: 5px; margin-left: 10px;">⚡ ACTIVATE</button>
            </div>
            
            <div style="margin-top:50px;">
                <p style="color:#8CFF9E; font-weight: bold;">STATUS: 20 NODES READY</p>
                <p style="color: #444; font-size: 0.8rem;">AXONCLOUD-IO | SECURE TERMINAL</p>
            </div>
        </body>
    `);
};

// ==========================================
// 🛣️ THE COMMAND ROUTES
// ==========================================

// Route 1: Direct Home Page
app.get('/', dashboardHTML);

// Route 2: The Admin Deploy Path
app.get('/admin/deploy', dashboardHTML);

// Route 3: Catch-All (Agar koi ghalat link bhi likhay toh yahi khulega)
app.get('*', dashboardHTML); 

// Vercel handles the port automatically, so we export the app
module.exports = app;

// Agar local test kar rahe hain toh ye niche wala hissa kaam ayega
if (process.env.NODE_ENV !== 'production') {
    const PORT = 5000;
    app.listen(PORT, () => console.log(`🚀 COMMANDER, SERVER LIVE AT: http://localhost:${PORT}`));
}
