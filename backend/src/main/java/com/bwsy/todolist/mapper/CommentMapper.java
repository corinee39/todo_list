package com.bwsy.todolist.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.bwsy.todolist.dto.post.CommentDTO;
import com.bwsy.todolist.validation.CommentRequest;

@Mapper
public interface CommentMapper {

    // 게시글 존재 여부 확인
    int countActivePost(@Param("postId") Long postId);

    // 댓글 목록 조회
    List<CommentDTO> findCommentsByPostId(@Param("postId") Long postId);

    // 댓글 단건 조회
    CommentDTO findCommentById(@Param("commentId") Long commentId);

    // 댓글 등록
    int insertComment(
        @Param("postId") Long postId,
        @Param("userId") Long userId,
        @Param("request") CommentRequest request
    );

    // 댓글 수정
    int updateComment(
        @Param("commentId") Long commentId,
        @Param("userId") Long userId,
        @Param("request") CommentRequest request
    );

    // 댓글 삭제
    int softDeleteComment(
        @Param("commentId") Long commentId,
        @Param("userId") Long userId
    );

}
