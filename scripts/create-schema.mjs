import { writeFileSync } from 'node:fs';
/** @param {number} [max] @param {number} [min] @returns {import('../skills/dear-next/scripts/types.js').Schema} */
const str = (max = 800, min = 1) => ({ type: 'string', minLength: min, maxLength: max });
/** @param {import('../skills/dear-next/scripts/types.js').Schema} items @param {number} maxItems @param {number} [minItems] @returns {import('../skills/dear-next/scripts/types.js').Schema} */
const array = (items, maxItems, minItems = 0) => ({ type: 'array', items, minItems, maxItems });
/** @param {Record<string, import('../skills/dear-next/scripts/types.js').Schema>} properties @returns {import('../skills/dear-next/scripts/types.js').Schema} */
const obj = properties => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false });
const refs = array({ ...str(40), pattern: '^[a-z0-9-]+$' }, 20);
const id = { ...str(40), pattern: '^[a-z0-9-]+$' };
const date = { ...str(10), pattern: '^\\d{4}-\\d{2}-\\d{2}$' };
const action = obj({ title: str(120), why: str(500), evidence: refs });
const schema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema', title: 'Dear Next report v1',
  ...obj({
    version: { type: 'integer', const: 1 }, year: { type: 'integer', minimum: 2000, maximum: 2200 }, asOf: date,
    synthetic: { type: 'boolean' }, coverage: str(300), title: str(100), subtitle: str(300), words: array(str(16), 3),
    evidence: array(obj({ id, source: str(120), date, excerpt: str(700) }), 40),
    discoveries: array(obj({ id, title: str(100), body: str(700), confidence: { type: 'string', enum: ['supported', 'tentative', 'conflicted'] }, evidence: refs, counterpoint: str(500, 0) }), 6),
    keep: array(action, 4), change: array(action, 4),
    plan: obj({ direction: str(150), why: str(600), evidence: refs, firstMonth: str(500), firstWeek: array(action, 3, 3) }),
    limitations: array(str(400), 8)
  })
};
writeFileSync('skills/dear-next/references/report.schema.json', JSON.stringify(schema, null, 2) + '\n');
