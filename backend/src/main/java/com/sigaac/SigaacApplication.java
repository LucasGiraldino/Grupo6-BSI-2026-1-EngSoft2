package com.sigaac;

import com.sigaac.config.*;
import com.sigaac.controller.*;
import com.sigaac.view.JsonView;
import com.sigaac.view.StaticFileHandler;
import com.sun.net.httpserver.HttpServer;

import java.net.InetSocketAddress;
import java.util.Properties;
import java.util.concurrent.Executors;

public class SigaacApplication {

    public static void main(String[] args) throws Exception {
        Properties props = new Properties();
        try (var is = SigaacApplication.class.getClassLoader().getResourceAsStream("application.properties")) {
            if (is != null)
                props.load(is);
        }

        DatabaseConfig db = new DatabaseConfig(props);
        JsonView json = new JsonView();

        DatabaseHelper.init(db.getDataSource());

        JwtUtil jwtUtil = new JwtUtil(props);
        OtpUtil otpUtil = new OtpUtil();
        RateLimiter rateLimiter = new RateLimiter();
        CpfValidator cpfValidator = new CpfValidator(props.getProperty("api.cpf.token", ""));
        CnpjUtil cnpjUtil = new CnpjUtil();
        CepUtil cepUtil = new CepUtil();

        LoginController loginCtrl = new LoginController(jwtUtil, otpUtil, rateLimiter, json);
        PacienteController pacienteCtrl = new PacienteController(json);
        CpfController cpfCtrl = new CpfController(cpfValidator, json);
        CnpjController cnpjCtrl = new CnpjController(cnpjUtil, json);
        CepController cepCtrl = new CepController(cepUtil, json);
        UserController userCtrl = new UserController(json);
        DoacaoController doacaoCtrl = new DoacaoController(json);
        CompraController compraCtrl = new CompraController(json);
        AlimentoController alimentoCtrl = new AlimentoController(json);
        CategoriaAlimentoController catAlimentoCtrl = new CategoriaAlimentoController(json);
        ParametrizacaoOngController parametrizacaoCtrl = new ParametrizacaoOngController(json);
        TipoExameController tipoExameCtrl = new TipoExameController(json);
        ExameController exameCtrl = new ExameController(json);
        TriagemController triagemCtrl = new TriagemController(json);
        ConsultaController consultaCtrl = new ConsultaController(json);
        ProntuarioController prontuarioCtrl = new ProntuarioController(json);
        ProfissionalController profissionalCtrl = new ProfissionalController(json);
        AgendaController agendaCtrl = new AgendaController(json);

        HttpRouter router = new HttpRouter();
        loginCtrl.registerRoutes(router);
        pacienteCtrl.registerRoutes(router);
        cpfCtrl.registerRoutes(router);
        cnpjCtrl.registerRoutes(router);
        cepCtrl.registerRoutes(router);
        userCtrl.registerRoutes(router);
        doacaoCtrl.registerRoutes(router);
        compraCtrl.registerRoutes(router);
        alimentoCtrl.registerRoutes(router);
        catAlimentoCtrl.registerRoutes(router);
        parametrizacaoCtrl.registerRoutes(router);
        tipoExameCtrl.registerRoutes(router);
        exameCtrl.registerRoutes(router);
        triagemCtrl.registerRoutes(router);
        consultaCtrl.registerRoutes(router);
        prontuarioCtrl.registerRoutes(router);
        profissionalCtrl.registerRoutes(router);
        agendaCtrl.registerRoutes(router);

        String seedData = props.getProperty("app.seed-data", "false");
        if (Boolean.parseBoolean(seedData)) {
            DataInitializer initializer = new DataInitializer();
            initializer.seed();
            System.out.println("Seed data loaded.");
        }

        SecurityFilter securityFilter = new SecurityFilter(jwtUtil, json);
        CorsFilter corsFilter = new CorsFilter();
        StaticFileHandler staticHandler = new StaticFileHandler(
                "../frontend/dist");

        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        var apiContext = server.createContext("/api", router);
        apiContext.getFilters().add(corsFilter);
        apiContext.getFilters().add(securityFilter);

        var authContext = server.createContext("/auth", router);
        authContext.getFilters().add(corsFilter);

        var apisContext = server.createContext("/apis", router);
        apisContext.getFilters().add(corsFilter);
        apisContext.getFilters().add(securityFilter);

        var staticContext = server.createContext("/configuracao", staticHandler);
        staticContext.getFilters().add(corsFilter);
        var dashContext = server.createContext("/dashboard", staticHandler);
        dashContext.getFilters().add(corsFilter);
        var pacContext = server.createContext("/pacientes", staticHandler);
        pacContext.getFilters().add(corsFilter);
        server.createContext("/", staticHandler);

        server.setExecutor(Executors.newFixedThreadPool(10));
        server.start();

        System.out.println("SIGAAC server running on port 8080");
        System.out.println("API: http://localhost:8080/api");
        System.out.println("Auth: http://localhost:8080/auth");
    }
}
