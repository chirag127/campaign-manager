# Facebook Permissions Fix

This document provides instructions on how to fix the Facebook permissions issue where you get the error: "(#3) Application does not have the capability to make this API call."

## The Problem

The issue is that your Facebook app doesn't have the necessary permissions to upload images or videos to Facebook. This is required for creating ads with creative assets.

## Solution

### 1. Ensure Your App Has the Marketing API Enabled

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Select your app
3. Go to "Add Products" in the left sidebar
4. Find "Marketing API" and click "Set Up"
5. Follow the setup instructions

### 2. Request the Required Permissions

1. Go to "App Review" > "Permissions and Features"
2. Request the following permissions:

    - `ads_management` - Required for creating and managing ads
    - `ads_read` - Required for reading ad account information
    - `business_management` - Required for managing business assets

3. For each permission, you'll need to:
    - Explain how your app will use the permission
    - Provide step-by-step instructions on how to test the functionality
    - Record a screencast demonstrating the functionality
    - Submit for review

### 3. Configure Your App Settings

1. Go to "Settings" > "Basic"
2. Make sure your app is in "Live" mode, not "Development" mode
3. Add all necessary domains to the "App Domains" field
4. Make sure your Privacy Policy URL is valid

### 4. Verify Your Business

If you haven't already, you may need to verify your business:

1. Go to [Business Settings](https://business.facebook.com/settings)
2. Click on "Business Info"
3. Follow the steps to verify your business

## Temporary Workaround

While waiting for permission approval, you can:

1. Create campaigns without creative assets
2. Upload creative assets directly through the Facebook Ads Manager
3. Associate the uploaded creatives with your campaigns manually

## Testing Your Permissions

After making these changes, you can test if your app has the necessary permissions by:

1. Creating a new campaign with a simple image
2. Check if the image uploads successfully
3. If it fails, check the error message for more details

## Need More Help?

If you're still experiencing issues after following these steps, please refer to:

1. [Facebook Marketing API Documentation](https://developers.facebook.com/docs/marketing-apis/)
2. [Facebook App Review Guide](https://developers.facebook.com/docs/app-review/)
3. [Facebook Business Help Center](https://www.facebook.com/business/help/)
