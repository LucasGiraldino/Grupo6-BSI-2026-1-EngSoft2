package com.sigaac.repository;

import com.sigaac.model.TipoExame;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoExameRepository extends JpaRepository<TipoExame, Integer> {
}