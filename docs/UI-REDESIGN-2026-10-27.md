# Thiết kế lại Chạm Việt theo mẫu PDF

Ngày: 27/10/2026. Nguồn tham chiếu: `C:\Users\dangt\Downloads\bản gao diện tham khảo.pdf`, 49 trang xuất từ Figma.

## Hướng thiết kế

Product UI cho người khám phá du lịch trên desktop và điện thoại, thường dùng dưới ánh sáng ban ngày. Nền sáng ấm, chữ xanh lá đậm, cam dành cho hành động chính, ảnh điểm đến làm trọng tâm. Dùng Be Vietnam Pro hiện có, bỏ chữ serif/italic mặc định trên các màn chính, góc bo nhỏ, ít bóng, không thêm số liệu/đánh giá giả.

Các trang PDF 1–7, 20–21, 29, 32–39 và 48 làm tham chiếu cho khám phá, bản đồ, chi tiết, kết nối, bộ sưu tập, gợi ý, hành trình, audio và PWA. Các trang tài khoản, admin, QR, thông báo, đánh giá cộng đồng chỉ là tham chiếu cho tương lai; chưa triển khai nghiệp vụ mới.

## Thay đổi

- Điều hướng desktop chuyển từ sidebar sang header ngang. Thêm mục Bản đồ (`/#/map`), giữ riêng Kết nối (`/#/graph`). Mobile có 6 mục điều hướng với icon SVG cùng nét.
- Khám phá dùng hero Hạ Long, hai CTA hoạt động, tìm kiếm, bộ lọc, loại tri thức, địa điểm và danh sách ảnh. Ban đầu hiện 4 mục để tạo một hàng desktop; tải thêm vẫn thêm 6, các thao tác lọc giữ cơ chế phân trang hiện có.
- Bản đồ có danh sách bên trái và bản đồ bên phải trên desktop, xếp dọc trên mobile. 11 điểm tổng quan vẫn độc lập với bộ lọc như trước.
- Gợi ý dùng khối sở thích và thông số bên trái, kết quả bên phải. Không thay công thức xếp hạng.
- Áp dụng màu/chữ/control dùng chung cho bộ sưu tập, công cụ hành trình, chi tiết, tri thức, planner, lịch trình đã lưu, audio, about và landing.
- Landing vẫn đi qua chọn quốc gia và hiệu ứng máy bay. Các chức năng đổi tiền và giảm chuyển động giữ nguyên.
- Ảnh từ PDF được tách thành WebP trong `public/images/reference/`, có precache trong service worker. Ảnh Wikipedia ở các nội dung khác vẫn dùng loader, attribution và fallback hiện có.

## Nguồn ảnh

Các file `p1-*` lấy từ trang 1; `p5-*` lấy từ trang 5 của PDF người dùng cung cấp. `p1-0`: Tràng An; `p1-1`: Hội An; `p1-2`: Đà Lạt; `p1-3`: Huế; `p1-4`: Hạ Long; `p5-4`: Phú Quốc. Đây là provenance của tài sản tham khảo, không phải xác nhận giấy phép của tác giả ảnh gốc. Không thêm đánh giá 4.9 hoặc số người dùng minh họa từ thiết kế vào dữ liệu sản phẩm.

## Đối chiếu chức năng

| Nhóm PRD | Xử lý trong lần redesign |
|---|---|
| INTRO, COUNTRY, FX | Giữ luồng và handler, đồng bộ hình ảnh landing |
| NAV | Header/bottom nav mới; giữ route cũ, thêm route map |
| EXPLORE, MAP | Giữ search/filter/sort/load more/marker/zoom |
| DETAIL, GRAPH | Giữ tabs, sources, related entities, đổi tâm và CTA |
| COLLECTION, RECOMMEND | Giữ dữ liệu local và thuật toán gợi ý |
| KNOWLEDGE, STORY, AUDIO | Giữ 6 lớp, 4 ngôn ngữ, chủ đề, audio/TTS/text và controls |
| PLAN, TRIP | Giữ ba bước, sửa/sao chép/xóa, ghi chú/đánh giá |
| LEGACY | Giữ đường vào bản đồ địa lý/vệ tinh và công cụ cũ |
| PWA, MOTION, STATE | Giữ install/update/audio download/reduced motion và keys; thêm cache ảnh mẫu |

Không thay entity ID, dữ liệu 89 thực thể/105 quan hệ, POI, schema lịch trình hoặc localStorage keys. Bộ PRD ngày 25/10 là snapshot cũ; thay đổi NAV và số mục ban đầu nêu trên là phần bổ sung cho snapshot đó.

## Kiểm thử

- 12 unit tests về dữ liệu, tìm kiếm, filter, quan hệ, planner, byte range và manifest đạt.
- Production build và ESLint đạt.
- Edge/Chromium desktop 1440px và mobile 390px: các trang explore/map/graph/saved/suggest/tools/about mở được, không có pageerror và không tràn ngang toàn trang.
- Kiểm tra thêm explore ở 360, 768 và 1024px.
- Luồng save collection → saved → reload giữ dữ liệu; search rỗng/clear; detail tabs; 11 marker; đổi graph center; thay sở thích; mở kho tri thức; audio mở/đóng; planner 3 bước → lưu → xem lịch trình.
- Chuyển trình duyệt offline rồi reload: app và ảnh hero local vẫn tải được từ service worker.
- Kiểm tra landing → chọn quốc gia. Ảnh chụp và kết quả tự động nằm trong `C:\Chạm_ViệtNam\design-review-20261027`.

Phạm vi xác nhận là các kiểm tra trên, chưa phải chứng nhận mọi tổ hợp 122 FR hoặc kiểm thử trên iPhone/Safari thật. Các hạn chế đã ghi trong BRD (đồng bộ local giữa component, tài khoản/backend chưa có, ảnh ngoài cần mạng) vẫn áp dụng.
