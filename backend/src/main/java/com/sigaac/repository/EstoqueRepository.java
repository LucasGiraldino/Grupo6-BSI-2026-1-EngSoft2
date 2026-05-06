package com.sigaac.repository;

import com.sigaac.model.Estoque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface EstoqueRepository extends JpaRepository<Estoque, Integer> {
    Optional<Estoque> findByAlimentoId(Integer idAlimento);
}