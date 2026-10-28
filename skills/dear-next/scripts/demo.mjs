/** @returns {import('./types.js').Report} */
export function makeDemo() {
  const now = new Date();
  const year = now.getFullYear();
  const asOf = `${year}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const start = new Date(`${year}-01-01T00:00:00Z`).getTime();
  const end = new Date(`${asOf}T00:00:00Z`).getTime();
  const date = (/** @type {number} */ fraction) => new Date(start + (end - start) * fraction).toISOString().slice(0, 10);
  return {
    version: 1, year, asOf, synthetic: true,
    coverage: '산책, 관계, 만들기에 관한 가상의 기록 6개로 만든 예시입니다. 실제 인물의 기록이 아닙니다.',
    title: '조금 덜 채우고,\n더 깊이 살아낸 해',
    subtitle: '새로운 것을 더하는 일보다, 이미 곁에 있는 것에 마음을 쓰기 시작했습니다.',
    words: ['여백', '곁', '작은 용기'],
    evidence: [
      { id: 'e1', source: '가상 일기 · 봄의 산책', date: date(.15), excerpt: '주말마다 약속을 잡는 대신 한 시간을 비워 걸었다. 아무것도 하지 않은 시간이 오히려 오래 기억났다.' },
      { id: 'e2', source: '가상 메모 · 쉬는 저녁', date: date(.38), excerpt: '모임 하나를 정중히 거절했다. 남은 저녁에 저녁밥을 천천히 만들었고, 다음 날 마음이 한결 가벼웠다.' },
      { id: 'e3', source: '가상 일기 · 안부', date: date(.46), excerpt: '한동안 연락하지 못한 친구에게 먼저 안부를 물었다. 근황을 다 설명하지 않아도 편안했다.' },
      { id: 'e4', source: '가상 메모 · 함께 걷기', date: date(.66), excerpt: '친구와 큰 계획 없이 동네를 걸었다. 자주 보는 것보다 만나서 잘 듣는 것이 내게 더 중요했다.' },
      { id: 'e5', source: '가상 기록 · 첫 도자기', date: date(.78), excerpt: '못 만든 컵을 보고 웃었다. 잘해야 계속할 수 있는 건 아니었다. 다음 수업에도 가기로 했다.' },
      { id: 'e6', source: '가상 기록 · 망설인 초대', date: date(.92), excerpt: '낯선 모임에 가보고 싶었지만 끝내 신청하지 않았다. 쉬고 싶은 건지, 처음이 두려운 건지는 아직 모르겠다.' }
    ],
    discoveries: [
      { id: 'd1', title: '비워 둔 시간이 나를 채웠다', body: '일정을 덜 채운 두 순간에 편안함이 따라왔습니다. 여백은 남는 시간이 아니라, 직접 고른 시간에 가까워 보입니다.', confidence: 'supported', evidence: ['e1', 'e2'], counterpoint: '쉬는 시간을 선택한 이유가 언제나 같았는지는 알 수 없습니다.' },
      { id: 'd2', title: '멀리보다, 가까이 있는 사람에게', body: '많은 사람과 연결되는 것보다, 한 사람과 편하게 안부를 나누는 순간이 기록에 남았습니다. 관계의 넓이보다 깊이에 마음이 기운 듯합니다.', confidence: 'supported', evidence: ['e3', 'e4'], counterpoint: '' },
      { id: 'd3', title: '작은 용기에도 내 속도가 있었다', body: '서툰 시작을 즐긴 날도, 새로운 자리를 망설인 날도 있었습니다. 새로운 일에 늘 용감하다거나 소극적이라고 한마디로 정하기는 어렵습니다.', confidence: 'conflicted', evidence: ['e5', 'e6'], counterpoint: '도자기 수업에는 다시 갔지만 낯선 모임에는 신청하지 않았습니다. 규모나 상황의 차이일 수 있습니다.' }
    ],
    keep: [
      { title: '비워 두는 저녁 하나', why: '일정을 덜 채운 날에 편안함을 경험했습니다. 그 시간을 우연히 남기기보다 미리 지켜 보세요.', evidence: ['e1', 'e2'] },
      { title: '짧아도 먼저 건네는 안부', why: '모든 근황을 설명하지 않아도 편안했던 관계가 있었습니다.', evidence: ['e3', 'e4'] }
    ],
    change: [
      { title: '새로운 시작의 크기 줄이기', why: '서툰 만들기는 즐겼지만 낯선 모임에는 망설임이 있었습니다. 작은 체험부터 고르면 어떤 조건이 편한지 살펴볼 수 있습니다.', evidence: ['e5', 'e6'] }
    ],
    plan: {
      direction: '넓히기보다, 뿌리내리기.',
      why: '여백과 가까운 관계에서 편안함을 느낀 기록을 다음 해의 선택 기준으로 삼아 봅니다. 새로운 경험도 그 여백 안에서 작게 시작합니다.',
      evidence: ['e1', 'e2', 'e3', 'e4', 'e5', 'e6'],
      firstMonth: '한 달 동안 주 1회 비워 둔 저녁을 지켜 보고, 가까운 사람 한 명과 천천히 만납니다. 마지막 주에는 어떤 시간이 남았는지 세 줄로 적습니다.',
      firstWeek: [
        { title: '달력에 빈 저녁 한 칸 남기기', why: '일정이 적었던 날의 편안함을 다시 느끼는지 확인합니다. 다음 해 첫 주 1회, 1시간이면 됩니다.', evidence: ['e1', 'e2'] },
        { title: '생각난 사람에게 한 줄 보내기', why: '짧은 안부도 편안했던 경험이 있습니다. 부담 없는 사람 한 명에게, 답장을 재촉하지 않는 안부를 건넵니다.', evidence: ['e3'] },
        { title: '서툴러도 되는 20분 만들기', why: '완성도와 무관하게 만들기를 즐겼던 순간이 있습니다. 집에 있는 재료로 20분만 해 보고 계속할지 고릅니다.', evidence: ['e5'] }
      ]
    },
    limitations: ['선택된 6개의 가상 기록만으로 만든 해석입니다. 삶 전체나 성격을 설명하지 않습니다.', '편안했던 순간 위주로 기록되어 힘들었던 시기나 다른 선택은 충분히 반영되지 않았습니다.']
  };
}

/** @param {number} year @param {string} asOf @returns {import('./types.js').Report} */
export function makeStarter(year, asOf) {
  return {
    version: 1, year, asOf, synthetic: false,
    coverage: '아직 선택한 기록이 없습니다.', title: '아직 쓰지 않은\n나의 한 해', subtitle: '기억나는 작은 순간 하나부터 시작해도 괜찮습니다.', words: [], evidence: [], discoveries: [], keep: [], change: [],
    plan: { direction: '나에게 맞는 방향을 찾아보기', why: '자료가 없어 개인화된 방향을 정하지 않았습니다. 아래는 기록을 시작하기 위한 제안입니다.', evidence: [], firstMonth: '선택한 기억을 모은 뒤 첫 달의 목표를 함께 정합니다.', firstWeek: [
      { title: '오래 남은 순간 하나 적기', why: '아직 근거가 없어, 먼저 기억을 선택하는 단계입니다.', evidence: [] },
      { title: '그때 중요했던 것 한 줄 적기', why: '개인의 가치나 성격을 추측하지 않고 본인의 설명을 듣기 위한 질문입니다.', evidence: [] },
      { title: '다시 해보고 싶은 작은 일 고르기', why: '확정된 행동 계획이 아니라 대화를 시작하기 위한 질문입니다.', evidence: [] }
    ] }, limitations: ['자료 부족: 개인에 대한 발견이나 반복 패턴을 아직 만들지 않았습니다.']
  };
}
