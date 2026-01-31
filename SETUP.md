# 🚀 Complete Setup Guide for LinkedIn AI/ML Automation

This guide will walk you through setting up the LinkedIn automation workflow from scratch. Follow these steps carefully to ensure everything works correctly.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [n8n Setup](#n8n-setup)
3. [API Keys and Credentials](#api-keys-and-credentials)
4. [Google Sheets Setup](#google-sheets-setup)
5. [Workflow Import](#workflow-import)
6. [Testing the Workflow](#testing-the-workflow)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, make sure you have:

- An n8n instance (self-hosted or n8n Cloud)
  - Self-hosted: [Install n8n](https://docs.n8n.io/hosting/)
  - Cloud: [Sign up for n8n Cloud](https://n8n.io/cloud/)
- A LinkedIn account
- A Google account
- Basic understanding of APIs and JSON

---

## n8n Setup

### Option 1: n8n Cloud (Easiest)

1. Sign up at [n8n.io/cloud](https://n8n.io/cloud/)
2. Complete the onboarding process
3. You're ready to import the workflow!

### Option 2: Self-Hosted with Docker

```bash
# Create a directory for n8n data
mkdir ~/.n8n

# Run n8n with Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

Access n8n at `http://localhost:5678`

### Option 3: Self-Hosted with npm

```bash
# Install n8n globally
npm install n8n -g

# Start n8n
n8n start
```

Access n8n at `http://localhost:5678`

---

## API Keys and Credentials

### 1. Groq API (FREE - AI Content Generation)

**Why:** Generates engaging LinkedIn posts using Llama 3.3 70B model

**Setup:**
1. Go to [console.groq.com](https://console.groq.com/)
2. Sign up for a free account
3. Navigate to [API Keys](https://console.groq.com/keys)
4. Click "Create API Key"
5. Copy the key and save it to your `.env` file as `GROQ_API_KEY`

**Free Tier:** 14,400 requests/day - More than enough!

---

### 2. Tavily Search API (FREE - Trend Research)

**Why:** Fetches latest AI/ML trends and developments

**Setup:**
1. Go to [tavily.com](https://tavily.com/)
2. Sign up for a free account
3. Navigate to your [API Keys](https://app.tavily.com/home)
4. Copy your API key
5. Save it to your `.env` file as `TAVILY_API_KEY`

**Free Tier:** 1,000 searches/month

---

### 3. Unsplash API (FREE - Images)

**Why:** Provides high-quality, royalty-free images for posts

**Setup:**
1. Go to [unsplash.com/developers](https://unsplash.com/developers)
2. Sign up and create an account
3. Click "Your apps" → "New Application"
4. Accept the terms and conditions
5. Fill in the application details:
   - Application name: "LinkedIn AI Automation"
   - Description: "Automated LinkedIn content with AI-generated posts"
6. Copy the "Access Key"
7. Save it to your `.env` file as `UNSPLASH_ACCESS_KEY`

**Free Tier:** 50 requests/hour - Perfect for our use case!

---

### 4. LinkedIn OAuth2 (Authentication Required)

**Why:** Allows posting content to your LinkedIn profile

**Setup:**
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Sign in with your LinkedIn account
3. Click "Create app"
4. Fill in the required information:
   - App name: "AI ML Content Automation"
   - LinkedIn Page: Select or create a LinkedIn page
   - App logo: Upload any logo (can be changed later)
   - Legal agreement: Accept
5. After creating the app:
   - Go to "Auth" tab
   - Add OAuth 2.0 redirect URLs:
     - For n8n Cloud: `https://YOUR_INSTANCE.app.n8n.cloud/rest/oauth2-credential/callback`
     - For self-hosted: `http://localhost:5678/rest/oauth2-credential/callback`
   - Note down your:
     - Client ID
     - Client Secret
6. Go to "Products" tab and request access to:
   - "Share on LinkedIn" (required)
   - "Sign In with LinkedIn using OpenID Connect" (optional)

**Configure in n8n:**
1. In n8n, go to "Credentials" → "Add Credential"
2. Search for "LinkedIn OAuth2"
3. Enter:
   - Client ID (from LinkedIn app)
   - Client Secret (from LinkedIn app)
   - Scope: `openid profile email w_member_social`
4. Click "Connect my account" and authorize
5. Name it: "LinkedIn OAuth2"

**Get your LinkedIn Person URN:**
After connecting, you'll need your Person URN:
1. Use the LinkedIn API endpoint: `https://api.linkedin.com/v2/userinfo`
2. Or use this test workflow in n8n to get it:
   - Create an HTTP Request node
   - Method: GET
   - URL: `https://api.linkedin.com/v2/userinfo`
   - Authentication: Use your LinkedIn OAuth2 credentials
   - Execute the workflow
   - Look for the `sub` field - this is your Person URN

Save the Person URN to your `.env` file as `LINKEDIN_PERSON_URN`

---

### 5. Google Sheets OAuth2 (Authentication Required)

**Why:** Logs all published posts and errors for tracking

**Setup:**

#### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Sheets API:
   - Search for "Google Sheets API" in the search bar
   - Click "Enable"

#### Step 2: Create OAuth2 Credentials
1. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
2. Configure consent screen (if first time):
   - User Type: External
   - App name: "LinkedIn Automation"
   - User support email: Your email
   - Developer contact: Your email
   - Save and continue
3. Add scopes:
   - `.../auth/spreadsheets` (Google Sheets API)
   - Save and continue
4. Add test users (your email address)
5. Create OAuth Client ID:
   - Application type: Web application
   - Name: "n8n LinkedIn Automation"
   - Authorized redirect URIs:
     - For n8n Cloud: `https://YOUR_INSTANCE.app.n8n.cloud/rest/oauth2-credential/callback`
     - For self-hosted: `http://localhost:5678/rest/oauth2-credential/callback`
6. Download the credentials JSON or copy:
   - Client ID
   - Client Secret

#### Step 3: Configure in n8n
1. In n8n, go to "Credentials" → "Add Credential"
2. Search for "Google Sheets OAuth2 API"
3. Enter:
   - Client ID (from Google Cloud)
   - Client Secret (from Google Cloud)
4. Click "Connect my account" and authorize
5. Name it: "Google Sheets OAuth2"

---

### 6. SMTP Email (OPTIONAL - For Error Alerts)

**Why:** Sends email notifications when the workflow fails

**Setup (using Gmail as example):**

1. Enable 2-Step Verification on your Google Account
2. Generate an App Password:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Search for "App passwords"
   - Create a new app password for "Mail"
   - Copy the 16-character password

3. Configure in n8n:
   - In n8n, go to "Credentials" → "Add Credential"
   - Search for "SMTP"
   - Enter:
     - Host: `smtp.gmail.com`
     - Port: `587`
     - User: Your Gmail address
     - Password: The app password (16 characters, no spaces)
     - Secure: Yes
   - Name it: "SMTP"

4. Add to `.env`:
   ```env
   ALERT_EMAIL=your-email@gmail.com
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   SMTP_FROM_EMAIL=your-email@gmail.com
   ```

**Alternative SMTP Providers:**
- **SendGrid:** Free tier with 100 emails/day
- **Mailgun:** Free tier with 5,000 emails/month
- **AWS SES:** Free tier with 62,000 emails/month (if on AWS)

---

## Google Sheets Setup

### Create Your Tracking Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Name it: "LinkedIn AI Automation Tracking"
4. Copy the Document ID from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/YOUR_DOC_ID/edit`
   - Save `YOUR_DOC_ID` to `.env` as `GOOGLE_SHEETS_DOC_ID`

### Create Required Tabs

#### Tab 1: PostHistory
1. Create a tab named "PostHistory"
2. Add headers in row 1:
   - Column A: `Timestamp`
   - Column B: `Topic`
   - Column C: `PostText`
   - Column D: `ImageCredit`
   - Column E: `Status`

#### Tab 2: ErrorLog
1. Create a tab named "ErrorLog"
2. Add headers in row 1:
   - Column A: `Timestamp`
   - Column B: `Workflow`
   - Column C: `FailedNode`
   - Column D: `ErrorMessage`

### Example Sheet Structure

**PostHistory Tab:**
```
| Timestamp           | Topic                | PostText           | ImageCredit    | Status    |
|---------------------|---------------------|--------------------|-----------------|-----------| 
| 2025-01-31T10:00:00Z| Python for AI       | 🚀 Python is...   | John Doe        | Published |
```

**ErrorLog Tab:**
```
| Timestamp           | Workflow            | FailedNode         | ErrorMessage    |
|---------------------|---------------------|--------------------|-----------------| 
| 2025-01-31T10:05:00Z| LinkedIn AI/ML...   | Post to LinkedIn  | API Error 429   |
```

---

## Workflow Import

### Step 1: Import the Workflow

1. Download `linkedin-ai-ml-learning-workflow.json` from this repository
2. In n8n, click the "+" button to create a new workflow
3. Click the menu (three dots) → "Import from File"
4. Select the downloaded JSON file
5. Click "Import"

### Step 2: Configure Environment Variables

In n8n, you can set environment variables in two ways:

#### Option A: n8n Cloud - Environment Variables
1. Go to Settings → Environment Variables
2. Add each variable from your `.env` file

#### Option B: Self-Hosted - .env File
1. Create a `.env` file in your n8n root directory
2. Copy the contents from `.env.example`
3. Fill in all the values
4. Restart n8n

### Step 3: Configure Credentials in Workflow

1. Open the imported workflow
2. Click on each node that requires credentials:
   - **Read Post History** → Select your Google Sheets OAuth2 credential
   - **Groq AI Content Agent** → Select your Groq API credential
   - **Post to LinkedIn** → Select your LinkedIn OAuth2 credential
   - **Log to Google Sheets** → Select your Google Sheets OAuth2 credential
   - **Log Error to Sheets** → Select your Google Sheets OAuth2 credential
   - **Send Error Alert Email** → Select your SMTP credential (if using email alerts)

3. Save the workflow

### Step 4: Activate the Workflow

1. Click the toggle switch at the top to activate the workflow
2. The workflow will now run automatically every 2 days at 10 AM

---

## Testing the Workflow

### Manual Test Run

Before letting it run automatically, test it manually:

1. In the workflow, click on the "Schedule Every 2 Days" trigger node
2. Click "Execute Node" to simulate a trigger
3. Watch each node execute in sequence
4. Check for any errors

### Verify Each Step

1. **Topic Selection:**
   - Check that a topic was selected from the list
   - Verify it hasn't been posted before (unless all topics have been posted)

2. **Trend Search:**
   - Verify Tavily API returns recent trends
   - Check that results are relevant to the topic

3. **Content Generation:**
   - Review the generated LinkedIn post
   - Ensure it includes:
     - Hook about why the topic matters
     - Learning path for beginners
     - 3-4 free resources
     - Current trends/applications
     - Motivation and call-to-action
     - 3-5 hashtags
     - 2-3 emojis

4. **Image Selection:**
   - Verify Unsplash returned relevant images
   - Check image attribution is included

5. **LinkedIn Post:**
   - Verify the post was published to LinkedIn
   - Check your LinkedIn profile to see the post

6. **Google Sheets Logging:**
   - Open your Google Sheet
   - Verify a new row was added to PostHistory with all details

### Test Error Handling

1. Temporarily break something (e.g., use an invalid API key)
2. Run the workflow
3. Verify:
   - Error is caught
   - Email alert is sent (if configured)
   - Error is logged to Google Sheets ErrorLog tab

---

## Troubleshooting

### Common Issues

#### Issue: "Unauthorized" or "Invalid credentials" errors

**Solution:**
- Verify all API keys are correct and active
- Check that OAuth credentials are properly connected
- Ensure redirect URLs match exactly
- For LinkedIn: Verify your app has "Share on LinkedIn" product enabled

#### Issue: "Cannot read property 'json' of undefined"

**Solution:**
- This usually means a previous node didn't return data
- Check that previous nodes executed successfully
- Verify Google Sheets has data in PostHistory tab (add headers at minimum)

#### Issue: Google Sheets returns empty

**Solution:**
- Ensure the sheet has the correct Document ID
- Verify the tab name matches exactly ("PostHistory")
- Check that the Google Sheets OAuth2 credential has the correct permissions
- Make sure there's at least a header row in the sheet

#### Issue: Workflow doesn't run on schedule

**Solution:**
- Verify the workflow is activated (toggle switch is ON)
- Check n8n's execution logs for any errors
- Ensure n8n is running (for self-hosted)
- For n8n Cloud: Check your plan supports scheduled triggers

#### Issue: LinkedIn post fails with "Person URN not found"

**Solution:**
1. Get your Person URN:
   ```bash
   # Using curl (replace with your access token)
   curl -X GET 'https://api.linkedin.com/v2/userinfo' \
     -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'
   ```
2. Look for the `sub` field in the response
3. Update `LINKEDIN_PERSON_URN` in your environment variables

#### Issue: Groq API rate limit exceeded

**Solution:**
- The free tier allows 14,400 requests/day
- Our workflow uses approximately 1 request every 2 days
- If you hit the limit, check for:
  - Multiple test runs
  - Other applications using the same API key
- Wait for the daily reset or reduce test frequency

#### Issue: Unsplash API rate limit exceeded

**Solution:**
- Free tier: 50 requests/hour
- Workflow uses 1 request every 2 days
- If exceeded, it's likely from test runs
- Wait an hour for the limit to reset
- The workflow has a fallback image if Unsplash fails

### Debug Mode

To enable detailed logging:

1. In n8n workflow settings:
   - Click Settings → "Workflow Settings"
   - Enable "Save Execution Progress"
   - Enable "Save Manual Executions"

2. View execution logs:
   - Go to "Executions" in the left sidebar
   - Click on any execution to see detailed logs
   - Check each node's input/output

### Getting Help

If you're still stuck:

1. Check the n8n community forum: [community.n8n.io](https://community.n8n.io/)
2. Review n8n documentation: [docs.n8n.io](https://docs.n8n.io/)
3. Open an issue on this GitHub repository
4. Check API provider documentation:
   - [Groq Docs](https://console.groq.com/docs)
   - [Tavily Docs](https://docs.tavily.com/)
   - [Unsplash API Docs](https://unsplash.com/documentation)
   - [LinkedIn API Docs](https://docs.microsoft.com/en-us/linkedin/)

---

## Next Steps

Once everything is working:

1. ✅ Monitor the first few automated posts
2. ✅ Adjust the schedule if needed (currently every 2 days at 10 AM)
3. ✅ Customize the AI prompt for your style
4. ✅ Add your own topics to the topic list
5. ✅ Set up backup workflows (optional)
6. ✅ Share your success on LinkedIn! 🎉

---

## Advanced Configuration

### Customize Post Frequency

Edit the "Schedule Every 2 Days" node:
- Change `daysInterval` to post more or less frequently
- Adjust `triggerAtHour` and `triggerAtMinute` for different times

### Add Custom Topics

Edit the "Topic Selector with Rotation" node:
- Add new topics to the `topics` array
- Include description and resources for each topic

### Modify Post Style

Edit the "Groq AI Content Agent" node:
- Adjust the prompt to change tone, length, or structure
- Modify the system message to change the AI's personality

### Use Different AI Models

Edit the "Groq Chat Model" node:
- Change `model` to try different Groq models:
  - `llama-3.3-70b-versatile` (current, best for general content)
  - `llama-3.1-8b-instant` (faster, less detailed)
  - `mixtral-8x7b-32768` (good for technical content)

---

## Security Best Practices

- ✅ Never commit your `.env` file
- ✅ Use environment variables for all sensitive data
- ✅ Regularly rotate API keys
- ✅ Use OAuth2 instead of API keys when possible
- ✅ Enable 2FA on all accounts
- ✅ Monitor API usage for unusual activity
- ✅ Keep n8n updated to the latest version
- ✅ Regular backup your workflows

---

## Monitoring and Maintenance

### Daily Checks
- Verify posts are being published correctly
- Check Google Sheets for any logged errors

### Weekly Checks
- Review API usage to stay within free tier limits
- Check LinkedIn engagement on posts
- Verify topic rotation is working correctly

### Monthly Checks
- Audit API keys and credentials
- Review and update topic list
- Analyze post performance
- Update resources if links are broken

---

**Congratulations!** 🎉 Your LinkedIn AI/ML automation is now fully set up and running. Sit back and watch as it consistently shares valuable AI/ML content with your network!

Remember: The automation should enhance your LinkedIn presence, not replace authentic engagement. Continue to interact with your network and share your personal insights alongside the automated posts.
