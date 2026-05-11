package com.sigaac.config;

import com.sigaac.model.*;
import org.mindrot.jbcrypt.BCrypt;

import java.time.LocalDate;

public class DataInitializer {

    private final UserRepository userRepository;
    private final TipoExameRepository tipoExameRepository;
    private final MedicoRepository medicoRepository;
    private final PacienteRepository pacienteRepository;
    private final EnderecoRepository enderecoRepository;
    private final ProntuarioRepository prontuarioRepository;

    public DataInitializer(UserRepository userRepository, TipoExameRepository tipoExameRepository,
            MedicoRepository medicoRepository, PacienteRepository pacienteRepository,
            EnderecoRepository enderecoRepository, ProntuarioRepository prontuarioRepository) {
        this.userRepository = userRepository;
        this.tipoExameRepository = tipoExameRepository;
        this.medicoRepository = medicoRepository;
        this.pacienteRepository = pacienteRepository;
        this.enderecoRepository = enderecoRepository;
        this.prontuarioRepository = prontuarioRepository;
    }

    public void seed() {
        if (userRepository.count() > 0)
            return;

        // --- USERS ---
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

        var drCarlos = new User();
        drCarlos.setNome("Dr. Carlos Silva");
        drCarlos.setCpf("22222222222");
        drCarlos.setEmail("carlos.silva@sigaac.com");
        drCarlos.setSenhaHash(BCrypt.hashpw("123456", BCrypt.gensalt()));
        drCarlos.setPerfil(UserRole.USUARIO);
        drCarlos.setDataCadastro(LocalDate.now());
        userRepository.save(drCarlos);

        var draAna = new User();
        draAna.setNome("Dra. Ana Oliveira");
        draAna.setCpf("33333333333");
        draAna.setEmail("ana.oliveira@sigaac.com");
        draAna.setSenhaHash(BCrypt.hashpw("123456", BCrypt.gensalt()));
        draAna.setPerfil(UserRole.USUARIO);
        draAna.setDataCadastro(LocalDate.now());
        userRepository.save(draAna);

        // --- TIPOS DE EXAME ---
        var hemograma = new TipoExame();
        hemograma.setNome("Hemograma Completo");
        hemograma.setDescricao("Avalia glóbulos vermelhos, brancos e plaquetas");
        tipoExameRepository.save(hemograma);

        var raioX = new TipoExame();
        raioX.setNome("Raio-X");
        raioX.setDescricao("Imagem radiológica de tórax, ossos e articulações");
        tipoExameRepository.save(raioX);

        var ultrassom = new TipoExame();
        ultrassom.setNome("Ultrassom");
        ultrassom.setDescricao("Imagem por ultrassonografia abdominal e pélvica");
        tipoExameRepository.save(ultrassom);

        var ecg = new TipoExame();
        ecg.setNome("Eletrocardiograma");
        ecg.setDescricao("Avaliação da atividade elétrica do coração");
        tipoExameRepository.save(ecg);

        // --- MÉDICOS ---
        var medicoCarlos = new Medico();
        medicoCarlos.setUsuario(drCarlos);
        medicoCarlos.setCrm("12345-SP");
        medicoCarlos.setEspecialidadeMedica("Clínico Geral");
        medicoCarlos.setDataAdmissao(LocalDate.now());
        medicoRepository.save(medicoCarlos);

        var medicoAna = new Medico();
        medicoAna.setUsuario(draAna);
        medicoAna.setCrm("67890-SP");
        medicoAna.setEspecialidadeMedica("Cardiologista");
        medicoAna.setDataAdmissao(LocalDate.now());
        medicoRepository.save(medicoAna);

        // --- ENDEREÇOS ---
        var end1 = new Endereco();
        end1.setCep("01001000");
        end1.setLogradouro("Rua Maria Souza");
        end1.setNumero("123");
        end1.setBairro("Centro");
        end1.setCidade("São Paulo");
        end1.setEstado("SP");
        enderecoRepository.save(end1);

        var end2 = new Endereco();
        end2.setCep("02002000");
        end2.setLogradouro("Avenida João Pereira");
        end2.setNumero("456");
        end2.setBairro("Vila Nova");
        end2.setCidade("São Paulo");
        end2.setEstado("SP");
        enderecoRepository.save(end2);

        var end3 = new Endereco();
        end3.setCep("03003000");
        end3.setLogradouro("Travessa Lucia Santos");
        end3.setNumero("789");
        end3.setBairro("Jardim América");
        end3.setCidade("São Paulo");
        end3.setEstado("SP");
        enderecoRepository.save(end3);

        // --- PACIENTES ---
        var pac1 = new Paciente();
        pac1.setNome("Maria Aparecida Souza");
        pac1.setCpf("12345678901");
        pac1.setDataNascimento(LocalDate.of(1985, 3, 15));
        pac1.setSexo("Feminino");
        pac1.setTelefone("11911111111");
        pac1.setEmail("maria.souza@email.com");
        pac1.setDataCadastro(LocalDate.now());
        pac1.setEndereco(end1);
        pacienteRepository.save(pac1);

        var pac2 = new Paciente();
        pac2.setNome("João Antonio Pereira");
        pac2.setCpf("23456789012");
        pac2.setDataNascimento(LocalDate.of(1978, 7, 22));
        pac2.setSexo("Masculino");
        pac2.setTelefone("11922222222");
        pac2.setEmail("joao.pereira@email.com");
        pac2.setDataCadastro(LocalDate.now());
        pac2.setEndereco(end2);
        pacienteRepository.save(pac2);

        var pac3 = new Paciente();
        pac3.setNome("Lucia Helena Santos");
        pac3.setCpf("34567890123");
        pac3.setDataNascimento(LocalDate.of(1992, 11, 8));
        pac3.setSexo("Feminino");
        pac3.setTelefone("11933333333");
        pac3.setEmail("lucia.santos@email.com");
        pac3.setDataCadastro(LocalDate.now());
        pac3.setEndereco(end3);
        pacienteRepository.save(pac3);

        var pac4 = new Paciente();
        pac4.setNome("Pedro Henrique Costa");
        pac4.setCpf("45678901234");
        pac4.setDataNascimento(LocalDate.of(2000, 1, 30));
        pac4.setSexo("Masculino");
        pac4.setTelefone("11944444444");
        pac4.setEmail("pedro.costa@email.com");
        pac4.setDataCadastro(LocalDate.now());
        pacienteRepository.save(pac4);

        // --- PRONTUÁRIOS ---
        var p1 = new Prontuario();
        p1.setMedico(medicoCarlos); p1.setUsuario(admin); p1.setPaciente(pac1); p1.setDataAbertura(LocalDate.now());
        prontuarioRepository.save(p1);

        var p2 = new Prontuario();
        p2.setMedico(medicoCarlos); p2.setUsuario(admin); p2.setPaciente(pac2); p2.setDataAbertura(LocalDate.now());
        prontuarioRepository.save(p2);

        var p3 = new Prontuario();
        p3.setMedico(medicoAna); p3.setUsuario(admin); p3.setPaciente(pac3); p3.setDataAbertura(LocalDate.now());
        prontuarioRepository.save(p3);

        var p4 = new Prontuario();
        p4.setMedico(medicoAna); p4.setUsuario(admin); p4.setPaciente(pac4); p4.setDataAbertura(LocalDate.now());
        prontuarioRepository.save(p4);
    }
}
