# Facebook Connection Fix

This document provides instructions on how to fix the Facebook connection issue where you get the error: "Failed to complete platform connection. Failed to exchange code for Facebook tokens".

## The Problem

The issue is that the backend server is missing the required Facebook API credentials in the environment variables. These credentials are needed to exchange the authorization code for an access token.

## Solution

1. Add the following environment variables to your backend `.env` file:

```
FACEBOOK_APP_ID=512708801911830
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

You need to replace `your_facebook_app_secret` with your actual Facebook App Secret. You can find this in your Facebook Developer Console.

## How to Get Your Facebook App Secret

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Select your app
3. Go to "Settings" > "Basic"
4. Your App Secret will be listed there (you may need to click "Show" to view it)

## Verifying the Configuration

After adding the environment variables, you can verify that they are correctly set by visiting:

```
/api/platforms/facebook/config-status
```

This endpoint will show:
- Whether your App ID is set in the backend
- Whether your App Secret is set in the backend
- Whether the App ID in the backend matches the one used in the frontend

## Complete Facebook Setup

For a complete guide on setting up Facebook integration, please refer to the `FACEBOOK_SETUP.md` file.

## Troubleshooting

If you're still experiencing issues after setting the environment variables:

1. Make sure you restart your backend server after updating the `.env` file
2. Check that the redirect URI in your Facebook App settings exactly matches `https://campaign-manager1271.netlify.app/platforms`
3. Verify that your Facebook App has the necessary permissions enabled (ads_management, ads_read)
4. Check the browser console and server logs for more detailed error messages
