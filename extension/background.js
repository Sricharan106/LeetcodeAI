chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GENERATE_BLOG') {
        const { title, description, code, author, client_time, custom_prompt } = request.payload;

        // 🚀 API URL - Make sure this matches your deployed Render URL!
        const API_URL = "http://localhost:10000/generate-blog";

        console.log("LeetLog AI: Sending request to", API_URL);

        fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, description, code, author, client_time, custom_prompt })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    chrome.runtime.sendMessage({ type: 'STATUS_UPDATE', message: 'Posted ✅', status: 'success' });
                    // notify backend done
                } else {
                    const errMsg = data.message || JSON.stringify(data);
                    chrome.runtime.sendMessage({ type: 'STATUS_UPDATE', message: 'Error: ' + errMsg, status: 'error' });
                }
            })
            .catch(error => {
                chrome.runtime.sendMessage({ type: 'STATUS_UPDATE', message: 'Network Error: ' + error.message, status: 'error' });
            });
    }
});
