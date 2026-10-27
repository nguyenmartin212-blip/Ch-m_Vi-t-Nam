import { useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import Sheet from "./ui/AnimatedSheet";
import MotionButton from "./ui/MotionButton";
import { defaultShareUrl, validateShareUrl } from "../lib/shareUrl";
import "./share-access.css";

const savedKey = "cham-viet.share-url";
function initialUrl() {
  let saved = "";
  try {
    saved = localStorage.getItem(savedKey) || "";
  } catch {
    /* Storage can be unavailable. */
  }
  return defaultShareUrl(
    location.href,
    import.meta.env.VITE_PUBLIC_APP_URL ||
      validateShareUrl(saved).url ||
      "https://cham-vietnam.vercel.app/#/explore",
    saved,
  );
}

function SharePanel({ onClose }) {
  const [initial] = useState(initialUrl);
  const [draft, setDraft] = useState(initial);
  const [target, setTarget] = useState(initial);
  const [editing, setEditing] = useState(!initial);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [downloading, setDownloading] = useState(false);
  const input = useRef(null);
  const code = useMemo(() => {
    if (!target) return null;
    try {
      const { modules } = QRCode.create(target, { errorCorrectionLevel: "M" });
      let path = "";
      for (let row = 0; row < modules.size; row++)
        for (let col = 0; col < modules.size; col++)
          if (modules.get(row, col)) path += `M${col + 4} ${row + 4}h1v1h-1z`;
      return { size: modules.size + 8, path };
    } catch {
      return null;
    }
  }, [target]);

  function generate(event) {
    event.preventDefault();
    const checked = validateShareUrl(draft);
    setError(checked.error);
    if (!checked.url) return;
    setDraft(checked.url);
    setTarget(checked.url);
    setEditing(false);
    setStatus("");
    try {
      localStorage.setItem(savedKey, checked.url);
    } catch {
      /* QR still works without storage. */
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(target);
      setStatus("Đã sao chép đường dẫn.");
    } catch {
      setEditing(true);
      setStatus("Hãy chọn và sao chép đường dẫn trong ô bên dưới.");
      window.setTimeout(() => {
        input.current?.focus();
        input.current?.select();
      }, 0);
    }
  }
  async function download() {
    setDownloading(true);
    try {
      const data = await QRCode.toDataURL(target, {
        width: 1200,
        margin: 4,
        errorCorrectionLevel: "M",
        color: { dark: "#102f25", light: "#ffffff" },
      });
      const link = document.createElement("a");
      link.href = data;
      link.download = "cham-viet-qr.png";
      document.body.append(link);
      link.click();
      link.remove();
      setStatus("Đã tạo ảnh QR để tải về.");
    } catch {
      setStatus("Chưa tải được ảnh QR. Hãy thử lại.");
    } finally {
      setDownloading(false);
    }
  }
  return (
    <Sheet title="Mở Chạm Việt bằng QR" onClose={onClose}>
      <div className="cv-share-panel">
        <p className="cv-kicker">CHẠM VIỆT TRÊN ĐIỆN THOẠI</p>
        <h1>Quét mã, bắt đầu khám phá.</h1>
        <p>
          Mở camera điện thoại, hướng vào mã QR rồi chạm vào đường dẫn hiện ra.
        </p>
        {code ? (
          <>
            <div className="cv-share-code">
              <svg
                viewBox={`0 0 ${code.size} ${code.size}`}
                role="img"
                aria-label="Mã QR mở website Chạm Việt"
                shapeRendering="crispEdges"
                data-qr-url={target}
              >
                <rect width={code.size} height={code.size} fill="#ffffff" />
                <path d={code.path} fill="#102f25" />
              </svg>
            </div>
            <p className="cv-share-link">{target}</p>
            {validateShareUrl(target).localNetwork && (
              <p className="cv-share-notice">
                Đây là địa chỉ mạng nội bộ. Điện thoại cần cùng mạng Wi-Fi và
                máy chủ đang mở.
              </p>
            )}
            <div className="cv-share-actions">
              <MotionButton
                className="cv-primary"
                onClick={download}
                disabled={downloading}
              >
                {downloading ? "Đang tạo ảnh…" : "Tải ảnh QR"}
              </MotionButton>
              <MotionButton onClick={copy}>Sao chép link</MotionButton>
            </div>
          </>
        ) : (
          <div className="cv-share-setup">
            <strong>Tạo mã QR cho website của bạn</strong>
            <p>
              Nhập link Vercel hoặc tên miền Chạm Việt. Khi mở trên website đã
              triển khai, mã QR sẽ được tạo tự động.
            </p>
          </div>
        )}
        {target && !code && (
          <p role="alert">
            Chưa tạo được mã QR. Hãy dùng một đường dẫn ngắn hơn.
          </p>
        )}
        <p className="cv-share-status" role="status" aria-live="polite">
          {status}
        </p>
        {editing ? (
          <form className="cv-share-form" onSubmit={generate}>
            <label htmlFor="cv-share-url">Địa chỉ website</label>
            <input
              ref={input}
              id="cv-share-url"
              type="url"
              inputMode="url"
              autoComplete="url"
              spellCheck={false}
              value={draft}
              placeholder="https://ten-du-an.vercel.app"
              onChange={(e) => {
                setDraft(e.target.value);
                setTarget("");
                setError("");
                setStatus("");
              }}
              aria-describedby={error ? "cv-share-url-error" : undefined}
              aria-invalid={Boolean(error)}
              required
            />
            {error && (
              <p
                id="cv-share-url-error"
                className="cv-share-error"
                role="alert"
              >
                {error}
              </p>
            )}
            <MotionButton type="submit" className="cv-primary">
              Tạo mã QR
            </MotionButton>
          </form>
        ) : (
          <MotionButton
            className="cv-share-change"
            onClick={() => setEditing(true)}
          >
            Đổi đường dẫn
          </MotionButton>
        )}
        <p className="cv-share-note">
          Quét mã để mở website. Bạn có thể cài Chạm Việt vào màn hình chính sau
          khi mở.
        </p>
      </div>
    </Sheet>
  );
}

export default function ShareAccess() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <MotionButton
        className="cv-share-trigger"
        onClick={() => setOpen(true)}
        aria-label="Quét QR để mở Chạm Việt"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <path d="M3 3h6v6H3zm12 0h6v6h-6zM3 15h6v6H3zM15 15h3v3h3v3h-6zm6-3v3M12 3v3m0 6h3M3 12h3m6 6v3" />
        </svg>
        <span>Mã QR</span>
      </MotionButton>
      {open && <SharePanel onClose={() => setOpen(false)} />}
    </>
  );
}
