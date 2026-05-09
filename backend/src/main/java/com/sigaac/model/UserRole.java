package com.sigaac.model;

public enum UserRole {
    ADMIN("ADMINISTRADOR"),
    USUARIO("USUARIO");

    private final String role;

    UserRole(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }
}
