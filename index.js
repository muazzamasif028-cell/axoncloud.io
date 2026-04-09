const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

const MASTER_KEY = "MUAZZAM-ALPHA-786";

app.get('/', (req, res) => {
    // URL se name aur key uthana
    const userKey = req.query.key;
    const autoName = req.query.name; 
    const isAdmin = !userKey || userKey === MASTER_KEY;

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>AXON COMMAND CENTER</title>
            <style>
                body { background:#000; color:gold; font-family:monospace; text-align:center; padding:20px; }
                .vault-box { border:5px double gold; padding:40px; background:#050505; max-width:900px; margin:auto; box-shadow: 0 0 50px gold; }
                .stats { display:flex; justify-content:space-around; margin:30px 0; background:#111; padding:20px; border:1px solid #222; }
                .flat-unit { background:#0a0a0a; border:1px solid #333; margin:15px 0; padding:20px; display:flex; justify-content:space-between; align-items:center; border-left:5px solid gold; text-align:left; }
                input { background:#000; color:gold; border:1px solid gold; padding:15px; width:60%; }
                button { background:gold; color:black; border:none; padding:15px 30px; font-weight:bold; cursor:pointer; }
                .status-tag { color:#0f0; border:1px solid #0f0; padding:2px 10px; font-size:12px; }
            </style>
        </head>
        <body>
            <div class="vault-box">
                <h1>🛡️ AXON COMMAND CENTER</h1>
                <span class="status-tag">\${isAdmin ? 'GOD-MODE' : 'CLIENT-SESSION'}</span>

                <div class="stats">
                    <div><p style="color:#666;">NODES</p><h2 id="nCnt">0</h2></div>
                    <div><p style="color:#666;">REVENUE</p><h2 id="rCnt" style="color:#0f0;">$0</h2></div>
                </div>

                <div style="text-align:left;">
                    <h3 style="color:gold; border-bottom:1px solid #222;">ACTIVE FLATS</h3>
                    <div id="roomList"></div>
                </div>

                \${isAdmin ? \`
                <div style="margin-top:40px; padding:20px; border:1px dashed gold; background:#080808;">
                    <h3>MANUAL DEPLOYMENT</h3>
                    <input id="nodeInp" type="text" placeholder="Company Name...">
                    <button onclick="addNode()">EXECUTE</button>
                </div>
                \` : ''}
            </div>

            <script>
                // 🔐 Data Persistence
                let db = JSON.parse(localStorage.getItem('axon_linked_v1')) || [];
                const incomingName = "${autoName || ''}";

                function refresh() {
                    const list = document.getElementById('roomList');
                    document.getElementById('nCnt').innerText = db.length;
                    document.getElementById('rCnt').innerText = "$" + (db.length * 5000000).toLocaleString();

                    list.innerHTML = db.map(node => \`
                        <div class="flat-unit">
                            <span>🔑 <b>\${node.name.toUpperCase()}</b><br><small style="color:#444;">ID: \${node.id}</small></span>
                            <button style="background:transparent; color:gold; border:1px solid gold; padding:5px 15px; cursor:pointer;" onclick="location.href='/room/\${node.id}'">ENTER</button>
                        </div>
                    \`).join('');
                }

                function addNode(name) {
                    const val = name || document.getElementById('nodeInp').value;
                    if(!val) return;
                    
                    // Check duplicate
                    if(db.some(x => x.name.toLowerCase() === val.toLowerCase())) return;

                    const id = 'AXON-' + Math.random().toString(36).substr(2, 6).toUpperCase();
                    db.push({ id: id, name: val });
                    localStorage.setItem('axon_linked_v1', JSON.stringify(db));
                    
                    if(!name) document.getElementById('nodeInp').value = "";
                    refresh();
                }

                // ⚡ AUTO-LINK: Agar website se name aaya hai toh deploy karo
                if(incomingName) {
                    addNode(incomingName);
                    // URL saaf karna taake baar baar add na ho
                    window.history.replaceState({}, document.title, "/");
                }

                refresh();
            </script>
        </body>
        </html>
    `);
});

app.get('/room/:id', (req, res) => {
    res.send("<body style='background:#000;color:cyan;text-align:center;padding-top:100px;'><h1>VAULT ACCESS GRANTED</h1><button onclick='history.back()'>EXIT</button></body>");
});

module.exports = app;
