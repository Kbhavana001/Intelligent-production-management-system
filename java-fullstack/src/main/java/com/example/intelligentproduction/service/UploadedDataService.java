package com.example.intelligentproduction.service;

import com.example.intelligentproduction.model.ProductData;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UploadedDataService {
    private volatile List<ProductData> uploaded;

    public synchronized void setUploaded(List<ProductData> data) {
        this.uploaded = data;
    }

    public synchronized List<ProductData> getUploaded() {
        return uploaded;
    }
}
