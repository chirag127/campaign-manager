# Facebook Integration Troubleshooting Guide

If you're experiencing issues with Facebook integration, follow this guide to diagnose and fix the problems.

## Common Error Messages and Solutions

### "FACEBOOK_APP_ID environment variable is not set"

**Solution:**
1. Make sure you have set the `FACEBOOK_APP_ID` in your backend `.env` file
2. The App ID should match the one used in the frontend code (`512708801911830`)
3. Restart your backend server after updating the `.env` file

### "FACEBOOK_APP_SECRET environment variable is not set"

**Solution:**
1. Make sure you have set the `FACEBOOK_APP_SECRET` in your backend `.env` file
2. You can find your App Secret in the Facebook Developer Console
3. Restart your backend server after updating the `.env` file

### "Facebook API error: Invalid OAuth redirect URI"

**Solution:**
1. Go to your Facebook App settings in the Facebook Developer Console
2. Under "Facebook Login" > "Settings", check the "Valid OAuth Redirect URIs"
3. Make sure `https://campaign-manager1271.netlify.app/platforms` is listed exactly (no trailing slash)
4. Save your changes in the Facebook Developer Console

### "Facebook API error: Invalid authorization code"

**Solution:**
1. Authorization codes are single-use and expire quickly
2. This error often occurs if you're trying to use the same code twice
3. Try the connection process again from the beginning

## Checking Your Configuration

You can check your Facebook configuration by visiting:

```
/api/platforms/facebook/config-status
```

This endpoint will show:
- Whether your App ID is set in the backend
- Whether your App Secret is set in the backend
- Whether the App ID in the backend matches the one used in the frontend

## Complete Setup Process

1. **Set Environment Variables**
   ```
   FACEBOOK_APP_ID=512708801911830
   FACEBOOK_APP_SECRET=your_app_secret_here
   ```

2. **Configure Facebook App**
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Select your app
   - Go to "Facebook Login" > "Settings"
   - Add `https://campaign-manager1271.netlify.app/platforms` as a Valid OAuth Redirect URI
   - Save changes

3. **Enable Required Permissions**
   - Go to "App Review" > "Permissions and Features"
   - Request the `ads_management` and `ads_read` permissions

4. **Test the Connection**
   - Go to the Platforms page in your app
   - Click "Connect" on Facebook
   - Complete the authentication flow
   - Check the browser console for detailed logs

## Still Having Issues?

If you're still experiencing problems after following these steps:

1. Check the browser console for detailed error messages
2. Check your backend logs for API errors
3. Make sure your Facebook App is properly configured with the necessary permissions
4. Verify that your app is in the correct mode (development/live) in the Facebook Developer Console
