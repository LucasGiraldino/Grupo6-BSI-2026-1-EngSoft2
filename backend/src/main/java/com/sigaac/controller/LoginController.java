package com.sigaac.controller;

import com.sigaac.model.*;
import com.sun.net.httpserver.HttpExchange;
import com.sigaac.view.JsonView;
import org.mindrot.jbcrypt.BCrypt;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

public class LoginController {

    private static final Pattern EMAIL_PATTERN =
        Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

    private final UserRepository userRepository;
    private final OtpService otpService;
    private final TokenService tokenService;
    private final RateLimiterService rateLimiterService;
    private final JsonView json;
    private final ConcurrentHashMap<String, Instant> pendingVerifications = new ConcurrentHashMap<>();
    private static final long PENDING_TTL_MINUTES = 10;

    public LoginController(UserRepository userRepository,
                           OtpService otpService, TokenService tokenService,
                           RateLimiterService rateLimiterService, JsonView json) {
        this.userRepository = userRepository;
        this.otpService = otpService;
        this.tokenService = tokenService;
        this.rateLimiterService = rateLimiterService;
        this.json = json;
    }

    public void registerRoutes(HttpRouter router) {
        router.post("/auth/login", this::login);
        router.post("/auth/register", this::register);
        router.post("/auth/verify", this::verify);
        router.post("/auth/logout", this::logout);
        router.post("/auth/refresh", this::refresh);
        router.post("/auth/forgot-password", this::forgotPassword);
        router.post("/auth/reset-password", this::resetPassword);
    }

    private void login(HttpExchange exchange, Map<String, String> params) throws Exception {
        LoginRequestDTO data = json.read(exchange.getRequestBody(), LoginRequestDTO.class);
        String rateLimitKey = "login:" + data.email();

        if (!rateLimiterService.isAllowed(rateLimitKey)) {
            json.send(exchange, 429, Map.of("error", "Muitas tentativas. Aguarde 5 minutos."));
            return;
        }

        var userOpt = userRepository.findByEmail(data.email());
        if (userOpt.isEmpty()) {
            json.send(exchange, 401, Map.of("error", "Credenciais inválidas"));
            return;
        }

        var user = userOpt.get();

        if (user.getDeletedAt() != null || !user.getAtivo()) {
            json.send(exchange, 403, Map.of("error", "Conta desabilitada"));
            return;
        }

        if (!user.isAccountNonLocked()) {
            json.send(exchange, 423, Map.of("error", "Conta bloqueada por muitas tentativas. Tente novamente em 15 minutos."));
            return;
        }

        if (!BCrypt.checkpw(data.senha(), user.getSenhaHash())) {
            user.incrementFailedAttempts();
            userRepository.save(user);
            json.send(exchange, 401, Map.of("error", "Credenciais inválidas"));
            return;
        }

        pendingVerifications.put(user.getEmail(), Instant.now().plusSeconds(PENDING_TTL_MINUTES * 60));
        String codigo = otpService.generateOtp(user.getEmail());
        json.send(exchange, 200, Map.of(
                "message", "Código 2FA enviado.",
                "otpSent", true,
                "codigo", codigo
        ));
    }

    private void register(HttpExchange exchange, Map<String, String> params) throws Exception {
        Map<String, String> payload = json.read(exchange.getRequestBody(), Map.class);
        String nome = payload.get("nome");
        String email = payload.get("email");
        String cpf = payload.get("cpf");
        String senha = payload.get("senha");

        if (nome == null || email == null || cpf == null || senha == null) {
            json.send(exchange, 400, Map.of("error", "Campos obrigatórios: nome, email, cpf, senha"));
            return;
        }

        if (senha.length() < 6) {
            json.send(exchange, 400, Map.of("error", "Senha deve ter no mínimo 6 caracteres"));
            return;
        }

        if (!EMAIL_PATTERN.matcher(email).matches()) {
            json.send(exchange, 400, Map.of("error", "E-mail inválido."));
            return;
        }

        if (userRepository.count() > 0) {
            json.send(exchange, 403, Map.of("error", "Já existe um usuário cadastrado. Faça login."));
            return;
        }

        if (userRepository.findByEmail(email).isPresent()) {
            json.send(exchange, 409, Map.of("error", "Email já cadastrado"));
            return;
        }

        if (userRepository.findByCpf(cpf).isPresent()) {
            json.send(exchange, 409, Map.of("error", "CPF já cadastrado"));
            return;
        }

        if (!CpfService.validarMatematicamente(cpf)) {
            json.send(exchange, 400, Map.of("error", "CPF inválido. Verifique os dígitos."));
            return;
        }

        User user = new User();
        user.setNome(nome);
        user.setEmail(email);
        user.setCpf(cpf);
        user.setSenhaHash(BCrypt.hashpw(senha, BCrypt.gensalt()));
        user.setPerfil(UserRole.ADMIN);
        user.setDataCadastro(LocalDate.now());
        user.setAtivo(true);

        userRepository.save(user);

        String token = tokenService.generateToken(user);
        String refreshToken = tokenService.generateRefreshToken(user);

        json.send(exchange, 201, Map.of(
                "accessToken", token,
                "refreshToken", refreshToken,
                "expiresIn", 7200
        ));
    }

    private void verify(HttpExchange exchange, Map<String, String> params) throws Exception {
        VerifyRequestDTO data = json.read(exchange.getRequestBody(), VerifyRequestDTO.class);
        String rateLimitKey = "verify:" + data.email();

        if (!rateLimiterService.isAllowed(rateLimitKey)) {
            json.send(exchange, 429, Map.of("error", "Muitas tentativas. Aguarde 5 minutos."));
            return;
        }

        Instant expiresAt = pendingVerifications.get(data.email());
        if (expiresAt == null || Instant.now().isAfter(expiresAt)) {
            json.send(exchange, 401, Map.of("error", "Credenciais inválidas."));
            return;
        }

        if (!otpService.validateOtp(data.email(), data.codigo())) {
            json.send(exchange, 401, Map.of("error", "Código inválido ou expirado"));
            return;
        }

        var userOpt = userRepository.findByEmail(data.email());
        if (userOpt.isEmpty()) {
            json.send(exchange, 401, Map.of("error", "Credenciais inválidas."));
            return;
        }

        var user = userOpt.get();

        if (!user.isAccountNonLocked()) {
            json.send(exchange, 423, Map.of("error", "Conta bloqueada por muitas tentativas. Tente novamente em 15 minutos."));
            return;
        }

        user.resetFailedAttempts();
        userRepository.save(user);

        String token = tokenService.generateToken(user);
        String refreshToken = tokenService.generateRefreshToken(user);
        rateLimiterService.reset(rateLimitKey);
        pendingVerifications.remove(data.email());

        json.send(exchange, 200, Map.of(
                "accessToken", token,
                "refreshToken", refreshToken,
                "expiresIn", 7200
        ));
    }

    private void logout(HttpExchange exchange, Map<String, String> params) throws Exception {
        json.send(exchange, 200, Map.of("message", "Logout realizado."));
    }

    private void refresh(HttpExchange exchange, Map<String, String> params) throws Exception {
        Map<String, String> body = json.read(exchange.getRequestBody(), Map.class);
        String refreshToken = body.get("refreshToken");

        if (refreshToken == null) {
            json.send(exchange, 401, Map.of("error", "Refresh token inválido"));
            return;
        }

        String email = tokenService.validateRefreshToken(refreshToken);
        if (email.isEmpty()) {
            json.send(exchange, 401, Map.of("error", "Refresh token inválido ou expirado"));
            return;
        }

        var user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            json.send(exchange, 401, Map.of("error", "Usuário não encontrado"));
            return;
        }

        String newToken = tokenService.generateToken(user);
        json.send(exchange, 200, Map.of("accessToken", newToken, "expiresIn", 7200));
    }

    private void forgotPassword(HttpExchange exchange, Map<String, String> params) throws Exception {
        Map<String, String> body = json.read(exchange.getRequestBody(), Map.class);
        String email = body.get("email");

        if (email == null || email.isEmpty()) {
            json.send(exchange, 400, Map.of("error", "Email é obrigatório"));
            return;
        }

        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            json.send(exchange, 200, Map.of("message", "Se o email existir, você receberá um código de recuperação."));
            return;
        }

        var user = userOpt.get();
        if (user.getDeletedAt() != null || !user.getAtivo()) {
            json.send(exchange, 200, Map.of("message", "Se o email existir, você receberá um código de recuperação."));
            return;
        }

        String codigo = otpService.generateOtp(email);
        json.send(exchange, 200, Map.of(
                "message", "Código de recuperação gerado.",
                "codigo", codigo
        ));
    }

    private void resetPassword(HttpExchange exchange, Map<String, String> params) throws Exception {
        Map<String, String> body = json.read(exchange.getRequestBody(), Map.class);
        String email = body.get("email");
        String codigo = body.get("codigo");
        String novaSenha = body.get("novaSenha");

        if (email == null || codigo == null || novaSenha == null) {
            json.send(exchange, 400, Map.of("error", "Campos obrigatórios: email, codigo, novaSenha"));
            return;
        }

        if (novaSenha.length() < 6) {
            json.send(exchange, 400, Map.of("error", "Senha deve ter no mínimo 6 caracteres"));
            return;
        }

        if (!otpService.validateOtp(email, codigo)) {
            json.send(exchange, 401, Map.of("error", "Código inválido ou expirado"));
            return;
        }

        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            json.send(exchange, 401, Map.of("error", "Usuário não encontrado"));
            return;
        }

        var user = userOpt.get();
        user.setSenhaHash(BCrypt.hashpw(novaSenha, BCrypt.gensalt()));
        user.resetFailedAttempts();
        userRepository.save(user);

        json.send(exchange, 200, Map.of("message", "Senha redefinida com sucesso."));
    }
}
