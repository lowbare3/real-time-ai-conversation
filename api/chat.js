import { withRetry, sessions } from "./_shared.js";

export default async function handler(req, res) {
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { message, sessionId, timeRemaining } = req.body;

        const session = sessions.get(sessionId);
        if (!session) {
            return res.status(404).json({ error: "Session not found. Please restart the conversation." });
        }

        const timeContext =
            timeRemaining <= 10
                ? "TIME IS ALMOST UP! Say a warm goodbye and tell the child they did an amazing job. This is your LAST message."
                : `Time remaining: ${timeRemaining} seconds.`;

        const result = await withRetry(() =>
            session.chat.sendMessage(
                `Child says: "${message}"\n\n${timeContext}`
            )
        );

        const response = result.response;
        const text = response.text();
        const functionCalls = response.functionCalls();

        res.status(200).json({
            text,
            toolCalls: functionCalls || [],
        });
    } catch (error) {
        console.error("Error in chat:", error);
        res.status(500).json({ error: error.message });
    }
}
