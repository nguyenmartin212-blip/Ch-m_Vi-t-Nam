import test from "node:test";
import assert from "node:assert/strict";
import { defaultShareUrl, validateShareUrl } from "../src/lib/shareUrl.js";

test("QR rejects loopback, unsupported schemes and embedded credentials", () => {
  for (const url of [
    "http://127.0.0.1:4180",
    "http://localhost",
    "http://[::1]",
    "http://0.0.0.0",
    "javascript:alert(1)",
    "data:text/plain,hi",
    "https://user:pass@example.com",
    "not a url",
    "",
  ]) {
    assert.equal(validateShareUrl(url).url, "", url);
    assert.ok(validateShareUrl(url).error);
  }
});
test("QR preserves public destination and flags LAN links", () => {
  assert.equal(
    validateShareUrl(" https://cham-vietnam.vercel.app/#/explore ").url,
    "https://cham-vietnam.vercel.app/#/explore",
  );
  assert.equal(
    validateShareUrl("http://192.168.1.5:4173/#/explore").localNetwork,
    true,
  );
  assert.equal(
    validateShareUrl("https://cham-vietnam.vercel.app").localNetwork,
    false,
  );
  assert.ok(validateShareUrl("https://example.com/" + "a".repeat(1200)).error);
});
test("configured production URL overrides localhost and preview domains", () => {
  const production = "https://cham-vietnam.vercel.app/#/explore";
  assert.equal(
    defaultShareUrl("http://127.0.0.1:4180/#/saved", production),
    production,
  );
  assert.equal(
    defaultShareUrl("https://branch-preview.vercel.app/#/saved", production),
    production,
  );
  assert.equal(
    defaultShareUrl("https://example.com/sub/?token=private#/saved?entity=hue"),
    "https://example.com/sub/#/explore",
  );
  assert.equal(
    defaultShareUrl("http://localhost:4180", "", production),
    production,
  );
  assert.equal(defaultShareUrl("http://localhost:4180"), "");
});
