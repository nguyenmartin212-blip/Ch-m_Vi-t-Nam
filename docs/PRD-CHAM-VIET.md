# PRD — Chạm Việt

**Product Requirements Document · Phiên bản tài liệu 1.0 · Snapshot 25/10/2026**

## 1. Mục tiêu tài liệu và hợp đồng bảo toàn

Tài liệu mô tả sản phẩm **đang có trong mã nguồn**, để tạo prompt chỉnh UI mà không mất nghiệp vụ. Danh mục gồm **122 yêu cầu chức năng trong 19 nhóm**, mỗi yêu cầu có ID ổn định, hành vi, trạng thái và tiêu chí nghiệm thu.

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
| INTRO | Landing và mở sản phẩm | 5 | BR-01 |
| COUNTRY | Địa cầu và chọn quốc gia | 5 | BR-01 |
| FX | Đổi tiền tham khảo | 5 | BR-01 |
| NAV | Shell và điều hướng | 7 | BR-08 |
| EXPLORE | Tìm kiếm và danh sách khám phá | 13 | BR-02 |
| MAP | Bản đồ tổng quan SVG | 4 | BR-02 |
| DETAIL | Chi tiết thực thể | 8 | BR-03 |
| GRAPH | Bản đồ kết nối | 5 | BR-03 |
| COLLECTION | Bộ sưu tập | 4 | BR-04 |
| RECOMMEND | Gợi ý cá nhân | 5 | BR-04 |
| KNOWLEDGE | Kho chuyên sâu sáu lớp | 6 | BR-06 |
| STORY | Kể chuyện theo chủ đề | 4 | BR-06 |
| AUDIO | Trình phát thuyết minh | 10 | BR-06 |
| PLAN | Lập lịch trình ba bước | 12 | BR-05 |
| TRIP | Quản lý lịch trình đã lưu | 6 | BR-05 |
| LEGACY | Bản đồ địa lý và công cụ cũ | 5 | BR-08 |
| PWA | Cài đặt và ngoại tuyến | 7 | BR-07 |
| MOTION | Hệ motion, responsive và accessibility | 6 | BR-09 |
| STATE | Dữ liệu, phản hồi và giới hạn | 5 | BR-10 |

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

## 4. Danh mục chức năng có mã truy vết

### INTRO. Landing và mở sản phẩm

**Liên kết nghiệp vụ:** BR-01 · **Màn hình:** S01,S03

**Nguồn triển khai:** `src/components/LandingPage.jsx`, `src/components/TravelTransition.jsx`, `src/Atlas.jsx`.

| ID | Chức năng và hành vi phải giữ | Trạng thái/biên | Tiêu chí nghiệm thu |
|---|---|---|---|
| FR-INTRO-01 | **Landing giới thiệu.** Hero, định vị sản phẩm, phần giới thiệu, sáu lớp, minh họa hành trình và CTA cuối trang. | Đầu trang; cuộn; màn hình hẹp. | Đọc và đi tới mọi phần trên desktop/mobile. |
| FR-INTRO-02 | **Điều hướng landing.** Trang chủ, Về dự án, Lớp tri thức và nút cuộn; cuộn có kiểm soát khi giảm motion. | Đúng anchor; giảm chuyển động. | Nút đến đúng phần, không che nội dung bởi header. |
| FR-INTRO-03 | **CTA vào trải nghiệm.** Các CTA thật mở bước chọn quốc gia; nút trong minh họa điện thoại cũng có lối bắt đầu. | Chuột; bàn phím; touch. | CTA không thành ảnh hoặc text vô tác dụng sau redesign. |
| FR-INTRO-04 | **Chuyển cảnh.** Máy bay, mây, địa cầu dùng transform/opacity; bình thường khoảng 2.7 giây, giảm motion khoảng 150 ms. | Đang bay; hoàn tất; reduced motion. | Kết thúc đúng một luồng vào Khám phá, không kẹt màn hình. |
| FR-INTRO-05 | **Bỏ qua và phát lại intro.** Nút Vào khám phá bỏ qua chuyển cảnh; Về kho tri thức có đường xem lại landing/chọn quốc gia. | Bỏ qua giữa hiệu ứng; vào lại. | Có thể vào nhanh và xem lại intro mà không xóa dữ liệu lưu. |

### COUNTRY. Địa cầu và chọn quốc gia

**Liên kết nghiệp vụ:** BR-01 · **Màn hình:** S02

**Nguồn triển khai:** `src/components/GlobeExplorer.jsx`.

| ID | Chức năng và hành vi phải giữ | Trạng thái/biên | Tiêu chí nghiệm thu |
|---|---|---|---|
| FR-COUNTRY-01 | **Bốn quốc gia.** Hiển thị Việt Nam, Hoa Kỳ, Nhật Bản, Hàn Quốc với cờ, khu vực và tiền tệ. | Đang chọn; sắp ra mắt. | Không mở dữ liệu du lịch giả của quốc gia chưa hỗ trợ. |
| FR-COUNTRY-02 | **Tìm quốc gia.** Tìm theo tên Việt/Anh, không phân biệt hoa thường; hiện danh sách khi focus/gõ, xóa được. | Danh sách có/rỗng; Enter; Escape. | Enter chọn kết quả đầu; Escape đóng danh sách; không nhầm với tìm không dấu ở kho chính. |
| FR-COUNTRY-03 | **Chọn và xoay địa cầu.** Chọn quốc gia đổi thông tin, vị trí góc nhìn địa cầu và tiền tệ mặc định. | Chọn từng quốc gia; quay về Việt Nam. | Thông tin tên/cờ/tiền tệ/địa cầu nhất quán với quốc gia vừa chọn. |
| FR-COUNTRY-04 | **Khả dụng CTA.** Việt Nam cho Khám phá; ba quốc gia khác giữ nút vô hiệu/sắp ra mắt. | Enabled; disabled. | Không thể dùng bàn phím để vượt qua trạng thái chưa hỗ trợ. |
| FR-COUNTRY-05 | **Quay lại giới thiệu.** Brand hoặc nút quay lại đưa về landing. | Từ đầu hoặc đang mở đổi tiền. | Đường quay lại luôn dùng được, không mất bộ sưu tập/lịch trình. |

### FX. Đổi tiền tham khảo

**Liên kết nghiệp vụ:** BR-01 · **Màn hình:** S02

**Nguồn triển khai:** `src/components/GlobeExplorer.jsx`, `src/lib/currency.js`.

| ID | Chức năng và hành vi phải giữ | Trạng thái/biên | Tiêu chí nghiệm thu |
|---|---|---|---|
| FR-FX-01 | **Mở/đóng đổi tiền.** Khối tiền tệ mở Collapsible trong bước chọn quốc gia; có nút đóng. | Mở; đóng. | Mở được lại sau khi đóng, aria-expanded phản ánh đúng. |
| FR-FX-02 | **Nhập số tiền.** Input số, min 0, inputMode decimal; rỗng/không hợp lệ/âm được logic quy đổi xử lý về 0. | Rỗng; 0; số dương; giá trị không hợp lệ. | Không crash hoặc hiện NaN; không bỏ quyền nhập trên mobile. |
| FR-FX-03 | **Chọn đơn vị.** Từ/Sang hỗ trợ VND, USD, JPY, KRW; khởi tạo theo quốc gia đã chọn. | Mỗi cặp; cùng đơn vị. | Kết quả theo đúng base/target đang hiển thị. |
| FR-FX-04 | **Đảo chiều.** Đổi chỗ tiền nguồn và đích, tính lại kết quả. | Đang tải; đã có tỷ giá. | Tên hai đơn vị và kết quả đổi đồng thời, không chỉ đảo icon. |
| FR-FX-05 | **Nguồn và fallback.** Fetch tỷ giá, cache theo base 30 phút; lỗi mạng dùng tỷ giá mẫu. USD làm tròn 2 số; VND/JPY/KRW 0 số. | Loading; live; cache; fallback. | Giữ nhãn tham khảo/ngày và thông báo mẫu offline; không mô tả tỷ giá mẫu như dữ liệu mới xác minh. |

### NAV. Shell và điều hướng

**Liên kết nghiệp vụ:** BR-08 · **Màn hình:** S04–S09

**Nguồn triển khai:** `src/Atlas.jsx`, `src/lib/explore.js`, `public/manifest.webmanifest`.

| ID | Chức năng và hành vi phải giữ | Trạng thái/biên | Tiêu chí nghiệm thu |
|---|---|---|---|
| FR-NAV-01 | **Sáu route chính.** explore, graph, saved, suggest, tools, about; fallback route không nhận dạng về explore. | Route hợp lệ/không hợp lệ. | Mỗi route có đường vào và nội dung đúng; không cần URL server riêng cho từng view. |
| FR-NAV-02 | **Desktop sidebar.** Khám phá, Kết nối, Bộ sưu tập có số đếm, Gợi ý, Hành trình; brand về Khám phá. | Mục đang chọn; số đếm thay đổi. | Không mất menu hoặc số đếm khi thu hẹp vùng làm việc. |
| FR-NAV-03 | **Mobile navigation.** Thanh dưới chứa cùng 5 đích chính; hướng dẫn/about vào qua header. | Safe-area; view hẹp. | Mọi đích nghiệp vụ có đường tới trên mobile, không chỉ desktop. |
| FR-NAV-04 | **Deep link và khởi động.** URL không hash mở landing; URL có hash vào app. Chi tiết dùng ?entity=ID; hash cũ #explore/#graph còn đọc được. | Link trực tiếp; reload; ID không tồn tại. | Link thực thể hợp lệ mở đúng chi tiết; ID lạ không gây crash. |
| FR-NAV-05 | **Back và đóng chi tiết.** Mở chi tiết tạo lịch sử; đóng/Back về route thích hợp; đi sang quan hệ cập nhật thực thể. | Close; Back; Forward; related item. | Không rời site ngoài ý muốn trong luồng chi tiết; không hứa lịch sử đổi tâm graph khi chưa có. |
| FR-NAV-06 | **Ngẫu nhiên và trợ giúp.** Sidebar có Khám phá ngẫu nhiên trong 89 mục; header/about có hướng dẫn. | Chọn lại; mở chi tiết. | Ngẫu nhiên mở chi tiết thật, không luôn mở thuyết minh chỉ có ở 3 nơi. |
| FR-NAV-07 | **Chuyển trang và filter state.** Menu chính gọi reset bộ lọc/limit; scroll đầu trang khi đổi stage/page. Reset không xóa bộ sưu tập. | Đang lọc; đang cuộn. | Ngữ cảnh không kẹt ở đáy trang; không biến reset filter thành xóa dữ liệu. |

### EXPLORE. Tìm kiếm và danh sách khám phá

**Liên kết nghiệp vụ:** BR-02 · **Màn hình:** S04,S07

**Nguồn triển khai:** `src/Atlas.jsx`, `src/lib/explore.js`, `src/data/explore.json`.

| ID | Chức năng và hành vi phải giữ | Trạng thái/biên | Tiêu chí nghiệm thu |
|---|---|---|---|
| FR-EXPLORE-01 | **Tìm không dấu.** Tìm trên tên, mô tả và tags; chuẩn hóa hoa thường, dấu và đ/Đ. | Có kết quả; không kết quả; rỗng. | ha noi tìm được Hà Nội; xóa từ khóa trả lại kết quả theo filter còn lại. |
| FR-EXPLORE-02 | **Ô tìm kiếm và shortcut.** Xóa từ khóa; Ctrl/Cmd+K focus vào ô tìm ở màn hình có ô đó. | Focus; clear; bàn phím. | Không bỏ nút xóa/shortcut hoặc tạo shortcut nuốt thao tác form khác. |
| FR-EXPLORE-03 | **Tám nhóm tri thức.** Tất cả và 8 nhóm; chọn một nhóm tại một thời điểm. | Active; inactive. | Không nhầm nhóm khám phá với 6 lớp chuyên sâu. |
| FR-EXPLORE-04 | **Bộ lọc mở rộng.** Mở/đóng khối filter, lọc Bắc/Trung & Tây Nguyên/Nam. | Collapsed; expanded; từng vùng. | Đóng khối không vô tình xóa lựa chọn. |
| FR-EXPLORE-05 | **Filter nguồn.** Tất cả, có nguồn tham chiếu, biên tập mẫu không có nguồn URL. | Có nguồn; không nguồn. | Không phân loại có URL thành đã được thẩm định. |
| FR-EXPLORE-06 | **Filter tháng.** Tất cả tháng hoặc 1–12 theo tập mùa tham khảo từng vùng. | Tháng hợp/không hợp vùng. | Đổi tháng thực sự thay tập kết quả; ghi rõ tính chất tham khảo. |
| FR-EXPLORE-07 | **Filter điểm đến cha.** Dropdown 11 điểm; chỉ lấy quan hệ có nhãn địa điểm của điểm đến đó. | Tất cả; một cha; tập rỗng. | Đúng địa điểm ăn/chơi liên quan, không chỉ tìm tên bằng chuỗi. |
| FR-EXPLORE-08 | **Filter loại địa điểm.** 11 loại hiện có sinh từ dữ liệu, ví dụ cà phê, chợ, ngoài trời, nghệ thuật. | Tất cả; một loại; giao nhiều filter. | Danh sách không hardcode bỏ sót loại; filter kết hợp theo giao. |
| FR-EXPLORE-09 | **Quick filters.** Vui chơi/Ăn uống chọn category và xóa type; Cà phê/Chợ xóa category và chọn type. | Từng shortcut; filter khác còn giữ. | Bốn nút có logic riêng và không chỉ thay trạng thái tô màu. |
| FR-EXPLORE-10 | **Map và list.** Chuyển bố cục map+thẻ hoặc chỉ danh sách. | Map; list; mobile. | Cả hai vẫn mở chi tiết và lưu được. |
| FR-EXPLORE-11 | **Đếm và sắp xếp.** Hiện số mục sau lọc; mặc định theo thứ tự dữ liệu, hoặc A–Z theo locale vi. | Suggested; A–Z. | Không gọi sort mặc định là thuật toán cá nhân hóa của trang Gợi ý. |
| FR-EXPLORE-12 | **Tải thêm và rỗng.** Khởi tạo tối đa 6 mục; Xem thêm tăng 6; empty state và reset. | Còn mục; đã hết; không kết quả. | Không làm mất các mục ngoài 6 mục đầu; nút tải thêm hết thì ẩn. |
| FR-EXPLORE-13 | **Thẻ kết quả.** Ảnh/fallback, nhóm, vùng, tên, mô tả, số kết nối/nguồn; vùng ảnh/tên mở chi tiết. | Ảnh tải/lỗi; nội dung dài. | Không thay dữ liệu thật bằng card trang trí; mọi entry vẫn có đường mở. |

### MAP. Bản đồ tổng quan SVG

**Liên kết nghiệp vụ:** BR-02 · **Màn hình:** S04,S07

**Nguồn triển khai:** `src/Atlas.jsx`, `src/lib/explore.js`, `public/data/vietnam.geojson`.

| ID | Chức năng và hành vi phải giữ | Trạng thái/biên | Tiêu chí nghiệm thu |
|---|---|---|---|
| FR-MAP-01 | **11 marker.** Hội An, Hà Giang, Tràng An, Huế, Cần Thơ, Hạ Long, Hà Nội, Đà Lạt, TP.HCM, Đà Nẵng, Phú Quốc. | Click; Enter/Space trên marker. | Mọi marker mở đúng thực thể; miền Nam không bị ghi chú che. |
| FR-MAP-02 | **Zoom và reset.** Tăng/giảm hệ số 1–2, bước 0.25; đặt lại 1. | Min; max; reset. | Nút hoạt động và không zoom vô hạn. |
| FR-MAP-03 | **Ngữ cảnh địa lý.** Giữ nền Việt Nam, Biển Đông và chú thích quần đảo minh họa. | Có/không tải được geoJSON. | Không trình bày sơ đồ thành GPS hoặc vị trí đảo chính xác đã khảo sát. |
| FR-MAP-04 | **Độc lập filter.** Hiện tại map luôn là 11 điểm tổng quan; bộ lọc tác động danh sách. | Lọc rỗng nhưng map vẫn có điểm. | Nếu đổi sang marker đồng bộ filter, phải ghi thay đổi nghiệp vụ và có test riêng. |

### DETAIL. Chi tiết thực thể

**Liên kết nghiệp vụ:** BR-03 · **Màn hình:** S10

**Nguồn triển khai:** `src/Atlas.jsx`, `src/data/explore.json`, `src/components/ui/AnimatedSheet.jsx`.

| ID | Chức năng và hành vi phải giữ | Trạng thái/biên | Tiêu chí nghiệm thu |
|---|---|---|---|
| FR-DETAIL-01 | **Header và nội dung chung.** Tên, nhóm/vùng, mô tả, tags, ảnh minh họa/nguồn ảnh; lưu/bỏ lưu. | Nội dung ngắn/dài; ảnh lỗi. | Mở đúng ID từ thẻ, map, graph và gợi ý. |
| FR-DETAIL-02 | **Tab Tổng quan.** Thời lượng, chi tiêu, số quan hệ, narrative và liên kết liên quan. | Có/không narrative hoặc địa chỉ. | Không tạo dữ liệu bịa cho trường rỗng; giữ chú thích dữ liệu mẫu. |
| FR-DETAIL-03 | **Thông tin POI.** 47 mục có địa chỉ/type/Google Maps; giờ mở cửa và giá chưa xác minh được nêu rõ. | Có/không Maps. | Maps mở đúng URL; không thêm giờ/giá xác thực giả. |
| FR-DETAIL-04 | **Tab Kết nối.** Toàn bộ quan hệ của thực thể, tên đích và nhãn có hướng/ngược. | Không/ít/nhiều quan hệ. | Chọn một quan hệ mở đúng ID đích, không giới hạn 4 gợi ý thành toàn bộ quan hệ. |
| FR-DETAIL-05 | **Tab Nguồn.** Danh sách label+URL; trạng thái không có nguồn và thông tin biên tập. | Có URL; không nguồn; nguồn ngoài lỗi. | Giữ đường mở gốc và các chú thích về thẩm định. |
| FR-DETAIL-06 | **Các lối đi tiếp.** Tổng quan có gợi ý liên quan đầu tiên; xem mọi địa điểm ăn/chơi của điểm đến; xem trên graph. | Điểm đến/POI; chuyển route. | CTA cập nhật đúng filter cha hoặc tâm graph trước khi điều hướng. |
| FR-DETAIL-07 | **Công cụ chuyên sâu đúng phạm vi.** Chỉ Hà Nội/Huế/TP.HCM có CTA 6 lớp, audio và planner. | Có/không nội dung chuyên sâu. | Không hứa tính năng chuyên sâu cho 86 mục còn lại. |
| FR-DETAIL-08 | **Tương tác dialog/tab.** Đóng, Escape, click ngoài, focus trap/trả focus; tab liên kết ARIA, Arrow chuyển focus, Enter/Space chọn. | Desktop dialog; mobile sheet; lồng dialog. | Dùng được bằng keyboard và không cho focus lạc ra lớp nền. |

### GRAPH. Bản đồ kết nối

**Liên kết nghiệp vụ:** BR-03 · **Màn hình:** S05

**Nguồn triển khai:** `src/Atlas.jsx`, `src/data/explore.json`.

| ID | Chức năng và hành vi phải giữ | Trạng thái/biên | Tiêu chí nghiệm thu |
|---|---|---|---|
| FR-GRAPH-01 | **Chọn tâm.** Dropdown chọn trong toàn bộ 89 mục, mặc định Hội An. | Chọn trực tiếp; giữ state trong phiên. | Không giới hạn dropdown còn 11 marker/3 điểm chuyên sâu. |
| FR-GRAPH-02 | **Đủ quan hệ.** Đồ thị hiển thị các nút và đường nối; list cung cấp đủ hàng và nhãn. | Tâm ít/nhiều quan hệ. | Hội An có 15 quan hệ; không chỉ render 8 nút rồi bỏ các mục còn lại. |
| FR-GRAPH-03 | **Đổi tâm bằng quan hệ.** Click nút đồ thị hoặc dòng liên quan đổi tâm. | Đi qua nhiều thực thể. | Tên tâm, số lượng, nodes và danh sách cùng cập nhật. |
| FR-GRAPH-04 | **Mở chi tiết và đặt lại.** Nút tâm/Đọc câu chuyện mở chi tiết; đặt lại về Hội An. | Reset; detail; close. | Mở đúng thực thể đang làm tâm, không nhầm điểm đầu. |
| FR-GRAPH-05 | **Mobile và vị trí nút.** Vùng sơ đồ cuộn ngang, tự căn giữa; list bên dưới. Nút dùng translate để không lệch khi scale. | Viewport hẹp; nhấn nút; scroll. | Không tràn ngang cả trang; giữ đường tới mọi quan hệ bằng danh sách. |

### COLLECTION. Bộ sưu tập

**Liên kết nghiệp vụ:** BR-04 · **Màn hình:** S04,S07,S10

**Nguồn triển khai:** `src/Atlas.jsx`, `src/hooks/useLocal.js`, `src/hooks/useCollection.js`.

| ID | Chức năng và hành vi phải giữ | Trạng thái/biên | Tiêu chí nghiệm thu |
|---|---|---|---|
| FR-COLLECTION-01 | **Lưu/bỏ lưu.** Toggle từ card/chi tiết/gợi ý; thể hiện trái tim và aria-pressed. | Chưa lưu; đã lưu; toggle lại. | Cùng thực thể phản ánh trạng thái trong shell chính. |
| FR-COLLECTION-02 | **Danh sách và số đếm.** Bộ sưu tập chính hiện các ID đã lưu, sidebar có tổng. | 0; 1; nhiều; sau reload. | Số đếm và danh sách dùng cùng tập ID, không chỉ đếm card đang render. |
| FR-COLLECTION-03 | **Lọc và empty state.** Dùng tìm/filter/sort/map/list trong phần đã lưu; chưa lưu hoặc lọc rỗng có lối khám phá lại. | Bộ sưu tập rỗng; filter không khớp. | Không đánh đồng hai trường hợp và không xóa dữ liệu khi reset. |
| FR-COLLECTION-04 | **Phân biệt bản đồ cũ.** Bộ sưu tập cũ hiện có key riêng; đánh dấu GAP-01, không tự coi là đã đồng bộ. | Mở công cụ cũ; trở về chính. | Prompt phải giữ cả chức năng hoặc quy định migration trước khi hợp nhất. |

### RECOMMEND. Gợi ý cá nhân

**Liên kết nghiệp vụ:** BR-04 · **Màn hình:** S08

**Nguồn triển khai:** `src/Atlas.jsx`, `src/lib/explore.js`.

| ID | Chức năng và hành vi phải giữ | Trạng thái/biên | Tiêu chí nghiệm thu |
|---|---|---|---|
| FR-RECOMMEND-01 | **Sở thích nhiều lựa chọn.** Văn hóa, Ẩm thực, Thiên nhiên, Đi chậm, Phiêu lưu; mặc định Văn hóa, có thể bỏ hết. | 0/1/nhiều lựa chọn. | Nút chọn thực sự đổi input của gợi ý. |
| FR-RECOMMEND-02 | **Tháng khởi hành.** Tháng 1–12; ban đầu tháng hiện tại. | Đổi tháng. | Tính điểm mùa theo dữ liệu tham khảo, không giả dữ liệu thời tiết. |
| FR-RECOMMEND-03 | **Ngân sách.** Linh hoạt, Tiết kiệm, Vừa phải, Thoải mái. | Mỗi mức. | So khớp mức chi tiêu trong dữ liệu, không tính giá chuyến đi. |
| FR-RECOMMEND-04 | **Top 4 có giải thích.** Chấm trên 11 điểm: mỗi sở thích khớp tags/mô tả +3, hợp mùa +1, ngân sách trống/khớp +1; lấy 4 đầu. | Không khớp sở thích; hòa điểm. | Không trùng ID; có lý do hoặc câu gợi ý dự phòng. |
| FR-RECOMMEND-05 | **Hành động từ kết quả.** Dùng card thật để mở chi tiết/lưu; giữ thông báo dữ liệu mẫu. | Save; detail; return. | Không biến kết quả thành slide tĩnh không tương tác. |

### KNOWLEDGE. Kho chuyên sâu sáu lớp

**Liên kết nghiệp vụ:** BR-06 · **Màn hình:** S09,S11

**Nguồn triển khai:** `src/components/DetailPanel.jsx`, `src/data/content.js`, `src/Atlas.jsx`.

| ID | Chức năng và hành vi phải giữ | Trạng thái/biên | Tiêu chí nghiệm thu |
|---|---|---|---|
| FR-KNOWLEDGE-01 | **Ba điểm đến.** Hà Nội, Huế, TP.HCM mở từ Hành trình hoặc CTA chi tiết tương ứng. | Chọn từng nơi. | Không trộn nội dung hoặc ID giữa ba điểm. |
| FR-KNOWLEDGE-02 | **Bốn ngôn ngữ nội dung.** vi/en/zh/ko cho dữ liệu chuyên sâu; chọn ngôn ngữ được lưu. | Đổi ngôn ngữ; thiếu bản dịch UI riêng. | Nội dung theo lựa chọn; không quảng bá UI 89 mục đã dịch toàn bộ. |
| FR-KNOWLEDGE-03 | **Tổng quan chuyên sâu.** Ảnh, vùng, tagline/intro, snapshot di sản/văn hóa/ẩm thực, tháng đẹp, gợi ý ngày, điểm nổi bật. | Dữ liệu/ảnh có hoặc lỗi. | Giữ thông tin giúp chọn chuyến đi, không chỉ còn ảnh hero. |
| FR-KNOWLEDGE-04 | **Sáu lớp và xem tất cả.** history, heritage, culture, food, tourism, story; mỗi nơi 12 mục, có số đếm và lối xem tất cả. | Một lớp; tất cả; quay lại overview. | Không thay 6 lớp bằng 8 nhóm khám phá. |
| FR-KNOWLEDGE-05 | **Đọc mục và nguồn.** Entry có title/body/ảnh wiki, nguồn điểm đến; mục mở từ search được highlight/scroll tới. | Highlight; nội dung dài; ảnh không có. | Không bỏ phần body hoặc nguồn khi chuyển thành layout mới. |
| FR-KNOWLEDGE-06 | **Đi tiếp sang công cụ.** Nút lập lịch trình, nghe MP3 ngắn/đầy đủ và kể theo chủ đề. | Mở/đóng công cụ con. | Truyền đúng destId và lang; đóng dialog con còn đường về cha. |

### STORY. Kể chuyện theo chủ đề

**Liên kết nghiệp vụ:** BR-06 · **Màn hình:** S12

**Nguồn triển khai:** `src/components/AIStoryteller.jsx`, `src/lib/storyteller.js`.

| ID | Chức năng và hành vi phải giữ | Trạng thái/biên | Tiêu chí nghiệm thu |
|---|---|---|---|
| FR-STORY-01 | **Bốn chủ đề.** Kể nhanh 1 phút, Dòng chảy lịch sử, Hồn văn hóa, Chuyện người bản địa. | Chọn từng mode; thay điểm/ngôn ngữ. | Mỗi mode lấy đúng nội dung của điểm đang mở. |
| FR-STORY-02 | **Tạo lại và trạng thái.** Tạo lại cùng chủ đề; loading/success/error; mặc định ghép nội dung tại máy. | Đang tạo; xong; API lỗi nếu cấu hình. | Giữ nút retry/rebuild và nhãn phân biệt demo/local với AI qua backend tùy chọn. |
| FR-STORY-03 | **Đọc và dừng TTS.** Nghe/Dừng câu chuyện qua SpeechSynthesis; chọn mode/đóng phải dừng giọng cũ. | Không có API giọng; đang nói; đã dừng. | Không chồng nhiều giọng hoặc gọi đây là MP3 đã tải offline. |
| FR-STORY-04 | **Dialog lồng nhau.** Mở từ kho chuyên sâu; đóng/Escape quay về cha; phân lớp backdrop và focus. | Dialog cha + con. | Lớp con không bị clipping trong panel và không làm mất đường quay lại. |

### AUDIO. Trình phát thuyết minh

**Liên kết nghiệp vụ:** BR-06 · **Màn hình:** S13

**Nguồn triển khai:** `src/components/StoryPlayer.jsx`, `src/hooks/useStoryEngine.js`, `src/lib/story.js`, `public/audio/manifest.json`.

| ID | Chức năng và hành vi phải giữ | Trạng thái/biên | Tiêu chí nghiệm thu |
|---|---|---|---|
| FR-AUDIO-01 | **Mở player đầy đủ.** Trình phát toàn màn hình với ảnh nền/nguồn ảnh, tên nơi, lớp, tiêu đề và caption. | Đang phát; ảnh lỗi. | Không thay player bằng nút phát audio không còn nội dung dẫn chuyện. |
| FR-AUDIO-02 | **Bản ngắn/đầy đủ.** Hai mode short/full; thời lượng ước tính; đổi mode kể lại từ đầu. | Mỗi mode; đang nghe đổi mode. | Đúng track/script và không giữ sai vị trí mode trước. |
| FR-AUDIO-03 | **Ngôn ngữ player.** vi/en/zh/ko; đổi ngôn ngữ cố giữ đoạn/chương tương ứng. | Có MP3; chỉ TTS/chữ. | Giữ ngữ cảnh đoạn, thể hiện nguồn phát đúng. |
| FR-AUDIO-04 | **Phát/dừng/phát lại.** Play/pause, ended state và nghe lại từ đầu. | Autoplay bị chặn; pause; ended. | Người dùng có thể bấm phát lại; không tự giả báo đang phát khi lệnh play bị từ chối. |
| FR-AUDIO-05 | **Câu trước/sau.** Đi theo từng câu; disabled ở biên; caption cập nhật. | Đầu/cuối; giữa bản kể. | Không vượt index hoặc tiếp tục phát câu cũ sau khi chuyển. |
| FR-AUDIO-06 | **Chương và tiến độ.** Mở đầu, sáu lớp và lời kết theo dữ liệu; bấm nhảy chương, thanh tiến độ. | Đã qua; hiện tại; sắp tới. | Tiến độ biểu thị trạng thái thật; không bỏ các nút nhảy chương. |
| FR-AUDIO-07 | **Âm lượng và tốc độ.** Bật/tắt tiếng, 0.8×/1×/1.25×; ghi nhớ preference. | Muted; có tiếng; đổi tốc độ. | Tốc độ ảnh hưởng phát/timing; mute vẫn cho đọc chữ. |
| FR-AUDIO-08 | **Ba engine dự phòng.** Ưu tiên file hợp lệ → TTS nếu có giọng và bật tiếng → text theo thời gian. Thiếu giọng/lỗi file có fallback. | MP3 lỗi; thiếu giọng; chưa sẵn voices. | Không kẹt player khi thiếu tiếng; MP3 chỉ có sẵn 6 bản vi. |
| FR-AUDIO-09 | **Kết thúc và hành động tiếp.** Nghe lại, lập lịch trình, về các lớp và nguồn tham khảo. | Ended. | Cả ba CTA và nguồn đều tiếp tục dùng được. |
| FR-AUDIO-10 | **Keyboard và đóng.** Space/Left/Right ở ngữ cảnh không tương tác; Escape đóng; dừng tiếng/timer khi đóng. | Focus button/select; focus nền player. | Không double-handle phím trên input/button; đóng không để audio còn chạy. |

### PLAN. Lập lịch trình ba bước

**Liên kết nghiệp vụ:** BR-05 · **Màn hình:** S14

**Nguồn triển khai:** `src/components/ItineraryBuilder.jsx`, `src/lib/itinerary.js`, `src/data/content.js`.

| ID | Chức năng và hành vi phải giữ | Trạng thái/biên | Tiêu chí nghiệm thu |
|---|---|---|---|
| FR-PLAN-01 | **Chọn điểm đến.** Chỉ 3 nơi có dữ liệu POI; tự chọn nơi nếu mở từ chi tiết. | Chưa chọn; đổi điểm. | Bước 1 chưa chọn nơi thì không tiếp tục; đổi nơi không giữ POI của nơi cũ. |
| FR-PLAN-02 | **Tháng và gợi ý mùa.** 12 tháng có mức thuận lợi 1/2/3, chú giải và bestNote; tự chọn tháng tốt mặc định. | Từng tháng; đổi nơi. | Tháng được lưu vào lịch trình, không chỉ tô biểu đồ. |
| FR-PLAN-03 | **Số ngày.** Stepper 1–7, gợi ý số ngày và daysRange của điểm đến. | Min/max. | Không chọn 0 hoặc quá 7 bằng nút; đổi số ngày tác động kế hoạch. |
| FR-PLAN-04 | **Số người.** Stepper 1–30; nhóm đông có cảnh báo và capacity thấp hơn. | 1; 6; 10; 30. | Số người tham gia gợi ý và metadata sau lưu. |
| FR-PLAN-05 | **Sở thích planner.** Di sản, Văn hóa, Ẩm thực, Vui chơi & trải nghiệm; chọn nhiều hoặc để cân bằng. | Không/chọn nhiều. | Không nhầm với 5 sở thích ở trang Gợi ý. |
| FR-PLAN-06 | **Chọn POI bước 2.** Filter tất cả/4 kind, checkbox, title/note, số giờ, buổi, nên đi/hợp sở thích. | Đã/chưa chọn; filter. | Lọc không tự làm mất các POI đã chọn ngoài filter. |
| FR-PLAN-07 | **Chọn gợi ý và bỏ hết.** Khởi tạo gợi ý theo ngày/nhóm/sở thích; nút chọn lại hệ thống; bỏ chọn tất cả. | Đã sửa tay; khôi phục gợi ý; rỗng. | Rỗng thì không sang bước 3; chọn lại là hành động thật. |
| FR-PLAN-08 | **Khối lượng thời gian.** Đếm POI, tổng giờ, capacity; cảnh báo quá tải hoặc phù hợp. | Trong/vượt mức. | Cảnh báo hiện nhưng không tự xóa lựa chọn hay biến thành chặn lưu chưa có trong sản phẩm. |
| FR-PLAN-09 | **Sinh ngày và lịch giờ.** Nhóm theo zone/slot, chia ngày, thời gian bắt đầu/kết thúc gợi ý, ngày trống và tổng giờ. | Một/nhiều ngày; ngày rỗng. | Không mất hoặc nhân đôi POI; không mô tả lịch gợi ý là tuyến đường tối ưu thời gian thực. |
| FR-PLAN-10 | **Chỉnh từng POI.** Tăng/giảm vị trí, chuyển ngày, xóa khỏi kế hoạch, sắp tự động lại. | Đầu/cuối ngày; chuyển sang ngày khác. | Điều khiển biên disabled đúng; xóa cũng cập nhật tập selected. |
| FR-PLAN-11 | **Tên, ghi chú và lưu.** Tên gợi ý, chỉnh tên/notes; lưu mới hoặc cập nhật ID cũ; success và Xem lịch trình của tôi. | Chưa lưu; đã lưu; sửa sau lưu. | Tên trống fallback về tên điểm đến; không tạo trùng ID khi cập nhật. |
| FR-PLAN-12 | **Quay lại và trạng thái bước.** Bước 1–2–3, quay lại bước trước; giữ manual selection hợp lệ khi có thể. | Prev; Next; chỉnh lại đầu vào. | Không mất form chỉ vì animation chuyển bước; chưa có bảo đảm giữ draft sau đóng/reload. |

### TRIP. Quản lý lịch trình đã lưu

**Liên kết nghiệp vụ:** BR-05 · **Màn hình:** S15,S18

**Nguồn triển khai:** `src/components/SavedItineraries.jsx`, `src/hooks/useItineraries.js`, `src/Atlas.jsx`, `src/App.jsx`.

| ID | Chức năng và hành vi phải giữ | Trạng thái/biên | Tiêu chí nghiệm thu |
|---|---|---|---|
| FR-TRIP-01 | **Danh sách/empty/read view.** Chọn lịch trình, tên/điểm/tháng/ngày/nhóm/ngày tạo/rating, xem từng ngày/giờ/POI. | Rỗng; nhiều bản; đổi lựa chọn. | Không chỉ hiển thị thẻ tên mà mất chi tiết kế hoạch. |
| FR-TRIP-02 | **Tạo mới và chỉnh sửa.** Tạo mới từ bộ quản lý; sửa bản cũ mở bước 3, giữ ID/createdAt/rating liên quan. | Create; edit/update. | Sửa cập nhật bản chọn, không tạo bản sao ngoài ý muốn. |
| FR-TRIP-03 | **Nhân bản để cải tiến.** Mở planner với bản sao, id/createdAt mới khi lưu, rating reset, có hậu tố tên. | Copy draft; save copy. | Bản gốc không bị sửa và không nhầm thành copy clipboard/export. |
| FR-TRIP-04 | **Xóa có xác nhận.** AlertDialog Hủy/Xóa, không xóa ngay; cập nhật mục chọn sau xóa. | Hủy; xác nhận; xóa bản cuối. | Hủy giữ nguyên dữ liệu; xác nhận chỉ xóa đúng ID. Chưa có undo/thùng rác. |
| FR-TRIP-05 | **Ghi chú tự lưu.** Sửa notes trực tiếp trong read view và lưu cục bộ theo thay đổi. | Gõ; đóng/mở; reload. | Notes thuộc đúng itinerary, không chỉ giữ trong ô input. |
| FR-TRIP-06 | **Đánh giá cá nhân.** 1–5 sao, bấm lại mức đang chọn để xóa rating. | 0–5; đổi sao. | Chỉ là đánh giá cục bộ chuyến đi, không phải review công khai điểm đến. |

### LEGACY. Bản đồ địa lý và công cụ cũ

**Liên kết nghiệp vụ:** BR-08 · **Màn hình:** S16

**Nguồn triển khai:** `src/App.jsx`, `src/components/MapView.jsx`, `src/components/Sidebar.jsx`, `src/hooks/useCollection.js`.

| ID | Chức năng và hành vi phải giữ | Trạng thái/biên | Tiêu chí nghiệm thu |
|---|---|---|---|
| FR-LEGACY-01 | **Đường vào/ra rõ ràng.** Hành trình mở bản đồ cũ; có nút về Khám phá Chạm Việt và brand quay lại. | Đang tải module; đã mở. | Không bỏ công cụ này chỉ vì đã có bản đồ SVG chính. |
| FR-LEGACY-02 | **Leaflet và vệ tinh.** Map/Esri imagery, zoom/drag của Leaflet, marker 3 điểm, geoJSON/nhãn/credit. | Map; vệ tinh; tile/geo lỗi. | Chọn marker mở đúng nơi; giảm motion không fly/zoom hoạt ảnh. |
| FR-LEGACY-03 | **Sidebar và nhóm vùng.** Danh sách điểm theo Bắc/Trung/Nam, tên/tagline, chọn điểm; empty panel có câu chuyện ngẫu nhiên. | Chưa chọn; đã chọn. | Có đường vào nội dung và ngẫu nhiên thuyết minh của 3 điểm. |
| FR-LEGACY-04 | **Search chuyên sâu.** Tìm trong tên/tagline/vùng, tên entry và POI ở các ngôn ngữ; tối đa 4 entry và 3 POI cho mỗi nhóm kết quả. | Query; clear; no match; Ctrl/Cmd+K. | Entry search mở đúng lớp và highlight; không thay bằng tìm 89 thực thể rồi mất search chuyên sâu. |
| FR-LEGACY-05 | **Yêu thích cũ và các CTA.** Lọc chỉ đã lưu, toggle favorite key riêng; planner, lịch trình của tôi, ngôn ngữ, kể chuyện. | Saved filter; mở công cụ. | Giữ chức năng và công khai GAP-01/02 nếu hợp nhất shell. |

### PWA. Cài đặt và ngoại tuyến

**Liên kết nghiệp vụ:** BR-07 · **Màn hình:** S09,S17

**Nguồn triển khai:** `public/manifest.webmanifest`, `scripts/sw-template.js`, `public/range.js`, `src/main.jsx`, `src/Atlas.jsx`, `vite.config.js`.

| ID | Chức năng và hành vi phải giữ | Trạng thái/biên | Tiêu chí nghiệm thu |
|---|---|---|---|
| FR-PWA-01 | **Install và standalone.** Manifest, icon 192/512/maskable, start_url explore, shortcuts saved/tools; install prompt khi khả dụng. | Có/không beforeinstallprompt. | Không yêu cầu mọi browser đều có nút cài; giữ hướng dẫn iPhone/Android. |
| FR-PWA-02 | **Khởi tạo cache production.** Service worker chỉ đăng ký production trên localhost/HTTPS; precache app, lazy modules, geoJSON, manifest audio. | Lần đầu; cache sẵn; dev. | Không hứa lần đầu mở không mạng vẫn chạy; kiểm tra bằng build/preview. |
| FR-PWA-03 | **Ngoại tuyến đúng phạm vi.** Dữ liệu đã bundle/cached và local itinerary đọc được; ảnh/font/tile/tỷ giá/nguồn ngoài có giới hạn. | Online; offline; tài nguyên thiếu. | Không cam kết đã cache toàn bộ ảnh hoặc dữ liệu dịch vụ ngoài. |
| FR-PWA-04 | **Tải sáu MP3.** Nút tải chủ động, thông báo đang tải/thành công/thất bại; cache audio riêng. | Chưa tải; đang tải; đã lưu 6; lỗi. | Sau tải thành công vẫn nghe file khi máy chủ local tắt. |
| FR-PWA-05 | **Tua audio và fallback.** Service worker hỗ trợ byte-range đơn, trả 206 hợp lệ/416 không hợp lệ; không chặn engine fallback. | Range; suffix; ngoài biên. | Tua/phát không hỏng chỉ vì audio lấy từ cache. |
| FR-PWA-06 | **Cập nhật chủ động.** Khi có worker waiting, nút cập nhật gửi SKIP_WAITING rồi reload khi controller đổi. | Không bản mới; có bản mới; đang áp dụng. | Không tự refresh để làm mất phiên nghe/chỉnh sửa; lưu ý GAP-08 về version audio. |
| FR-PWA-07 | **Trạng thái kết nối.** Theo dõi online/offline, status trên shell và phản hồi tải; cài đặt giảm motion ở tools/about. | Mất/phục hồi kết nối. | Nhãn kết nối không bị hiểu thành bằng chứng tất cả request ngoài đã thành công. |

### MOTION. Hệ motion, responsive và accessibility

**Liên kết nghiệp vụ:** BR-09 · **Màn hình:** Mọi màn hình

**Nguồn triển khai:** `src/components/ui/MotionButton.jsx`, `src/components/ui/AnimatedDialog.jsx`, `src/components/ui/AnimatedSheet.jsx`, `src/components/ui/MotionContent.jsx`, `src/components/ui/AppMotionProvider.jsx`, `src/components/ui/motion.css`, `src/atlas.css`.

| ID | Chức năng và hành vi phải giữ | Trạng thái/biên | Tiêu chí nghiệm thu |
|---|---|---|---|
| FR-MOTION-01 | **Nút toàn dự án.** MotionButton dùng chung; tương tác nhấn nhanh, giữ type/handler/disabled/label/pressed. | Default; focus; pressed; disabled. | Không mất click, keyboard hoặc vị trí node vì thêm transform. |
| FR-MOTION-02 | **Dialog theo ngữ cảnh.** Sheet, modal rộng, full-screen story, storyteller và alert; quản lý lớp phủ, đóng và focus. | Lồng cha/con; thoát; return focus. | Dialog con che đúng cha, không kẹt focus hay để audio phát sau khi đóng. |
| FR-MOTION-03 | **Chuyển nội dung có mục đích.** Fade/translate ngắn khi đổi trang/bước/lớp; landing reveal; không animate left/top của plane hoặc width progress. | Đổi nhanh nhiều lần; nội dung dài. | Không giấu tiêu đề lâu, không chặn thao tác chờ animation. |
| FR-MOTION-04 | **Giảm chuyển động.** Tôn trọng OS và checkbox cục bộ; persist key; hạn chế JS/CSS, intro, caption và Leaflet. | OS reduce; user reduce; reload. | Nội dung vẫn đọc được ngay, không còn delay từng từ khi giảm chuyển động. |
| FR-MOTION-05 | **Responsive.** Sidebar thành tab dưới, sheet mobile, safe-area, text/input đọc được; tháng planner 2 hàng trên mobile. | 360/390/768/desktop; orientation. | Không bỏ chức năng khỏi mobile; không tràn ngang toàn trang. |
| FR-MOTION-06 | **Keyboard và ngữ nghĩa.** Skip link, label, focus visible, thứ tự focus, dialog trap; Native select/input giữ thao tác chuẩn. | Tab/Shift+Tab; Enter/Space; Escape. | Không dùng hover làm lối vào duy nhất; không giả nút bằng div không keyboard. |

### STATE. Dữ liệu, phản hồi và giới hạn

**Liên kết nghiệp vụ:** BR-10 · **Màn hình:** Mọi màn hình

**Nguồn triển khai:** `src/hooks/useLocal.js`, `src/data/explore.json`, `src/data/content.js`, `src/components/WikiImage.jsx`, `src/lib/storyteller.js`, `src/lib/explore.js`.

| ID | Chức năng và hành vi phải giữ | Trạng thái/biên | Tiêu chí nghiệm thu |
|---|---|---|---|
| FR-STATE-01 | **Giữ dữ liệu và schema.** Entity/POI ID, quan hệ, nguồn, itinerary, preferences có danh tính ổn định. | Sau refactor; sau deploy; migration. | Không dùng nhãn hiển thị hoặc index làm ID thay cho ID dữ liệu. |
| FR-STATE-02 | **Lưu cục bộ và lỗi lưu.** Read/parse có fallback sai kiểu; write bắt lỗi. Chưa có báo lỗi write đầy đủ. | JSON hỏng; storage bị chặn/quota. | App không crash; không gọi việc bắt lỗi im lặng là đồng bộ đã thành công. |
| FR-STATE-03 | **Loading/empty/error.** Suspense cho module, empty cho search/saved, lỗi tạo story/tải audio và thiếu ảnh có phản hồi hiện có. | Chậm; rỗng; thiếu dữ liệu; lỗi mạng. | UI mới phải thể hiện cùng trạng thái, không chỉ thiết kế happy path. |
| FR-STATE-04 | **Ảnh và attribution.** Wikipedia/Wikimedia resolve động, ảnh điểm đến có thể minh họa POI con; giữ credit/alt/fallback. | Placeholder; ảnh tải xong; lỗi. | Không bỏ nguồn hoặc gọi ảnh minh họa là ảnh địa điểm đã xác minh. |
| FR-STATE-05 | **Nguồn và extension.** Giữ URL công khai, link Maps; API kể chuyện là extension tùy cấu hình; thông tin mẫu rõ ràng. | Không API; API lỗi; link ngoài. | Không nhúng secret client hoặc tạo AI/GPS/booking giả vào mockup. |

## 5. Quy tắc xử lý dữ liệu và biểu mẫu

### 5.1. Tìm kiếm và giao bộ lọc

- Search chính chuẩn hóa NFD, bỏ dấu, đổi đ/Đ, chuyển thường, trim; tìm trong `name + description + tags`.
- Category chọn đơn; vùng, nguồn, tháng, loại và điểm cha kết hợp theo **AND**, không ghi đè lẫn nhau.
- Search chuyên sâu của Sidebar là đường khác: tìm tên/tagline/vùng của điểm đến và tên entry/POI ở 4 ngôn ngữ. Search quốc gia lại là bộ tìm tên Việt/Anh, không bảo đảm mọi truy vấn không dấu giống search chính.
- Parent filter dựa trên quan hệ có chữ “địa điểm”; không lấy tất cả quan hệ của điểm cha, ví dụ món ăn/di sản không phải địa chỉ POI.
- `reset()` chính xóa query/category/region/source/parent/month/type và limit về 6. Hiện không reset sort/view; không xóa saved hay lịch trình. Menu chính có gọi reset khi chuyển trang.
- Danh sách sort “Gợi ý” mặc định là thứ tự dataset, khác thuật toán top 4 ở S08.

### 5.2. Tháng và gợi ý

Tháng thuận lợi mẫu của bộ lọc/gợi ý chính: Bắc 3,4,9,10,11; Trung 2–8; Nam 11,12,1–4. Đây không phải dự báo và cũng không đồng nhất với `bestMonths` 1/2/3 riêng của planner từng điểm.

Điểm gợi ý = 3 × số sở thích khớp tags/mô tả + 1 nếu tháng thuộc mùa vùng + 1 nếu ngân sách trống hoặc khớp. Sắp giảm dần và lấy 4 trong 11 điểm map. Khi không có lý do cụ thể, có câu giải thích dự phòng. Không gọi đây là machine learning hay tư vấn ngân sách thời gian thực.

### 5.3. Planner

- `days`: 1–7; `people`: 1–30; `month`: 1–12. Gợi ý ngày mặc định hiện là 3 ở cả 3 điểm, nhưng khoảng giới thiệu Hà Nội/TP.HCM là 3–4, Huế 2–3.
- `dayCapacity`: nhóm 1–5 người = 8 giờ/ngày, 6–9 = 7 giờ/ngày, từ 10 = 6.5 giờ/ngày. Đây là khối lượng hoạt động mẫu.
- Sở thích dùng kind `heritage/culture/food/fun`, khác 5 interest của S08. Không chọn sở thích thì gợi ý cân bằng; chọn nhiều không được biến thành một radio đơn.
- Gợi ý ưu tiên mục hợp sở thích và `must`; lựa chọn tự động tính theo capacity. Người dùng được chọn thủ công vượt mức và thấy cảnh báo.
- `autoPlan` gom zone/slot và chia tải xấp xỉ; không gọi bản đồ định tuyến, thời gian di chuyển thực tế hoặc tối ưu hóa địa lý chính xác.
- Lịch bắt đầu 08:00; giữa hoạt động cộng khoảng đệm 30 phút; afternoon không sớm hơn 13:30, evening không sớm hơn 18:30; có quy tắc nghỉ trưa cho mục không phải food. Các giờ đều là gợi ý.
- Move sang ngày khác sắp ngày đích theo slot/zone; Up/Down là sắp tay. Remove cập nhật cả `plan` và `selected`. Ngày rỗng phải hiện được.
- Nút Tiếp ở bước 1 cần điểm đến; bước 2 cần ít nhất một POI. Đổi nơi xóa lựa chọn/kế hoạch của nơi cũ. Không vô tình cho đi tiếp với POI thuộc nơi khác.
- Lưu dùng ID cũ khi sửa, ID mới khi tạo/nhân bản. Tên trim rỗng fallback về tên điểm đến. Giữ `createdAt` và rating khi sửa; nhân bản tạo lại danh tính khi lưu và reset rating.
- Chưa có draft persistence, phát hiện mọi thay đổi chưa lưu hay cảnh báo đóng form hoàn chỉnh. Không giả định những chức năng này tồn tại.

### 5.4. Thuyết minh và kể chuyện

| Hạng mục | Quy tắc |
|---|---|
| MP3 | Tìm theo dest/lang/mode trong manifest; chỉ có 6 bản tiếng Việt |
| File lỗi/không có | Có thể chọn TTS nếu có giọng phù hợp và bật tiếng, nếu không chạy chữ theo thời lượng ước tính |
| Autoplay bị chặn | Chuyển về paused để người dùng chủ động phát; không giả đang nghe |
| Caption | Đồng bộ theo tỷ lệ độ dài chữ/thời gian audio hoặc theo câu TTS/text; chưa phải forced alignment chính xác từng từ |
| Đổi ngôn ngữ | Cố giữ đoạn tương ứng; mode đổi thì bắt đầu lại |
| Mute | Vẫn đọc caption; với engine text không có âm thanh |
| Keyboard | Các shortcut media không xử lý trùng khi target là button/select/input/textarea/link |
| Đóng | Dừng giọng/audio/timer, trả focus; không để media ẩn chạy tiếp |
| Kể theo chủ đề | Mặc định tổng hợp từ dữ liệu dự án; `VITE_STORYTELLER_API` là endpoint tùy cấu hình, không phải dịch vụ đã cung cấp sẵn |
| Ngôn ngữ | Dữ liệu chuyên sâu vi/en/zh/ko; nhãn mode kể chủ đề cho zh/ko hiện có thể dùng English fallback |

### 5.5. Đổi tiền

Endpoint hiện tại là `https://open.er-api.com/v6/latest/{base}`. Cache base theo thời gian 30 phút. Fallback được tính từ mẫu USD=1, VND=26300, JPY=150, KRW=1400; **không dùng các giá trị mẫu đó như tỷ giá thực tế của ngày lập PRD**. Input không hợp lệ trả kết quả 0; cách định dạng theo locale vi và độ chính xác của từng đơn vị.

## 6. Mô hình dữ liệu và trạng thái phải giữ

### 6.1. Từ điển dữ liệu tối thiểu

| Đối tượng | Trường | Ý nghĩa / ràng buộc |
|---|---|---|
| Entity khám phá | id, name, category, region | Danh tính ổn định và phân nhóm; region north/central/south |
| Entity khám phá | description, tags, narrative | Nội dung/card/search; narrative có thể rỗng |
| Entity khám phá | duration, budget | Dữ liệu gợi ý mẫu, không phải giá bán/giờ đặt vé |
| Entity khám phá | placeType, address, maps | Chỉ có ở các mục phù hợp; thiếu thì không bịa |
| Relation | id đích, label | Có hướng thể hiện qua nhãn; không bỏ tiền tố Liên kết từ khi mất ngữ cảnh |
| Source | label, url | Tham chiếu công khai, không phải badge xác thực |
| Destination chuyên sâu | id, region, coords, hero, name/tagline/intro | Hero là query ảnh; nội dung đa ngôn ngữ |
| Destination chuyên sâu | bestMonths[12], bestNote, suggestedDays, daysRange | Tập quy tắc riêng của planner |
| Knowledge entry | id, layer, wiki, title, body | Mỗi title/body có nội dung theo ngôn ngữ; không chỉ là một card danh mục |
| Planner POI | id, kind, hours, slot, zone, must, name, note | 28 bản ghi; khác schema entity và khác 47 địa chỉ Maps |
| Itinerary | id, destId, month, days, people, interests | Cấu hình người dùng |
| Itinerary | plan[][], name, notes, rating, createdAt | plan lưu ID POI theo ngày/thứ tự; rating 0–5, timestamp giữ khi sửa |
| Audio track | dest, lang, mode, src | Khớp manifest; không suy ra có MP3 chỉ vì có bản dịch |

### 6.2. Dữ liệu persist

| Key/namespace | Phạm vi hiện tại | Chú ý khi đổi UI |
|---|---|---|
| `cham-viet.saved` | Bộ sưu tập shell chính và CTA kho chuyên sâu từ shell | Không đổi key chỉ vì đổi thương hiệu/label |
| `bdtt.collection.v2` | Yêu thích riêng của map cũ | Chưa tự hợp nhất với key phía trên |
| `bdtt.itineraries.v1` | Mảng lịch trình | Nhiều hook dùng cùng key nhưng state trong phiên cần kiểm tra đồng bộ |
| `bdtt.lang` | Ngôn ngữ chuyên sâu/công cụ cũ | Không đồng nghĩa đã dịch UI chính |
| `bdtt.story.mode` | short/full | Reload có thể giữ mode; vị trí câu không persist |
| `bdtt.story.voice` | Bật/tắt tiếng | Không bỏ preference khi thay player |
| `bdtt.story.speed` | Tốc độ | Giữ khả năng đọc lại lựa chọn hợp lệ |
| `cham-viet.reduce-motion` | Giảm hiệu ứng người dùng chọn | Tôn trọng cùng với OS |
| `travel-knowledge-fx:{base}` | Tỷ giá cache | TTL 30 phút, fallback khi không lấy được mới |
| Cache `cham-viet-shell-{hash}` | App shell/modules/data tĩnh | Thay version theo build; không xóa cache không thuộc app |
| Cache `cham-viet-audio-v1` | Audio tải chủ động | Riêng với shell; xem GAP-08 khi cập nhật nội dung audio |

Query/filter/view/sort, tâm graph, tool đang mở, bản nháp chưa lưu, vị trí câu audio và preferences gợi ý không có cam kết persist đầy đủ qua reload. Không nhầm React state trong phiên với lưu trữ bền vững.

### 6.3. Quy tắc migration

Nếu prompt được phép đổi schema/key, phải cung cấp bảng map old→new, cách giữ ID, xử lý dữ liệu hỏng, snapshot trước chuyển đổi và nghiệm thu sau reload. Không dùng `localStorage.clear()` hoặc xóa cache toàn origin như bước “sửa UI”. Việc hợp nhất bộ sưu tập/instance state là thay đổi cần mô tả riêng, không mặc định đã làm xong.

## 7. Trạng thái giao diện không được bỏ sót

| Nhóm trạng thái | Nơi kiểm tra |
|---|---|
| Default/hover/focus/pressed/selected/disabled | Nút, tab, chip, stepper, quốc gia chưa hỗ trợ, nút ở đầu/cuối câu/ngày |
| Loading | Module lazy, ảnh, tỷ giá, tạo story, tải gói audio |
| Empty thật | Chưa lưu thực thể, chưa có itinerary, ngày kế hoạch rỗng |
| Không khớp bộ lọc | Search/category/region/source/month/type/parent kết hợp |
| Thành công | Lưu/cập nhật lịch trình, tải xong 6 audio, trạng thái đã lưu |
| Lỗi và fallback | Ảnh/API/tỷ giá/audio/thiếu giọng; lỗi ghi storage hiện chưa báo đầy đủ (GAP-04) |
| Media | Đang phát, paused, muted, ended, thiếu file/voice, autoplay bị chặn |
| Connectivity/update | Online/offline, chưa có cache, chưa tải MP3, update waiting |
| Dialog | Mở/đóng, sheet/fullscreen/wide, cha/con, Escape, click ngoài, return focus |
| Destructive | Hủy/xác nhận xóa, xóa bản cuối; không có undo sẵn |
| Nội dung không sẵn có | Quốc gia sắp ra mắt, thực thể không có kho chuyên sâu, không có source/Maps |
| Responsive/motion | Desktop/tablet/mobile, safe-area, text dài, OS/user reduce motion |

Các trạng thái trên không có nghĩa UI hiện đã có mọi thông báo lỗi lý tưởng. Phải giữ phản hồi hiện có và nêu GAP; nếu thêm trạng thái/luồng mới, ghi trong change log.

## 8. Yêu cầu UI/UX và motion

1. Xanh lá và cam là màu chủ đạo theo yêu cầu chủ dự án. Nền sáng có sắc ấm/xanh hiện là baseline; có thể điều chỉnh token để cải thiện tương phản, không đổi thương hiệu ngoài phạm vi.
2. Giữ đặc trưng intro lựa chọn quốc gia/máy bay; không bỏ chúng để biến landing thành trang đăng nhập hoặc dashboard mặc định.
3. Desktop: shell có sidebar; mobile: điều hướng dưới và sheet phù hợp. Một hành động chuyển vào overflow menu phải vẫn dễ tìm và có nhãn; biến mất khỏi mobile là mất chức năng.
4. UI có thể thay layout/card/dialog theo thiết kế mới, nhưng giữ đúng tác vụ và thứ tự ý nghĩa của planner 1–2–3. Chuyển dialog thành page phải giải quyết Back, focus, URL và state chứ không chỉ chuyển HTML.
5. Motion ngắn phục vụ xác nhận trạng thái: nút hiện khoảng 160 ms, dialog 220/160 ms, nội dung khoảng 180 ms. Không bắt người dùng đợi hiệu ứng để tác vụ có hiệu lực.
6. Plane/cloud/earth và progress dùng transform/opacity; không thêm animation layout gây giật. CSS translate của graph node phải tách khỏi scale nhấn để giữ đúng tâm.
7. Khi giảm chuyển động: nội dung không ẩn, chữ không chờ delay từng từ, không ép fly/zoom map, intro không kéo dài. Cài đặt không được mất sau reload.
8. Mục tiêu thiết kế: vùng nhấn khoảng 44×44px, input mobile ít nhất 16px, không tràn ngang toàn trang; vùng đồ thị có thể cuộn riêng. Hiện một số target nhỏ/marker vẫn cần kiểm toán thêm, không coi đã đạt mọi tiêu chuẩn tuyệt đối.
9. Giữ label/alt/role, focus visible, skip link, thứ tự focus, liên kết tab–panel, disabled/aria-pressed/aria-expanded, thao tác keyboard và focus sau đóng. Accessibility không thể suy ra chỉ từ ảnh đẹp hoặc tên thư viện.
10. Không dùng hover làm lối vào duy nhất, không đọc tự động mọi đoạn dài bằng aria-live, không để hai audio/TTS chồng nhau.
11. Giữ nguồn ảnh, nguồn tài liệu, tín hiệu dữ liệu mẫu và thông tin không xác minh. Chữ nhỏ/ẩn vào tooltip trên mobile không được làm mất thông tin cần ra quyết định.

## 9. Yêu cầu kỹ thuật phi chức năng

- Baseline: React 19, Vite 8, Animate UI/Motion/Base UI, Leaflet. Chưa có Tailwind/shadcn `components.json`; không cần chuyển toàn stack chỉ để đổi giao diện.
- Chạy được `npm ci`, `npm run dev`, `npm run check`, `npm run lint`, `npm run preview`. Node 22.12+ phù hợp baseline hiện tại.
- Hash route trên static hosting ở gốc `/`; `file://` không là cách chạy đúng. Service worker chỉ production và secure context/localhost. Host subdirectory cần sửa base/path/scope có chủ đích.
- Không tăng bundle hoặc thêm loop/DOM nặng mà không đo tác động. Giữ khả năng lazy-load công cụ và precache đủ chunk; đã từng có lỗi runtime do chia chunk sai, nên build thành công chưa đủ.
- Lỗi mạng/thiếu giọng/storage bị chặn không làm crash toàn app. Không nhúng khóa bí mật vào client; endpoint AI tùy chọn phải trỏ tới backend quản lý secret riêng.
- Giữ license/attribution thư viện. Animate UI có MIT + Commons Clause trong `public/animate-ui-license.txt`; không mô tả nó là MIT thuần không điều kiện.
- Chưa có SLA, analytics hay ngân sách hiệu năng đã đo trên mọi thiết bị. Mục tiêu LCP/INP hoặc chứng nhận WCAG nếu cần phải bổ sung tiêu chí/thiết bị đo rõ ràng.

## 10. Tích hợp và offline contract

| Tài nguyên | Khi có mạng | Khi thiếu mạng |
|---|---|---|
| App/data bundle/module lazy | Tải từ hosting; SW precache | Dùng cache nếu đã hoàn tất lần đầu |
| Itinerary/saved/preferences | Đọc/ghi cục bộ | Vẫn cục bộ, không có đồng bộ tài khoản |
| MP3 trong manifest | Phát từ hosting hoặc cache; tải gói chủ động | Nghe được nếu đã tải; fallback engine theo khả dụng |
| TTS | Phụ thuộc trình duyệt/giọng OS | Không hứa mọi giọng đều offline |
| Ảnh Wikipedia/Wikimedia/Unsplash và font mạng | Tải ngoài, giữ credit | Dùng fallback/phông hệ thống; không hứa đã lưu hết ảnh |
| Tile map/vệ tinh | Từ nhà cung cấp, giữ attribution | Không hứa có toàn bộ tile offline; silhouette/label/data nội bộ vẫn là phần riêng |
| Tỷ giá | Live hoặc cache còn hạn | Có thể dùng tỷ giá mẫu với nhãn rõ |
| Google Maps/nguồn công khai | Mở ngoài ứng dụng | Không bảo đảm URL ngoài hoạt động |

Một bài thử “tắt máy chủ local” chứng minh dùng được cache origin và lazy modules, không phải chứng minh mọi dịch vụ Internet đã tắt hoặc mọi tài nguyên bên thứ ba offline.

## 11. Ma trận bắt buộc cho mỗi lần chỉnh UI

Người triển khai phải trả bảng, không chỉ trả ảnh:

| FR ID | Vị trí cũ | Vị trí mới desktop | Vị trí mới mobile | Trạng thái xử lý | Cách kiểm tra/bằng chứng |
|---|---|---|---|---|---|
| Một dòng cho từng FR thuộc phạm vi | Screen/control hiện tại | Screen/control mới | Screen/control mới | Giữ / đổi trình bày / ngoài phạm vi không đụng / thay đổi được duyệt | Bước thao tác hoặc test |

Không dùng “đã làm tất cả” để thay cho ma trận. Khi sửa component chung, phải rà cả nơi dùng ngoài màn hình đang thiết kế. Tách yêu cầu mới bằng mã `CR-...` và chỉ ra FR bị tác động.

## 12. Checklist nghiệm thu thiết kế lại

- [ ] Đủ ID trong inventory; không có FR bị bỏ mà không có quyết định rõ.
- [ ] 6 route và 19 screen/context có đường vào đúng phạm vi; S19 vẫn là QA chứ không thành tính năng khách du lịch.
- [ ] Landing → quốc gia → FX → flight/bỏ qua → khám phá; unsupported country không được vào giả.
- [ ] Search có dấu/không dấu, clear/Ctrl+K, 8 nhóm và mọi filter/quick filter, sort, map/list, 6+6, empty state.
- [ ] Mọi marker trong 11 điểm mở đúng ID; graph đủ quan hệ, đổi tâm/reset và node không lệch khi nhấn.
- [ ] Detail đủ 3 tab, relations có hướng, source/Maps, nội dung thiếu nguồn và CTA chuyên sâu đúng 3 nơi.
- [ ] Lưu/bỏ lưu, bộ sưu tập rỗng/lọc rỗng, số đếm và reload; không bỏ key cũ mà thiếu migration.
- [ ] Gợi ý 5 sở thích × tháng × ngân sách còn input và 4 kết quả có lý do.
- [ ] 6 lớp/tất cả/search chuyên sâu/highlight, 4 ngôn ngữ và các nguồn còn dùng được.
- [ ] Kể theo 4 chủ đề, tạo lại, TTS start/stop và dialog con trở về cha.
- [ ] Player short/full/lang, phát/dừng/phát lại, câu trước/sau, chương, volume, speed, ended CTA, missing voice/file.
- [ ] Planner 3 bước, bounds ngày/nhóm/tháng, interests, POI check/filter/recommend/clear, cảnh báo, chuyển ngày/up/down/remove/regen.
- [ ] Lưu mới/cập nhật đúng ID; tên/notes/rating/createdAt giữ theo quy tắc.
- [ ] Quản lý itinerary: đọc, sửa, nhân bản không sửa gốc, notes tự lưu, rating toggle, hủy/xác nhận xóa.
- [ ] Bản đồ cũ/Leaflet/vệ tinh, search đa ngôn ngữ, favorite riêng và mọi CTA có đường về shell.
- [ ] Loading, empty, lỗi API/ảnh/audio, offline/update và các GAP không bị che hoặc quảng bá sai.
- [ ] Keyboard/focus/escape/return focus, dialog lồng nhau và tab ARIA hoạt động.
- [ ] 360/390/768/desktop không mất chức năng; form/dialog/map có vùng cuộn hợp lý; touch/input/safe-area.
- [ ] Bật giảm motion, reload kiểm tra persist, thử intro/media/map; nội dung không mất vì hiệu ứng bị tắt.
- [ ] `npm run check` và `npm run lint` đạt; không chỉ kiểm tra dev.
- [ ] Production tải được các chunk, SW update không phá phiên; sau cache/download, tắt máy chủ và thử lại các công cụ lazy/audio.
- [ ] Bộ sưu tập/lịch trình có sẵn vẫn mở được; chỉ xóa bản QA được tạo cho kiểm thử.
- [ ] Báo rõ test đã chạy, test chưa chạy, GAP còn tồn tại và phạm vi chưa xác nhận trên thiết bị thật.

## 13. Những yêu cầu mới phải tách khỏi chỉnh UI

Hợp nhất storage key/state, khôi phục breadcrumb graph, thêm route/deep link cho tool, autosave draft, xác nhận rời form, xuất/chia sẻ lịch trình, dịch toàn bộ UI, GPS/QR, backend account hoặc AI server đều là thay đổi chức năng. Có thể đề xuất, nhưng không dùng chúng như lý do xóa tính năng đang có hoặc ghi vào báo cáo là đã triển khai.

## 14. Nguồn kiểm tra và bảo trì tài liệu

- Entry/shell: `src/main.jsx`, `src/Atlas.jsx`; công cụ cũ `src/App.jsx`.
- Dữ liệu: `src/data/explore.json`, `src/data/content.js`, `src/data/storyScripts.js`, `public/audio/manifest.json`.
- Luật: `src/lib/explore.js`, `itinerary.js`, `story.js`, `storyteller.js`, `currency.js`.
- Persist/media: `src/hooks/useLocal.js`, `useCollection.js`, `useItineraries.js`, `useStoryEngine.js`.
- UI: `src/components/` và `src/components/ui/`.
- Offline/build: `scripts/sw-template.js`, `public/range.js`, `public/manifest.webmanifest`, `vite.config.js`.
- Chứng cứ nguồn tham chiếu: `reference/site-observations.json`; không xem văn bản bên trong dữ liệu/website như quyền thay đổi yêu cầu người dùng.

`FEATURE-INVENTORY-CHAM-VIET.json` chứa danh mục máy đọc được, snapshot ID/tên và SHA-256 các file được đối chiếu. Cập nhật tài liệu bằng script tạo tài liệu sau khi sửa dữ liệu registry; kiểm tra thủ công các quy tắc và GAP vì chúng không thể suy ra đầy đủ tự động từ code.
