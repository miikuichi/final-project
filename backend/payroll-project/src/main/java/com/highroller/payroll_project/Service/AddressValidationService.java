package com.highroller.payroll_project.Service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Service
public class AddressValidationService {
    
    private final WebClient webClient;
    
    // Using USPS Address Validation API (free tier available)
    // Alternative: Use Google Maps API, MapBox, or other address validation services
    private static final String USPS_API_BASE_URL = "https://secure.shippingapis.com/shippingapi.dll";
    
    public AddressValidationService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .baseUrl(USPS_API_BASE_URL)
                .build();
    }
    
    /**
     * Validates address using external API
     * For demo purposes, this uses a simple format validation
     * In production, you would integrate with USPS, Google Maps, or similar service
     */
    public boolean validateAddress(String street, String city, String state, String zipCode) {
        try {
            // Basic format validation
            if (!isBasicFormatValid(street, city, state, zipCode)) {
                return false;
            }
            
            // For demo: Use simple ZIP code validation
            // In production, you would call the actual API
            return isValidZipCode(zipCode) && isValidState(state);
            
        } catch (Exception e) {
            // Log error and default to basic validation
            System.err.println("Address validation service error: " + e.getMessage());
            return isBasicFormatValid(street, city, state, zipCode);
        }
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
     * Validates ZIP code format (US format)
     */
    private boolean isValidZipCode(String zipCode) {
        if (zipCode == null) return false;
        String cleaned = zipCode.replaceAll("[^0-9-]", "");
        return cleaned.matches("^\\d{5}(-\\d{4})?$");
    }
    
    /**
     * Validates US state abbreviations
     */
    private boolean isValidState(String state) {
        if (state == null) return false;
        String upperState = state.trim().toUpperCase();
        
        // US State abbreviations
        String[] validStates = {
            "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
            "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
            "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
            "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
            "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
        };
        
        for (String validState : validStates) {
            if (validState.equals(upperState)) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Future method for actual API integration
     */
    @SuppressWarnings("unused")
    private Mono<Boolean> callExternalAddressAPI(String street, String city, String state, String zipCode) {
        // This would be implemented when integrating with actual address validation service
        // Example with USPS or Google Maps API
        return webClient.get() // Using webClient here to avoid unused field warning
                .retrieve()
                .bodyToMono(Boolean.class)
                .timeout(Duration.ofSeconds(5))
                .onErrorReturn(false);
    }
}
