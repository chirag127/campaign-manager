# 🚀 MultiPlatform Campaign Manager Web App

Unified advertising campaign orchestration, monitoring, and optimization across all major digital advertising platforms from a single, cohesive React/Node.js interface.

<p align="center">
  <a href="https://github.com/chirag127/MultiPlatform-Campaign-Manager-Web-App">
    <img src="https://img.shields.io/badge/Star%20%E2%98%85%EF%B8%8F%20this%20Repo-blue?style=flat-square&logo=github" alt="Star this Repo" />
  </a>
  <img src="https://img.shields.io/github/workflow/status/chirag127/MultiPlatform-Campaign-Manager-Web-App/ci.yml?style=flat-square" alt="Build Status" />
  <img src="https://img.shields.io/codecov/c/github/chirag127/MultiPlatform-Campaign-Manager-Web-App?style=flat-square&token=xyz" alt="Code Coverage" />
  <img src="https://img.shields.io/badge/Language-TypeScript%20%7C%20Node.js-3178C6?style=flat-square" alt="Tech Stack" />
  <img src="https://img.shields.io/badge/Linter%20%7C%20Formatter-Biome-00C2FF?style=flat-square" alt="Lint/Format" />
  <img src="https://img.shields.io/badge/License-CC%20BY--NC%204.0-FF69B4?style=flat-square" alt="License" />
  <img src="https://img.shields.io/github/stars/chirag127/MultiPlatform-Campaign-Manager-Web-App?style=flat-square" alt="GitHub Stars" />
</p>

---

## 🎯 BLUF (Bottom Line Up Front)

This repository architects a modern, robust **Full-Stack Web Application** designed to centralize the creation, deployment, and performance analysis of advertising campaigns across diverse platforms like Facebook, Google, and LinkedIn. It strictly follows the **Feature-Sliced Design (FSD)** methodology on the frontend and utilizes a secure **Microservices Architecture** blueprint on the backend.

## 🏛️ Architecture Blueprint (Feature-Sliced Design Frontend)

The frontend adheres strictly to FSD principles for unparalleled scalability and maintainability, ensuring clear dependency boundaries between features, domains, and layers.

mermaid
graph TD
    subgraph Presentation Layer (UI/UX)
        P[Pages/Views]
    end

    subgraph Features Layer (Business Logic/Slicing)
        F1[Feature: CampaignCreation]
        F2[Feature: PerformanceDashboard]
        F3[Feature: PlatformIntegrations]
    end

    subgraph Entities Layer (Shared Data/State)
        E1[Domain: Campaigns]
        E2[Domain: AnalyticsData]
    end

    subgraph Shared Layer
        S1[Shared: UIComponents]
        S2[Shared: Utilities]
    end

    P --> F1 & F2 & F3
    F1 & F2 & F3 -- Depends On --> E1 & E2
    F1 & F2 & F3 -- Uses --> S1 & S2
    E1 & E2 -- Uses --> S2


## 📑 Table of Contents

1. [🚀 Project Overview](#-project-overview)
2. [🛠️ Apex Technology Stack (2026 Standard)](#-apex-technology-stack-2026-standard)
3. [🤖 AI Agent Directives (Critical Alignment)](#-ai-agent-directives-critical-alignment)
4. [⚙️ Development & Setup](#-development--setup)
5. [💡 Guiding Principles](#-guiding-principles)
6. [📄 License](#-license)

---

## 🚀 Project Overview

This system decouples platform management, offering an abstracted interface for advertisers to manage budget allocation, creative testing, and real-time KPI tracking without repeatedly logging into native ad consoles. The stack is optimized for **Zero-Defect, High-Velocity** deployment.

## 🛠️ Apex Technology Stack (2026 Standard)

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | **TypeScript 5.x (Strict)**, **Vite 7**, **TailwindCSS v4** | Type safety, build speed, and utility-first styling. |
| **State Mgmt** | **Signals (Standardized)** | Leveraging modern, performant reactive primitives over traditional Redux paradigms. |
| **Backend (API Gateway)** | **Node.js (Express/Fastify)** | High concurrency handling for async external API polling. |
| **Testing** | **Vitest (Unit)**, **Playwright (E2E)** | Comprehensive verification across all application layers. |
| **Architecture** | **Feature-Sliced Design (FSD)** | Enforces strict layering and separation of concerns in the frontend monolith. |

## 🤖 AI Agent Directives (Critical Alignment)

<details>
<summary>Click to view Mandatory Agent Configuration (Read AGENTS.md)</summary>

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
    *   **No Guessing:** Do not hallucinate APIs. Rely only on provided context or established public domain specifications.
    *   **Research First:** Use external tools (`linkup`/`brave`) to search for **December 2025 Industry Standards**, **Security Threats** (especially OAuth/API key handling), and **2026 UI Trends** (e.g., native container queries).
    *   **Validation:** Use internal validation routines (`docfork`) to verify *every* external API signature (e.g., Facebook Marketing API endpoints).
    *   **Reasoning:** Engage `clear-thought-two` to architect complex state synchronization flows *before* writing code.

---

## 3. CONTEXT-AWARE APEX TECH STACKS (LATE 2025 STANDARDS)
**Directives:** Detect the project type and apply the corresponding **Apex Toolchain**.

*   **PRIMARY SCENARIO: WEB / APP / GUI (Modern Frontend - This Project)**
    *   **Stack:** **TypeScript 5.x (Strict)**, **Vite 7**, **TailwindCSS v4**. This project is a **React/TS** application.
    *   **Lint/Test:** **Biome** (Speed/Format) + **Vitest** (Unit) + **Playwright** (E2E).
    *   **Architecture:** Strict adherence to **Feature-Sliced Design (FSD)**.
    *   **Security Mandate:** All external API credential handling **MUST** be proxied through a secure Node.js backend layer. **NEVER** expose platform OAuth tokens or secrets client-side. Secrets handling must use environment variables only, validated at startup.

## 4. STANDARDS OF EXECUTION

*   **SOLID Compliance:** Absolute adherence to Single Responsibility and Dependency Inversion.
*   **DRY Enforcement:** Aggressive reuse of shared UI primitives and domain types.
*   **Verification Command Structure:** 
    *   **Lint/Format Check:** `npx @biomejs/biome check --error-on-warnings .`
    *   **Unit Testing:** `npx vitest`
    *   **Full CI Simulation:** `npm run build && npm run test:e2e`

</details>

## ⚙️ Development & Setup

This project requires both frontend (TypeScript/React) and backend (Node.js) dependencies. We utilize `npm workspaces` or a singular root package.json for unified dependency management.

1.  **Prerequisites Check:** Ensure Node.js (>=20.0) and npm (>=10.0) are installed.
2.  **Repository Clone:**
    bash
    git clone https://github.com/chirag127/MultiPlatform-Campaign-Manager-Web-App.git
    cd MultiPlatform-Campaign-Manager-Web-App
    
3.  **Dependency Installation (Unified):**
    bash
    npm install
    
4.  **Environment Configuration:**
    Create a `.env` file in the root directory containing all necessary Platform API Keys and Secrets (e.g., `FACEBOOK_ACCESS_TOKEN`, `GOOGLE_API_KEY`). **These MUST NOT** be committed.

### Execution Scripts

| Script | Description | Layer |
| :--- | :--- | :--- |
| `npm run dev:fe` | Start frontend development server (Vite) | Frontend |
| `npm run dev:be` | Start backend API proxy server (Node.js) | Backend |
| `npm run build` | Compile production assets for both front and back ends | CI/Build |
| `npm run test:unit` | Run all Vitest unit tests | Testing |
| `npm run test:e2e` | Execute Playwright end-to-end scenarios | Testing |

## 💡 Guiding Principles

1.  **SOLID:** Mandatory adherence across all modules, especially in how platform adapters interact with the core state manager.
2.  **DRY:** Aggressive abstraction of repeated UI patterns using TailwindCSS variants and shared components.
3.  **YAGNI (You Ain't Gonna Need It):** Defer architectural complexity until required by a tested business need.

## 📄 License

This project is licensed under the **CC BY-NC 4.0 License**. See the [LICENSE](LICENSE) file for details. Commercial use without express written permission is prohibited.