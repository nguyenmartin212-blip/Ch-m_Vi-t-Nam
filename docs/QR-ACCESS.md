# Mở Chạm Việt bằng mã QR

Ngày triển khai: 27/10/2026.

## Sử dụng

- Nút **Mã QR** có ở header ứng dụng và thanh điều hướng landing.
- Người xem mở camera điện thoại, quét mã và chạm vào link để mở website. Đây là đường vào ứng dụng, không phải đăng ký tài khoản hoặc tham gia một nhóm.
- **Tải ảnh QR** xuất PNG 1200px để đưa vào slide, poster hoặc in. **Sao chép link** sao chép đúng địa chỉ đã mã hóa.
- Link mặc định: `https://cham-vietnam.vercel.app/#/explore`.
- Có thể đổi link trong hộp QR; đường dẫn được ghi nhớ trên thiết bị qua `cham-viet.share-url`. Biến build `VITE_PUBLIC_APP_URL` nếu có sẽ được ưu tiên.
- File QR cố định cho link trên nằm ở `public/cham-viet-qr.png`; sau deploy truy cập `/cham-viet-qr.png`. Nếu đổi tên miền, cần tạo lại file cố định này; mã trong hộp thoại được tạo theo link đang chọn.

## Cách hoạt động

Tạo QR tại trình duyệt bằng thư viện MIT `qrcode`; không gọi dịch vụ QR bên ngoài. Mã có quiet zone 4 module, error correction M, nền trắng và module xanh rất đậm, không chèn logo lên các module. Không dùng localhost/127.0.0.1 làm QR truy cập từ điện thoại. Link LAN hợp lệ hiển thị thông báo cần cùng Wi-Fi; URL không hợp lệ, giao thức khác HTTP(S) hoặc kèm credentials bị từ chối.

Các file JS/CSS của tính năng nằm trong bundle được service worker precache. Việc điện thoại lần đầu mở website vẫn cần kết nối Internet.

## Kiểm tra

- 15 unit tests đạt, bao gồm URL Vercel, preview/local, loại bỏ query riêng tư khi suy ra link mặc định, URL sai, loopback và LAN.
- Production build và ESLint đạt.
- Kiểm tra Edge tự động: QR chứa link Vercel chính xác, sao chép clipboard, tải PNG, từ chối localhost, đổi link, Escape đóng dialog, nút ở landing; không có pageerror.
- Kiểm tra hiển thị ở 360/390/768/1024/1440px; không tràn ngang toàn trang.
- Chưa xác nhận bằng camera điện thoại thật; BarcodeDetector không có trong trình duyệt kiểm thử.

Đây là bổ sung tính năng sau PRD snapshot ngày 25/10 và đợt thiết kế lại ngày 27/10.

## Đưa lên Vercel

Commit/push thay đổi lên nhánh Vercel đang theo dõi, đợi deployment hoàn tất rồi mở website và dùng nút Mã QR. Với PWA đã cài, nếu còn bản cũ hãy dùng nút cập nhật khi xuất hiện hoặc mở lại sau khi service worker mới kích hoạt.
