package com.taskflow.core_service.task;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

  private final TaskService taskService;

  public TaskController(TaskService taskService) {
    this.taskService = taskService;
  }

  @GetMapping
  public List<Task> getAll(@RequestParam(required = false) String projectId) {
    if (projectId != null) {
      return taskService.getByProject(projectId);
    }
    return taskService.getAll();
  }

  @GetMapping("/{id}")
  public Task getById(@PathVariable String id) {
    return taskService.getById(id);
  }

  @PostMapping
  public ResponseEntity<Task> create(@RequestBody Task task) {
    return ResponseEntity.ok(taskService.create(task));
  }

  @PutMapping("/{id}")
  public Task update(@PathVariable String id, @RequestBody Task task) {
    return taskService.update(id, task);
  }

  @PatchMapping("/{id}/status")
  public Task updateStatus(@PathVariable String id, @RequestBody TaskStatus status) {
    return taskService.updateStatus(id, status);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable String id) {
    taskService.delete(id);
    return ResponseEntity.noContent().build();
  }
}
