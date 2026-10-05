package com.taskflow.core_service.activity;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

  @PostMapping
  public ResponseEntity<Activity> create(@RequestBody Map<String, String> payload) {
    String memberId = payload.get("memberId");
    String memberName = payload.get("memberName");
    String text = payload.get("text");

    if (memberId == null || text == null) {
      throw new IllegalArgumentException("memberId and text are required");
    }

    return ResponseEntity.ok(activityService.log(memberId, text, memberName));
  }
}
