package com.example.intelligentproduction.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.servlet.http.HttpServletRequest;
import java.io.FileWriter;
import java.io.PrintWriter;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(Throwable.class)
    public ResponseEntity<String> handleThrowable(Throwable ex, HttpServletRequest request) {
        // Log to logger
        log.error("Unhandled exception for request {}", request.getRequestURI(), ex);

        // Also write stacktrace to a file for easier inspection during debugging
        try (FileWriter fw = new FileWriter("run_exception.log", true);
             PrintWriter pw = new PrintWriter(fw)) {
            pw.println("--- Exception for request: " + request.getRequestURI() + " ---");
            ex.printStackTrace(pw);
            pw.println();
        } catch (Exception e) {
            log.warn("Failed to write exception to run_exception.log", e);
        }

        // Return simple text so client sees something useful (helpful while debugging)
        String body = "Internal server error while processing " + request.getRequestURI() + ". See run_exception.log for details.";
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
