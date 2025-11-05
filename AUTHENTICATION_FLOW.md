# 🔐 Role-Based Authentication & Access Control

## Overview
The system enforces **strict role separation** between Manufacturers and Vendors. Users can only access dashboards matching their assigned role in the database.

---

## 📊 How It Works

### 1. **Signup Process** (`Signup.tsx`)
- User selects role: **Manufacturer** or **Vendor**
- Provides: username, email, password
- Backend (`AuthController.java`) saves user with selected role to MySQL database
- Role stored in `users` table as: `MANUFACTURER` or `VENDOR`

### 2. **Database Storage** (MySQL)
```
Database: intelligentproduction
Table: users

Columns:
- id (auto-increment)
- username (unique)
- password (BCrypt encrypted)
- email (unique)
- role (MANUFACTURER or VENDOR) ← Determines access!
- enabled (true/false)
```

### 3. **Login Process** (`Login.tsx`)
- User enters **username** and **password** only
- NO role selection - role is fetched from database!
- Spring Security validates credentials
- If valid, creates session with user's database role

### 4. **Backend Authentication** (`CustomUserDetailsService.java`)
```java
1. Query database: SELECT * FROM users WHERE username = ?
2. Verify password (BCrypt)
3. Assign authority: "ROLE_" + user.role
   - Manufacturer → "ROLE_MANUFACTURER"
   - Vendor → "ROLE_VENDOR"
4. Create authenticated session
```

### 5. **Frontend Access Control** (`App.tsx`)
```typescript
1. Fetch user info from /api/user/info
2. Check roles array:
   - Has "ROLE_MANUFACTURER"? → Show ManufacturerDashboard
   - Has "ROLE_VENDOR"? → Show VendorDashboard
3. Auto-redirect based on role
```

---

## ✅ Security Features

### **Prevents Role Overlap:**
1. ✅ Role is stored in database during signup - cannot be changed via UI
2. ✅ Login does NOT ask for role - uses database value only
3. ✅ Backend validates role on every request
4. ✅ Frontend checks role before rendering dashboard
5. ✅ Manufacturers CANNOT access vendor dashboard (and vice versa)

### **Access Rules:**
| User Role | Can Access | Cannot Access |
|-----------|-----------|---------------|
| **Manufacturer** | ManufacturerDashboard<br>CSV Upload<br>Data Analysis<br>Vendor Feedback View | VendorDashboard<br>Vendor Feedback Submission |
| **Vendor** | VendorDashboard<br>Feedback Submission | ManufacturerDashboard<br>CSV Upload<br>Data Analysis |

---

## 🔄 Complete Flow Example

### Manufacturer Signup & Login:
```
1. User signs up as "Manufacturer" → Role saved to DB as "MANUFACTURER"
2. User logs in with username/password
3. Backend finds user, sees role = "MANUFACTURER"
4. Creates session with authority "ROLE_MANUFACTURER"
5. Frontend fetches user info, sees "ROLE_MANUFACTURER" in roles array
6. App.tsx renders ManufacturerDashboard
7. ✅ User sees: CSV Upload → Data Analysis → Vendor Feedback tabs
```

### Vendor Signup & Login:
```
1. User signs up as "Vendor" → Role saved to DB as "VENDOR"
2. User logs in with username/password
3. Backend finds user, sees role = "VENDOR"
4. Creates session with authority "ROLE_VENDOR"
5. Frontend fetches user info, sees "ROLE_VENDOR" in roles array
6. App.tsx renders VendorDashboard
7. ✅ User sees: Feedback submission form only
```

### ❌ What CANNOT Happen:
- Manufacturer cannot access vendor features
- Vendor cannot access manufacturer features
- User cannot "switch" roles after signup
- No role override via URL manipulation
- Session persists correct role across page refreshes

---

## 🗄️ Database Verification

### Check User Roles in MySQL:
```sql
USE intelligentproduction;

-- View all users with their roles
SELECT username, email, role, enabled FROM users;

-- Count manufacturers
SELECT COUNT(*) FROM users WHERE role = 'MANUFACTURER';

-- Count vendors
SELECT COUNT(*) FROM users WHERE role = 'VENDOR';

-- Find specific user's role
SELECT role FROM users WHERE username = 'your_username';
```

---

## 🧪 Testing

### Test Manufacturer Access:
1. Signup as Manufacturer
2. Login → Should see ManufacturerDashboard
3. CSV upload screen shown if no data
4. Cannot access `/vendor` routes

### Test Vendor Access:
1. Signup as Vendor
2. Login → Should see VendorDashboard
3. Feedback submission form
4. Cannot access `/manufacturer` routes

### Test Role Separation:
1. Create one manufacturer account
2. Create one vendor account
3. Login with manufacturer → Verify ManufacturerDashboard
4. Logout
5. Login with vendor → Verify VendorDashboard
6. ✅ Confirm no role overlap

---

## 🔒 Security Notes

1. **Passwords:** BCrypt encrypted in database (not plain text)
2. **Sessions:** Server-side Spring Security sessions
3. **CSRF Protection:** Enabled by Spring Security
4. **SQL Injection:** Prevented by JPA prepared statements
5. **Role Tampering:** Backend validates role from database, not client input

---

## 📝 Default Test Accounts

| Username | Password | Role | Access |
|----------|----------|------|--------|
| manufacturer | manu123 | MANUFACTURER | ManufacturerDashboard |
| vendor | vendor123 | VENDOR | VendorDashboard |

**Note:** These are created automatically on server startup by `DataInitializer.java`

---

## 🚀 How to Verify It's Working

1. **Check Database:**
   ```sql
   SELECT username, role FROM users;
   ```

2. **Test Login Flow:**
   - Visit http://localhost:8080/login
   - Login as manufacturer → Should redirect to manufacturer dashboard
   - Logout
   - Login as vendor → Should redirect to vendor dashboard

3. **Check Browser Console:**
   - Open DevTools → Network tab
   - Login and watch `/api/user/info` response
   - Verify roles array contains correct role

4. **Test Access Control:**
   - Try accessing wrong dashboard via URL
   - System should redirect to correct dashboard based on role

---

## ✅ Confirmed Features

✔️ Role stored in MySQL database  
✔️ Role enforced by Spring Security  
✔️ Frontend checks role before rendering  
✔️ No role selection on login (uses database value)  
✔️ Manufacturer → ManufacturerDashboard only  
✔️ Vendor → VendorDashboard only  
✔️ No cross-role access possible  
✔️ Sessions persist across page refreshes  
✔️ Logout clears session properly  

---

**Your system now has complete role-based access control! 🎉**
