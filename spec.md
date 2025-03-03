# PDF 템플릿 편집 및 저장 시스템 사양서 (spec.md)

## 1️⃣ 개요

사용자가 웹 화면에서 PDF 템플릿을 자유롭게 편집하고, 이를 백엔드에서 저장 및 PDF로 변환할 수 있는 시스템을 개발한다. 기본적으로 청구서, 납품서, 견적서 등의 문서를 생성할 수 있으며, 템플릿을 재사용하거나 커스터마이징할 수 있다.

## 2️⃣ 기능 요구사항

### 📍 프론트엔드 기능

- **PDF 템플릿 편집**
  - 좌측: 실시간 PDF 미리보기
  - 우측: 컴포넌트 추가 및 속성 조정 UI
- **컴포넌트 추가 및 배치**
  - 기본 제공 컴포넌트: 제목, 테이블, 텍스트 필드, 이미지, 서명, QR 코드 등
  - 마우스 드래그 & 키보드 좌표 입력으로 배치 조정
- **템플릿 데이터 저장**
  - JSON 형식으로 템플릿 데이터를 생성 및 저장
- **백엔드로 템플릿 전송**
  - API 요청을 통해 편집한 템플릿을 백엔드에 저장 요청
- **템플릿 불러오기 및 PDF 생성**
  - 사용자가 저장된 템플릿을 불러와 청구서 정보를 입력
  - 입력한 정보를 바탕으로 PDF 생성 및 다운로드 가능
- **유저가 자유롭게 템플릿을 편집 가능하도록 설계**
  - 다양한 템플릿을 선택하고 커스터마이징할 수 있도록 JSON 기반의 구조를 제공
  - 템플릿 내 개별 요소의 스타일, 배치, 크기 등을 조정 가능하도록 개발

### 📍 백엔드 기능

- **템플릿 저장**
  - 프론트엔드에서 받은 템플릿 JSON을 MySQL 데이터베이스에 저장
- **PDF 생성**
  - 저장된 JSON 데이터를 바탕으로 PDF 변환 및 저장
- **템플릿 불러오기**
  - 저장된 템플릿을 프론트엔드로 다시 제공
- **비동기 청구서 생성 상태 관리**
  - PDF 생성 요청을 비동기적으로 처리하고 진행 상태를 프론트엔드에서 확인 가능

## 3️⃣ 데이터 흐름 및 아키텍처

```plaintext
[사용자] → [프론트엔드] → [백엔드] → [MySQL 데이터베이스] → [PDF 저장 및 생성]
```

### 📌 상세 플로우

1. **사용자 PDF 편집**: 프론트엔드에서 PDF 레이아웃을 조작
2. **JSON 변환**: 편집된 PDF 레이아웃을 JSON으로 변환
3. **백엔드 전송**: API 요청(`POST /templates`)을 통해 JSON 데이터를 저장 요청
4. **DB 저장**: JSON 데이터를 MySQL 데이터베이스에 저장
5. **PDF 생성 및 저장**:
   - 저장된 JSON을 기반으로 PDF 파일 생성
   - 파일 스토리지(AWS S3, GCP Storage 등)에 PDF 저장
6. **템플릿 불러오기 및 청구서 데이터 입력**:
   - 사용자가 기존 템플릿을 불러와 데이터를 입력 후 PDF 생성
   - API 요청(`POST /invoices/:id/generate`)을 통해 PDF 생성 및 다운로드

## 4️⃣ 프론트엔드 URL 구조

### **템플릿 관련 URL**

- `/templates` → 템플릿 목록 페이지
- `/templates/:id/edit` → 템플릿 편집 페이지
- `/templates/:id/preview` → PDF 미리보기 페이지

### **청구서 관련 URL**

- `/invoices` → 청구서 목록 페이지
- `/invoices/new` → 새 청구서 작성 페이지 (템플릿 선택 포함)
- `/invoices/:id/edit` → 기존 청구서 수정 페이지
- `/invoices/:id/preview` → 생성된 PDF 미리보기 페이지
- `/invoices/:id/download` → PDF 다운로드 페이지

## 5️⃣ API URL 구조

### **템플릿 관련 API**

- `GET /api/templates` → 템플릿 목록 조회
- `GET /api/templates/:id` → 특정 템플릿 조회
- `POST /api/templates` → 템플릿 저장
- `PUT /api/templates/:id` → 템플릿 수정
- `DELETE /api/templates/:id` → 템플릿 삭제

### **청구서 관련 API**

- `GET /api/invoices` → 청구서 목록 조회
- `GET /api/invoices/:id` → 특정 청구서 조회
- `POST /api/invoices` → 청구서 생성
- `PUT /api/invoices/:id` → 청구서 수정
- `DELETE /api/invoices/:id` → 청구서 삭제
- `POST /api/invoices/:id/generate` → PDF 생성 요청
- `GET /api/invoices/:id/status` → PDF 생성 진행 상태 조회
- `GET /api/invoices/:id/download` → PDF 다운로드

## 6️⃣ 상태 관리 및 기술 스택

- **템플릿 편집 상태**: `Zustand` 사용하여 관리
- **비동기 진행 상태**: `Polling` 방식으로 API 상태 확인

### **📍 프론트엔드 (React + TypeScript)**

- React + TypeScript로 편집 UI 개발
- 상태 관리: `Zustand` (템플릿 편집 상태), `Polling` (비동기 PDF 생성 상태)
- PDF 미리보기: `pdf.js`
- Drag & Drop: `react-dnd`
- 좌표 입력 기반 이동: `react-moveable`

### **📍 백엔드 (NestJS + TypeScript)**

- NestJS + TypeScript 기반 API 서버
- JSON 데이터 저장: MySQL
- PDF 변환: `pdfkit`, `puppeteer`
- 비동기 PDF 생성 관리: Queue (RabbitMQ, SQS 등)

### **📍 스토리지 & 배포**

- PDF 저장: AWS S3
- API 서버 배포: Kubernetes (K8s)
- 개발 환경: Docker, Docker Compose

## 7️⃣ 확장 가능성

✅ **템플릿 버전 관리**: 각 템플릿의 변경 이력을 저장하여 이전 버전으로 롤백 가능하도록 구현 가능 ✅ **협업 기능**: 다중 사용자가 동일한 템플릿을 편집할 수 있도록 실시간 동기화 지원 ✅ **AI OCR 연동**: 스캔한 문서를 자동으로 템플릿화

## 8️⃣ 배포 및 아키텍처 구성 (별도 문서로 작성 예정)

- PDF 생성 시 부하 문제 및 인프라 최적화 방안
- Kubernetes 기반 Auto Scaling 및 Queue 처리 방식
- PDF 생성 부하를 고려한 Worker Process 분리 계획
