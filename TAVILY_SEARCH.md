# How Tavily Searches for Topics

## Overview
The workflow uses Tavily API to search for the latest developments and trends related to each AI/ML topic before generating content. This ensures posts are current, relevant, and include real-world developments.

## Data Flow

```
Topic Selector
     ↓ (outputs topic name)
Search Topic Trends (Tavily)
     ↓ (outputs trend results)
Preserve Context Data
     ↓
Groq AI Content Agent
     ↓
Final LinkedIn Post
```

## How It Works

### 1. Topic Selection
The Topic Selector node outputs a topic object:
```javascript
{
  topic: "Python for AI",              // ← This gets passed to Tavily
  description: "Learn Python...",
  resources: [...],
  allPostedTopics: [...],
  availableTopicsCount: 12,
  totalTopics: 15
}
```

### 2. Tavily Search Query Construction
The Search Topic Trends node automatically receives the topic and constructs a dynamic search query:

```json
{
  "api_key": "{{ $env.TAVILY_API_KEY }}",
  "query": "{{ $json.topic }} latest developments trends {{ $now.year }} {{ $now.year + 1 }}",
  "max_results": 3,
  "search_depth": "advanced",
  "include_domains": [],
  "exclude_domains": []
}
```

**Query Components:**
- `{{ $json.topic }}` - The topic name from the previous node (e.g., "Python for AI")
- `latest developments trends` - Keywords to find current news and trends
- `{{ $now.year }}` - Current year (e.g., 2026) - dynamically calculated
- `{{ $now.year + 1 }}` - Next year (e.g., 2027) - captures emerging trends
- `search_depth: "advanced"` - Deep search for comprehensive results
- `max_results: 3` - Top 3 most relevant results

### 3. Example Queries

When the topic is "Python for AI" in 2026:
```
Query: "Python for AI latest developments trends 2026 2027"
```

When the topic is "Large Language Models" in 2026:
```
Query: "Large Language Models latest developments trends 2026 2027"
```

### 4. Tavily Response Format
Tavily returns structured results:
```json
{
  "results": [
    {
      "title": "New Python ML Framework Released in 2026",
      "content": "Revolutionary framework simplifies AI development...",
      "url": "https://example.com/article",
      "score": 0.95
    },
    {
      "title": "Python Becomes Top AI Language",
      "content": "Latest survey shows Python dominates...",
      "url": "https://example.com/news",
      "score": 0.89
    },
    {
      "title": "AI Development Trends for 2027",
      "content": "Emerging patterns in Python-based AI...",
      "url": "https://example.com/trends",
      "score": 0.87
    }
  ]
}
```

### 5. Context Preservation
The trends are preserved and passed to the AI content generator:
```javascript
{
  topic: "Python for AI",
  description: "...",
  resources: [...],
  trends: [
    { title: "...", content: "...", url: "..." },
    { title: "...", content: "...", url: "..." },
    { title: "...", content: "...", url: "..." }
  ]
}
```

### 6. AI Content Generation
The Groq AI agent uses this information to create engaging posts:
```
Topic: Python for AI
Description: Learn Python programming fundamentals for AI and machine learning

Free Resources:
- Python.org tutorials
- Kaggle Learn
- freeCodeCamp Python course
- Corey Schafer YouTube

Latest Trends:
- New Python ML Framework Released in 2026: Revolutionary framework simplifies...
- Python Becomes Top AI Language: Latest survey shows Python dominates...
- AI Development Trends for 2027: Emerging patterns in Python-based AI...

Create an engaging LinkedIn post that:
1. Starts with a hook about why this topic matters in 2026
2. Explains the best way to learn Python for AI for beginners
3. Lists 3-4 top FREE resources with brief descriptions
4. Mentions current trends or applications
5. Ends with motivation and call-to-action
6. Includes 3-5 relevant hashtags
7. Uses 2-3 emojis maximum for engagement
```

## Dynamic Year Handling

### Why Dynamic Years?
- **Always Current**: Automatically searches for the current year's developments
- **Future-Looking**: Includes next year to capture emerging trends
- **No Maintenance**: No need to update workflow each year
- **Relevant Content**: Posts always reference current and upcoming trends

### How It Works
```javascript
// n8n automatically provides $now object
$now.year        // Returns current year: 2026
$now.year + 1    // Returns next year: 2027
```

The query template dynamically constructs:
```
"{{ $json.topic }} latest developments trends {{ $now.year }} {{ $now.year + 1 }}"

// Evaluates to (in 2026):
"Python for AI latest developments trends 2026 2027"

// Will automatically become (in 2027):
"Python for AI latest developments trends 2027 2028"
```

## Tavily API Configuration

### Required Environment Variable
```bash
TAVILY_API_KEY=your_tavily_api_key_here
```

### API Features Used
- **Search Depth**: `advanced` - Provides comprehensive, high-quality results
- **Max Results**: `3` - Optimal balance between quality and processing time
- **Include Domains**: `[]` - No restrictions (searches all domains)
- **Exclude Domains**: `[]` - No exclusions (gets broadest coverage)

### Rate Limits
- Free tier: 1,000 searches/month
- Each workflow run uses: 1 search
- Running every 2 days: ~15 searches/month
- Well within free tier limits ✅

## Search Quality

### What Tavily Searches For
1. **News Articles**: Recent AI/ML news and announcements
2. **Blog Posts**: Industry insights and tutorials
3. **Research Papers**: Latest academic developments
4. **GitHub Repos**: Popular new projects and tools
5. **Conference Updates**: Key takeaways from AI conferences
6. **Product Launches**: New tools, frameworks, and platforms

### Why "Advanced" Search Depth?
- **Higher Quality**: Filters out low-quality content
- **More Relevant**: Better understanding of context
- **Comprehensive**: Searches beyond surface-level results
- **AI-Optimized**: Tailored for AI and technical topics

## Troubleshooting

### Issue: No Trends Found
**Cause**: API key missing or invalid
**Solution**: Verify `TAVILY_API_KEY` environment variable is set correctly

### Issue: Irrelevant Results
**Cause**: Topic too generic
**Solution**: Topics are pre-defined with specific descriptions. The workflow uses well-defined topics that produce relevant results.

### Issue: Rate Limit Exceeded
**Cause**: Too many searches
**Solution**: Free tier allows 1,000/month. With 15 searches/month (every 2 days), this shouldn't happen. If it does, consider:
- Reducing search frequency
- Upgrading Tavily plan
- Using cached results

### Issue: Outdated Trends
**Cause**: N/A - No longer possible! 🎉
**Solution**: The dynamic year handling ensures queries always search current trends

## Example Workflow Execution

### Step-by-Step for "Machine Learning Fundamentals"

1. **Topic Selector Output**:
   ```json
   {
     "topic": "Machine Learning Fundamentals",
     "description": "Understanding core ML concepts...",
     "resources": ["Andrew Ng Coursera ML", "Fast.ai", ...]
   }
   ```

2. **Tavily Query Sent** (in 2026):
   ```json
   {
     "query": "Machine Learning Fundamentals latest developments trends 2026 2027",
     "max_results": 3,
     "search_depth": "advanced"
   }
   ```

3. **Tavily Response**:
   ```json
   {
     "results": [
       {
         "title": "AutoML Advances in 2026",
         "content": "Machine learning automation reaches new heights...",
         "url": "https://ml-news.com/automl-2026"
       },
       {
         "title": "ML Fundamentals Course Updates",
         "content": "Popular courses add new modules on modern techniques...",
         "url": "https://education.com/ml-updates"
       },
       {
         "title": "2027 ML Predictions",
         "content": "Experts forecast major breakthroughs...",
         "url": "https://trends.com/ml-2027"
       }
     ]
   }
   ```

4. **Context Preserved**:
   ```json
   {
     "topic": "Machine Learning Fundamentals",
     "description": "Understanding core ML concepts...",
     "resources": ["Andrew Ng Coursera ML", "Fast.ai", ...],
     "trends": [
       { "title": "AutoML Advances in 2026", ... },
       { "title": "ML Fundamentals Course Updates", ... },
       { "title": "2027 ML Predictions", ... }
     ]
   }
   ```

5. **AI Generates Post**:
   ```
   🚀 Why Machine Learning Fundamentals Matter in 2026

   With AutoML reaching new heights and ML courses constantly updating
   with modern techniques, there's never been a better time to master
   the fundamentals.

   🎓 Best FREE Resources to Start:
   • Andrew Ng's Coursera ML - The gold standard course
   • Fast.ai - Practical deep learning for coders
   • Google ML Crash Course - Quick start guide
   • StatQuest YouTube - Visual explanations

   🔥 2026 Trends:
   Recent advances in AutoML are making ML more accessible, while
   experts predict major breakthroughs coming in 2027.

   💡 Start with the fundamentals, but stay aware of where the field
   is heading. The best time to start was yesterday, the second best
   time is now!

   #MachineLearning #AI #DataScience #Tech #CareerGrowth
   ```

## Benefits of This Approach

✅ **Always Relevant**: Content references current developments
✅ **Future-Focused**: Mentions emerging trends
✅ **Automated**: No manual year updates needed
✅ **Accurate**: Tavily provides high-quality, verified information
✅ **Contextual**: AI generates posts that incorporate real trends
✅ **Engaging**: Posts feel timely and newsworthy

## Technical Details

### n8n Expression Syntax
```javascript
{{ $json.topic }}           // Access previous node's output
{{ $env.TAVILY_API_KEY }}  // Access environment variable
{{ $now.year }}            // Current year (DateTime function)
{{ $now.year + 1 }}        // Next year (arithmetic operation)
```

### HTTP Request Configuration
- **Method**: POST
- **URL**: https://api.tavily.com/search
- **Content-Type**: application/json
- **Authentication**: API key in request body
- **Response Format**: JSON

### Error Handling
If Tavily search fails:
- Workflow continues (non-blocking)
- AI generates post without trend information
- Relies on curated resources and general knowledge
- Error logged to Google Sheets (ErrorLog sheet)

## Comparison: Before vs After

### Before (Hardcoded Years)
```json
{
  "query": "Python for AI latest developments trends 2024 2025"
}
```
- ❌ Becomes outdated each year
- ❌ Requires manual updates
- ❌ May return stale results
- ❌ Posts reference old years

### After (Dynamic Years)
```json
{
  "query": "{{ $json.topic }} latest developments trends {{ $now.year }} {{ $now.year + 1 }}"
}
```
- ✅ Always searches current year
- ✅ Automatically updates
- ✅ Returns fresh, relevant results
- ✅ Posts reference current trends

## Summary

The Tavily search integration:
1. **Receives** the topic name from Topic Selector
2. **Constructs** a dynamic query with current/next year
3. **Searches** using Tavily's advanced search API
4. **Returns** top 3 relevant trend articles
5. **Passes** trends to AI content generator
6. **Enables** creation of timely, relevant LinkedIn posts

This ensures every post includes current developments and future trends, making the content valuable and engaging for the audience.
