// API 호출 — 서버와 이야기하는 코드는 이 파일에만 둡니다.
//
// 서버의 Repository가 «DB에 닿는 유일한 곳»이듯, 이 파일은 «서버에 닿는 유일한 곳»입니다.
// 화면 그리기(app.js)는 fetch도 주소도 모르고, 여기 있는 함수만 부릅니다.
// 그래서 API 주소나 요청 모양이 바뀌어도 이 파일만 고치면 됩니다.
//
// 2회차 onboarding-todo의 index.html에서 여러분이 채운 네 함수를 그대로 옮겨 오세요.
// listTodos가 완성된 예시입니다. 함수 앞의 export는 «다른 파일에서 import해 써도 된다»는 표시입니다.

import { API_BASE } from "./config.js";

// 응답을 확인하고 결과를 꺼낸다 — 성공이 아니면 오류로 던진다 (이미 완성)
async function check(res, label) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${label} → ${res.status} ${text}`);
  }
  return res.status === 204 ? null : res.json(); // 204는 본문이 없다
}

// 예시 · 목록 조회 — GET /todos
export async function listTodos() {
  const res = await fetch(`${API_BASE}/todos`);
  return check(res, "GET /todos");
}

// ① 등록 — POST /todos, 본문 {"title": title}
export async function createTodo(title) {
  const res = await fetch(`${API_BASE}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  return check(res, "POST /todos");
}

// ② 제목 수정 — PATCH /todos/{id}, 본문 {"title": title}
export async function updateTitle(id, title) {
  const res = await fetch(`${API_BASE}/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  return check(res, `PATCH /todos/${id}`);
}

// ③ 완료 변경 — PATCH /todos/{id}, 본문 {"completed": completed}
export async function setCompleted(id, completed) {
  const res = await fetch(`${API_BASE}/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
  return check(res, `PATCH /todos/${id}`);
}

// ④ 삭제 — DELETE /todos/{id}, 본문 없음
export async function deleteTodo(id) {
  const res = await fetch(`${API_BASE}/todos/${id}`, { method: "DELETE" });
  return check(res, `DELETE /todos/${id}`);
}
