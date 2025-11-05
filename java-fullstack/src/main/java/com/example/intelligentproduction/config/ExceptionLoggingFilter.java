package com.example.intelligentproduction.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.io.IOException;

@Component
public class ExceptionLoggingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(ExceptionLoggingFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        } catch (Throwable t) {
            // Log to SLF4J
            log.error("Unhandled exception during request {}", request.getRequestURI(), t);

            // Also append to run_exception.log for debugging convenience
            try (FileWriter fw = new FileWriter("run_exception.log", true);
                 PrintWriter pw = new PrintWriter(fw)) {
                pw.println("--- Exception for request: " + request.getRequestURI() + " ---");
                t.printStackTrace(pw);
                pw.println();
            } catch (Exception e) {
                log.warn("Failed to write exception to run_exception.log", e);
            }

            // Re-throw so normal error handling still occurs (Whitelabel, etc.)
            if (t instanceof ServletException) throw (ServletException) t;
            if (t instanceof IOException) throw (IOException) t;
            throw new ServletException(t);
        }
    }
}
