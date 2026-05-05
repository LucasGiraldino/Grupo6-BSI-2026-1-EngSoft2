package com.sigaac.repository;

import com.sigaac.model.CategoriaAlimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaAlimentoRepository extends JpaRepository<CategoriaAlimento, Integer> {
}