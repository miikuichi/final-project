package com.highroller.payroll_project.Controller;

import com.highroller.payroll_project.Entity.UserEntity;
import com.highroller.payroll_project.Repository.UserRepository;
import com.highroller.payroll_project.util.ValidationUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private ValidationUtils validationUtils;

    public static final int ROLE_ADMIN = 0;
    public static final int ROLE_HR = 1;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserEntity user) {
        try {
            // Input validation and sanitization
            if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username is required"));
            }
            
            if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Password is required"));
            }
            
            // Sanitize inputs
            user.setUsername(validationUtils.sanitizeInput(user.getUsername()));
            
            // Validate password strength
            if (!validationUtils.isValidPassword(user.getPassword())) {
                return ResponseEntity.badRequest().body(Map.of("error", validationUtils.getPasswordRequirements()));
            }
            
            // Check if username already exists
            if (userRepository.findByUsername(user.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
            }

            // Hash the password before saving
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            
            // Set role to HR by default
            user.setRole(ROLE_HR);

            UserEntity saved = userRepository.save(user);
            return ResponseEntity.ok(Map.of(
                    "id", saved.getId(),
                    "username", saved.getUsername(),
                    "role", saved.getRole()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Error creating user"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserEntity user, HttpSession session) {
        try {
            // Input validation and sanitization
            if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username is required"));
            }
            
            if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Password is required"));
            }
            
            // Sanitize username input
            String sanitizedUsername = validationUtils.sanitizeInput(user.getUsername());
            
            Optional<UserEntity> found = userRepository.findByUsername(sanitizedUsername);
            if (found.isPresent() && passwordEncoder.matches(user.getPassword(), found.get().getPassword())) {
                UserEntity loggedInUser = found.get();

                // Store user info in session
                session.setAttribute("userId", loggedInUser.getId());
                session.setAttribute("username", loggedInUser.getUsername());
                session.setAttribute("role", loggedInUser.getRole());

                // Create response with user details
                Map<String, Object> response = new HashMap<>();
                response.put("id", loggedInUser.getId());
                response.put("username", loggedInUser.getUsername());
                response.put("role", loggedInUser.getRole());
                response.put("roleLabel", loggedInUser.getRole() == ROLE_ADMIN ? "admin" : "hr");

                return ResponseEntity.ok()
                        .body(response);
            }
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Error during login"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @GetMapping("/session")
    public ResponseEntity<?> checkSession(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId != null) {
            String username = (String) session.getAttribute("username");
            Integer role = (Integer) session.getAttribute("role");
            return ResponseEntity.ok(Map.of(
                    "userId", userId,
                    "username", username,
                    "role", role,
                    "roleLabel", role == ROLE_ADMIN ? "admin" : "hr"));
        }
        return ResponseEntity.status(401).body(Map.of("error", "No active session"));
    }
}
