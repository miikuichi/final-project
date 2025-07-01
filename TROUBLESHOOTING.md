# Troubleshooting: Add Employee Form Issues

## Problem: "Add Employee" form doesn't submit successfully

### Most Common Causes:

1. **Missing Database Column** ✅

   - **Issue**: New `address_country` field was added to code but not to database
   - **Solution**: Run the SQL queries in `DATABASE_UPDATE.sql`

2. **Database Connection Issues**

   - Check if MySQL is running
   - Verify database credentials in `application.properties`
   - Check if `db_payroll` database exists

3. **Backend Validation Errors**

   - Check browser Developer Tools > Network tab for error responses
   - Look at backend console logs for validation failures

4. **CORS Issues**
   - Ensure frontend is running on `http://localhost:5173` or `http://localhost:5174`
   - Backend should show CORS configuration in logs

## Step-by-Step Debugging:

### 1. Check Database Schema

Run this query to verify the employees table structure:

```sql
DESCRIBE employees;
```

You should see `address_country` column listed.

### 2. Check Backend Logs

When you submit the form, you should see these logs:

```
About to save employee...
Employee saved successfully with ID: [number]
```

If you see validation errors instead, that's your issue.

### 3. Check Frontend Network Tab

1. Open browser Developer Tools (F12)
2. Go to Network tab
3. Submit the form
4. Look for the POST request to `/api/employees`
5. Check the response:
   - **200 OK**: Success
   - **400 Bad Request**: Validation error (check response body)
   - **500 Internal Server Error**: Backend/database error

### 4. Test with Simple Data

Try submitting with minimal required fields:

- First Name: "Test"
- Last Name: "User"
- Email: "test@example.com"
- Date Hired: Today's date
- Department: "Information Technology"
- Position: "Software Developer"

### 5. Common Validation Issues

- **Email**: Must be unique and valid format
- **Phone**: Must be valid US format (if provided)
- **Dates**: Cannot be in the future
- **Address**: If provided, must include all fields (house, city, state, zip)

## Quick Fixes:

### Fix 1: Reset Database (if needed)

If you want to start fresh:

```sql
DROP TABLE IF EXISTS employees;
-- Then restart your Spring Boot application to recreate the table
```

### Fix 2: Check Required Dependencies

Ensure these are in your `pom.xml`:

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>
```

### Fix 3: Temporary Disable Validation

In `EmployeeController.java`, you can temporarily comment out address validation:

```java
// if (!addressValidationService.validateAddress(...)) {
//     return ResponseEntity.badRequest().body(Map.of("error", "Invalid address"));
// }
```

## Success Indicators:

✅ Backend logs show "Employee saved successfully"  
✅ Frontend shows "Employee added successfully!" alert  
✅ Form fields are cleared after submission  
✅ You can see the new employee in the database

## Still Having Issues?

1. Check the exact error message in browser console
2. Look at the full backend stack trace
3. Verify all required fields are filled in the form
4. Make sure your database user has INSERT privileges
