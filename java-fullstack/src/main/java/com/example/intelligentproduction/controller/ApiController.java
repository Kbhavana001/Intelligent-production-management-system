package com.example.intelligentproduction.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController {

    @GetMapping("/data")
    public List<Map<String, Object>> getData() {
        // Rich mock data matching frontend ProductData interface
        return Arrays.asList(
            createProduct("ORD001", "Quantum Laptop", "Electronics", 95, 1200.00, 114000.00, 
                "North", 4.5, "Great performance and battery life. Love the display quality!", 0.05),
            createProduct("ORD002", "Nova Smartphone", "Electronics", 150, 800.00, 120000.00,
                "Central", 4.2, "Good camera but slow support response times. Packaging was damaged.", 0.08),
            createProduct("ORD003", "ErgoChair Pro", "Furniture", 200, 600.00, 120000.00,
                "South", 4.0, "Comfortable chair for long work hours. Very ergonomic design.", 0.15),
            createProduct("ORD004", "Smart Coffee Maker", "Appliances", 300, 150.00, 45000.00,
                "East", 3.8, "Makes great coffee but the app is buggy. Product description was misleading.", 0.12),
            createProduct("ORD005", "Pro-Fit Running Shoes", "Sports", 400, 150.00, 60000.00,
                "West", 4.6, "Perfect fit and excellent cushioning. Best running shoes I've owned!", 0.06),
            createProduct("ORD006", "All-Weather Jacket", "Apparel", 320, 150.00, 48000.00,
                "North", 4.3, "Waterproof and stylish. Great for outdoor activities.", 0.09)
        );
    }
    
    private Map<String, Object> createProduct(String orderId, String productName, String category,
                                              int unitsSold, double unitPrice, double revenue,
                                              String region, double rating, String feedbackText,
                                              double returnRate) {
        Map<String, Object> product = new HashMap<>();
        product.put("order_id", orderId);
        product.put("product_name", productName);
        product.put("category", category);
        product.put("units_sold", unitsSold);
        product.put("unit_price", unitPrice);
        product.put("revenue", revenue);
        product.put("region", region);
        product.put("rating", rating);
        product.put("feedback_text", feedbackText);
        product.put("returns", (int)(unitsSold * returnRate));
        
        // Additional calculated fields
        double cost = revenue * 0.6;
        product.put("cost", cost);
        product.put("gross_margin", revenue - cost);
        product.put("margin_pct", ((revenue - cost) / revenue) * 100);
        product.put("competitor_price", unitPrice * 1.1);
        product.put("competitor_market_share", Math.random() * 30);
        product.put("stock_level", (int)(unitsSold * (1.5 + Math.random())));
        product.put("energy_usage_per_unit", 50 + Math.random() * 100);
        product.put("channel", unitsSold > 200 ? "Online" : "In-Store");
        product.put("customer_segment", category.equals("Electronics") ? "Business" : "Consumer");
        
        return product;
    }
}
