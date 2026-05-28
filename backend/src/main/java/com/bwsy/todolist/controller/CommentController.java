package com.bwsy.todolist.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bwsy.todolist.dto.post.CommentDTO;
import com.bwsy.todolist.security.UserPrincipal;
import com.bwsy.todolist.service.CommentService;
import com.bwsy.todolist.validation.CommentRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/api/posts/{postId}/comments")
    public ResponseEntity<List<CommentDTO>> findComments(
        @PathVariable("postId") Long postId
    ) {
        List<CommentDTO> comments = commentService.findComments(postId);
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/api/posts/{postId}/comments")
    public ResponseEntity<Map<String, String>> createComment(
        @PathVariable("postId") Long postId,
        @AuthenticationPrincipal UserPrincipal principal,
        @Valid @RequestBody CommentRequest request
    ) {
        Long userId = principal.getUserId();

        commentService.createComment(postId, userId, request);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "댓글이 등록되었습니다."));
    }

    @PostMapping("/api/comments/{commentId}/update")
    public ResponseEntity<Map<String, String>> updateComment(
            @PathVariable("commentId") Long commentId,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CommentRequest request
    ) {
        Long userId = principal.getUserId();

        commentService.updateComment(commentId, userId, request);

        return ResponseEntity.ok(Map.of("message", "댓글이 수정되었습니다."));
    }

    @PostMapping("/api/comments/{commentId}/delete")
    public ResponseEntity<Map<String, String>> deleteComment(
            @PathVariable("commentId") Long commentId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long userId = principal.getUserId();

        commentService.deleteComment(commentId, userId);

        return ResponseEntity.ok(Map.of("message", "댓글이 삭제되었습니다."));
    }

}
