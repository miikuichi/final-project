package com.highroller.payroll_project.Service;

import com.highroller.payroll_project.Entity.UserEntity;
import com.highroller.payroll_project.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public UserEntity signup(UserEntity user) {
        return userRepository.save(user);
    }

    public Optional<UserEntity> login(String username, String password) {
        Optional<UserEntity> found = userRepository.findByUsername(username);
        if (found.isPresent() && found.get().getPassword().equals(password)) {
            return found;
        }
        return Optional.empty();
    }
}
