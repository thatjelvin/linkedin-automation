# 🐛 Troubleshooting Guide

This guide covers common issues you might encounter while setting up or running the LinkedIn AI/ML automation workflow.

## Table of Contents

- [Authentication Issues](#authentication-issues)
- [API Rate Limiting](#api-rate-limiting)
- [Workflow Execution Problems](#workflow-execution-problems)
- [Data Issues](#data-issues)
- [n8n Platform Issues](#n8n-platform-issues)
- [Debugging Tips](#debugging-tips)

---

## Authentication Issues

### LinkedIn OAuth2 Errors

#### Error: "Unauthorized - 401"
**Cause:** LinkedIn OAuth2 credentials are invalid or expired

**Solution:**
1. Go to n8n Credentials → LinkedIn OAuth2
2. Click "Reconnect"
3. Authorize the application again
4. Verify your LinkedIn app has "Share on LinkedIn" product enabled:
   - Go to [LinkedIn Developers](https://www.linkedin.com/developers/apps)
   - Select your app → Products tab
   - Request access if not already enabled

#### Error: "Person URN not found"
**Cause:** The `LINKEDIN_PERSON_URN` environment variable is not set correctly

**Solution:**
1. Get your Person URN using LinkedIn API:
```bash
curl -X GET 'https://api.linkedin.com/v2/userinfo' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```
2. Find the `sub` field in the response - this is your Person URN
3. Update environment variable: `LINKEDIN_PERSON_URN=urn:li:person:YOUR_ID`
4. Restart n8n if self-hosted

#### Error: "redirect_uri_mismatch"
**Cause:** OAuth2 redirect URI doesn't match the one configured in LinkedIn app

**Solution:**
1. In LinkedIn Developer app, go to Auth tab
2. Verify redirect URI matches exactly:
   - n8n Cloud: `https://YOUR_INSTANCE.app.n8n.cloud/rest/oauth2-credential/callback`
   - Self-hosted: `http://localhost:5678/rest/oauth2-credential/callback`
3. Ensure no trailing slashes or extra spaces
4. Recreate the credential in n8n with the correct redirect URI

---

### Google Sheets OAuth2 Errors

#### Error: "Access not granted"
**Cause:** Google OAuth2 consent screen or scopes are not properly configured

**Solution:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "OAuth consent screen"
4. Verify:
   - Publishing status: "Testing" is fine for personal use
   - Test users: Your email is added
5. Go to "Credentials" → Your OAuth Client
6. Verify scopes include: `https://www.googleapis.com/auth/spreadsheets`
7. In n8n, reconnect the Google Sheets credential

#### Error: "The caller does not have permission"
**Cause:** The Google account doesn't have access to the spreadsheet

**Solution:**
1. Open your Google Sheet
2. Click "Share" button
3. Add the email address used in OAuth2
4. Grant "Editor" permissions
5. Try the workflow again

#### Error: "Unable to parse range"
**Cause:** Sheet name or range is incorrect

**Solution:**
1. Verify the sheet name matches exactly (case-sensitive)
2. Check `GOOGLE_SHEETS_SHEET_NAME` environment variable
3. Default is "PostHistory" - ensure the tab exists
4. For ErrorLog: Create a tab named "ErrorLog" (exact spelling)

---

### Groq API Errors

#### Error: "Invalid API key"
**Cause:** Groq API key is missing or incorrect

**Solution:**
1. Go to [Groq Console](https://console.groq.com/keys)
2. Generate a new API key
3. Update environment variable: `GROQ_API_KEY=your-key-here`
4. In n8n, update or recreate the Groq credential
5. Restart n8n if self-hosted

#### Error: "Rate limit exceeded"
**Cause:** You've exceeded Groq's free tier limits (14,400 requests/day)

**Solution:**
- This is unlikely with the normal workflow (1 request per 2 days)
- Check if you have multiple test runs
- Wait for the daily reset (based on UTC time)
- Consider upgrading to a paid plan if needed

---

### Tavily API Errors

#### Error: "Invalid API key"
**Cause:** Tavily API key is missing or incorrect

**Solution:**
1. Go to [Tavily Dashboard](https://app.tavily.com/)
2. Copy your API key
3. Update environment variable: `TAVILY_API_KEY=your-key-here`
4. Restart n8n if self-hosted

#### Error: "Rate limit exceeded"
**Cause:** Free tier limit reached (1,000 searches/month)

**Solution:**
- Free tier should be sufficient (1 search per 2 days ≈ 15/month)
- Check for multiple test executions
- Wait for monthly reset
- Consider reducing search depth in the workflow
- Upgrade to paid plan if needed

---

### Unsplash API Errors

#### Error: "Unauthorized"
**Cause:** Unsplash Access Key is missing or incorrect

**Solution:**
1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Click "Your apps"
3. Select your app or create a new one
4. Copy the "Access Key"
5. Update environment variable: `UNSPLASH_ACCESS_KEY=your-key-here`
6. Restart n8n if self-hosted

#### Error: "Rate Limit Exceeded"
**Cause:** Exceeded 50 requests/hour limit

**Solution:**
- Normal workflow uses 1 request per 2 days
- Likely caused by testing
- Wait for the hourly reset
- Workflow has a fallback image if Unsplash fails
- The workflow will continue to work with the default image

---

### SMTP Email Errors

#### Error: "Authentication failed"
**Cause:** SMTP credentials are incorrect or app password not generated

**Solution for Gmail:**
1. Enable 2-Step Verification on your Google Account
2. Generate an App Password:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Search for "App passwords"
   - Generate new password for "Mail"
3. Use the 16-character app password (no spaces)
4. Update SMTP credential in n8n

**Solution for other providers:**
- Verify SMTP host and port are correct
- Check username/password
- Ensure "Less secure app access" is enabled (if applicable)
- Try different ports: 587 (TLS), 465 (SSL), 25 (unencrypted)

---

## API Rate Limiting

### Understanding Rate Limits

| Service | Free Tier Limit | Workflow Usage | Safety Margin |
|---------|----------------|----------------|---------------|
| Groq | 14,400 req/day | ~0.5 req/day | ✅ Excellent |
| Tavily | 1,000 req/month | ~15 req/month | ✅ Excellent |
| Unsplash | 50 req/hour | ~0.02 req/hour | ✅ Excellent |
| Google Sheets | Unlimited (fair use) | ~1 req/day | ✅ Excellent |
| LinkedIn | Rate limited by account | ~0.5 posts/day | ✅ Good |

### Best Practices to Avoid Rate Limiting

1. **Test Sparingly:**
   - Use n8n's "Execute Node" feature to test individual nodes
   - Avoid running the full workflow repeatedly during testing

2. **Monitor Usage:**
   - Check your API dashboards regularly
   - Set up alerts for approaching limits

3. **Implement Backoff:**
   - The workflow already has error handling
   - Failed executions won't retry immediately

4. **Use Fallbacks:**
   - Unsplash failure → Uses default image
   - Continue workflow even with partial failures

---

## Workflow Execution Problems

### Error: "Cannot read property 'json' of undefined"

**Cause:** A node is trying to access data that doesn't exist from a previous node

**Common Scenarios:**

1. **Google Sheets is empty:**
   ```
   Solution: Add headers to PostHistory sheet:
   - Row 1: Timestamp | Topic | PostText | ImageCredit | Status
   ```

2. **Previous node failed:**
   ```
   Solution: 
   - Check execution logs for the previous node
   - Fix the issue in the failing node
   - Re-run the workflow
   ```

3. **Node reference is wrong:**
   ```
   Solution:
   - Check that all node names match the references in expressions
   - Example: $('Topic Selector with Rotation').item.json.topic
   - Ensure node names haven't been changed
   ```

---

### Error: "Workflow did not return data"

**Cause:** Last node in the workflow didn't output any data

**Solution:**
1. Check the last node executed successfully
2. Verify the "Log to Google Sheets" node has:
   - Correct sheet ID
   - Valid data to append
   - Proper column mapping
3. Check execution logs for errors

---

### Error: "Node X is not defined"

**Cause:** Workflow is referencing a node that doesn't exist or has been renamed

**Solution:**
1. Open the workflow in n8n
2. Click on the node showing the error
3. Check expressions like `$('Node Name').item.json.field`
4. Ensure the node name in quotes matches the actual node name exactly
5. If a node was renamed, update all references

---

### Workflow Doesn't Run on Schedule

**Causes & Solutions:**

1. **Workflow not activated:**
   - Check the toggle at the top of the workflow is ON
   - Active workflows show in green

2. **n8n not running (self-hosted):**
   ```bash
   # Check if n8n is running
   ps aux | grep n8n
   
   # Start n8n if not running
   n8n start
   # or with Docker:
   docker start n8n
   ```

3. **Schedule trigger misconfigured:**
   - Open the "Schedule Every 2 Days" node
   - Verify the interval settings
   - Check timezone settings

4. **Execution is queued:**
   - Go to Executions → Check "Waiting"
   - May be waiting for other workflows if on free plan

5. **n8n Cloud plan limits:**
   - Free plan: 5,000 workflow executions/month
   - Check your usage in Settings → Usage

---

## Data Issues

### Google Sheets Not Updating

**Symptoms:** Workflow completes but data doesn't appear in Google Sheets

**Causes & Solutions:**

1. **Wrong spreadsheet or tab:**
   - Verify `GOOGLE_SHEETS_DOC_ID` is correct
   - Check tab name matches exactly (case-sensitive)
   - Default tab: "PostHistory"

2. **Permissions issue:**
   - Open the Google Sheet
   - Click Share → Add the OAuth email as Editor
   - Verify the credential has write permissions

3. **Data mapping issue:**
   - Open "Log to Google Sheets" node
   - Check column mapping
   - Ensure columns match the headers in your sheet

4. **API quota exceeded:**
   - Unlikely with this workflow
   - Check [Google API Console](https://console.cloud.google.com/) for quota status

---

### Topics Keep Repeating

**Cause:** Topic rotation logic isn't working correctly

**Solution:**
1. Check Google Sheets PostHistory tab:
   - Verify topics are being logged correctly
   - Column B should contain topic names
2. Ensure header row exists (row 1)
3. Open "Topic Selector with Rotation" node
4. Verify the code has access to posted topics
5. Test by executing the node in isolation

---

### Images Not Posting

**Causes & Solutions:**

1. **Unsplash API failure:**
   - Check Unsplash API key is valid
   - Verify rate limits not exceeded
   - Workflow should use fallback image

2. **Image download failed:**
   - Check "Download Image" node logs
   - Verify internet connectivity
   - Ensure image URL is valid

3. **LinkedIn upload issue:**
   - Check file size (max 5MB for LinkedIn)
   - Verify image format is supported (JPG, PNG)
   - Check LinkedIn API errors in execution logs

---

## n8n Platform Issues

### n8n Won't Start (Self-Hosted)

**Docker Issues:**
```bash
# Check Docker is running
docker ps

# Check n8n container logs
docker logs n8n

# Remove and recreate container
docker rm n8n
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

**npm Issues:**
```bash
# Check Node.js version (requires 14.15+)
node --version

# Reinstall n8n
npm uninstall n8n -g
npm install n8n -g

# Clear npm cache
npm cache clean --force

# Start n8n
n8n start
```

---

### Environment Variables Not Loading

**Self-Hosted:**
1. Check `.env` file location:
   - Should be in n8n root directory
   - Usually `~/.n8n/.env`
2. Verify file format:
   - No spaces around `=`
   - No quotes around values (unless value contains spaces)
   - One variable per line
3. Restart n8n after changes

**n8n Cloud:**
1. Go to Settings → Environment Variables
2. Verify all variables are added
3. Check for typos in variable names
4. Variables take effect immediately (no restart needed)

---

### Credentials Not Working

**Reset Credentials:**
1. Go to Credentials in n8n
2. Find the problematic credential
3. Click "..." → Delete
4. Recreate the credential from scratch
5. Update all nodes using this credential

**OAuth Credentials:**
- Delete and recreate if connection fails
- Ensure redirect URIs match exactly
- Check OAuth app settings in provider dashboard
- Verify all required scopes are granted

---

## Debugging Tips

### Enable Detailed Logging

**In Workflow Settings:**
1. Click Settings (gear icon)
2. Enable:
   - "Save Execution Progress"
   - "Save Manual Executions"
   - "Save Successful Executions"
3. Set "Execution Data Retention": 30 days

**View Execution Logs:**
1. Go to Executions in left sidebar
2. Click on any execution
3. Click on each node to see:
   - Input data
   - Output data
   - Error messages
   - Execution time

---

### Test Individual Nodes

**Isolate Problems:**
1. Right-click on a node → "Execute Node"
2. This runs only that node with previous data
3. Check the output
4. Fix issues before running full workflow

**Test with Sample Data:**
1. Add a "Set" node before the problematic node
2. Manually set the input data
3. Test the node with known good data
4. Compare with actual workflow data

---

### Check API Calls

**Use Browser DevTools:**
1. Open n8n in browser
2. Open Developer Tools (F12)
3. Go to Network tab
4. Execute workflow
5. Filter by XHR/Fetch
6. Check API requests and responses

**Test APIs Directly:**
```bash
# Test Tavily API
curl -X POST https://api.tavily.com/search \
  -H "Content-Type: application/json" \
  -d '{"api_key":"YOUR_KEY","query":"machine learning","max_results":3}'

# Test Unsplash API
curl "https://api.unsplash.com/search/photos?query=ai&per_page=1" \
  -H "Authorization: Client-ID YOUR_ACCESS_KEY"

# Test Groq API
curl -X POST https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"llama-3.3-70b-versatile","messages":[{"role":"user","content":"Hello"}]}'
```

---

### Common Expression Errors

**Error: "Cannot read property 'X' of undefined"**
```javascript
// Wrong:
{{ $json.data.field }}

// Right (with null check):
{{ $json?.data?.field || 'default' }}
```

**Error: "JSON.parse unexpected token"**
```javascript
// Wrong:
{{ JSON.parse($json.text) }}

// Right (already parsed):
{{ $json.text }}
```

**Error: "map is not a function"**
```javascript
// Wrong (not an array):
{{ $json.results.map(x => x.name) }}

// Right (ensure it's an array):
{{ ($json.results || []).map(x => x.name) }}
```

---

### Performance Issues

**Workflow Runs Slowly:**

1. **Check API response times:**
   - Tavily: Usually < 2 seconds
   - Groq: 2-5 seconds for generation
   - Unsplash: < 1 second
   - LinkedIn: 2-3 seconds

2. **Optimize nodes:**
   - Remove unnecessary "Set" nodes
   - Combine similar operations
   - Use pagination wisely

3. **Check n8n server:**
   - Ensure adequate resources (RAM, CPU)
   - Check other workflows aren't overloading
   - Review n8n logs for performance warnings

---

## Getting Additional Help

### Before Asking for Help

Prepare this information:

1. **n8n Version:**
   ```
   n8n version (check in Settings → About)
   ```

2. **Environment:**
   - n8n Cloud or self-hosted?
   - If self-hosted: OS, Docker/npm, Node.js version

3. **Error Details:**
   - Full error message
   - Node that failed
   - Execution ID
   - Steps to reproduce

4. **What You've Tried:**
   - List troubleshooting steps already attempted
   - Include results of tests

---

### Support Channels

1. **n8n Community Forum:**
   - [community.n8n.io](https://community.n8n.io/)
   - Search existing topics first
   - Include workflow ID or screenshots

2. **n8n Documentation:**
   - [docs.n8n.io](https://docs.n8n.io/)
   - Comprehensive guides and references

3. **GitHub Issues:**
   - [This repository's issues](https://github.com/thatjelvin/linkedin-automation/issues)
   - For workflow-specific problems

4. **API Provider Support:**
   - [Groq Discord](https://discord.gg/groq)
   - [Tavily Support](https://tavily.com/support)
   - [LinkedIn Developer Forums](https://www.linkedin.com/developers/)

---

### Create a Minimal Reproduction

If you need to share your issue:

1. **Create a simplified workflow:**
   - Keep only the problematic node
   - Remove sensitive data
   - Use sample data

2. **Export the workflow:**
   - Click menu → Export → JSON
   - Share the JSON file

3. **Screenshot the error:**
   - Capture the full error message
   - Include the node configuration

---

## Preventive Maintenance

### Weekly Checks

- ✅ Verify workflow is running on schedule
- ✅ Check Google Sheets for new entries
- ✅ Review error logs
- ✅ Verify LinkedIn posts are publishing

### Monthly Checks

- ✅ Review API usage across all services
- ✅ Check credential expiration
- ✅ Update topic list if needed
- ✅ Verify all free tiers are sufficient
- ✅ Test error handling manually

### Quarterly Checks

- ✅ Audit all credentials
- ✅ Rotate API keys
- ✅ Update n8n to latest version
- ✅ Review and optimize workflow
- ✅ Backup workflow JSON

---

## Quick Reference: Error Codes

| Error Code | Service | Common Cause | Quick Fix |
|------------|---------|--------------|-----------|
| 401 | Any API | Invalid credentials | Regenerate API key |
| 403 | LinkedIn/Google | Insufficient permissions | Check OAuth scopes |
| 404 | Any API | Resource not found | Verify IDs/URLs |
| 429 | Any API | Rate limit exceeded | Wait for reset |
| 500 | Any API | Server error | Retry later |
| 502/503 | Any API | Service unavailable | Check provider status |

---

**Still stuck?** Open an issue on [GitHub](https://github.com/thatjelvin/linkedin-automation/issues) with your error details!
