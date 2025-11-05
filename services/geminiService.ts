import { GoogleGenAI } from "@google/genai";
import type { ProductData, VendorSubmittedFeedback } from '../types';

// Use Vite environment variable
const API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY environment variable not set. Gemini AI features are disabled.");
}

export const ai = new GoogleGenAI({ apiKey: API_KEY });

// Log initialization (only once)
console.log('='.repeat(60));
console.log('🔑 GEMINI AI SERVICE INITIALIZED');
console.log('📍 API Key loaded:', API_KEY ? `${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 4)}` : 'NOT FOUND');
console.log('🤖 Model:', 'gemini-2.5-flash');
console.log('='.repeat(60));

// Test function to verify Gemini AI is working
export async function testGeminiAI(): Promise<void> {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 TESTING GEMINI AI CONNECTION...');
  console.log('='.repeat(60));
  
  try {
    console.log('📤 Sending test prompt to Gemini API...');
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: 'Say "Gemini AI is working correctly!" if you can read this message.'
    });
    const text = response.text;
    
    console.log('✅ SUCCESS! Gemini AI Response:');
    console.log('📝', text);
    console.log('='.repeat(60));
    alert('✅ Gemini AI is working!\n\nResponse: ' + text);
  } catch (error) {
    console.error('❌ FAILED! Gemini AI Error:');
    console.error(error);
    console.log('='.repeat(60));
    alert('❌ Gemini AI test failed!\n\nError: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

// Make it available globally for manual testing
if (typeof window !== 'undefined') {
  (window as any).testGeminiAI = testGeminiAI;
  console.log('💡 TIP: Run "testGeminiAI()" in console to test Gemini AI connection');
  console.log('📚 Using newer @google/genai SDK');
}

/**
 * Real Gemini AI-powered root cause analysis for manufacturing data.
 * Analyzes the provided metric using advanced LLM capabilities.
 */
export async function getRootCauseAnalysis(metric: string, data: ProductData[]): Promise<string> {
  if (!data || data.length === 0) {
    return 'No data available to analyze.';
  }

  console.log('🤖 GEMINI AI: Starting root cause analysis for metric:', metric);
  console.log('📊 Data records:', data.length);

  try {
    // Compute statistics for the metric
    const numericValues: number[] = [];
    for (const row of data) {
      const v = (row as any)[metric];
      if (typeof v === 'number' && Number.isFinite(v)) numericValues.push(v);
    }

    let stats = '';
    if (numericValues.length > 0) {
      const sum = numericValues.reduce((s, n) => s + n, 0);
      const avg = sum / numericValues.length;
      const max = Math.max(...numericValues);
      const min = Math.min(...numericValues);
      stats = `Average: ${avg.toFixed(2)}, Min: ${min.toFixed(2)}, Max: ${max.toFixed(2)}`;
    }

    // Get category distribution
    const categoryCounts: Record<string, number> = {};
    for (const row of data) {
      const cat = row.category || 'Unknown';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    }

    // Sample data for context (first 5 rows)
    const sampleData = data.slice(0, 5).map(d => ({
      category: d.category,
      units_sold: d.units_sold,
      revenue: d.revenue,
      unit_price: d.unit_price,
      vendor: d.vendor_name
    }));

    const prompt = `You are an expert manufacturing data analyst. Perform a root cause analysis for the metric "${metric}" based on the following production data:

Total Records: ${data.length}
Metric Statistics: ${stats || 'Not numeric'}
Category Distribution: ${JSON.stringify(categoryCounts)}
Sample Data: ${JSON.stringify(sampleData, null, 2)}

Provide a detailed root cause analysis that:
1. Identifies potential root causes for issues with this metric
2. Highlights patterns or anomalies in the data
3. Suggests specific areas to investigate (pricing, vendors, categories, seasonality)
4. Provides actionable recommendations

Keep the analysis concise but insightful (300-400 words).`;

    console.log('🚀 GEMINI AI: Sending request to Gemini API...');
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    const aiResponse = response.text;
    console.log('✅ GEMINI AI: Received response from Gemini API');
    console.log('📝 Response length:', aiResponse?.length, 'characters');
    return aiResponse || 'No response from AI';
  } catch (error) {
    console.error('❌ GEMINI API ERROR:', error);
    return `Error analyzing data with AI: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API key.`;
  }
}

// Backwards-compatible helper used by the UI AnomalyPanel component.
// Returns AI-detected anomalies from the provided manufacturing data.
export async function getAnomalyDetection(data: ProductData[]): Promise<Array<{ metric: string; deviation: string; severity: 'High' | 'Medium' | 'Low'; explanation: string }>> {
  if (!data || data.length === 0) return [];
  
  console.log('🔍 GEMINI AI: Starting anomaly detection analysis');
  console.log('📊 Data records:', data.length);
  
  try {
    // Calculate key metrics for analysis
    const byCategory: Record<string, { returns: number; count: number; ratingSum: number; revenue: number }> = {};
    for (const r of data) {
      const cat = r.category || 'Unknown';
      byCategory[cat] = byCategory[cat] || { returns: 0, count: 0, ratingSum: 0, revenue: 0 };
      byCategory[cat].returns += (r as any).returns || 0;
      byCategory[cat].count += 1;
      byCategory[cat].ratingSum += (r.rating || 0);
      byCategory[cat].revenue += (r.revenue || 0);
    }

    const categoryStats = Object.entries(byCategory).map(([cat, stats]) => ({
      category: cat,
      avgReturns: (stats.returns / stats.count).toFixed(3),
      avgRating: (stats.ratingSum / stats.count).toFixed(2),
      totalRevenue: stats.revenue.toFixed(2),
      count: stats.count
    }));

    const prompt = `You are a manufacturing quality control AI. Analyze this production data for anomalies:

Category Statistics:
${JSON.stringify(categoryStats, null, 2)}

Total Products: ${data.length}

Identify up to 5 anomalies that require attention. For each anomaly, provide:
- metric: descriptive name (e.g., "returns_Electronics", "rating_Furniture")
- deviation: what's unusual (e.g., "avg returns 0.15", "rating 2.3")
- severity: "High", "Medium", or "Low"
- explanation: brief reason (1-2 sentences)

Return as JSON array: [{"metric": "...", "deviation": "...", "severity": "...", "explanation": "..."}]
Return ONLY the JSON array, no additional text.`;

    console.log('🚀 GEMINI AI: Sending anomaly detection request...');
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    const text = response.text?.trim() || '[]';
    console.log('✅ GEMINI AI: Received anomaly detection response');
    console.log('📝 Raw response:', text.substring(0, 200) + '...');
    
    // Extract JSON from response (handle markdown code blocks if present)
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini anomaly detection error:', error);
    // Fallback to simple heuristic if AI fails
    const anomalies: Array<{ metric: string; deviation: string; severity: 'High' | 'Medium' | 'Low'; explanation: string }> = [];
    const byCategory: Record<string, { returns: number; count: number; ratingSum: number }> = {};
    for (const r of data) {
      const cat = r.category || 'Unknown';
      byCategory[cat] = byCategory[cat] || { returns: 0, count: 0, ratingSum: 0 };
      byCategory[cat].returns += (r as any).returns || 0;
      byCategory[cat].count += 1;
      byCategory[cat].ratingSum += (r.rating || 0);
    }
    for (const [cat, stats] of Object.entries(byCategory)) {
      const avgReturns = stats.returns / Math.max(1, stats.count);
      const avgRating = stats.ratingSum / Math.max(1, stats.count);
      if (avgReturns > 0.2) {
        anomalies.push({ metric: `returns_${cat}`, deviation: `avg returns ${avgReturns.toFixed(2)}`, severity: 'High' as const, explanation: `Category ${cat} shows high average returns. Investigate product defects or shipping issues.` });
      }
      if (avgRating < 3.0) {
        anomalies.push({ metric: `rating_${cat}`, deviation: `avg rating ${avgRating.toFixed(2)}`, severity: 'High' as const, explanation: `Category ${cat} has low average rating.` });
      }
    }
    return anomalies.slice(0, 5);
  }
}

export async function getAutomatedRecommendations(data: ProductData[]): Promise<Array<{ recommendation: string; impact: 'High'|'Medium'|'Low'; effort: 'High'|'Medium'|'Low' }>> {
  if (!data || data.length === 0) return [];
  
  console.log('💡 GEMINI AI: Starting automated recommendations');
  console.log('📊 Data records:', data.length);
  
  try {
    // Calculate key insights
    const totalRevenue = data.reduce((s, d) => s + (d.revenue || 0), 0);
    const avgPrice = data.reduce((s, d) => s + (d.unit_price || 0), 0) / data.length;
    const totalUnits = data.reduce((s, d) => s + (d.units_sold || 0), 0);
    
    const categorySales: Record<string, number> = {};
    const vendorPerformance: Record<string, { revenue: number; units: number }> = {};
    
    for (const d of data) {
      const cat = d.category || 'Unknown';
      categorySales[cat] = (categorySales[cat] || 0) + (d.revenue || 0);
      
      const vendor = d.vendor_name || 'Unknown';
      vendorPerformance[vendor] = vendorPerformance[vendor] || { revenue: 0, units: 0 };
      vendorPerformance[vendor].revenue += (d.revenue || 0);
      vendorPerformance[vendor].units += (d.units_sold || 0);
    }

    const prompt = `You are a manufacturing business consultant AI. Analyze this production data and provide actionable recommendations:

Summary:
- Total Revenue: $${totalRevenue.toFixed(2)}
- Total Units Sold: ${totalUnits}
- Average Price: $${avgPrice.toFixed(2)}
- Product Categories: ${Object.keys(categorySales).length}
- Vendors: ${Object.keys(vendorPerformance).length}

Top Categories by Revenue: ${JSON.stringify(Object.entries(categorySales).sort((a,b) => b[1] - a[1]).slice(0, 5))}

Provide 3-5 specific recommendations to improve business performance. For each:
- recommendation: clear action item
- impact: "High", "Medium", or "Low" (expected business impact)
- effort: "High", "Medium", or "Low" (implementation difficulty)

Return as JSON array: [{"recommendation": "...", "impact": "...", "effort": "..."}]
Return ONLY the JSON array, no additional text.`;

    console.log('🚀 GEMINI AI: Sending recommendations request...');
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    const text = response.text?.trim() || '[]';
    console.log('✅ GEMINI AI: Received recommendations');
    
    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const recommendations = JSON.parse(jsonMatch[0]);
      console.log('📝 Generated', recommendations.length, 'recommendations');
      return recommendations;
    }
    return JSON.parse(text);
  } catch (error) {
    console.error('❌ GEMINI API ERROR (Recommendations):', error);
    // Fallback recommendations
    const recommendations: Array<{ recommendation: string; impact: 'High'|'Medium'|'Low'; effort: 'High'|'Medium'|'Low' }> = [];
    const highReturns = data.filter(d => (d as any).returns > 0.1).length;
    if (highReturns > 0) {
      recommendations.push({ recommendation: `Investigate high returns for ${highReturns} products`, impact: 'High', effort: 'Medium' });
    }
    const avgPrice = data.reduce((s, d) => s + (d.unit_price || 0), 0) / data.length;
    if (avgPrice > 500) {
      recommendations.push({ recommendation: `Consider targeted promotions to boost volume at mid-tier price points`, impact: 'Medium', effort: 'Low' });
    }
    recommendations.push({ recommendation: 'Review supplier lead times for products with high stock fluctuations', impact: 'Low', effort: 'Medium' });
    return recommendations;
  }
}

export async function getVendorFeedbackAnalysis(feedbacks: VendorSubmittedFeedback[]): Promise<Array<{ vendorName: string; summary: string; positiveThemes: string[]; negativeThemes: string[] }>> {
  if (!feedbacks || feedbacks.length === 0) return [];
  
  console.log('📋 GEMINI AI: Starting vendor feedback analysis');
  console.log('👥 Vendors to analyze:', new Set(feedbacks.map(f => f.vendorName)).size);
  console.log('💬 Total feedback messages:', feedbacks.length);
  
  try {
    const byVendor: Record<string, string[]> = {};
    for (const f of feedbacks) {
      byVendor[f.vendorName] = byVendor[f.vendorName] || [];
      byVendor[f.vendorName].push(f.feedbackText || '');
    }

    const out: Array<{ vendorName: string; summary: string; positiveThemes: string[]; negativeThemes: string[] }> = [];
    
    for (const [vendor, texts] of Object.entries(byVendor)) {
      const feedbackSample = texts.slice(0, 10).join('\n- ');
      
      const prompt = `Analyze vendor feedback for "${vendor}". Feedback samples:
- ${feedbackSample}

Provide:
1. A brief summary (1-2 sentences)
2. Top 3 positive themes (array of strings)
3. Top 3 negative themes or concerns (array of strings)

Return as JSON: {"summary": "...", "positiveThemes": ["..."], "negativeThemes": ["..."]}
Return ONLY the JSON object, no additional text.`;

      console.log(`🚀 GEMINI AI: Analyzing vendor "${vendor}" (${texts.length} feedbacks)...`);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });
      const text = response.text?.trim() || '{}';
      console.log(`✅ GEMINI AI: Received analysis for "${vendor}"`);
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        out.push({ vendorName: vendor, ...parsed });
      }
    }
    
    console.log('✅ GEMINI AI: Vendor feedback analysis complete');
    return out;
  } catch (error) {
    console.error('❌ GEMINI API ERROR (Vendor Feedback):', error);
    // Fallback to keyword-based analysis
    const byVendor: Record<string, string[]> = {};
    for (const f of feedbacks) {
      byVendor[f.vendorName] = byVendor[f.vendorName] || [];
      byVendor[f.vendorName].push(f.feedbackText || '');
    }
    const out: Array<{ vendorName: string; summary: string; positiveThemes: string[]; negativeThemes: string[] }> = [];
    for (const [vendor, texts] of Object.entries(byVendor)) {
      const pos: string[] = [];
      const neg: string[] = [];
      for (const t of texts) {
        const lt = t.toLowerCase();
        if (lt.includes('good') || lt.includes('excellent') || lt.includes('helpful')) pos.push(t);
        if (lt.includes('delay') || lt.includes('broken') || lt.includes('disappointed') || lt.includes('return')) neg.push(t);
      }
      const summary = texts.slice(0,2).join(' — ');
      out.push({ vendorName: vendor, summary, positiveThemes: Array.from(new Set(pos)).slice(0,3), negativeThemes: Array.from(new Set(neg)).slice(0,3) });
    }
    return out;
  }
}

export async function getSentimentAnalysis(feedbacks: string[]): Promise<{ summary: string; positive_count: number; neutral_count: number; negative_count: number; key_themes: string[] }> {
  if (!feedbacks || feedbacks.length === 0) return { summary: '', positive_count: 0, neutral_count: 0, negative_count: 0, key_themes: [] };
  
  console.log('😊 GEMINI AI: Starting sentiment analysis');
  console.log('💬 Total feedback messages:', feedbacks.length);
  
  try {
    const feedbackSample = feedbacks.slice(0, 20).join('\n- ');
    
    const prompt = `Analyze customer sentiment from these feedback messages:
- ${feedbackSample}

Total feedback count: ${feedbacks.length}

Provide detailed sentiment analysis with:
1. Counts for positive, neutral, and negative feedback
2. Top 5 key themes mentioned
3. A summary sentence

Return as JSON: {
  "positive_count": number,
  "neutral_count": number,
  "negative_count": number,
  "key_themes": ["theme1", "theme2", ...],
  "summary": "..."
}
Return ONLY the JSON object, no additional text.`;

    console.log('🚀 GEMINI AI: Sending sentiment analysis request...');
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    const text = response.text?.trim() || '{}';
    console.log('✅ GEMINI AI: Received sentiment analysis');
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      console.log('📊 Sentiment breakdown:', `${analysis.positive_count} positive, ${analysis.neutral_count} neutral, ${analysis.negative_count} negative`);
      return analysis;
    }
    return JSON.parse(text);
  } catch (error) {
    console.error('❌ GEMINI API ERROR (Sentiment Analysis):', error);
    // Fallback to keyword-based sentiment
    let pos = 0, neu = 0, neg = 0;
    const themes: Record<string, number> = {};
    for (const f of feedbacks) {
      const t = f.toLowerCase();
      if (t.includes('great') || t.includes('excellent') || t.includes('amazing') || t.includes('good')) pos++;
      else if (t.includes('bad') || t.includes('disappoint') || t.includes('poor') || t.includes('stopped')) neg++;
      else neu++;
      // simple theme extraction: words >5 chars
      for (const w of f.split(/\s+/)) {
        const wclean = w.replace(/[^a-zA-Z]/g, '').toLowerCase();
        if (wclean.length > 5) themes[wclean] = (themes[wclean] || 0) + 1;
      }
    }
    const key_themes = Object.entries(themes).sort((a,b)=>b[1]-a[1]).slice(0,5).map(x=>x[0]);
    const summary = `Sentiment: ${pos} positive, ${neu} neutral, ${neg} negative across ${feedbacks.length} messages.`;
    return { summary, positive_count: pos, neutral_count: neu, negative_count: neg, key_themes };
  }
}

export async function getPriceSimulation(currentAvg: number, newPrice: number, data: ProductData[]): Promise<{ predictedSales: number; predictedRevenue: number; confidence: string; reasoning: string }> {
  if (!data || data.length === 0) return { predictedSales: 0, predictedRevenue: 0, confidence: 'Low', reasoning: 'No data' };
  
  try {
    const currentSales = data.reduce((s,d)=>s + (d.units_sold || 0), 0);
    const currentRevenue = data.reduce((s,d)=>s + (d.revenue || 0), 0);
    const priceChange = ((newPrice - currentAvg) / currentAvg * 100).toFixed(1);
    
    // Sample historical data
    const priceSamples = data.slice(0, 10).map(d => ({
      product: d.product_name,
      price: d.unit_price,
      units: d.units_sold,
      category: d.category
    }));

    const prompt = `You are a pricing strategy AI. Simulate the impact of a price change:

Current Situation:
- Current Average Price: $${currentAvg.toFixed(2)}
- Proposed New Price: $${newPrice.toFixed(2)}
- Price Change: ${priceChange}%
- Current Total Sales Units: ${currentSales}
- Current Total Revenue: $${currentRevenue.toFixed(2)}

Sample Product Pricing:
${JSON.stringify(priceSamples, null, 2)}

Predict the impact of this price change considering:
- Price elasticity of demand
- Market conditions
- Product categories affected

Return as JSON: {
  "predictedSales": number (estimated units sold),
  "predictedRevenue": number (estimated total revenue),
  "confidence": "High" | "Medium" | "Low",
  "reasoning": "brief explanation of the prediction"
}
Return ONLY the JSON object, no additional text.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    const text = response.text?.trim() || '{}';
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini price simulation error:', error);
    // Fallback to simple elasticity model
    const priceChangeRatio = (newPrice - currentAvg) / Math.max(1, currentAvg);
    const elasticity = -1.2;
    const currentSales = data.reduce((s,d)=>s + (d.units_sold || 0), 0);
    const predictedSales = Math.max(0, Math.round(currentSales * Math.pow(1 + priceChangeRatio, elasticity)));
    const predictedRevenue = Math.round(predictedSales * newPrice);
    const confidence = Math.abs(priceChangeRatio) < 0.2 ? 'Medium' : 'Low';
    const reasoning = `Simple elasticity model (e=${elasticity}). Price change: ${(priceChangeRatio*100).toFixed(1)}%`;
    return { predictedSales, predictedRevenue, confidence, reasoning };
  }
}
