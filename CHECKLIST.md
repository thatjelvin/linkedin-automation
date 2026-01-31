# Setup Checklist

Use this checklist to track your progress setting up the LinkedIn AI/ML automation.

## 📋 Pre-Setup

- [ ] I have an n8n instance (Cloud or self-hosted)
- [ ] I have Node.js installed (for validation script)
- [ ] I have a LinkedIn account
- [ ] I have a Google account
- [ ] I have 30-40 minutes available for setup

---

## 🔑 API Keys & Accounts

### Free API Services (No Credit Card Required)

- [ ] **Groq Account Created**
  - [ ] Signed up at [console.groq.com](https://console.groq.com/)
  - [ ] Generated API key
  - [ ] Copied key to safe location
  - [ ] Added to `.env` file as `GROQ_API_KEY`

- [ ] **Tavily Account Created**
  - [ ] Signed up at [tavily.com](https://tavily.com/)
  - [ ] Found API key in dashboard
  - [ ] Copied key to safe location
  - [ ] Added to `.env` file as `TAVILY_API_KEY`

- [ ] **Unsplash Developer Account Created**
  - [ ] Registered at [unsplash.com/developers](https://unsplash.com/developers)
  - [ ] Created new application
  - [ ] Copied Access Key
  - [ ] Added to `.env` file as `UNSPLASH_ACCESS_KEY`

---

## 📊 Google Sheets Setup

- [ ] **Created Google Sheet**
  - [ ] Named: "LinkedIn Automation Tracking" (or your choice)
  - [ ] Copied Document ID from URL
  - [ ] Added to `.env` file as `GOOGLE_SHEETS_DOC_ID`

- [ ] **PostHistory Tab Created**
  - [ ] Tab name: "PostHistory" (exact spelling)
  - [ ] Column A: Timestamp
  - [ ] Column B: Topic
  - [ ] Column C: PostText
  - [ ] Column D: ImageCredit
  - [ ] Column E: Status

- [ ] **ErrorLog Tab Created**
  - [ ] Tab name: "ErrorLog" (exact spelling)
  - [ ] Column A: Timestamp
  - [ ] Column B: Workflow
  - [ ] Column C: FailedNode
  - [ ] Column D: ErrorMessage

---

## 🔐 OAuth Credentials (LinkedIn)

- [ ] **LinkedIn Developer App Created**
  - [ ] Signed in to [LinkedIn Developers](https://www.linkedin.com/developers/)
  - [ ] Created new app
  - [ ] Added app logo
  - [ ] Noted Client ID
  - [ ] Noted Client Secret

- [ ] **LinkedIn App Configured**
  - [ ] Added OAuth redirect URL
  - [ ] For n8n Cloud: `https://YOUR_INSTANCE.app.n8n.cloud/rest/oauth2-credential/callback`
  - [ ] For self-hosted: `http://localhost:5678/rest/oauth2-credential/callback`
  - [ ] Requested "Share on LinkedIn" product
  - [ ] Product access granted (or pending)

- [ ] **LinkedIn OAuth in n8n**
  - [ ] Added LinkedIn OAuth2 credential in n8n
  - [ ] Entered Client ID
  - [ ] Entered Client Secret
  - [ ] Connected account successfully
  - [ ] Named credential: "LinkedIn OAuth2"

- [ ] **LinkedIn Person URN Obtained**
  - [ ] Called LinkedIn userinfo API
  - [ ] Found `sub` field in response
  - [ ] Format: `urn:li:person:XXXXXXXXXX`
  - [ ] Added to `.env` file as `LINKEDIN_PERSON_URN`

---

## 🔐 OAuth Credentials (Google Sheets)

- [ ] **Google Cloud Project Created**
  - [ ] Signed in to [Google Cloud Console](https://console.cloud.google.com/)
  - [ ] Created new project (or selected existing)
  - [ ] Noted project name

- [ ] **Google Sheets API Enabled**
  - [ ] Searched for "Google Sheets API"
  - [ ] Clicked "Enable"
  - [ ] API is active

- [ ] **OAuth Consent Screen Configured**
  - [ ] User Type: External
  - [ ] App name: "LinkedIn Automation"
  - [ ] User support email: Added
  - [ ] Developer contact: Added
  - [ ] Scopes added: `.../auth/spreadsheets`
  - [ ] Test users: Added my email

- [ ] **OAuth Client ID Created**
  - [ ] Application type: Web application
  - [ ] Name: "n8n LinkedIn Automation"
  - [ ] Authorized redirect URI added
  - [ ] Client ID noted
  - [ ] Client Secret noted

- [ ] **Google Sheets OAuth in n8n**
  - [ ] Added Google Sheets OAuth2 credential in n8n
  - [ ] Entered Client ID
  - [ ] Entered Client Secret
  - [ ] Connected account successfully
  - [ ] Named credential: "Google Sheets OAuth2"
  - [ ] Verified access to my spreadsheet

---

## ⚙️ n8n Workflow Setup

- [ ] **Workflow Imported**
  - [ ] Downloaded `linkedin-ai-ml-learning-workflow.json`
  - [ ] Imported to n8n via "Import from File"
  - [ ] All nodes visible

- [ ] **Credentials Assigned to Nodes**
  - [ ] "Read Post History" → Google Sheets OAuth2
  - [ ] "Groq Chat Model" → Groq API
  - [ ] "Post to LinkedIn" → LinkedIn OAuth2
  - [ ] "Log to Google Sheets" → Google Sheets OAuth2
  - [ ] "Log Error to Sheets" → Google Sheets OAuth2

- [ ] **Environment Variables Set in n8n**
  - [ ] Method chosen: (n8n Cloud Environment Variables OR Self-hosted .env)
  - [ ] GOOGLE_SHEETS_DOC_ID set
  - [ ] GOOGLE_SHEETS_SHEET_NAME set (or using default "PostHistory")
  - [ ] GROQ_API_KEY set
  - [ ] TAVILY_API_KEY set
  - [ ] UNSPLASH_ACCESS_KEY set
  - [ ] LINKEDIN_PERSON_URN set

---

## 🧪 Testing

- [ ] **Validation Script Ran**
  - [ ] Installed dotenv (optional): `npm install dotenv`
  - [ ] Ran: `npm run validate`
  - [ ] All required checks passed
  - [ ] API keys validated successfully

- [ ] **Manual Workflow Test**
  - [ ] Clicked "Execute Workflow" in n8n
  - [ ] All nodes executed successfully (green checkmarks)
  - [ ] Topic was selected
  - [ ] Trends were fetched
  - [ ] Content was generated
  - [ ] Image was found and downloaded
  - [ ] Post structure looks good

- [ ] **Google Sheets Test**
  - [ ] Opened Google Sheet
  - [ ] Found new entry in PostHistory
  - [ ] All columns populated correctly
  - [ ] Timestamp is correct

- [ ] **LinkedIn Test** (Optional for now)
  - [ ] LinkedIn post created successfully
  - [ ] OR Skipped (will test on first scheduled run)

---

## 🚀 Activation

- [ ] **Workflow Activated**
  - [ ] Toggle switch at top of workflow is ON (green)
  - [ ] Schedule is set: Every 2 days at 10 AM (or customized)
  - [ ] Workflow shows as "Active" in workflow list

- [ ] **Email Alerts Configured** (Optional)
  - [ ] SMTP credentials added to n8n
  - [ ] ALERT_EMAIL environment variable set
  - [ ] Test email sent successfully
  - [ ] OR Skipped (email alerts optional)

---

## 📱 Post-Setup

- [ ] **Documentation Reviewed**
  - [ ] Read QUICKSTART.md
  - [ ] Skimmed WORKFLOW_GUIDE.md
  - [ ] Bookmarked TROUBLESHOOTING.md for reference

- [ ] **Monitoring Plan Set**
  - [ ] Added calendar reminder to check Google Sheets weekly
  - [ ] Subscribed to GitHub repo for updates
  - [ ] Joined n8n community (optional)

- [ ] **Backup Created**
  - [ ] Exported workflow JSON
  - [ ] Saved to safe location
  - [ ] Documented any customizations

- [ ] **First Post Scheduled**
  - [ ] Waiting for first scheduled run
  - [ ] OR Manually executed for immediate post
  - [ ] Monitoring Google Sheets for entry

---

## ✅ Verification

**Final checks before considering setup complete:**

- [ ] ✓ Validation script passes with no errors
- [ ] ✓ Manual test execution succeeds
- [ ] ✓ Google Sheets updates correctly
- [ ] ✓ All credentials are saved and working
- [ ] ✓ Workflow is active
- [ ] ✓ Schedule is configured correctly
- [ ] ✓ I understand how to monitor and troubleshoot

---

## 🎉 Success!

**Congratulations!** If all items above are checked, your LinkedIn AI/ML automation is fully set up and ready to go!

### What Happens Next?

1. **First scheduled post:** Will be created on the next schedule trigger (every 2 days at 10 AM)
2. **Automatic logging:** Every post will be logged to Google Sheets
3. **Topic rotation:** Each post covers a different AI/ML topic
4. **Error handling:** If something fails, you'll be notified (if email alerts configured)

### Recommended Next Steps

- [ ] Check Google Sheets after first scheduled run
- [ ] Review the post on LinkedIn
- [ ] Engage with any comments
- [ ] Consider customizing topics (see WORKFLOW_GUIDE.md)
- [ ] Share your success with the community!

---

## 📊 Tracking Your Progress

**Setup Started:** ___/___/______

**Setup Completed:** ___/___/______

**First Post Published:** ___/___/______

**Total Setup Time:** _______ minutes

---

## 🆘 Need Help?

If you get stuck on any step:

1. **Check the documentation:**
   - [SETUP.md](SETUP.md) - Detailed setup instructions
   - [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues
   - [WORKFLOW_GUIDE.md](WORKFLOW_GUIDE.md) - Usage guide

2. **Run diagnostics:**
   ```bash
   npm run validate
   ```

3. **Get support:**
   - [GitHub Issues](https://github.com/thatjelvin/linkedin-automation/issues)
   - [GitHub Discussions](https://github.com/thatjelvin/linkedin-automation/discussions)
   - [n8n Community](https://community.n8n.io/)

---

**Pro Tip:** Print this checklist or keep it open in a browser tab as you work through the setup!
