package com.example.intelligentproduction.config;

import com.example.intelligentproduction.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for simplicity.
            .authorizeHttpRequests(authz -> authz
                // Permit all static assets, the API, and root paths for the SPA to load
                .requestMatchers(
                    new AntPathRequestMatcher("/"),
                    new AntPathRequestMatcher("/index.html"),
                    new AntPathRequestMatcher("/assets/**"),
                    new AntPathRequestMatcher("/vite.svg"),
                    new AntPathRequestMatcher("/api/**"), // Allow API access
                    new AntPathRequestMatcher("/api/auth/**"), // Allow auth endpoints
                    new AntPathRequestMatcher("/h2-console/**")
                ).permitAll()
                .anyRequest().authenticated() // All other requests require authentication
            )
            .formLogin(formLogin -> formLogin
                .loginPage("/login") // The SPA route for login
                .loginProcessingUrl("/perform_login") // The URL to submit the username and password to
                .defaultSuccessUrl("/dashboard", true) // Where to go after successful login
                .failureUrl("/login?error=true")
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/perform_logout")
                .logoutSuccessUrl("/login")
                .permitAll()
            );

        // Allow frames for H2 console
        http.headers(headers -> headers.frameOptions().disable());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
