package com.sigaac.repository;

import com.sigaac.model.EvolucaoClinica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EvolucaoClinicaRepository extends JpaRepository<EvolucaoClinica, Integer> {
}