package com.example.intelligentproduction.model;

import java.time.LocalDateTime;

public class ProductData {
    private String orderId;
    private LocalDateTime orderDate;
    private int unitsSold;
    private double unitPrice;
    private double discountPct;
    private double revenue;
    private double cost;
    private double grossMargin;
    private int returnsCount;
    private String productId;
    private String productName;
    private String category;
    private String sku;
    private String vendorId;
    private String vendorName;
    private String productionBatch;
    private LocalDateTime manufacturingDate;
    private String region;
    private String country;
    private String storeId;
    private String channel;
    private String customerId;
    private String customerSegment;
    private int rating;
    private String feedbackText;
    private int complaintCount;
    private int warrantyClaims;
    private double competitorPrice;
    private double competitorMarketShare;
    private boolean promoFlag;
    private int stockLevel;
    private double energyUsagePerUnit;
    private double unitCostEstimate;
    private double marginPct;
    private double revenueUsd;

    // Getters and setters
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }
    public int getUnitsSold() { return unitsSold; }
    public void setUnitsSold(int unitsSold) { this.unitsSold = unitsSold; }
    public double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(double unitPrice) { this.unitPrice = unitPrice; }
    public double getDiscountPct() { return discountPct; }
    public void setDiscountPct(double discountPct) { this.discountPct = discountPct; }
    public double getRevenue() { return revenue; }
    public void setRevenue(double revenue) { this.revenue = revenue; }
    public double getCost() { return cost; }
    public void setCost(double cost) { this.cost = cost; }
    public double getGrossMargin() { return grossMargin; }
    public void setGrossMargin(double grossMargin) { this.grossMargin = grossMargin; }
    public int getReturnsCount() { return returnsCount; }
    public void setReturnsCount(int returnsCount) { this.returnsCount = returnsCount; }
    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public String getVendorId() { return vendorId; }
    public void setVendorId(String vendorId) { this.vendorId = vendorId; }
    public String getVendorName() { return vendorName; }
    public void setVendorName(String vendorName) { this.vendorName = vendorName; }
    public String getProductionBatch() { return productionBatch; }
    public void setProductionBatch(String productionBatch) { this.productionBatch = productionBatch; }
    public LocalDateTime getManufacturingDate() { return manufacturingDate; }
    public void setManufacturingDate(LocalDateTime manufacturingDate) { this.manufacturingDate = manufacturingDate; }
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getStoreId() { return storeId; }
    public void setStoreId(String storeId) { this.storeId = storeId; }
    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }
    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }
    public String getCustomerSegment() { return customerSegment; }
    public void setCustomerSegment(String customerSegment) { this.customerSegment = customerSegment; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public String getFeedbackText() { return feedbackText; }
    public void setFeedbackText(String feedbackText) { this.feedbackText = feedbackText; }
    public int getComplaintCount() { return complaintCount; }
    public void setComplaintCount(int complaintCount) { this.complaintCount = complaintCount; }
    public int getWarrantyClaims() { return warrantyClaims; }
    public void setWarrantyClaims(int warrantyClaims) { this.warrantyClaims = warrantyClaims; }
    public double getCompetitorPrice() { return competitorPrice; }
    public void setCompetitorPrice(double competitorPrice) { this.competitorPrice = competitorPrice; }
    public double getCompetitorMarketShare() { return competitorMarketShare; }
    public void setCompetitorMarketShare(double competitorMarketShare) { this.competitorMarketShare = competitorMarketShare; }
    public boolean isPromoFlag() { return promoFlag; }
    public void setPromoFlag(boolean promoFlag) { this.promoFlag = promoFlag; }
    public int getStockLevel() { return stockLevel; }
    public void setStockLevel(int stockLevel) { this.stockLevel = stockLevel; }
    public double getEnergyUsagePerUnit() { return energyUsagePerUnit; }
    public void setEnergyUsagePerUnit(double energyUsagePerUnit) { this.energyUsagePerUnit = energyUsagePerUnit; }
    public double getUnitCostEstimate() { return unitCostEstimate; }
    public void setUnitCostEstimate(double unitCostEstimate) { this.unitCostEstimate = unitCostEstimate; }
    public double getMarginPct() { return marginPct; }
    public void setMarginPct(double marginPct) { this.marginPct = marginPct; }
    public double getRevenueUsd() { return revenueUsd; }
    public void setRevenueUsd(double revenueUsd) { this.revenueUsd = revenueUsd; }
}
