export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePhone = (phone) => {
    // Remove all non-digit characters for validation
    const cleaned = phone.replace(/\D/g, "");

    // Must start with 07 and have exactly 10 digits
    if (!cleaned.startsWith("07") || cleaned.length !== 10) {
        return false;
    }

    // Check if same digit repeats 8 or more times
    const digitCounts = {};
    for (let digit of cleaned) {
        digitCounts[digit] = (digitCounts[digit] || 0) + 1;
        if (digitCounts[digit] >= 8) {
            return false;
        }
    }

    return true;
};

export const validatePassword = (password) => {
    // Must be at least 8 characters
    if (password.length < 8) {
        return false;
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
        return false;
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
        return false;
    }

    // Check for at least one digit
    if (!/\d/.test(password)) {
        return false;
    }

    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        return false;
    }

    return true;
};

export const validateRequired = (value) => {
    return value && value.trim().length > 0;
};

export const validateName = (name) => {
    // Only letters and spaces allowed, minimum 2 characters
    const nameRegex = /^[A-Za-z\s]{2,}$/;
    const trimmedName = name.trim();

    // Check if name meets basic requirements
    if (!nameRegex.test(trimmedName)) {
        return false;
    }

    // Check if name contains at least one non-space character
    if (trimmedName.replace(/\s/g, '').length < 2) {
        return false;
    }

    return true;
};

export const validateNIC = (nic) => {
    // Remove spaces and convert to uppercase
    const cleaned = nic.replace(/\s/g, "").toUpperCase();

    // Check for 12 digits only
    if (/^\d{12}$/.test(cleaned)) {
        return true;
    }

    // Check for 9 alphanumeric + V (old format)
    if (/^\d{9}V$/.test(cleaned)) {
        return true;
    }

    return false;
};

export const validateVehicleNumber = (vehicleNumber) => {
    // Remove spaces and hyphens, convert to uppercase
    const cleaned = vehicleNumber.replace(/[\s-]/g, "").toUpperCase();

    // Allow numbers only (up to 4 digits)
    if (/^\d{1,4}$/.test(cleaned)) {
        return true;
    }

    // Allow letters + numbers (max 3 letters + 4 numbers)
    if (/^[A-Z]{1,3}\d{1,4}$/.test(cleaned)) {
        return true;
    }

    return false;
};

export const validateFuelAmount = (amount, maxAmount) => {
    // Check if it's a valid number (digits only, can include decimal)
    if (!/^\d+(\.\d+)?$/.test(amount.toString())) {
        return false;
    }

    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount > 0 && numAmount <= maxAmount;
};

export const validateFormData = (data, rules) => {
    const errors = {};

    Object.keys(rules).forEach((field) => {
        const value = data[field];
        const fieldRules = rules[field];

        if (fieldRules.required && !validateRequired(value)) {
            errors[field] = fieldRules.required;
        } else if (value && fieldRules.email && !validateEmail(value)) {
            errors[field] = fieldRules.email;
        } else if (value && fieldRules.phone && !validatePhone(value)) {
            errors[field] = fieldRules.phone;
        } else if (value && fieldRules.password && !validatePassword(value)) {
            errors[field] = fieldRules.password;
        } else if (value && fieldRules.name && !validateName(value)) {
            errors[field] = fieldRules.name;
        } else if (value && fieldRules.nic && !validateNIC(value)) {
            errors[field] = fieldRules.nic;
        } else if (
            value &&
            fieldRules.vehicle &&
            !validateVehicleNumber(value)
        ) {
            errors[field] = fieldRules.vehicle;
        }
    });

    return errors;
};

export const formatPhoneNumber = (phone) => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, "");

    // Format as 07X XXX XXXX for Sri Lankan numbers
    if (cleaned.length === 10 && cleaned.startsWith("07")) {
        return cleaned.substring(0, 3) + " " + cleaned.substring(3, 6) + " " + cleaned.substring(6);
    }

    return phone;
};

export const formatVehicleNumber = (vehicleNumber) => {
    // Remove spaces and hyphens, convert to uppercase
    const cleaned = vehicleNumber.replace(/[\s-]/g, "").toUpperCase();

    // If it's numbers only, return as is
    if (/^\d+$/.test(cleaned)) {
        return cleaned;
    }

    // If it has letters and numbers, format with hyphen
    const letters = cleaned.match(/^[A-Z]+/)?.[0] || "";
    const numbers = cleaned.match(/\d+$/)?.[0] || "";

    if (letters && numbers) {
        return `${letters}-${numbers}`;
    }

    return vehicleNumber.toUpperCase();
};

// Helper function to get detailed validation error messages
export const getValidationErrorMessage = (field, value) => {
    switch (field) {
        case 'phone':
            if (!validatePhone(value)) {
                const cleaned = value.replace(/\D/g, "");
                if (!cleaned.startsWith("07")) {
                    return "Phone number must start with 07";
                }
                if (cleaned.length !== 10) {
                    return "Phone number must have exactly 10 digits";
                }
                // Check for repeated digits
                const digitCounts = {};
                for (let digit of cleaned) {
                    digitCounts[digit] = (digitCounts[digit] || 0) + 1;
                    if (digitCounts[digit] >= 8) {
                        return "Phone number cannot have the same digit repeated 8 or more times";
                    }
                }
            }
            break;
        case 'password':
            if (!validatePassword(value)) {
                if (value.length < 8) return "Password must be at least 8 characters long";
                if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter";
                if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
                if (!/\d/.test(value)) return "Password must contain at least one digit";
                if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) return "Password must contain at least one special character";
            }
            break;
        case 'name':
        case 'firstName':
        case 'lastName':
            if (!validateName(value)) {
                return "Name can only contain letters and spaces (minimum 2 characters)";
            }
            break;
        case 'nic':
            if (!validateNIC(value)) {
                return "NIC must be either 12 digits or 9 digits followed by 'V'";
            }
            break;
        case 'vehicle':
            if (!validateVehicleNumber(value)) {
                return "Vehicle number must be numbers only (max 4) or letters (max 3) + numbers (max 4)";
            }
            break;
        case 'fuelAmount':
            if (!validateFuelAmount(value)) {
                return "Fuel amount must be a valid positive number";
            }
            break;
        default:
            return "Invalid input";
    }
    return null;
};