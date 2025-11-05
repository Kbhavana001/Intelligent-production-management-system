# Intelligent Production — Java Fullstack (Spring Boot + Thymeleaf)

This folder is a demo conversion of the original React/TypeScript project into a Java full-stack app using Spring Boot and Thymeleaf. It contains a small mock-data generator and two Thymeleaf pages (Login and Dashboard) to demonstrate server-side rendering and preserve core functionality.

How to run (Windows PowerShell):

```powershell
cd "java-fullstack"
mvn spring-boot:run
```

Open http://localhost:8080 in your browser.

Uploading CSV data
- Visit http://localhost:8080/upload to upload a CSV file. The server will parse the CSV and use the uploaded rows in the dashboard instead of the generated mock data.

Notes about CSV parsing
- The server uses a simple comma-splitting parser. It expects the first row to be headers that match the original project's fields (e.g. order_id,order_date,units_sold,unit_price,...). Quoted fields containing commas may not be parsed correctly by this basic parser. If you need robust CSV support I can add Apache Commons CSV as a dependency and improve parsing.

Notes:
- This is a minimal migration to get a working Java/Thymeleaf app that mirrors the original app's main flows. Full parity (all interactive widgets) will be migrated iteratively.
- After you verify this demo, I can continue converting more pages and wire persistence, authentication, and build/deploy pipelines.
