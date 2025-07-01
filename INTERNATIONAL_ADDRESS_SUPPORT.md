# International Address Support - Philippines Fix

## Problem Identified

The employee creation form was failing because the ZIP code validation was hardcoded for US postal codes (5 digits), but Philippine postal codes are typically 4 digits (e.g., 1223 for Makati, 6000 for Cebu).

## Changes Made

### 1. Frontend Changes (AddEmployee.jsx)

#### ZIP Code Validation

**Before (US-only):**

```javascript
if (!/^\d{5}(-\d{4})?$/.test(form.addressZip)) {
  newErrors.addressZip =
    "Please enter a valid ZIP code (e.g., 12345 or 12345-6789)";
}
```

**After (International):**

```javascript
if (!/^[A-Za-z0-9\s\-]{3,10}$/.test(form.addressZip)) {
  newErrors.addressZip =
    "Please enter a valid postal/ZIP code (3-10 characters)";
}
```

#### ZIP Code Input Field

- **Removed:** Number-only restriction
- **Added:** Placeholder showing international examples: "e.g., 1000 (PH), 12345 (US), K1A 0A9 (CA)"
- **Changed:** Label from "ZIP Code" to "ZIP/Postal Code"

#### Country Selection

- **Added:** Philippines (PH) as an option
- **Changed:** Default country from "US" to "PH"
- **Added:** More international options (Canada, Mexico, UK, Australia, etc.)

### 2. Backend Changes (AddressValidationService.java)

#### ZIP/Postal Code Validation

**Before (US-only):**

```java
private boolean isValidZipCode(String zipCode) {
    String cleaned = zipCode.replaceAll("[^0-9-]", "");
    return cleaned.matches("^\\d{5}(-\\d{4})?$");
}
```

**After (International):**

```java
private boolean isValidZipCode(String zipCode) {
    String cleaned = zipCode.trim();
    return cleaned.matches("^[A-Za-z0-9\\s\\-]{3,10}$");
}
```

#### State/Province Validation

**Before (US states only):**

- Hardcoded list of US state abbreviations

**After (International):**

```java
private boolean isValidState(String state) {
    String trimmed = state.trim();
    return trimmed.matches("^[A-Za-z\\s\\.\\-]{2,50}$");
}
```

## Supported Address Formats

### Philippines

- **Postal Code:** 4 digits (e.g., 1223, 6000, 4000)
- **Province:** Full names (e.g., "Metro Manila", "Cebu", "Davao del Sur")
- **Example:** 123 Rizal Street, San Antonio, Makati City, Metro Manila, 1223, PH

### United States

- **ZIP Code:** 5 digits or 5+4 (e.g., 12345, 12345-6789)
- **State:** Full names or abbreviations (e.g., "California", "CA")

### Canada

- **Postal Code:** Letter-digit-letter digit-letter-digit (e.g., K1A 0A9)
- **Province:** Full names (e.g., "Ontario", "British Columbia")

### United Kingdom

- **Postcode:** Various formats (e.g., SW1A 1AA, M1 1AA)
- **Region:** Full names (e.g., "Greater London", "West Midlands")

## Testing

### Test Files Created

1. **philippine-address-test.html** - Comprehensive test for Philippine addresses
2. **add-employee-test.html** - General employee creation test
3. **backend-test.html** - Backend connectivity test

### Test Cases Covered

- ✅ Philippine 4-digit postal codes (1223, 6000, 4000)
- ✅ US 5-digit ZIP codes (12345, 90210)
- ✅ Canadian postal codes (K1A 0A9, M5V 3A8)
- ✅ UK postcodes (SW1A 1AA, M1 1AA)
- ✅ Empty address fields (should work)
- ✅ Partial address fields (should work)

## How to Test

1. **Open the test page:**

   ```
   Open philippine-address-test.html in your browser
   ```

2. **Test Philippine addresses:**

   - Click "Test Philippine Employee" for Makati address with 1223 postal code
   - Click "Test Makati Employee" for another Manila area
   - Click "Test Cebu Employee" for Cebu with 6000 postal code

3. **Test your actual form:**
   - Go to Add Employee page
   - Fill in Philippine address with 4-digit postal code
   - Should now work without validation errors

## Example Working Philippine Address

```
House/Street: 123 Rizal Street
Barangay: San Antonio
City: Makati City
Province: Metro Manila
ZIP/Postal Code: 1223
Country: Philippines
```

## Common Philippine Postal Codes

- **Manila:** 1000-1099
- **Makati:** 1200-1299
- **Quezon City:** 1100-1199
- **Cebu City:** 6000
- **Davao City:** 8000
- **Iloilo City:** 5000

## Benefits

1. **International Compatibility:** Now supports addresses from multiple countries
2. **Philippine Support:** Specifically optimized for Philippine 4-digit postal codes
3. **Flexible Validation:** Accepts various international postal code formats
4. **Better UX:** Clear placeholders and examples for users
5. **Google Maps Ready:** Compatible with Google Maps Geocoding API for international addresses

The form should now work perfectly with Philippine addresses and 4-digit postal codes!
