import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

const inventory = JSON.parse(fs.readFileSync('docs/FEATURE-INVENTORY-CHAM-VIET.json', 'utf8'));
const prd = fs.readFileSync('docs/PRD-CHAM-VIET.md', 'utf8');
const brd = fs.readFileSync('docs/BRD-CHAM-VIET.md', 'utf8');
const prompt = fs.readFileSync('docs/UI-REDESIGN-PROMPT.md', 'utf8');
const combined = fs.readFileSync('docs/CHAM-VIET-PRD-BRD-VA-PROMPT.md', 'utf8');
const features = inventory.modules.flatMap(m => m.features);
const ids = features.map(f => f.id);
assert.equal(new Set(ids).size, inventory.featureCount);
assert.equal(features.length, inventory.featureCount);
const tableIds = [...prd.matchAll(/^\| (FR-[A-Z]+-\d+) \|/gm)].map(m => m[1]);
assert.deepEqual(tableIds, ids);
assert(!/\{\{[^}]+\}\}/.test(combined), 'Unresolved template placeholders');
assert(combined.includes(prd) && combined.includes(brd) && combined.includes(prompt));
for (let i = 1; i <= 10; i++) {
  const businessId = `BR-${String(i).padStart(2, '0')}`;
  assert(brd.includes(businessId), `Missing BRD requirement ${businessId}`);
  assert(inventory.modules.some(m => m.businessRequirement === businessId), `No feature mapping for ${businessId}`);
}
for (const feature of features) {
  for (const key of ['title', 'behavior', 'states', 'acceptance']) assert(feature[key], `${feature.id}: missing ${key}`);
}
for (const [path, hash] of Object.entries(inventory.sourceSHA256)) {
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex'), hash, `Source changed: ${path}`);
}
const data = JSON.parse(fs.readFileSync('src/data/explore.json', 'utf8'));
assert.equal(inventory.snapshot.entities, data.length);
assert.equal(inventory.snapshot.relations, data.reduce((s,e) => s + e.relations.length, 0) / 2);
assert.equal(inventory.snapshot.maps, data.filter(e => e.maps).length);
assert.equal(inventory.snapshot.noSources, data.filter(e => !e.sources.length).length);
assert.equal(inventory.snapshot.deep.reduce((s,d) => s+d.entries,0), 36);
assert.equal(inventory.snapshot.deep.reduce((s,d) => s+d.plannerPOIs,0), 28);
console.log(JSON.stringify({result:'PASS',features:features.length,modules:inventory.modules.length,businessRequirements:10,sourceFiles:Object.keys(inventory.sourceSHA256).length,checks:['unique IDs','PRD/inventory coverage','business mapping','behavior/states/acceptance','combined document completeness','no unresolved placeholders','source SHA256','data snapshot']}, null, 2));
