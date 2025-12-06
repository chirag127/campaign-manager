# OmniCampaign-MultiPlatform-Ad-Management-Web-App

![OmniCampaign Banner](https://via.placeholder.com/1200x250/0F2027/E0F2F1?text=OmniCampaign+-+Unified+Ad+Management)

[![Build Status](https://github.com/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App/actions/workflows/ci.yml/badge.svg)](https://github.com/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App/actions/workflows/ci.yml)
[![Code Coverage](https://codecov.io/gh/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App/branch/main/graph/badge.svg)](https://codecov.io/gh/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App)
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20TS%20%7C%20Vite%20%7C%20TailwindCSS-007ACC.svg?style=flat-square)](https://github.com/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App)
[![Lint & Format](https://img.shields.io/badge/Code%20Quality-Biome-39ff14.svg?style=flat-square)](https://github.com/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App)
[![License](https://img.shields.io/badge/License-CC_BY--NC_4.0-lightgrey.svg?style=flat-square)](https://github.com/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App/blob/main/LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App?style=flat-square&color=pink)](https://github.com/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App/stargazers)

<p align="center">
  <a href="https://github.com/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App/stargazers">
    <img alt="Star ⭐ this Repo" src="https://img.shields.io/badge/Star%20this%20Repo-pink?style=for-the-badge&logo=github" width="170" height="30">
  </a>
</p>

OmniCampaign-MultiPlatform-Ad-Management-Web-App is a comprehensive, unified web application designed to streamline and centralize digital advertising campaign management across major platforms like Facebook, Google, and LinkedIn. Leveraging cutting-edge React, Node.js, and a robust Feature-Sliced Design architecture, it provides a single dashboard for creating, managing, and analyzing ad campaigns with unparalleled efficiency.

## 🚀 Project Overview

Centralize your digital advertising efforts with OmniCampaign. This platform offers a unified dashboard to effortlessly create, manage, and analyze your ad campaigns across multiple platforms including Facebook, Google, and LinkedIn. Say goodbye to juggling multiple ad managers and hello to streamlined, intelligent marketing.

### 🗺️ Architecture: Feature-Sliced Design (FSD)

OmniCampaign's frontend is architected using the Feature-Sliced Design (FSD) methodology, promoting modularity, scalability, and maintainability. This structure ensures clear separation of concerns, making it easier to develop, test, and understand the codebase.

mermaid
graph TD
    A[App Layer] --> B(Pages Layer)
    B --> C(Widgets Layer)
    C --> D(Features Layer)
    D --> E(Entities Layer)
    E --> F(Shared Layer)

    subgraph Layers
        A -- "Entry point, global logic" --> B
        B -- "Full-page components, routing" --> C
        C -- "Independent UI blocks, composed of features" --> D
        D -- "Business logic related to a specific feature" --> E
        E -- "Data models, business objects" --> F
        F -- "Reusable UI components, utilities, hooks" --> G(Shared Library)
    end


### Table of Contents

- [🚀 Project Overview](#--project-overview)
  - [🗺️ Architecture: Feature-Sliced Design (FSD)](#%F0%9F%9B%B2%EF%B8%8F-architecture-feature-sliced-design-fsd)
- [🤖 AI Agent Directives](#-ai-agent-directives)
- [🛠️ Getting Started](#%F0%9F%9B%A0%EF%B8%8F-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [📜 Development Scripts](#%F0%9F%93%8B-development-scripts)
- [💡 Core Principles](#%F0%9F%92%A1-core-principles)
- [🤝 Contributing](#%F0%9F%A4%9D-contributing)
- [📄 License](#%F0%9F%93%84-license)
- [🔒 Security](#%F0%9F%94%92-security)
- [🙏 Acknowledgements](#%F0%9F%99%8F-acknowledgements)

## 🤖 AI Agent Directives

<details>
<summary>Click to view AI Agent Directives for OmniCampaign</summary>

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
**Directives:** Detect the project type and apply the corresponding **Apex Toolchain**. This repository, `OmniCampaign-MultiPlatform-Ad-Management-Web-App`, is a TypeScript-based web application with a Node.js backend.

*   **PRIMARY SCENARIO: WEB / APP / GUI (Modern Frontend & Backend)**
    *   **Frontend Stack:** This project leverages **TypeScript 6.x (Strict Mode)** for robust type safety, **React 19+** for declarative UI, **Vite 7+ (Rolldown)** for lightning-fast development, and **TailwindCSS v4+** for utility-first styling.
    *   **Backend Stack:** A **Node.js 20+** backend, potentially using **Fastify** or **Express.js**, for API services, database interactions, and integration with external advertising APIs (Facebook, Google, LinkedIn).
    *   **Lint/Test:** **Biome** (for ultra-fast linting and formatting), **Vitest** (for efficient unit and integration testing of both frontend and backend logic), and **Playwright** (for comprehensive end-to-end testing of user flows across the application).
    *   **Architecture:** Adheres to **Feature-Sliced Design (FSD)** for the frontend, ensuring modularity, scalability, and clear separation of concerns. The backend follows a **Modular Monolith** or **Microservices** pattern where appropriate, emphasizing clear API boundaries and domain-driven design principles.

*   **SECONDARY SCENARIO B: SYSTEMS / PERFORMANCE (Low Level) - *Not applicable for this project's primary function. Reference only for potential future native components.***
    *   **Stack:** Rust (Cargo) or Go (Modules).
    *   **Lint:** Clippy / GolangCI-Lint.
    *   **Architecture:** Hexagonal Architecture (Ports & Adapters).

*   **TERTIARY SCENARIO C: DATA / AI / SCRIPTS (Python) - *Not applicable for this project's primary function. Reference only for potential future AI/data processing microservices.***
    *   **Stack:** uv (Manager), Ruff (Linter), Pytest (Test).
    *   **Architecture:** Modular Monolith or Microservices.

---

## 4. ARCHITECTURAL PATTERNS & PRINCIPLES
*   **Frontend (FSD - Feature-Sliced Design):**
    *   **Layers:** App, Pages, Widgets, Features, Entities, Shared.
    *   **Rules:** Strict dependency flow (top-down), public API for inter-layer communication, local-first styling.
*   **Backend (Modular Monolith / Microservices):**
    *   **Principles:** Domain-Driven Design, API-First, eventual consistency, idempotency.
*   **General Principles:**
    *   **SOLID:** Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.
    *   **DRY:** Don't Repeat Yourself.
    *   **YAGNI:** You Aren't Gonna Need It.
    *   **KISS:** Keep It Simple, Stupid.
    *   **CQRS:** Command Query Responsibility Segregation (where applicable for complex operations).

---

## 5. DEVELOPMENT WORKFLOW & VERIFICATION
*   **Version Control:** GitFlow or GitHub Flow, strict semantic versioning.
*   **Code Reviews:** Mandatory for all changes.
*   **Testing Strategy:**
    *   **Unit Tests:** Vitest (Frontend & Backend). Cover individual functions/components.
    *   **Integration Tests:** Vitest. Verify interactions between modules/services.
    *   **End-to-End Tests:** Playwright. Simulate real user scenarios.
    *   **API Tests:** Postman/Insomnia or Vitest (for backend API routes).
*   **Verification Commands:**
    *   **Install Dependencies:** `npm install` or `pnpm install` or `yarn install`
    *   **Run Development Server:** `npm run dev`
    *   **Build Production:** `npm run build`
    *   **Run All Tests:** `npm test` or `npm run test:ci`
    *   **Lint & Format:** `npm run lint` && `npm run format`
    *   **Type Check:** `npm run type-check`

---

## 6. SECURITY & RELIABILITY
*   **OWASP Top 10:** Adherence to latest OWASP guidelines for web application security.
*   **Dependency Audits:** Regular scanning with `npm audit` and Snyk.
*   **Error Monitoring:** Integration with Sentry or similar for real-time error tracking.
*   **Rate Limiting & Authentication:** Robust measures for all public API endpoints.

---

## 7. DOCUMENTATION & KNOWLEDGE TRANSFER
*   **README.md:** Comprehensive, living documentation.
*   **CONTRIBUTING.md:** Clear guidelines for external contributors.
*   **API Documentation:** OpenAPI/Swagger for backend APIs.
*   **Code Comments:** Essential for complex logic.

---

## 8. DEPLOYMENT & OPERATIONS
*   **CI/CD:** GitHub Actions for automated testing, building, and deployment.
*   **Containerization:** Docker for consistent environments.
*   **Orchestration:** Kubernetes (for larger deployments) or simpler platform services.
*   **Monitoring:** Prometheus/Grafana or cloud-native solutions.
*   **Logging:** Centralized logging (e.g., ELK stack).
</details>

## 🛠️ Getting Started

Follow these steps to set up and run OmniCampaign on your local machine.

### Prerequisites

Ensure you have the following installed:

*   [Node.js](https://nodejs.org/en/) (v20 or higher)
*   [npm](https://www.npmjs.com/) (v10 or higher) or [pnpm](https://pnpm.io/) or [yarn](https://yarnpkg.com/)
*   [Git](https://git-scm.com/)

### Installation

1.  **Clone the repository:**
    bash
    git clone https://github.com/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App.git
    cd OmniCampaign-MultiPlatform-Ad-Management-Web-App
    

2.  **Install dependencies:**
    bash
    npm install # or pnpm install or yarn install
    

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory based on `.env.example` and fill in your API keys for Facebook, Google, and LinkedIn Ads, and any other necessary configuration.
    dotenv
    # Example .env content
    VITE_FACEBOOK_API_KEY=your_facebook_api_key
    VITE_GOOGLE_ADS_API_KEY=your_google_ads_api_key
    VITE_LINKEDIN_ADS_API_KEY=your_linkedin_ads_api_key
    VITE_API_BASE_URL=http://localhost:3001/api
    # Add other backend/frontend specific variables
    

### Running the Application

To start the development server:

bash
npm run dev # This will typically start both frontend and backend in development mode


The application should now be accessible in your web browser at `http://localhost:5173` (or the port specified by Vite).

## 📜 Development Scripts

| Script              | Description                                                               |
| :------------------ | :------------------------------------------------------------------------ |
| `npm run dev`       | Starts the development server with hot-reloading.                         |
| `npm run build`     | Builds the application for production to the `dist` folder.               |
| `npm run preview`   | Locally previews the production build.                                    |
| `npm run test`      | Runs unit and integration tests with Vitest.                              |
| `npm run test:e2e`  | Runs end-to-end tests with Playwright.                                    |
| `npm run lint`      | Lints the codebase using Biome for code style and potential errors.       |
| `npm run format`    | Formats the codebase using Biome.                                         |
| `npm run type-check`| Performs TypeScript type checking.                                        |

## 💡 Core Principles

This project adheres to established software development principles to ensure maintainability, scalability, and robustness:

*   **SOLID Principles:** Guiding object-oriented design.
*   **DRY (Don't Repeat Yourself):** Eliminating redundant code.
*   **YAGNI (You Aren't Gonna Need It):** Avoiding premature optimization and unnecessary features.
*   **KISS (Keep It Simple, Stupid):** Prioritizing simplicity and clarity over complexity.

## 🤝 Contributing

We welcome contributions to OmniCampaign! Please refer to our [CONTRIBUTING.md](https://github.com/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App/blob/main/.github/CONTRIBUTING.md) for detailed guidelines on how to get started, report bugs, or propose new features.

## 📄 License

This project is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) License](https://github.com/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App/blob/main/LICENSE).

## 🔒 Security

For information on how to responsibly disclose security vulnerabilities, please refer to our [SECURITY.md](https://github.com/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App/blob/main/.github/SECURITY.md) document.

## 🙏 Acknowledgements

*   Special thanks to the open-source community for the invaluable tools and libraries.
*   Inspired by the need for centralized digital marketing management.
