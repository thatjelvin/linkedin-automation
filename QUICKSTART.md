# 🚀 Quick Start Guide

Get your LinkedIn AI/ML automation running in 30 minutes!

## Prerequisites Checklist

Before you begin, ensure you have:

- [ ] n8n instance (n8n Cloud or self-hosted)
- [ ] Node.js installed (v14 or higher) for validation script
- [ ] 30 minutes of focused setup time

---

## Setup Steps

### 1️⃣ Clone the Repository (2 minutes)

```bash
git clone https://github.com/thatjelvin/linkedin-automation.git
cd linkedin-automation
```

### 2️⃣ Get Your API Keys (15 minutes)

Create free accounts and get API keys from these services:

#### Groq (AI Content Generation)
1. Go to [console.groq.com](https://console.groq.com/)
2. Sign up (free)
3. Navigate to API Keys
4. Create new API key
5. Copy and save it

#### Tavily (Trend Research)
1. Go to [tavily.com](https://tavily.com/)
2. Sign up (free)
3. Copy your API key from dashboard

#### Unsplash (Images)
1. Go to [unsplash.com/developers](https://unsplash.com/developers)
2. Create a new application
3. Copy the Access Key

> **Pro tip:** Keep all these keys in a text file temporarily - you'll need them soon!

### 3️⃣ Configure Environment Variables (3 minutes)

```bash
# Copy the example file
cp .env.example .env

# Edit .env and paste your API keys
nano .env  # or use your favorite editor
```

Fill in these required fields:
```env
GROQ_API_KEY=gsk_...
TAVILY_API_KEY=tvly-...
UNSPLASH_ACCESS_KEY=...
```

Leave the others blank for now - we'll configure them in n8n.

### 4️⃣ Create Google Sheet (3 minutes)

1. Go to [sheets.google.com](https://sheets.google.com/)
2. Create a new sheet named "LinkedIn Automation Tracking"
3. Create two tabs:
   
   **Tab 1: PostHistory**
   - Headers: `Timestamp | Topic | PostText | ImageCredit | Status`
   
   **Tab 2: ErrorLog**
   - Headers: `Timestamp | Workflow | FailedNode | ErrorMessage`

4. Copy the document ID from URL:
   - URL: `https://docs.google.com/spreadsheets/d/YOUR_DOC_ID/edit`
   - Add to `.env`: `GOOGLE_SHEETS_DOC_ID=YOUR_DOC_ID`

### 5️⃣ Validate Setup (1 minute)

```bash
# Install validation script dependencies (optional)
npm install dotenv

# Run validation
npm run validate
```

Expected output if everything is correct:
```
✓ GROQ_API_KEY is set
✓ TAVILY_API_KEY is set
✓ UNSPLASH_ACCESS_KEY is set
✓ GOOGLE_SHEETS_DOC_ID is set
✓ Groq API key is valid
✓ Tavily API key is valid
✓ Unsplash API key is valid
```

### 6️⃣ Import to n8n (5 minutes)

1. Open your n8n instance
2. Click "+" → "Import from File"
3. Select `linkedin-ai-ml-learning-workflow.json`
4. Click "Import"

### 7️⃣ Configure OAuth Credentials in n8n (5 minutes)

#### LinkedIn OAuth2
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create an app
3. Add OAuth redirect URL: `https://YOUR_N8N_INSTANCE/rest/oauth2-credential/callback`
4. In n8n: Credentials → Add → LinkedIn OAuth2
5. Enter Client ID and Secret
6. Click "Connect my account"

#### Google Sheets OAuth2
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → Enable Google Sheets API
3. Create OAuth Client ID
4. In n8n: Credentials → Add → Google Sheets OAuth2
5. Enter Client ID and Secret
6. Click "Connect my account"

#### Groq API (Simple)
1. In n8n: Credentials → Add → Groq API
2. Enter your Groq API key
3. Save

### 8️⃣ Test the Workflow (3 minutes)

1. In n8n workflow, click "Execute Workflow"
2. Watch each node execute
3. Check that:
   - ✓ Post was created
   - ✓ Image was selected
   - ✓ Content was generated
   - ✓ (Don't worry if LinkedIn posting fails - we need Person URN)

### 9️⃣ Get LinkedIn Person URN (2 minutes)

1. In n8n, create a simple HTTP Request:
   - Method: GET
   - URL: `https://api.linkedin.com/v2/userinfo`
   - Authentication: LinkedIn OAuth2 (use your credential)
2. Execute and find the `sub` field
3. Add to `.env`: `LINKEDIN_PERSON_URN=urn:li:person:XXXXXXXXXX`

### 🔟 Activate and Monitor (1 minute)

1. Toggle the workflow to "Active" (switch turns green)
2. First post will go out on the next scheduled run
3. Check Google Sheets for the log entry

---

## Verification Checklist

After setup, verify everything works:

- [ ] Validation script passes all checks
- [ ] Manual workflow execution succeeds
- [ ] Post appears in Google Sheets
- [ ] LinkedIn OAuth is connected
- [ ] Google Sheets OAuth is connected
- [ ] All API keys are valid
- [ ] Workflow is activated

---

## What Happens Next?

Once activated:

1. **Every 2 days at 10 AM:** Workflow runs automatically
2. **Content is generated:** AI creates an engaging post about an AI/ML topic
3. **Image is added:** Relevant image from Unsplash
4. **Posted to LinkedIn:** Automatically published to your profile
5. **Logged to Sheets:** All details recorded for tracking

---

## Troubleshooting

**Setup not working?**

1. **Run validation again:**
   ```bash
   npm run validate
   ```

2. **Check specific issues:**
   - API keys: Make sure they're correct in `.env`
   - OAuth: Verify redirect URLs match exactly
   - Google Sheets: Ensure tabs are named correctly

3. **Read detailed guides:**
   - Full setup: [SETUP.md](SETUP.md)
   - Common issues: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
   - Workflow usage: [WORKFLOW_GUIDE.md](WORKFLOW_GUIDE.md)

---

## Next Steps

### Recommended Actions

1. **Customize topics:**
   - Edit the "Topic Selector" node
   - Add your own AI/ML interests

2. **Adjust posting schedule:**
   - Change from every 2 days to your preference
   - Modify time to match your audience's timezone

3. **Monitor performance:**
   - Check Google Sheets weekly
   - Review engagement on LinkedIn
   - Adjust content style based on results

### Advanced Features

Once comfortable with the basics:

- 📊 Add analytics tracking in Google Sheets
- 🎨 Customize post style and format
- 🔄 Set up A/B testing for different styles
- 📱 Extend to other platforms (Twitter, Medium)
- 🤖 Try different AI models for variety

---

## Documentation

- 📘 **[SETUP.md](SETUP.md)** - Comprehensive setup guide with detailed instructions
- 🐛 **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions
- 📖 **[WORKFLOW_GUIDE.md](WORKFLOW_GUIDE.md)** - How to use and customize the workflow
- 💻 **[README.md](README.md)** - Project overview and features

---

## Support

Need help?

- **Issues:** [GitHub Issues](https://github.com/thatjelvin/linkedin-automation/issues)
- **Questions:** [GitHub Discussions](https://github.com/thatjelvin/linkedin-automation/discussions)
- **n8n Community:** [community.n8n.io](https://community.n8n.io/)

---

## Estimated Time Breakdown

| Step | Time | Difficulty |
|------|------|------------|
| Clone repo | 2 min | Easy |
| Get API keys | 15 min | Easy |
| Configure .env | 3 min | Easy |
| Create Google Sheet | 3 min | Easy |
| Validate setup | 1 min | Easy |
| Import to n8n | 5 min | Medium |
| Configure OAuth | 5 min | Medium |
| Test workflow | 3 min | Easy |
| Get Person URN | 2 min | Medium |
| Activate | 1 min | Easy |
| **Total** | **~40 min** | |

*First-time setup might take slightly longer*

---

**Ready to automate your LinkedIn presence?** 🚀

Start with Step 1 and work through each section. You'll be posting AI/ML content automatically in less than an hour!

**Questions?** Open an issue or check the comprehensive guides in the documentation.

---

**Made with ❤️ for the AI/ML community**

*Share your learnings, automate the logistics!*
