// 📡 AXON UPLINK SYSTEM
async function triggerHandshake(nodeName) {
    try {
        const response = await fetch('https://axoncloud-io.vercel.app/api/website-handshake', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                companyName: nodeName || "Layer-2000-Core",
                fullName: "Commander Muazzam"
            })
        });

        if (response.ok) {
            console.log(">> AXON UPLINK: SUCCESS");
        }
    } catch (error) {
        console.error(">> AXON UPLINK: FAILED", error);
    }
}

// Testing ke liye: Jab page load ho toh handshake auto-trigger ho jaye
window.onload = () => triggerHandshake("Main-Core-Initiated");
