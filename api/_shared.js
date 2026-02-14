import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const toolDeclarations = [
    {
        functionDeclarations: [
            {
                name: "add_sticker",
                description:
                    "Add a fun emoji sticker on the image area to make the conversation more engaging for the child. Use this when the child mentions an animal, object, or emotion.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        emoji: {
                            type: "STRING",
                            description: 'The emoji to display, e.g. "🦁", "⭐", "🎈", "🌈"',
                        },
                        label: {
                            type: "STRING",
                            description: 'A short label for the sticker, e.g. "Lion", "Star"',
                        },
                    },
                    required: ["emoji", "label"],
                },
            },
            {
                name: "show_fun_fact",
                description:
                    "Display an interesting, child-friendly fun fact about something in the image or something the child mentioned.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        fact: {
                            type: "STRING",
                            description: "A short, fun, child-friendly fact (1-2 sentences max)",
                        },
                    },
                    required: ["fact"],
                },
            },
            {
                name: "celebrate",
                description:
                    "Trigger a fun confetti/celebration animation on screen.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        reason: {
                            type: "STRING",
                            description: 'Why we are celebrating, e.g. "Great answer!"',
                        },
                    },
                    required: ["reason"],
                },
            },
            {
                name: "change_theme",
                description: "Change the background color theme of the app.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        color: {
                            type: "STRING",
                            description: 'A CSS color value like "#FFD700", "coral"',
                        },
                        mood: {
                            type: "STRING",
                            description: 'The mood, e.g. "happy", "calm"',
                        },
                    },
                    required: ["color", "mood"],
                },
            },
        ],
    },
];

const SYSTEM_PROMPT = `You are a warm, enthusiastic, and friendly AI assistant talking to a young child (ages 4-8) about a picture they are looking at on their screen.

RULES:
- Keep your responses SHORT (1-3 sentences max). Children have short attention spans.
- Use simple words a 4-year-old can understand.
- Be encouraging, positive, and playful. Use exclamations like "Wow!", "Amazing!", "That's so cool!"
- Ask ONE engaging question at a time to keep the child talking.
- Reference specific things you can see in the image (animals, colors, objects).
- Use the tool functions to make the experience interactive:
  - Use "add_sticker" when the child mentions an animal or object
  - Use "show_fun_fact" to share an interesting fact about something in the image
  - Use "celebrate" when the child gives a good answer or says something creative
  - Use "change_theme" occasionally to match the mood of the conversation
- You MUST use at least one tool call every 2-3 exchanges to keep things fun.
- The conversation is exactly 1 minute long. You will be told how much time is remaining.
- When the time is almost up (under 10 seconds), say a warm goodbye.

IMPORTANT: Always respond with BOTH text AND at least one tool call to keep the interaction dynamic.`;

async function withRetry(fn, maxRetries = 3) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            const isRateLimit =
                error.status === 429 ||
                error.message?.includes("429") ||
                error.message?.includes("RESOURCE_EXHAUSTED");
            if (isRateLimit && attempt < maxRetries) {
                const delay = Math.pow(2, attempt + 1) * 1000;
                await new Promise((r) => setTimeout(r, delay));
            } else {
                throw error;
            }
        }
    }
}

// In-memory session store (note: serverless functions are stateless, 
// so sessions won't persist across cold starts. For production, use a database.)
const sessions = new Map();

export { genAI, toolDeclarations, SYSTEM_PROMPT, withRetry, sessions };
