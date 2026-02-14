import { genAI, toolDeclarations, SYSTEM_PROMPT, withRetry, sessions } from "./_shared.js";

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
        const { imageBase64, sessionId } = req.body;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-lite",
            tools: toolDeclarations,
            systemInstruction: SYSTEM_PROMPT,
        });

        const chat = model.startChat({ history: [] });

        const imagePart = {
            inlineData: {
                data: imageBase64,
                mimeType: "image/png",
            },
        };

        const result = await withRetry(() =>
            chat.sendMessage([
                imagePart,
                "Look at this picture! Start a fun, engaging conversation with the child about what you see. Remember to use a tool call too! Time remaining: 60 seconds.",
            ])
        );

        const response = result.response;
        const text = response.text();
        const functionCalls = response.functionCalls();

        sessions.set(sessionId, { chat, startTime: Date.now() });

        res.status(200).json({
            text,
            toolCalls: functionCalls || [],
        });
    } catch (error) {
        console.error("Error starting conversation:", error);
        res.status(500).json({ error: error.message });
    }
}
