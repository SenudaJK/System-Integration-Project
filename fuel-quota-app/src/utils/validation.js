export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePhone = (phone) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
};

export const validatePassword = (password) => {
    return password.length >= 6;
};

export const validateRequired = (value) => {
    return value && value.trim().length > 0;
};

export const validateNIC = (nic) => {
    const nicRegex = /^(\d{9}[vVxX]|\d{12})$/;
    return nicRegex.test(nic);
};

export const validateVehicleNumber = (vehicleNumber) => {
    const vehicleRegex = /^[A-Z]{2,3}-\d{4}$/;
    return vehicleRegex.test(vehicleNumber);
};

export const validateFuelAmount = (amount, maxAmount) => {
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

    // Format as +94XXXXXXXXX for Sri Lankan numbers
    if (cleaned.length === 10 && cleaned.startsWith("0")) {
        return "+94" + cleaned.substring(1);
    } else if (cleaned.length === 9) {
        return "+94" + cleaned;
    }

    return phone;
};

export const formatVehicleNumber = (vehicleNumber) => {
    // Convert to uppercase and format as XX-0000
    const cleaned = vehicleNumber.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

    if (cleaned.length >= 6) {
        const letters = cleaned.substring(0, cleaned.length - 4);
        const numbers = cleaned.substring(cleaned.length - 4);
        return `${letters}-${numbers}`;
    }

    return vehicleNumber.toUpperCase();
};
