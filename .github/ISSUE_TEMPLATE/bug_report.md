---
name: Bug Report
about: Report a bug in the OmniCampaign system.
title: "BUG: [Concise description of the bug]"
labels: bug
assignees: "chirag127"

body:
  - type: markdown
    attributes:
      value: |3-line
        # Bug Report for OmniCampaign-MultiPlatform-Ad-Management-Web-App

        Please provide a clear and detailed description of the bug you encountered. Ensure all relevant information is included to help us diagnose and resolve the issue efficiently.

        **Repository:** `https://github.com/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App`

---1-

  - type: input
    id: environment
    attributes:
      label: Environment Details
      description: Please specify the operating system, browser (including version), and Node.js version you are using.
      placeholder: "e.g., macOS 13.6, Chrome 119.0.6045.159, Node.js 18.18.0"
    validations:
      required: true

  - type: input
    id: steps_to_reproduce
    attributes:
      label: Steps to Reproduce
      description: Provide a clear, step-by-step sequence of actions that will lead to the bug.
      placeholder: "1. Log in to the application.
2. Navigate to the 'Campaigns' section.
3. Click 'Create New Campaign' ..."
    validations:
      required: true

  - type: textarea
    id: expected_behavior
    attributes:
      label: Expected Behavior
      description: What did you expect to happen?
      placeholder: "e.g., The campaign should be saved and appear in the list."
    validations:
      required: true

  - type: textarea
    id: actual_behavior
    attributes:
      label: Actual Behavior
      description: What actually happened? Please be specific.
      placeholder: "e.g., An error message appeared, and the campaign was not saved."
    validations:
      required: true

  - type: textarea
    id: additional_context
    attributes:
      label: Additional Context
      description: Any other relevant information, such as screenshots, logs, or context about the campaign setup.
      placeholder: "(Optional) You can paste screenshots here or describe related campaign settings."
    validations:
      required: false

---

## AI Agent Directives Compliance Check

This report is being filed against the **OmniCampaign-MultiPlatform-Ad-Management-Web-App** (`https://github.com/chirag127/OmniCampaign-MultiPlatform-Ad-Management-Web-App`).

By reporting this bug, you are helping to maintain the high standards of the Apex Technical Authority. Please ensure your report is clear and actionable, enabling our AI agents to identify and fix the issue promptly according to the following principles:

*   **Tech Stack:** TypeScript, React, TailwindCSS v4, Node.js, Vite.
*   **Architecture:** Feature-Sliced Design (FSD) for Frontend, likely Modular Monolith or Microservices for Backend.
*   **Linting/Formatting:** Biome.
*   **Testing:** Vitest (Unit), Playwright (E2E).
*   **Principles:** SOLID, DRY, YAGNI.

Your detailed input is crucial for our Zero-Defect, High-Velocity, Future-Proof development cycle.
