# Testing Guide for Weekly Available Quantity Feature

## Fixed Issues:
1. ✅ Updated fuel type enums to match your database: DIESEL, ELECTRIC, KEROSENE, PETROL
2. ✅ Added support for string vehicle type in API requests (like "CAR")
3. ✅ Vehicle registration now fetches weekly_quota from vehicle_types table
4. ✅ Sets weekly_available_quantity = weekly_quota when vehicle is registered

## Test Your API Request

Your current request should now work:

```json
POST http://localhost:8084/api/register/store-ownervehicle

{
    "nic": "200182903094",
    "firstName": "John",
    "lastName": "Doe", 
    "email": "johndoe@example.com",
    "phone": "0712345678",
    "address": "123 Main Street",
    "vehicle": {
        "vehicleNumber": "VH0038",
        "chassisNumber": "CHS976018", 
        "vehicleType": "CAR",
        "fuelType": "DIESEL",
        "ownerNic": "200182903094"
    }
}
```

## What Happens:
1. System looks up vehicle_types table for name = "CAR"
2. Finds the weekly_quota for CAR (should be 20.0)
3. Sets vehicle.weekly_available_quantity = 20.0
4. Saves vehicle with the weekly quota

## Debug Endpoints:
```
GET http://localhost:8084/api/debug/vehicle-types
GET http://localhost:8084/api/debug/vehicle-type-enums
GET http://localhost:8084/api/debug/fuel-types
```

## Check Database After Registration:
```sql
-- Check if vehicle was created with correct weekly_available_quantity
SELECT v.vehicle_number, v.weekly_available_quantity, vt.name, vt.weekly_quota 
FROM vehicle v 
JOIN vehicle_types vt ON v.vehicle_type_id = vt.id 
WHERE v.vehicle_number = 'VH0038';
```

## Expected Result:
- Vehicle should be created successfully
- weekly_available_quantity should equal the weekly_quota from vehicle_types table
- For "CAR" type, this should be 20.0 liters

## Start the Application:
```powershell
mvn spring-boot:run
```

## If Email Issues Persist:
The application now has error handling for initialization, so it should start even if email configuration has issues.
