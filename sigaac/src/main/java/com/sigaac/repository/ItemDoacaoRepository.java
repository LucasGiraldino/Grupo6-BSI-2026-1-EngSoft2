package com.sigaac.repository;

import com.sigaac.model.ItemDoacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemDoacaoRepository extends JpaRepository<ItemDoacao, Integer> {
}