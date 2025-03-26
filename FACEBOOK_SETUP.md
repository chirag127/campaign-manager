# Facebook Integration Setup Guide

This guide will help you set up Facebook integration for the Campaign Manager application.

## Prerequisites

1. A Facebook Developer account
2. A Facebook App with the Marketing API enabled

## Step 1: Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click on "My Apps" and then "Create App"
3. Select "Business" as the app type
4. Fill in the required information and create the app

## Step 2: Configure the App

1. In your app dashboard, go to "Settings" > "Basic"
2. Note your App ID and App Secret
3. Add a platform by clicking "Add Platform" and select "Website"
4. Enter your website URL: `https://campaign-manager1271.netlify.app`
5. Save changes

## Step 3: Configure OAuth Settings

1. Go to "Facebook Login" > "Settings"
2. Add the following OAuth Redirect URI:
   ```
   https://campaign-manager1271.netlify.app/platforms
   ```
3. Make sure "Client OAuth Login" is enabled
4. Save changes

## Step 4: Enable Marketing API

1. Go to "Add Products" and add "Marketing API"
2. Follow the setup instructions

EAAHSTlIC3BYBO2OfuG5Wn5jws7Tlrb0FRTLeMKJUzPfvxOW1OLSSkZBePf2gqOMuZANkUL69PxKfZBucSZASi3dEDii8gDPROj4ovmrAaGoUgZBDVJp5j0sUqZBFRL2hj6m28FGQUTytFdwtwieYnZAbUlTFb5N0LJx7nZBIQEZA8MZBhZAMmNNmGCW6AHSi6ZCXrRjKkF0pfbF2

## Step 5: Configure Your Backend

1. Update your `.env` file in the backend directory with the following variables:
   ```
   FACEBOOK_APP_ID=your_facebook_app_id
   FACEBOOK_APP_SECRET=your_facebook_app_secret
   ```

   **Important**: The `FACEBOOK_APP_ID` must match the one used in the frontend code (`512708801911830`). If you're using a different App ID, you'll need to update it in the `PlatformScreen.js` file.

## Step 6: Configure Your Frontend

If you're using a different Facebook App ID than what's in the code, update the following in `frontend/src/screens/platforms/PlatformScreen.js`:

```javascript
// Find this section in the handleConnect function
case "FACEBOOK":
case "INSTAGRAM":
    // Store the Facebook App ID for easier maintenance
    const facebookAppId = "512708801911830"; // Replace with your App ID
    const facebookConfigId = "1629488587771756"; // Replace if needed

    authUrl += `?client_id=${facebookAppId}&redirect_uri=${encodeURIComponent(
        redirectUri
    )}&state=${state}&scope=ads_management,ads_read&config_id=${facebookConfigId}&response_type=code`;
```

## Troubleshooting

### Connection Error: Failed to connect to FACEBOOK

This error typically occurs when:

1. The Facebook App ID or Secret is missing or incorrect in your backend `.env` file
2. The Facebook App ID in the backend doesn't match the one used in the frontend
3. The redirect URI is not properly configured in your Facebook App settings
4. The Facebook App doesn't have the Marketing API enabled

To diagnose the issue:

1. Check the browser console for detailed error messages
2. Verify that your backend environment variables are set correctly
3. Make sure the redirect URI in your Facebook App settings exactly matches `https://campaign-manager1271.netlify.app/platforms`
4. Check that your Facebook App has the necessary permissions and products enabled

### Testing the Configuration

You can test if your Facebook configuration is correct by visiting:

```
/api/platforms/facebook/config-status
```

This endpoint will check if the required environment variables are set and if the App ID matches what's used in the frontend.
