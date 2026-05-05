package com.sigaac.service;

import com.sigaac.model.User;
import com.sigaac.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean isAdministrador(String email) {
        return userRepository.findByEmail(email)
                .map(user -> "ADMINISTRADOR".equals(user.getPerfil()))
                .orElse(false);
    }
}
