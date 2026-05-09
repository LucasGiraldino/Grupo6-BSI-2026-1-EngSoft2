package com.sigaac.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import java.util.Properties;

public class DatabaseConfig {

    private final HikariDataSource dataSource;

    public DatabaseConfig(Properties props) {
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

    public HikariDataSource getDataSource() {
        return dataSource;
    }
}
