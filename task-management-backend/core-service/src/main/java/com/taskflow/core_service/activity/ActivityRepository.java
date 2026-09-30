package com.taskflow.core_service.activity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, String> {
  List<Activity> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
