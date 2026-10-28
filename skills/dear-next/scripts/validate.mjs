/** Validate structure and cross-references. Also embedded verbatim in the offline page.
 * @param {unknown} input
 * @param {import('./types.js').Schema} schema
 * @returns {string[]}
 */
export function validateReport(input, schema) {
  /** @type {string[]} */
  const errors = [];
  /** @param {unknown} value @param {import('./types.js').Schema} rule @param {string} path */
  function walk(value, rule, path) {
    if (errors.length >= 30) return;
    if (rule.type === 'object') {
      if (!value || typeof value !== 'object' || Array.isArray(value)) { errors.push(`${path}: 객체가 필요합니다`); return; }
      const obj = /** @type {Record<string, unknown>} */ (value);
      for (const key of rule.required || []) if (!Object.hasOwn(obj, key)) errors.push(`${path}.${key}: 필수 항목입니다`);
      for (const key of Object.keys(obj)) {
        if (!Object.hasOwn(rule.properties || {}, key)) errors.push(`${path}: 알 수 없는 필드가 있습니다`);
        else walk(obj[key], (rule.properties || {})[key], `${path}.${key}`);
      }
    } else if (rule.type === 'array') {
      if (!Array.isArray(value)) { errors.push(`${path}: 배열이 필요합니다`); return; }
      if (value.length < (rule.minItems || 0) || value.length > (rule.maxItems ?? 100)) errors.push(`${path}: 항목 수가 허용 범위를 벗어났습니다`);
      value.slice(0, 100).forEach((v, i) => walk(v, rule.items || {}, `${path}[${i}]`));
    } else if (rule.type === 'string') {
      if (typeof value !== 'string') { errors.push(`${path}: 문자열이 필요합니다`); return; }
      if (value.trim().length < (rule.minLength || 0) || value.length > (rule.maxLength || 4000)) errors.push(`${path}: 글자 수가 허용 범위를 벗어났습니다`);
      if (rule.pattern && !new RegExp(rule.pattern).test(value)) errors.push(`${path}: 형식이 올바르지 않습니다`);
      // Deliberately reject XML/HTML control characters.
      // eslint-disable-next-line no-control-regex
      if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(value)) errors.push(`${path}: 제어 문자는 사용할 수 없습니다`);
    } else if (rule.type === 'integer') {
      if (typeof value !== 'number' || !Number.isInteger(value) || value < (rule.minimum ?? 0) || value > (rule.maximum ?? 9999)) errors.push(`${path}: 정수 범위를 확인하세요`);
    } else if (rule.type === 'boolean' && typeof value !== 'boolean') errors.push(`${path}: 참/거짓이 필요합니다`);
    if (Object.hasOwn(rule, 'const') && value !== rule.const) errors.push(`${path}: 지원하지 않는 버전입니다`);
    if (rule.enum && !rule.enum.includes(value)) errors.push(`${path}: 허용된 값이 아닙니다`);
  }
  walk(input, schema, 'report');
  if (errors.length) return errors;
  const data = /** @type {import('./types.js').Report} */ (input);
  const validDate = (/** @type {string} */ date) => !Number.isNaN(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date;
  if (!validDate(data.asOf) || !data.asOf.startsWith(`${data.year}-`)) errors.push('asOf: 회고 연도 안의 실제 날짜를 입력하세요');
  const today = new Date();
  const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  if (data.asOf > todayISO) errors.push('asOf: 미래 날짜까지 회고할 수 없습니다');
  const ids = new Set(data.evidence.map(e => e.id));
  if (ids.size !== data.evidence.length) errors.push('evidence: ID는 중복될 수 없습니다');
  if (new Set(data.discoveries.map(d => d.id)).size !== data.discoveries.length) errors.push('discoveries: ID는 중복될 수 없습니다');
  data.evidence.forEach(e => {
    if (!validDate(e.date) || !e.date.startsWith(`${data.year}-`) || e.date > data.asOf) errors.push(`evidence.${e.id}: 회고 기간 안의 날짜를 입력하세요`);
  });
  [...data.discoveries, ...data.keep, ...data.change, data.plan, ...data.plan.firstWeek].forEach(item => {
    if (new Set(item.evidence).size !== item.evidence.length) errors.push('evidence: 같은 근거를 중복 연결할 수 없습니다');
    if (item.evidence.some(id => !ids.has(id))) errors.push('evidence: 존재하지 않는 근거 ID가 연결되어 있습니다');
  });
  data.discoveries.forEach(d => {
    if (d.evidence.length === 0) errors.push(`discoveries.${d.id}: 발견에는 실제 근거가 필요합니다`);
    if (d.confidence === 'conflicted' && d.evidence.length < 2) errors.push(`discoveries.${d.id}: 상충 해석에는 근거 2개 이상이 필요합니다`);
    if (d.confidence === 'supported' && d.evidence.length < 2) errors.push(`discoveries.${d.id}: 반복 패턴은 서로 다른 근거 2개 이상이 필요합니다`);
    if (d.confidence === 'conflicted' && !d.counterpoint.trim()) errors.push(`discoveries.${d.id}: 상충하는 근거를 설명하세요`);
  });
  if (data.evidence.length < 3 && data.limitations.length === 0) errors.push('limitations: 자료가 적다는 한계를 표시하세요');
  return errors;
}
