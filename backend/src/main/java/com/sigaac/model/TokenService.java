package com.sigaac.model;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

import java.time.Instant;
import java.util.Properties;

public class TokenService {

    private final String secret;
    private final String issuer;
    private final Integer expirationHours;
    private final Integer refreshExpirationHours;

    public TokenService(Properties props) {
        this.secret = props.getProperty("api.security.token.secret",
                "dev-only-insecure-secret-mude-em-producao");
        this.issuer = props.getProperty("api.security.token.issuer", "sigaac");
        this.expirationHours = Integer.parseInt(
                props.getProperty("api.security.token.expiration-hours", "2"));
        this.refreshExpirationHours = Integer.parseInt(
                props.getProperty("api.security.token.refresh-expiration-hours", "24"));
    }

    public String generateToken(User user) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.create()
                    .withIssuer(issuer)
                    .withSubject(user.getEmail())
                    .withClaim("perfil", user.getPerfil())
                    .withClaim("type", "access")
                    .withExpiresAt(genExpirationDate(expirationHours))
                    .sign(algorithm);
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Error while generating token", exception);
        }
    }

    public String generateRefreshToken(User user) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.create()
                    .withIssuer(issuer)
                    .withSubject(user.getEmail())
                    .withClaim("type", "refresh")
                    .withExpiresAt(genExpirationDate(refreshExpirationHours))
                    .sign(algorithm);
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Error while generating refresh token", exception);
        }
    }

    public String validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer(issuer)
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException exception) {
            return "";
        }
    }

    public boolean isTokenValid(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            JWT.require(algorithm)
                    .withIssuer(issuer)
                    .build()
                    .verify(token);
            return true;
        } catch (JWTVerificationException exception) {
            return false;
        }
    }

    public String validateRefreshToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            DecodedJWT decoded = JWT.require(algorithm)
                    .withIssuer(issuer)
                    .build()
                    .verify(token);
            if (!"refresh".equals(decoded.getClaim("type").asString())) {
                return "";
            }
            return decoded.getSubject();
        } catch (JWTVerificationException exception) {
            return "";
        }
    }

    private Instant genExpirationDate(Integer hours) {
        return Instant.now().plusSeconds(hours * 3600);
    }
}
