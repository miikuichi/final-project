package com.highroller.payroll_project.Controller;

import com.highroller.payroll_project.Entity.UserEntity;
import com.highroller.payroll_project.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public UserEntity signup(@RequestBody UserEntity user) {
        return userRepository.save(user);
    }

    @PostMapping("/login")
    public ResponseEntity<UserEntity> login(@RequestBody UserEntity user) {
        Optional<UserEntity> found = userRepository.findByUsername(user.getUsername());
        if (found.isPresent() && found.get().getPassword().equals(user.getPassword())) {
            return ResponseEntity.ok(found.get());
        }
        return ResponseEntity.status(401).build();
    }
}
