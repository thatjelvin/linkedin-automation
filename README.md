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
