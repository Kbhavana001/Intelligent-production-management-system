package com.example.intelligentproduction.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Simple controller that forwards non-API routes to the SPA index.html.
 * This ensures client-side routes (and /login) are served from the built
 * frontend instead of rendering Thymeleaf templates which may depend on
 * server-side model attributes.
 */
@Controller
public class SpaController {

    @GetMapping(value = {"/", "/{path:[^\\.]*}"})
    public String forward() {
        return "forward:/index.html";
    }
}
