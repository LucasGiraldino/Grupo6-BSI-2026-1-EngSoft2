package com.sigaac.repository;

import com.sigaac.model.ItemProntuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemProntuarioRepository extends JpaRepository<ItemProntuario, Integer> {
}