// Discord Webhook-URL einfügen
const discordWebhookUrl = "https://discord.com/api/webhooks/1300511902333538304/dqrq55jkxze1FP_LVTsjhUtVcrIlP0dnOMtL92kf6DEi9konE-QZfoXSOGPDbddLuAkJ";

// Funktion, die den Status der Website überprüft
async function checkWebsiteStatus() {
    try {
        // HTTP-Anfrage an deine Website zum Überprüfen des Status
        const response = await fetch("https://d3nox.github.io/Emergency-Essen"); // <--- Deine Website-URL hier einfügen
        const status = response.ok ? "Operational" : "Down";

        return {
            status: status,
            statusCode: response.status,
            timestamp: new Date()
        };
    } catch (error) {
        return {
            status: "Down",
            statusCode: "N/A",
            timestamp: new Date()
        };
    }
}

// Funktion, die den Status an Discord sendet
async function sendStatusToDiscord(statusData) {
    // Zeitpunkt des nächsten Checks in 30 Minuten
    const nextCheckTime = new Date(Date.now() + 30 * 60 * 1000);

    const message = {
        content: "Website Status Update",
        embeds: [{
            title: "Website Status",
            color: statusData.status === "Operational" ? 3066993 : 15158332, // grün für OK, rot für Down
            fields: [
                { name: "Status", value: statusData.status, inline: true },
                { name: "Status Code", value: statusData.statusCode.toString(), inline: true },
                { name: "Letzter Check", value: statusData.timestamp.toLocaleString(), inline: true },
                { name: "Nächster Check", value: nextCheckTime.toLocaleString(), inline: true }
            ],
            footer: { text: "Website Status Checker" },
            timestamp: new Date().toISOString()
        }]
    };

    // Nachricht an Discord senden
    await fetch(discordWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message)
    });
}

// Hauptfunktion für den regelmäßigen Check alle 30 Minuten
async function updateStatus() {
    const statusData = await checkWebsiteStatus();
    await sendStatusToDiscord(statusData);
}

// Ersten Statuscheck sofort durchführen und dann alle 30 Minuten
updateStatus();
setInterval(updateStatus, 30 * 60 * 1000); // Alle 30 Minuten
