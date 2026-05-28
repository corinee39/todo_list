package com.bwsy.todolist.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.bwsy.todolist.dto.post.CommentDTO;
import com.bwsy.todolist.mapper.CommentMapper;
import com.bwsy.todolist.validation.CommentRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {

    private final CommentMapper commentMapper;

    public List<CommentDTO> findComments(Long postId) {
        validateActivePost(postId);

        return commentMapper.findCommentsByPostId(postId);
    }

    @Transactional
    public void createComment(Long postId, Long loginUserId, CommentRequest request) {
        validateActivePost(postId);

        commentMapper.insertComment(postId, loginUserId, request);
    }

    @Transactional
    public void updateComment(Long commentId, Long loginUserId, CommentRequest request) {
        CommentDTO comment = commentMapper.findCommentById(commentId);

        if (comment == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "댓글을 찾을 수 없습니다.");
        }

        if (!comment.getUserId().equals(loginUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "댓글 작성자만 수정할 수 있습니다.");
        }

        commentMapper.updateComment(commentId, loginUserId, request);
    }

    @Transactional
    public void deleteComment(Long commentId, Long loginUserId) {
        CommentDTO comment = commentMapper.findCommentById(commentId);

        if (comment == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "댓글을 찾을 수 없습니다.");
        }

        if (!comment.getUserId().equals(loginUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "댓글 작성자만 삭제할 수 있습니다.");
        }

        commentMapper.softDeleteComment(commentId, loginUserId);
    }

    private void validateActivePost(Long postId) {
        int count = commentMapper.countActivePost(postId);

        if (count == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다.");
        }
    }

}
