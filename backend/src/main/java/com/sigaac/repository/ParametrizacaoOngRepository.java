package com.sigaac.repository;

import com.sigaac.model.ParametrizacaoOng;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParametrizacaoOngRepository extends JpaRepository<ParametrizacaoOng, Integer> {
}