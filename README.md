# Dear Next · 디어넥스트

올해의 나에게서, 다음 해의 나에게. 사용자가 고른 기록으로 삶의 선택과 변화를 돌아보고, 다음 해의 방향과 첫 주 행동 세 가지를 만드는 개인 회고 스킬입니다. Claude Code와 Codex용 공통 스킬, 오프라인 HTML, 선택형 PNG/SVG 카드를 제공합니다.

![합성 데이터 화면](docs/demo.png)

## 30초 데모

Node.js 20+가 필요합니다. 실행에는 npm 설치, 별도 API 키나 서버가 필요 없습니다.

```sh
git clone https://github.com/JetProc/dear-next.git
cd dear-next
node skills/dear-next/scripts/cli.mjs demo
```

생성된 `.dear-next/demo.html`을 브라우저로 여세요. 모든 예시는 합성 데이터입니다.

## 설치와 사용

작업할 폴더를 직접 지정합니다. macOS에서 심볼릭 링크 경로 대신 실제 경로를 사용하세요.

```sh
node scripts/install.mjs --target both --dest /absolute/path/to/my-reflection
```

Codex에는 `.agents/skills/dear-next`, Claude Code에는 `.claude/skills/dear-next`를 복사합니다. 기존 스킬은 덮어쓰지 않습니다. 해당 폴더에서 호스트를 다시 시작하세요.

- Codex: `$dear-next 올해의 나와 내년 계획 만들어줘. 내가 선택한 .dear-next/context.md만 사용해.`
- Claude Code: `/dear-next 올해의 나와 내년 계획 만들어줘. 내가 선택한 .dear-next/context.md만 사용해.`

[맥락 브리지 프롬프트](skills/dear-next/references/bridge-prompt.md)를 기존 AI 대화에서 실행하고, 직접 검토한 요약만 전달할 수 있습니다. 스킬 설치가 모든 과거 대화나 기억에 접근할 권한을 주지는 않습니다. 자료가 없으면 세 가지 질문으로 시작합니다.

## 수정과 다시 만들기

HTML의 ‘내 말로 고치기’에서 제목·방향·전체 JSON을 수정할 수 있습니다. 수정과 체크박스는 현재 탭에만 유지됩니다. 새로고침 전에 수정 JSON을 저장하고 `.dear-next/`로 옮긴 뒤 다시 렌더하세요.

```sh
node skills/dear-next/scripts/cli.mjs init
node skills/dear-next/scripts/cli.mjs validate --input .dear-next/my.report.json
node skills/dear-next/scripts/cli.mjs render --input .dear-next/my.report.json --out .dear-next/report.html
```

설치한 스킬에서는 위 스크립트 경로를 설치 위치로 바꿉니다. 이전 파일을 교체하려면 명시적으로 `--force`를 추가하세요. JSON 구조는 [스키마](skills/dear-next/references/report.schema.json)를 따릅니다.

## 데이터와 공유

AI 분석에는 사용 중인 호스트의 정책·접속·이용 한도가 적용됩니다. 로컬 렌더링이 분석까지 모두 기기 안에서 이루어진다는 의미는 아닙니다.

개인 HTML에는 근거와 상세 분석이 들어 있으므로 공개하지 마세요. `.dear-next/`와 `*.report.json`은 Git에서 제외됩니다. 공유 창에서는 제목·세 단어·다음 해 방향만 선택할 수 있습니다. 아무것도 선택되지 않은 상태에서 시작하며 실제 미리보기를 확인해야 PNG/SVG를 저장할 수 있습니다. 선택 문장 자체의 민감성은 사용자가 검토해야 합니다. 자동 업로드, SNS 게시, 추적 도구, 외부 폰트, 세션 검색은 없습니다.

삭제하려면 해당 `.dear-next/` 폴더와 내려받은 파일을 직접 삭제하세요. AI 호스트에 전달된 기록의 삭제는 별도 정책을 따릅니다.

## 개발과 검증

개발 도구는 Node.js 22.20+에서 검증했습니다.

```sh
npm ci
npm run check
npx playwright install chromium
npm run test:ui
```

`npm run build`는 합성 데이터만 사용해 `dist/index.html`을 생성합니다. 배포하지 않습니다. [검증 범위](docs/verification.md), [보안 경계](SECURITY.md)를 확인하세요.

설치 경로는 [OpenAI 공식 문서](https://learn.chatgpt.com/docs/build-skills)와 [Claude Code 공식 문서](https://code.claude.com/docs/en/skills)를 따릅니다. 이 저장소의 설치기는 외부 skills CLI를 사용하지 않으며 텔레메트리를 추가하지 않습니다.
