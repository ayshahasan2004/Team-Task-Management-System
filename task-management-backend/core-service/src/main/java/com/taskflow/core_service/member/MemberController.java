package com.taskflow.core_service.member;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
public class MemberController {

  private final MemberService memberService;

  public MemberController(MemberService memberService) {
    this.memberService = memberService;
  }

  @GetMapping
  public List<Member> getAll() {
    return memberService.getAll();
  }

  @GetMapping("/{id}")
  public Member getById(@PathVariable String id) {
    return memberService.getById(id);
  }

  @PostMapping
  public ResponseEntity<Member> create(@RequestBody Member member) {
    return ResponseEntity.ok(memberService.create(member));
  }

  @PutMapping("/{id}")
  public Member update(@PathVariable String id, @RequestBody Member member) {
    return memberService.update(id, member);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable String id) {
    memberService.delete(id);
    return ResponseEntity.noContent().build();
  }
}
