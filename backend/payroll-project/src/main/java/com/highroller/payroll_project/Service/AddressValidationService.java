package com.highroller.payroll_project.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriUtils;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.nio.charset.StandardCharsets;
import java.time.Duration;

@Service
public class AddressValidationService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${google.maps.api.key:}")
    private String googleMapsApiKey;

    private static final String GOOGLE_GEOCODING_API_URL = "https://maps.googleapis.com/maps/api/geocode/json";

    public AddressValidationService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Validates address using Google Maps Geocoding API
     * Falls back to basic validation if API is unavailable or no API key is
     * provided
     */
    public boolean validateAddress(String street, String city, String state, String zipCode) {
        return validateAddress(street, city, state, zipCode, "US");
    }

    /**
     * Validates address using Google Maps Geocoding API with country support
     */
    public boolean validateAddress(String street, String city, String state, String zipCode, String country) {
        return validateAddress(street, null, city, state, zipCode, country);
    }

    /**
     * Validates address using Google Maps Geocoding API with full address
     * components including barangay
     */
    public boolean validateAddress(String street, String barangay, String city, String state, String zipCode,
            String country) {
        try {
            if (!isBasicFormatValid(street, city, state, zipCode)) {
                return false;
            }

            if (googleMapsApiKey != null && !googleMapsApiKey.trim().isEmpty()) {
                return validateAddressWithGoogleMaps(street, barangay, city, state, zipCode, country);
            } else {
                System.out.println("Google Maps API key not configured, using basic validation");
                return isValidZipCode(zipCode) && isValidState(state);
            }
        } catch (Exception e) {
            System.err.println("Address validation service error: " + e.getMessage());
            return isBasicFormatValid(street, city, state, zipCode);
        }
    }

    /**
     * Validates address using Google Maps Geocoding API
     */
    private boolean validateAddressWithGoogleMaps(String street, String city, String state, String zipCode,
            String country) {
        return validateAddressWithGoogleMaps(street, null, city, state, zipCode, country);
    }

    /**
     * Validates address using Google Maps Geocoding API with barangay support
     */
    private boolean validateAddressWithGoogleMaps(String street, String barangay, String city, String state,
            String zipCode,
            String country) {
        try {
            String address = buildFullAddress(street, barangay, city, state, zipCode, country);
            String encodedAddress = UriUtils.encode(address, StandardCharsets.UTF_8);
            String url = GOOGLE_GEOCODING_API_URL + "?address=" + encodedAddress + "&key=" + googleMapsApiKey;

            System.out.println("Validating address with Google Maps API:");
            System.out.println("  Full address: " + address);
            System.out.println("  Encoded URL: " + url);

            String response = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();

            if (response != null) {
                JsonNode jsonResponse = objectMapper.readTree(response);
                String status = jsonResponse.get("status").asText();

                System.out.println("  Google Maps API response status: " + status);

                if ("OK".equals(status)) {
                    JsonNode results = jsonResponse.get("results");
                    boolean isValid = results != null && results.size() > 0;
                    System.out.println("  Address validation result: " + (isValid ? "VALID" : "INVALID"));
                    return isValid;
                } else if ("ZERO_RESULTS".equals(status)) {
                    System.out.println("  Google Maps found no results for this address - using basic validation");
                    // For international addresses or remote areas, fall back to basic validation
                    return isValidZipCode(zipCode) && isValidState(state);
                } else {
                    System.out.println("  Google Maps API error: " + status + " - using basic validation");
                    // Fall back to basic validation on API errors (rate limits, invalid API key,
                    // etc.)
                    return isValidZipCode(zipCode) && isValidState(state);
                }
            }
            return false;
        } catch (Exception e) {
            System.err.println("Google Maps API validation error: " + e.getMessage());
            e.printStackTrace();
            return isValidZipCode(zipCode) && isValidState(state);
        }
    }

    /**
     * Builds full address string for API calls
     */
    private String buildFullAddress(String street, String city, String state, String zipCode, String country) {
        return buildFullAddress(street, null, city, state, zipCode, country);
    }

    /**
     * Builds full address string for API calls with barangay support
     * Optimized for Philippine addresses but works internationally
     */
    private String buildFullAddress(String street, String barangay, String city, String state, String zipCode,
            String country) {
        StringBuilder address = new StringBuilder();

        // Street/House number
        if (street != null && !street.trim().isEmpty()) {
            address.append(street.trim());
        }

        // Barangay (for Philippine addresses)
        if (barangay != null && !barangay.trim().isEmpty()) {
            if (address.length() > 0)
                address.append(", ");
            address.append(barangay.trim());
        }

        // City
        if (city != null && !city.trim().isEmpty()) {
            if (address.length() > 0)
                address.append(", ");
            address.append(city.trim());
        }

        // State/Province
        if (state != null && !state.trim().isEmpty()) {
            if (address.length() > 0)
                address.append(", ");
            address.append(state.trim());
        }

        // ZIP/Postal Code
        if (zipCode != null && !zipCode.trim().isEmpty()) {
            if (address.length() > 0)
                address.append(" ");
            address.append(zipCode.trim());
        }

        // Country
        if (country != null && !country.trim().isEmpty()) {
            if (address.length() > 0)
                address.append(", ");
            address.append(country.trim());
        }

        return address.toString();
    }

    /**
     * Basic format validation for address components
     */
    private boolean isBasicFormatValid(String street, String city, String state, String zipCode) {
        return street != null && !street.trim().isEmpty() && street.length() <= 200 &&
                city != null && !city.trim().isEmpty() && city.length() <= 100 &&
                state != null && !state.trim().isEmpty() && state.length() <= 50 &&
                zipCode != null && !zipCode.trim().isEmpty();
    }

    /**
     * Validates ZIP/Postal code format (International format)
     * Supports various international postal code formats:
     * - Philippines: 4 digits (e.g., 1000)
     * - US: 5 digits or 5+4 (e.g., 12345, 12345-6789)
     * - Canada: Letter-digit-letter digit-letter-digit (e.g., K1A 0A9)
     * - UK: Various formats (e.g., SW1A 1AA)
     */
    private boolean isValidZipCode(String zipCode) {
        if (zipCode == null)
            return false;
        String cleaned = zipCode.trim();
        // Allow 3-10 characters with letters, numbers, spaces, and hyphens
        return cleaned.matches("^[A-Za-z0-9\\s\\-]{3,10}$");
    }

    /**
     * Validates state/province/region names (International)
     * For international compatibility, we accept any reasonable state/province name
     * instead of restricting to US states only
     */
    private boolean isValidState(String state) {
        if (state == null)
            return false;
        String trimmed = state.trim();

        // Allow any state/province name that's:
        // - 2-50 characters long
        // - Contains only letters, spaces, periods, and hyphens
        // This covers US states, Philippine provinces, Canadian provinces, etc.
        return trimmed.matches("^[A-Za-z\\s\\.\\-]{2,50}$");
    }

}
