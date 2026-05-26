# Ollama 설치 및 실행 가이드

## 1. Ollama 설치

Ollama를 설치  

```powershell
irm https://ollama.com/install.ps1 | iex
```

버전을 확인

```powershell
ollama --version
```

---

## 2. 모델 다운로드

프로젝트에서는 `qwen2.5:3b` 모델을 사용

```powershell
ollama pull qwen2.5:3b
```

설치된 모델 목록 확인

```powershell
ollama list
```

---

## 3. 모델 실행 테스트

```powershell
ollama run qwen2.5:3b
```

테스트 문장 예시:

```txt
정보처리기사 실기 공부 계획
```

종료:

```txt
/bye
```