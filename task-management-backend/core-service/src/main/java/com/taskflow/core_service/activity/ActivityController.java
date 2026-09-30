package com.taskflow.core_service.activity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activity")
public class ActivityController {

  private final ActivityService activityService;

  public ActivityController(ActivityService activityService) {
    this.activityService = activityService;
  }

  @GetMapping
  public List<Activity> getRecent(@RequestParam(defaultValue = "20") int limit) {
    return activityService.getRecent(limit);
  }
}
