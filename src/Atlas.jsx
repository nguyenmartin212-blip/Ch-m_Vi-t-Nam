import { useAppMotion } from "./lib/motionContext";
import { MotionSwap, MotionDisclosure } from "./components/ui/MotionContent";
import { Tabs } from "@animate-ui/react/primitives/base-ui/tabs";
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import LandingPage from "./components/LandingPage";
import GlobeExplorer from "./components/GlobeExplorer";
import TravelTransition from "./components/TravelTransition";
import WikiImage from "./components/WikiImage";
import useLocal from "./hooks/useLocal";
import useItineraries from "./hooks/useItineraries";
import { DESTINATIONS } from "./data/content";
import entities from "./data/explore.json";
import {
  categories,
  regions,
  locations,
  filterEntities,
  recommendations,
  readRoute,
} from "./lib/explore";
import Sheet from "./components/ui/AnimatedSheet";
import ActionButton from "./components/ui/MotionButton";
import NavIcon from "./components/ui/NavIcon";
import "./index.css";
import "./atlas.css";
import "./reference-ui.css";
const Legacy = lazy(() => import("./App"));
const DetailPanel = lazy(() => import("./components/DetailPanel"));
const StoryPlayer = lazy(() => import("./components/StoryPlayer"));
const ItineraryBuilder = lazy(() => import("./components/ItineraryBuilder"));
const SavedItineraries = lazy(() => import("./components/SavedItineraries"));
const NAV = [
  ["explore", "⌖", "Khám phá"],
  ["map", "⌖", "Bản đồ"],
  ["graph", "⌘", "Kết nối"],
  ["saved", "♡", "Bộ sưu tập"],
  ["suggest", "✦", "Gợi ý"],
  ["tools", "▤", "Hành trình"],
];
const lookup = Object.fromEntries(entities.map((e) => [e.id, e]));
const legacyIds = { "ha-noi": "ha-noi", hue: "hue", "tp-hcm": "tp-hcm" };
const allDest = entities.filter((e) => locations[e.id]);
const wiki = {
  "hoi-an": ["Hội An"],
  "ha-giang": ["Hà Giang"],
  "trang-an": ["Tràng An"],
  hue: ["Huế"],
  "ha-noi": ["Hoàn Kiếm Lake"],
  "tp-hcm": ["Ho Chi Minh City"],
  "da-nang": ["Da Nang"],
  "da-lat": ["Da Lat"],
  "ha-long": ["Hạ Long Bay"],
  "phu-quoc": ["Phú Quốc"],
  "can-tho": ["Cần Thơ"],
};
const referencePhotos = {
  hue: "p1-3",
  "hoi-an": "p1-1",
  "trang-an": "p1-0",
  "da-lat": "p1-2",
  "ha-long": "p1-4",
  "phu-quoc": "p5-4",
};
function Picture({ entity }) {
  const parent = allDest.find((d) =>
    d.relations.some((r) => r.id === entity.id),
  );
  const photo = referencePhotos[entity.id] || referencePhotos[parent?.id];
  if (photo)
    return (
      <img
        className="cv-photo"
        src={`/images/reference/${photo}.webp`}
        alt={entity.name}
        loading="lazy"
      />
    );
  return (
    <WikiImage
      titles={wiki[entity.id] || wiki[parent?.id] || [entity.name]}
      alt={entity.name}
      width={640}
      lang="vi"
      className="cv-photo"
      fallback={
        <div className="cv-photo cv-placeholder">
          <span>⌖</span>
          <small>{entity.name}</small>
        </div>
      }
    />
  );
}
function Card({ entity: e, saved, onSave, onOpen, reason }) {
  return (
    <MotionSwap as="article" className="cv-card">
      <div className="cv-card-art">
        <Picture entity={e} />
        <ActionButton
          className="cv-art-open"
          aria-label={`Khám phá ${e.name}`}
          onClick={() => onOpen(e.id)}
        />
        <span className="cv-badge">{e.category}</span>
        <ActionButton
          className={"cv-save " + (saved ? "active" : "")}
          aria-label={`${saved ? "Bỏ lưu" : "Lưu"} ${e.name}`}
          aria-pressed={saved}
          onClick={() => onSave(e.id)}
        >
          {saved ? "♥" : "♡"}
        </ActionButton>
      </div>
      <div className="cv-card-body">
        <small>{regions[e.region]}</small>
        <h3>
          <ActionButton onClick={() => onOpen(e.id)}>
            {e.name} <span>↗</span>
          </ActionButton>
        </h3>
        <p>{e.description}</p>
        {reason && <p className="cv-reason">✦ {reason}</p>}
        <div className="cv-card-foot">
          <span>{e.relations.length} kết nối</span>
          <span>
            {e.sources.length
              ? `${e.sources.length} nguồn tham chiếu`
              : "Biên tập mẫu"}
          </span>
        </div>
      </div>
    </MotionSwap>
  );
}
function VietnamMap({ onOpen }) {
  const [geo, setGeo] = useState(null),
    [zoom, setZoom] = useState(1);
  useEffect(() => {
    fetch("/data/vietnam.geojson")
      .then((r) => r.json())
      .then(setGeo)
      .catch(() => {});
  }, []);
  const project = ([lon, lat]) => [(lon - 101) * 27 + 20, (24 - lat) * 27 + 15];
  const polygon = (ring) =>
    ring.map((p, i) => `${i ? "L" : "M"}${project(p).join(",")}`).join(" ") +
    "Z";
  const shapes =
    geo?.features?.flatMap((f) =>
      f.geometry.type === "MultiPolygon"
        ? f.geometry.coordinates
        : f.geometry.type === "Polygon"
          ? [f.geometry.coordinates]
          : [],
    ) || [];
  return (
    <section className="cv-map">
      <div className="cv-map-title">
        <strong>Việt Nam</strong>
        <div>
          <ActionButton
            aria-label="Thu nhỏ bản đồ"
            onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
          >
            −
          </ActionButton>
          <ActionButton
            aria-label="Phóng to bản đồ"
            onClick={() => setZoom((z) => Math.min(2, z + 0.25))}
          >
            +
          </ActionButton>
          <ActionButton onClick={() => setZoom(1)}>Đặt lại</ActionButton>
        </div>
      </div>
      <div className="cv-map-window">
        <svg
          viewBox="0 0 470 510"
          role="group"
          aria-label="Bản đồ Việt Nam và 11 điểm khám phá"
        >
          <g
            transform={`translate(${235 * (1 - zoom)} ${255 * (1 - zoom)}) scale(${zoom})`}
          >
            <text x="265" y="245" className="cv-sea">
              BIỂN ĐÔNG
            </text>
            {shapes.map((p, i) => (
              <path
                key={i}
                d={p.map(polygon).join(" ")}
                fill="#c8d9be"
                stroke="#789976"
                strokeWidth=".6"
              />
            ))}
            {allDest.map((e) => {
              const [lat, lon] = locations[e.id];
              const [x, y] = project([lon, lat]);
              return (
                <g
                  key={e.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Mở ${e.name} trên bản đồ`}
                  onClick={() => onOpen(e.id)}
                  onKeyDown={(ev) => {
                    if (ev.key === "Enter" || ev.key === " ") {
                      ev.preventDefault();
                      onOpen(e.id);
                    }
                  }}
                >
                  <circle cx={x} cy={y} r="12" fill="transparent" />
                  <circle
                    cx={x}
                    cy={y}
                    r="4.5"
                    fill="#cc5b19"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={x + (e.id === "ha-noi" ? -9 : 9)}
                    y={y - 8}
                    textAnchor={e.id === "ha-noi" ? "end" : "start"}
                  >
                    {e.name}
                  </text>
                </g>
              );
            })}
            <circle cx="310" cy="220" r="3" fill="#789976" />
            <text x="320" y="220">
              QĐ. Hoàng Sa
            </text>
            <circle cx="370" cy="380" r="3" fill="#789976" />
            <text x="290" y="400">
              QĐ. Trường Sa
            </text>
          </g>
        </svg>
      </div>
      <footer>
        ⌖ Chọn một điểm để bắt đầu khám phá.
        <small>Bản đồ tổng quan · Vị trí đảo minh họa</small>
      </footer>
    </section>
  );
}
function GraphViewport({ children, center }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, [center]);
  return (
    <div>
      <p className="cv-graph-hint">
        Vuốt ngang để xem toàn bộ sơ đồ. Danh sách kết nối nằm bên dưới.
      </p>
      <div className="cv-graph-scroll" ref={ref}>
        {children}
      </div>
    </div>
  );
}
function Graph({ center, setCenter, onOpen }) {
  const e = lookup[center] || entities[0];
  return (
    <>
      <div className="cv-section-heading">
        <div>
          <p className="cv-kicker">NHÌN THẤY NHỮNG KẾT NỐI</p>
          <h1>Một nơi, nhiều câu chuyện.</h1>
        </div>
        <label>
          Điểm trung tâm
          <select value={e.id} onChange={(ev) => setCenter(ev.target.value)}>
            {entities.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="cv-graph-layout">
        <GraphViewport center={e.id}>
          <div className="cv-graph">
            <svg viewBox="0 0 600 600" aria-hidden="true">
              {e.relations.map((r, i) => {
                const a = (i * 2 * Math.PI) / e.relations.length;
                return (
                  <line
                    key={r.id}
                    x1="300"
                    y1="300"
                    x2={300 + 230 * Math.cos(a)}
                    y2={300 + 230 * Math.sin(a)}
                    stroke="#a8bda5"
                  />
                );
              })}
              <circle
                cx="300"
                cy="300"
                r="229"
                fill="none"
                stroke="#ced8c9"
                strokeDasharray="4 7"
              />
            </svg>
            <ActionButton
              className="cv-node cv-node-center"
              onClick={() => onOpen(e.id)}
            >
              {e.name}
              <small>Mở chi tiết ↗</small>
            </ActionButton>
            {e.relations.map((r, i) => {
              const a = (i * 2 * Math.PI) / e.relations.length;
              return (
                <ActionButton
                  className="cv-node"
                  key={r.id}
                  style={{
                    left: `${50 + 38 * Math.cos(a)}%`,
                    top: `${50 + 38 * Math.sin(a)}%`,
                  }}
                  onClick={() => setCenter(r.id)}
                >
                  {lookup[r.id].name}
                </ActionButton>
              );
            })}
          </div>
        </GraphViewport>
        <aside className="cv-graph-list">
          <h2>{e.name}</h2>
          <p>{e.relations.length} kết nối · Hiển thị toàn bộ</p>
          <ActionButton className="cv-primary" onClick={() => onOpen(e.id)}>
            Đọc câu chuyện ↗
          </ActionButton>
          {e.relations.map((r) => (
            <ActionButton key={r.id} onClick={() => setCenter(r.id)}>
              <strong>{lookup[r.id].name}</strong>
              <small>{r.label}</small>
              <span>→</span>
            </ActionButton>
          ))}
          <ActionButton onClick={() => setCenter("hoi-an")}>
            ↺ Về Hội An
          </ActionButton>
        </aside>
      </div>
    </>
  );
}
function OfflineTools() {
  const { reduced, setReduced } = useAppMotion();
  const [status, setStatus] = useState(""),
    [install, setInstall] = useState(null),
    [update, setUpdate] = useState(null);
  useEffect(() => {
    const fn = (e) => {
      e.preventDefault();
      setInstall(e);
    };
    window.addEventListener("beforeinstallprompt", fn);
    navigator.serviceWorker?.getRegistration().then((r) => {
      if (r?.waiting) setUpdate(r.waiting);
    });
    return () => window.removeEventListener("beforeinstallprompt", fn);
  }, []);
  async function download() {
    setStatus("Đang tải gói thuyết minh…");
    try {
      const manifest = await fetch("/audio/manifest.json").then((r) =>
        r.json(),
      );
      const files = [
        ...new Set(JSON.stringify(manifest).match(/[^"\s]+\.mp3/g) || []),
      ];
      const cache = await caches.open("cham-viet-audio-v1");
      for (const f of files) {
        const url = f.startsWith("/") ? f : "/audio/" + f;
        const r = await fetch(url);
        if (!r.ok) throw Error();
        await cache.put(url, r);
      }
      setStatus(`Đã lưu ${files.length} bản thuyết minh trên thiết bị.`);
    } catch {
      setStatus("Chưa tải được. Kiểm tra kết nối rồi thử lại.");
    }
  }
  return (
    <section className="cv-offline">
      <h2>Mang Việt Nam theo bạn.</h2>
      <label className="motion-preference">
        <input
          type="checkbox"
          checked={reduced}
          onChange={(e) => setReduced(e.target.checked)}
        />
        Giảm chuyển động trong ứng dụng
      </label>
      <p>
        Cài ứng dụng để mở toàn màn hình. Nội dung khám phá và lịch trình đã lưu
        dùng được ngoại tuyến sau lần mở đầu tiên; ảnh, bản đồ vệ tinh và tỷ giá
        trực tuyến cần mạng.
      </p>
      {install ? (
        <ActionButton
          className="cv-primary"
          onClick={async () => {
            await install.prompt();
            setInstall(null);
          }}
        >
          Cài Chạm Việt
        </ActionButton>
      ) : (
        <p className="cv-hint">
          Trên iPhone: Chia sẻ → Thêm vào Màn hình chính. Trên Android: menu
          trình duyệt → Cài đặt ứng dụng.
        </p>
      )}
      <ActionButton onClick={download}>
        ↓ Tải 6 bản thuyết minh để nghe ngoại tuyến
      </ActionButton>
      {update && (
        <ActionButton
          onClick={() => {
            navigator.serviceWorker.addEventListener(
              "controllerchange",
              () => location.reload(),
              { once: true },
            );
            update.postMessage({ type: "SKIP_WAITING" });
          }}
        >
          Cập nhật phiên bản mới
        </ActionButton>
      )}
      <p role="status">{status}</p>
    </section>
  );
}
export default function Atlas() {
  const [tool, setTool] = useState(null),
    [lang, setLang] = useLocal("bdtt.lang", "vi"),
    [panel, setPanel] = useState({ view: "layers" });
  const [travelMonth, setTravelMonth] = useState(""),
    [placeType, setPlaceType] = useState("");
  const trips = useItineraries();
  const openTool = (kind, id) => {
    setPanel({ view: "layers" });
    setTool({ kind, id });
  };
  const [stage, setStage] = useState(location.hash ? "app" : "landing"),
    [route, setRoute] = useState(() => readRoute(location.hash)),
    [query, setQuery] = useState(""),
    [category, setCategory] = useState(""),
    [region, setRegion] = useState(""),
    [source, setSource] = useState(""),
    [parent, setParent] = useState(""),
    [filters, setFilters] = useState(false),
    [view, setView] = useState("list"),
    [sort, setSort] = useState("suggested"),
    [limit, setLimit] = useState(4),
    [tab, setTab] = useState("overview"),
    [center, setCenter] = useState("hoi-an"),
    [saved, setSaved] = useLocal("cham-viet.saved", []),
    [legacy, setLegacy] = useState(null),
    [interests, setInterests] = useState(["Văn hóa"]),
    [month, setMonth] = useState(new Date().getMonth() + 1),
    [budget, setBudget] = useState(""),
    [online, setOnline] = useState(navigator.onLine);
  const search = useRef(null),
    safeSaved = Array.isArray(saved) ? saved : [];
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [stage, route.page]);
  useEffect(() => {
    const routeChange = () => {
      setRoute(readRoute(location.hash));
      setStage("app");
      setTab("overview");
    };
    const network = () => setOnline(navigator.onLine);
    const keys = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        search.current?.focus();
      }
    };
    window.addEventListener("hashchange", routeChange);
    window.addEventListener("online", network);
    window.addEventListener("offline", network);
    window.addEventListener("keydown", keys);
    return () => {
      window.removeEventListener("hashchange", routeChange);
      window.removeEventListener("online", network);
      window.removeEventListener("offline", network);
      window.removeEventListener("keydown", keys);
    };
  }, []);
  function navigate(page, id) {
    window.location.assign(
      `#/${page}${id ? "?entity=" + encodeURIComponent(id) : ""}`,
    );
  }
  const open = (id) => {
    setTab("overview");
    navigate(route.page, id);
  };
  const close = () => {
    if (history.state?.cvDetail) history.back();
    else navigate(route.page);
  };
  function openDetail(id) {
    history.pushState(
      { cvDetail: true },
      "",
      `#/${route.page}?entity=${encodeURIComponent(id)}`,
    );
    setRoute(readRoute(location.hash));
    setTab("overview");
  }
  const toggle = (id) =>
    setSaved((s) => {
      const a = Array.isArray(s) ? s : [];
      return a.includes(id) ? a.filter((x) => x !== id) : [...a, id];
    });
  function reset() {
    setTravelMonth("");
    setPlaceType("");
    setQuery("");
    setCategory("");
    setRegion("");
    setSource("");
    setParent("");
    setLimit(4);
  }
  let results = filterEntities(entities, {
    query,
    category,
    region,
    source,
    parent,
    month: travelMonth,
    type: placeType,
    saved: route.page === "saved" ? safeSaved : null,
  });
  if (sort === "az")
    results = [...results].sort((a, b) => a.name.localeCompare(b.name, "vi"));
  const current = lookup[route.entity];
  const cards = (list) =>
    list.map((e) => (
      <Card
        key={e.id}
        entity={e}
        saved={safeSaved.includes(e.id)}
        onSave={toggle}
        onOpen={openDetail}
      />
    ));
  if (stage === "landing")
    return (
      <MotionSwap className="cv-motion-stage" key="landing">
        <LandingPage onStart={() => setStage("globe")} />
      </MotionSwap>
    );
  if (stage === "globe")
    return (
      <MotionSwap className="cv-motion-stage" key="globe">
        <GlobeExplorer
          onBack={() => setStage("landing")}
          onExplore={() => setStage("flight")}
        />
      </MotionSwap>
    );
  if (stage === "flight")
    return (
      <TravelTransition
        countryName="Việt Nam"
        onComplete={() => {
          setStage("app");
          navigate("explore");
        }}
      />
    );
  if (legacy)
    return (
      <div className="cv-legacy">
        <ActionButton
          className="cv-legacy-back"
          onClick={() => setLegacy(null)}
        >
          ← Khám phá Chạm Việt
        </ActionButton>
        <Suspense
          fallback={<p className="cv-loading">Đang mở kho tri thức…</p>}
        >
          <Legacy
            initialId={legacy === "all" ? null : legacy}
            onExit={() => setLegacy(null)}
          />
        </Suspense>
      </div>
    );
  return (
    <div className="cv-shell">
      <a
        className="cv-skip"
        href="#cv-main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("cv-main").focus();
        }}
      >
        Đến nội dung chính
      </a>
      <div className="cv-site-strip">
        <span>ĐI ĐỂ HIỂU · CHẠM ĐỂ YÊU</span>
        <span className={online ? "" : "offline"}>
          {online ? "Việt Nam, qua từng câu chuyện" : "Bạn đang ngoại tuyến"}
        </span>
      </div>
      <header className="cv-site-header">
        <ActionButton
          className="cv-wordmark"
          onClick={() => {
            reset();
            navigate("explore");
          }}
          aria-label="Chạm Việt Nam, về Khám phá"
        >
          <strong>
            Chạm Việt Nam<span>.</span>
          </strong>
          <small>BẢN ĐỒ TRI THỨC</small>
        </ActionButton>
        <nav className="cv-desktop-nav" aria-label="Điều hướng chính">
          {NAV.map(([id, , label]) => (
            <ActionButton
              key={id}
              aria-current={route.page === id ? "page" : undefined}
              className={route.page === id ? "active" : ""}
              onClick={() => {
                reset();
                navigate(id);
              }}
            >
              {label}
              {id === "saved" && safeSaved.length > 0 && (
                <span className="cv-nav-count">{safeSaved.length}</span>
              )}
            </ActionButton>
          ))}
        </nav>
        <div className="cv-header-actions">
          <ActionButton
            onClick={() => {
              if (!search.current) navigate("explore");
              window.setTimeout(() => {
                search.current?.scrollIntoView({
                  block: "center",
                  behavior: "instant",
                });
                search.current?.focus();
              }, 100);
            }}
            aria-label="Tìm kiếm điểm đến"
          >
            Tìm kiếm
          </ActionButton>
          <ActionButton
            onClick={() => navigate("about")}
            aria-label="Hướng dẫn và thông tin"
          >
            Trợ giúp <span aria-hidden="true">↗</span>
          </ActionButton>
        </div>
      </header>
      <div className="cv-workspace">
        <MotionSwap
          as="main"
          key={route.page}
          id="cv-main"
          className={`cv-main cv-page-${route.page}`}
          tabIndex={-1}
        >
          {["explore", "map", "saved"].includes(route.page) && (
            <>
              {route.page === "explore" ? (
                <section className="cv-explore-hero">
                  <img
                    src="/images/reference/p1-4.webp"
                    alt="Cảnh vịnh Hạ Long trong bản thiết kế tham khảo"
                    fetchPriority="high"
                  />
                  <div className="cv-hero-copy">
                    <p className="cv-kicker">
                      CHẠM VÀO VẺ ĐẸP · KẾT NỐI NHỮNG HÀNH TRÌNH
                    </p>
                    <h1>
                      Khám phá Việt Nam
                      <br />
                      qua những kết nối
                    </h1>
                    <p>
                      Từ một điểm đến, mở ra di sản, ẩm thực và câu chuyện của
                      những người sống ở đó.
                    </p>
                    <div className="cv-hero-actions">
                      <ActionButton
                        className="cv-primary"
                        onClick={() => {
                          document
                            .getElementById("cv-discover")
                            .scrollIntoView({
                              behavior: "instant",
                              block: "start",
                            });
                          search.current?.focus({ preventScroll: true });
                        }}
                      >
                        Bắt đầu khám phá <span>↗</span>
                      </ActionButton>
                      <ActionButton onClick={() => navigate("map")}>
                        Xem bản đồ <span>↗</span>
                      </ActionButton>
                    </div>
                  </div>
                  <span className="cv-hero-location">
                    ⌖ Vịnh Hạ Long, Quảng Ninh
                  </span>
                </section>
              ) : (
                <div className="cv-intro">
                  <p className="cv-kicker">KHÔNG GIAN CỦA BẠN</p>
                  <h1>
                    {route.page === "saved"
                      ? "Bộ sưu tập của bạn"
                      : "Khám phá trên bản đồ"}
                  </h1>
                  <p>
                    {route.page === "saved"
                      ? "Những nơi muốn đến, những câu chuyện muốn giữ lại."
                      : "Đi theo sự tò mò, tìm những kết nối mới trên dải đất hình chữ S."}
                  </p>
                </div>
              )}
              <div className="cv-discover-heading" id="cv-discover">
                <div>
                  <h2>
                    {route.page === "saved"
                      ? "Những điều đã lưu"
                      : "Điểm đến đầy cảm hứng"}
                  </h2>
                  <p>Một Việt Nam quen mà lạ, đang chờ bạn khám phá.</p>
                </div>
                <ActionButton
                  onClick={() =>
                    openDetail(
                      entities[Math.floor(Math.random() * entities.length)].id,
                    )
                  }
                >
                  Gợi ý một nơi <span>↗</span>
                </ActionButton>
              </div>
              <div className="cv-search-row">
                <label className="cv-search">
                  <span>⌕</span>
                  <input
                    ref={search}
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setLimit(6);
                    }}
                    placeholder="Tìm điểm đến, món ăn, câu chuyện…"
                    aria-label="Tìm kiếm tri thức"
                  />
                  <kbd>Ctrl K</kbd>
                  {query && (
                    <ActionButton
                      aria-label="Xóa tìm kiếm"
                      onClick={() => setQuery("")}
                    >
                      ×
                    </ActionButton>
                  )}
                </label>
                <ActionButton
                  className={filters ? "active" : ""}
                  aria-expanded={filters}
                  aria-controls="explore-filter-panel"
                  onClick={() => setFilters(!filters)}
                >
                  ☷ Bộ lọc
                </ActionButton>
              </div>
              <MotionDisclosure open={filters} id="explore-filter-panel">
                <div className="cv-filters">
                  <label>
                    Vùng miền
                    <select
                      value={region}
                      onChange={(e) => {
                        setRegion(e.target.value);
                        setLimit(6);
                      }}
                    >
                      <option value="">Tất cả vùng miền</option>
                      {Object.entries(regions).map(([id, t]) => (
                        <option key={id} value={id}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Nguồn nội dung
                    <select
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                    >
                      <option value="">Tất cả nguồn</option>
                      <option value="linked">Có nguồn tham chiếu</option>
                      <option value="editorial">Biên tập mẫu</option>
                    </select>
                  </label>
                  <label>
                    Tháng đi · mùa tham khảo
                    <select
                      value={travelMonth}
                      onChange={(e) => setTravelMonth(e.target.value)}
                    >
                      <option value="">Tất cả tháng</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i + 1}>
                          Tháng {i + 1}
                        </option>
                      ))}
                    </select>
                  </label>
                  <ActionButton onClick={reset}>Đặt lại bộ lọc</ActionButton>
                </div>
              </MotionDisclosure>
              <div className="cv-chips" aria-label="Loại tri thức">
                {["", ...categories].map((c) => (
                  <ActionButton
                    key={c}
                    aria-pressed={category === c}
                    className={category === c ? "active" : ""}
                    onClick={() => {
                      setCategory(c);
                      setLimit(6);
                    }}
                  >
                    {c || "Tất cả"}
                  </ActionButton>
                ))}
              </div>
              <section className="cv-discovery">
                <div>
                  <strong>Đi chơi ở đâu, ăn gì ngon?</strong>
                  <p>Tìm những địa chỉ cụ thể quanh điểm đến của bạn.</p>
                </div>
                <label>
                  <span className="cv-sr">Chọn điểm đến</span>
                  <select
                    value={parent}
                    onChange={(e) => {
                      setParent(e.target.value);
                      setLimit(6);
                    }}
                  >
                    <option value="">Tất cả điểm đến</option>
                    {allDest.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="cv-sr">Loại địa điểm</span>
                  <select
                    value={placeType}
                    onChange={(e) => {
                      setPlaceType(e.target.value);
                      setLimit(6);
                    }}
                  >
                    <option value="">Tất cả loại địa điểm</option>
                    {[
                      ...new Set(
                        entities.map((e) => e.placeType).filter(Boolean),
                      ),
                    ].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <ActionButton
                  onClick={() => {
                    setCategory("Vui chơi");
                    setPlaceType("");
                    setLimit(6);
                  }}
                >
                  Vui chơi
                </ActionButton>
                <ActionButton
                  onClick={() => {
                    setCategory("Ăn uống");
                    setPlaceType("");
                    setLimit(6);
                  }}
                >
                  Ăn uống
                </ActionButton>
                <ActionButton
                  onClick={() => {
                    setCategory("");
                    setPlaceType("Cà phê");
                    setLimit(6);
                  }}
                >
                  Cà phê
                </ActionButton>
                <ActionButton
                  onClick={() => {
                    setCategory("");
                    setPlaceType("Chợ");
                    setLimit(6);
                  }}
                >
                  Chợ
                </ActionButton>
              </section>
              <div className="cv-section-heading">
                <div>
                  <h2>Một điểm đến. Nhiều góc nhìn.</h2>
                  <p role="status">
                    {results.length} mục tri thức{" "}
                    {parent && `quanh ${lookup[parent].name}`}
                  </p>
                </div>
                <div
                  className={
                    "cv-display " +
                    (route.page === "map" ? "cv-map-display" : "")
                  }
                >
                  <select
                    aria-label="Sắp xếp"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="suggested">Gợi ý</option>
                    <option value="az">Tên A–Z</option>
                  </select>
                  <ActionButton
                    className={view === "map" ? "active" : ""}
                    onClick={() => setView("map")}
                  >
                    Bản đồ
                  </ActionButton>
                  <ActionButton
                    className={view === "list" ? "active" : ""}
                    onClick={() => setView("list")}
                  >
                    Danh sách
                  </ActionButton>
                </div>
              </div>
              <div
                className={
                  "cv-results " +
                  (route.page === "map"
                    ? "map-page"
                    : view === "list"
                      ? "list-only"
                      : "")
                }
              >
                {(route.page === "map" || view === "map") && (
                  <VietnamMap onOpen={openDetail} />
                )}
                <div>
                  <div className="cv-cards">
                    {cards(results.slice(0, limit))}
                  </div>
                  {!results.length && (
                    <div className="cv-empty">
                      <span>⌕</span>
                      <h3>
                        {route.page === "saved" && !safeSaved.length
                          ? "Bộ sưu tập đang chờ bạn."
                          : "Chưa tìm thấy kết quả."}
                      </h3>
                      <p>
                        Thử một từ khóa khác hoặc khám phá những câu chuyện mới.
                      </p>
                      <ActionButton
                        onClick={() => {
                          reset();
                          if (route.page === "saved") navigate("explore");
                        }}
                      >
                        Khám phá tất cả
                      </ActionButton>
                    </div>
                  )}
                  {limit < results.length && (
                    <ActionButton
                      className="cv-load"
                      onClick={() => setLimit(limit + 6)}
                    >
                      Xem thêm 6 mục ↓
                    </ActionButton>
                  )}
                </div>
              </div>
              <section className="cv-journey-banner">
                <div>
                  <h2>Hành trình của bạn, câu chuyện của Việt Nam.</h2>
                  <p>
                    Lưu nơi yêu thích, nghe thuyết minh và lên kế hoạch cho
                    chuyến đi.
                  </p>
                </div>
                <ActionButton
                  className="cv-primary"
                  onClick={() => openTool("plan", "hue")}
                >
                  Tạo hành trình riêng ↗
                </ActionButton>
              </section>
            </>
          )}
          {route.page === "graph" && (
            <Graph center={center} setCenter={setCenter} onOpen={openDetail} />
          )}
          {route.page === "suggest" && (
            <>
              <p className="cv-kicker">MỘT HÀNH TRÌNH DÀNH RIÊNG CHO BẠN</p>
              <h1>Bạn muốn khám phá điều gì?</h1>
              <p>Chọn sở thích để tìm một điểm bắt đầu.</p>
              <div className="cv-chips">
                {[
                  "Văn hóa",
                  "Ẩm thực",
                  "Thiên nhiên",
                  "Đi chậm",
                  "Phiêu lưu",
                ].map((i) => (
                  <ActionButton
                    key={i}
                    className={interests.includes(i) ? "active" : ""}
                    aria-pressed={interests.includes(i)}
                    onClick={() =>
                      setInterests((a) =>
                        a.includes(i) ? a.filter((x) => x !== i) : [...a, i],
                      )
                    }
                  >
                    {i}
                  </ActionButton>
                ))}
              </div>
              <div className="cv-filters">
                <label>
                  Tháng khởi hành
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i + 1}>
                        Tháng {i + 1}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Mức chi tiêu
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  >
                    {["", "Tiết kiệm", "Vừa phải", "Thoải mái"].map((b) => (
                      <option key={b} value={b}>
                        {b || "Linh hoạt"}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <p className="cv-hint">
                Gợi ý từ dữ liệu mẫu; mùa đi và ngân sách cần được kiểm tra
                trước chuyến đi.
              </p>
              <div className="cv-cards cv-suggestion">
                {recommendations(entities, interests, month, budget).map(
                  ({ entity, reason }) => (
                    <Card
                      key={entity.id}
                      entity={entity}
                      reason={reason}
                      saved={safeSaved.includes(entity.id)}
                      onSave={toggle}
                      onOpen={openDetail}
                    />
                  ),
                )}
              </div>
            </>
          )}
          {route.page === "tools" && (
            <>
              <p className="cv-kicker">TỪ CÂU CHUYỆN ĐẾN HÀNH TRÌNH</p>
              <h1>Đi sâu hơn. Đi theo cách của bạn.</h1>
              <p>
                Kho nội dung chuyên sâu tại Hà Nội, Huế và TP. Hồ Chí Minh, giữ
                trọn từ Bản đồ tri thức.
              </p>
              <div className="cv-tool-grid">
                {entities
                  .filter((e) => legacyIds[e.id])
                  .map((e) => (
                    <article key={e.id}>
                      <Picture entity={e} />
                      <h2>{e.name}</h2>
                      <p>
                        6 lớp tri thức · 4 ngôn ngữ · Thuyết minh · Lịch trình
                      </p>
                      <div className="cv-tool-actions">
                        <ActionButton
                          className="cv-primary"
                          onClick={() => openTool("layers", e.id)}
                        >
                          6 lớp tri thức →
                        </ActionButton>
                        <ActionButton onClick={() => openTool("story", e.id)}>
                          ▶ Nghe kể chuyện
                        </ActionButton>
                        <ActionButton onClick={() => openTool("plan", e.id)}>
                          ＋ Lập lịch trình
                        </ActionButton>
                      </div>
                    </article>
                  ))}
              </div>
              <div className="cv-tool-actions">
                <ActionButton
                  className="cv-primary"
                  onClick={() => setTool({ kind: "saved" })}
                >
                  Lịch trình đã lưu ({trips.list.length})
                </ActionButton>
                <ActionButton onClick={() => setLegacy("all")}>
                  Mở bản đồ địa lý & vệ tinh
                </ActionButton>
              </div>
              <OfflineTools />
            </>
          )}
          {route.page === "about" && (
            <>
              <p className="cv-kicker">CHẠM VIỆT</p>
              <h1>Hiểu một nơi, qua nhiều góc nhìn.</h1>
              <div className="cv-prose">
                <h2>Bắt đầu từ đâu?</h2>
                <p>
                  Tìm kiếm hoặc chạm một điểm trên bản đồ. Mở Kết nối để đi từ
                  một điểm đến sang món ăn, di sản và trải nghiệm liên quan. Bấm
                  trái tim để lưu vào bộ sưu tập trên thiết bị này.
                </p>
                <h2>Kho tri thức có gì?</h2>
                <p>
                  89 mục khám phá và 105 quan hệ từ website tham chiếu. Nội dung
                  chuyên sâu của dự án Bản đồ tri thức được giữ lại: sáu lớp nội
                  dung, bốn ngôn ngữ, thuyết minh, lịch trình, ghi chú và đánh
                  giá.
                </p>
                <h2>Nguồn và giới hạn</h2>
                <p>
                  Nội dung khám phá được chuyển từ bản mẫu website; thời lượng,
                  ngân sách, mùa đi và quan hệ là dữ liệu minh họa. Nguồn được
                  giữ ở từng mục, chưa được xác minh lại. Không có tài khoản hay
                  đồng bộ đám mây; dữ liệu lưu cục bộ có thể mất khi xóa dữ liệu
                  trình duyệt.
                </p>
                <ActionButton onClick={() => setStage("landing")}>
                  Xem lại intro & chọn quốc gia
                </ActionButton>
                <ActionButton onClick={() => setStage("globe")}>
                  Mở địa cầu & công cụ đổi tiền
                </ActionButton>
                <OfflineTools />
              </div>
            </>
          )}
        </MotionSwap>
        <footer className="cv-footer">
          <span>Chạm Việt Nam · Mỗi hành trình, một kết nối.</span>
          <small>Nội dung tham khảo · Kiểm tra thông tin trước chuyến đi</small>
          <ActionButton onClick={() => navigate("about")}>
            Về Chạm Việt ↗
          </ActionButton>
        </footer>
      </div>
      <nav className="cv-bottomnav" aria-label="Điều hướng điện thoại">
        {NAV.map(([id, , label]) => (
          <ActionButton
            key={id}
            className={route.page === id ? "active" : ""}
            onClick={() => {
              reset();
              navigate(id);
            }}
          >
            <NavIcon name={id} />
            <span>{label}</span>
          </ActionButton>
        ))}
      </nav>
      {current && !tool && (
        <Sheet title={current.name} onClose={close}>
          <div className="cv-detail-art">
            <Picture entity={current} />
          </div>
          <div className="cv-detail-body">
            <p className="cv-kicker">
              {current.category} · {regions[current.region]}
            </p>
            <div className="cv-section-heading">
              <h1>{current.name}</h1>
              <ActionButton
                aria-label={`${safeSaved.includes(current.id) ? "Bỏ lưu" : "Lưu"} ${current.name}`}
                aria-pressed={safeSaved.includes(current.id)}
                onClick={() => toggle(current.id)}
              >
                {safeSaved.includes(current.id) ? "♥ Đã lưu" : "♡ Lưu lại"}
              </ActionButton>
            </div>
            <p>{current.description}</p>
            <p className="cv-tags">{current.tags}</p>
            <Tabs.Root value={tab} onValueChange={setTab}>
              <Tabs.List
                className="cv-detail-tabs"
                aria-label="Chi tiết tri thức"
              >
                {[
                  ["overview", "Tổng quan"],
                  ["connections", `Kết nối (${current.relations.length})`],
                  ["sources", "Nguồn tham chiếu"],
                ].map(([id, t]) => (
                  <Tabs.Tab key={id} value={id} aria-selected={tab === id}>
                    {t}
                  </Tabs.Tab>
                ))}
              </Tabs.List>
              <div className="cv-tab-panels">
                <Tabs.Panel value="overview">
                  <div className="cv-stats">
                    <div>
                      Thời lượng gợi ý<strong>{current.duration}</strong>
                    </div>
                    <div>
                      Mức chi tiêu<strong>{current.budget}</strong>
                    </div>
                    <div>
                      Tri thức liên quan
                      <strong>{current.relations.length} kết nối</strong>
                    </div>
                  </div>
                  {current.address && (
                    <section className="cv-place-info">
                      <h2>Thông tin để lên kế hoạch</h2>
                      <p>
                        <strong>{current.placeType}</strong>
                      </p>
                      <p>{current.address}</p>
                      <p className="cv-hint">
                        Giờ mở cửa, giá và tình trạng hoạt động: chưa xác minh.
                      </p>
                    </section>
                  )}
                  {current.narrative.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                  {legacyIds[current.id] && (
                    <ActionButton
                      className="cv-primary"
                      onClick={() => openTool("layers", current.id)}
                    >
                      Khám phá 6 lớp tri thức, nghe kể chuyện & lập lịch trình →
                    </ActionButton>
                  )}
                  {current.maps && (
                    <a
                      className="cv-external"
                      href={current.maps}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Mở chỉ đường Google Maps ↗
                    </a>
                  )}
                  <h2>Từ {current.name}, khám phá thêm</h2>
                  {current.relations.slice(0, 4).map((r) => (
                    <ActionButton
                      className="cv-related"
                      key={r.id}
                      onClick={() => open(r.id)}
                    >
                      <strong>{lookup[r.id].name}</strong>
                      <span>{r.label} →</span>
                    </ActionButton>
                  ))}
                  {locations[current.id] && (
                    <ActionButton
                      className="cv-load"
                      onClick={() => {
                        setParent(current.id);
                        setCategory("");
                        setQuery("");
                        navigate("explore");
                      }}
                    >
                      Xem các địa điểm ăn uống & vui chơi tại đây
                    </ActionButton>
                  )}
                </Tabs.Panel>
                <Tabs.Panel value="connections">
                  {current.relations.map((r) => (
                    <ActionButton
                      className="cv-related"
                      key={r.id}
                      onClick={() => open(r.id)}
                    >
                      <strong>{lookup[r.id].name}</strong>
                      <span>{r.label} →</span>
                    </ActionButton>
                  ))}
                  <ActionButton
                    className="cv-primary"
                    onClick={() => {
                      setCenter(current.id);
                      navigate("graph");
                    }}
                  >
                    Xem trên bản đồ kết nối
                  </ActionButton>
                </Tabs.Panel>
                <Tabs.Panel value="sources">
                  <p>
                    Nguồn tham chiếu công khai từ bản mẫu, chưa đối chiếu từng
                    trường dữ liệu.
                  </p>
                  {current.sources.length ? (
                    current.sources.map((s) => (
                      <a
                        className="cv-source"
                        key={s.url}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <strong>{s.label}</strong>
                        <span>Mở tài liệu gốc ↗</span>
                      </a>
                    ))
                  ) : (
                    <p>
                      Nội dung biên tập minh họa, chưa có nguồn tham chiếu đính
                      kèm.
                    </p>
                  )}
                </Tabs.Panel>
                <p className="cv-hint">
                  Thời lượng và chi tiêu là gợi ý mẫu. Kiểm tra thông tin thực
                  tế trước chuyến đi.
                </p>
              </div>
            </Tabs.Root>
          </div>
        </Sheet>
      )}

      {tool && (
        <Suspense
          fallback={<div className="cv-loading">Đang mở hành trình…</div>}
        >
          {tool.kind === "layers" && (
            <Sheet title="Tri thức chuyên sâu" onClose={() => setTool(null)}>
              <div className="cv-knowledge">
                <label className="cv-language">
                  Ngôn ngữ nội dung{" "}
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                  >
                    {[
                      ["vi", "Tiếng Việt"],
                      ["en", "English"],
                      ["zh", "中文"],
                      ["ko", "한국어"],
                    ].map(([id, name]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>
                <DetailPanel
                  dest={DESTINATIONS.find((d) => d.id === tool.id)}
                  lang={lang}
                  panel={panel}
                  setPanel={setPanel}
                  saved={safeSaved.includes(tool.id)}
                  onSave={() => toggle(tool.id)}
                  onClose={() => setTool(null)}
                  onPlan={(id) => openTool("plan", id)}
                  onStory={(id) => openTool("story", id)}
                />
              </div>
            </Sheet>
          )}
          {tool.kind === "story" && (
            <StoryPlayer
              dest={DESTINATIONS.find((d) => d.id === tool.id)}
              lang={lang}
              setLang={setLang}
              onClose={() => setTool(null)}
              onPlan={(id) => openTool("plan", id)}
              onLayers={() => openTool("layers", tool.id)}
            />
          )}
          {tool.kind === "plan" && (
            <ItineraryBuilder
              lang={lang}
              dests={DESTINATIONS}
              initial={{ destId: tool.id, itinerary: tool.itinerary }}
              onClose={() => setTool(null)}
              onSave={trips.save}
              onOpenSaved={() => setTool({ kind: "saved" })}
            />
          )}
          {tool.kind === "saved" && (
            <SavedItineraries
              lang={lang}
              list={trips.list}
              onClose={() => setTool(null)}
              onPatch={trips.patch}
              onRemove={trips.remove}
              onNew={() => setTool({ kind: "plan" })}
              onEdit={(itinerary) => setTool({ kind: "plan", itinerary })}
              onCopy={(it) =>
                setTool({
                  kind: "plan",
                  itinerary: {
                    ...it,
                    id: null,
                    name: it.name + " (bản sao)",
                    createdAt: null,
                    rating: 0,
                  },
                })
              }
            />
          )}
        </Suspense>
      )}
    </div>
  );
}
