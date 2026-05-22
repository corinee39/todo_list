package com.bwsy.todolist.validation;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TodoUpdateRequest {

    @NotNull(message = "카테고리를 선택하세요.")
    private Long categoryId;

    @NotBlank(message = "할 일 제목을 입력하세요.")
    @Size(max = 100, message = "할 일 제목은 100자 이하로 입력하세요.")
    private String title;

    @Size(max = 2000, message = "할 일 내용은 2000자 이하로 입력하세요.")
    private String content;

    @NotNull(message = "할 일 날짜를 선택하세요.")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate todoDate;

    @NotBlank(message = "할 일 상태를 선택하세요.")
    @Pattern(regexp = "WAITING|IN_PROGRESS|DONE", message = "상태는 WAITING, IN_PROGRESS, DONE 중 하나여야 합니다.")
    private String status;

    @NotBlank(message = "우선순위를 선택하세요.")
    @Pattern(regexp = "HIGH|MEDIUM|LOW", message = "우선순위는 HIGH, MEDIUM, LOW 중 하나여야 합니다.")
    private String priority;

}
