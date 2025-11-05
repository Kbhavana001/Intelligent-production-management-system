# How to Verify Gemini AI is Working

## ✅ Quick Verification Steps

### 1. Check Browser Console Logs

When you load the application, open the browser console (F12) and look for these messages:

```
🔑 GEMINI AI SERVICE INITIALIZED
📍 API Key loaded: AIzaSyBeOB...RMIo
🤖 Model: gemini-pro
```

This confirms the Gemini service is initialized with your API key.

### 2. Upload CSV and Trigger Analysis

**Steps:**
1. Login as manufacturer (username: `manufacturer`, password: `manu123`)
2. Upload a CSV file with production data
3. Click on any KPI card's "View Analysis" button
4. Watch the browser console for these logs:

```
🤖 GEMINI AI: Starting root cause analysis for metric: revenue
📊 Data records: 150
🚀 GEMINI AI: Sending request to Gemini API...
✅ GEMINI AI: Received response from Gemini API
📝 Response length: 1245 characters
```

### 3. Check Anomaly Detection

When the dashboard loads with data, you should see:

```
🔍 GEMINI AI: Starting anomaly detection analysis
📊 Data records: 150
🚀 GEMINI AI: Sending anomaly detection request...
✅ GEMINI AI: Received anomaly detection response
📝 Raw response: [{"metric": "returns_Electronics"...
```

## 🔍 Detailed Verification

### Test 1: API Key Validation

The API key is loaded from `.env`:
```
VITE_GEMINI_API_KEY="AIzaSyBeOB4CPPaYR13gu4jCxfV3UU9KwPJRMIo"
```

**Check:** Console should show the masked API key on app load.

### Test 2: Root Cause Analysis

**What happens:**
1. User clicks "View Analysis" on a KPI card
2. `getRootCauseAnalysis()` function is called
3. Function prepares data summary and statistics
4. Sends prompt to Gemini API
5. Receives AI-generated analysis (300-400 words)
6. Displays in modal

**Expected Console Output:**
```
🤖 GEMINI AI: Starting root cause analysis for metric: revenue
📊 Data records: 150
🚀 GEMINI AI: Sending request to Gemini API...
✅ GEMINI AI: Received response from Gemini API
📝 Response length: 1245 characters
```

**If you see this:** ✅ Gemini AI is working!

**If you see error:** ❌ Check API key or network

### Test 3: Anomaly Detection

**What happens:**
1. Dashboard loads with CSV data
2. `AnomalyPanel` component calls `getAnomalyDetection()`
3. Function sends category statistics to Gemini
4. Gemini analyzes and returns JSON array of anomalies
5. Panel displays anomalies with severity levels

**Expected Console Output:**
```
🔍 GEMINI AI: Starting anomaly detection analysis
📊 Data records: 150
🚀 GEMINI AI: Sending anomaly detection request...
✅ GEMINI AI: Received anomaly detection response
📝 Raw response: [{"metric": "returns_Electronics"...
```

### Test 4: Compare AI vs Fallback

**AI Response Characteristics:**
- Natural language, conversational tone
- Specific insights based on actual data
- 300-400 words for root cause analysis
- Contextual recommendations
- Mentions specific categories, vendors, patterns

**Fallback Response Characteristics:**
- Simple statistics (avg, min, max)
- Generic recommendations
- Shorter, formulaic text
- No deep insights

**Example AI Response:**
```
Based on the production data analysis, several key patterns emerge regarding 
revenue performance. The Electronics category shows particularly strong 
performance with average revenue of $45,234 per order, significantly 
outperforming other categories...

Root causes for revenue variations include:
1. Pricing Strategy: High-value electronics products (average price $850)
2. Vendor Performance: Vendor XYZ contributes 35% of total revenue
3. Seasonal Trends: Q4 shows 40% higher revenue...

Recommendations:
- Focus marketing efforts on high-performing Electronics category
- Investigate low-performing categories for quality issues
- Optimize inventory for top revenue-generating products
```

## 🚨 Troubleshooting

### Issue: No console logs appear

**Solution:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Refresh the page
4. Upload CSV file again

### Issue: "Error analyzing data with AI" message

**Possible Causes:**
1. Invalid API key
2. API key expired
3. Network connection issue
4. API rate limit exceeded
5. Gemini API service down

**Solutions:**
1. Check `.env` file has correct `VITE_GEMINI_API_KEY`
2. Verify API key at [Google AI Studio](https://makersuite.google.com/app/apikey)
3. Check internet connection
4. Wait 1 minute if rate limited
5. Check [Google API Status](https://status.cloud.google.com/)

### Issue: Getting fallback responses instead of AI

**Check:**
1. Browser console for error messages
2. Network tab in DevTools for API calls
3. API key is not empty or invalid

**Console should show:**
```
❌ GEMINI API ERROR: [Error details]
```

This tells you exactly what went wrong.

## 📊 Expected Data Flow

```
CSV Upload
    ↓
Parse CSV → ProductData[]
    ↓
ManufacturerDashboard receives data
    ↓
User clicks "View Analysis"
    ↓
getRootCauseAnalysis(metric, data)
    ↓
Prepare prompt with data statistics
    ↓
Call Gemini API: model.generateContent(prompt)
    ↓
Receive AI response
    ↓
Display in RcaModal
```

## 🎯 Success Indicators

✅ **Gemini AI is working if you see:**
- Console logs with 🤖, 🚀, ✅ emojis
- "Received response from Gemini API" messages
- Response length > 500 characters for analysis
- Natural, contextual language in analysis
- Specific data insights (not generic)

❌ **Gemini AI is NOT working if:**
- No console logs appear
- Error messages in console
- Only fallback responses (simple stats)
- "Error analyzing data with AI" displayed
- Response is very short and generic

## 🧪 Manual API Test

You can test the API directly in browser console:

```javascript
// Test in browser console after app loads
const testGemini = async () => {
  const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=AIzaSyBeOB4CPPaYR13gu4jCxfV3UU9KwPJRMIo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: 'Say "Gemini AI is working!" if you can read this.' }]
      }]
    })
  });
  const data = await response.json();
  console.log('Gemini API Response:', data);
};

testGemini();
```

**Expected Response:**
```json
{
  "candidates": [{
    "content": {
      "parts": [{ "text": "Gemini AI is working!" }]
    }
  }]
}
```

## 📈 Monitoring Usage

**Check API usage at:**
https://makersuite.google.com/app/apikey

**Free Tier Limits:**
- 60 requests per minute
- Unlimited requests per day (with rate limiting)

## ✨ Features Using Gemini AI

1. **Root Cause Analysis** - `getRootCauseAnalysis()`
2. **Anomaly Detection** - `getAnomalyDetection()`
3. **Recommendations** - `getAutomatedRecommendations()`
4. **Sentiment Analysis** - `getSentimentAnalysis()`
5. **Vendor Feedback** - `getVendorFeedbackAnalysis()`
6. **Price Simulation** - `getPriceSimulation()`

All functions have console logging to track AI calls.

---

**Last Updated:** November 4, 2025  
**Gemini Model:** gemini-pro  
**API Key:** AIzaSyBeOB...RMIo (masked)
