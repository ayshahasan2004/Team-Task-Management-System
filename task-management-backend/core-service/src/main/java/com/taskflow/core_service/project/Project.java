package com.taskflow.core_service.project;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects")
public class Project {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @Column(nullable = false)
  private String name;

  private String description;

  @Enumerated(EnumType.STRING)
  private ProjectStatus status = ProjectStatus.ACTIVE;

  @ElementCollection
  private List<String> memberIds = new ArrayList<>();

  private LocalDate dueDate;

  private LocalDateTime createdAt = LocalDateTime.now();
  private LocalDateTime updatedAt = LocalDateTime.now();

  public Project() {}

  public Project(String name, String description) {
    this.name = name;
    this.description = description;
  }

  public String getId() { return id; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }
  public ProjectStatus getStatus() { return status; }
  public void setStatus(ProjectStatus status) { this.status = status; }
  public List<String> getMemberIds() { return memberIds; }
  public void setMemberIds(List<String> memberIds) { this.memberIds = memberIds; }
  public LocalDate getDueDate() { return dueDate; }
  public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
  public LocalDateTime getCreatedAt() { return createdAt; }
  public LocalDateTime getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
