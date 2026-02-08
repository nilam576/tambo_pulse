const API_KEY = "tambo_3APnVbd3NiN/8YTVLx/VTcXRkT3RoOL4GgkN1GDE01hBHgtrEygUltwavPGGE1//igZDHcTsxjk/MQso26x1tB+ZFc8JyZX9mb4Btv3Z3eE=";

async function testTamboAPI() {
    console.log("Testing Tambo API...");
    console.log("API Key (first 20 chars):", API_KEY.substring(0, 20) + "...");
    
    try {
        const response = await fetch('https://api.tambo.ai/v1/threads', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
        });
        
        console.log("Response status:", response.status);
        console.log("Response status text:", response.statusText);
        
        if (response.ok) {
            const data = await response.json();
            console.log("✅ API Key is valid!");
            console.log("Thread created:", data.id);
        } else {
            const errorText = await response.text();
            console.error("❌ API Error:", errorText);
        }
    } catch (error) {
        console.error("❌ Request failed:", error.message);
    }
}

testTamboAPI();
