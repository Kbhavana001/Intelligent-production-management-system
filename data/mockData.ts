
import type { ProductData } from '../types';

const PRODUCTS = [
  { id: 'P1001', name: 'Quantum Laptop', category: 'Electronics' },
  { id: 'P1002', name: 'Nova Smartphone', category: 'Electronics' },
  { id: 'H2001', name: 'ErgoChair Pro', category: 'Home Goods' },
  { id: 'H2002', name: 'Smart Coffee Maker', category: 'Home Goods' },
  { id: 'A3001', name: 'Pro-Fit Running Shoes', category: 'Apparel' },
  { id: 'A3002', name: 'All-Weather Jacket', category: 'Apparel' },
];

const VENDORS = [
  { id: 'V01', name: 'Innovatech' },
  { id: 'V02', name: 'Futuretronics' },
  { id: 'V03', name: 'HomeComforts' },
  { id: 'V04', name: 'ActiveWear Inc.' },
];

const REGIONS = ['North America', 'Europe', 'Asia-Pacific', 'South America'];
const COUNTRIES = {
  'North America': ['USA', 'Canada'],
  'Europe': ['Germany', 'France', 'UK'],
  'Asia-Pacific': ['Japan', 'Australia', 'India'],
  'South America': ['Brazil', 'Argentina'],
};

const FEEDBACK = [
    "Amazing product, exceeded my expectations!",
    "Battery life could be better, but otherwise great.",
    "The delivery was delayed by two days.",
    "Excellent build quality and design.",
    "Stopped working after a week. Very disappointed.",
    "Customer service was very helpful with my issue.",
    "A bit overpriced for the features it offers.",
    "The new software update is fantastic.",
    "The sizing is completely off, had to return it.",
    "I use it every day, it's become essential."
];

function getRandom<T,>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min: number, max: number, decimals: number): number {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
}


function createMockData(count: number): ProductData[] {
  const data: ProductData[] = [];
  const baseDate = new Date('2023-10-01');

  for (let i = 0; i < count; i++) {
    const order_date = new Date(baseDate.getTime() + i * 60 * 60 * 1000 * 3); // Every 3 hours
    const product = getRandom(PRODUCTS);
    const vendor = product.category === 'Electronics' ? getRandom([VENDORS[0], VENDORS[1]]) : product.category === 'Home Goods' ? VENDORS[2] : VENDORS[3];
    const region = getRandom(REGIONS);
    const country = getRandom(COUNTRIES[region as keyof typeof COUNTRIES]);
    const units_sold = getRandomInt(1, 20);
    const unit_price = product.name.includes('Laptop') ? getRandomFloat(1200, 2500, 2) : product.name.includes('Phone') ? getRandomFloat(700, 1500, 2) : getRandomFloat(50, 400, 2);
    const discount_pct = Math.random() < 0.2 ? getRandomFloat(0.05, 0.2, 2) : 0;
    const revenue = units_sold * unit_price * (1 - discount_pct);
    const cost = revenue * getRandomFloat(0.4, 0.6, 2);
    const gross_margin = revenue - cost;
    const returns = Math.random() < 0.05 ? getRandomInt(1, Math.max(1, Math.floor(units_sold * 0.2))) : 0;
    const rating = getRandomInt(1, 5);
    
    const entry: ProductData = {
      order_id: `ORD-${10000 + i}`,
      order_date: order_date.toISOString(),
      units_sold,
      unit_price,
      discount_pct,
      revenue,
      cost,
      gross_margin,
      returns,
      product_id: product.id,
      product_name: product.name,
      category: product.category,
      sku: `${product.id}-${getRandomInt(100, 999)}`,
      vendor_id: vendor.id,
      vendor_name: vendor.name,
      production_batch: `B${getRandomInt(1000, 2000)}`,
      manufacturing_date: new Date(order_date.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      region,
      country,
      store_id: `${region.slice(0,2).toUpperCase()}-${getRandomInt(1,5)}`,
      channel: Math.random() > 0.4 ? 'Online' : 'In-Store',
      customer_id: `CUST-${1000 + i}`,
      customer_segment: getRandom(['Consumer', 'Business', 'Education']),
      rating,
      feedback_text: rating < 3 ? getRandom(FEEDBACK.filter(f => f.includes('disappointed') || f.includes('off') || f.includes('overpriced') || f.includes('delayed'))) : getRandom(FEEDBACK),
      complaint_count: rating < 3 && Math.random() > 0.5 ? 1 : 0,
      warranty_claims: rating === 1 && Math.random() > 0.6 ? 1 : 0,
      competitor_price: unit_price * getRandomFloat(0.9, 1.1, 2),
      competitor_market_share: getRandomFloat(0.15, 0.4, 2),
      promo_flag: discount_pct > 0,
      stock_level: getRandomInt(50, 500),
      energy_usage_per_unit: getRandomFloat(5, 25, 2),
      unit_cost_estimate: cost / units_sold,
      margin_pct: gross_margin / revenue,
      revenue_usd: revenue,
    };
    data.push(entry);
  }
  return data;
}

export const mockData = createMockData(500);
