# Fitmedix — Clinical-Grade Health & Wellness Platform

Fitmedix is an accessible, evidence-grounded health, biometric, and clinical insights web platform designed for verified personal health tracking, voice-assisted interaction, and real-time medical insights without synthetic or false data.

---

## 🌟 Key Features

- **Recharts Clinical Dashboard**: Real-time visualization of verified biometric telemetry including resting heart rate, zone 2 aerobic minutes, glycemic response curves, sleep architecture, and blood pressure trends.
- **Evidence-Based Medical Snippets**: Verified health insights backed by recognized clinical bodies (ACSM, AHA, ADA, NIH, Lancet).
- **Gemini Clinical Engine**: Deep medical inquiry, prescription interaction cross-referencing, and symptom triaging powered by the modern `@google/genai` TypeScript SDK.
- **Voice & Accessibility First**: Full screen-reader semantic HTML, high-contrast accessible color tokens, WCAG AAA compliance, and voice interaction controls.
- **Zero False Data Policy**: Strict rejection of synthetic or hallucinated biometric data; full provenance citations for clinical guidance.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm, pnpm, or bun

### 1. Clone the repository

```bash
git clone https://github.com/sharmaprem3010-netizen/Fitmedix.git
cd Fitmedix
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Add your Gemini API key:

```env
GEMINI_API_KEY="your_api_key_here"
PORT=3000
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Recharts, Motion
- **Backend**: Node.js, Express, tsx
- **AI/ML**: Google GenAI SDK (`@google/genai`)
- **Build Tool**: Vite 6+

---

## 📜 License

MIT License. Designed & Developed by Prem Sharma.
