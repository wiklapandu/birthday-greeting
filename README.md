# 🎉 Happy Birthday Invitation

An interactive birthday invitation web app with animations and customizable content.

## 🚀 Quick Start

### Local Development (localhost:3000)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   - Navigate to `http://localhost:3000`

### Customize Your Message

Edit `assets/js/config.json` to customize:
- Recipient name
- Messages and emojis
- Scene content
- Colors and styling

## 📦 Deployment

### Deploy to Vercel

1. **Connect your repository:**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Or use GitHub:**
   - Push to GitHub
   - Connect to Vercel via dashboard
   - Auto-deploys on push

### Environment

- **Node.js:** 18.x required
- **Framework:** Express.js (lightweight server)
- **Frontend:** Vanilla HTML/CSS/JavaScript

## 📁 Project Structure

```
happy-birthday/
├── index.html              # Main page
├── server.js              # Express server
├── package.json           # Dependencies
├── vercel.json            # Vercel config
├── assets/
│   ├── css/
│   │   └── styles.css     # All styling
│   └── js/
│       ├── config.json    # Customization
│       └── scripts.js     # App logic
└── README.md
```

## ✨ Features

- **9 Interactive Scenes** — Envelope, WhatsApp, narrative, celebration
- **Animations** — Particles, transitions, effects
- **Responsive** — Works on mobile and desktop
- **Customizable** — Change text, emojis, colors in config.json
- **Vercel Ready** — One-click deployment

## 🔧 Tech Stack

- **Server:** Express.js
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Deployment:** Vercel

## 📝 License

MIT
