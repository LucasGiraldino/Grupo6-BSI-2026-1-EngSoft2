package com.sigaac;

import com.sigaac.config.*;
import com.sigaac.config.cpf.CpfHubStrategy;
import com.sigaac.config.cpf.CpfSimuladoStrategy;
import com.sigaac.config.cpf.CpfStrategy;
import com.sigaac.controller.*;
import com.sigaac.model.CadastroPacienteFacade;
import com.sigaac.view.JsonView;
import com.sigaac.view.StaticFileHandler;
import com.sun.net.httpserver.HttpServer;

import java.net.InetSocketAddress;
import java.util.Properties;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class SigaacApplication {

    public static void main(String[] args) throws Exception {
        Properties props = new Properties();
        try (var is = SigaacApplication.class.getClassLoader().getResourceAsStream("application.properties")) {
            if (is != null)
                props.load(is);
        }

        DatabaseManager db = DatabaseManager.getInstance();
        JsonView json = new JsonView();

        JwtUtil jwtUtil = new JwtUtil(props);
        OtpUtil otpUtil = new OtpUtil();
        TotpUtil totpUtil = new TotpUtil();
        RateLimiter rateLimiter = new RateLimiter();
        String cpfToken = props.getProperty("api.cpf.token", "");
        CpfStrategy cpfStrategy = cpfToken.isEmpty()
                ? new CpfSimuladoStrategy()
                : new CpfHubStrategy(cpfToken);
        CpfValidator cpfValidator = new CpfValidator(cpfStrategy);
        CnpjUtil cnpjUtil = new CnpjUtil();
        CepUtil cepUtil = new CepUtil();

        LoginController loginCtrl = new LoginController(jwtUtil, otpUtil, totpUtil, rateLimiter, json);
        PacienteController pacienteCtrl = new PacienteController(json, new CadastroPacienteFacade());
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
        EstoqueController estoqueCtrl = new EstoqueController(json);
        ReceitaMedicaController receitaCtrl = new ReceitaMedicaController(json);

        HttpRouter router = new HttpRouter(json);
        loginCtrl.registerRoutes(router);
        pacienteCtrl.registerRoutes(router);
        cpfCtrl.registerRoutes(router);
        cnpjCtrl.registerRoutes(router);
        cepCtrl.registerRoutes(router);
        userCtrl.registerRoutes(router);
        doacaoCtrl.registerRoutes(router);
        compraCtrl.registerRoutes(router);
        catAlimentoCtrl.registerRoutes(router);
        alimentoCtrl.registerRoutes(router);
        parametrizacaoCtrl.registerRoutes(router);
        tipoExameCtrl.registerRoutes(router);
        exameCtrl.registerRoutes(router);
        triagemCtrl.registerRoutes(router);
        consultaCtrl.registerRoutes(router);
        prontuarioCtrl.registerRoutes(router);
        profissionalCtrl.registerRoutes(router);
        agendaCtrl.registerRoutes(router);
        estoqueCtrl.registerRoutes(router);
        receitaCtrl.registerRoutes(router);

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

        ExecutorService executor = Executors.newFixedThreadPool(10);
        server.setExecutor(executor);
        server.start();

        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            server.stop(1);
            executor.shutdown();
            db.shutdown();
        }, "sigaac-shutdown"));

        System.out.println("SIGAAC server running on port 8080");
        System.out.println("API: http://localhost:8080/api");
        System.out.println("Auth: http://localhost:8080/auth");
    }
}
