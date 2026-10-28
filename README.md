# Dear Next · 디어넥스트

올해의 나에게서, 다음 해의 나에게. 사용자가 고른 기록으로 삶의 선택과 변화를 돌아보고, 다음 해의 방향과 첫 주 행동 세 가지를 만드는 개인 회고 스킬입니다. Claude Code와 Codex용 공통 스킬, 오프라인 HTML, 선택형 PNG/SVG 카드를 제공합니다.

![합성 데이터 화면](docs/demo.png)

## AI에게 이 문장만 보내세요

Claude Code 또는 Codex에 아래를 복사하세요.

> https://github.com/JetProc/dear-next 의 안내를 읽고 디어넥스트를 설치해서 올해의 나와 내년 계획을 만들어 줘. 사용할 기록과 저장할 폴더는 나와 확인하고, 완성된 결과를 열어 줘. 기록이 없으면 짧게 질문해 줘. 내 다른 대화는 찾지 말고, 결과를 인터넷에 공개하지 마.

AI가 [설치부터 결과 열기까지의 안내](INSTALL.md)를 따라 진행합니다. 이미 고른 자료와 저장 폴더가 있다면 프롬프트 뒤에 함께 적어 주세요. 없다면 짧은 질문을 받거나 [기존 AI의 맥락 요약](skills/dear-next/references/bridge-prompt.md)을 검토해 전달하면 됩니다.

파일과 명령을 실행할 수 있는 호스트, Node.js 20+, 설치 시 GitHub 연결이 필요합니다. 호스트의 로그인·권한 확인은 그대로 적용됩니다. AI가 파일을 열 수 없는 환경에서는 클릭할 HTML 경로를 제공합니다. 별도 API 키·서버·npm 설치는 필요하지 않습니다. Claude의 실제 분석 검증은 현재 테스트 환경의 로그인 부재로 완료하지 못했습니다.

### 고급: 직접 설치하거나 데모 보기

```sh
git clone https://github.com/JetProc/dear-next.git
cd dear-next
node skills/dear-next/scripts/cli.mjs demo
node scripts/install.mjs --target both --dest /absolute/path/to/my-reflection
```

`.dear-next/demo.html`은 합성 데모입니다. 설치기는 Codex의 `.agents/skills/dear-next`와 Claude Code의 `.claude/skills/dear-next`에 복사하며 기존 스킬은 덮어쓰지 않습니다. 다음 세션에서 `$dear-next` 또는 `/dear-next`로 호출할 수 있습니다. 첫 실행은 AI가 설치된 SKILL.md를 직접 읽어 이어갈 수 있습니다.

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
