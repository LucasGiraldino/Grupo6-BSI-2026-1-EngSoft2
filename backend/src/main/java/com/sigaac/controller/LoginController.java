package com.sigaac.controller;

import com.sigaac.config.CpfValidator;
import com.sigaac.config.JwtUtil;
import com.sigaac.config.OtpUtil;
import com.sigaac.config.RateLimiter;
import com.sigaac.config.TotpUtil;
import com.sigaac.model.LoginRequest;
import com.sigaac.model.Setup2faRequest;
import com.sigaac.model.User;
import com.sigaac.model.UserRole;
import com.sigaac.model.VerifyRequest;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;
import org.mindrot.jbcrypt.BCrypt;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

public class LoginController {

    private static final Pattern EMAIL_PATTERN =
        Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

    private final JwtUtil jwtUtil;
    private final OtpUtil otpUtil;
    private final TotpUtil totpUtil;
    private final RateLimiter rateLimiter;
    private final JsonView json;
    private final ConcurrentHashMap<String, Instant> pendingVerifications = new ConcurrentHashMap<>();
    private static final long PENDING_TTL_MINUTES = 10;

    public LoginController(JwtUtil jwtUtil, OtpUtil otpUtil, TotpUtil totpUtil, RateLimiter rateLimiter, JsonView json) {
        this.jwtUtil = jwtUtil;
        this.otpUtil = otpUtil;
        this.totpUtil = totpUtil;
        this.rateLimiter = rateLimiter;
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
        router.post("/auth/2fa/setup", this::setup2fa);
        router.post("/auth/2fa/verify-setup", this::verifySetup2fa);
        router.post("/auth/2fa/disable", this::disable2fa);
    }

    private void login(HttpExchange exchange, Map<String, String> params) throws Exception {
        LoginRequest data = json.read(exchange.getRequestBody(), LoginRequest.class);
        String email = data.getEmail();
        String rateLimitKey = "login:" + email;

        if (!rateLimiter.isAllowed(rateLimitKey)) {
            json.send(exchange, 429, Map.of("error", "Muitas tentativas. Aguarde 5 minutos."));
            return;
        }

        var userOpt = User.findByEmail(email);
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

        if (!BCrypt.checkpw(data.getSenha(), user.getSenhaHash())) {
            user.incrementFailedAttempts();
            user.save();
            json.send(exchange, 401, Map.of("error", "Credenciais inválidas"));
            return;
        }

        if (Boolean.TRUE.equals(user.getTotpEnabled()) && user.getTotpSecret() != null) {
            pendingVerifications.put(user.getEmail(), Instant.now().plusSeconds(PENDING_TTL_MINUTES * 60));
            json.send(exchange, 200, Map.of(
                    "message", "Autenticacao de dois fatores necessaria.",
                    "totpRequired", true
            ));
        } else {
            user.resetFailedAttempts();
            user.save();
            String token = jwtUtil.generateToken(user);
            String refreshToken = jwtUtil.generateRefreshToken(user);
            json.send(exchange, 200, Map.of(
                    "accessToken", token,
                    "refreshToken", refreshToken,
                    "expiresIn", 7200
            ));
        }
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

        if (User.count() > 0) {
            json.send(exchange, 403, Map.of("error", "Já existe um usuário cadastrado. Faça login."));
            return;
        }

        if (User.findByEmail(email).isPresent()) {
            json.send(exchange, 409, Map.of("error", "Email já cadastrado"));
            return;
        }

        if (User.findByCpf(cpf).isPresent()) {
            json.send(exchange, 409, Map.of("error", "CPF já cadastrado"));
            return;
        }

        if (!CpfValidator.validarMatematicamente(cpf)) {
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

        user.save();

        String token = jwtUtil.generateToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        json.send(exchange, 201, Map.of(
                "accessToken", token,
                "refreshToken", refreshToken,
                "expiresIn", 7200
        ));
    }

    private void verify(HttpExchange exchange, Map<String, String> params) throws Exception {
        VerifyRequest data = json.read(exchange.getRequestBody(), VerifyRequest.class);
        String email = data.getEmail();
        String rateLimitKey = "verify:" + email;

        if (!rateLimiter.isAllowed(rateLimitKey)) {
            json.send(exchange, 429, Map.of("error", "Muitas tentativas. Aguarde 5 minutos."));
            return;
        }

        Instant expiresAt = pendingVerifications.get(email);
        if (expiresAt == null || Instant.now().isAfter(expiresAt)) {
            json.send(exchange, 401, Map.of("error", "Credenciais inválidas."));
            return;
        }

        var userOpt = User.findByEmail(email);
        if (userOpt.isEmpty()) {
            json.send(exchange, 401, Map.of("error", "Credenciais inválidas."));
            return;
        }

        var user = userOpt.get();

        if (!user.isAccountNonLocked()) {
            json.send(exchange, 423, Map.of("error", "Conta bloqueada por muitas tentativas. Tente novamente em 15 minutos."));
            return;
        }

        if (user.getTotpSecret() == null || !totpUtil.validateCode(user.getTotpSecret(), data.getCodigo())) {
            json.send(exchange, 401, Map.of("error", "Código inválido ou expirado"));
            return;
        }

        user.resetFailedAttempts();
        user.save();

        String token = jwtUtil.generateToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);
        rateLimiter.reset(rateLimitKey);
        pendingVerifications.remove(email);

        json.send(exchange, 200, Map.of(
                "accessToken", token,
                "refreshToken", refreshToken,
                "expiresIn", 7200
        ));
    }

    private void setup2fa(HttpExchange exchange, Map<String, String> params) throws Exception {
        Setup2faRequest data = json.read(exchange.getRequestBody(), Setup2faRequest.class);
        String email = data.getEmail();

        var userOpt = User.findByEmail(email);
        if (userOpt.isEmpty()) {
            json.send(exchange, 401, Map.of("error", "Usuário não encontrado"));
            return;
        }

        var user = userOpt.get();

        if (!BCrypt.checkpw(data.getSenha(), user.getSenhaHash())) {
            json.send(exchange, 401, Map.of("error", "Senha incorreta"));
            return;
        }

        String secret = totpUtil.generateSecret();
        user.setTotpSecret(secret);
        user.setTotpEnabled(false);
        user.save();

        String provisioningUri = totpUtil.getProvisioningUri(email, secret);

        json.send(exchange, 200, Map.of(
                "secret", secret,
                "provisioningUri", provisioningUri
        ));
    }

    private void verifySetup2fa(HttpExchange exchange, Map<String, String> params) throws Exception {
        Setup2faRequest data = json.read(exchange.getRequestBody(), Setup2faRequest.class);
        String email = data.getEmail();

        var userOpt = User.findByEmail(email);
        if (userOpt.isEmpty()) {
            json.send(exchange, 401, Map.of("error", "Usuário não encontrado"));
            return;
        }

        var user = userOpt.get();

        if (user.getTotpSecret() == null) {
            json.send(exchange, 400, Map.of("error", "Configuração 2FA não iniciada. Execute /auth/2fa/setup primeiro."));
            return;
        }

        if (!BCrypt.checkpw(data.getSenha(), user.getSenhaHash())) {
            json.send(exchange, 401, Map.of("error", "Senha incorreta"));
            return;
        }

        if (!totpUtil.validateCode(user.getTotpSecret(), data.getCodigo())) {
            json.send(exchange, 401, Map.of("error", "Código inválido. Verifique se o Google Authenticator está configurado corretamente."));
            return;
        }

        user.setTotpEnabled(true);
        user.save();

        json.send(exchange, 200, Map.of("message", "Autenticação de dois fatores ativada com sucesso."));
    }

    private void disable2fa(HttpExchange exchange, Map<String, String> params) throws Exception {
        Setup2faRequest data = json.read(exchange.getRequestBody(), Setup2faRequest.class);
        String email = data.getEmail();

        var userOpt = User.findByEmail(email);
        if (userOpt.isEmpty()) {
            json.send(exchange, 401, Map.of("error", "Usuário não encontrado"));
            return;
        }

        var user = userOpt.get();

        if (!BCrypt.checkpw(data.getSenha(), user.getSenhaHash())) {
            json.send(exchange, 401, Map.of("error", "Senha incorreta"));
            return;
        }

        user.setTotpSecret(null);
        user.setTotpEnabled(false);
        user.save();

        json.send(exchange, 200, Map.of("message", "Autenticação de dois fatores desativada."));
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

        String email = jwtUtil.validateRefreshToken(refreshToken);
        if (email.isEmpty()) {
            json.send(exchange, 401, Map.of("error", "Refresh token inválido ou expirado"));
            return;
        }

        var user = User.findByEmail(email).orElse(null);
        if (user == null) {
            json.send(exchange, 401, Map.of("error", "Usuário não encontrado"));
            return;
        }

        String newToken = jwtUtil.generateToken(user);
        json.send(exchange, 200, Map.of("accessToken", newToken, "expiresIn", 7200));
    }

    private void forgotPassword(HttpExchange exchange, Map<String, String> params) throws Exception {
        Map<String, String> body = json.read(exchange.getRequestBody(), Map.class);
        String email = body.get("email");

        if (email == null || email.isEmpty()) {
            json.send(exchange, 400, Map.of("error", "Email é obrigatório"));
            return;
        }

        var userOpt = User.findByEmail(email);
        if (userOpt.isEmpty()) {
            json.send(exchange, 200, Map.of("message", "Se o email existir, você receberá um código de recuperação."));
            return;
        }

        var user = userOpt.get();
        if (user.getDeletedAt() != null || !user.getAtivo()) {
            json.send(exchange, 200, Map.of("message", "Se o email existir, você receberá um código de recuperação."));
            return;
        }

        String codigo = otpUtil.generateOtp(email);
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

        if (!otpUtil.validateOtp(email, codigo)) {
            json.send(exchange, 401, Map.of("error", "Código inválido ou expirado"));
            return;
        }

        var userOpt = User.findByEmail(email);
        if (userOpt.isEmpty()) {
            json.send(exchange, 401, Map.of("error", "Usuário não encontrado"));
            return;
        }

        var user = userOpt.get();
        user.setSenhaHash(BCrypt.hashpw(novaSenha, BCrypt.gensalt()));
        user.resetFailedAttempts();
        user.save();

        json.send(exchange, 200, Map.of("message", "Senha redefinida com sucesso."));
    }
}
