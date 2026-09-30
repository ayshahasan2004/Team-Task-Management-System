package com.taskflow.core_service.task;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, String> {
  List<Task> findByProjectId(String projectId);
  List<Task> findByAssigneeId(String assigneeId);
  List<Task> findByStatus(TaskStatus status);
}
