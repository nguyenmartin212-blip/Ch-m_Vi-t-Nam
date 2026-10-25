# Kết quả kiểm thử — 24/10/2026

## Tự động

- `npm test`: 12/12 test đạt.
- `npm run build`: đạt, Vite 8.3.5.
- `npm run lint`: đạt, không lỗi/cảnh báo sau sửa các dependency của hook.
- `npm audit`: 0 vulnerabilities sau cập nhật bản vá tương thích (Vite và Zod).
- Kiểm tra toàn bộ 89 ID duy nhất, 210 cạnh kề tương ứng 105 quan hệ hai chiều, không tham chiếu hỏng; 11 điểm trên bản đồ; 47 Maps URLs; 8 mục biên tập không nguồn.
- Tìm kiếm không dấu, lọc kết hợp/vùng/loại/bộ sưu tập, empty query, deep link và route cũ.
- Gợi ý duy nhất và có lý do cho đủ 12 tháng.
- Sáu lớp nội dung và bốn ngôn ngữ của ba điểm đến gốc còn nguyên.
- Planner: tất cả ba điểm đến × 1–7 ngày × nhóm 1/2/6/10/30 người; không mất/nhân đôi POI, lịch theo thứ tự thời gian; move/reorder/remove không sửa input.
- Byte-range audio: range đầu/cuối/mở/suffix, range lỗi và ngoài giới hạn; manifest và sáu MP3 tồn tại.

## Trình duyệt — đã thao tác thực tế

| Luồng | Kết quả |
|---|---|
| Landing → địa cầu → đổi tiền → máy bay → khám phá | Đạt |
| Chi tiết Hội An, lưu mục, 15 kết nối, nguồn UNESCO/Vietnam Tourism | Đạt |
| Browser Back từ chi tiết về trang khám phá | Đạt, không rời ứng dụng |
| Bộ sưu tập sau tải lại | Mục đã lưu vẫn còn |
| Kho chuyên sâu Huế: sáu lớp và nút thuyết minh/planner | Mở đúng nội dung |
| Thuyết minh Huế | Phát file có sẵn; tạm dừng/đổi câu đã thử |
| Planner: tháng 3, ẩm thực, 3 ngày, 2 người | Sinh 6 POI trong 3 ngày |
| Lưu tên “QA · Huế 3 ngày” và ghi chú | Đạt; sau tải lại còn đúng tên/ghi chú |
| Mở lịch trình đã lưu, đánh giá và vào chỉnh sửa | Thao tác được |
| Khung responsive 390 và 360 px | Không tràn ngang toàn trang (viewport nội dung 375/345 px do scrollbar desktop) |
| Kết nối ở khung 360 px | Đủ 15 kết nối; đã sửa chồng nhãn bằng vùng sơ đồ cuộn ngang |
| Tải audio ngoại tuyến | Báo đã lưu 6 bản thuyết minh |
| Tắt máy chủ preview, xác minh HTTP không kết nối được, reload app | Ứng dụng và số lịch trình vẫn mở được từ cache |
| Phát audio khi máy chủ tắt | Hiện “Đang phát file thuyết minh có sẵn”, tạm dừng/đổi câu được, không lỗi runtime trong log kiểm tra |

Bằng chứng audio ngoại tuyến: `screenshots/offline-audio.png`, `offline-audio-evidence.txt`.

## Các lỗi đã sửa khi tích hợp

- Chuẩn hóa chữ Đ và ID TP.HCM để đủ 11 điểm bản đồ.
- Nối lại callback mở thuyết minh.
- Browser Back dùng lịch sử điều hướng đúng.
- SVG map không che các nút khỏi cây accessibility; thông tin bản đồ nằm ngoài vùng marker.
- Dialog planner/chi tiết và trình phát giữ focus, khóa cuộn nền.
- Bổ sung địa chỉ, loại địa điểm, quick filter cà phê/chợ và tháng tham khảo.
- Đồ thị mobile không ép 15 nhãn vào một vòng quá nhỏ.
- Đọc localStorage sai kiểu có fallback; cập nhật các hook kể chuyện khi đổi ngôn ngữ.

## Phạm vi chưa xác nhận

Không khẳng định đã thử mọi tổ hợp trên tất cả trình duyệt. Chưa thử cài lên iPhone/Android thật, Safari audio policy, bàn phím ảo, GPS/QR native, mọi URL bên ngoài, hay toàn bộ thao tác xóa/nhân bản qua UI. Logic planner move/reorder/remove đã có unit test. Khung mobile là iframe responsive, không phải thiết bị thật.

Nội dung mới và thuật toán gợi ý là bản tái dựng từ quan sát website. Nguồn, giá, giờ mở cửa, mùa đi chưa xác minh thực địa. Bộ sưu tập/lịch trình là local, không có đồng bộ tài khoản. Dữ liệu QA chỉ lưu trong profile trình duyệt kiểm thử, không nằm trong dữ liệu khởi tạo của dự án.
