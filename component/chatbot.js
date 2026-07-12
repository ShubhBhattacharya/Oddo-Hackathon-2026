async function sendChat() {
    const inputField = document.getElementById('chat-input');
    const msgContainer = document.getElementById('chat-messages');
    const query = inputField.value.trim();

    if(!query) return;

    // 1. User ka message add karo
    msgContainer.innerHTML += `<div class="p-2 bg-indigo-600 text-white rounded ml-auto">${query}</div>`;
    inputField.value = '';

    // 2. Chatbot ka jawab (Mock AI Logic)
    let reply = "I am processing your query...";
    
    // Yahan tum basic 'if-else' se answers set kar sakte ho
    if(query.toLowerCase().includes("dashboard")) {
        reply = "The Dashboard shows real-time stats including 2 active vehicles, 3 drivers, and current trip status.";
    } else if(query.toLowerCase().includes("driver")) {
        reply = "We have 3 drivers registered: Alex Kumar, Rahul Sharma, and Rohan. You can monitor their scores and status here.";
    } else if(query.toLowerCase().includes("trip")) {
        reply = "There is currently 1 active trip from Delhi to Mumbai, assigned to Rahul Sharma.";
    }

    // 3. Jawab screen par dikhao
    setTimeout(() => {
        msgContainer.innerHTML += `<div class="p-2 bg-gray-100 rounded">${reply}</div>`;
        msgContainer.scrollTop = msgContainer.scrollHeight;
    }, 500);
}