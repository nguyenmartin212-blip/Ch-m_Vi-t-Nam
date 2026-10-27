# Mẫu prompt chỉnh UI Chạm Việt, bảo toàn tính năng

## Cách dùng

Đính kèm **file gộp PRD/BRD** hoặc hai file riêng, kèm source/ảnh hiện tại. Nếu AI có thể đọc file, đính kèm thêm `FEATURE-INVENTORY-CHAM-VIET.json`. Điền các dấu ngoặc vuông bên dưới. Mã FR giúp nghiệm thu; ảnh chỉ là tham chiếu hình thức.

Nếu chỉ sửa một phần, liệt kê screen ID/phạm vi cụ thể. Component dùng chung có thể tác động màn hình khác nên vẫn phải kiểm tra nơi sử dụng của nó. Đối với công cụ chỉ dựng hình, dùng phần A; với coding agent, dùng cả A+B.

## A. Prompt thiết kế / dựng mockup

```text
Bạn đang thiết kế lại UI cho Chạm Việt, ứng dụng khám phá tri thức du lịch Việt Nam.

Đọc tài liệu BRD + PRD được đính kèm trước khi thiết kế. Dùng ID FR trong inventory làm danh sách bảo toàn. Chỉ coi các tính năng được ghi implemented là hiện có; GAP/ngoài phạm vi không được biến thành tính năng đã triển khai.

PHẠM VI CHỈNH SỬA
- Màn hình: [điền S01...S19 hoặc tên/route cụ thể; ví dụ S04/S10 và các component dùng chung liên quan].
- Phong cách mong muốn: [điền tham chiếu, sắc thái, mức thay đổi layout].
- Thiết bị: desktop và mobile; dùng 390px làm một mẫu mobile và rà thêm 360/768px.
- Màu chủ đạo: xanh lá và cam; giữ tương phản, khả năng đọc và nhận diện Chạm Việt.
- Intro chọn quốc gia/máy bay: [giữ hiện tại / cho phép thiết kế lại hình thức nhưng giữ luồng].

NHỮNG GÌ PHẢI GIỮ
1. Mọi tính năng FR liên quan phải có vị trí và hành vi ở UI mới. Được tổ chức lại, không được bỏ vì ít dùng hoặc nằm trong modal/công cụ cũ.
2. Phân biệt 8 nhóm của 89 thực thể với 6 lớp của 3 điểm chuyên sâu, và bộ POI riêng của planner. Không gộp chúng thành một danh sách.
3. Giữ tất cả input, quick filters, reset, sort, tải thêm, save/unsave, quan hệ/nguồn/Maps và các lối sang công cụ khi thuộc phạm vi.
4. Nếu có planner/player: giữ đủ các bước, chỉnh từng mục/ngày, lưu/sửa/nhân bản/xóa/notes/rating, mode/ngôn ngữ/media controls/fallback. Không làm một bản demo chỉ có nút Tiếp hoặc Play.
5. Thiết kế cả default, selected, disabled, loading, empty, error/fallback, offline/update, dialog cha/con và reduced-motion khi áp dụng. Không chỉ thiết kế happy path.
6. Cùng nghiệp vụ phải tới được trên mobile. Nếu chuyển vào menu/sheet, chỉ rõ nhãn và đường vào; không ẩn vĩnh viễn.
7. Dữ liệu mẫu phải vẫn có chú thích. Không thêm login, booking, GPS/QR, AI backend, dịch toàn bộ hoặc đồng bộ cloud giả.
8. Không dùng ảnh/mockup thay cho control thật. Phân biệt minh họa tĩnh trong landing và chức năng thực.

ĐẦU RA BẮT BUỘC
- Sơ đồ màn hình và các tương tác nối giữa chúng.
- Bản desktop + mobile và các trạng thái không-happy-path thuộc phạm vi.
- Ma trận: FR ID | vị trí cũ | vị trí mới desktop | vị trí mới mobile | giữ/đổi trình bày/ngoài phạm vi | ghi chú.
- Danh sách mọi chức năng đề xuất gộp/bỏ/đổi logic, tách riêng thành CR. Nếu chưa được cho phép thì vẫn giữ tính năng gốc.
- Danh sách trạng thái chưa dựng hoặc GAP cần quyết định, không tự đánh dấu hoàn tất.

Nếu một quyết định hình thức đòi thay đổi nghiệp vụ, nêu rõ tác động trước khi coi nó là yêu cầu sản phẩm.
```

## B. Bổ sung cho coding agent

```text
TRIỂN KHAI
- Đọc source hiện tại, PRD, BRD và inventory; đối chiếu các file/module bị ảnh hưởng, không dựng lại từ ảnh rồi bỏ logic cũ.
- Giữ ID thực thể/POI, schema itinerary, handlers và key persist. Không localStorage.clear(), không đổi key để giải quyết giao diện. Nếu thay schema, đề xuất migration riêng.
- Giữ hash routing/Back, modal state, focus, audio lifecycle, lazy-loading và PWA. Tính năng ở bản đồ cũ vẫn phải có đường vào.
- Dùng nền tảng Animate UI/Motion hiện có: MotionButton, AnimatedDialog/Sheet, MotionContent và AppMotionProvider; có thể refactor nhưng phải giữ contract. Không chạy codemod hay chuyển stack hàng loạt khi chưa cần.
- Mỗi control phải tương tác thật với state/logic. Text, icon và màu sắc không thay cho hành vi.
- Không sửa thuật toán filter, gợi ý, planner, engine phát hay dữ liệu chỉ vì muốn bố cục đẹp hơn, trừ CR đã được chấp thuận.
- Chú ý GAP: hai key bộ sưu tập, state nhiều instance, giới hạn ngôn ngữ/phạm vi chuyên sâu, thiếu draft/feedback storage, graph center không có history riêng.

KIỂM TRA VÀ BÀN GIAO
- Chạy npm run check và npm run lint; thử production, không chỉ dev.
- Kiểm tra J-01...J-07 và các FR trong phạm vi; nếu sửa component dùng chung, rà các luồng khác dùng nó.
- Kiểm tra keyboard, dialog lồng nhau, mobile 360/390/768px, reduced-motion và reload persist.
- Kiểm tra cache/update/lazy/audio khi máy chủ không phản hồi sau khi đã cache/tải gói. Không tự nhận ảnh/tile/nguồn ngoài offline nếu chưa có.
- Chỉ tạo/sửa/xóa dữ liệu QA của phiên kiểm thử; giữ dữ liệu người dùng có sẵn.
- Trả kết quả gồm file thay đổi, ảnh desktop/mobile, ma trận FR đã đối chiếu, các lệnh/test thực sự đã chạy và phần chưa kiểm tra.
- Không kết luận “giữ đủ tính năng” nếu ma trận còn FR chưa ánh xạ hoặc chỉ có screenshot mà chưa kiểm tra tương tác.
```

## C. Mẫu yêu cầu ngắn khi đã đính kèm tài liệu

```text
Thiết kế lại [màn hình/phạm vi] của Chạm Việt theo phong cách [mô tả].
Giữ xanh lá–cam và tối ưu mobile. Dùng BRD/PRD đính kèm làm nguồn nghiệp vụ.
Đừng bỏ bất kỳ FR liên quan nào; trả ma trận FR cũ→mới cho desktop/mobile,
cả loading/empty/error/offline/disabled/reduced-motion khi áp dụng.
Các thay đổi chức năng/schema/persist phải tách CR; không giả tính năng chưa có.
[Nếu làm code: triển khai tương tác thật, chạy check/lint và kiểm thử theo checklist PRD.]
```

## D. Điều kiện phát hiện bản UI bị thiếu tính năng

- Không tìm được nơi mới của một mã FR, dù giao diện trông đẹp.
- Chỉ có 6 card rồi không có tải thêm, hoặc graph mất các quan hệ ít được nhìn thấy.
- Không phân biệt rỗng do chưa lưu với rỗng do filter.
- Player chỉ có Play; planner chỉ có bước chọn nơi, mất chỉnh ngày/POI hoặc lifecycle itinerary.
- Không còn map cũ/search chuyên sâu, hoặc gộp nhầm 8 nhóm và 6 lớp.
- Không có đường tới chức năng trên mobile, không có bàn phím hoặc không đóng được dialog con.
- Có nút AI/GPS/login/cloud nhưng không có nghiệp vụ/triển khai tương ứng.
- Preview dev chạy nhưng production, chunk hoặc cache PWA lỗi.
- Mất dữ liệu cũ, đổi ID/key, hoặc xóa storage như một phần của việc “làm mới giao diện”.
