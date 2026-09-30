package com.taskflow.core_service.task;

import com.taskflow.core_service.activity.ActivityService;
import com.taskflow.core_service.project.ProjectService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {

  private final TaskRepository taskRepository;
  private final ProjectService projectService;
  private final ActivityService activityService;

  public TaskService(TaskRepository taskRepository, ProjectService projectService, ActivityService activityService) {
    this.taskRepository = taskRepository;
    this.projectService = projectService;
    this.activityService = activityService;
  }

  public List<Task> getAll() {
    return taskRepository.findAll();
  }

  public List<Task> getByProject(String projectId) {
    return taskRepository.findByProjectId(projectId);
  }

  public Task getById(String id) {
    return taskRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Task not found"));
  }

  public Task create(Task task) {
    projectService.getById(task.getProjectId());

    Task saved = taskRepository.save(task);
    if (task.getAssigneeId() != null) {
      activityService.log(task.getAssigneeId(), "created task: " + task.getTitle());
    }
    return saved;
  }

  public Task updateStatus(String id, TaskStatus newStatus) {
    Task task = getById(id);
    task.setStatus(newStatus);
    task.setUpdatedAt(LocalDateTime.now());
    Task saved = taskRepository.save(task);
    if (task.getAssigneeId() != null) {
      activityService.log(task.getAssigneeId(), "moved task \"" + task.getTitle() + "\" to " + newStatus);
    }
    return saved;
  }

  public Task update(String id, Task updated) {
    Task existing = getById(id);
    existing.setTitle(updated.getTitle());
    existing.setDescription(updated.getDescription());
    existing.setPriority(updated.getPriority());
    existing.setAssigneeId(updated.getAssigneeId());
    existing.setDueDate(updated.getDueDate());
    existing.setTags(updated.getTags());
    existing.setUpdatedAt(LocalDateTime.now());
    return taskRepository.save(existing);
  }

  public void delete(String id) {
    taskRepository.deleteById(id);
  }
}
