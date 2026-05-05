package com.sigaac.service;

import com.sigaac.model.ParametrizacaoOng;
import com.sigaac.repository.ParametrizacaoOngRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ParametrizacaoOngService {

    private final ParametrizacaoOngRepository repository;

    public ParametrizacaoOngService(ParametrizacaoOngRepository repository) {
        this.repository = repository;
    }

    public List<ParametrizacaoOng> findAll() {
        return repository.findAll();
    }

    public Optional<ParametrizacaoOng> findById(Integer id) {
        return repository.findById(id);
    }

    public ParametrizacaoOng save(ParametrizacaoOng parametrizacao) {
        return repository.save(parametrizacao);
    }

    public ParametrizacaoOng update(Integer id, ParametrizacaoOng parametrizacao) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Parametrização não encontrada");
        }
        parametrizacao.setId(id);
        return repository.save(parametrizacao);
    }

    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Parametrização não encontrada");
        }
        repository.deleteById(id);
    }

    public Optional<ParametrizacaoOng> findFirst() {
        return repository.findAll().stream().findFirst();
    }
}
