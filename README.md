# 🌟 Picture Talk — Real-Time AI Conversation with Children

An interactive AI-powered application where a child can have a **1-minute voice conversation** about an engaging jungle image. The AI initiates the conversation, asks questions, shares fun facts, and uses interactive tool calls to place stickers, trigger confetti, and more!

## 🏗️ Architecture

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| AI Model | Google Gemini 2.0 Flash (vision + function calling) |
| Voice Input | Web Speech API (SpeechRecognition) |
| Voice Output | Browser SpeechSynthesis API |

## 🚀 Quick Start

### 1. Get a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create / copy your API key

### 2. Setup Backend

```bash
cd backend
# Edit .env and paste your key
# GEMINI_API_KEY=your_key_here
npm start
```

### 3. Setup Frontend

```bash
cd frontend
npm run dev
```

### 4. Open in Browser

Open **http://localhost:5173** in **Google Chrome** (required for Speech Recognition).

Click **"Start Conversation"** and talk!

## 🎯 Features

- 🖼️ **Animated jungle SVG** with parrot, monkey, elephant, giraffe
- 🎙️ **Voice conversation** — speak naturally with the AI
- ⏱️ **1-minute timer** with color-coded urgency
- 🔧 **AI Tool Calls** that modify the UI:
  - 🎯 `add_sticker` — places emoji stickers on the image
  - 💡 `show_fun_fact` — displays educational fun facts
  - 🎉 `celebrate` — triggers confetti animation
  - 🎨 `change_theme` — changes the app accent color
- 💬 **Chat transcript** showing the full conversation
- 🔄 **Auto-restart** for multiple conversations

## 📁 Project Structure

```
├── backend/
│   ├── server.js          # Express + Gemini API
│   ├── .env               # API key
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main orchestration
│   │   ├── App.css        # Global styles
│   │   ├── components/
│   │   │   ├── ImageDisplay.jsx     # SVG jungle scene
│   │   │   ├── ConversationPanel.jsx # Chat UI
│   │   │   ├── VoiceControls.jsx    # Mic controls
│   │   │   ├── Confetti.jsx         # Celebration effect
│   │   │   ├── FunFactBubble.jsx    # Fun fact overlay
│   │   │   └── StickerOverlay.jsx   # Emoji stickers
│   │   └── hooks/
│   │       ├── useConversation.js   # API + tool call logic
│   │       └── useSpeechRecognition.js # Web Speech API
│   └── package.json
└── README.md
```

## ⚠️ Notes

- **Browser**: Use Google Chrome or Microsoft Edge (Speech Recognition requires these browsers)
- **Microphone**: Allow microphone access when prompted
- **API Key**: Ensure your Gemini API key has access to `gemini-2.0-flash`
