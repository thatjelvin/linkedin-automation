# 🤖 LinkedIn AI/ML Learning Content Automation

[![n8n](https://img.shields.io/badge/n8n-workflow-orange)](https://n8n.io)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?logo=linkedin)](https://www.linkedin.com/in/jelvin-byamukama)

> **Automating AI education, one LinkedIn post at a time** 🚀

A fully automated n8n workflow that generates and publishes engaging LinkedIn content about AI and Machine Learning—because staying consistent with educational content shouldn't require a full-time social media manager (or a trust fund for API keys).

## 📖 The Story Behind This

As someone actively learning machine learning, I wanted to share my journey and help others break into the field. But let's be real—manually creating daily LinkedIn posts while juggling learning, coding, and, you know, *life* is exhausting.

So I built this workflow to:
- **Automate the entire content creation pipeline** from topic selection to posting
- **Share genuinely helpful, free resources** for aspiring ML engineers
- **Stay current** with the latest AI trends and developments
- **Do it all without breaking the bank** (hence the creative use of free APIs 😉)

**Check out the live posts in action:** [linkedin.com/in/jelvin-byamukama](https://www.linkedin.com/in/jelvin-byamukama)

---

## ✨ Features

### 🎯 Intelligent Topic Rotation
- **15 comprehensive AI/ML topics** covering everything from Python basics to LLMs
- **Smart rotation system** that tracks posted topics and never repeats until all topics are covered
- **Curated free learning resources** for each topic (because quality education shouldn't cost a fortune)

### 🌐 Real-Time Trend Integration
- Fetches **latest developments and trends** using Tavily API
- **Dynamic year handling** - automatically searches current year (e.g., 2026) and next year
- Keeps content **fresh and relevant** with current industry insights
- Connects learners to what's actually happening in AI *right now*

### 🤖 AI-Powered Content Generation
- **Groq's Llama 3.3 70B model** (free tier FTW!) generates engaging, educational posts
- **Dynamic year references** - posts always mention current year and trends
- Professionally crafted prompts for **consistent quality**
- Educational tone that's **accessible yet professional**

### 🖼️ Dynamic Visual Content
- **Unsplash integration** for high-quality, royalty-free images
- Automatic image selection based on topic relevance
- **Images included in LinkedIn posts** - text and visuals together
- Proper photographer attribution (because we respect creators)
- Binary data preservation through the workflow pipeline

### 📊 Complete Activity Tracking
- **Google Sheets logging** of all published posts
- Topic rotation tracking to ensure content diversity
- Error monitoring with email alerts
- Full audit trail of your automation journey

### ⚡ Fully Automated Pipeline
- Runs **every 2 days** at 10 AM (configurable)
- From topic selection to LinkedIn posting—completely hands-free
- Error handling with notifications to keep you in the loop
- **Smart initialization**: Works seamlessly on first run even with empty Google Sheets

### 🆕 First-Time Setup Friendly
- **Zero-configuration start**: The workflow automatically handles empty Google Sheets on first run
- **Graceful error handling**: "Read Post History" node continues even if the sheet is empty
- **Progressive learning**: Starts posting immediately and builds up topic history over time
- **Topic tracking**: After each post, the topic is logged to prevent repetition
- **Automatic reset**: Once all 15 topics are covered, rotation starts over with fresh content

---

## 🛠️ Tech Stack

| Service | Purpose | Cost |
|---------|---------|------|
| **n8n** | Workflow automation engine | Self-hosted (free) |
| **Groq** | LLM inference (Llama 3.3 70B) | Free tier ✅ |
| **Tavily API** | Real-time AI news & trends | Free tier ✅ |
| **Unsplash** | Professional stock images | Free with attribution ✅ |
| **Google Sheets** | Post history & error logging | Free ✅ |
| **LinkedIn API** | Post publishing | Free ✅ |

**Total recurring cost: $0/month** 💸

---

## 🚀 Quick Start

### Prerequisites
- n8n instance (self-hosted or n8n Cloud)
- LinkedIn Developer account
- Google Cloud account (for Sheets API)
- Unsplash Developer account
- Groq API account (free)
- Tavily API account (free)

### 1. Clone This Repository
```bash
git clone https://github.com/YOUR_USERNAME/linkedin-ai-ml-automation.git
cd linkedin-ai-ml-automation
```

### 2. Set Up Google Sheets

The workflow requires a Google Sheet with two sheets (tabs):

#### PostHistory Sheet
Create a sheet named `PostHistory` (or custom name via `GOOGLE_SHEETS_SHEET_NAME` env variable) with the following columns:
- **Timestamp**: When the post was published
- **Topic**: The AI/ML topic that was covered
- **PostText**: The full text of the LinkedIn post
- **ImageCredit**: Photographer attribution
- **Status**: Publishing status (e.g., "Published")

**Important**: The sheet can be completely empty on first run! The workflow will automatically:
1. Handle the empty state gracefully
2. Select a random topic from the 15 available topics
3. Create and publish the post
4. Log the topic to prevent future repetition

#### ErrorLog Sheet
Create a sheet named `ErrorLog` with the following columns:
- **Timestamp**: When the error occurred
- **Workflow**: Workflow name
- **FailedNode**: Which node failed
- **ErrorMessage**: Error details

### 3. Import Workflow to n8n

1. Open your n8n instance
2. Click "Workflows" → "Import from File"
3. Select `linkedin-ai-ml-learning-workflow.json`
4. Configure credentials for each service (see below)

### 4. Configure Credentials

Set up the following credentials in n8n:

- **Google Sheets OAuth2**: For reading/writing post history
- **LinkedIn OAuth2**: For publishing posts
- **Groq API**: For AI content generation
- **Unsplash API**: For images
- **Tavily API**: For trend research
- **SMTP**: For error notifications (optional)

### 5. Set Environment Variables

Configure these environment variables in n8n:

```bash
# Required
GOOGLE_SHEETS_DOC_ID=your_google_sheet_id
LINKEDIN_PERSON_URN=your_linkedin_person_urn
GROQ_API_KEY=your_groq_api_key
UNSPLASH_ACCESS_KEY=your_unsplash_key
TAVILY_API_KEY=your_tavily_key

# Optional
GOOGLE_SHEETS_SHEET_NAME=PostHistory  # Default: 'PostHistory'
ALERT_EMAIL=your_email@example.com    # For error notifications
```

### 6. Activate the Workflow

1. Test the workflow manually first using the "Test Workflow" button
2. Once verified, activate the workflow to run automatically every 2 days

---

## 🔧 How It Works

### Workflow Flow

1. **Schedule Trigger**: Runs every 2 days at 10 AM
2. **Read Post History**: Fetches previously posted topics from Google Sheets (handles empty sheets)
3. **Topic Selector**: Intelligently selects an unposted topic or resets if all are covered
4. **Trend Research**: Fetches latest AI/ML developments using Tavily API
5. **AI Content Generation**: Creates engaging educational post using Groq/Llama
6. **Image Search**: Finds relevant royalty-free image on Unsplash
7. **Post to LinkedIn**: Publishes the complete post with image
8. **Log to Sheets**: Records the topic to prevent future repetition

### Error Handling

- Email notifications for failures
- Error logging to Google Sheets
- Graceful degradation for empty/missing data
- Continue-on-fail for sheet reading operations

---

## 💡 Key Features Explained

### Smart Topic Rotation

The workflow includes 15 diverse AI/ML topics and intelligently rotates through them:

- On first run (empty sheet): Randomly selects from all 15 topics
- On subsequent runs: Only selects from topics not yet posted
- After all topics covered: Resets and starts rotation again
- **No manual intervention needed** - fully automatic topic management

### First-Time Setup Handling

The workflow is designed to work immediately, even with an empty Google Sheet:

```javascript
// Robust error handling in Topic Selector
try {
  const inputData = $input.first()?.json;
  if (Array.isArray(inputData)) {
    postedTopics = inputData.map(row => row?.Topic).filter(Boolean);
  } else if (inputData && typeof inputData === 'object' && inputData.Topic) {
    postedTopics = [inputData.Topic];
  }
} catch (error) {
  console.log('Starting fresh - no previous post history found');
  postedTopics = [];
}
```

This ensures the workflow never fails due to missing historical data.

---

## 📚 Additional Resources

- [n8n Documentation](https://docs.n8n.io/)
- [n8n-MCP for AI-Assisted Workflow Building](https://github.com/czlonkowski/n8n-mcp)
- [LinkedIn API Documentation](https://learn.microsoft.com/en-us/linkedin/)
- [Groq API Documentation](https://groq.com/)
- [Complete Node Functionality Analysis](NODE_ANALYSIS.md) - Detailed analysis of all 18 workflow nodes
- [Tavily Search Documentation](TAVILY_SEARCH.md) - How Tavily searches for topics with dynamic year handling
- [LinkedIn Image Posting Fix](IMAGE_POSTING_FIX.md) - How images are included in LinkedIn posts

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new AI/ML topics
- Improve the content generation prompts
- Add new features

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Built with [n8n](https://n8n.io/) - the amazing workflow automation platform
- Uses [Groq](https://groq.com/) for blazing-fast AI inference
- Images from [Unsplash](https://unsplash.com/) and their amazing photographers
- Trend data from [Tavily](https://tavily.com/)

---

**Made with ❤️ by [Jelvin Byamukama](https://www.linkedin.com/in/jelvin-byamukama) | Helping aspiring ML engineers learn for free**

### 🔄 Data Stream Merging
- **n8n Merge node** combines text and image streams
- Proper separation of text generation and image download pipelines
- Standard n8n pattern for combining multiple data sources
- Clean workflow architecture with explicit merge point

