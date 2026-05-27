package com.bwsy.todolist.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.bwsy.todolist.dto.friend.FriendRequestCreateRequest;
import com.bwsy.todolist.dto.friend.FriendRequestResponse;
import com.bwsy.todolist.dto.friend.FriendResponse;
import com.bwsy.todolist.security.UserPrincipal;
import com.bwsy.todolist.service.FriendService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/friends")
public class FriendController {

    private final FriendService friendService;

    // 친구 요청 API
    @PostMapping("/requests")
    @ResponseStatus(HttpStatus.CREATED)
    public void sendFriendRequest(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody FriendRequestCreateRequest request
    ) {
        Long loginUserId = principal.getUserId();
        friendService.sendFriendRequest(loginUserId, request);
    }

    @GetMapping("/requests/received")
    public List<FriendRequestResponse> findReceivedRequests(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long loginUserId = principal.getUserId();
        return friendService.findReceivedRequests(loginUserId);
    }

    @PostMapping("/requests/{requestId}/accept")
    public void acceptRequest(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long requestId
    ) {
        Long loginUserId = principal.getUserId();
        friendService.acceptRequest(loginUserId, requestId);
    }

    @PostMapping("/requests/{requestId}/reject")
    public void rejectRequest(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long requestId
    ) {
        Long loginUserId = principal.getUserId();
        friendService.rejectRequest(loginUserId, requestId);
    }

    @GetMapping
    public List<FriendResponse> findFriends(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long loginUserId = principal.getUserId();
        return friendService.findFriends(loginUserId);
    }

    @PostMapping("/{friendId}/delete")
    public void deleteFriend(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long friendId
    ) {
        Long loginUserId = principal.getUserId();
        friendService.deleteFriend(loginUserId, friendId);
    }
}