# Facebook Integration Setup Guide

## Step 1: Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click on "My Apps" and then "Create App"
3. Fill in the required information and create the app

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

## Step 4: Configure Your Backend

1. Update your `.env` file in the backend directory with the following variables:
    ```
    FACEBOOK_APP_ID=your_facebook_app_id
    FACEBOOK_APP_SECRET=your_facebook_app_secret
    ```
