package com.example.intelligentproduction.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @GetMapping("/info")
    public Map<String, Object> getUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> userInfo = new HashMap<>();
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
            userInfo.put("username", authentication.getName());
            Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
            userInfo.put("roles", authorities.stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList()));
            userInfo.put("authenticated", true);
        } else {
            userInfo.put("authenticated", false);
        }
        return userInfo;
    }
}
