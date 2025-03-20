// API configuration
export const API_URL = "http://localhost:5000";

// Platform configuration
export const PLATFORMS = [
    {
        id: "FACEBOOK",
        name: "Facebook",
        icon: "facebook",
        color: "#1877F2",
        authUrl: "https://www.facebook.com/v18.0/dialog/oauth",
    },
    {
        id: "INSTAGRAM",
        name: "Instagram",
        icon: "instagram",
        color: "#E1306C",
        authUrl: "https://www.facebook.com/v18.0/dialog/oauth", // Instagram uses Facebook's auth
    },
    {
        id: "GOOGLE",
        name: "Google",
        icon: "google",
        color: "#4285F4",
        authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    },
    {
        id: "YOUTUBE",
        name: "YouTube",
        icon: "youtube",
        color: "#FF0000",
        authUrl: "https://accounts.google.com/o/oauth2/v2/auth", // YouTube uses Google's auth
    },
    {
        id: "LINKEDIN",
        name: "LinkedIn",
        icon: "linkedin",
        color: "#0A66C2",
        authUrl: "https://www.linkedin.com/oauth/v2/authorization",
    },
    {
        id: "TWITTER",
        name: "Twitter (X)",
        icon: "twitter",
        color: "#000000",
        authUrl: "https://twitter.com/i/oauth2/authorize",
    },
    {
        id: "SNAPCHAT",
        name: "Snapchat",
        icon: "snapchat",
        color: "#FFFC00",
        authUrl: "https://accounts.snapchat.com/login/oauth2/authorize",
    },
];

// Campaign objectives
export const CAMPAIGN_OBJECTIVES = [
    { value: "BRAND_AWARENESS", label: "Brand Awareness" },
    { value: "REACH", label: "Reach" },
    { value: "TRAFFIC", label: "Traffic" },
    { value: "ENGAGEMENT", label: "Engagement" },
    { value: "APP_INSTALLS", label: "App Installs" },
    { value: "VIDEO_VIEWS", label: "Video Views" },
    { value: "LEAD_GENERATION", label: "Lead Generation" },
    { value: "CONVERSIONS", label: "Conversions" },
    { value: "CATALOG_SALES", label: "Catalog Sales" },
    { value: "STORE_TRAFFIC", label: "Store Traffic" },
];

// Campaign statuses
export const CAMPAIGN_STATUSES = [
    { value: "DRAFT", label: "Draft" },
    { value: "ACTIVE", label: "Active" },
    { value: "PAUSED", label: "Paused" },
    { value: "COMPLETED", label: "Completed" },
    { value: "ARCHIVED", label: "Archived" },
];

// Lead statuses
export const LEAD_STATUSES = [
    { value: "NEW", label: "New" },
    { value: "CONTACTED", label: "Contacted" },
    { value: "QUALIFIED", label: "Qualified" },
    { value: "CONVERTED", label: "Converted" },
    { value: "DISQUALIFIED", label: "Disqualified" },
];
