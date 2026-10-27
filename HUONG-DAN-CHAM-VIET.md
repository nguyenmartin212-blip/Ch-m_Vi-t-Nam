# Chạm Việt — dự án mới

React + Vite + PWA: intro/tính năng Bản đồ tri thức + luồng website tham chiếu + bố cục mobile tham khảo Explanatory.

## Chạy

Node.js 22.12+ hoặc LTS mới tương thích Vite 8.

```sh
npm ci
npm run dev
```

Production và PWA:

```sh
npm run check
npm run lint
npm run preview
```

Mở URL Vite in ra, preview mặc định `http://127.0.0.1:4173/`. Không mở HTML bằng `file://`. Service worker chỉ đăng ký ở production, trên localhost hoặc HTTPS.

## Các màn hình

| Route | Chức năng |
|---|---|
| `/` | Landing cũ → quốc gia → máy bay → giao diện mới |
| `/#/explore` | 89 mục, tìm không dấu, 8 nhóm, vùng/nguồn/mùa/điểm đến/loại, map/list/sort/tải thêm |
| `/#/graph` | 105 quan hệ, đổi tâm và mở chi tiết; mobile cuộn sơ đồ, danh sách đầy đủ bên dưới |
| `/#/saved` | Bộ sưu tập trên thiết bị |
| `/#/suggest` | Gợi ý sở thích/tháng/ngân sách với giải thích |
| `/#/tools` | 6 lớp/4 ngôn ngữ/kể chuyện/lịch trình cho Hà Nội, Huế, TP.HCM; bản đồ địa lý/vệ tinh |
| `/#/about` | Hướng dẫn, nguồn, xem lại intro, đổi tiền và PWA |
| `/qa.html` | Khung kiểm thử responsive 360/390/768/1280 px |

## PWA

Animate UI đã áp dụng trên các màn hình và công cụ; xem `docs/ANIMATE-UI.md`. Muốn giảm hiệu ứng, vào Hành trình hoặc Về kho tri thức, bật **Giảm chuyển động trong ứng dụng**. Tùy chọn này lưu riêng trên từng thiết bị.

Manifest, icon 192/512 maskable, standalone, safe-area, tab dưới, dialog khóa cuộn/focus, reduced motion. Cache ứng dụng, module lazy, dữ liệu bản đồ và manifest audio sau lần mở đầu có mạng. Nút **Tải 6 bản thuyết minh** cache MP3 riêng, hỗ trợ byte-range để tua offline.

Ảnh/font mạng, vệ tinh và tỷ giá trực tuyến cần mạng; có nền/chữ dự phòng. Không tải sẵn toàn bộ tile. Phiên bản mới chờ nút **Cập nhật phiên bản mới** trong Hành trình/Về kho tri thức, tránh tự ngắt audio.

iPhone: Safari → Chia sẻ → Thêm vào Màn hình chính. Android: menu trình duyệt → Cài đặt ứng dụng. Cần xác nhận thêm trên thiết bị thật trước phát hành rộng rãi.

## Phạm vi và nguồn

89 mục/105 quan hệ tái dựng từ giao diện website `ban-do-tri-thuc-viet.huynv1990.chatgpt.site`; không có quyền truy cập mã nguồn riêng. Đây là triển khai mới của giao diện/luồng, không sao chép thuật toán nội bộ. Mùa đi, ngân sách và gợi ý là dữ liệu mẫu, chưa xác minh thực địa.

`src/data/explore.json`: dữ liệu chuẩn hóa. `reference/site-observations.json`: đầu vào. `node scripts/import-reference.mjs`: tạo lại dữ liệu. Nội dung chuyên sâu và audio gốc ở `src/data/content.js`, `public/audio/`.

Kho chuyên sâu Việt/Anh/Trung/Hàn tại ba điểm đến gốc; 89 mục và giao diện chính là tiếng Việt. Không tạo giả nội dung chuyên sâu cho các mục còn lại. 47 mục có URL Maps/địa chỉ tham khảo.

Explanatory được dùng tham khảo bố cục mobile, màu nền sáng và thao tác một tay. Không nhúng Expo, QR/geofence native hay màn hình placeholder. Không có backend đăng nhập/đồng bộ. Lịch trình, ghi chú, đánh giá, bộ sưu tập lưu trên thiết bị, mất khi xóa dữ liệu trình duyệt. Việt Nam hoạt động; quốc gia khác giữ “sắp ra mắt”.

Ảnh Wikipedia có link nguồn; ảnh điểm đến có thể minh họa địa điểm con. Kể theo chủ đề mặc định ghép từ nội dung tại máy, không gọi AI bên ngoài. Có thể cấu hình `VITE_STORYTELLER_API` tới backend riêng theo tài liệu gốc; không đặt khóa bí mật trong biến Vite client.

## Triển khai

`npm run build` → upload toàn bộ `dist/` lên static hosting HTTPS tại gốc `/`. Dùng `Cache-Control: no-cache` cho index/sw/manifest; assets có hash cache dài hạn. Hash routing không cần rewrite. Muốn host dưới subdirectory phải sửa đường dẫn tuyệt đối và scope.

Các tài liệu tên cũ chỉ làm tham khảo nguồn. Hướng dẫn này là điểm bắt đầu. Xem `docs/FEATURE-MAP.md`, `docs/TEST-REPORT.md`. Các script finish-setup/integrate-tools/refine/polish là script lắp ghép một lần, không chạy lại.
