package com.example.intelligentproduction.config;

import com.example.intelligentproduction.model.User;
import com.example.intelligentproduction.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create default manufacturer user if not exists
        if (!userRepository.existsByUsername("manufacturer")) {
            User manufacturer = new User();
            manufacturer.setUsername("manufacturer");
            manufacturer.setPassword(passwordEncoder.encode("manu123"));
            manufacturer.setEmail("manufacturer@example.com");
            manufacturer.setRole("MANUFACTURER");
            manufacturer.setEnabled(true);
            userRepository.save(manufacturer);
            System.out.println("Default manufacturer user created");
        }

        // Create default vendor user if not exists
        if (!userRepository.existsByUsername("vendor")) {
            User vendor = new User();
            vendor.setUsername("vendor");
            vendor.setPassword(passwordEncoder.encode("vendor123"));
            vendor.setEmail("vendor@example.com");
            vendor.setRole("VENDOR");
            vendor.setEnabled(true);
            userRepository.save(vendor);
            System.out.println("Default vendor user created");
        }
    }
}
