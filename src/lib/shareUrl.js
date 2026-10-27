export function validateShareUrl(value) {
  try {
    const raw = String(value || "").trim();
    if (!raw)
      return {
        url: "",
        error: "Nhập đường dẫn website Chạm Việt đã triển khai.",
      };
    if (raw.length > 1200)
      return {
        url: "",
        error: "Đường dẫn quá dài. Hãy dùng link trang chủ để mã QR dễ quét.",
      };
    const url = new URL(raw);
    if (
      !["https:", "http:"].includes(url.protocol) ||
      url.username ||
      url.password
    )
      return {
        url: "",
        error:
          "Dùng đường dẫn http:// hoặc https://, không kèm thông tin đăng nhập.",
      };
    const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
    if (
      host === "localhost" ||
      host.endsWith(".localhost") ||
      host === "::1" ||
      host === "0.0.0.0" ||
      /^127\./.test(host)
    )
      return {
        url: "",
        error:
          "Link localhost chỉ mở trên máy này. Hãy nhập link Vercel hoặc tên miền của bạn.",
      };
    const localNetwork =
      /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host) ||
      host.endsWith(".local");
    return { url: url.href, error: "", localNetwork };
  } catch {
    return {
      url: "",
      error: "Đường dẫn chưa hợp lệ. Ví dụ: https://ten-du-an.vercel.app",
    };
  }
}

export function defaultShareUrl(
  currentHref,
  configuredUrl = "",
  savedUrl = "",
) {
  if (configuredUrl) return validateShareUrl(configuredUrl).url;
  try {
    const url = new URL(currentHref);
    url.search = "";
    url.hash = "/explore";
    const current = validateShareUrl(url.href);
    return current.url || validateShareUrl(savedUrl).url;
  } catch {
    return validateShareUrl(savedUrl).url;
  }
}
