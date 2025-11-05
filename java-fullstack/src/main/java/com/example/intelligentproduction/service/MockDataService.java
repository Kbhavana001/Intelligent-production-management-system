package com.example.intelligentproduction.service;

import com.example.intelligentproduction.model.ProductData;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class MockDataService {
    private final Random rnd = new Random();

    private final String[][] PRODUCTS = new String[][]{
            {"P1001","Quantum Laptop","Electronics"},
            {"P1002","Nova Smartphone","Electronics"},
            {"H2001","ErgoChair Pro","Home Goods"},
            {"H2002","Smart Coffee Maker","Home Goods"},
            {"A3001","Pro-Fit Running Shoes","Apparel"},
            {"A3002","All-Weather Jacket","Apparel"}
    };

    private final String[][] VENDORS = new String[][]{
            {"V01","Innovatech"},{"V02","Futuretronics"},{"V03","HomeComforts"},{"V04","ActiveWear Inc."}
    };

    private final String[] REGIONS = new String[]{"North America","Europe","Asia-Pacific","South America"};

    public List<ProductData> generate(int count) {
        List<ProductData> list = new ArrayList<>();
        LocalDateTime base = LocalDateTime.of(2023,10,1,0,0);
        for (int i=0;i<count;i++){
            LocalDateTime od = base.plusHours(i*3);
            int pidx = rnd.nextInt(PRODUCTS.length);
            String[] prod = PRODUCTS[pidx];
            String region = REGIONS[rnd.nextInt(REGIONS.length)];
            String country = switch (region) {
                case "North America" -> rnd.nextBoolean() ? "USA" : "Canada";
                case "Europe" -> rnd.nextBoolean() ? "Germany" : "France";
                case "Asia-Pacific" -> rnd.nextBoolean() ? "Japan" : "India";
                default -> "Brazil";
            };

            int unitsSold = rnd.nextInt(20) + 1;
            double unitPrice = prod[1].contains("Laptop") ? 1200 + rnd.nextDouble()*1300 : prod[1].toLowerCase().contains("phone") ? 700 + rnd.nextDouble()*800 : 50 + rnd.nextDouble()*350;
            double discount = rnd.nextDouble() < 0.2 ? (0.05 + rnd.nextDouble()*0.15) : 0.0;
            double revenue = unitsSold * unitPrice * (1-discount);
            double cost = revenue * (0.4 + rnd.nextDouble()*0.2);
            double grossMargin = revenue - cost;

            ProductData e = new ProductData();
            e.setOrderId(String.format("ORD-%05d",10000+i));
            e.setOrderDate(od);
            e.setUnitsSold(unitsSold);
            e.setUnitPrice(Math.round(unitPrice*100.0)/100.0);
            e.setDiscountPct(Math.round(discount*100.0)/100.0);
            e.setRevenue(Math.round(revenue*100.0)/100.0);
            e.setCost(Math.round(cost*100.0)/100.0);
            e.setGrossMargin(Math.round(grossMargin*100.0)/100.0);
            e.setReturnsCount(rnd.nextDouble() < 0.05 ? rnd.nextInt(Math.max(1, unitsSold/5))+1 : 0);
            e.setProductId(prod[0]);
            e.setProductName(prod[1]);
            e.setCategory(prod[2]);
            e.setSku(prod[0]+"-"+(100+rnd.nextInt(900)));
            String[] v = VENDORS[pidx%VENDORS.length];
            e.setVendorId(v[0]); e.setVendorName(v[1]);
            e.setProductionBatch("B"+(1000+rnd.nextInt(1000)));
            e.setManufacturingDate(od.minusDays(30));
            e.setRegion(region); e.setCountry(country);
            e.setStoreId(region.substring(0,2).toUpperCase()+"-"+(1+rnd.nextInt(5)));
            e.setChannel(rnd.nextDouble()>0.4?"Online":"In-Store");
            e.setCustomerId("CUST-"+(1000+i));
            e.setCustomerSegment(rnd.nextBoolean()?"Consumer":"Business");
            e.setRating(1 + rnd.nextInt(5));
            e.setFeedbackText(e.getRating()<3?"Needs improvement":"Good product");
            e.setComplaintCount(e.getRating()<3 && rnd.nextDouble()>0.5?1:0);
            e.setWarrantyClaims(e.getRating()==1 && rnd.nextDouble()>0.6?1:0);
            e.setCompetitorPrice(Math.round(e.getUnitPrice()*(0.9 + rnd.nextDouble()*0.2)*100.0)/100.0);
            e.setCompetitorMarketShare(Math.round((0.15 + rnd.nextDouble()*0.25)*100.0)/100.0);
            e.setPromoFlag(discount>0);
            e.setStockLevel(50 + rnd.nextInt(450));
            e.setEnergyUsagePerUnit(Math.round((5 + rnd.nextDouble()*20)*100.0)/100.0);
            e.setUnitCostEstimate(Math.round((e.getCost()/Math.max(1,e.getUnitsSold()))*100.0)/100.0);
            e.setMarginPct(Math.round((e.getGrossMargin()/Math.max(1,e.getRevenue()))*100.0)/100.0);
            e.setRevenueUsd(e.getRevenue());

            list.add(e);
        }
        return list;
    }
}
