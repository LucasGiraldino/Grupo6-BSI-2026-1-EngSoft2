package com.sigaac.config;

import com.sigaac.model.User;
import com.sigaac.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

@Configuration
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    public CommandLineRunner initUsers() {
        return args -> {
            if (userRepository.count() == 0) {
                User admin = new User();
                admin.setNome("Administrador do Sistema");
                admin.setCpf("12345678901");
                admin.setEmail("admin@sigaac.com");
                admin.setSenhaHash(passwordEncoder.encode("admin123"));
                admin.setPerfil("ADMINISTRADOR");
                admin.setDataCadastro(LocalDate.now());
                admin.setAtivo(true);

                User user = new User();
                user.setNome("Usuário Comum");
                user.setCpf("98765432100");
                user.setEmail("user@sigaac.com");
                user.setSenhaHash(passwordEncoder.encode("user123"));
                user.setPerfil("USUARIO");
                user.setDataCadastro(LocalDate.now());
                user.setAtivo(true);

                userRepository.save(admin);
                userRepository.save(user);

                System.out.println("Usuários de teste criados com sucesso!");
                System.out.println("Admin: admin@sigaac.com / admin123");
                System.out.println("User: user@sigaac.com / user123");
            }
        };
    }
}
