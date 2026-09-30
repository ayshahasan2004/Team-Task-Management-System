package com.taskflow.core_service.activity;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityService {

  private final ActivityRepository activityRepository;

  public ActivityService(ActivityRepository activityRepository) {
    this.activityRepository = activityRepository;
  }

  public List<Activity> getRecent(int limit) {
    return activityRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, limit));
  }

  public Activity log(String memberId, String text) {
    return activityRepository.save(new Activity(memberId, text));
  }
}
