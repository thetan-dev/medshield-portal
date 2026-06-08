# MedShield Portal — Secure Clinical AI Gateway

MedShield Portal is a professional, high-fidelity security dashboard designed for clinical environments. It serves as an AI gateway that filters patient case data in real-time, defending clinical workflows against prompt injections, protecting patient privacy via PII redaction, and neutralizing Cross-Site Scripting (XSS) risks inside AI-generated responses.

---

## 🔒 Key Security Layers

MedShield filters clinical requests in three sequential, real-time security phases:

### 1. Phase 1: Prompt Injection & Abuse Defense
- **Pattern Matching Heuristics:** Intercepts prompt jailbreaks, privilege escalation commands (e.g., `"ignore previous instructions"`, `"developer mode"`), and instruction override attempts.
- **Drug Blocklist:** Flags and blocks unauthorized prescription requests or requests for high-dosage narcotics (e.g., Fentanyl, Oxycodone).
- **Proximity & Linguistic Analysis:** Employs verb-noun proximity heuristics to catch obfuscated injection patterns (e.g., instructions attempting to disregard guidelines).

### 2. Phase 2: HIPAA-Compliant PII Redaction
- **Name Scanners:** Redacts patient names dynamically using prefix markers and grammatical context.
- **Identifiers Redacted:** Automatically masks emails, phone numbers (varying formats), social security numbers (SSN), credit card info, dates of birth (DOB), zip codes, IP addresses, and custom alpha-numeric Patient IDs (e.g., `ID-[digits]`).
- **Sanitized Payload Preview:** Displays exactly what redacted payload is safe to transmit to external Large Language Models (LLMs).

### 3. Phase 3: Output Sanitization (XSS Shield)
- **HTML Escaping:** Automatically escapes all HTML special characters (`<`, `>`, `&`, `"`, `'`) returning from simulated AI outputs.
- **Payload Interception:** Neutralizes injected script blocks (`<script>`), malicious images (`<img src=x onerror=...>`), and overlay buttons that try to hijack administrative sessions.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** [React 19](https://react.dev/) + [Vite](https://vite.dev/) (with Hot Module Replacement)
- **Styling:** [TailwindCSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) for fluid state transitions, dynamic alert overlays, and sliding log animations
- **Iconography:** [Lucide React](https://lucide.dev/)
- **Linter & Code Quality:** [ESLint v10](https://eslint.org/) configured with React Hook validation rules.

---

## 🚀 Getting Started

### 📋 Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18.0.0 or higher) installed.

### 📦 Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/<your-username>/medshield-portal.git
   cd medshield-portal
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### 💻 Development Commands
- **Start Local Dev Server:**
  ```bash
  npm run dev
  ```
- **Compile Production Build:**
  ```bash
  npm run build
  ```
- **Run ESLint Linter:**
  ```bash
  npm run lint
  ```
- **Preview Production Build Locally:**
  ```bash
  npm run preview
  ```

---

## 📂 Project Structure

```
├── public/                # Static assets & icons
├── src/
│   ├── assets/            # CSS & styles
│   ├── components/
│   │   ├── SecurityLogItem.jsx  # Individual security processing card
│   │   └── StatusBadge.jsx      # High-performance status badge
│   ├── utils/
│   │   └── securityUtils.js     # Redaction, injection checking & XSS sanitization
│   ├── App.jsx            # Main dashboard container & orchestrator
│   ├── main.jsx           # Application mount entrypoint
│   └── index.css          # Core CSS stylesheet
├── eslint.config.js       # ESLint configurations
├── package.json           # Scripts & package dependencies
├── tailwind.config.js     # TailwindCSS layouts
└── index.html             # Entrypoint HTML template
```

---

