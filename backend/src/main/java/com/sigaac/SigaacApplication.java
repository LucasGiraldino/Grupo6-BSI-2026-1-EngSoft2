package com.sigaac;

import com.sigaac.config.*;
import com.sigaac.config.cpf.CpfHubStrategy;
import com.sigaac.config.cpf.CpfSimuladoStrategy;
import com.sigaac.config.cpf.CpfStrategy;
import com.sigaac.controller.*;
import com.sigaac.model.observer.ConsultaSubject;
import com.sigaac.model.observer.LogObserver;
import com.sigaac.model.observer.NotificacaoObserver;
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

        String cpfToken = props.getProperty("api.cpf.token", "");
        CpfStrategy cpfStrategy = cpfToken.isEmpty()
                ? new CpfSimuladoStrategy()
                : new CpfHubStrategy(cpfToken);
        CpfValidator.getInstance().setStrategy(cpfStrategy);

        ConsultaSubject consultaSubject = ConsultaSubject.getInstance();
        consultaSubject.assinar(new NotificacaoObserver());
        consultaSubject.assinar(new LogObserver());

        LoginController loginCtrl = LoginController.getInstance();
        PacienteController pacienteCtrl = PacienteController.getInstance();
        CpfController cpfCtrl = CpfController.getInstance();
        CnpjController cnpjCtrl = CnpjController.getInstance();
        CepController cepCtrl = CepController.getInstance();
        UserController userCtrl = UserController.getInstance();
        DoacaoController doacaoCtrl = DoacaoController.getInstance();
        CompraController compraCtrl = CompraController.getInstance();
        AlimentoController alimentoCtrl = AlimentoController.getInstance();
        CategoriaAlimentoController catAlimentoCtrl = CategoriaAlimentoController.getInstance();
        ParametrizacaoOngController parametrizacaoCtrl = ParametrizacaoOngController.getInstance();
        TipoExameController tipoExameCtrl = TipoExameController.getInstance();
        ExameController exameCtrl = ExameController.getInstance();
        TriagemController triagemCtrl = TriagemController.getInstance();
        ConsultaController consultaCtrl = ConsultaController.getInstance();
        ProntuarioController prontuarioCtrl = ProntuarioController.getInstance();
        ProfissionalController profissionalCtrl = ProfissionalController.getInstance();
        AgendaController agendaCtrl = AgendaController.getInstance();
        EstoqueController estoqueCtrl = EstoqueController.getInstance();
        ReceitaMedicaController receitaCtrl = ReceitaMedicaController.getInstance();

        HttpRouter router = HttpRouter.getInstance();
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

        SecurityFilter securityFilter = SecurityFilter.getInstance();
        CorsFilter corsFilter = CorsFilter.getInstance();
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
