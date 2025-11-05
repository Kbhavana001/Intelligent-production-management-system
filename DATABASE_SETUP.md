# PostgreSQL Database Setup Guide

## 📦 Installation Options

### Option 1: Install PostgreSQL (Recommended)

1. **Download PostgreSQL:**
   - Visit: https://www.postgresql.org/download/windows/
   - Download the installer (version 14 or higher recommended)
   - Run the installer

2. **During Installation:**
   - Set PostgreSQL superuser (postgres) password: `postgres` (or your choice)
   - Port: Keep default `5432`
   - Remember your password!

3. **After Installation:**
   - PostgreSQL should start automatically as a Windows service

### Option 2: Use MySQL Instead

If you prefer MySQL, I can configure that instead. Let me know!

---

## 🔧 Database Setup Steps

### Step 1: Create the Database

**Using pgAdmin (GUI):**
1. Open pgAdmin 4 (installed with PostgreSQL)
2. Connect to PostgreSQL server (password: what you set during installation)
3. Right-click "Databases" → Create → Database
4. Database name: `intelligentproduction`
5. Click "Save"

**Using Command Line:**
```bash
# Open PowerShell and run:
psql -U postgres

# In psql prompt, run:
CREATE DATABASE intelligentproduction;

# Exit:
\q
```

### Step 2: Update Configuration (If You Changed Password)

Edit `java-fullstack/src/main/resources/application.properties`:

```properties
spring.datasource.username=postgres
spring.datasource.password=YOUR_ACTUAL_PASSWORD
```

### Step 3: Restart the Application

1. **Stop the current server** (in VS Code terminal, press `Ctrl+C`)

2. **Rebuild and run:**
   ```bash
   cd java-fullstack
   mvn clean package -DskipTests
   mvn spring-boot:run
   ```

---

## ✅ Verification

Once the server starts, you should see:
```
HikariPool-1 - Starting...
HikariPool-1 - Start completed.
Using dialect: org.hibernate.dialect.PostgreSQLDialect
```

If successful, the `users` table will be created automatically!

---

## 🔍 View Your Data

**Using pgAdmin:**
1. Expand: Servers → PostgreSQL → Databases → intelligentproduction → Schemas → public → Tables
2. Right-click `users` → View/Edit Data → All Rows

**Using psql:**
```bash
psql -U postgres -d intelligentproduction

# List tables:
\dt

# View users:
SELECT * FROM users;

# Exit:
\q
```

---

## 📊 Current Configuration

**Database:** PostgreSQL  
**Host:** localhost  
**Port:** 5432  
**Database Name:** intelligentproduction  
**Username:** postgres  
**Password:** postgres (change in application.properties if different)

**Table:** users  
**Columns:**
- id (bigint, primary key, auto-increment)
- username (varchar, unique)
- password (varchar, encrypted with BCrypt)
- email (varchar, unique)
- role (varchar - "MANUFACTURER" or "VENDOR")
- enabled (boolean)

---

## 🎯 Benefits of PostgreSQL

✅ **Persistent Data** - Your signups survive server restarts!  
✅ **Production Ready** - Industry-standard database  
✅ **Data Integrity** - ACID compliant  
✅ **Scalable** - Can handle large amounts of data  

---

## 🆘 Troubleshooting

### Error: "Connection refused"
- **Cause:** PostgreSQL not running
- **Fix:** Start PostgreSQL service
  ```bash
  # PowerShell (as Administrator):
  net start postgresql-x64-14  # or your version number
  ```

### Error: "Database does not exist"
- **Cause:** Database `intelligentproduction` not created
- **Fix:** Follow Step 1 above to create database

### Error: "Password authentication failed"
- **Cause:** Wrong password in application.properties
- **Fix:** Update `spring.datasource.password` with correct password

### Want to use H2 again (in-memory)?
- Edit `application.properties` and uncomment the H2 configuration
- Comment out PostgreSQL configuration

---

## 🔄 Alternative: Use MySQL

If you prefer MySQL over PostgreSQL:

1. **Update pom.xml** - Replace PostgreSQL dependency:
   ```xml
   <dependency>
       <groupId>mysql</groupId>
       <artifactId>mysql-connector-java</artifactId>
       <version>8.0.33</version>
       <scope>runtime</scope>
   </dependency>
   ```

2. **Update application.properties:**
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/intelligentproduction?createDatabaseIfNotExist=true
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
   spring.jpa.hibernate.ddl-auto=update
   ```

Let me know if you need MySQL configuration instead!
