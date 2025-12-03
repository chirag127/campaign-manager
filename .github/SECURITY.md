# Security Policy for OmniCampaign

At OmniCampaign-AI-Powered-Multi-Platform-Ad-Manager-Web-App, we are committed to ensuring the security and integrity of our application and the data entrusted to us. We appreciate the efforts of security researchers and the community in helping us maintain a robust and secure platform. This document outlines our security policy, including how to report vulnerabilities and what to expect in response.

## Reporting a Vulnerability

We kindly request that you report any potential security vulnerabilities directly to us, allowing us to address them responsibly before public disclosure. This enables us to protect our users and maintain the stability of OmniCampaign.

**Please report vulnerabilities by emailing us at:**
[security@chirag127.com](mailto:security@chirag127.com)

**When reporting, please include as much detail as possible to help us quickly understand and reproduce the issue:**

*   **Clear Description:** A brief but comprehensive overview of the vulnerability.
*   **Steps to Reproduce:** Detailed steps that allow us to replicate the vulnerability. Include URLs, configurations, and any necessary preconditions.
*   **Impact:** Describe the potential impact of the vulnerability (e.g., data breach, unauthorized access, service disruption).
*   **Affected Components:** Specify which parts of the application or APIs are affected.
*   **Environment Details:** Information about your browser, operating system, and any relevant network conditions.
*   **Proof of Concept (Optional but Recommended):** Any code, screenshots, or videos demonstrating the vulnerability.

**PGP Key:** If you prefer to encrypt your report, please request our PGP key via the same email address.

## Our Commitment and Response Times

We are dedicated to addressing all security reports with the utmost urgency and professionalism. Upon receiving a vulnerability report, you can expect the following:

*   **Acknowledgement:** We will acknowledge receipt of your report within **24-48 business hours**.
*   **Assessment:** Our security team will investigate and validate the reported vulnerability.
*   **Communication:** We will keep you informed of our progress, including initial assessment, status updates, and estimated timelines for a fix.
*   **Resolution:** Once a fix is deployed, we will inform you and, with your permission, acknowledge your contribution (if desired) in our security advisories.

## Responsible Disclosure Guidelines

We ask that security researchers adhere to the following guidelines for responsible disclosure:

*   **Do Not Publicly Disclose:** Please do not disclose any vulnerability publicly (e.g., on social media, blogs, forums) until we have had sufficient time to investigate, fix, and deploy a resolution.
*   **Respect Privacy:** Do not access, modify, or delete data belonging to other users without explicit permission.
*   **Avoid Disruptive Testing:** Do not engage in activities that could disrupt our services, such as Denial-of-Service (DoS) attacks, spamming, or excessive automated testing.
*   **Stay Within Scope:** Focus on security vulnerabilities and avoid reporting non-critical issues (e.g., UI bugs, broken links) through this channel.

## Security Best Practices for OmniCampaign Developers and Contributors

Given OmniCampaign is a web application integrating AI and multiple advertising APIs, contributors must adhere to stringent security practices:

1.  **Input Validation and Sanitization:** All user inputs and data from external APIs (e.g., Facebook, Google Ads) must be rigorously validated and sanitized on both client-side (TypeScript, React) and server-side to prevent XSS, SQL injection, prompt injection (for AI), and other common attacks.
2.  **Authentication and Authorization:** Implement robust authentication mechanisms (e.g., OAuth2, JWT with strict expiry) and granular authorization checks for all API endpoints and data access. Ensure secure handling and storage of API keys and access tokens.
3.  **Dependency Management:** Regularly update all project dependencies (e.g., Node.js packages, AI libraries) and monitor for known vulnerabilities using tools like `npm audit` or `Biome`'s security features. Integrate dependency scanning into the CI/CD pipeline.
4.  **Secure Configuration:** Avoid hardcoding sensitive information. Use environment variables or secure configuration management systems. Ensure default configurations are secure.
5.  **Error Handling and Logging:** Implement comprehensive error handling that avoids exposing sensitive system information in error messages. Log security-relevant events, but filter out personally identifiable information (PII) or secrets.
6.  **Client-Side Security:** Employ Content Security Policies (CSP), HTTP Strict Transport Security (HSTS), and secure cookie attributes (HttpOnly, Secure, SameSite) to mitigate client-side attacks like XSS and CSRF.
7.  **AI Security and Data Privacy:**
    *   **Prompt Injection:** Design AI interactions to minimize prompt injection risks, particularly when user input is used in AI queries.
    *   **Data Minimization:** Only send necessary data to AI APIs. Never send sensitive user data unless absolutely required and anonymized/encrypted.
    *   **Model Integrity:** Ensure the AI models used are from trusted sources and monitor for unexpected outputs or behaviors that could indicate model manipulation.
8.  **API Security:** All interactions with external advertising APIs must use encrypted channels (HTTPS), validate API responses, and handle API rate limits and errors gracefully.
9.  **Code Review:** All code changes must undergo thorough peer review, with a strong focus on potential security implications, before merging.

## Security Advisories

For a list of past security advisories related to OmniCampaign, please refer to our GitHub Security Advisories page:
[https://github.com/chirag127/OmniCampaign-AI-Powered-Multi-Platform-Ad-Manager-Web-App/security/advisories](https://github.com/chirag127/OmniCampaign-AI-Powered-Multi-Platform-Ad-Manager-Web-App/security/advisories)
