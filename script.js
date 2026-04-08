// 🔑 ACCESS KEYS (Replace with your actual keys)
const apiKey = "YOUR_GOOGLE_API_KEY"; 
const blogId = "YOUR_BLOG_ID";

// 🔄 SYNC DASHBOARD WITH BLOGGER
async function syncDashboard() {
    try {
        const response = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}`);
        const data = await response.json();
        
        if (data.items) {
            const totalNodes = data.items.length; 
            // Aapke dashboard par 'status' class wali div ko update karega
            const statusElement = document.querySelector('.status') || document.querySelector('h2');
            if(statusElement) {
                statusElement.innerHTML = `${totalNodes} / 200 NODES ONLINE`;
            }
            console.log("Axon-Core Synced with Blogger.");
        }
    } catch (error) {
        console.error("Blogger Sync Failed:", error);
    }
}

// ⚡ ACTIVATE NEW NODE (MANUAL INJECTION)
async function activateNode() {
    // Screenshot ke mutabiq ID 'n' ho sakti hai ya 'companyInput'
    const inputField = document.getElementById('companyInput') || document.getElementById('n');
    const company = inputField.value; 

    if(!company) {
        alert("COMMANDER: Please enter a Company Name!");
        return;
    }
    
    // UI Update (Immediate feedback)
    console.log(`Initiating Handshake for: ${company}`);

    const response = await fetch('/api/website-handshake', { // Backend endpoint se match karna zaroori hai
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            companyName: company,
            fullName: 'COMMANDER MUAZZAM',
            jobTitle: 'ALPHA-CORE'
        })
    });

    if (response.ok) {
        alert(`COMMANDER: Node for ${company} is now SECURED in Google Cloud!`);
        location.reload(); // Dashboard refresh taake naya node list mein dikhay
    } else {
        alert("Connection Failed: Check Vercel Logs.");
    }
}

// ⏲️ AUTOMATION: Har 60 seconds mein sync karega
setInterval(syncDashboard, 60000);
syncDashboard();
