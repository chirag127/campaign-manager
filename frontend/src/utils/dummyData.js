/**
 * Utility functions for generating dummy data for the app
 */

import { PLATFORMS } from "../config";

/**
 * Generate a random date within the last 30 days
 * @returns {Date} A random date
 */
const getRandomRecentDate = () => {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 30);
    now.setDate(now.getDate() - daysAgo);
    return now;
};

/**
 * Generate random metrics for a platform
 * @returns {Object} Random metrics
 */
const generateRandomMetrics = () => {
    const impressions = Math.floor(Math.random() * 10000) + 1000;
    const clicks = Math.floor(impressions * (Math.random() * 0.1));
    const conversions = Math.floor(clicks * (Math.random() * 0.2));
    const spend = Math.floor(Math.random() * 1000) + 100;

    return {
        impressions,
        clicks,
        conversions,
        spend,
        ctr: (clicks / impressions) * 100,
        cpc: spend / clicks,
        cpm: (spend / impressions) * 1000,
    };
};

/**
 * Generate a random platform for a campaign
 * @returns {Object} A random platform object
 */
const generateRandomPlatform = () => {
    const platformKeys = Object.keys(PLATFORMS);
    const randomPlatform =
        PLATFORMS[
            platformKeys[Math.floor(Math.random() * platformKeys.length)]
        ];

    return {
        platform: randomPlatform.id,
        platformCampaignId: `sample-${Math.random()
            .toString(36)
            .substring(2, 10)}`,
        status: ["ACTIVE", "PAUSED"][Math.floor(Math.random() * 2)],
        budget: Math.floor(Math.random() * 500) + 100,
        metrics: generateRandomMetrics(),
        lastSynced: getRandomRecentDate(),
    };
};

/**
 * Generate dummy campaign data
 * @param {number} count Number of dummy campaigns to generate
 * @returns {Array} Array of dummy campaign objects
 */
export const generateDummyCampaigns = (count = 3) => {
    const campaigns = [];
    const objectives = [
        "BRAND_AWARENESS",
        "REACH",
        "TRAFFIC",
        "ENGAGEMENT",
        "APP_INSTALLS",
        "VIDEO_VIEWS",
        "LEAD_GENERATION",
        "CONVERSIONS",
    ];
    const statuses = ["DRAFT", "ACTIVE", "PAUSED"];

    for (let i = 0; i < count; i++) {
        const platformCount = Math.floor(Math.random() * 3) + 1;
        const platforms = [];

        for (let j = 0; j < platformCount; j++) {
            platforms.push(generateRandomPlatform());
        }

        campaigns.push({
            _id: `sample-campaign-${i}`,
            name: `Sample Campaign ${i + 1}`,
            description:
                "This is a sample campaign to demonstrate the UI. It's not a real campaign.",
            objective:
                objectives[Math.floor(Math.random() * objectives.length)],
            budget: {
                daily: Math.floor(Math.random() * 100) + 20,
                lifetime: Math.floor(Math.random() * 1000) + 500,
                currency: "USD",
            },
            startDate: getRandomRecentDate(),
            endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
            status: statuses[Math.floor(Math.random() * statuses.length)],
            platforms,
            createdAt: getRandomRecentDate(),
            updatedAt: new Date(),
            isDummy: true, // Flag to identify dummy data
        });
    }

    return campaigns;
};

/**
 * Generate dummy lead data
 * @param {number} count Number of dummy leads to generate
 * @param {string} campaignId Optional campaign ID to associate with leads
 * @returns {Array} Array of dummy lead objects
 */
export const generateDummyLeads = (count = 5, campaignId = null) => {
    const leads = [];
    const firstNames = [
        "John",
        "Jane",
        "Michael",
        "Emily",
        "David",
        "Sarah",
        "Robert",
        "Lisa",
        "William",
        "Jessica",
    ];
    const lastNames = [
        "Smith",
        "Johnson",
        "Williams",
        "Brown",
        "Jones",
        "Miller",
        "Davis",
        "Garcia",
        "Rodriguez",
        "Wilson",
    ];
    const statuses = [
        "NEW",
        "CONTACTED",
        "QUALIFIED",
        "CONVERTED",
        "DISQUALIFIED",
    ];
    const platformKeys = Object.keys(PLATFORMS);

    for (let i = 0; i < count; i++) {
        const firstName =
            firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName =
            lastNames[Math.floor(Math.random() * lastNames.length)];
        const randomPlatform =
            PLATFORMS[
                platformKeys[Math.floor(Math.random() * platformKeys.length)]
            ];

        leads.push({
            _id: `sample-lead-${i}`,
            firstName,
            lastName,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
            phone: `+1${Math.floor(Math.random() * 900) + 100}${
                Math.floor(Math.random() * 900) + 100
            }${Math.floor(Math.random() * 9000) + 1000}`,
            source: {
                platform: randomPlatform.id,
                campaignId:
                    campaignId ||
                    `sample-campaign-${Math.floor(Math.random() * 3)}`,
                adId: `sample-ad-${Math.random()
                    .toString(36)
                    .substring(2, 10)}`,
            },
            campaign:
                campaignId ||
                `sample-campaign-${Math.floor(Math.random() * 3)}`,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            additionalInfo: {
                interest: [
                    "Marketing",
                    "Technology",
                    "Finance",
                    "Healthcare",
                    "Education",
                ][Math.floor(Math.random() * 5)],
                source: [
                    "Website",
                    "Social Media",
                    "Referral",
                    "Search",
                    "Advertisement",
                ][Math.floor(Math.random() * 5)],
            },
            createdAt: getRandomRecentDate(),
            updatedAt: new Date(),
            isDummy: true, // Flag to identify dummy data
        });
    }

    return leads;
};
