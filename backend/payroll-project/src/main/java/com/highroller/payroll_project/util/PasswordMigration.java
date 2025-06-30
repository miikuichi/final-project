package com.highroller.payroll_project.util;

import com.highroller.payroll_project.Entity.UserEntity;
import com.highroller.payroll_project.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * One-time migration to hash existing plain text passwords
 * This will run on application startup and update any users with unhashed
 * passwords
 */
@Component
public class PasswordMigration implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Checking for users with unhashed passwords...");

        List<UserEntity> allUsers = userRepository.findAll();
        int updatedCount = 0;

        for (UserEntity user : allUsers) {
            String password = user.getPassword();

            if (password != null && !password.startsWith("$2")) {
                System.out.println("Updating password for user: " + user.getUsername());

                String hashedPassword = passwordEncoder.encode(password);
                user.setPassword(hashedPassword);
                userRepository.save(user);
                updatedCount++;
            }
        }

        if (updatedCount > 0) {
            System.out.println("Successfully updated " + updatedCount + " user passwords to use secure hashing.");
        } else {
            System.out.println("All user passwords are already properly hashed.");
        }
    }
}
