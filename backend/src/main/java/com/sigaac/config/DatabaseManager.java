package com.sigaac.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Properties;

public class DatabaseManager {

    private final HikariDataSource dataSource;

    private DatabaseManager() {
        Properties props = new Properties();
        try (var is = DatabaseManager.class.getClassLoader().getResourceAsStream("application.properties")) {
            if (is != null) props.load(is);
        } catch (Exception e) {
            throw new RuntimeException("Failed to load application.properties", e);
        }

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(props.getProperty("spring.datasource.url",
                "jdbc:postgresql://localhost:5432/sigaac"));
        config.setUsername(props.getProperty("spring.datasource.username", "postgres"));
        config.setPassword(props.getProperty("spring.datasource.password", "postgres"));
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setDriverClassName("org.postgresql.Driver");
        this.dataSource = new HikariDataSource(config);
    }

    private static class Holder {
        static final DatabaseManager INSTANCE = new DatabaseManager();
    }

    public static DatabaseManager getInstance() {
        return Holder.INSTANCE;
    }

    public Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }

    public <T> List<T> queryList(String sql, RowMapper<T> mapper, Object... params) {
        try (Connection conn = getConnection();
             PreparedStatement stmt = prepare(conn, sql, params);
             ResultSet rs = stmt.executeQuery()) {
            List<T> result = new ArrayList<>();
            while (rs.next()) {
                result.add(mapper.map(rs));
            }
            return result;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public <T> Optional<T> querySingle(String sql, RowMapper<T> mapper, Object... params) {
        try (Connection conn = getConnection();
             PreparedStatement stmt = prepare(conn, sql, params);
             ResultSet rs = stmt.executeQuery()) {
            if (rs.next()) {
                return Optional.of(mapper.map(rs));
            }
            return Optional.empty();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public int executeUpdate(String sql, Object... params) {
        try (Connection conn = getConnection();
             PreparedStatement stmt = prepare(conn, sql, params)) {
            return stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public Number executeInsert(String sql, Object... params) {
        try (Connection conn = getConnection();
             PreparedStatement stmt = prepare(conn, sql, params)) {
            stmt.executeUpdate();
            ResultSet rs = stmt.getGeneratedKeys();
            if (rs.next()) {
                return (Number) rs.getObject(1);
            }
            return null;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public void executeInTransaction(TransactionCallback callback) {
        try (Connection conn = getConnection()) {
            conn.setAutoCommit(false);
            try {
                callback.execute(conn);
                conn.commit();
            } catch (Exception e) {
                conn.rollback();
                throw e;
            }
        } catch (Exception e) {
            if (e instanceof RuntimeException) throw (RuntimeException) e;
            throw new RuntimeException(e);
        }
    }

    private PreparedStatement prepare(Connection conn, String sql, Object... params) throws SQLException {
        PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
        for (int i = 0; i < params.length; i++) {
            if (params[i] instanceof Enum) {
                stmt.setString(i + 1, ((Enum<?>) params[i]).name());
            } else {
                stmt.setObject(i + 1, params[i]);
            }
        }
        return stmt;
    }

    @FunctionalInterface
    public interface RowMapper<T> {
        T map(ResultSet rs) throws SQLException;
    }

    @FunctionalInterface
    public interface TransactionCallback {
        void execute(Connection conn) throws Exception;
    }
}
