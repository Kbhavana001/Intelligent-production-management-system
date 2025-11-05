package com.example.intelligentproduction.service;

import com.example.intelligentproduction.model.ProductData;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Service
public class CsvImportService {

    // Very small CSV parser - expects header row matching the field names used by the app.
    public List<ProductData> parseCsv(InputStream in) throws Exception {
        List<ProductData> out = new ArrayList<>();
        try (BufferedReader r = new BufferedReader(new InputStreamReader(in, StandardCharsets.UTF_8))) {
            String header = r.readLine();
            if (header == null) return out;
            String[] cols = header.split(",");

            String line;
            while ((line = r.readLine()) != null) {
                if (line.trim().isEmpty()) continue;
                String[] vals = line.split(",");
                ProductData e = new ProductData();
                for (int i = 0; i < Math.min(cols.length, vals.length); i++) {
                    String key = cols[i].trim();
                    String val = vals[i].trim();
                    try {
                        switch (key) {
                            case "order_id": e.setOrderId(val); break;
                            case "order_date":
                                try { e.setOrderDate(LocalDateTime.parse(val)); } catch (DateTimeParseException ex) { /* ignore */ }
                                break;
                            case "units_sold": e.setUnitsSold(parseInt(val)); break;
                            case "unit_price": e.setUnitPrice(parseDouble(val)); break;
                            case "discount_pct": e.setDiscountPct(parseDouble(val)); break;
                            case "revenue": e.setRevenue(parseDouble(val)); break;
                            case "cost": e.setCost(parseDouble(val)); break;
                            case "gross_margin": e.setGrossMargin(parseDouble(val)); break;
                            case "returns": e.setReturnsCount(parseInt(val)); break;
                            case "product_id": e.setProductId(val); break;
                            case "product_name": e.setProductName(val); break;
                            case "category": e.setCategory(val); break;
                            case "sku": e.setSku(val); break;
                            case "vendor_id": e.setVendorId(val); break;
                            case "vendor_name": e.setVendorName(val); break;
                            case "production_batch": e.setProductionBatch(val); break;
                            case "manufacturing_date":
                                try { e.setManufacturingDate(LocalDateTime.parse(val)); } catch (DateTimeParseException ex) { }
                                break;
                            case "region": e.setRegion(val); break;
                            case "country": e.setCountry(val); break;
                            case "store_id": e.setStoreId(val); break;
                            case "channel": e.setChannel(val); break;
                            case "customer_id": e.setCustomerId(val); break;
                            case "customer_segment": e.setCustomerSegment(val); break;
                            case "rating": e.setRating(parseInt(val)); break;
                            case "feedback_text": e.setFeedbackText(val); break;
                            case "complaint_count": e.setComplaintCount(parseInt(val)); break;
                            case "warranty_claims": e.setWarrantyClaims(parseInt(val)); break;
                            case "competitor_price": e.setCompetitorPrice(parseDouble(val)); break;
                            case "competitor_market_share": e.setCompetitorMarketShare(parseDouble(val)); break;
                            case "promo_flag": e.setPromoFlag("true".equalsIgnoreCase(val)); break;
                            case "stock_level": e.setStockLevel(parseInt(val)); break;
                            case "energy_usage_per_unit": e.setEnergyUsagePerUnit(parseDouble(val)); break;
                            case "unit_cost_estimate": e.setUnitCostEstimate(parseDouble(val)); break;
                            case "margin_pct": e.setMarginPct(parseDouble(val)); break;
                            case "revenue_usd": e.setRevenueUsd(parseDouble(val)); break;
                        }
                    } catch (Exception ex) {
                        // best-effort: skip malformed field
                    }
                }
                out.add(e);
            }
        }
        return out;
    }

    private int parseInt(String v) { if (v==null||v.isEmpty()) return 0; try { return Integer.parseInt(v); } catch (Exception e) { return 0; } }
    private double parseDouble(String v) { if (v==null||v.isEmpty()) return 0.0; try { return Double.parseDouble(v); } catch (Exception e) { return 0.0; } }
}
