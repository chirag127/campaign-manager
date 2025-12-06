<p align="center">
  <a href="https://github.com/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App">
    <img src="https://raw.githubusercontent.com/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App/main/assets/omnicampaign-logo.svg" alt="OmniCampaign Logo" width="180">
  </a>
</p>

<h1 align="center">OmniCampaign-MultiPlatform-Ad-Management-Web-App</h1>

<p align="center">
  <!-- Build Status -->
  <a href="https://github.com/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App/actions/workflows/ci.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App/ci.yml?branch=main&style=flat-square&label=Build%20Status" alt="Build Status">
  </a>
  <!-- Code Coverage -->
  <a href="https://codecov.io/gh/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App">
    <img src="https://img.shields.io/codecov/c/github/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App?style=flat-square&token=YOUR_CODECOV_TOKEN" alt="Code Coverage">
  </a>
  <!-- Tech Stack -->
  <img src="https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20TS%20%7C%20Vite%20%7C%20Tailwind-blueviolet?style=flat-square" alt="Tech Stack">
  <!-- Lint/Format -->
  <a href="https://github.com/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App">
    <img src="https://img.shields.io/badge/Lint%2FFmt-Biome-informational?style=flat-square" alt="Lint/Format">
  </a>
  <!-- License -->
  <a href="https://github.com/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey?style=flat-square" alt="License">
  </a>
  <!-- GitHub Stars -->
  <a href="https://github.com/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App/stargazers">
    <img src="https://img.shields.io/github/stars/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App?style=flat-square&colorA=white&colorB=orange&label=Stars" alt="GitHub Stars">
  </a>
</p>

<p align="center">
  <a href="https://github.com/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App/stargazers">
    <img src="https://img.shields.io/badge/Star%20⭐%20this%20Repo-brightgreen?style=social&label=Stars" alt="Star this Repo">
  </a>
</p>

## BLUF: The Apex Digital Advertising Command Center 🚀

OmniCampaign revolutionizes digital advertising by providing a single, intuitive platform to create, manage, and analyze campaigns across Facebook, Google, and LinkedIn. Designed for marketing professionals, it streamlines multi-platform ad operations with advanced analytics and automation capabilities.

## 📖 Table of Contents

*   [BLUF: The Apex Digital Advertising Command Center 🚀](#bluf-the-apex-digital-advertising-command-center-rocket)
*   [Key Features](#key-features)
*   [Architecture](#architecture)
*   [Tech Stack](#tech-stack)
*   [Getting Started](#getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Installation](#installation)
    *   [Environment Variables](#environment-variables)
    *   [Running Locally](#running-locally)
*   [Development Scripts](#development-scripts)
*   [AI Agent Directives](#ai-agent-directives)
*   [Contributing](#contributing)
*   [Security](#security)
*   [License](#license)

## Key Features

*   **Unified Dashboard:** Manage all ad campaigns (Facebook, Google, LinkedIn) from a centralized interface.
*   **Cross-Platform Campaign Creation:** Design and deploy campaigns with consistent messaging across multiple networks simultaneously.
*   **Real-time Performance Analytics:** Gain deep insights with customizable dashboards, reporting on spend, impressions, clicks, conversions, and ROI across all platforms.
*   **Audience Synchronization:** Sync custom audiences and targeting parameters to ensure consistency and efficiency.
*   **Automated Scheduling & Budgeting:** Implement advanced scheduling and budget allocation rules to optimize campaign performance.
*   **Ad Creative Management:** Upload, store, and manage ad creatives (images, videos, copy) in a central library.
*   **Role-Based Access Control:** Secure and manage team access with granular permissions.

## Architecture

OmniCampaign employs a robust, scalable architecture blending **Feature-Sliced Design (FSD)** for the frontend and **Hexagonal Architecture (Ports & Adapters)** for the backend. This ensures clear separation of concerns, high maintainability, and adaptability to evolving API landscapes.

mermaid
graph TD
    subgraph Frontend (React/Vite/TS/Tailwind)
        A[App Layer] --> B(Pages)
        B --> C(Widgets)
        C --> D(Features)
        D --> E(Entities)
        E --> F(Shared)
    end

    subgraph Backend (Node.js/Express/TS)
        G[Application Layer] --> H(Domain Layer)
        H --> I(Infrastructure Layer)
        I --> J(API Adapters)
        J --> K[External Ads APIs]
        I --> L[Database]
    end

    Frontend <--> M(REST/GraphQL API)
    M <--> Backend
    K(External Ads APIs) --> N(Facebook API)
    K --> O(Google Ads API)
    K --> P(LinkedIn Ads API)

*   **Frontend (Feature-Sliced Design):** Organizes code by feature domains, promoting modularity and reducing inter-module dependencies. Layers (App, Pages, Widgets, Features, Entities, Shared) enforce strict boundaries.
*   **Backend (Hexagonal Architecture):** Decouples the core business logic (Domain Layer) from external concerns like databases and external APIs. Adapters for Facebook, Google, and LinkedIn APIs ensure flexibility and easier integration of new ad platforms.

## Tech Stack

*   **Frontend:**
    *   **Framework:** React 18+
    *   **Language:** TypeScript 5.x+
    *   **Build Tool:** Vite 7 (using Rolldown)
    *   **Styling:** TailwindCSS v4
    *   **State Management:** TanStack Query, Zustand (or similar, depending on complexity)
    *   **Linting/Formatting:** Biome
    *   **Testing:** Vitest (Unit), Playwright (E2E)
*   **Backend:**
    *   **Runtime:** Node.js 20+
    *   **Framework:** Express.js
    *   **Language:** TypeScript 5.x+
    *   **Database:** PostgreSQL (or MongoDB/MySQL, configurable)
    *   **ORM:** Prisma (or TypeORM)
    *   **Authentication:** JWT, OAuth (for Ad APIs)
    *   **Linting/Formatting:** ESLint, Prettier
    *   **Testing:** Jest, Supertest
*   **CI/CD:** GitHub Actions

## Getting Started

Follow these steps to set up OmniCampaign locally.

### Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (v20 or higher)
*   [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/) (recommended `npm`)
*   [Git](https://git-scm.com/)
*   [PostgreSQL](https://www.postgresql.org/download/) (or your chosen database)

### Installation

1.  **Clone the repository:**
    bash
    git clone https://github.com/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App.git
    cd OmniCampaign-MultiPlatform-Ad-Management-Web-App
    

2.  **Install frontend dependencies:**
    bash
    cd frontend
    npm install
    

3.  **Install backend dependencies:**
    bash
    cd ../backend
    npm install
    

### Environment Variables

Create a `.env` file in both the `frontend` and `backend` directories based on the provided `.env.example` files.

**`backend/.env` example:**

dotenv
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/omnicampaign"
JWT_SECRET="YOUR_SUPER_SECRET_KEY"
FACEBOOK_APP_ID="YOUR_FACEBOOK_APP_ID"
FACEBOOK_APP_SECRET="YOUR_FACEBOOK_APP_SECRET"
FACEBOOK_REDIRECT_URI="http://localhost:3000/auth/facebook/callback"
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
GOOGLE_REDIRECT_URI="http://localhost:3000/auth/google/callback"
LINKEDIN_CLIENT_ID="YOUR_LINKEDIN_CLIENT_ID"
LINKEDIN_CLIENT_SECRET="YOUR_LINKEDIN_CLIENT_SECRET"
LINKEDIN_REDIRECT_URI="http://localhost:3000/auth/linkedin/callback"


**`frontend/.env` example:**

dotenv
VITE_API_BASE_URL="http://localhost:5000/api"
VITE_FACEBOOK_CLIENT_ID="YOUR_FACEBOOK_APP_ID"
VITE_GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
VITE_LINKEDIN_CLIENT_ID="YOUR_LINKEDIN_CLIENT_ID"


### Running Locally

1.  **Start the backend server:**
    bash
    cd backend
    npm run dev
    # The backend will typically run on http://localhost:5000
    

2.  **Start the frontend development server:**
    bash
    cd frontend
    npm run dev
    # The frontend will typically run on http://localhost:3000
    

3.  Open your browser and navigate to `http://localhost:3000` to access OmniCampaign.

## Development Scripts

The following scripts are available in the respective `frontend` and `backend` directories:

| Script          | Description                                         |
| :-------------- | :-------------------------------------------------- |
| `npm run dev`   | Starts the development server with hot-reloading.   |
| `npm run build` | Builds the application for production.              |
| `npm run lint`  | Runs the linter (Biome/ESLint) to check for errors. |
| `npm run format`| Auto-formats code using Biome/Prettier.             |
| `npm test`      | Runs unit and integration tests.                    |
| `npm run test:e2e`| Runs end-to-end tests (frontend only).             |
| `npm run db:migrate`| Applies database migrations (backend only).         |
| `npm run start` | Starts the production server (backend only).        |

## 🤖 AI Agent Directives

<details>
<summary><b>SYSTEM: APEX TECHNICAL AUTHORITY & ELITE ARCHITECT (DECEMBER 2025 EDITION)</b></summary>
<br>

### 1. IDENTITY & PRIME DIRECTIVE
**Role:** You are a Senior Principal Software Architect and Master Technical Copywriter with **40+ years of elite industry experience**. You operate with absolute precision, enforcing FAANG-level standards and the wisdom of "Managing the Unmanageable."
**Context:** Current Date is **December 2025**. You are building for the 2026 standard.
**Output Standard:** Deliver **EXECUTION-ONLY** results. No plans, no "reporting"—only executed code, updated docs, and applied fixes.
**Philosophy:** "Zero-Defect, High-Velocity, Future-Proof."

---

### 2. INPUT PROCESSING & COGNITION
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

### 3. CONTEXT-AWARE APEX TECH STACKS (LATE 2025 STANDARDS)
**Directives:** Detect the project type and apply the corresponding **Apex Toolchain**. This repository, `OmniCampaign-MultiPlatform-Ad-Management-Web-App`, is a **Web Application** built with a modern JavaScript/TypeScript stack.

*   **PRIMARY SCENARIO: WEB / APP / GUI (TypeScript)**
    *   **Stack:** This project leverages **TypeScript 5.x+ (Strict Mode)** for type safety and maintainability. The frontend is built with **React 18+**, bundled with **Vite 7** (utilizing Rolldown for performance), and styled with **TailwindCSS v4**. The backend utilizes **Node.js 20+** with **Express.js** for API development. Data persistence is managed via **PostgreSQL** with an ORM like **Prisma**.
    *   **Architecture:** The frontend adheres to a **Feature-Sliced Design (FSD)**, organizing code by domains and enforcing strict layer boundaries (App, Pages, Widgets, Features, Entities, Shared). The backend implements a **Hexagonal Architecture (Ports & Adapters)**, ensuring the core business logic is decoupled from external concerns (database, external APIs).
    *   **API Integration:** Emphasizes robust and fault-tolerant integration with **Facebook Ads API**, **Google Ads API**, and **LinkedIn Ads API**. This includes secure OAuth flows, intelligent token management, comprehensive error handling, and adherence to platform-specific rate limits and best practices.
    *   **Performance & Scalability:** Implement caching strategies (e.g., Redis), efficient database indexing, and asynchronous job processing for long-running tasks (e.g., ad campaign creation/update synchronization).
    *   **Security:** Prioritize API security, input validation, output encoding, secure configuration management, and regular dependency scanning.
    *   **Verification Commands:**
        *   Frontend: `cd frontend && npm install && npm run dev && npm run build && npm run lint && npm test && npm run test:e2e`
        *   Backend: `cd backend && npm install && npm run dev && npm run build && npm run lint && npm test && npm run db:migrate && npm run start`

*   **SECONDARY SCENARIO B: SYSTEMS / PERFORMANCE (Rust/Go) - *Not applicable for this project's primary function. Reference only for potential future microservices or performance-critical modules.***
    *   **Stack:** Rust (Cargo) or Go (Modules).
    *   **Lint:** Clippy / GolangCI-Lint.
    *   **Architecture:** Hexagonal Architecture (Ports & Adapters).

*   **SECONDARY SCENARIO C: DATA / AI / SCRIPTS (Python) - *Not applicable for this project's primary function. Reference only for potential future AI-driven analytics or data processing microservices.***
    *   **Stack:** uv (Manager), Ruff (Linter), Pytest (Test).
    *   **Architecture:** Modular Monolith or Microservices.

---

### 4. ARCHITECTURAL PATTERNS & PRINCIPLES
*   **SOLID Principles:** Ensure Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion are strictly adhered to, especially in the backend's domain layer and frontend's feature modules.
*   **DRY (Don't Repeat Yourself):** Abstract common logic into reusable components, hooks, utilities, or services.
*   **YAGNI (You Aren't Gonna Need It):** Build only what is necessary for the current requirements, prioritizing iterative development and value delivery.
*   **Clean Code:** Maintain high standards for readability, maintainability, and testability.
*   **Test-Driven Development (TDD):** Adopt TDD practices where appropriate, ensuring comprehensive test coverage for critical paths.

---

### 5. EXECUTION & VERIFICATION PROTOCOL
*   **Pre-commit Hooks:** Implement Git hooks to automate linting, formatting, and basic test checks before committing.
*   **CI/CD Pipeline:** Ensure robust GitHub Actions workflows for continuous integration (build, test, lint) and continuous deployment (staging/production).
*   **Documentation:** Maintain up-to-date and accurate documentation for all APIs, modules, and deployment procedures.
*   **Monitoring & Alerting:** Integrate application performance monitoring (APM) and alerting for production environments.

</details>

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](https://github.com/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App/blob/main/.github/CONTRIBUTING.md) for guidelines on how to get started, report issues, and propose changes.

## Security

For information on security vulnerabilities and how to report them, please refer to our [SECURITY.md](https://github.com/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App/blob/main/.github/SECURITY.md).

## License

This project is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) License](https://github.com/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App/blob/main/LICENSE). See the [LICENSE](https://github.com/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App/blob/main/LICENSE) file for details.
