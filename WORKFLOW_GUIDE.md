# 📘 Workflow Usage Guide

This guide explains how to use, customize, and maintain the LinkedIn AI/ML automation workflow.

## Table of Contents

- [Importing the Workflow](#importing-the-workflow)
- [Understanding the Workflow](#understanding-the-workflow)
- [Running the Workflow](#running-the-workflow)
- [Customization Options](#customization-options)
- [Monitoring and Analytics](#monitoring-and-analytics)
- [Best Practices](#best-practices)

---

## Importing the Workflow

### Step 1: Download the Workflow

The workflow file is `linkedin-ai-ml-learning-workflow.json` in this repository.

### Step 2: Import to n8n

1. Open your n8n instance
2. Click the "+" button to create a new workflow
3. Click the three-dot menu (⋮) in the top right
4. Select "Import from File"
5. Choose `linkedin-ai-ml-learning-workflow.json`
6. Click "Import"

### Step 3: Configure Credentials

After importing, you'll see nodes with missing credentials (marked with ⚠️ icons):

#### Credentials to Configure:

1. **Google Sheets OAuth2** (used by 3 nodes):
   - "Read Post History"
   - "Log to Google Sheets"
   - "Log Error to Sheets"
   - Configuration: See [SETUP.md - Google Sheets OAuth2](SETUP.md#5-google-sheets-oauth2-authentication-required)

2. **Groq API** (used by 1 node):
   - "Groq Chat Model"
   - Configuration: See [SETUP.md - Groq API](SETUP.md#1-groq-api-free---ai-content-generation)

3. **LinkedIn OAuth2** (used by 1 node):
   - "Post to LinkedIn"
   - Configuration: See [SETUP.md - LinkedIn OAuth2](SETUP.md#4-linkedin-oauth2-authentication-required)

4. **SMTP** (optional, used by 1 node):
   - "Send Error Alert Email"
   - Configuration: See [SETUP.md - SMTP Email](SETUP.md#6-smtp-email-optional---for-error-alerts)

#### How to Assign Credentials:

1. Click on a node with a missing credential
2. In the right panel, find the "Credential" dropdown
3. Click "Create New"
4. Follow the credential setup wizard
5. Save the credential
6. Repeat for all nodes needing credentials

### Step 4: Verify Environment Variables

Ensure all environment variables are set:

```bash
# Run the validation script
npm run validate

# Or directly:
node validate-setup.js
```

The script will check:
- ✅ All required environment variables are set
- ✅ API keys are valid
- ✅ Formats are correct

### Step 5: Save and Activate

1. Click "Save" in the top right
2. Give your workflow a name (e.g., "LinkedIn AI/ML Automation")
3. Toggle the switch to "Active" (turns green)

---

## Understanding the Workflow

### Workflow Structure

The workflow consists of two main branches:

1. **Main Execution Branch** - Creates and posts content
2. **Error Handling Branch** - Handles failures

### Main Execution Branch

```
Schedule Trigger
    ↓
Read Post History (Google Sheets)
    ↓
Topic Selector with Rotation (Code)
    ↓
Search Topic Trends (Tavily API)
    ↓
Preserve Context Data (Set)
    ↓
Groq AI Content Agent (LangChain)
    ↓
Set Post Content (Set)
    ↓
Search Unsplash Images (HTTP Request)
    ↓
Process Image Selection (Code)
    ↓
Download Image (HTTP Request)
    ↓
Prepare Final Data (Set)
    ↓
Post to LinkedIn
    ↓
Log to Google Sheets
```

### Error Handling Branch

```
Error Trigger
    ↓
Format Error Data
    ↓
├─→ Send Error Alert Email
└─→ Log Error to Sheets
```

### Node Descriptions

#### 1. Schedule Every 2 Days
- **Type:** Schedule Trigger
- **Configuration:**
  - Runs every 2 days
  - At 10:00 AM
  - In your server's timezone
- **Customizable:** Yes (see Customization section)

#### 2. Read Post History
- **Type:** Google Sheets
- **Purpose:** Reads all previously posted topics
- **Sheet:** PostHistory tab
- **Output:** Array of rows with columns: Timestamp, Topic, PostText, ImageCredit, Status

#### 3. Topic Selector with Rotation
- **Type:** JavaScript Code
- **Purpose:** 
  - Maintains a list of 15 AI/ML topics
  - Selects a topic that hasn't been posted yet
  - Resets rotation when all topics are covered
- **Output:** Selected topic with description and resources

#### 4. Search Topic Trends
- **Type:** HTTP Request to Tavily API
- **Purpose:** Fetches latest news and trends about the selected topic
- **Configuration:**
  - Max results: 3
  - Search depth: Advanced
- **Output:** Array of relevant articles with titles and content

#### 5. Preserve Context Data
- **Type:** Set node
- **Purpose:** Combines topic data and trends for the AI agent
- **Output:** Object with topic, description, resources, and trends

#### 6. Groq AI Content Agent
- **Type:** LangChain Agent with Groq model
- **Purpose:** Generates the LinkedIn post content
- **Model:** Llama 3.3 70B Versatile
- **Temperature:** 0.7 (balanced creativity)
- **Max Tokens:** 1000
- **Output:** Complete LinkedIn post text

#### 7. Set Post Content
- **Type:** Set node
- **Purpose:** Extracts and structures the generated post
- **Output:** Post text and topic

#### 8. Search Unsplash Images
- **Type:** HTTP Request
- **Purpose:** Finds relevant images for the post
- **Configuration:**
  - Per page: 5
  - Orientation: Landscape
- **Output:** Array of image results

#### 9. Process Image Selection
- **Type:** JavaScript Code
- **Purpose:** 
  - Selects the best image from results
  - Falls back to default image if no results
  - Extracts photographer attribution
- **Output:** Image URL, description, and credits

#### 10. Download Image
- **Type:** HTTP Request
- **Purpose:** Downloads the selected image as binary data
- **Configuration:** Response format: File
- **Output:** Binary image data

#### 11. Prepare Final Data
- **Type:** Set node
- **Purpose:** Combines all data for posting and logging
- **Output:** Post text, topic, image data, timestamp, credits

#### 12. Post to LinkedIn
- **Type:** LinkedIn node
- **Purpose:** Publishes the post to your LinkedIn profile
- **Configuration:**
  - Person URN: Your LinkedIn profile
  - Media: Image attachment
- **Output:** LinkedIn post response with post ID

#### 13. Log to Google Sheets
- **Type:** Google Sheets
- **Purpose:** Records the published post
- **Sheet:** PostHistory tab
- **Configuration:** Append mode
- **Output:** Updated sheet confirmation

### Error Handling Nodes

#### Error Trigger
- **Type:** Error Trigger
- **Purpose:** Catches any error from the main workflow
- **Output:** Error details including node name and message

#### Format Error Data
- **Type:** Set node
- **Purpose:** Structures error information for logging
- **Output:** Formatted error object

#### Send Error Alert Email
- **Type:** Email Send (SMTP)
- **Purpose:** Sends email notification of failure
- **Configuration:** Uses ALERT_EMAIL environment variable

#### Log Error to Sheets
- **Type:** Google Sheets
- **Purpose:** Records error in ErrorLog tab
- **Sheet:** ErrorLog
- **Configuration:** Append mode

---

## Running the Workflow

### Manual Execution (Testing)

1. Open the workflow in n8n
2. Click "Execute Workflow" button in the top right
3. Watch each node execute in sequence
4. Click on any node to see its input/output data
5. Check for green checkmarks (✓) on all nodes

**Best Practice:** Always test manually before activating!

### Scheduled Execution

Once activated, the workflow runs automatically based on the schedule:

- **Default:** Every 2 days at 10:00 AM
- **Timezone:** Your server's timezone
- **Execution:** Fully automated

### Testing Individual Nodes

To test a specific node without running the entire workflow:

1. Execute the workflow up to the node you want to test
2. Right-click on the node
3. Select "Execute Node"
4. View the output

This is useful for:
- Testing API connections
- Debugging specific logic
- Verifying data transformations

### Viewing Execution History

1. Click "Executions" in the left sidebar
2. View list of all workflow runs
3. Click on any execution to see:
   - Execution time
   - Status (Success/Failed)
   - Data flow through each node
   - Error messages (if any)

---

## Customization Options

### 1. Change Posting Frequency

**Location:** "Schedule Every 2 Days" node

**Options:**
```javascript
// Daily at 10 AM
{
  "daysInterval": 1,
  "triggerAtHour": 10,
  "triggerAtMinute": 0
}

// Weekly on Mondays at 9 AM
{
  "daysInterval": 7,
  "triggerAtHour": 9,
  "triggerAtMinute": 0
}

// Every 3 days at 2 PM
{
  "daysInterval": 3,
  "triggerAtHour": 14,
  "triggerAtMinute": 0
}
```

**Recommendations:**
- **Daily:** For high-frequency content creators
- **Every 2 days:** Balanced (current default)
- **Weekly:** For thought leadership posts
- **Every 3 days:** Good middle ground

### 2. Add Custom Topics

**Location:** "Topic Selector with Rotation" node

**How to Add:**

1. Open the node
2. Find the `topics` array in the code
3. Add a new object:

```javascript
{
  "main": "Your Topic Name",
  "description": "Brief description of what this topic covers",
  "resources": [
    "Free Resource 1",
    "Free Resource 2",
    "Free Resource 3",
    "Free Resource 4"
  ]
}
```

**Example - Adding "Edge AI":**

```javascript
{
  "main": "Edge AI and TinyML",
  "description": "Running AI models on edge devices and microcontrollers",
  "resources": [
    "TensorFlow Lite tutorials",
    "Edge Impulse documentation",
    "TinyML Foundation courses",
    "Arduino Machine Learning examples"
  ]
}
```

### 3. Modify Post Style

**Location:** "Groq AI Content Agent" node

**Current Prompt Structure:**
```
Topic: {{ $json.topic }}
Description: {{ $json.description }}

Free Resources:
{{ $json.resources.join('\n') }}

Latest Trends:
{{ $json.trends.map(t => `- ${t.title}: ${t.content}`).join('\n') }}

Create an engaging LinkedIn post that:
1. Starts with a hook about why this topic matters in 2025
2. Explains the best way to learn {{ $json.topic }} for beginners
3. Lists 3-4 top FREE resources with brief descriptions
4. Mentions current trends or applications
5. Ends with motivation and call-to-action
6. Includes 3-5 relevant hashtags
7. Uses 2-3 emojis maximum for engagement

Tone: Educational, encouraging, professional yet accessible
```

**Customization Examples:**

**More Professional:**
```
Tone: Formal, technical, industry-focused
Remove: Emojis directive
Add: Include relevant statistics or research
```

**More Casual:**
```
Tone: Friendly, conversational, relatable
Change: Uses 5-8 emojis for maximum engagement
Add: Include a personal anecdote
```

**Shorter Posts:**
```
Change: Create a concise LinkedIn post (max 500 characters) that:
1. Hook (one sentence)
2. Core insight
3. One key resource
4. Call-to-action
```

**Thread Style:**
```
Add: Format as a thread with numbered points
Example: "1/5 Thread: Here's why [topic] matters..."
```

### 4. Change AI Model

**Location:** "Groq Chat Model" node

**Available Models:**

| Model | Best For | Speed | Quality |
|-------|----------|-------|---------|
| `llama-3.3-70b-versatile` | General content | Medium | High |
| `llama-3.1-70b-versatile` | Versatile tasks | Medium | High |
| `llama-3.1-8b-instant` | Quick responses | Fast | Good |
| `mixtral-8x7b-32768` | Technical content | Medium | High |

**How to Change:**
1. Open "Groq Chat Model" node
2. Change the "Model" field
3. Adjust parameters if needed:
   - Temperature: 0.1-1.0 (lower = more focused)
   - Max Tokens: 100-2000 (length of response)

### 5. Customize Image Selection

**Location:** "Process Image Selection" node

**Options:**

**Prioritize specific image attributes:**
```javascript
// Filter for high-resolution images only
const selectedImage = results
  .filter(img => img.width >= 1920)
  .sort((a, b) => b.likes - a.likes)[0];
```

**Always use specific photographer:**
```javascript
// Prefer images from specific photographers
const preferredPhotographers = ['John Doe', 'Jane Smith'];
const selectedImage = results.find(img => 
  preferredPhotographers.includes(img.user.name)
) || results[0];
```

**Random selection:**
```javascript
// Select a random image instead of first
const randomIndex = Math.floor(Math.random() * results.length);
const selectedImage = results[randomIndex];
```

### 6. Add Hashtag Strategy

**Location:** "Groq AI Content Agent" prompt

**Options:**

**Trending hashtags:**
```
Add: Include these trending hashtags: #AI2025 #MachineLearning #TechTrends
```

**Niche hashtags:**
```
Add: Focus on niche hashtags specific to the topic
Example for Python: #Python #PythonProgramming #LearnPython #PythonTips
```

**Branded hashtags:**
```
Add: Always include your branded hashtag: #YourBrandLearns
```

---

## Monitoring and Analytics

### Google Sheets Dashboard

Your PostHistory sheet contains all published posts. Add analytics:

**Column F - Views:**
- Manually add view counts from LinkedIn

**Column G - Engagement:**
- Calculate engagement rate: (Likes + Comments + Shares) / Views

**Column H - Date Posted:**
- Extract date from Timestamp

**Create Analytics:**
```
=AVERAGE(G2:G100)  // Average engagement
=COUNTIF(E2:E100,"Published")  // Total posts
=MAX(G2:G100)  // Best performing post
```

### Weekly Review Process

1. **Monday Morning:**
   - Review last week's posts in Google Sheets
   - Check LinkedIn analytics for engagement
   - Note top-performing topics

2. **Mid-Week:**
   - Check ErrorLog for any failures
   - Verify scheduled executions are running
   - Monitor API usage

3. **Friday:**
   - Analyze engagement trends
   - Plan topic adjustments if needed
   - Update resources if links are broken

### Key Metrics to Track

- **Posting Consistency:** % of scheduled posts that succeeded
- **Topic Performance:** Which topics get the most engagement
- **Engagement Rate:** Likes + Comments per post
- **Follower Growth:** Weekly follower increase
- **Resource Clicks:** Track link clicks in LinkedIn analytics

---

## Best Practices

### Content Strategy

1. **Maintain Variety:**
   - Let the rotation system work naturally
   - Don't force similar topics consecutively

2. **Stay Current:**
   - Tavily API ensures trend relevance
   - Manually update resources quarterly

3. **Engage Authentically:**
   - Respond to comments on automated posts
   - Share personal insights in comments
   - Use automation to enhance, not replace, engagement

4. **Monitor Quality:**
   - Review generated posts weekly
   - Adjust AI prompt if quality drifts
   - Update topic descriptions as field evolves

### Technical Best Practices

1. **Backup Regularly:**
   - Export workflow JSON monthly
   - Keep backup of Google Sheets
   - Document any customizations

2. **API Key Rotation:**
   - Rotate API keys quarterly
   - Test after rotation
   - Keep old keys for 1 week during transition

3. **Error Monitoring:**
   - Check ErrorLog weekly
   - Set up email alerts
   - Investigate recurring errors promptly

4. **Version Control:**
   - Keep workflow versions when making changes
   - Test changes in a copy first
   - Document what each version changed

### LinkedIn Best Practices

1. **Optimal Posting Times:**
   - B2B: Tuesday-Thursday, 8-10 AM, 12 PM, 5-6 PM
   - B2C: Wednesday, 12-1 PM, 5-6 PM
   - Adjust schedule based on your audience

2. **Engagement Tactics:**
   - Ask questions in posts to drive comments
   - Include clear call-to-action
   - Tag relevant organizations (use mentions)

3. **Content Mix:**
   - 80% educational (automated)
   - 20% personal insights (manual)
   - Occasional industry news commentary

### Troubleshooting Checklist

**Before Every Month:**
- [ ] Verify workflow is active
- [ ] Check all credentials are valid
- [ ] Review Google Sheets for gaps
- [ ] Test manual execution
- [ ] Check API usage against limits

**If Posting Fails:**
1. Check execution logs
2. Verify all credentials
3. Test APIs with validation script
4. Review ErrorLog in Google Sheets
5. See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## Advanced Usage

### A/B Testing Post Styles

Create two versions of the workflow:
1. Version A: Current prompt style
2. Version B: Alternative style
3. Run each for 2 weeks
4. Compare engagement in Google Sheets
5. Use the better-performing style

### Multi-Platform Support

Extend the workflow to post to multiple platforms:

**Add Twitter/X Node:**
1. After "Prepare Final Data"
2. Add Twitter node
3. Modify post text for Twitter (280 char limit)
4. Post to both platforms

**Add Medium Article:**
1. Generate longer-form content with Groq
2. Use Medium API to publish
3. Share Medium link on LinkedIn

### Personalization Engine

Add dynamic personalization:

**User Engagement History:**
```javascript
// In Topic Selector
const highEngagementTopics = ['Python for AI', 'Deep Learning'];
const selectedTopic = highEngagementTopics.includes(topic) 
  ? getRelatedTopic(topic) 
  : getRandomTopic();
```

**Seasonal Content:**
```javascript
// Adjust topics by season
const month = new Date().getMonth();
if (month === 8 || month === 9) {
  // Back to school season - focus on learning basics
  topics = topics.filter(t => t.main.includes('Fundamentals'));
}
```

---

## FAQ

**Q: Can I run multiple workflows for different LinkedIn accounts?**
A: Yes! Duplicate the workflow and use different credentials for each.

**Q: How do I pause the automation temporarily?**
A: Toggle the workflow to "Inactive" at the top of the workflow editor.

**Q: Can I manually trigger a post outside the schedule?**
A: Yes! Click "Execute Workflow" to run immediately.

**Q: What happens if a post fails?**
A: The error is logged to Google Sheets and an email is sent (if configured). The workflow will retry on the next scheduled run.

**Q: Can I edit a post after it's generated but before posting?**
A: Not automatically, but you can:
1. Add a "Wait" node before posting
2. Disable auto-posting
3. Review in Google Sheets and manually post

**Q: How do I know which topic will be posted next?**
A: Check PostHistory in Google Sheets - the workflow selects topics that haven't been posted yet.

---

## Getting Help

- **Setup Issues:** See [SETUP.md](SETUP.md)
- **Errors:** See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Questions:** [Open a GitHub Discussion](https://github.com/thatjelvin/linkedin-automation/discussions)
- **Bugs:** [Report an Issue](https://github.com/thatjelvin/linkedin-automation/issues)

---

**Happy Automating!** 🚀

Remember: Automation is a tool to enhance your presence, not replace genuine engagement. Keep the human touch alive! 🤝
