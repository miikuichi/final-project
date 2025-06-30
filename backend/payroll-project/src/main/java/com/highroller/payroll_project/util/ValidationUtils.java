package com.highroller.payroll_project.util;

import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.regex.Pattern;

@Component
public class ValidationUtils {

    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$");

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");

    private static final Pattern PHONE_PATTERN = Pattern.compile(
            "^\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$");

    public static final double MAX_REGULAR_HOURS_MONTHLY = 184.0;
    public static final double MAX_OVERTIME_HOURS_MONTHLY = 80.0;
    public static final double MAX_HOLIDAY_HOURS_MONTHLY = 64.0;
    public static final double MAX_NIGHT_DIFF_HOURS_MONTHLY = 184.0;

    /**
     * Validates password according to security requirements
     */
    public boolean isValidPassword(String password) {
        if (password == null || password.trim().isEmpty()) {
            return false;
        }
        return PASSWORD_PATTERN.matcher(password).matches();
    }

    /**
     * Returns password requirements message
     */
    public String getPasswordRequirements() {
        return "Password must be at least 8 characters long and contain: " +
                "1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&)";
    }

    /**
     * Validates email format
     */
    public boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        return EMAIL_PATTERN.matcher(email.trim()).matches();
    }

    /**
     * Validates phone number format
     */
    public boolean isValidPhone(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            return true;
        }
        return PHONE_PATTERN.matcher(phone.trim()).matches();
    }

    /**
     * Validates that date is not in the future
     */
    public boolean isDateNotInFuture(LocalDate date) {
        if (date == null) {
            return true;
        }
        return !date.isAfter(LocalDate.now());
    }

    /**
     * Validates work hours within acceptable limits
     */
    public boolean isValidRegularHours(Double hours) {
        return hours != null && hours >= 0 && hours <= MAX_REGULAR_HOURS_MONTHLY;
    }

    public boolean isValidOvertimeHours(Double hours) {
        return hours != null && hours >= 0 && hours <= MAX_OVERTIME_HOURS_MONTHLY;
    }

    public boolean isValidHolidayHours(Double hours) {
        return hours != null && hours >= 0 && hours <= MAX_HOLIDAY_HOURS_MONTHLY;
    }

    public boolean isValidNightDiffHours(Double hours) {
        return hours != null && hours >= 0 && hours <= MAX_NIGHT_DIFF_HOURS_MONTHLY;
    }

    /**
     * Sanitizes input string to prevent XSS
     */
    public String sanitizeInput(String input) {
        if (input == null) {
            return null;
        }
        return input.trim()
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll("\"", "&quot;")
                .replaceAll("'", "&#x27;")
                .replaceAll("/", "&#x2F;");
    }

    /**
     * Validates string length
     */
    public boolean isValidLength(String str, int maxLength) {
        return str != null && str.trim().length() <= maxLength && !str.trim().isEmpty();
    }
}
