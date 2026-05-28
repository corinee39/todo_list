package com.bwsy.todolist.validation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentRequest {

    @NotBlank(message = "댓글 내용을 입력하세요.")
    @Size(max = 1000, message = "댓글은 1000자 이하로 입력하세요.")
    private String content;

}
