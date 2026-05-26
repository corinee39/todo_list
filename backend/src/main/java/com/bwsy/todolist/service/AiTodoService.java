package com.bwsy.todolist.service;

import com.bwsy.todolist.dto.AiTodoGenerateRequest;
import com.bwsy.todolist.dto.AiTodoGenerateResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class AiTodoService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String model;

    public AiTodoService(
            @Value("${ollama.base-url}") String ollamaBaseUrl,
            @Value("${ollama.model}") String model,
            ObjectMapper objectMapper
    ) {
        this.restClient = RestClient.create(ollamaBaseUrl);
        this.model = model;
        this.objectMapper = objectMapper;
    }

    public AiTodoGenerateResponse generateTodos(AiTodoGenerateRequest request) {
        String prompt = createPrompt(request);

        Map<String, Object> ollamaRequest = Map.of(
                "model", model,
                "prompt", prompt,
                "stream", false,
                "format", "json",
                "options", Map.of(
                        "temperature", 0.2
                )
        );

        Map response = restClient.post()
                .uri("/api/generate")
                .body(ollamaRequest)
                .retrieve()
                .body(Map.class);

        if (response == null || response.get("response") == null) {
            return new AiTodoGenerateResponse(List.of());
        }

        String responseText = String.valueOf(response.get("response"));
        List<String> items = parseItems(responseText);

        return new AiTodoGenerateResponse(items);
    }

    private String createPrompt(AiTodoGenerateRequest request) {
        String period = request.getPeriod();

        if (period == null || period.isBlank()) {
            period = "today";
        }

        return """
                당신은 한국어로만 답변하는 할 일 생성 도우미입니다.

                아래 규칙을 반드시 지키세요.

                규칙:
                1. 반드시 JSON 형식으로만 응답하세요.
                2. JSON 외의 설명 문장은 절대 쓰지 마세요.
                3. 영어를 절대 사용하지 마세요.
                4. 모든 할 일은 한국어로 작성하세요.
                5. items 배열만 포함하세요.
                6. 할 일은 4개 이상 6개 이하로 작성하세요.
                7. 각 할 일은 실제로 바로 실행할 수 있는 문장으로 작성하세요.
                8. 너무 추상적인 표현은 피하세요.
                9. "공부하기", "준비하기"처럼 막연하게 쓰지 말고 구체적으로 작성하세요.

                올바른 응답 예시:
                {
                  "items": [
                    "요구사항 확인 단원 핵심 개념 정리하기",
                    "SQL 작성 문제 5개 풀기",
                    "Java 코드 작성 문제 2개 복습하기",
                    "틀린 문제를 오답노트에 정리하기"
                  ]
                }

                사용자 목표:
                %s

                기간:
                %s
                """.formatted(request.getGoal(), period);
    }

    private List<String> parseItems(String responseText) {
        try {
            JsonNode rootNode = objectMapper.readTree(responseText);
            JsonNode itemsNode = rootNode.get("items");

            if (itemsNode == null || !itemsNode.isArray()) {
                return List.of();
            }

            List<String> items = new ArrayList<>();

            for (JsonNode itemNode : itemsNode) {
                String item = itemNode.asText();

                if (item != null && !item.isBlank()) {
                    items.add(item);
                }
            }

            return items;
        } catch (Exception e) {
            return List.of();
        }
    }
}