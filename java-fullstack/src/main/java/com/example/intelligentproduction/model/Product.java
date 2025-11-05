package com.example.intelligentproduction.model;

public class Product {
    private String name;
    private double revenue;
    private int unitsSold;
    private double satisfaction;
    private double marketShare;
    private double sustainability;
    private String region;
    private String category;
    private double unitPrice;
    private double returnRate;
    private String feedbackText;

    public Product() {
    }

    public Product(String name, double revenue, int unitsSold, double satisfaction, double marketShare, double sustainability) {
        this.name = name;
        this.revenue = revenue;
        this.unitsSold = unitsSold;
        this.satisfaction = satisfaction;
        this.marketShare = marketShare;
        this.sustainability = sustainability;
    }
    
    public Product(String name, double revenue, int unitsSold, double satisfaction, double marketShare, 
                   double sustainability, String region, String category, double unitPrice, 
                   double returnRate, String feedbackText) {
        this.name = name;
        this.revenue = revenue;
        this.unitsSold = unitsSold;
        this.satisfaction = satisfaction;
        this.marketShare = marketShare;
        this.sustainability = sustainability;
        this.region = region;
        this.category = category;
        this.unitPrice = unitPrice;
        this.returnRate = returnRate;
        this.feedbackText = feedbackText;
    }

    // Getters and setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getRevenue() {
        return revenue;
    }

    public void setRevenue(double revenue) {
        this.revenue = revenue;
    }

    public int getUnitsSold() {
        return unitsSold;
    }

    public void setUnitsSold(int unitsSold) {
        this.unitsSold = unitsSold;
    }

    public double getSatisfaction() {
        return satisfaction;
    }

    public void setSatisfaction(double satisfaction) {
        this.satisfaction = satisfaction;
    }

    public double getMarketShare() {
        return marketShare;
    }

    public void setMarketShare(double marketShare) {
        this.marketShare = marketShare;
    }

    public double getSustainability() {
        return sustainability;
    }

    public void setSustainability(Double sustainability) {
        this.sustainability = sustainability;
    }
    
    public String getRegion() {
        return region;
    }
    
    public void setRegion(String region) {
        this.region = region;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public Double getUnitPrice() {
        return unitPrice;
    }
    
    public void setUnitPrice(Double unitPrice) {
        this.unitPrice = unitPrice;
    }
    
    public Double getReturnRate() {
        return returnRate;
    }
    
    public void setReturnRate(Double returnRate) {
        this.returnRate = returnRate;
    }
    
    public String getFeedbackText() {
        return feedbackText;
    }
    
    public void setFeedbackText(String feedbackText) {
        this.feedbackText = feedbackText;
    }
}
