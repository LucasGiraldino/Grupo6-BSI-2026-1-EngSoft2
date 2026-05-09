package com.sigaac;

import com.sigaac.config.DatabaseConfig;
import com.sigaac.config.DataInitializer;
import com.sigaac.controller.*;
import com.sigaac.model.*;
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
            if (is != null) props.load(is);
        }

        DatabaseConfig db = new DatabaseConfig(props);
        JsonView json = new JsonView();

        UserRepository userRepo = new UserRepository(db.getDataSource());
        PacienteRepository pacienteRepo = new PacienteRepository(db.getDataSource());
        EnderecoRepository enderecoRepo = new EnderecoRepository(db.getDataSource());
        ProfissionalRepository profissionalRepo = new ProfissionalRepository(db.getDataSource());
        EstoqueRepository estoqueRepo = new EstoqueRepository(db.getDataSource());
        DoacaoRepository doacaoRepo = new DoacaoRepository(db.getDataSource());
        CompraRepository compraRepo = new CompraRepository(db.getDataSource());
        AlimentoRepository alimentoRepo = new AlimentoRepository(db.getDataSource());
        CategoriaAlimentoRepository catAlimentoRepo = new CategoriaAlimentoRepository(db.getDataSource());
        ParametrizacaoOngRepository parametrizacaoRepo = new ParametrizacaoOngRepository(db.getDataSource());

        TokenService tokenService = new TokenService(props);
        OtpService otpService = new OtpService(props);
        CpfService cpfService = new CpfService(props);
        CnpjService cnpjService = new CnpjService();
        CepService cepService = new CepService();
        RateLimiterService rateLimiterService = new RateLimiterService();
        UserService userService = new UserService(userRepo);
        PacienteService pacienteService = new PacienteService(pacienteRepo, enderecoRepo);
        DoacaoService doacaoService = new DoacaoService(doacaoRepo, pacienteRepo, profissionalRepo, estoqueRepo, alimentoRepo, db.getDataSource());
        CompraService compraService = new CompraService(compraRepo, alimentoRepo, db.getDataSource());
        AlimentoService alimentoService = new AlimentoService(alimentoRepo, estoqueRepo);
        ParametrizacaoOngService parametrizacaoService = new ParametrizacaoOngService(parametrizacaoRepo);

        LoginController loginCtrl = new LoginController(userRepo, otpService, tokenService, rateLimiterService, json);
        PacienteController pacienteCtrl = new PacienteController(pacienteService, json);
        CpfController cpfCtrl = new CpfController(cpfService, json);
        CnpjController cnpjCtrl = new CnpjController(cnpjService, json);
        CepController cepCtrl = new CepController(cepService, json);
        UserController userCtrl = new UserController(userRepo, json);
        DoacaoController doacaoCtrl = new DoacaoController(doacaoService, json);
        CompraController compraCtrl = new CompraController(compraService, json);
        AlimentoController alimentoCtrl = new AlimentoController(alimentoRepo, alimentoService, json);
        CategoriaAlimentoController catAlimentoCtrl = new CategoriaAlimentoController(catAlimentoRepo, json);
        ParametrizacaoOngController parametrizacaoCtrl = new ParametrizacaoOngController(parametrizacaoService, userService, json);

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

        DataInitializer initializer = new DataInitializer(userRepo);
        initializer.seed();

        SecurityFilter securityFilter = new SecurityFilter(tokenService, userRepo, json);
        CorsFilter corsFilter = new CorsFilter();
        StaticFileHandler staticHandler = new StaticFileHandler(
                "/Users/lucasgiraldino/estudos/Grupo6-BSI-2026-1-EngSoft2/frontend/dist");

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
