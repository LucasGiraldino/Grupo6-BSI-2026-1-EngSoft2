package com.sigaac.config;

import com.sigaac.model.User;
import com.sigaac.model.UserRepository;
import com.sigaac.model.UserRole;
import org.mindrot.jbcrypt.BCrypt;

import java.time.LocalDate;

public class DataInitializer {

    private final UserRepository userRepository;

    public DataInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void seed() {
        if (userRepository.count() > 0)
            return;

        var admin = new User();
        admin.setNome("Administrador");
        admin.setCpf("00000000000");
        admin.setEmail("admin@sigaac.com");
        admin.setSenhaHash(BCrypt.hashpw("123456", BCrypt.gensalt()));
        admin.setPerfil(UserRole.ADMIN);
        admin.setDataCadastro(LocalDate.now());
        userRepository.save(admin);

        var usuario = new User();
        usuario.setNome("Usuario Teste");
        usuario.setCpf("11111111111");
        usuario.setEmail("usuario@sigaac.com");
        usuario.setSenhaHash(BCrypt.hashpw("123456", BCrypt.gensalt()));
        usuario.setPerfil(UserRole.USUARIO);
        usuario.setDataCadastro(LocalDate.now());
        userRepository.save(usuario);
    }
}
