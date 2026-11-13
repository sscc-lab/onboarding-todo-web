# onboarding-todo-web

SSCCOps Maintainer Onboarding **3회차 · Architecture & CI/CD** 실습용 Frontend Repository입니다.
API는 짝 Repository [`onboarding-todo-server`](https://github.com/sscc-lab/onboarding-todo-server)가 맡습니다.

이 템플릿에는 **이 README 하나만** 있습니다. 2회차에는 화면과 서버가 한 Repository에 있었습니다.
이번 주에 여러분의 2회차 `index.html`을 이 Repository로 옮기고, 그 안의 `<script>`를 역할별 파일로 나눕니다.

```text
onboarding-todo/            (2회차 · 그대로 둔다)
      ├──▶ onboarding-todo-web/      화면 — HTML · JavaScript   → Cloudflare Pages
      └──▶ onboarding-todo-server/   API — FastAPI              → Render
```

두 Repository를 잇는 것은 **HTTP / JSON과 API 계약** 하나뿐입니다. 화면은 서버의 코드를 모르고, `/todos`에 정해진 모양으로 요청할 뿐입니다.

## 왜 Repository를 나누나

| | 한 Repository (2회차) | 나눈 Repository (3회차) |
|---|---|---|
| 배포 | 하나가 바뀌어도 함께 움직인다 | 화면 · 서버가 **따로** 배포된다 — 화면 글자 하나 고치려고 서버를 다시 띄우지 않는다 |
| 담당 | 모두가 한 곳을 고친다 | Frontend · Backend 담당이 나뉘고, Review도 나뉜다 |
| 기술 | 같은 곳에 섞인다 | 5회차에 서버는 Spring Boot, 화면은 Next.js로 **각자** 바꾼다 |
| 대가 | — | 두 Repository를 맞춰야 한다 — 그래서 API 계약을 먼저 정하고 지킨다 |

SSCCOps도 `ssccops-server`(Spring Boot)와 `ssccops-web`(Next.js)으로 나뉘어 있습니다.

## 이번 주의 순서

| 단계 | Issue 제목 | Branch |
|---|---|---|
| ① | 2회차 화면을 옮겨 오기 | `chore/#1-import` |
| ② | 화면 코드를 설정 · API 호출 · 화면 그리기로 나누기 | `refactor/#2-split-js` |
| ③ | Pages에 배포하고 API_BASE를 새 서버 주소로 | `chore/#3-deploy` |

서버(`onboarding-todo-server`)의 ①–⑤를 먼저 하고 오면, 로컬에서 바로 함께 띄워 볼 수 있습니다.

## 만들 구조와 꼭 지킬 이름

```text
onboarding-todo-web/
├── index.html       화면의 뼈대와 모양 (HTML · CSS) — <script type="module" src="js/app.js">
└── js/
    ├── config.js    API 서버 주소 — export const API_BASE = "…";
    ├── api.js       ★ 서버에 닿는 코드는 여기에만 — fetch 함수 다섯
    └── app.js       화면 그리기 · 버튼 처리 — fetch를 모르고 api.js만 부른다
```

| 파일 | 이 이름으로 |
|---|---|
| `js/config.js` | `export const API_BASE` |
| `js/api.js` | `export async function` — `listTodos()` · `createTodo(title)` · `updateTitle(id, title)` · `setCompleted(id, completed)` · `deleteTodo(id)` |

서버의 Router · Service · Repository처럼, 화면에서도 «서버와 이야기하는 코드»를 한곳(`api.js`)에 모읍니다.

```text
app.js (화면 그리기) ──부탁──▶ api.js (fetch) ──HTTP──▶ onboarding-todo-server
                                  │
                              config.js (API_BASE)
```

## 0. 준비

1. 이 페이지 오른쪽 위의 **Use this template → Create a new repository** → Owner는 **내 계정**, 이름은 `onboarding-todo-web`, Public.
2. **Settings → Collaborators**에서 Pair를 초대합니다.
3. 2회차 Repository **옆에** 내려받습니다.

```bash
cd <2회차 onboarding-todo가 있는 폴더>
git clone https://github.com/<내 GitHub 아이디>/onboarding-todo-web.git
cd onboarding-todo-web
```

## 1. 기초 실습

### ① 2회차 화면을 옮겨 오기 — `chore/#1-import`

```bash
git switch -c chore/#1-import
cp ../onboarding-todo/index.html .
python -m http.server 5500       # → http://localhost:5500 (서버는 8000번에 띄워 둔다)
```

2회차와 똑같이 등록 · 수정 · 완료 · 삭제가 되면 Commit하고 PR을 올립니다.

```bash
git add index.html
git commit -m "#1 chore: 2회차 화면을 옮겨 온다"
git push -u origin chore/#1-import
```

### ② 화면 코드를 셋으로 나누기 — `refactor/#2-split-js`

2회차 `index.html`의 `<script>` 안을 세 파일로 옮기고, `<script>`는 한 줄만 남깁니다.

| 2회차 `<script>` 안에 있던 것 | 옮길 곳 |
|---|---|
| `const API_BASE = "…";` | `js/config.js` — 앞에 `export`를 붙인다 |
| `check()` · `listTodos()` · `createTodo()` · `updateTitle()` · `setCompleted()` · `deleteTodo()` | `js/api.js` — 다섯 함수 앞에 `export`, 맨 위에 `import { API_BASE } from "./config.js";` |
| 그 아래 전부 (`render` · `load` · `run` · 버튼 처리) | `js/app.js` — 맨 위에 `import { createTodo, deleteTodo, listTodos, setCompleted, updateTitle } from "./api.js";` |

```html
<!-- index.html — <script> … </script> 전체를 이 한 줄로 바꾼다 -->
<script type="module" src="js/app.js"></script>
```

```js
// js/config.js
export const API_BASE = "http://localhost:8000";
```

- `export`는 «다른 파일에서 import해 써도 된다», `import`는 «다른 파일의 것을 가져와 쓴다»는 표시입니다.
- `type="module"`이라 `import` · `export`를 쓸 수 있습니다. 대신 파일을 더블클릭해 열면(`file://`) 동작하지 않으니 꼭 `http.server`로 엽니다.
- `check()`는 `api.js` 안에서만 쓰므로 `export`하지 않아도 됩니다.

```bash
python -m http.server 5500       # 나누기 전과 똑같이 동작하는가
git add index.html js/
git commit -m "#2 refactor: 화면 코드를 설정 · API 호출 · 화면 그리기로 나눈다"
```

**확인할 것** — 서버를 Layer로 다 나눈 뒤에도 이 화면은 **API 호출 코드를 한 줄도 바꾸지 않고** 그대로 동작합니다. 왜 그런지 설명해 봅니다.

## 2. 배포 — Cloudflare Pages를 새 Repository에 연결 (③)

2회차 Pages 프로젝트는 2회차 Repository를 바라봅니다. 이 Repository용 Pages 프로젝트를 새로 만듭니다.

1. Cloudflare **Pages → Connect to Git** → `onboarding-todo-web` → Framework preset **None**, Build command 비움, Build output directory `/`.
2. 배포가 끝나면 `https://<프로젝트 이름>.pages.dev` 주소를 적어 둡니다.
3. 이 주소를 서버 Render 서비스의 `ALLOWED_ORIGINS`에 넣습니다 (`onboarding-todo-server` README).
4. 서버가 Render에 배포되면, Issue · Branch · PR로 `js/config.js`의 `API_BASE`를 새 Render 주소로 바꿉니다.

   ```js
   export const API_BASE = "https://<서버 서비스 이름>.onrender.com";
   ```

5. Merge하면 Cloudflare Pages가 **저절로** 다시 배포합니다. Pages 주소에서 등록 · 수정 · 완료 · 삭제가 되면 완료입니다.
6. Repository 첫 화면 오른쪽 **About → Website**에 Pages 주소를 적어 둡니다 (채점에서 이 주소를 찾습니다).

> 화면 쪽은 Cloudflare Pages가 «Push → 배포»를 대신 해 줍니다. 서버 쪽은 그 과정을 GitHub Actions로 직접 만듭니다 — 같은 CD를 누가 해 주느냐의 차이입니다.

## 막힐 때

| 보이는 것 | 의심할 곳 |
|---|---|
| 화면이 비고 Console에 `Failed to load module script` | `file://`로 열었다 — `python -m http.server 5500`으로 연다 · `src="js/app.js"` 경로 |
| `does not provide an export named …` | `api.js` · `config.js`에서 그 이름 앞에 `export`를 붙였는가, 이름 철자 |
| `… is not defined` | 그 파일 맨 위 `import`에 이름을 빠뜨렸다 |
| `Failed to fetch` | 서버가 켜져 있는가, `config.js`의 `API_BASE`가 맞는가 |
| `blocked by CORS policy` | 서버의 `ALLOWED_ORIGINS`에 지금 화면 주소(로컬 5500 또는 새 Pages 주소)가 있는가 |
| Pages에 옛 화면이 보인다 | Pages 프로젝트가 2회차 Repository를 보고 있다 — 새 프로젝트를 이 Repository에 연결 |

## 완료 체크리스트

- [ ] 2회차 화면을 옮겨 오고, `<script>`를 `config.js` · `api.js` · `app.js`로 나눠 Issue · PR로 합쳤다
- [ ] 로컬에서 서버(8000)와 함께 2회차와 똑같이 동작한다
- [ ] 새 Pages 프로젝트를 이 Repository에 연결하고, `API_BASE`를 새 Render 주소로 바꿨다
- [ ] Pages 주소에서 TODO를 등록 · 수정 · 완료 · 삭제할 수 있다
- [ ] 화면과 서버를 Repository로 나누는 이유와 대가를 설명할 수 있다

## 규칙

1회차와 같습니다 — Branch `type/#번호-설명`, Commit `#번호 type: 내용`, PR `[#번호] 내용`, Squash and merge, `main`에 직접 Push하지 않기.

## 강사 · 채점용

- 완성본은 [`sscc-lab/onboarding-todo-web`의 `solution` Branch](https://github.com/sscc-lab/onboarding-todo-web/tree/solution)에 있습니다.
- 3회차 평가표와 채점 도구는 `onboarding-todo-server`의 `solution-advanced` Branch `grading/`에 있고, 이 Repository도 함께 봅니다.
