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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bwsy.todolist.dto.post.PostDTO;
import com.bwsy.todolist.security.UserPrincipal;
import com.bwsy.todolist.service.PostService;
import com.bwsy.todolist.validation.PostRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    @GetMapping
    public ResponseEntity<List<PostDTO>> findPosts(
        @RequestParam(name = "category", required = false) String category,
        @RequestParam(name = "keyword", required = false) String keyword
    ) {
        List<PostDTO> posts = postService.findPosts(category, keyword);
        return ResponseEntity.ok(posts);
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> createPost(
        @AuthenticationPrincipal UserPrincipal principal,
        @Valid @RequestBody PostRequest request
    ) {
        Long userId = principal.getUserId();

        postService.createPost(userId, request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "게시글이 등록되었습니다."));
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostDTO> findPost(
        @PathVariable("postId") Long postId
    ) {
        PostDTO post = postService.findPost(postId);
        return ResponseEntity.ok(post);
    }

    @PostMapping("/{postId}/update")
    public ResponseEntity<Map<String, String>> updatePost(
        @PathVariable("postId") Long postId,
        @AuthenticationPrincipal UserPrincipal principal,
        @Valid @RequestBody PostRequest request
    ) {
        Long userId = principal.getUserId();

        postService.updatePost(postId, userId, request);

        return ResponseEntity.ok(Map.of("message", "게시글이 수정되었습니다."));
    }

    @PostMapping("/{postId}/delete")
    public ResponseEntity<Map<String, String>> deletePost(
        @PathVariable("postId") Long postId,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long userId = principal.getUserId();

        postService.deletePost(postId, userId);

        return ResponseEntity.ok(Map.of("message", "게시글이 삭제되었습니다."));
    }
}
