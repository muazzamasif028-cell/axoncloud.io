const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

const MASTER_KEY = "MUAZZAM-ALPHA-786";

app.get('/', (req, res) => {
    const userKey = req.query.key;
    // Agar key match ho ya key "MUAZZAM" ho toh admin mode
    const isAdmin = userKey === MASTER_KEY || userKey === "MUAZZAM";

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>AXON VAULT SYSTEM</title>
            <style>
                body { background:#000; color:gold; font-family:monospace; text-align:center; padding:20px; }
                .vault-box { border:5px double gold; padding:40px; background:#050505; max-width:900px; margin:auto; box-shadow: 0 0 50px gold; }
                .stats { display:flex; justify-content:space-around; margin:30px 0; background:#111; padding:20px; border:1px solid #222; }
                .flat-unit { background:#0a0a0a; border:1px solid #333; margin:15px 0; padding:20px; display:flex; justify-content:space-between; align-items:center; border-left:5px solid gold; text-align:left; }
                input { background:#000; color:gold; border:1px solid gold; padding:15px; width:60%; }
                button { background:gold; color:black; border:none; padding:15px 30px; font-weight:bold; cursor:pointer; }
                .btn-enter { background:transparent; color:gold; border:1px solid gold; padding:10px; font-size:12px; }
                .btn-enter:hover { background:gold; color:black; }
            </style>
        </head>
        <body>
            <div class="vault-box">
                <h1 style="letter-spacing:5px;">🛡️ AXON VAULT SYSTEM</h1>
                <p style="color:#0f0; border:1px solid #333; padding:5px; display:inline-block;">
                    \${isAdmin ? "OWNER CONTROL ACTIVE" : "SECURE CLIENT SESSION"}
                </p>

                <div class="stats">
                    <div><p style="color:#666;">NODES (FLATS)</p><h2 id="nCnt">0</h2></div>
                    <div><p style="color:#666;">TOTAL REVENUE</p><h2 id="rCnt" style="color:#0f0;">$0</h2></div>
                </div>

                <div style="text-align:left; border-top:1px solid gold; padding-top:20px;">
                    <h3 style="color:gold;">YOUR SECURE FLAT / ROOMS</h3>
                    <div id="roomList"></div>
                </div>

                \${isAdmin ? \`
                <div style="margin-top:40px; background:#080808; padding:20px; border:1px dashed gold;">
                    <h3>DEPLOY NEW NODE (FLAT)</h3>
                    <input id="nodeInp" type="text" placeholder="Enter Company Name...">
                    <button onclick="addNode()">EXECUTE</button>
                    <p id="keyMsg" style="color:cyan; font-size:11px; margin-top:10px;"></p>
                </div>
                \` : ''}
            </div>

            <script>
                // 🔐 Database in Browser Storage
                let db = JSON.parse(localStorage.getItem('axon_vault_v3')) || [];
                const isAdmin = \${isAdmin};
                const uKey = "\${userKey}";

                function draw() {
                    const list = document.getElementById('roomList');
                    // Filter Logic: Admin ko sab, Client ko sirf apna
                    const data = isAdmin ? db : db.filter(x => x.id === uKey);
                    
                    document.getElementById('nCnt').innerText = data.length;
                    document.getElementById('rCnt').innerText = "$" + (data.length * 5000000).toLocaleString();

                    if(data.length === 0) {
                        list.innerHTML = "<p style='color:#444;'>No flats deployed. Add a node to start.</p>";
                    } else {
                        list.innerHTML = data.map(node => \`
                            <div class="flat-unit">
                                <div>
                                    <b style="font-size:18px;">🔑 \${node.name.toUpperCase()}</b><br>
                                    <small style="color:#444;">ID: \${node.id}</small>
                                </div>
                                <button class="btn-enter" onclick="location.href='/room/\${node.id}'">ENTER FLAT</button>
                            </div>
                        \`).join('');
                    }
                }

                function addNode() {
                    const val = document.getElementById('nodeInp').value;
                    if(!val) return;
                    const id = 'KEY-' + Math.random().toString(36).substr(2, 6).toUpperCase();
                    db.push({ id: id, name: val, time: new Date().toLocaleTimeString() });
                    localStorage.setItem('axon_vault_v3', JSON.stringify(db));
                    document.getElementById('keyMsg').innerText = "Link for Client: ?key=" + id;
                    document.getElementById('nodeInp').value = "";
                    draw();
                }

                draw();
            </script>
        </body>
        </html>
    `);
});

app.get('/room/:id', (req, res) => {
    res.send("<body style='background:#000;color:cyan;text-align:center;padding-top:100px;'><h1>ROOM ACCESS GRANTED</h1><button onclick='history.back()'>EXIT</button></body>");
});

module.exports = app;
