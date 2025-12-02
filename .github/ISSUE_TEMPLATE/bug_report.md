---
name: Bug Report
abel: Report a Defect
about: Submit a bug report to help us improve the MultiPlatform Campaign Manager Web App.

permissions:
  contents: read
  issues: write

labels:
  - bug
  - triage

body:
  - type: input
    id: title
    attributes:
      label: "Concise Summary"
      description: "A short, descriptive title summarizing the issue."
      placeholder: "E.g., Campaign creation fails when linking Google Ads via OAuth"
    validations:
      required: true

  - type: textarea
    id: description
    attributes:
      label: "Detailed Description"
      description: "Provide a clear and comprehensive description of what the bug is."
      placeholder: |
        Describe the bug in detail. What were you expecting to happen versus what actually happened?
        \n        **Context:** This application adheres to the APEX architecture standards, so please be precise regarding the layer where the failure occurs (Frontend, API Gateway, Backend Service, or External Integration).
    validations:
      required: true

  - type: textarea
    id: steps-to-reproduce
    attributes:
      label: "Steps to Reproduce"
      description: "List the exact steps required to trigger the bug."
      placeholder: |
        1. Navigate to `/campaigns/new`
        2. Select 'Facebook' as the platform.
        3. Enter Campaign Name: 'Test-Bug-123'
        4. Click 'Save and Publish'.
        5. Observe error.
    validations:
      required: true

  - type: input
    id: expected-behavior
    attributes:
      label: "Expected Behavior"
      description: "What did you expect to happen? (Reference Apex Principles if applicable, e.g., DRY violation, SOLID principle breakage)."
    validations:
      required: true

  - type: input
    id: actual-behavior
    attributes:
      label: "Actual Behavior"
      description: "What happened instead? (Include error codes or specific failure messages)."
    validations:
      required: true

  - type: checkboxes
    id: environment-details
    attributes:
      label: "Environment Details"
      description: "Check all that apply to help isolate the issue."
      options:
        - label: "Local Development Environment"
        - label: "Staging/QA Environment"
        - label: "Production Environment"
        - label: "Issue Reproducible on Multiple Platforms (Browser/OS)"
        - label: "Associated with a specific Marketing Platform Integration (e.g., Google, Facebook)"

  - type: dropdown
    id: severity
    attributes:
      label: "Severity Level"
      description: "How critical is this bug to core functionality?"
      options:
        - value: "critical"
          label: "Critical (System Down / Data Loss / Core Feature Blocked)"
        - value: "major"
          label: "Major (Significant Feature Impaired)"
        - value: "minor"
          label: "Minor (UI Glitch / Non-critical text error)"
        - value: "tweak"
          label: "Tweak (Suggestion/Cosmetic)"
      default: 2

  - type: textarea
    id: logs-and-screenshots
    attributes:
      label: "Logs, Screenshots, or Videos"
      description: "Attach any relevant console logs, network traces, or visual evidence here."
      placeholder: "Paste relevant JSON payloads or error stack traces from the console or server logs."

  - type: markdown
    id: agent-context
    attributes:
      value: | 
        ### 🤖 APEX Verification Context
        This report will be cross-referenced against the system's established architecture and security protocols defined in `AGENTS.md`. Please ensure the steps provided allow for immediate verification using the standard CI verification commands (see repository root).
        
        **Project:** `MultiPlatform-Campaign-Manager-Web-App`
        **Platform Stack:** React/TypeScript Frontend, Node.js Backend (Inferred from original context/APEX pivot standardization).
        
        **Verification Repository Reference:** https://github.com/chirag127/MultiPlatform-Campaign-Manager-Web-App
---
