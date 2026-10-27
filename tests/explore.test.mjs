import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  normalize,
  filterEntities,
  recommendations,
  locations,
  readRoute,
} from "../src/lib/explore.js";
import { parseRange } from "../public/range.js";
import { DESTINATIONS, LAYERS } from "../src/data/content.js";
import {
  recommendedIds,
  autoPlan,
  placeMap,
  totalHours,
  dayCapacity,
  moveItem,
  shift,
  removeItem,
  scheduleDay,
} from "../src/lib/itinerary.js";
const data = JSON.parse(
  fs.readFileSync(new URL("../src/data/explore.json", import.meta.url), "utf8"),
);
test("89 entities, 105 reciprocal graph edges, no broken links", () => {
  assert.equal(data.length, 89);
  assert.equal(new Set(data.map((e) => e.id)).size, 89);
  assert.equal(
    data.reduce((n, e) => n + e.relations.length, 0),
    210,
  );
  for (const e of data) {
    assert.ok(e.name && e.description);
    assert.equal(
      new Set(e.relations.map((r) => r.id)).size,
      e.relations.length,
    );
    for (const r of e.relations) {
      const target = data.find((d) => d.id === r.id);
      assert.ok(target, `${e.id} -> ${r.id}`);
      assert.ok(target.relations.some((x) => x.id === e.id));
    }
    for (const s of e.sources) assert.match(s.url, /^https:\/\//);
  }
});
test("11 map destinations resolve; all original destinations merged", () => {
  assert.equal(Object.keys(locations).length, 11);
  for (const id of Object.keys(locations))
    assert.ok(
      data.some((e) => e.id === id),
      id,
    );
  for (const d of DESTINATIONS)
    assert.ok(
      data.some((e) => e.id === d.id),
      d.id,
    );
});
test("accent-insensitive and empty search", () => {
  assert.equal(normalize(" Đà Nẵng "), "da nang");
  assert.ok(
    filterEntities(data, { query: "ha noi" }).some((e) => e.name === "Hà Nội"),
  );
  assert.equal(filterEntities(data, { query: "xyz-no-match" }).length, 0);
  assert.equal(filterEntities(data).length, 89);
});
test("combined filters and saved-only never broaden results", () => {
  const f = filterEntities(data, {
    category: "Ăn uống",
    region: "central",
    parent: "hoi-an",
  });
  assert.equal(f.length, 3);
  assert.ok(f.every((e) => e.category === "Ăn uống" && e.region === "central"));
  assert.equal(filterEntities(data, { saved: [] }).length, 0);
  assert.deepEqual(
    filterEntities(data, { saved: ["hoi-an"] }).map((e) => e.id),
    ["hoi-an"],
  );
});
test("source counts preserved and 47 Maps destinations", () => {
  assert.equal(data.filter((e) => !e.sources.length).length, 8);
  assert.equal(data.filter((e) => e.maps).length, 47);
});
test("recommendations stable, unique, explainable across 12 months", () => {
  for (let month = 1; month <= 12; month++) {
    const r = recommendations(data, ["Văn hóa", "Ẩm thực"], month, "Vừa phải");
    assert.equal(r.length, 4);
    assert.equal(new Set(r.map((x) => x.entity.id)).size, 4);
    assert.ok(r.every((x) => x.reason));
    assert.ok(r.every((x, i) => !i || r[i - 1].score >= x.score));
  }
});
test("deep links, legacy hashes and invalid routes", () => {
  assert.deepEqual(readRoute("#/saved?entity=hoi-an"), {
    page: "saved",
    entity: "hoi-an",
  });
  assert.equal(readRoute("#graph").page, "graph");
  assert.deepEqual(readRoute("#/map?entity=hue"), { page: "map", entity: "hue" });
  assert.equal(readRoute("#bad").page, "explore");
});
test("all six knowledge layers and four languages preserved", () => {
  assert.equal(LAYERS.length, 6);
  for (const d of DESTINATIONS)
    for (const l of LAYERS) {
      const entries = d.entries.filter((e) => e.layer === l.id);
      assert.ok(entries.length);
      for (const e of entries)
        for (const lang of ["vi", "en", "zh", "ko"])
          assert.ok(e.title[lang] && e.body[lang]);
    }
});
test("planner preserves chosen POIs for 1–7 days and groups 1–30", () => {
  for (const dest of DESTINATIONS)
    for (let days = 1; days <= 7; days++)
      for (const people of [1, 2, 6, 10, 30]) {
        const ids = recommendedIds(dest, days, [], people),
          map = placeMap(dest),
          plan = autoPlan(dest, ids, days);
        assert.equal(plan.length, days);
        assert.deepEqual(plan.flat().sort(), [...ids].sort());
        assert.equal(new Set(plan.flat()).size, ids.length);
        assert.ok(totalHours(ids, map) <= days * dayCapacity(people));
        for (const day of plan) {
          const s = scheduleDay(day, map);
          assert.ok(
            s.every(
              (x, i) => x.end > x.start && (!i || x.start >= s[i - 1].end),
            ),
          );
        }
      }
});
test("planner move, reorder and delete keep input immutable", () => {
  const d = DESTINATIONS[0],
    map = placeMap(d),
    ids = d.places.slice(0, 3).map((p) => p.id),
    p = [[ids[0], ids[1]], [ids[2]]];
  const before = JSON.stringify(p);
  assert.deepEqual(shift(p, 0, 0, 1)[0], [ids[1], ids[0]]);
  const moved = moveItem(p, 0, ids[0], 1, map);
  assert.equal(moved[0].includes(ids[0]), false);
  assert.equal(moved[1].filter((x) => x === ids[0]).length, 1);
  assert.equal(removeItem(p, ids[0]).flat().includes(ids[0]), false);
  assert.equal(JSON.stringify(p), before);
});
test("offline audio byte ranges: seek, suffix, invalid and out-of-bounds", () => {
  assert.deepEqual(parseRange("bytes=0-99", 1000), { start: 0, end: 99 });
  assert.deepEqual(parseRange("bytes=500-", 1000), { start: 500, end: 999 });
  assert.deepEqual(parseRange("bytes=-100", 1000), { start: 900, end: 999 });
  assert.deepEqual(parseRange("bytes=990-2000", 1000), {
    start: 990,
    end: 999,
  });
  for (const h of [
    "bytes=1000-",
    "bytes=3-1",
    "bytes=-0",
    "bytes=-",
    "bytes=0-1,3-4",
    "bad",
  ])
    assert.equal(parseRange(h, 1000), null);
});
test("manifest and all six audio assets exist", () => {
  const manifest = JSON.parse(
    fs.readFileSync("public/manifest.webmanifest", "utf8"),
  );
  assert.equal(manifest.display, "standalone");
  for (const i of manifest.icons) assert.ok(fs.existsSync("public" + i.src));
  const audio = JSON.parse(
    fs.readFileSync("public/audio/manifest.json", "utf8"),
  );
  assert.equal(audio.tracks.length, 6);
  for (const t of audio.tracks)
    assert.ok(fs.statSync("public" + t.src).size > 1000);
});
