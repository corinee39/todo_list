package com.bwsy.todolist.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.bwsy.todolist.dto.MemberDTO;
import com.bwsy.todolist.dto.MemberResponse;
import com.bwsy.todolist.mapper.MemberMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberMapper memberMapper;

    // 닉네임 수정
    @Transactional
    public MemberResponse updateNickname(Long userId, String nickname) {
        String trimmedNickname = nickname == null ? "" : nickname.trim();

        if (trimmedNickname.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "닉네임을 입력해주세요.");
        }

        MemberDTO member = memberMapper.findActiveById(userId);

        if (member == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");
        }

        // 닉네임이 실제로 바뀌는 경우에만 중복 검사 (본인 닉네임 제외)
        if (!trimmedNickname.equals(member.getNickname())) {
            int duplicateCount =
                    memberMapper.countByNicknameAndNotUserId(trimmedNickname, userId);

            if (duplicateCount > 0) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 사용 중인 닉네임입니다.");
            }
        }

        memberMapper.updateNickname(userId, trimmedNickname);

        MemberDTO updated = memberMapper.findActiveById(userId);

        return new MemberResponse(
                updated.getUserId(),
                updated.getEmail(),
                updated.getNickname(),
                updated.getProvider()
        );
    }

    // 회원 탈퇴 (소프트 삭제)
    @Transactional
    public void deleteAccount(Long userId) {
        int deletedCount = memberMapper.softDeleteMember(userId);

        if (deletedCount == 0) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "이미 탈퇴했거나 존재하지 않는 사용자입니다."
            );
        }
    }
}
