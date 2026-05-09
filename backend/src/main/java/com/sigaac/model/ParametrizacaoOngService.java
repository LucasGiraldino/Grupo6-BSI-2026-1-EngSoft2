package com.sigaac.model;

import java.util.List;
import java.util.Optional;

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

    public Optional<ParametrizacaoOng> findFirst() {
        return repository.findFirst();
    }

    public ParametrizacaoOng save(ParametrizacaoOng param) {
        return repository.save(param);
    }

    public ParametrizacaoOng update(Integer id, ParametrizacaoOng param) {
        param.setId(id);
        return repository.save(param);
    }

    public void delete(Integer id) {
        repository.delete(id);
    }
}
