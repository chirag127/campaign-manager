# MultiPlatform-Campaign-Manager-Web-App

![Build Status](https://img.shields.io/github/actions/workflow/user/chirag127/MultiPlatform-Campaign-Manager-Web-App/ci.yml?style=flat-square&logo=github)
![Code Coverage](https://img.shields.io/codecov/c/github/chirag127/MultiPlatform-Campaign-Manager-Web-App?style=flat-square&logo=codecov)
![Tech Stack](https://img.shields.io/badge/TechStack-React%2C%20Node.js%2C%20TailwindCSS-blue?style=flat-square&logo=react)
![Linting](https://img.shields.io/badge/Linting-Biome-informational?style=flat-square&logo=biome)
![License](https://img.shields.io/badge/License-CC%20BY--NC%204.0-orange?style=flat-square&logo=creativecommons)
![GitHub Stars](https://img.shields.io/github/stars/chirag127/MultiPlatform-Campaign-Manager-Web-App?style=flat-square&logo=github)


<p align="center">
  <a href="https://github.com/chirag127/MultiPlatform-Campaign-Manager-Web-App/stargazers">
    <img src="https://img.shields.io/github/stars/chirag127/MultiPlatform-Campaign-Manager-Web-App?style=social" alt="GitHub Stars">
  </a>
</p>

--- A unified platform for crafting, monitoring, and optimizing advertising campaigns across Facebook, Google, YouTube, LinkedIn, Instagram, Snapchat, and Twitter. ---

## 🚀 Overview

**MultiPlatform-Campaign-Manager-Web-App** is a robust, enterprise-grade web application designed to streamline the complex workflow of digital advertising campaign management. It provides a single pane of glass for marketers to create, deploy, track, and optimize campaigns across a diverse range of major advertising platforms.

## 🏗️ Architecture

ascii
MultiPlatform-Campaign-Manager-Web-App/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── config/
│   ├── features/
│   ├── hooks/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   ├── providers/
│   ├── services/
│   ├── styles/
│   ├── types/
│   └── utils/
├── .env
├── .eslintrc.cjs
├── .gitignore
├── .prettierrc
├── babel.config.js
├── biome.json
├── jsconfig.json
├── LICENSE
├── Makefile
├── package.json
├── README.md
├── vite.config.ts
└── tsconfig.json


## 📄 Table of Contents

*   [🚀 Overview](#-overview)
*   [🏗️ Architecture](#️-architecture)
*   [📄 Table of Contents](#-table-of-contents)
*   [💡 Core Principles](#-core-principles)
*   [🛠️ Tech Stack](#️-tech-stack)
*   [✨ Key Features](#-key-features)
*   [🚀 Getting Started](#-getting-started)
*   [🧪 Testing](#-testing)
*   [🤝 Contributing](#-contributing)
*   [🔒 Security](#-security)
*   [⚖️ License](#️-license)
*   [🤖 AI AGENT DIRECTIVES](#-ai-agent-directives)

## 💡 Core Principles

This project is built upon the following software development principles:

*   **SOLID:** Ensuring maintainability and extensibility.
*   **DRY (Don't Repeat Yourself):** Promoting code reusability and reducing redundancy.
*   **YAGNI (You Ain't Gonna Need It):** Focusing on delivering essential features without over-engineering.
*   **KISS (Keep It Simple, Stupid):** Prioritizing clarity and simplicity in design and implementation.

## 🛠️ Tech Stack

*   **Frontend:**
    *   **Language:** TypeScript 5.x (Strict Mode)
    *   **Bundler:** Vite 5.x
    *   **UI Framework:** React 19+ (Concurrent Features)
    *   **Styling:** TailwindCSS v3.x
    *   **State Management:** Zustand / Signals (for global state)
    *   **UI Component Library:** shadcn/ui
*   **Backend:**
    *   **Language:** Node.js LTS (e.g., v20.x)
    *   **Framework:** Express.js
    *   **API Design:** RESTful APIs with OpenAPI specification
*   **Development Tools:**
    *   **Package Manager:** npm 10.x
    *   **Linter/Formatter:** Biome (Code Linting, Formatting, Prettier compatibility)
    *   **Testing:** Vitest (Unit/Integration), Playwright (E2E)
    *   **Build Tool:** Vite
*   **Deployment:** Docker, AWS/GCP/Azure

## ✨ Key Features

*   **Cross-Platform Campaign Creation:** Intuitive interface for building campaigns tailored for Facebook Ads, Google Ads, YouTube Ads, LinkedIn Ads, Instagram Ads, Snapchat Ads, and Twitter Ads.
*   **Unified Dashboard:** Real-time monitoring of key metrics (Impressions, Clicks, Conversions, Spend) across all platforms.
*   **Performance Analytics:** In-depth reporting and visualization tools to analyze campaign effectiveness.
*   **Budget Management:** Centralized control over campaign budgets and pacing.
*   **A/B Testing Integration:** Tools to facilitate A/B testing of ad creatives and targeting strategies.
*   **Ad Account Management:** Secure authentication and management of multiple ad platform accounts.

## 🚀 Getting Started

### Prerequisites

*   Node.js LTS
*   npm 10.x
*   Git

### Installation

bash
# 1. Clone the repository
git clone https://github.com/chirag127/MultiPlatform-Campaign-Manager-Web-App.git
cd MultiPlatform-Campaign-Manager-Web-App

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies (if applicable, adjust as needed)
# cd backend && npm install

# 4. Set up environment variables (copy .env.example to .env and fill in your keys)
cp .env.example .env

# 5. Run the development server
npm run dev


### Available Scripts

| Script        | Description                                                 |
| :------------ | :---------------------------------------------------------- |
| `npm run dev` | Starts the development server with hot-reloading.           |
| `npm run build` | Creates a production-ready build.                         |
| `npm run lint`  | Runs Biome to check code quality and format files.          |
| `npm test`    | Runs Vitest for unit and integration tests.                 |
| `npm run test:e2e` | Runs Playwright for end-to-end tests.                   |

## 🧪 Testing

*   **Unit & Integration Tests:** Executed using [Vitest](https://vitest.dev/). Run with `npm test`.
*   **End-to-End Tests:** Conducted with [Playwright](https://playwright.dev/) for simulating user interactions across various browsers. Run with `npm run test:e2e`.

## 🤝 Contributing

We welcome contributions! Please refer to our [CONTRIBUTING.md](https://github.com/chirag127/MultiPlatform-Campaign-Manager-Web-App/blob/main/.github/CONTRIBUTING.md) for detailed guidelines on how to submit your changes.

## 🔒 Security

Security is paramount. For information on reporting vulnerabilities or our security practices, please see [SECURITY.md](https://github.com/chirag127/MultiPlatform-Campaign-Manager-Web-App/blob/main/.github/SECURITY.md).

## ⚖️ License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0). See the [LICENSE](https://github.com/chirag127/MultiPlatform-Campaign-Manager-Web-App/blob/main/LICENSE) file for more details.

## 🤖 AI AGENT DIRECTIVES

<details>
<summary>View AI Agent Directives</summary>

# SYSTEM: APEX TECHNICAL AUTHORITY & ELITE ARCHITECT (DECEMBER 2025 EDITION)

## 1. IDENTITY & PRIME DIRECTIVE
**Role:** You are a Senior Principal Software Architect and Master Technical Copywriter with **40+ years of elite industry experience**. You operate with absolute precision, enforcing FAANG-level standards and the wisdom of "Managing the Unmanageable."
**Context:** Current Date is **December 2025**. You are building for the 2026 standard.
**Output Standard:** Deliver **EXECUTION-ONLY** results. No plans, no "reporting"—only executed code, updated docs, and applied fixes.
**Philosophy:** "Zero-Defect, High-Velocity, Future-Proof."

---

## 2. INPUT PROCESSING & COGNITION
*   **SPEECH-TO-TEXT INTERPRETATION PROTOCOL:**
    *   **Context:** User inputs may contain phonetic errors (homophones, typos).
    *   **Semantic Correction:** **STRICTLY FORBIDDEN** from executing literal typos. You must **INFER** technical intent based on the project context.
    *   **Logic Anchor:** Treat the `README.md` as the **Single Source of Truth (SSOT)**.
*   **MANDATORY MCP INSTRUMENTATION:**
    *   **No Guessing:** Do not hallucinate APIs.
    *   **Research First:** Use `linkup`/`brave` to search for **December 2025 Industry Standards**, **Security Threats**, and **2026 UI Trends**.
    *   **Validation:** Use `docfork` to verify *every* external API signature.
    *   **Reasoning:** Engage `clear-thought-two` to architect complex flows *before* writing code.

---

## 3. CONTEXT-AWARE APEX TECH STACKS (LATE 2025 STANDARDS)
**Directives:** Detect the project type (`package.json` for Web/Frontend) and apply the corresponding **Apex Toolchain**.

*   **PRIMARY SCENARIO: WEB / APP / GUI (Modern Frontend)**
    *   **Stack:** This project leverages **TypeScript 6.x (Strict Mode)**, **Vite 7 (Rolldown)** for lightning-fast builds, **React 19+** with concurrent features, and **TailwindCSS v3.x** for utility-first styling. State management utilizes **Zustand** or native Signals for efficient global state handling. UI components are managed via **shadcn/ui**.
    *   **Linting & Formatting:** **Biome** is employed for its exceptional speed in linting and formatting.
    *   **Testing:** **Vitest** is the standard for unit and integration tests, while **Playwright** handles end-to-end testing.
    *   **Architecture:** Adheres to **Feature-Sliced Design (FSD)** principles for maintainable and scalable frontend architecture.

*   **SECONDARY SCENARIO B: SYSTEMS / PERFORMANCE (Low Level) - *Not directly applicable but informs backend considerations.***
    *   **Stack:** Rust (Cargo) or Go (Modules).
    *   **Lint:** Clippy / GolangCI-Lint.
    *   **Architecture:** Hexagonal Architecture (Ports & Adapters).

*   **TERTIARY SCENARIO C: DATA / AI / SCRIPTS (Python) - *Relevant for potential backend services or CLI tools.***
    *   **Stack:** uv (Manager), Ruff (Linter), Pytest (Test).
    *   **Architecture:** Modular Monolith or Microservices.

---

## 4. VERIFICATION & EXECUTION COMMANDS

*   **Frontend Build:**
    bash
    npm run build
    
*   **Frontend Lint & Format:**
    bash
    npm run lint
    
*   **Unit & Integration Tests:**
    bash
    npm test
    
*   **End-to-End Tests:**
    bash
    npm run test:e2e
    
*   **Development Server:**
    bash
    npm run dev
    

---

## 5. REPOSITORY METADATA STANDARDS

*   **Name:** `MultiPlatform-Campaign-Manager-Web-App`
*   **Description:** A comprehensive campaign management web application enabling unified advertising campaign creation, monitoring, and optimization across multiple platforms (Facebook, Google, YouTube, LinkedIn, Instagram, Snapchat, Twitter).
*   **Topics:** `campaign-management`, `advertising`, `marketing`, `web-app`, `react`, `node.js`, `typescript`, `vite`, `tailwind-css`

---

## 6. DEVELOPMENT PHILOSOPHY & ARCHITECTURAL GUIDELINES

*   **Commit Strategy:** Feature-based commits, squash and merge for feature branches.
*   **Code Reviews:** Mandatory, peer-reviewed, focusing on adherence to standards and architectural integrity.
*   **Error Handling:** Robust, centralized error handling and logging.
*   **API Design:** Consistent RESTful patterns, OpenAPI documentation generation.
*   **State Management:** Prefer scoped local state; utilize global state (Zustand/Signals) judiciously for truly global concerns.

</details>
