package com.taskflow.core_service.task;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tasks")
public class Task {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @Column(nullable = false)
  private String projectId;

  @Column(nullable = false)
  private String title;

  private String description;

  @Enumerated(EnumType.STRING)
  private TaskStatus status = TaskStatus.TODO;

  @Enumerated(EnumType.STRING)
  private TaskPriority priority = TaskPriority.MEDIUM;

  private String assigneeId;

  private LocalDate dueDate;

  @ElementCollection
  private List<String> tags = new ArrayList<>();

  private LocalDateTime createdAt = LocalDateTime.now();
  private LocalDateTime updatedAt = LocalDateTime.now();

  public Task() {}

  public Task(String projectId, String title) {
    this.projectId = projectId;
    this.title = title;
  }

  public String getId() { return id; }
  public String getProjectId() { return projectId; }
  public void setProjectId(String projectId) { this.projectId = projectId; }
  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }
  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }
  public TaskStatus getStatus() { return status; }
  public void setStatus(TaskStatus status) { this.status = status; }
  public TaskPriority getPriority() { return priority; }
  public void setPriority(TaskPriority priority) { this.priority = priority; }
  public String getAssigneeId() { return assigneeId; }
  public void setAssigneeId(String assigneeId) { this.assigneeId = assigneeId; }
  public LocalDate getDueDate() { return dueDate; }
  public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
  public List<String> getTags() { return tags; }
  public void setTags(List<String> tags) { this.tags = tags; }
  public LocalDateTime getCreatedAt() { return createdAt; }
  public LocalDateTime getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
