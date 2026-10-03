package com.taskflow.core_service.project;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProjectService {

  private final ProjectRepository projectRepository;

  public ProjectService(ProjectRepository projectRepository) {
    this.projectRepository = projectRepository;
  }

  public List<Project> getAll() {
    return projectRepository.findAll();
  }

  public Project getById(String id) {
    return projectRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Project not found"));
  }

  public Project create(Project project) {
    return projectRepository.save(project);
  }

  public Project update(String id, Project updated) {
    Project existing = getById(id);
    existing.setName(updated.getName());
    existing.setDescription(updated.getDescription());
    existing.setStatus(updated.getStatus());
    existing.setDueDate(updated.getDueDate());
    existing.setUpdatedAt(LocalDateTime.now());
    return projectRepository.save(existing);
  }

  public void delete(String id) {
    projectRepository.deleteById(id);
  }

  public Project addMember(String projectId, String memberId) {
    Project project = getById(projectId);
    if (!project.getMemberIds().contains(memberId)) {
      project.getMemberIds().add(memberId);
    }
    return projectRepository.save(project);
  }

  public Project removeMember(String projectId, String memberId) {
    Project project = getById(projectId);
    project.getMemberIds().remove(memberId);
    return projectRepository.save(project);
  }
}
