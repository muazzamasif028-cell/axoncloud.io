// AXON-CORE BRIDGE CODE
const apiKey = "YOUR_GOOGLE_API_KEY"; // Yahan apni API Key dalein
const blogId = "YOUR_BLOG_ID";       // Yahan apni Blog ID dalein

async function syncDashboard() {
    try {
        const response = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}`);
        const data = await response.json();
        
        // Agar Blogger par posts hain, toh Dashboard update karein
        if (data.items) {
            const totalNodes = data.items.length; 
            // Ye line aapke dashboard par "20 NODES" ko real-time update karegi
            document.querySelector('.status').innerHTML = `STATUS: ${totalNodes} NODES ONLINE`;
            console.log("System Synced: Node Data Fetched");
        }
    } catch (error) {
        console.error("Connection Failed:", error);
    }
}

// Har 1 minute baad check karega
setInterval(syncDashboard, 60000);
syncDashboard();
async function activateNode() {
  const company = document.getElementById('companyInput').value; // Input box se naam uthayega
  
  const response = await fetch('/api/activate-node', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ companyName: company })
  });

  if (response.ok) {
    alert(`COMMANDER: Node for ${company} is now SECURED in Google Cloud!`);
    // Dashboard ka status update karne ka code yahan ayega
  }
}
