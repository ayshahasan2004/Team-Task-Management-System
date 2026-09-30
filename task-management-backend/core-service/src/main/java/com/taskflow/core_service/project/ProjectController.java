package com.taskflow.core_service.project;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

  private final ProjectService projectService;

  public ProjectController(ProjectService projectService) {
    this.projectService = projectService;
  }

  @GetMapping
  public List<Project> getAll() {
    return projectService.getAll();
  }

  @GetMapping("/{id}")
  public Project getById(@PathVariable String id) {
    return projectService.getById(id);
  }

  @PostMapping
  public ResponseEntity<Project> create(@RequestBody Project project) {
    return ResponseEntity.ok(projectService.create(project));
  }

  @PutMapping("/{id}")
  public Project update(@PathVariable String id, @RequestBody Project project) {
    return projectService.update(id, project);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable String id) {
    projectService.delete(id);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/{id}/members/{memberId}")
  public Project addMember(@PathVariable String id, @PathVariable String memberId) {
    return projectService.addMember(id, memberId);
  }

  @DeleteMapping("/{id}/members/{memberId}")
  public Project removeMember(@PathVariable String id, @PathVariable String memberId) {
    return projectService.removeMember(id, memberId);
  }
}
