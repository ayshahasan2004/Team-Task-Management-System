package com.taskflow.core_service.member;

import jakarta.persistence.*;

@Entity
@Table(name = "members")
public class Member {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @Column(nullable = false)
  private String name;

  private String initial;

  private String role;

  @Column(unique = true)
  private String email;

  @Enumerated(EnumType.STRING)
  private MemberStatus status = MemberStatus.OFFLINE;

  public Member() {}

  public Member(String name, String initial, String role, String email) {
    this.name = name;
    this.initial = initial;
    this.role = role;
    this.email = email;
  }

  public String getId() { return id; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getInitial() { return initial; }
  public void setInitial(String initial) { this.initial = initial; }
  public String getRole() { return role; }
  public void setRole(String role) { this.role = role; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public MemberStatus getStatus() { return status; }
  public void setStatus(MemberStatus status) { this.status = status; }
}
