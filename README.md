# 🤖 LinkedIn AI Tools & Trends Content Automation

[![n8n](https://img.shields.io/badge/n8n-workflow-orange)](https://n8n.io)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?logo=linkedin)](https://www.linkedin.com/in/jelvin-byamukama)

> **Automating AI tools & trends content, one LinkedIn post at a time** 🚀

A fully automated n8n workflow that generates and publishes engaging LinkedIn content about the **latest AI trends** and how readers can access the **best free and paid AI tools**—because staying on top of the AI revolution shouldn't require a full-time social media manager (or a trust fund for API keys).

## 📖 The Story Behind This

The AI landscape is evolving at breakneck speed—new tools launch weekly, and it's impossible to keep up manually. I built this workflow to help my LinkedIn network stay informed about the best AI tools available, both free and paid.

So I built this workflow to:
- **Automate the entire content creation pipeline** from topic selection to posting
- **Help readers discover the best free and paid AI tools** across every category
- **Stay current** with the latest AI trends, tools, and developments
- **Do it all without breaking the bank** (hence the creative use of free APIs 😉)
- **Reference useful resources** like the [n8n-MCP server](https://github.com/czlonkowski/n8n-mcp) and [n8n workflow examples](https://github.com/Zie619/n8n-workflows)

**Check out the live posts in action:** [linkedin.com/in/jelvin-byamukama](https://www.linkedin.com/in/jelvin-byamukama)

---

## ✨ Features

### 🎯 Intelligent Topic Rotation
- **15 AI tools & trends topics** covering AI agents, image generators, coding assistants, local AI, automation, MCP servers, and more
- **Smart rotation system** that tracks posted topics and never repeats until all topics are covered
- **Curated free and paid tool recommendations** for each topic with access details

### 🌐 Real-Time Trend Integration
- Fetches **latest AI tools and trends** using Tavily API
- Keeps content **fresh and relevant** with 2025 industry insights
- Connects readers to the newest tools and platforms *right now*

### 🤖 AI-Powered Content Generation
- **Groq's Llama 3.3 70B model** (free tier FTW!) generates engaging, tool-focused posts
- Professionally crafted prompts for **consistent quality**
- Practical tone focused on **helping readers access and use AI tools**

### 🖼️ AI-Generated Visual Content
- **Pollinations.ai integration** for AI-generated images (completely free, no API key required!)
- Automatic image generation with topic-specific prompts
- No attribution requirements—images are AI-generated on demand

### 📊 Complete Activity Tracking
- **Google Sheets logging** of all published posts
- Topic rotation tracking to ensure content diversity
- Error monitoring with email alerts
- Full audit trail of your automation journey

### ⚡ Fully Automated Pipeline
- Runs **every 2 days** at 10 AM (configurable)
- From topic selection to LinkedIn posting—completely hands-free
- Error handling with notifications to keep you in the loop

### 🔗 Community References
- Integrates knowledge from the [n8n-MCP server](https://github.com/czlonkowski/n8n-mcp) for AI-to-tool connections
- Inspired by workflow patterns from [n8n-workflows](https://github.com/Zie619/n8n-workflows)

---

## 🛠️ Tech Stack

| Service | Purpose | Cost |
|---------|---------|------|
| **n8n** | Workflow automation engine | Self-hosted (free) |
| **Groq** | LLM inference (Llama 3.3 70B) | Free tier ✅ |
| **Tavily API** | Real-time AI tools & trends search | Free tier ✅ |
| **Pollinations.ai** | AI image generation | Free (no API key!) ✅ |
| **Google Sheets** | Post history & error logging | Free ✅ |
| **LinkedIn API** | Post publishing | Free ✅ |

**Total recurring cost: $0/month** 💸

---

## 🚀 Quick Start

### Prerequisites
- n8n instance (self-hosted or n8n Cloud)
- LinkedIn Developer account
- Google Cloud account (for Sheets API)
- Groq API account (free) — get your API key at [console.groq.com](https://console.groq.com)
- Tavily API account (free) — get your API key at [tavily.com](https://tavily.com)
- **No Pollinations.ai account needed** — image generation is completely free with no API key!

### 1. Clone This Repository
```bash
git clone https://github.com/YOUR_USERNAME/linkedin-ai-ml-automation.git
cd linkedin-ai-ml-automation
