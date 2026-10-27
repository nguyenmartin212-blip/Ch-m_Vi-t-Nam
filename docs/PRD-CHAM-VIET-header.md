# PRD — Chạm Việt

**Product Requirements Document · Phiên bản tài liệu 1.0 · Snapshot 25/10/2026**

## 1. Mục tiêu tài liệu và hợp đồng bảo toàn

Tài liệu mô tả sản phẩm **đang có trong mã nguồn**, để tạo prompt chỉnh UI mà không mất nghiệp vụ. Danh mục gồm **{{FEATURE_COUNT}} yêu cầu chức năng trong {{MODULE_COUNT}} nhóm**, mỗi yêu cầu có ID ổn định, hành vi, trạng thái và tiêu chí nghiệm thu.

**MUST khi chỉ chỉnh UI:** giữ mọi FR có liên quan; không xóa control, route, dữ liệu, trạng thái, handler hoặc lối vào công cụ. Được thay layout, typography, component composition và cách tổ chức thông tin, nhưng phải chỉ ra nơi mới của tính năng trên cả desktop/mobile.

Mã FR là hợp đồng truy vết, không phải tên component bắt buộc. Không cần giữ nguyên class CSS, tên file hoặc cây DOM nếu thiết kế mới có cách tốt hơn và vượt qua nghiệm thu. ID dữ liệu/key lưu trữ không được thay như đổi nhãn UI.

**Phân biệt chứng cứ:** `implemented-source-reviewed` trong inventory nghĩa là đã thấy hành vi trong mã nguồn, không chứng nhận mọi tổ hợp đã chạy trên mọi thiết bị. Báo cáo kiểm thử trước đây nằm trong `TEST-REPORT.md`, `ANIMATE-UI.md`; việc lập PRD này không phải một đợt chạy lại toàn bộ test.

Đọc cùng BRD để biết mục tiêu, ngoài phạm vi và GAP. Khi có khác biệt giữa tài liệu và source mới hơn, báo rõ khác biệt trước khi áp dụng thay đổi; không âm thầm chọn cách có ít tính năng hơn.

## 2. Bản đồ thông tin và màn hình

| ID màn hình | Tên / lối vào | Nội dung và đường đi cần giữ |
|---|---|---|
| S01 | Landing `/` khi chưa có hash | Hero, giới thiệu, 6 lớp, minh họa hành trình, các CTA |
| S02 | Chọn quốc gia, state nội bộ | Địa cầu, tìm/chọn quốc gia, trạng thái sắp ra mắt, đổi tiền, quay lại |
| S03 | Chuyển cảnh, state nội bộ | Máy bay/mây/địa cầu, bỏ qua, tự vào Khám phá |
| S04 | `/#/explore` | Search/filter/category, 11 điểm tổng quan, card/list, sort/tải thêm |
| S05 | `/#/graph` | Chọn tâm trong 89 mục, nút/quan hệ/list, reset, chi tiết |
| S06 | `/#/about` | Hướng dẫn, phạm vi dữ liệu, intro/địa cầu, công cụ PWA/motion |
| S07 | `/#/saved` | Bộ sưu tập chính, số đếm, tìm/filter/sort và empty state |
| S08 | `/#/suggest` | Sở thích/tháng/ngân sách, 4 gợi ý có lý do |
| S09 | `/#/tools` | 3 điểm chuyên sâu, audio/planner, lịch trình đã lưu, lối vào map cũ, PWA |
| S10 | `?entity=ID` trên route chính | Dialog/sheet chi tiết 3 tab, nguồn, Maps, quan hệ và CTA tùy dữ liệu |
| S11 | Kho chuyên sâu, state tool | Tổng quan, 6 lớp/tất cả, 4 ngôn ngữ, nguồn, planner/story |
| S12 | Kể theo chủ đề, dialog con | 4 mode, tạo lại, local/API tùy chọn, nghe/dừng TTS |
| S13 | Player, state tool | Ảnh/caption/chương, mode/ngôn ngữ, phát/dừng/tua/âm/tốc độ, kết thúc |
| S14 | Planner, state tool | 3 bước, tháng/ngày/nhóm/sở thích/POI, chỉnh ngày, lưu |
| S15 | Quản lý lịch trình, state tool | List/read view, sửa/nhân bản/notes/rating/xóa/tạo mới |
| S16 | Bản đồ cũ, state legacy | Leaflet/vệ tinh, search đa ngôn ngữ chuyên sâu, 3 điểm, favorite cũ, mọi công cụ |
| S17 | Block PWA/motion trong S06/S09 | Install/hướng dẫn, tải 6 MP3, cập nhật, giảm chuyển động |
| S18 | Xác nhận xóa từ S15 | AlertDialog lồng, Hủy/Xóa, focus và đúng ID |
| S19 | `/qa.html`, dành cho phát triển | Iframe chọn viewport 360/390/768/1280 và kiểm tra tràn ngang; không phải mục menu khách du lịch |

S02/S03/S11–S18 không có route độc lập riêng. Không tự tạo URL giả rồi tuyên bố deep link đã hoạt động. Manifest mở ứng dụng cài đặt vào `/#/explore`, vì vậy lần mở PWA cài đặt có thể bỏ intro theo thiết kế hiện tại.

### 2.1. Luồng quan trọng

```text
S01 → S02 (+ đổi tiền) → S03 → S04
S04 / S07 / S08 / S05 → S10 → thực thể liên quan / nguồn / Maps
S10 (3 điểm hỗ trợ) hoặc S09 → S11 → S12 / S13 / S14
S14 bước 1 → bước 2 → bước 3 → lưu → S15
S15 → sửa / nhân bản → S14; S15 → S18 → hủy hoặc xóa
S09 → S16 → các công cụ chuyên sâu → trở về shell chính
S06 / S09 → S17 → install / tải audio / update / giảm motion
```

### 2.2. Chỉ mục module

| Nhóm | Phạm vi | Số FR | BRD |
|---|---|---:|---|
{{MODULE_INDEX}}

## 3. Snapshot dữ liệu cần đối chiếu

| Nhóm khám phá | Số mục |
|---|---:|
| Điểm đến | 10 |
| Di sản | 4 |
| Thiên nhiên | 5 |
| Ăn uống | 35 |
| Vui chơi | 24 |
| Làng nghề | 3 |
| Văn hóa | 3 |
| Trải nghiệm | 5 |
| Tổng | 89 |

- Quan hệ: 105, tương ứng 210 mục kề; không đếm 210 thành 210 quan hệ khác nhau.
- Map tổng quan: 11 điểm, gồm cả Tràng An là Thiên nhiên.
- 47 mục có Maps; 8 mục không có URL nguồn.
- 3 điểm chuyên sâu, mỗi nơi 12 entry/6 lớp; tổng 36 entry. Planner có 9/9/10 POI ở Hà Nội/Huế/TP.HCM, tổng 28.
- Kho 89 thực thể, 36 entry và 28 POI là ba tập dữ liệu có mục đích khác nhau; không được gộp theo tên hiển thị để bỏ bản ghi.
- Sáu lớp: Lịch sử hình thành, Di sản, Văn hóa, Ẩm thực, Du lịch, Câu chuyện đặc trưng.
- 11 loại POI khám phá: Dạo phố & ngoài trời; Biểu diễn & nghệ thuật; Khu vui chơi; Cà phê & đồ uống; Quán ăn & nhà hàng; Tham quan văn hóa; Phố ăn uống; Biển & thư giãn; Chợ ẩm thực; Làng quê & cộng đồng; Làng nghề ẩm thực.
- Sáu MP3: `ha-noi`, `hue`, `tp-hcm` × `short/full`, tất cả `vi`.

Danh sách ID/tên và hash file nguồn được lưu trong `FEATURE-INVENTORY-CHAM-VIET.json`. Khi dữ liệu tăng, cập nhật snapshot có chủ đích; UI phải lấy số lượng từ dữ liệu, không hardcode bộ đếm.
