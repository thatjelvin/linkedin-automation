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
- Keeps content **fresh and relevant** with 2024/2025 industry insights
- Connects learners to what's actually happening in AI *right now*

### 🤖 AI-Powered Content Generation
- **Groq's Llama 3.3 70B model** (free tier FTW!) generates engaging, educational posts
- Professionally crafted prompts for **consistent quality**
- Educational tone that's **accessible yet professional**

### 🖼️ Dynamic Visual Content
- **Unsplash integration** for high-quality, royalty-free images
- Automatic image selection based on topic relevance
- Proper photographer attribution (because we respect creators)

### 📊 Complete Activity Tracking
- **Google Sheets logging** of all published posts
- Topic rotation tracking to ensure content diversity
- Error monitoring with email alerts
- Full audit trail of your automation journey

### ⚡ Fully Automated Pipeline
- Runs **every 2 days** at 10 AM (configurable)
- From topic selection to LinkedIn posting—completely hands-free
- Error handling with notifications to keep you in the loop

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

**📚 For detailed setup instructions, see [SETUP.md](SETUP.md)**

### Prerequisites
- n8n instance (self-hosted or n8n Cloud)
- LinkedIn Developer account
- Google Cloud account (for Sheets API)
- Unsplash Developer account
- Groq API account (free)
- Tavily API account (free)

### 1. Clone This Repository
```bash
git clone https://github.com/thatjelvin/linkedin-automation.git
cd linkedin-automation
```

### 2. Configure Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your API keys and credentials
# See SETUP.md for detailed instructions on obtaining each credential
```

### 3. Set Up Google Sheets
1. Create a new Google Sheet with two tabs:
   - **PostHistory** - Columns: Timestamp, Topic, PostText, ImageCredit, Status
   - **ErrorLog** - Columns: Timestamp, Workflow, FailedNode, ErrorMessage
2. Copy the Sheet Document ID from the URL
3. Add it to your `.env` file as `GOOGLE_SHEETS_DOC_ID`

### 4. Import Workflow to n8n
1. Open n8n and create a new workflow
2. Click menu → "Import from File"
3. Select `linkedin-ai-ml-learning-workflow.json`
4. Configure credentials for each node
5. Activate the workflow

**🔗 Complete step-by-step guide:** [SETUP.md](SETUP.md)

---

## 📖 Documentation

- **[SETUP.md](SETUP.md)** - Complete setup guide with detailed instructions for all credentials
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions
- **[n8n-mcp Reference](https://github.com/czlonkowski/n8n-mcp)** - Advanced n8n automation techniques

---

## 🔐 Required Credentials

This workflow requires the following credentials (all available with free tiers):

| Service | Type | Cost | Setup Guide |
|---------|------|------|-------------|
| **Groq** | API Key | Free ✅ | [SETUP.md#1-groq-api](SETUP.md#1-groq-api-free---ai-content-generation) |
| **Tavily** | API Key | Free ✅ | [SETUP.md#2-tavily-search-api](SETUP.md#2-tavily-search-api-free---trend-research) |
| **Unsplash** | API Key | Free ✅ | [SETUP.md#3-unsplash-api](SETUP.md#3-unsplash-api-free---images) |
| **LinkedIn** | OAuth2 | Free ✅ | [SETUP.md#4-linkedin-oauth2](SETUP.md#4-linkedin-oauth2-authentication-required) |
| **Google Sheets** | OAuth2 | Free ✅ | [SETUP.md#5-google-sheets-oauth2](SETUP.md#5-google-sheets-oauth2-authentication-required) |
| **SMTP Email** | Credentials | Free ✅ | [SETUP.md#6-smtp-email](SETUP.md#6-smtp-email-optional---for-error-alerts) (Optional) |

**Note:** OAuth2 credentials (LinkedIn and Google Sheets) must be configured directly in n8n's credential manager, not via environment variables.

---

## 🏗️ Architecture

### Workflow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        MAIN WORKFLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. Schedule Trigger (Every 2 days at 10 AM)                    │
│           ↓                                                       │
│  2. Read Post History from Google Sheets                         │
│           ↓                                                       │
│  3. Select Next Topic (Smart Rotation)                           │
│           ↓                                                       │
│  4. Search Latest Trends (Tavily API)                            │
│           ↓                                                       │
│  5. Generate Content (Groq AI - Llama 3.3 70B)                   │
│           ↓                                                       │
│  6. Find Relevant Image (Unsplash)                               │
│           ↓                                                       │
│  7. Download Image                                               │
│           ↓                                                       │
│  8. Post to LinkedIn                                             │
│           ↓                                                       │
│  9. Log to Google Sheets                                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      ERROR HANDLING                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Error Trigger (Catches any workflow failures)                   │
│           ↓                                                       │
│  Format Error Data                                               │
│           ↓                                                       │
│  ├──→ Send Email Alert                                           │
│  └──→ Log Error to Google Sheets                                 │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Node Details

#### 1. Schedule Trigger
- **Type:** Schedule Trigger
- **Frequency:** Every 2 days at 10:00 AM
- **Configurable:** Yes, adjust in node settings

#### 2. Read Post History
- **Type:** Google Sheets
- **Operation:** Read
- **Purpose:** Get list of previously posted topics
- **Credentials:** Google Sheets OAuth2

#### 3. Topic Selector with Rotation
- **Type:** Code (JavaScript)
- **Purpose:** Select next topic that hasn't been posted
- **Logic:** 
  - Maintains list of 15 AI/ML topics
  - Tracks posted topics from history
  - Selects random topic from unposted topics
  - Resets rotation when all topics are posted

#### 4. Search Topic Trends
- **Type:** HTTP Request
- **API:** Tavily Search
- **Purpose:** Get latest developments and trends
- **Credentials:** Tavily API Key (via environment variable)

#### 5. Groq AI Content Agent
- **Type:** LangChain Agent
- **Model:** Llama 3.3 70B Versatile
- **Temperature:** 0.7
- **Max Tokens:** 1000
- **Purpose:** Generate engaging LinkedIn post
- **Credentials:** Groq API

#### 6-7. Image Handling
- **Search:** Unsplash API
- **Download:** HTTP Request to get image binary
- **Fallback:** Default image if search fails
- **Credentials:** Unsplash Access Key (via environment variable)

#### 8. Post to LinkedIn
- **Type:** LinkedIn
- **Operation:** Create Post
- **Media:** Image attachment
- **Credentials:** LinkedIn OAuth2

#### 9. Log to Google Sheets
- **Type:** Google Sheets
- **Operation:** Append
- **Purpose:** Track all published posts
- **Credentials:** Google Sheets OAuth2

---

## 🎯 Topic Coverage

The workflow covers 15 comprehensive AI/ML topics:

1. **Python for AI** - Programming fundamentals
2. **Machine Learning Fundamentals** - Core ML concepts
3. **Deep Learning Basics** - Neural networks & architectures
4. **Natural Language Processing** - Text processing & LLMs
5. **Computer Vision** - Image processing & CNNs
6. **Data Science with Python** - NumPy, Pandas, visualization
7. **Mathematics for ML** - Linear algebra, calculus, stats
8. **TensorFlow and Keras** - Deep learning frameworks
9. **PyTorch** - Deep learning with PyTorch
10. **Scikit-Learn** - Classical ML algorithms
11. **Reinforcement Learning** - Agent-based learning
12. **MLOps and Deployment** - Production ML systems
13. **Generative AI** - GANs, VAEs, diffusion models
14. **Large Language Models** - GPT, BERT, fine-tuning
15. **Time Series Analysis** - Forecasting & sequential data

Each topic includes curated free learning resources!

---

## 🔄 How It Works

### Content Generation Process

1. **Topic Selection:** The workflow maintains a rotation of 15 topics, ensuring variety and preventing repetition
2. **Trend Research:** Tavily API fetches the latest developments in the selected topic
3. **AI Generation:** Groq's Llama 3.3 70B model creates an engaging post that includes:
   - Hook about why the topic matters in 2025
   - Best learning path for beginners
   - 3-4 top FREE resources
   - Current trends and applications
   - Motivation and call-to-action
   - Relevant hashtags and emojis
4. **Visual Selection:** Unsplash API finds a relevant, high-quality image
5. **Publishing:** Post is published to LinkedIn with the image
6. **Logging:** All details are logged to Google Sheets for tracking

### Smart Topic Rotation

- Tracks which topics have been posted
- Never repeats a topic until all 15 have been covered
- Automatically resets rotation after completing all topics
- Ensures diverse content for your audience

---

## 🛠️ Customization

### Change Posting Frequency

Edit the **Schedule Every 2 Days** node:
```javascript
{
  "daysInterval": 2,  // Change to 1, 3, 7, etc.
  "triggerAtHour": 10,  // 0-23 (24-hour format)
  "triggerAtMinute": 0  // 0-59
}
```

### Add Custom Topics

Edit the **Topic Selector with Rotation** node and add to the `topics` array:
```javascript
{
  "main": "Your Topic Name",
  "description": "What this topic covers",
  "resources": [
    "Free Resource 1",
    "Free Resource 2",
    "Free Resource 3"
  ]
}
```

### Modify Post Style

Edit the **Groq AI Content Agent** prompt to change:
- Tone (professional, casual, technical)
- Length (shorter or longer posts)
- Structure (different format)
- Emoji usage
- Hashtag strategy

### Use Different AI Models

In the **Groq Chat Model** node, change the model:
- `llama-3.3-70b-versatile` - Best for general content (current)
- `llama-3.1-8b-instant` - Faster, less detailed
- `mixtral-8x7b-32768` - Good for technical content

---

## 📊 Monitoring

### Google Sheets Tracking

**PostHistory Tab:**
- View all published posts
- Track topic rotation
- Monitor posting frequency
- Analyze engagement (manually add metrics)

**ErrorLog Tab:**
- Automatic error logging
- Failed node identification
- Error message details
- Timestamp of failures

### Email Alerts (Optional)

- Receive instant notifications of workflow failures
- Includes error details and failed node name
- Configure SMTP credentials in SETUP.md

---

## 🐛 Troubleshooting

### Common Issues

**"Unauthorized" errors:**
- Check API keys are valid and active
- Verify OAuth credentials are connected
- Ensure all environment variables are set

**"Cannot read property 'json' of undefined":**
- Previous node didn't return data
- Check Google Sheets has headers
- Verify all nodes executed successfully

**Workflow doesn't run on schedule:**
- Verify workflow is activated (toggle ON)
- Check n8n is running (self-hosted)
- Review n8n execution logs

**LinkedIn post fails:**
- Verify LinkedIn OAuth is connected
- Check Person URN is correct
- Ensure "Share on LinkedIn" product is enabled

**For detailed troubleshooting:** See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 🔒 Security & Privacy

- ✅ Never commit `.env` file to version control
- ✅ Use environment variables for sensitive data
- ✅ OAuth2 preferred over API keys
- ✅ Regular credential rotation recommended
- ✅ Enable 2FA on all accounts
- ✅ Monitor API usage for anomalies
- ✅ Keep n8n updated to latest version

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Ideas for Contributions

- Additional AI/ML topics
- Alternative AI models integration
- Enhanced error handling
- Analytics and performance tracking
- Multi-platform posting (Twitter, Medium, etc.)
- A/B testing for post styles
- Engagement tracking automation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **n8n** - For the amazing workflow automation platform
- **Groq** - For providing free access to powerful LLM inference
- **Tavily** - For real-time AI news and trends API
- **Unsplash** - For beautiful, free stock photography
- **[n8n-mcp](https://github.com/czlonkowski/n8n-mcp)** - For n8n automation best practices and inspiration

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/thatjelvin/linkedin-automation/issues)
- **Discussions:** [GitHub Discussions](https://github.com/thatjelvin/linkedin-automation/discussions)
- **LinkedIn:** [Jelvin Byamukama](https://www.linkedin.com/in/jelvin-byamukama)
- **n8n Community:** [community.n8n.io](https://community.n8n.io/)

---

## ⭐ Show Your Support

If this project helps you automate your LinkedIn presence and share valuable AI/ML content, please consider:

- ⭐ Starring this repository
- 🔗 Sharing it with others learning AI/ML
- 💬 Following my journey on [LinkedIn](https://www.linkedin.com/in/jelvin-byamukama)
- 🐛 Reporting bugs or suggesting features

---

**Made with ❤️ by [Jelvin Byamukama](https://www.linkedin.com/in/jelvin-byamukama)**

*Automating AI education, one post at a time* 🚀
