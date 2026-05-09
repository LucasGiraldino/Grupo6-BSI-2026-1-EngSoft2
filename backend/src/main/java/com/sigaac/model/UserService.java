package com.sigaac.model;

import java.util.Optional;

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

    public User save(User user) {
        return userRepository.save(user);
    }
}
