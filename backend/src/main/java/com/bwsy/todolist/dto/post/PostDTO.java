package com.bwsy.todolist.dto.post;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostDTO {

    private Long postId;
    private Long userId;

    // users 테이블과 JOIN해서 가져올 작성자 닉네임
    private String nickname;

    private String title;
    private String content;
    private String category;

    private Integer viewCount;
    private String status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;

}
