--- 
name: OmniCampaign Pull Request
about: Propose a change to the OmniCampaign web application.
title: "[TYPE] Short Description of Change"
labels: 'PR: Review Required'
assignees: ''
---

## 🚀 Pull Request Checklist

Please ensure you've completed all relevant steps before submitting your PR. This helps us merge your changes faster and maintain high code quality.

- [ ] I have read and followed the [CONTRIBUTING.md](https://github.com/chirag127/OmniCampaign-AI-Powered-Multi-Platform-Ad-Manager-Web-App/blob/main/.github/CONTRIBUTING.md) guidelines.
- [ ] My code follows the project's established [code style](#code-style).
- [ ] I have performed a self-review of my own code.
- [ ] I have added **thorough** tests that prove my fix is effective or my feature works.
- [ ] New and existing unit/integration tests pass locally with my changes (`npm test`).
- [ ] Any UI changes have been tested across common browsers (Chrome, Firefox, Safari, Edge).
- [ ] I have updated the documentation where necessary (e.g., README.md, API docs, inline comments).
- [ ] My changes do not introduce new linting warnings or errors.
- [ ] I have checked for and resolved any merge conflicts.
- [ ] This PR does not introduce any breaking changes or deprecated features. (If it does, please explain in "Breaking Changes").
- [ ] For major features, I have considered the performance implications and potential security vulnerabilities.

---

## 🎯 What does this PR do?

Please provide a clear and concise description of the changes introduced by this pull request.
If this PR addresses an existing issue, please link it here: `Fixes #ISSUE_NUMBER` or `Resolves #ISSUE_NUMBER`.

---

## ✨ Type of Change

What type of change does your PR introduce? (Select all that apply)

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Refactoring (code improvement without changing external behavior)
- [ ] Documentation update (e.g., README, inline comments, JSDoc)
- [ ] Build/CI/CD update (e.g., GitHub Actions, Vite config)
- [ ] Chore (e.g., dependency updates, linting rules)

---

## 📸 Screenshots / Gifs (If applicable)

If your changes involve UI modifications, please include screenshots or animated GIFs demonstrating the changes.

---

## 🧪 How to Test This PR

Please describe the steps needed to test your changes. Include specific commands, user flows, or scenarios.

1.  Clone the repository: `git clone https://github.com/chirag127/OmniCampaign-AI-Powered-Multi-Platform-Ad-Manager-Web-App.git`
2.  Navigate to the project directory: `cd OmniCampaign-AI-Powered-Multi-Platform-Ad-Manager-Web-App`
3.  Install dependencies: `npm install`
4.  Start the development server: `npm run dev`
5.  Open your browser to `http://localhost:5173` (or whatever `npm run dev` outputs).
6.  **[ADD SPECIFIC TESTING STEPS HERE]**
    *   Example: Log in with credentials `user/pass`.
    *   Example: Navigate to "Campaigns" tab.
    *   Example: Create a new campaign with these settings...

---

## 💻 Code Style

This project adheres to strict code quality standards enforced by **Biome**.
Please ensure your code is formatted and linted correctly.

To check and fix formatting:
bash
npx biome format --write .
npx biome lint --apply-unsafe .


---

## 📝 Reviewer Notes

Any specific areas or concerns you'd like the reviewer to pay extra attention to?
For example: "Please review the `src/components/CampaignAnalytics.jsx` file for performance implications."

---

## 🔒 Security Considerations

If your changes involve security-sensitive areas (e.g., authentication, data handling, API calls), please describe any security considerations addressed or new ones introduced.

---

## 📄 License

By submitting this pull request, you agree to license your contributions under the [CC BY-NC 4.0 License](https://github.com/chirag127/OmniCampaign-AI-Powered-Multi-Platform-Ad-Manager-Web-App/blob/main/LICENSE).
