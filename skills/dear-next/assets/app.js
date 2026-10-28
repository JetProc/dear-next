(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  let report = JSON.parse($('report-data').textContent);
  let shareURL;
  let cardSVG = '';
  let savingCard = false;
  let lastDialogTrigger;
  const confidence = { supported: '반복해서 남은 흔적', tentative: '아직은 조심스러운 해석', conflicted: '다른 방향의 기록도 있어요' };
  function el(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function evidenceNodes(refs) {
    return refs.map(id => {
      const item = report.evidence.find(e => e.id === id);
      const block = el('blockquote', undefined, 'evidence');
      block.append(el('span', `${item.source} · ${item.date}`, 'evidence-label'), el('p', item.excerpt));
      return block;
    });
  }
  function references(refs) {
    if (!refs.length) return el('p', '연결된 기록 없음 · 개인화되지 않은 시작 제안', 'evidence-ref');
    const details = el('details', undefined, 'evidence-ref');
    details.append(el('summary', `이 제안의 바탕이 된 기록 ${refs.length}개`), ...evidenceNodes(refs));
    return details;
  }
  function render() {
    $('report-title').textContent = report.title;
    $('subtitle').textContent = report.subtitle;
    $('art-year').textContent = report.year;
    $('edition-label').textContent = `${report.year} · MY YEAR, IN LETTERS`;
    $('private-label').textContent = report.synthetic ? 'SYNTHETIC DEMO · 가상 기록' : '나만의 기록 · 개인 파일';
    $('draft-notice').textContent = report.synthetic
      ? '예시 / 아직 내 기록으로 분석하지 않은 결과입니다. 원하면 AI 대화에 기록을 붙여 넣어 나의 초안을 만들어 보세요. 질문에 답하는 것은 선택입니다.'
      : report.evidence.length < 3
        ? '적은 기록으로 만든 제한적인 초안입니다. 관찰한 내용과 조심스러운 해석을 구분해 읽고, 원하면 AI에 기록을 더하거나 내 말로 고쳐 주세요.'
        : '제공된 기록으로 만든 초안입니다. 원하면 기록을 더하거나 내 말로 고쳐 주세요.';
    const ytd = report.asOf !== `${report.year}-12-31`;
    $('range').textContent = `${report.year}.01.01 — ${report.asOf.replaceAll('-', '.')} ${ytd ? '· 올해 중간 회고 (YTD)' : '· 한 해의 회고'}`;
    $('coverage').textContent = report.coverage;
    $('words').replaceChildren(...report.words.map(w => el('span', w, 'word')));
    $('discoveries').replaceChildren();
    if (!report.discoveries.length) $('discoveries').append(el('p', '아직 나를 설명할 기록이 모이지 않았어요. 기억나는 순간 하나와 그때 중요했던 것을 적어 주세요. 자료가 모이면 발견도 함께 자랍니다.', 'empty'));
    report.discoveries.forEach((d, i) => {
      const card = el('details', undefined, 'discovery');
      const summary = el('summary');
      const heading = el('div', undefined, 'discovery-heading');
      heading.append(el('h3', d.title), el('span', `${confidence[d.confidence]} · 기록 ${d.evidence.length}개`, 'confidence'));
      const toggle = el('span', '+', 'discovery-toggle'); toggle.setAttribute('aria-hidden', 'true');
      summary.append(el('span', String(i + 1).padStart(2, '0'), 'discovery-number'), heading, toggle);
      const body = el('div', undefined, 'discovery-body');
      body.append(el('p', d.body), ...evidenceNodes(d.evidence));
      if (d.counterpoint) {
        const cp = el('p', undefined, 'counterpoint'); cp.append(el('strong', '함께 생각할 다른 가능성'), document.createTextNode(d.counterpoint)); body.append(cp);
      }
      card.append(summary, body); $('discoveries').append(card);
    });
    for (const kind of ['keep', 'change']) {
      $(kind).replaceChildren();
      if (!report[kind].length) $(kind).append(el('p', '자료를 더한 뒤 함께 정해요.', 'small-text'));
      report[kind].forEach(item => {
        const node = el('article', undefined, 'decision-item');
        node.append(el('h4', item.title), el('p', item.why), references(item.evidence)); $(kind).append(node);
      });
    }
    $('next-year').textContent = `To. ${report.year + 1}`;
    $('direction').textContent = report.plan.direction;
    $('plan-why').textContent = report.plan.why;
    $('plan-evidence').replaceChildren(references(report.plan.evidence));
    $('first-month').textContent = report.plan.firstMonth;
    $('month-label').textContent = `${report.year + 1}년 1월의 작은 목표`;
    $('week-label').textContent = `${report.year + 1}년 첫 주에는, 딱 세 가지.`;
    $('first-week').replaceChildren(...report.plan.firstWeek.map((action, i) => {
      const row = el('div', undefined, 'week-item');
      const label = el('label', undefined, 'week-check');
      const check = el('input'); check.type = 'checkbox'; check.setAttribute('aria-label', `${action.title} 완료`);
      label.append(check);
      const copy = el('div', undefined, 'week-copy');
      copy.append(el('h4', `${String(i + 1).padStart(2, '0')}  ${action.title}`), el('p', action.why), references(action.evidence));
      row.append(label, copy); return row;
    }));
    $('limitations').replaceChildren(...report.limitations.map(t => el('li', t)));
    document.title = `${report.year} 나의 한 해 — Dear Next`;
    $('app-status').textContent = '리포트를 펼쳤습니다.';
  }
  // Deterministic decorative rings. They do not encode scores or personality traits.
  for (let r = 35; r < 223; r += 14) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const points = [];
    for (let i = 0; i <= 100; i++) {
      const angle = i / 100 * Math.PI * 2;
      const radius = r + Math.sin(angle * 3 + r * .02) * 7 + Math.cos(angle * 5) * 3;
      points.push(`${i ? 'L' : 'M'}${270 + Math.cos(angle) * radius},${270 + Math.sin(angle) * radius * .92}`);
    }
    path.setAttribute('d', points.join(' ') + ' Z'); $('rings').append(path);
  }
  function openDialog(id, trigger) {
    lastDialogTrigger = trigger;
    $(id).showModal();
  }
  document.querySelectorAll('.close-dialog').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
  document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('close', () => {
    if (lastDialogTrigger) lastDialogTrigger.focus();
  }));
  function updateShare() {
    const selected = { year: report.year, synthetic: report.synthetic };
    if ($('share-title-check').checked) selected.title = report.title;
    if ($('share-words-check').checked) selected.words = [...report.words];
    if ($('share-intention-check').checked) selected.intention = report.plan.direction;
    cardSVG = makeShareSVG(selected);
    if (shareURL) URL.revokeObjectURL(shareURL);
    shareURL = URL.createObjectURL(new Blob([cardSVG], { type: 'image/svg+xml' }));
    $('share-image').src = shareURL;
    $('share-confirm').checked = false;
    $('download-card').disabled = true; $('download-svg').disabled = true;
    $('share-status').textContent = '';
  }
  function share(trigger) {
    for (const id of ['share-title-check', 'share-words-check', 'share-intention-check']) $(id).checked = false;
    updateShare(); openDialog('share-dialog', trigger);
  }
  for (const id of ['open-share', 'share-bottom']) $(id).addEventListener('click', e => share(e.currentTarget));
  for (const id of ['share-title-check', 'share-words-check', 'share-intention-check']) $(id).addEventListener('change', updateShare);
  $('share-confirm').addEventListener('change', () => {
    const any = ['share-title-check', 'share-words-check', 'share-intention-check'].some(id => $(id).checked);
    $('download-card').disabled = !$('share-confirm').checked || !any || savingCard;
    $('download-svg').disabled = $('download-card').disabled;
  });
  function download(content, type, name) {
    const url = URL.createObjectURL(content instanceof Blob ? content : new Blob([content], { type }));
    const link = el('a'); link.href = url; link.download = name;
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function finishDownload() {
    $('share-confirm').checked = false; $('download-card').disabled = true; $('download-svg').disabled = true;
    $('share-status').textContent = '선택한 카드만 저장했습니다. 다시 저장하려면 미리보기를 확인하세요.';
  }
  $('download-svg').addEventListener('click', () => {
    if ($('download-svg').disabled || !$('share-confirm').checked) return;
    download(cardSVG, 'image/svg+xml', `dear-next-${report.year}-card.svg`);
    finishDownload();
  });
  $('download-card').addEventListener('click', async () => {
    if (savingCard || $('download-card').disabled || !$('share-confirm').checked) return;
    savingCard = true;
    $('download-card').disabled = true; $('download-svg').disabled = true;
    // Capture the confirmed bytes, even if the selection changes during image decoding.
    const approvedSVG = cardSVG;
    const approvedYear = report.year;
    const url = URL.createObjectURL(new Blob([approvedSVG], { type: 'image/svg+xml' }));
    try {
      const img = new Image(); img.src = url; await img.decode();
      const canvas = document.createElement('canvas'); canvas.width = 1080; canvas.height = 1350;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas unavailable');
      ctx.drawImage(img, 0, 0);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('PNG unavailable');
      download(blob, 'image/png', `dear-next-${approvedYear}-card.png`);
      finishDownload();
    } catch {
      $('share-confirm').checked = false;
      $('share-status').textContent = 'PNG를 만들지 못했습니다. 미리보기를 다시 확인하고 SVG 저장을 이용하세요.';
    } finally { savingCard = false; URL.revokeObjectURL(url); }
  });
  function editor(trigger) {
    $('edit-title').value = report.title;
    $('edit-direction').value = report.plan.direction;
    $('edit-json').value = JSON.stringify(report, null, 2);
    $('editor-error').textContent = ''; $('editor-status').textContent = '';
    $('import-json').value = '';
    openDialog('editor-dialog', trigger);
  }
  for (const id of ['open-editor', 'edit-bottom']) $(id).addEventListener('click', e => editor(e.currentTarget));
  function syncFields() {
    try {
      const candidate = JSON.parse($('edit-json').value);
      if (typeof candidate.title === 'string') $('edit-title').value = candidate.title;
      if (typeof candidate.plan?.direction === 'string') $('edit-direction').value = candidate.plan.direction;
    } catch { /* Preserve incomplete JSON while typing. Apply shows the error. */ }
  }
  $('edit-json').addEventListener('input', syncFields);
  $('import-json').addEventListener('change', async () => {
    const file = $('import-json').files[0];
    if (!file) return;
    if (file.size > 524288) { $('editor-error').textContent = '512KB 이하의 JSON 파일을 선택하세요.'; return; }
    try { $('edit-json').value = await file.text(); syncFields(); $('editor-error').textContent = ''; }
    catch { $('editor-error').textContent = '파일을 읽지 못했습니다. 다시 선택하세요.'; }
  });
  function editedReport() {
    if ($('edit-json').value.length > 524288) throw new Error('512KB 이하의 JSON을 입력하세요.');
    let candidate;
    try { candidate = JSON.parse($('edit-json').value); }
    catch { throw new Error('JSON 형식을 확인하세요. 쉼표, 따옴표와 괄호를 살펴보세요.'); }
    const errors = validateReport(candidate, reportSchema);
    if (errors.length) throw new Error(errors.join('\n'));
    candidate.title = $('edit-title').value; candidate.plan.direction = $('edit-direction').value;
    const editedErrors = validateReport(candidate, reportSchema);
    if (editedErrors.length) throw new Error(editedErrors.join('\n'));
    return candidate;
  }
  function apply() {
    try {
      const candidate = editedReport();
      if (report.synthetic && !candidate.synthetic) throw new Error('예시는 개인 분석으로 바꿀 수 없습니다. AI에 내 기록을 제공해 새 리포트를 만들어 주세요.');
      report = candidate; render();
      $('edit-json').value = JSON.stringify(report, null, 2);
      $('editor-error').textContent = '';
      $('editor-status').textContent = '수정을 적용했습니다. 새로고침 전 수정 JSON을 저장하세요.';
      return true;
    } catch (error) { $('editor-error').textContent = error.message; $('editor-status').textContent = ''; return false; }
  }
  $('apply-edit').addEventListener('click', apply);
  $('save-json').addEventListener('click', () => {
    if (apply()) {
      download(JSON.stringify(report, null, 2), 'application/json', `dear-next-${report.year}.report.json`);
      $('editor-status').textContent = '수정 JSON을 저장했습니다. CLI render 명령으로 새 HTML을 만들 수 있습니다.';
    }
  });
  const initialErrors = validateReport(report, reportSchema);
  if (initialErrors.length) {
    $('report-title').textContent = '기록을 불러오지 못했어요.';
    $('subtitle').textContent = initialErrors.join(' / ');
    for (const button of document.querySelectorAll('button')) button.disabled = true;
  } else render();
})();
