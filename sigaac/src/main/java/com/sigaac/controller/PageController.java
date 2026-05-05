package com.sigaac.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/configuracao")
    public String configuracao() {
        return "forward:/configuracao.html";
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "forward:/dashboard.html";
    }

    @GetMapping("/pacientes")
    public String pacientes() {
        return "forward:/pacientes.html";
    }
}
