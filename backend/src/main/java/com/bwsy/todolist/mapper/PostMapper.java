package com.bwsy.todolist.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.bwsy.todolist.dto.post.PostDTO;
import com.bwsy.todolist.validation.PostRequest;

@Mapper
public interface PostMapper {

    // 게시글 목록 조회
    List<PostDTO> findPosts(
        @Param("category") String category,
        @Param("keyword") String keyword
    );

    // 게시글 상세 조회
    PostDTO findPostById(@Param("postId") Long postId);

    // 게시글 등록
    int insertPost(
        @Param("userId") Long userId,
        @Param("request") PostRequest request
    );

    // 조회수 증가
    int increaseViewCount(@Param("postId") Long postId);

    // 게시글 수정
    int updatePost(
        @Param("postId") Long postId,
        @Param("userId") Long userId,
        @Param("request") PostRequest request
    );

    // 게시글 삭제
    int softDeletePost(
        @Param("postId") Long postId,
        @Param("userId") Long userId
    );

}
