# Contributing to OmniCampaign-AI-Powered-Multi-Platform-Ad-Manager-Web-App

Welcome! We are thrilled you're considering contributing to **OmniCampaign-AI-Powered-Multi-Platform-Ad-Manager-Web-App**—a cutting-edge platform designed to revolutionize multi-platform ad campaign management with AI-driven insights. Your contributions are invaluable to achieving our vision of a unified, intelligent advertising ecosystem.

This document outlines our guidelines for contributing to ensure a smooth and efficient collaboration process. Thank you for making OmniCampaign better!

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Contributing Code](#contributing-code)
  - [Improving Documentation](#improving-documentation)
- [Development Setup](#development-setup)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
  - [Running Tests](#running-tests)
  - [Linting & Formatting](#linting--formatting)
- [Branching Strategy](#branching-strategy)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Security Vulnerabilities](#security-vulnerabilities)
- [License](#license)

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](https://github.com/chirag127/OmniCampaign-AI-Powered-Multi-Platform-Ad-Manager-Web-App/blob/main/CODE_OF_CONDUCT.md). Please read it carefully before engaging in any activities.

## How Can I Contribute?

### Reporting Bugs

Found a bug? Help us squash it!

1.  Before submitting, please search [existing issues](https://github.com/chirag127/OmniCampaign-AI-Powered-Multi-Platform-Ad-Manager-Web-App/issues) to see if the bug has already been reported.
2.  If not, open a new bug report using our dedicated [bug report template](https://github.com/chirag127/OmniCampaign-AI-Powered-Multi-Platform-Ad-Manager-Web-App/issues/new?assignees=&labels=bug&projects=&template=bug_report.md&title=).
3.  Provide a clear and concise description of the bug, steps to reproduce it, expected behavior, and actual behavior. Include screenshots or error messages if possible.

### Suggesting Enhancements

Have an idea for a new feature or an improvement? We'd love to hear it!

1.  Check [existing issues](https://github.com/chirag127/OmniCampaign-AI-Powered-Multi-Platform-Ad-Manager-Web-App/issues) to ensure your suggestion hasn't been made.
2.  Open a new issue, clearly outlining the proposed enhancement, its potential benefits, and any relevant use cases.

### Contributing Code

We welcome code contributions! Please follow the [Development Setup](#development-setup) and [Pull Request Guidelines](#pull-request-guidelines).

### Improving Documentation

Clear and comprehensive documentation is crucial. If you find any areas that can be improved, please submit a pull request with your suggested changes.

## Development Setup

To get OmniCampaign up and running on your local machine, follow these steps:

### Prerequisites

Ensure you have the following installed:

*   **Node.js**: `v18.x` or higher
*   **npm** (Node Package Manager) or **Yarn/pnpm**: npm `v9.x` or higher
*   **Git**: Latest stable version

### Getting Started

1.  **Clone the repository:**
    bash
    git clone https://github.com/chirag127/OmniCampaign-AI-Powered-Multi-Platform-Ad-Manager-Web-App.git
    cd OmniCampaign-AI-Powered-Multi-Platform-Ad-Manager-Web-App
    

2.  **Install dependencies:**
    bash
    npm install
    

3.  **Run the development server:**
    bash
    npm run dev
    
    The application should now be accessible at `http://localhost:5173` (or similar).

### Running Tests

OmniCampaign employs a robust testing suite for quality assurance.

*   **Unit & Integration Tests (Vitest):**
    bash
    npm test
    # or for watch mode
    npm run test:watch
    

*   **End-to-End Tests (Playwright):**
    bash
    npm run test:e2e
    # To open Playwright UI for debugging:
    npm run test:e2e:ui
    

### Linting & Formatting

We use **Biome** for fast and efficient linting and formatting, ensuring code consistency across the project.

*   **Check for linting errors and formatting issues:**
    bash
    npm run lint
    

*   **Automatically fix linting and formatting issues:**
    bash
    npm run format
    

## Branching Strategy

We follow a `main` and `develop` branching strategy, along with feature/bugfix branches:

*   **`main`**: Represents the latest stable, production-ready release.
*   **`develop`**: Integrates new features and bug fixes, serving as the staging branch for the next release.
*   **`feature/<feature-name>`**: For new features or significant enhancements. Branch off `develop`.
*   **`bugfix/<bug-description>`**: For critical bug fixes. Branch off `main` if hotfix, or `develop` otherwise.

## Commit Guidelines

We adhere to the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification for clear and standardized commit messages. This helps with automatic changelog generation and semantic versioning.

Examples:

*   `feat: Implement AI-powered campaign optimization module`
*   `fix: Correct ad platform API authentication bug`
*   `docs: Update README with new setup instructions`
*   `chore: Upgrade Vite to v5`
*   `refactor: Restructure Redux store for campaign data`

## Pull Request Guidelines

When you're ready to submit your changes, please follow these guidelines:

1.  **Fork the repository** and create your feature or bugfix branch from `develop` (or `main` for hotfixes).
2.  **Ensure your code adheres to our coding standards.** Run `npm run format` and `npm run lint` before committing.
3.  **Write clear, concise, and descriptive commit messages** following the Conventional Commits specification.
4.  **Ensure all tests pass** (`npm test` and `npm run test:e2e`). Add new tests for new features or bug fixes.
5.  **Update documentation** (README, comments, etc.) where appropriate.
6.  **Open a Pull Request** against the `develop` branch of the main repository.
    *   Provide a clear title following Conventional Commits (e.g., `feat: Add Google Ads integration`).
    *   Describe the purpose of your PR, the changes made, and any related issues (e.g., `Closes #123`).
    *   Include screenshots or GIFs for UI changes.
7.  **Address review comments promptly.** Your PR will be reviewed by maintainers.

## Security Vulnerabilities

If you discover a security vulnerability within OmniCampaign, please refer to our [Security Policy](https://github.com/chirag127/OmniCampaign-AI-Powered-Multi-Platform-Ad-Manager-Web-App/blob/main/.github/SECURITY.md) for instructions on how to report it responsibly. Do not open a public issue.

## License

By contributing to OmniCampaign, you agree that your contributions will be licensed under its [CC BY-NC 4.0 License](https://github.com/chirag127/OmniCampaign-AI-Powered-Multi-Platform-Ad-Manager-Web-App/blob/main/LICENSE).
