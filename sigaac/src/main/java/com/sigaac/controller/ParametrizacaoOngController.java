package com.sigaac.controller;

import com.sigaac.dto.ConfiguracaoSistemaDTO;
import com.sigaac.dto.EnderecoDTO;
import com.sigaac.dto.ParametrizacaoOngDTO;
import com.sigaac.dto.ParametrizacaoOngRequestDTO;
import com.sigaac.model.Endereco;
import com.sigaac.model.ParametrizacaoOng;
import com.sigaac.service.ParametrizacaoOngService;
import com.sigaac.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/parametrizacao")
public class ParametrizacaoOngController {

    private final ParametrizacaoOngService service;
    private final UserService userService;

    public ParametrizacaoOngController(ParametrizacaoOngService service, UserService userService) {
        this.service = service;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<ParametrizacaoOngDTO>> findAll() {
        List<ParametrizacaoOngDTO> result = service.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParametrizacaoOngDTO> findById(@PathVariable Integer id) {
        return service.findById(id)
                .map(param -> ResponseEntity.ok(toDTO(param)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/primeira")
    public ResponseEntity<ParametrizacaoOngDTO> findFirst() {
        return service.findFirst()
                .map(param -> ResponseEntity.ok(toDTO(param)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/configuracao-sistema")
    public ResponseEntity<ConfiguracaoSistemaDTO> getConfiguracaoSistema(
            @RequestParam(required = false) String email) {
        ConfiguracaoSistemaDTO config = new ConfiguracaoSistemaDTO();
        
        boolean isAdmin = email != null && userService.isAdministrador(email);
        config.setUsuarioEhAdministrador(isAdmin);
        
        var parametrizacaoOpt = service.findFirst();
        config.setParametrizacaoExiste(parametrizacaoOpt.isPresent());
        
        if (parametrizacaoOpt.isPresent()) {
            config.setParametrizacao(toDTO(parametrizacaoOpt.get()));
        }
        
        return ResponseEntity.ok(config);
    }

    @PostMapping
    public ResponseEntity<ParametrizacaoOngDTO> create(@Valid @RequestBody ParametrizacaoOngRequestDTO request) {
        ParametrizacaoOng parametrizacao = toEntity(request);
        ParametrizacaoOng saved = service.save(parametrizacao);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParametrizacaoOngDTO> update(@PathVariable Integer id, 
                                                        @Valid @RequestBody ParametrizacaoOngRequestDTO request) {
        ParametrizacaoOng parametrizacao = toEntity(request);
        ParametrizacaoOng updated = service.update(id, parametrizacao);
        return ResponseEntity.ok(toDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    private ParametrizacaoOngDTO toDTO(ParametrizacaoOng param) {
        ParametrizacaoOngDTO dto = new ParametrizacaoOngDTO();
        dto.setId(param.getId());
        dto.setRazaoSocial(param.getRazaoSocial());
        dto.setNomeFantasia(param.getNomeFantasia());
        dto.setCnpj(param.getCnpj());
        dto.setTelefone(param.getTelefone());
        dto.setEmail(param.getEmail());
        dto.setSite(param.getSite());
        dto.setLogoUrl(param.getLogoUrl());
        dto.setDataFundacao(param.getDataFundacao());
        dto.setObservacoes(param.getObservacoes());
        
        if (param.getEndereco() != null) {
            EnderecoDTO enderecoDTO = new EnderecoDTO();
            enderecoDTO.setId(param.getEndereco().getId());
            enderecoDTO.setLogradouro(param.getEndereco().getLogradouro());
            enderecoDTO.setNumero(param.getEndereco().getNumero());
            enderecoDTO.setComplemento(param.getEndereco().getComplemento());
            enderecoDTO.setBairro(param.getEndereco().getBairro());
            enderecoDTO.setCidade(param.getEndereco().getCidade());
            enderecoDTO.setEstado(param.getEndereco().getEstado());
            enderecoDTO.setCep(param.getEndereco().getCep());
            dto.setEndereco(enderecoDTO);
        }
        
        return dto;
    }

    private ParametrizacaoOng toEntity(ParametrizacaoOngRequestDTO request) {
        ParametrizacaoOng param = new ParametrizacaoOng();
        param.setRazaoSocial(request.getRazaoSocial());
        param.setNomeFantasia(request.getNomeFantasia());
        param.setCnpj(request.getCnpj());
        param.setTelefone(request.getTelefone());
        param.setEmail(request.getEmail());
        param.setSite(request.getSite());
        param.setLogoUrl(request.getLogoUrl());
        param.setDataFundacao(request.getDataFundacao());
        param.setObservacoes(request.getObservacoes());
        
        if (request.getEndereco() != null) {
            Endereco endereco = new Endereco();
            endereco.setLogradouro(request.getEndereco().getLogradouro());
            endereco.setNumero(request.getEndereco().getNumero());
            endereco.setComplemento(request.getEndereco().getComplemento());
            endereco.setBairro(request.getEndereco().getBairro());
            endereco.setCidade(request.getEndereco().getCidade());
            endereco.setEstado(request.getEndereco().getEstado());
            endereco.setCep(request.getEndereco().getCep());
            param.setEndereco(endereco);
        }
        
        return param;
    }
}
