export const normalize = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
export const regions = {
  north: "Miền Bắc",
  central: "Miền Trung & Tây Nguyên",
  south: "Miền Nam",
};
export const categories = [
  "Điểm đến",
  "Di sản",
  "Thiên nhiên",
  "Ăn uống",
  "Vui chơi",
  "Làng nghề",
  "Văn hóa",
  "Trải nghiệm",
];
export const seasonMonths = {
  central: [2, 3, 4, 5, 6, 7, 8],
  south: [11, 12, 1, 2, 3, 4],
  north: [3, 4, 9, 10, 11],
};
export const locations = {
  "hoi-an": [15.88, 108.33],
  "ha-giang": [22.82, 104.98],
  "trang-an": [20.25, 105.92],
  hue: [16.46, 107.59],
  "can-tho": [10.04, 105.79],
  "ha-long": [20.95, 107.08],
  "ha-noi": [21.03, 105.85],
  "da-lat": [11.94, 108.44],
  "tp-hcm": [10.78, 106.7],
  "da-nang": [16.05, 108.2],
  "phu-quoc": [10.22, 103.96],
};
export function filterEntities(data, f = {}) {
  const query = normalize(f.query),
    parent = data.find((e) => e.id === f.parent);
  return data.filter(
    (e) =>
      (!query ||
        normalize([e.name, e.description, e.tags].join(" ")).includes(query)) &&
      (!f.category || e.category === f.category) &&
      (!f.region || e.region === f.region) &&
      (!f.month || seasonMonths[e.region].includes(Number(f.month))) &&
      (!f.type || normalize(e.placeType).includes(normalize(f.type))) &&
      (!f.source ||
        (f.source === "linked"
          ? e.sources.length > 0
          : e.sources.length === 0)) &&
      (!parent ||
        parent.relations.some(
          (r) => r.id === e.id && r.label.includes("địa điểm"),
        )) &&
      (!f.saved || f.saved.includes(e.id)),
  );
}
export function recommendations(data, interests, month, budget) {
  return data
    .filter((e) => locations[e.id])
    .map((e) => {
      const hits = interests.filter((i) =>
        normalize(e.tags + " " + e.description).includes(normalize(i)),
      );
      const season = seasonMonths[e.region];
      const inSeason = season.includes(Number(month));
      return {
        entity: e,
        score:
          hits.length * 3 +
          Number(inSeason) +
          Number(!budget || budget === e.budget),
        reason:
          [
            ...hits,
            inSeason ? "Mùa đi gợi ý phù hợp" : null,
            budget === e.budget ? "Mức chi tiêu phù hợp" : null,
          ]
            .filter(Boolean)
            .join(" · ") || "Một góc nhìn mới để khám phá",
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}
export function readRoute(hash) {
  const [path, query] = hash.replace(/^#\/?/, "").split("?");
  const allowed = ["explore", "graph", "saved", "suggest", "tools", "about"];
  return {
    page: allowed.includes(path) ? path : "explore",
    entity: new URLSearchParams(query).get("entity"),
  };
}
