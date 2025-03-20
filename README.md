# Campaign Manager App

A comprehensive campaign management application that allows users to create and manage advertising campaigns across multiple platforms (Facebook, Google, YouTube, LinkedIn, Instagram, Snapchat, Twitter) from a single interface.

## Features

-   **Unified Campaign Management**: Create campaigns once and deploy them across multiple platforms
-   **Centralized Lead Management**: View and manage leads from all platforms in one place
-   **Platform Integration**: Connect to major advertising platforms via their APIs
-   **Campaign Analytics**: Track performance metrics across all platforms
-   **User Authentication**: Secure login and registration system

## Tech Stack

### Backend

-   **Express.js**: Web server framework
-   **MongoDB**: NoSQL database for storing campaign data, leads, and user information
-   **Mongoose**: MongoDB object modeling
-   **JWT**: Authentication using JSON Web Tokens
-   **Axios**: HTTP client for API requests to ad platforms

### Frontend

-   **React Native**: Cross-platform mobile app development
-   **Expo**: Toolchain for React Native development
-   **React Navigation**: Navigation library for React Native
-   **React Native Paper**: Material Design components
-   **Axios**: HTTP client for API requests
-   **AsyncStorage**: Local storage for persisting authentication state
-   **React Native Chart Kit**: Data visualization

## API Integrations

The app integrates with the following advertising platform APIs:

1. **Facebook Marketing API**: For Facebook and Instagram ads
2. **Google Ads API**: For Google search and display ads
3. **YouTube Ads API**: For YouTube video ads
4. **LinkedIn Marketing API**: For LinkedIn ads
5. **Twitter (X) Ads API**: For Twitter ads
6. **Snapchat Marketing API**: For Snapchat ads

## Project Structure

```
campaign-manager-app/
├── backend/                 # Express.js server
│   ├── config/              # Configuration files
│   ├── controllers/         # API controllers
│   ├── middleware/          # Custom middleware
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── services/            # Platform API integrations
│   └── server.js            # Main server file
│
├── frontend/                # React Native with Expo
│   ├── assets/              # Images and other static assets
│   ├── src/
│   │   ├── api/             # API service files
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Context providers
│   │   ├── navigation/      # Navigation configuration
│   │   ├── screens/         # App screens
│   │   └── utils/           # Utility functions
│   ├── App.js               # Main app component
│   └── app.json             # Expo configuration
│
└── README.md                # Project documentation
```

## Getting Started

### Prerequisites

-   Node.js (v14 or higher)
-   MongoDB
-   Expo CLI

### Installation

1. Clone the repository

    ```
    git clone https://github.com/yourusername/campaign-manager-app.git
    cd campaign-manager-app
    ```

2. Install backend dependencies

    ```
    cd backend
    npm install
    ```

3. Install frontend dependencies

    ```
    cd ../frontend
    npm install
    ```

4. Create a `.env` file in the backend directory with the following variables:

    ```
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/campaign-manager
    JWT_SECRET=your_jwt_secret_key
    JWT_EXPIRE=30d

    # Add your API keys for each platform
    FACEBOOK_APP_ID=your_facebook_app_id
    FACEBOOK_APP_SECRET=your_facebook_app_secret
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    LINKEDIN_CLIENT_ID=your_linkedin_client_id
    LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
    TWITTER_API_KEY=your_twitter_api_key
    TWITTER_API_SECRET=your_twitter_api_secret
    SNAPCHAT_CLIENT_ID=your_snapchat_client_id
    SNAPCHAT_CLIENT_SECRET=your_snapchat_client_secret
    ```

### Running the App

1. Start the backend server

    ```
    cd backend
    npm run dev
    ```

2. Start the frontend app

    ```
    cd frontend
    npm start
    ```

3. Use the Expo Go app on your mobile device to scan the QR code, or run in an emulator

## API Documentation

The backend provides the following API endpoints:

### Authentication

-   `POST /api/auth/register` - Register a new user
-   `POST /api/auth/login` - Login a user
-   `GET /api/auth/me` - Get current user profile
-   `GET /api/auth/logout` - Logout a user

### Campaigns

-   `GET /api/campaigns` - Get all campaigns for the user
-   `GET /api/campaigns/:id` - Get a specific campaign
-   `POST /api/campaigns` - Create a new campaign
-   `PUT /api/campaigns/:id` - Update a campaign
-   `DELETE /api/campaigns/:id` - Delete a campaign
-   `GET /api/campaigns/:id/sync` - Sync campaign metrics from platforms
-   `GET /api/campaigns/:campaignId/sync-leads` - Sync leads from platforms for a campaign

### Leads

-   `GET /api/leads` - Get all leads for the user
-   `GET /api/leads/:id` - Get a specific lead
-   `POST /api/leads` - Create a new lead
-   `PUT /api/leads/:id` - Update a lead
-   `DELETE /api/leads/:id` - Delete a lead

### Platforms

-   `GET /api/platforms` - Get all available platforms
-   `GET /api/platforms/:id` - Get a specific platform
-   `POST /api/platforms/:platform/connect` - Connect user to a platform
-   `POST /api/platforms/:platform/disconnect` - Disconnect user from a platform
-   `GET /api/platforms/connected` - Get user's connected platforms

## License

This project is licensed under the MIT License.

## Acknowledgements

-   [Facebook Marketing API](https://developers.facebook.com/docs/marketing-apis/)
-   [Google Ads API](https://developers.google.com/google-ads/api/docs/start)
-   [LinkedIn Marketing API](https://developer.linkedin.com/product-catalog/marketing/advertising-api)
-   [Twitter Ads API](https://developer.x.com/en/docs/x-ads-api)
-   [Snapchat Marketing API](https://developers.snap.com/api/marketing-api/Ads-API/introduction)
