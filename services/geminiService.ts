
import { GoogleGenAI, Type } from "@google/genai";
import type { ProductData, VendorSubmittedFeedback } from '../types';

// Use Vite environment variable
const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
    throw new Error("VITE_API_KEY environment variable not set. Gemini API calls will fail.");
}

export const ai = new GoogleGenAI({ apiKey: API_KEY });

// Helper to truncate data to avoid overly large prompts
const getSampleData = <T,>(data: T[], count: number): T[] => {
    return data.length > count ? data.slice(0, count) : data;
};

export const getAnomalyDetection = async (data: ProductData[]) => {
  const sampleData = getSampleData(data, 100).map(d => ({
      date: d.order_date,
      revenue: d.revenue,
      returns: d.returns,
      category: d.category
  }));

  const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following product performance data for anomalies. Identify any unusual sales dips/spikes or abnormal return trends. Data: ${JSON.stringify(sampleData)}`,
      config: {
          responseMimeType: "application/json",
          responseSchema: {
              type: Type.ARRAY,
              items: {
                  type: Type.OBJECT,
                  properties: {
                      metric: { type: Type.STRING, description: "The metric with an anomaly (e.g., 'Revenue', 'Returns')." },
                      deviation: { type: Type.STRING, description: "Description of the deviation (e.g., '50% spike', '30% dip')." },
                      explanation: { type: Type.STRING, description: "A brief, plausible explanation for the anomaly." },
                      severity: { type: Type.STRING, description: "Severity of the anomaly: 'High', 'Medium', or 'Low'." }
                  }
              }
          }
      }
  });

    return JSON.parse(response.text ?? '{}');
};


export const getRootCauseAnalysis = async (metric: string, data: ProductData[]) => {
    const sampleData = getSampleData(data, 100).map(d => ({
        revenue: d.revenue,
        region: d.region,
        vendor: d.vendor_name,
        product: d.product_name,
        channel: d.channel
    }));

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `The metric "${metric}" is underperforming. Analyze the provided sales data broken down by region, vendor, product, and channel to find the most likely root cause. Provide a concise, NLP-powered summary explaining WHY the metric is off. Data: ${JSON.stringify(sampleData)}`,
    });

    return response.text;
};

export const getSentimentAnalysis = async (feedback: string[]) => {
    const sampleFeedback = getSampleData(feedback, 50);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Analyze the sentiment of the following customer feedback. Categorize each into positive, neutral, or negative, and provide an overall summary with key themes. Feedback: ${JSON.stringify(sampleFeedback)}`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    summary: { type: Type.STRING },
                    positive_count: { type: Type.INTEGER },
                    neutral_count: { type: Type.INTEGER },
                    negative_count: { type: Type.INTEGER },
                    key_themes: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
            }
        }
    });

    return JSON.parse(response.text ?? '{}');
};

export const getAutomatedRecommendations = async (data: ProductData[]) => {
    const dataSummary = {
        totalRevenue: data.reduce((acc, d) => acc + d.revenue, 0),
        totalReturns: data.reduce((acc, d) => acc + d.returns, 0),
        avgRating: data.reduce((acc, d) => acc + d.rating, 0) / data.length,
        salesByRegion: data.reduce((acc, d) => {
            acc[d.region] = (acc[d.region] || 0) + d.revenue;
            return acc;
        }, {} as Record<string, number>)
    };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Based on this product performance data summary, provide 3 actionable recommendations to improve performance. For each, suggest an impact and effort level. Summary: ${JSON.stringify(dataSummary)}`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        recommendation: { type: Type.STRING },
                        impact: { type: Type.STRING, description: "'High', 'Medium', or 'Low'" },
                        effort: { type: Type.STRING, description: "'High', 'Medium', or 'Low'" }
                    }
                }
            }
        }
    });

    return JSON.parse(response.text ?? '{}');
};


export const getPriceSimulation = async (currentPrice: number, newPrice: number, data: ProductData[]) => {
    const sampleData = getSampleData(data, 50).map(d => ({
        price: d.unit_price,
        sales: d.units_sold,
        competitor_price: d.competitor_price,
        sentiment: d.rating > 3 ? 'positive' : 'negative'
    }));

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Simulate the impact of a price change from $${currentPrice} to $${newPrice}. Given the current sales data, competitor prices, and customer sentiment, predict the new sales volume and revenue. Provide a confidence level and reasoning. Data: ${JSON.stringify(sampleData)}`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    predictedSales: { type: Type.INTEGER },
                    predictedRevenue: { type: Type.NUMBER },
                    confidence: { type: Type.STRING, description: "'High', 'Medium', or 'Low'" },
                    reasoning: { type: Type.STRING }
                }
            }
        }
    });

    return JSON.parse(response.text ?? '{}');
};

export const getVendorFeedbackAnalysis = async (feedback: VendorSubmittedFeedback[]) => {
    const feedbackByVendor = feedback.reduce((acc, fb) => {
        if (fb.vendorName && fb.feedbackText) {
            if (!acc[fb.vendorName]) {
                acc[fb.vendorName] = [];
            }
            acc[fb.vendorName].push(fb.feedbackText);
        }
        return acc;
    }, {} as Record<string, string[]>);

    if (Object.keys(feedbackByVendor).length === 0) {
        return [];
    }
    
    const sampleFeedbackByVendor = Object.fromEntries(
        Object.entries(feedbackByVendor).map(([vendor, feedbacks]) => [vendor, getSampleData(feedbacks, 20)])
    );

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Analyze the following customer feedback, which has been grouped by vendor. For each vendor, provide a concise summary of the sentiment and identify up to 3 key positive themes and 3 key negative themes. Focus on topics relevant to vendor performance. Data: ${JSON.stringify(sampleFeedbackByVendor)}`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        vendorName: { type: Type.STRING },
                        summary: { type: Type.STRING },
                        positiveThemes: { type: Type.ARRAY, items: { type: Type.STRING } },
                        negativeThemes: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["vendorName", "summary", "positiveThemes", "negativeThemes"]
                }
            }
        }
    });

    return JSON.parse(response.text ?? '{}');
};
