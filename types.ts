export interface ProductData {
  order_id: string;
  order_date: string;
  units_sold: number;
  unit_price: number;
  discount_pct: number;
  revenue: number;
  cost: number;
  gross_margin: number;
  returns: number;
  product_id: string;
  product_name: string;
  category: string;
  sku: string;
  vendor_id: string;
  vendor_name: string;
  production_batch: string;
  manufacturing_date: string;
  region: string;
  country: string;
  store_id: string;
  channel: 'Online' | 'In-Store';
  customer_id: string;
  customer_segment: 'Consumer' | 'Business' | 'Education';
  rating: number; // 1-5
  feedback_text: string;
  complaint_count: number;
  warranty_claims: number;
  competitor_price: number;
  competitor_market_share: number;
  promo_flag: boolean;
  stock_level: number;
  energy_usage_per_unit: number;
  unit_cost_estimate: number;
  margin_pct: number;
  revenue_usd: number;
}

export interface KpiData {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  status: 'green' | 'yellow' | 'red';
  description: string;
}

export interface Anomaly {
    metric: string;
    deviation: string;
    explanation: string;
    severity: 'High' | 'Medium' | 'Low';
}

export interface Recommendation {
    recommendation: string;
    impact: 'High' | 'Medium' | 'Low';
    effort: 'High' | 'Medium' | 'Low';
}

export interface PriceSimulationResult {
    predictedSales: number;
    predictedRevenue: number;
    confidence: string;
    reasoning: string;
}

export interface VendorFeedback {
    vendorName: string;
    summary: string;
    positiveThemes: string[];
    negativeThemes: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface VendorSubmittedFeedback {
  vendorName: string;
  productId: string;
  feedbackText: string;
}
