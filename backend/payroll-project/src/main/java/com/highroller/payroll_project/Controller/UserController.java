package com.highroller.payroll_project.Controller;

import com.highroller.payroll_project.Entity.UserEntity;
import com.highroller.payroll_project.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    public static final int ROLE_ADMIN = 0;
    public static final int ROLE_HR = 1;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserEntity user) {
        try {
            // Check if username already exists
            if (userRepository.findByUsername(user.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
            }

            // Set role to HR by default
            user.setRole(ROLE_HR);

            UserEntity saved = userRepository.save(user);
            return ResponseEntity.ok(Map.of(
                    "id", saved.getId(),
                    "username", saved.getUsername(),
                    "role", saved.getRole()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Error creating user: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserEntity user, HttpSession session) {
        try {
            Optional<UserEntity> found = userRepository.findByUsername(user.getUsername());
            if (found.isPresent() && found.get().getPassword().equals(user.getPassword())) {
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
            return ResponseEntity.internalServerError().body(Map.of("error", "Error during login: " + e.getMessage()));
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
