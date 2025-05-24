# Transaction Management and Email Integration Testing Guide

## What We Fixed

### ❌ BEFORE: Problems with Registration
1. **Async Email Sending**: Email was sent asynchronously (@Async), so if it failed, the user/OTP data was already saved
2. **No Transaction Rollback**: If email failed, user and vehicle data remained in database
3. **Inconsistent State**: Users could be registered but never receive verification emails
4. **No Proper Error Handling**: Errors didn't prevent database commits

### ✅ AFTER: Robust Transaction Management
1. **Synchronous Email in Transactions**: Email sending is now synchronous within database transactions
2. **Automatic Rollback**: If email fails, ALL database changes are rolled back
3. **Consistent State**: Either everything succeeds, or nothing is saved
4. **Proper Error Handling**: Clear error messages and proper HTTP status codes

## How It Works Now

### Registration Flow with Transaction Management
```
1. START TRANSACTION
2. Validate owner doesn't exist
3. Save Owner to database
4. Save Vehicle to database  
5. Generate OTP record
6. Send email SYNCHRONOUSLY ← If this fails, everything rolls back
7. COMMIT TRANSACTION (only if all steps succeed)
```

### Email Service Options
- **Real Gmail SMTP**: When `app.email.mock=false`
- **Mock Email Service**: When `app.email.mock=true` (for development)

## Testing the Transaction Management

### Test 1: Successful Registration
```bash
# Should save everything and send email
POST http://localhost:8080/api/register/store-ownervehicle
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "test@example.com",
  "phone": "0771234567",
  "address": "123 Main St",
  "nic": "123456789V",
  "vehicle": {
    "vehicleNumber": "ABC-1234",
    "vehicleType": "CAR",
    "fuelType": "PETROL"
  }
}
```

**Expected Result**: 
- ✅ Owner created in database
- ✅ Vehicle created in database  
- ✅ OTP record created in database
- ✅ Email sent (real or mock)
- ✅ Returns 201 Created with IDs

### Test 2: Email Failure (Transaction Rollback)
```bash
# Set app.email.mock=false and ensure Gmail SMTP is broken
# OR temporarily break MockEmailService to throw exception
```

**Expected Result**:
- ❌ Owner NOT saved to database
- ❌ Vehicle NOT saved to database
- ❌ OTP record NOT saved to database
- ❌ Returns 500 Internal Server Error
- ✅ Database remains clean (no partial data)

### Test 3: Duplicate Email
```bash
# Try to register same email twice
```

**Expected Result**:
- ❌ Returns 400 Bad Request
- ❌ "Owner with this email already exists"
- ✅ No database changes

## Configuration Options

### For Development (Mock Email)
```properties
app.email.mock=true
```

### For Production (Real Email)  
```properties
app.email.mock=false
spring.mail.host=smtp.gmail.com
spring.mail.port=587
# ... other email settings
```

## Database Verification

### Check Owner Table
```sql
SELECT * FROM owner WHERE email = 'test@example.com';
```

### Check Vehicle Table
```sql
SELECT * FROM vehicle WHERE owner_nic = '123456789V';
```

### Check OTP Table
```sql
SELECT * FROM otp_record WHERE email = 'test@example.com';
```

**Important**: If registration fails, NONE of these queries should return results.

## Endpoints for Testing

### 1. Register Owner + Vehicle (Transactional)
```
POST /api/register/store-ownervehicle
```

### 2. Send OTP (Transactional)
```
POST /api/register/send-otp?email=test@example.com
```

### 3. Test Email Service
```
POST /api/test/send-email?email=test@example.com
```

### 4. Check Email Configuration
```
GET /api/test/email-config
```

## Error Scenarios to Test

1. **Invalid Email Format**: Should fail validation
2. **Duplicate Email**: Should prevent registration
3. **Email Service Down**: Should rollback transaction
4. **Invalid Vehicle Data**: Should rollback transaction
5. **Database Connection Issues**: Should rollback transaction

## Log Messages to Watch

Look for these log messages:
```
INFO - Starting transactional registration for email: test@example.com
INFO - Owner saved successfully with ID: 1
INFO - Vehicle registered successfully with ID: 1  
INFO - Verification OTP sent successfully to: test@example.com
INFO - Registration completed successfully for email: test@example.com
```

OR in case of failure:
```
ERROR - Registration failed for email: test@example.com. Error: Failed to send email
```

## Quick Toggle Between Real/Mock Email

### Enable Mock Email (Safe for Development)
```bash
# Update application.properties
app.email.mock=true
```

### Enable Real Email (For Production Testing)
```bash
# Update application.properties  
app.email.mock=false
```

Then restart the application to test transaction behavior with different email configurations.

## UPDATED IMPLEMENTATION - COMPLETE TRANSACTION MANAGEMENT

### What Was Just Implemented

We've now implemented **complete transaction management** for the owner-vehicle registration process:

#### 1. New Transactional Method: `storeOwnerAndVehicle()`
- **Location**: `OwnerService.java` 
- **Annotation**: `@Transactional(rollbackFor = Exception.class)`
- **Flow**: 
  1. Validate email doesn't exist
  2. Save Owner entity
  3. Save Vehicle entity (with weekly quota from vehicle_types table)  
  4. Send verification email synchronously
  5. Commit transaction ONLY if all steps succeed

#### 2. Updated Controller Endpoint
- **Endpoint**: `POST /api/register/store-ownervehicle`
- **Previous Issue**: Called `storeOwner()` and `registerVehicle()` separately
- **New Implementation**: Uses atomic `storeOwnerAndVehicle()` method

### Testing the Complete Transaction Flow

#### Test A: Normal Registration (Should Succeed)
```bash
POST http://localhost:8080/api/register/store-ownervehicle
Content-Type: application/json

{
    "firstName": "John",
    "lastName": "Doe", 
    "email": "john.doe@test.com",
    "phone": "1234567890",
    "address": "123 Test Street",
    "nic": "123456789V",
    "vehicle": {
        "vehicleNumber": "CAR-1234",
        "vehicleType": "CAR",
        "fuelType": "PETROL",
        "engineCapacity": 1500
    }
}
```

**Expected Result**:
- ✅ Owner created in database
- ✅ Vehicle created with `weekly_available_quantity` from `vehicle_types` table
- ✅ Verification email sent (mock or real)
- ✅ HTTP 201 response with both IDs

#### Test B: Invalid Vehicle Type (Should Rollback Everything)
```bash
POST http://localhost:8080/api/register/store-ownervehicle
Content-Type: application/json

{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@test.com", 
    "phone": "9876543210",
    "address": "456 Test Avenue",
    "nic": "987654321V",
    "vehicle": {
        "vehicleNumber": "INVALID-9999",
        "vehicleType": "INVALID_TYPE",
        "fuelType": "PETROL",
        "engineCapacity": 1500
    }
}
```

**Expected Result**:
- ❌ Vehicle creation fails (invalid vehicle type)
- ❌ Owner data rolled back (NOT saved to database)
- ❌ HTTP 500 error response
- ✅ Database remains clean

#### Test C: Email Service Failure (Should Rollback Everything)
**Setup**: Configure email to fail or disable mock email service temporarily

**Expected Result**:
- ❌ Email sending fails
- ❌ Owner data rolled back
- ❌ Vehicle data rolled back  
- ❌ HTTP 500 error response
- ✅ No partial data in database

### Database Verification Queries

#### Check for Owner (Should be empty after failed tests)
```sql
SELECT * FROM owners WHERE email = 'jane.smith@test.com';
```

#### Check for Vehicle (Should be empty after failed tests)  
```sql
SELECT * FROM vehicles WHERE owner_nic = '987654321V';
```

#### Verify Vehicle Weekly Quota (For successful tests)
```sql
SELECT v.*, vt.weekly_quota, v.weekly_available_quantity
FROM vehicles v 
JOIN vehicle_types vt ON v.vehicle_type_id = vt.id 
WHERE v.vehicle_number = 'CAR-1234';
```

### Transaction Rollback Verification Checklist

- [ ] Failed vehicle registration prevents owner data from being saved
- [ ] Failed email sending prevents both owner and vehicle data from being saved
- [ ] Successful registration saves both owner and vehicle with correct relationships
- [ ] Vehicle gets correct `weekly_available_quantity` from `vehicle_types` table
- [ ] No orphaned records remain in database after failures
- [ ] Appropriate error messages returned for each failure type

This ensures complete data consistency - either the entire registration succeeds, or nothing is saved to the database.
