package com.taskflow.core_service.activity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "activities")
public class Activity {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @Column(nullable = false)
  private String memberId;

  @Column(nullable = false)
  private String text;

  private LocalDateTime createdAt = LocalDateTime.now();

  public Activity() {}

  public Activity(String memberId, String text) {
    this.memberId = memberId;
    this.text = text;
  }

  public String getId() { return id; }
  public String getMemberId() { return memberId; }
  public String getText() { return text; }
  public LocalDateTime getCreatedAt() { return createdAt; }
}
