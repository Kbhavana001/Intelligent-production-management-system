# Gemini AI Integration Guide

## Overview
This application now uses **Google's Gemini AI** to provide intelligent analysis of your manufacturing production data uploaded via CSV files.

## Features Powered by Gemini AI

### 1. **Root Cause Analysis** 
- AI-powered deep analysis of any metric from your CSV data
- Identifies patterns, anomalies, and potential root causes
- Provides actionable recommendations based on data insights
- Accessible via the "View Analysis" button in the KPI cards

### 2. **Anomaly Detection**
- Automatically detects unusual trends in production data
- Analyzes returns, ratings, revenue, and category performance
- Provides severity levels (High/Medium/Low) with explanations
- Visible in the Anomaly Detection panel on the dashboard

### 3. **Automated Recommendations**
- AI generates specific business recommendations
- Each recommendation includes:
  - Clear action item
  - Expected impact (High/Medium/Low)
  - Implementation effort (High/Medium/Low)
- Found in the Recommendations panel

### 4. **Sentiment Analysis**
- Analyzes customer feedback messages
- Classifies sentiment as positive, neutral, or negative
- Extracts key themes from feedback
- Available in the Sentiment Analysis component

### 5. **Vendor Feedback Analysis**
- AI-powered analysis of vendor-specific feedback
- Identifies positive and negative themes per vendor
- Provides summary insights for each vendor
- Helps improve vendor relationships

### 6. **Price Simulation**
- AI predicts impact of price changes on sales and revenue
- Considers market elasticity and demand patterns
- Provides confidence levels for predictions
- Includes reasoning for the forecast

## Setup

### API Key Configuration

The Gemini API key is configured in the `.env` file:

```properties
VITE_GEMINI_API_KEY="AIzaSyBT4cA6xudQsVAGqK9tmPfcbKJ6xbdyQ88"
```

**Important**: 
- The API key is prefixed with `VITE_` to work with Vite's environment variable system
- Never commit your actual API key to version control
- For production, use a more secure method to manage API keys

### Getting Your Own API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and replace it in the `.env` file

### Package Installation

The required package is already installed:

```bash
npm install @google/generative-ai
```

## How It Works

### Data Flow

1. **CSV Upload**: User uploads production data CSV file
2. **Data Parsing**: Frontend parses CSV into structured ProductData objects
3. **AI Analysis Request**: Component calls geminiService functions
4. **Gemini Processing**: 
   - Service prepares data summary and context
   - Sends prompt to Gemini AI with specific instructions
   - Receives intelligent analysis response
5. **Result Display**: Formatted AI insights shown in UI

### Sample Prompt (Root Cause Analysis)

```
You are an expert manufacturing data analyst. Perform a root cause analysis 
for the metric "revenue" based on the following production data:

Total Records: 150
Metric Statistics: Average: 45000, Min: 5000, Max: 120000
Category Distribution: {"Electronics": 50, "Furniture": 45, ...}
Sample Data: [...]

Provide a detailed root cause analysis that:
1. Identifies potential root causes for issues with this metric
2. Highlights patterns or anomalies in the data
3. Suggests specific areas to investigate
4. Provides actionable recommendations
```

### Fallback Mechanism

Each AI function includes a fallback to simple heuristics if:
- API key is invalid
- Network connection fails
- API rate limits are exceeded
- Any other error occurs

This ensures the application remains functional even without AI.

## CSV Data Requirements

For best AI analysis results, ensure your CSV includes these columns:

**Required Columns:**
- `order_id` - Unique identifier
- `product_name` - Product name
- `category` - Product category
- `units_sold` - Number of units
- `revenue` - Total revenue
- `unit_price` - Price per unit

**Recommended Columns:**
- `vendor_name` - Supplier/vendor
- `rating` - Customer rating (1-5)
- `discount` - Discount percentage
- `stock_level` - Current inventory
- `lead_time` - Delivery time in days
- `returns` - Return rate
- `order_date` - Transaction date

The more data you provide, the more insightful the AI analysis will be.

## API Usage and Costs

### Free Tier
- Google Gemini API offers a generous free tier
- 60 requests per minute
- Sufficient for most development and testing

### Rate Limits
If you exceed rate limits, the service will:
1. Log an error to the console
2. Fall back to simple heuristic analysis
3. Display results using the fallback method

### Monitoring Usage
Check your API usage at: [Google AI Studio](https://makersuite.google.com/app/apikey)

## Customization

### Adjusting AI Behavior

You can modify prompts in `services/geminiService.ts` to:
- Change the tone of analysis (formal/casual)
- Focus on specific metrics
- Adjust the level of detail
- Add industry-specific context

Example:
```typescript
const prompt = `You are a manufacturing expert specializing in electronics production...`;
```

### Changing AI Model

The service uses `gemini-pro`. To use a different model:

```typescript
const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
```

Available models:
- `gemini-pro` - Text generation (current)
- `gemini-pro-vision` - Text + image analysis

## Testing

### Test the Integration

1. **Start the application**:
   ```bash
   npm run dev
   ```

2. **Login as manufacturer** (manufacturer / manu123)

3. **Upload a CSV file** with production data

4. **Verify AI Features**:
   - Click "View Analysis" on any KPI card
   - Check Anomaly Detection panel for AI-detected issues
   - Review Recommendations panel for AI suggestions

### Sample Test Data

The mock data in `data/mockData.ts` can be exported as CSV for testing.

## Troubleshooting

### "Error analyzing data with AI"

**Possible causes:**
- Invalid API key
- Network connectivity issues
- API rate limit exceeded

**Solution:**
1. Check `.env` file for correct API key
2. Verify internet connection
3. Check browser console for detailed error
4. Wait a minute if rate limited

### AI Responses Not Appearing

**Check:**
1. CSV data uploaded successfully
2. Browser console for errors
3. API key is valid and active
4. `.env` file uses `VITE_` prefix

### Fallback Mode Activating

If you see simple analysis instead of AI insights:
- The service has fallen back to heuristics
- Check console logs for the error
- Verify API connectivity

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for sensitive data
3. **Rotate API keys** regularly
4. **Monitor API usage** to detect unauthorized use
5. **Use HTTPS** in production
6. **Implement rate limiting** on your backend

## Next Steps

### Enhancements You Can Add:

1. **Backend API Integration**
   - Store API key server-side
   - Proxy AI requests through your backend
   - Add caching to reduce API calls

2. **Advanced Features**
   - Image analysis of product photos
   - Multi-turn conversations with AI
   - Historical trend analysis
   - Predictive maintenance alerts

3. **Performance Optimization**
   - Cache AI responses for repeated queries
   - Batch multiple analysis requests
   - Implement request debouncing

## Support

For issues with:
- **Gemini API**: [Google AI Documentation](https://ai.google.dev/docs)
- **This Application**: Check console logs and error messages
- **API Key**: Regenerate at [Google AI Studio](https://makersuite.google.com/)

---

**Last Updated**: November 4, 2025  
**Gemini AI Version**: gemini-pro  
**Package Version**: @google/generative-ai ^1.20.0
