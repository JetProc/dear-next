/** A separate allowlist-only artifact. Never pass a Report object to this function.
 * @param {{year:number, synthetic?:boolean, title?:string, words?:string[], intention?:string}} selected
 * @returns {string}
 */
export function makeShareSVG(selected) {
  const escape = (/** @type {string} */ s) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c] || c));
  const wrap = (/** @type {string} */ value, /** @type {number} */ length) => {
    const lines = [];
    for (const row of [value.replace(/\s+/gu, ' ').trim()]) {
      const chars = Array.from(row);
      while (chars.length) lines.push(chars.splice(0, length).join(''));
    }
    return lines;
  };
  const title = wrap((selected.title || '나의 한 해, 나의 속도로.').slice(0, 100), 17);
  const intent = wrap((selected.intention || '').slice(0, 150), 28);
  const lines = (/** @type {string[]} */ values, /** @type {number} */ y, /** @type {number} */ step, /** @type {number} */ size) => values.map((line, i) => `<text x="72" y="${y + i * step}" font-size="${size}">${escape(line)}</text>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350" role="img" aria-label="선택한 내용만 담은 디어넥스트 공유 카드">
<rect width="1080" height="1350" fill="#f5f0e5"/>
<g fill="none" stroke="#af543a" stroke-width="2" opacity=".45">${[250,220,190,160,130,100,70,40].map((r,i) => `<ellipse cx="${800-i*4}" cy="${360+i*5}" rx="${r}" ry="${r*.9}" transform="rotate(${i*8} 800 360)"/>`).join('')}</g>
<g fill="#303b31" font-family="system-ui, sans-serif"><text x="72" y="100" font-size="28" letter-spacing="5">디어넥스트 · A YEAR OF BECOMING</text><text x="72" y="410" font-size="160" font-family="Georgia, serif">${Number.isInteger(selected.year) ? selected.year : ''}</text>
${lines(title, 590, 72, 53)}
${lines(wrap((selected.words || []).join(' · '), 40), 1015, 28, 22)}
${lines(intent, 1090, 31, 24)}
<text x="72" y="1300" font-size="20">${selected.synthetic ? '합성 예시 · 개인 기록 분석이 아닙니다' : '올해의 나에게서, 다음 해의 나에게.'}</text></g></svg>`;
}
