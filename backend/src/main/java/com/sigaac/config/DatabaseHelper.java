package com.sigaac.config;

import com.zaxxer.hikari.HikariDataSource; // eu utilizei esse metodo para poder melhorar a conexão com o banco não tendo que criar sempre uma nova conexão 
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class DatabaseHelper {

    private static DatabaseHelper instance;
    private final HikariDataSource ds;

    public DatabaseHelper(HikariDataSource ds) {
        this.ds = ds;
    }

    public static void init(HikariDataSource ds) {
        instance = new DatabaseHelper(ds);
    }

    public static DatabaseHelper getInstance() {
        if (instance == null) throw new IllegalStateException("DatabaseHelper not initialized");
        return instance;
    }

    public Connection getConnection() throws SQLException {
        return ds.getConnection();
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
