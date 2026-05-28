package com.bwsy.todolist.validation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostRequest {

    @NotBlank(message = "제목을 입력하세요.")
    @Size(max = 150, message = "제목은 150자 이하로 입력하세요.")
    private String title;

    @NotBlank(message = "내용을 입력하세요.")
    private String content;

    @NotBlank(message = "카테고리를 입력하세요.")
    @Pattern(
        regexp = "FREE|QUESTION|TIP|STUDY|ERROR",
        message = "카테고리는 FREE, QUESTION, TIP, STUDY, ERROR 중 하나여야 합니다."
    )
    private String category;
}
