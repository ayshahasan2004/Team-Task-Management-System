package com.taskflow.core_service.member;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MemberService {

  private final MemberRepository memberRepository;

  public MemberService(MemberRepository memberRepository) {
    this.memberRepository = memberRepository;
  }

  public List<Member> getAll() {
    return memberRepository.findAll();
  }

  public Member getById(String id) {
    return memberRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Member not found"));
  }

  public Member create(Member member) {
    return memberRepository.save(member);
  }

  public Member update(String id, Member updated) {
    Member existing = getById(id);
    existing.setName(updated.getName());
    existing.setInitial(updated.getInitial());
    existing.setRole(updated.getRole());
    existing.setEmail(updated.getEmail());
    existing.setStatus(updated.getStatus());
    return memberRepository.save(existing);
  }

  public void delete(String id) {
    memberRepository.deleteById(id);
  }
}
