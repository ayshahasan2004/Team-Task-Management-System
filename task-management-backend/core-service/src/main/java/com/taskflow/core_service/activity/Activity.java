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

  @Column(name = "member_name")
  private String memberName;

  private LocalDateTime createdAt = LocalDateTime.now();

  public Activity() {}

  public Activity(String memberId, String text) {
    this(memberId, text, null);
  }

  public Activity(String memberId, String text, String memberName) {
    this.memberId = memberId;
    this.text = text;
    this.memberName = memberName;
  }

  public String getId() { return id; }
  public String getMemberId() { return memberId; }
  public String getMemberName() { return memberName; }
  public String getText() { return text; }
  public LocalDateTime getCreatedAt() { return createdAt; }
}
