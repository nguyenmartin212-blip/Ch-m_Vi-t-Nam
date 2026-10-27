# Animate UI trong Chạm Việt

Tích hợp ngày 25/10/2026. Dùng React 19, Animate UI 2.2.1, Motion 14 và Base UI. Giữ CSS/tông xanh lá–cam của dự án.

## Đã triển khai

- `src/components/ui/MotionButton.jsx`: dùng chung cho mọi nút React trong landing, địa cầu, khám phá, bộ sưu tập, gợi ý, bản đồ cũ, lịch trình, kể chuyện và thuyết minh. Phản hồi nhấn 0.97, tween 160 ms. Nút đồ thị dùng CSS `translate` để vị trí không xung đột với scale của Motion.
- `AnimatedDialog.jsx`: nền tảng chung cho chi tiết, kho chuyên sâu, planner, lịch trình đã lưu, kể theo chủ đề, xác nhận xóa (AlertDialog) và trình phát audio toàn màn hình. Hỗ trợ Escape, focus trap, trả focus, đóng sau animation và phân lớp dialog lồng nhau.
- `AnimatedSheet.jsx`: biến thể chi tiết trên nền tảng chung. Desktop ở giữa trang, mobile <=800px trượt từ dưới. Mở 220 ms, đóng 160 ms.
- Tab chi tiết dùng Animate UI Tabs với liên kết ARIA cho từng panel. Phím mũi tên chuyển focus, Enter/Space chọn tab.
- Bộ lọc và đổi tiền dùng Collapsible; chiều cao thay đổi tức thì, phần nội dung fade/translate nhẹ, không tween layout. Trang, thẻ địa điểm, lớp tri thức, từng bước planner và nội dung kể dùng MotionSwap. Landing dùng Fade theo viewport.
- Máy bay, mây và địa cầu chuyển cảnh dùng Motion transform/opacity thay cho keyframe thay đổi left/top. Thời lượng intro vẫn khoảng 2.7 giây, có nút bỏ qua.
- `AppMotionProvider.jsx` đồng bộ MotionConfig và AnimateUIProvider. Có tùy chọn **Giảm chuyển động trong ứng dụng** ở Hành trình/Về kho tri thức, lưu trên thiết bị. Tôn trọng thiết lập hệ điều hành; khi giảm chuyển động, intro đi nhanh, chữ thuyết minh hiện ngay và Leaflet không fly/zoom hoạt ảnh.
- Mobile có mục tiêu nhấn >=44px, input dialog 16px và biểu đồ 12 tháng chia hai hàng để form không cuộn ngang.
- React runtime được tách thành chunk riêng. Các chunk mới đều được service worker đưa vào precache theo plugin build hiện có.
- Thông báo bản quyền/giấy phép ở `public/animate-ui-license.txt`, được đưa vào bản build.

## Sử dụng khi bổ sung nút

```jsx
import MotionButton from './components/ui/MotionButton';

<MotionButton className="cv-primary" onClick={save}>Lưu lại</MotionButton>
```

AnimatedSheet nhận `title`, `onClose`, `children`. Khi đóng qua nút/Escape/click ngoài, component tự giữ animation rồi gọi `onClose`; component cha có thể unmount sau đó. Điều hướng Back hoặc đổi màn hình vẫn đóng theo route hiện có.

Áp dụng trên tất cả màn hình đang có. Select, input và textarea giữ hành vi native để phù hợp bàn phím/điện thoại. Leaflet tiếp tục quản lý việc vẽ map/tile; các nút React và chế độ giảm chuyển động được đồng bộ. Không thêm các hiệu ứng nền không phục vụ thao tác.

## Kiểm tra

- 12 unit test hiện có: đạt; build production và lint: đạt.
- Đã thử lưu địa điểm, đổi tab, Escape, trả focus về nút mở; Tab/Shift+Tab giữ focus trong sheet.
- Sheet chuyên sâu Huế mở đúng nội dung trên mobile 390px; không có lỗi console trong luồng kiểm tra dev.
- Đã phát hiện và sửa lỗi production do tách riêng nhóm Motion/Base UI gây phụ thuộc vòng. Cấu hình cuối chỉ tách React runtime, đã mở được trang production và chi tiết.
- PWA: cập nhật cache, tắt hẳn máy chủ preview, reload trang Hành trình, mở kho tri thức Huế từ module lazy. Dialog Animate UI và nội dung đều hiển thị; bằng chứng ở `screenshots/animate-ui-offline.png`.
- Kiểm thử bản mở rộng: landing → quốc gia → đổi tiền → máy bay → khám phá; bộ lọc; tab bằng mũi tên/Enter; planner ba bước → lưu → hủy/xác nhận xóa bản QA do agent tạo; thuyết minh phát/dừng/chuyển câu; dialog kể chủ đề lồng nhau và đóng về cha; bản đồ/vệ tinh.
- Đã bật **Giảm chuyển động**, reload và xác nhận tùy chọn vẫn bật. Đã trả về chế độ bình thường sau kiểm thử. Chưa thay đổi thiết lập hệ điều hành.
- Viewport 390px: dialog giữ focus, toàn trang không tràn ngang; thân planner có clientWidth = scrollWidth = 344px sau khi sửa biểu đồ tháng. Chưa xác nhận trên iPhone/Android thật.
- PWA bản toàn dự án: tải gói 6 audio, áp dụng bản cập nhật service worker, tắt máy chủ cổng 4176, reload ứng dụng. Planner vẫn mở/chuyển bước được; audio phát lại, tạm dừng và chuyển câu được từ cache. Ảnh `screenshots/animate-ui-global-offline.png`; ảnh planner mobile `screenshots/animate-ui-global-mobile.png`.

Tài liệu chính: https://animate-ui.com/docs
