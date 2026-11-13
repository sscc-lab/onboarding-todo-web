// 화면 그리기 — 목록을 그리고, 버튼을 누르면 api.js의 함수를 부릅니다. (이미 완성)
//
// 이 파일은 서버 주소도 fetch도 모릅니다. «등록해 줘 · 지워 줘»를 api.js에 부탁할 뿐입니다.

import { createTodo, deleteTodo, listTodos, setCompleted, updateTitle } from "./api.js";

const list = document.getElementById("list");
const errorBox = document.getElementById("error");

function render(todos) {
  list.innerHTML = "";
  for (const todo of todos) {
    const li = document.createElement("li");
    if (todo.completed) li.classList.add("done");

    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = todo.completed;
    box.onchange = () => run(() => setCompleted(todo.id, box.checked));

    const title = document.createElement("span");
    title.textContent = todo.title;

    const edit = document.createElement("button");
    edit.className = "ghost";
    edit.textContent = "수정";
    edit.onclick = () => {
      const next = prompt("새 제목", todo.title);
      if (next !== null) run(() => updateTitle(todo.id, next));
    };

    const del = document.createElement("button");
    del.className = "ghost";
    del.textContent = "삭제";
    del.onclick = () => run(() => deleteTodo(todo.id));

    li.append(box, title, edit, del);
    list.append(li);
  }
}

async function load() {
  render(await listTodos());
}

// 요청을 보내고, 성공하면 목록을 다시 불러오고, 실패하면 오류를 보여 준다
async function run(action) {
  errorBox.textContent = "";
  try {
    await action();
    await load();
  } catch (e) {
    errorBox.textContent = e.message;
  }
}

document.getElementById("new-form").onsubmit = (e) => {
  e.preventDefault();
  const input = document.getElementById("new-title");
  run(async () => {
    await createTodo(input.value);
    input.value = "";
  });
};

run(() => Promise.resolve());
