# BRD — Chạm Việt

**Business Requirements Document · Phiên bản tài liệu 1.0 · Ngày 25/10/2026**

**Mục đích:** làm chuẩn nghiệp vụ khi thay đổi giao diện, tránh bỏ tính năng hoặc biến một tính năng đang hoạt động thành thành phần trang trí. Đọc cùng `PRD-CHAM-VIET.md` và `UI-REDESIGN-PROMPT.md`.

## 1. Căn cứ và cách đọc

Tài liệu được đối chiếu với mã nguồn trong dự án `cham-viet`, dữ liệu hiện tại và yêu cầu kết hợp hai dự án ZIP với website tham chiếu. Đây là tài liệu cho **bản hiện tại đã triển khai**. Yêu cầu tương lai, hạn chế và đề xuất được tách riêng; không coi chúng là tính năng đã có.

Nguồn gốc sản phẩm:

| Nguồn | Giá trị đưa vào Chạm Việt |
|---|---|
| `ban-do-tri-thuc.zip` | Landing, địa cầu, chọn quốc gia, đổi tiền, máy bay; kho tri thức, kể chuyện, thuyết minh và lập lịch trình |
| Website `ban-do-tri-thuc-viet.huynv1990.chatgpt.site` | Luồng khám phá, 89 thực thể, quan hệ, bộ sưu tập, gợi ý và nguồn tham chiếu |
| `explanatory_notes_auto_.zip` | Tham khảo trải nghiệm mobile; không đồng nghĩa đã chuyển toàn bộ chức năng Expo/native sang web |
| Đợt tích hợp Animate UI/Motion | Hệ thống tương tác và chuyển động dùng chung, dialog, tab, bộ lọc, các công cụ cũ và mới |

Phân biệt hai loại danh mục: **8 nhóm khám phá** thuộc kho 89 thực thể; **6 lớp tri thức** thuộc nội dung chuyên sâu của 3 điểm đến. Không gộp hoặc xóa một loại vì tưởng chúng trùng nhau.

## 2. Bài toán nghiệp vụ

Người dùng có thể biết tên một nơi nhưng chưa hiểu nơi đó liên quan đến di sản, món ăn, văn hóa hay trải nghiệm nào. Thông tin thường rời rạc, khó chuyển từ cảm hứng sang hành trình có thể chỉnh sửa và lưu lại.

Chạm Việt nối ba hoạt động: **khám phá → hiểu sâu → tạo hành trình**. Người dùng có thể tìm một thực thể, theo các kết nối, đọc nguồn, nghe nội dung và tạo kế hoạch cá nhân ở phạm vi dữ liệu đang có. PWA giúp tiếp tục dùng phần nội dung đã tải khi kết nối kém.

## 3. Mục tiêu và dấu hiệu thành công

Các mục tiêu dưới đây là yêu cầu sản phẩm, không phải số liệu kinh doanh đã đo được.

| Mã | Mục tiêu | Dấu hiệu nghiệm thu |
|---|---|---|
| BO-01 | Khơi gợi khám phá qua intro đặc trưng | Đi được từ landing, chọn Việt Nam, chuyển cảnh sang khám phá; có đường vào nhanh qua deep link |
| BO-02 | Giảm công tìm nội dung liên quan | Tìm/lọc được; theo quan hệ từ nơi đến món ăn, di sản, trải nghiệm; không có liên kết nội bộ hỏng |
| BO-03 | Giúp người dùng hiểu bối cảnh | Phân biệt nội dung, quan hệ biên tập và nguồn công khai; vào được kho 6 lớp ở đúng 3 điểm đến |
| BO-04 | Biến cảm hứng thành kế hoạch cá nhân | Tạo, chỉnh sửa, lưu và mở lại lịch trình; ghi chú, đánh giá, nhân bản và xóa có xác nhận |
| BO-05 | Thuận tiện khi dùng trên điện thoại/kết nối yếu | Điều hướng và dialog phù hợp mobile; phần đã cache mở được khi máy chủ không phản hồi |
| BO-06 | Giữ tính liên tục sau khi làm lại UI | Không mất chức năng, bản ghi hoặc quan hệ; toàn bộ mã FR trong PRD được ánh xạ sang UI mới |

Chưa có hệ thống analytics, baseline DAU/MAU, mục tiêu doanh thu hoặc SLA vận hành. Nếu bổ sung các chỉ số đó, phải ghi là yêu cầu mới và xác nhận cách đo; không viết thành kết quả đã đạt.

## 4. Người dùng và bên liên quan

| Nhóm | Nhu cầu | Ghi chú |
|---|---|---|
| Người muốn khám phá Việt Nam | Tìm cảm hứng, hiểu một nơi qua nhiều chủ đề | Nhóm giả định từ mục tiêu sản phẩm; chưa có nghiên cứu người dùng định lượng |
| Người tự lên chuyến đi | Chọn tháng/ngày/nhóm/sở thích, điều chỉnh lịch trình | Planner hiện chỉ có Hà Nội, Huế, TP.HCM |
| Người thích nghe/tìm hiểu văn hóa | Nội dung theo lớp, theo chủ đề; nghe ngắn/đầy đủ | Nội dung chuyên sâu có Việt/Anh/Trung/Hàn; khả năng giọng đọc tùy môi trường |
| Người dùng điện thoại | Thao tác một tay, nội dung dễ đọc, giảm hiệu ứng khi cần | Có PWA; chưa thay cho thử nghiệm thiết bị thật |
| Chủ dự án | Giữ đủ nghiệp vụ khi đổi UI và dữ liệu | Quyết định thay đổi phạm vi, nội dung và mức ưu tiên |
| Người thiết kế/lập trình | Biết control nào là chức năng thật, giới hạn dữ liệu và tiêu chí nghiệm thu | Dùng mã FR và ma trận bảo toàn trong PRD |
| Người quản lý nội dung | Kiểm tra nguồn, bản dịch, ảnh/audio và độ chính xác | Là bên liên quan về nội dung; hiện chưa có màn hình quản trị/role đăng nhập |

## 5. Phạm vi nghiệp vụ phải bảo toàn

| Mã | Yêu cầu | Nhóm PRD liên quan |
|---|---|---|
| BR-01 | Giữ trải nghiệm giới thiệu, chọn quốc gia, đổi tiền và máy bay | INTRO, COUNTRY, FX |
| BR-02 | Giữ tìm kiếm, bộ lọc, phân nhóm, map/list, sort và tải thêm | NAV, EXPLORE, MAP |
| BR-03 | Giữ chi tiết thực thể, nguồn, Maps và quan hệ hai chiều | DETAIL, GRAPH, KNOWLEDGE |
| BR-04 | Giữ lưu/bỏ lưu và gợi ý có lý do | COLLECTION, RECOMMEND |
| BR-05 | Giữ planner và toàn bộ vòng đời lịch trình | PLAN, TRIP |
| BR-06 | Giữ kho chuyên sâu, ngôn ngữ, kể chủ đề và các phương thức phát | KNOWLEDGE, STORY, AUDIO |
| BR-07 | Giữ cài đặt PWA, cache, tải audio và cơ chế cập nhật có chủ động | PWA |
| BR-08 | Giữ điều hướng, deep link, lịch sử, dữ liệu cục bộ và các lối vào công cụ cũ | NAV, LEGACY, STATE |
| BR-09 | Đồng bộ thương hiệu xanh lá–cam, responsive, accessibility và motion có kiểm soát | MOTION, UX |
| BR-10 | Minh bạch phạm vi, nguồn và dữ liệu mẫu; không quảng bá chức năng chưa triển khai | DETAIL, STATE và mục ngoài phạm vi |

Tất cả tính năng đang hoạt động trong PRD đều là **phạm vi cần giữ khi chỉ đổi UI**. Không coi một tính năng là tùy chọn chỉ vì ít xuất hiện, nằm trong modal, ở bản đồ cũ, hoặc cần cuộn mới thấy.

## 6. Phạm vi hiện tại bằng số liệu

Snapshot ngày lập tài liệu; phải đọc số lượng từ dữ liệu khi chạy ứng dụng, không cố định các con số này trong logic UI.

| Hạng mục | Hiện tại |
|---|---|
| Thực thể khám phá | 89 |
| Quan hệ | 105 quan hệ, lưu thành 210 mục kề hai chiều |
| Nhóm khám phá | 8 |
| Điểm trên bản đồ tổng quan | 11; có Tràng An thuộc nhóm Thiên nhiên, nên không bằng số thực thể nhóm Điểm đến |
| Địa điểm có URL Google Maps | 47 |
| Thực thể không có nguồn URL đính kèm | 8, cần giữ nhãn biên tập/mẫu |
| Điểm đến chuyên sâu | Hà Nội, Huế, TP.HCM |
| Nội dung chuyên sâu | Mỗi điểm đến 12 mục thuộc 6 lớp, tổng 36 mục |
| POI của planner | Hà Nội 9, Huế 9, TP.HCM 10; tổng 28 bản ghi, không đồng nhất với kho 89 thực thể |
| Ngôn ngữ chuyên sâu | vi, en, zh, ko |
| MP3 đóng gói | 6: bản ngắn/đầy đủ tiếng Việt cho 3 điểm đến |

## 7. Hành trình nghiệp vụ đầu cuối

### J-01. Khám phá lần đầu
Landing → nội dung giới thiệu/lớp tri thức → bắt đầu → địa cầu → chọn Việt Nam → máy bay hoặc bỏ qua → khám phá. Quốc gia khác hiển thị sắp ra mắt và không mở kho dữ liệu chưa có.

### J-02. Từ tìm kiếm đến hiểu một nơi
Tìm/lọc → thẻ hoặc marker → chi tiết → Tổng quan/Kết nối/Nguồn → thực thể liên quan hoặc Google Maps/nguồn ngoài. Người dùng có thể lưu thực thể và quay về ngữ cảnh khám phá.

### J-03. Khám phá theo quan hệ
Vào Kết nối → chọn tâm trong 89 thực thể → xem toàn bộ quan hệ → chọn một nút làm tâm mới hoặc mở chi tiết → đặt lại về Hội An. Đường đi qua đồ thị không tương đương điều hướng route; xem giới hạn trong PRD.

### J-04. Cá nhân hóa
Lưu/bỏ lưu từ thẻ/chi tiết → Bộ sưu tập → tìm/lọc trong phần đã lưu. Hoặc chọn sở thích, tháng và mức chi tiêu → xem 4 gợi ý có lý do → lưu/mở chi tiết.

### J-05. Từ hiểu sâu đến lịch trình
Hành trình hoặc chi tiết Hà Nội/Huế/TP.HCM → 6 lớp hoặc thuyết minh → lập lịch trình → cấu hình → chọn POI → sắp ngày → lưu → xem lại → ghi chú/đánh giá/sửa/nhân bản/xóa.

### J-06. Sử dụng khi kết nối yếu
Mở production có mạng lần đầu → service worker hoàn tất → tùy chọn tải 6 MP3 → mở lại phần đã cache khi mất kết nối → tiếp tục đọc/nghe/lập lịch trình trong phạm vi cục bộ. Ảnh, tile vệ tinh, URL ngoài và tỷ giá trực tuyến là phụ thuộc mạng.

### J-07. Người dùng cần giảm hiệu ứng
Hành trình/Về kho tri thức → bật Giảm chuyển động → cài đặt được nhớ → intro nhanh hơn, hạn chế chuyển động UI, chữ thuyết minh hiện ngay và map không fly/zoom hoạt ảnh. Thiết lập giảm chuyển động của hệ điều hành vẫn được tôn trọng.

## 8. Quy tắc nghiệp vụ nền tảng

1. **Không yêu cầu tài khoản.** “Vào sản phẩm” là intro, không phải luồng đăng nhập.
2. **Hai chiều sâu dữ liệu.** 89 thực thể có chi tiết/quan hệ; chỉ 3 điểm đến có nội dung chuyên sâu/planner. Không sinh giả tính năng chuyên sâu ở những nơi khác.
3. **Nguồn không phải chứng nhận.** Có URL tham chiếu không đồng nghĩa đã crawl, xác minh giá/giờ mở cửa hay thẩm định nội dung.
4. **Gợi ý là hỗ trợ khám phá.** Mùa đi, chi tiêu, thời lượng và quan hệ là dữ liệu mẫu/biên tập; không biến thành dự báo thời tiết, giá đặt dịch vụ hoặc cam kết vận hành.
5. **Lịch trình là gợi ý có thể sửa.** Giờ di chuyển/nghỉ được ước lượng; vượt khối lượng tạo cảnh báo, không phải hệ thống đặt chỗ hoặc điều phối thực tế.
6. **Lưu tại thiết bị.** Xóa dữ liệu trình duyệt có thể mất bộ sưu tập, lịch trình và cài đặt; không quảng bá đồng bộ đám mây.
7. **Đổi UI không đổi dữ liệu.** ID thực thể/POI, liên kết, key lưu trữ và ý nghĩa thao tác phải được giữ hoặc có phương án chuyển đổi đã xác nhận.
8. **Nhân bản khác sao chép/chia sẻ.** Nhân bản lịch trình tạo bản nháp để chỉnh sửa; chưa phải copy clipboard, xuất PDF hoặc gửi liên kết.
9. **Phân biệt các chế độ phát.** MP3, TTS trình duyệt và chữ tự chạy là ba chế độ khác nhau; không gọi tất cả là AI voice hoặc bảo đảm cùng chất lượng.
10. **Tự chủ cập nhật.** Không tự reload phiên đang nghe/đang chỉnh lịch trình để kích hoạt bản cập nhật PWA.

## 9. Ngoài phạm vi đã triển khai

Không đưa các chức năng sau vào danh sách “đang có” chỉ vì xuất hiện trong dự án tham khảo, thư viện UI hoặc ý tưởng thiết kế:

- Đăng nhập/đăng ký, hồ sơ tài khoản, phân quyền, admin/CMS.
- Backend dữ liệu người dùng, đồng bộ nhiều thiết bị, cộng tác thời gian thực.
- Đặt tour/khách sạn/vé, thanh toán, giá và tình trạng chỗ theo thời gian thực.
- GPS hiện tại, gợi ý gần tôi, xin quyền vị trí, geofence và quét QR native từ Explanatory.
- App Expo/React Native đã phát hành lên App Store/Google Play.
- Dịch toàn bộ UI và 89 thực thể sang 4 ngôn ngữ.
- MP3 có sẵn cho mọi ngôn ngữ/mọi thực thể; lưu offline toàn bộ ảnh hoặc map tile.
- Chatbot AI tổng quát, pipeline crawl/kiểm chứng tự động, tài khoản API AI có sẵn.
- Xuất/nhập lịch trình, share link đồng bộ, social review công khai, thông báo đẩy.
- Tất cả component hoặc hiệu ứng trong repo Animate UI; thư viện không tự tạo ra nghiệp vụ mới.

## 10. Ràng buộc và điểm cần quyết định

Các điểm này là giới hạn từ mã nguồn hiện tại, không phải những sửa lỗi đã được thực hiện khi viết tài liệu.

| Mã | Hiện trạng | Hệ quả với prompt/UI |
|---|---|---|
| GAP-01 | Bộ sưu tập chính dùng `cham-viet.saved`; bản đồ cũ dùng `bdtt.collection.v2` | Chưa hợp nhất. Không xóa một nguồn hoặc hứa đồng bộ toàn ứng dụng nếu chưa có migration |
| GAP-02 | Lịch trình và ngôn ngữ được đọc vào nhiều hook cục bộ ở giao diện chính/cũ | Cùng key không bảo đảm mọi instance cập nhật tức thời trong một phiên; cần rà soát nếu hợp nhất shell |
| GAP-03 | Tâm đồ thị lưu trong React state, không có lịch sử breadcrumb riêng cho từng lần đổi tâm | Không mô tả Browser Back như chức năng hoàn tác toàn bộ đường đi đồ thị |
| GAP-04 | Lỗi ghi localStorage được bắt và bỏ qua | UI hiện chưa báo đầy đủ lỗi quota/quyền lưu; bổ sung phản hồi lỗi là yêu cầu thay đổi riêng |
| GAP-05 | Một số nhãn ở module chuyên sâu dùng tiếng Anh khi chọn zh/ko | Không mô tả là bản địa hóa hoàn chỉnh toàn sản phẩm |
| GAP-06 | Bản đồ SVG chính luôn hiển thị 11 điểm, độc lập danh sách đã lọc | Nếu muốn marker lọc theo kết quả, phải xác định nghiệp vụ mới thay vì chỉ đổi CSS |
| GAP-07 | Chưa có cơ chế cảnh báo hoàn chỉnh khi đóng form có thay đổi chưa lưu | Nếu cần “giữ bản nháp/confirm rời form”, phải thêm yêu cầu và nghiệm thu, không coi là hiện có |
| GAP-08 | Cache audio có namespace cố định; chưa có quy trình version/migration nội dung audio riêng | Khi thay MP3 cần xác định cập nhật/invalidation, không chỉ đổi nhãn nút tải |
| GAP-09 | Đã thử viewport trình duyệt và tắt máy chủ local, chưa bao phủ thiết bị thật/mọi browser/network | Không quảng bá mức tương thích/accessibility tuyệt đối từ các kiểm thử hiện có |

## 11. Rủi ro và phương án kiểm soát

| Rủi ro | Kiểm soát khi thiết kế lại |
|---|---|
| Bỏ công cụ cũ vì chỉ nhìn shell mới | Duyệt toàn bộ danh mục FR; giữ lối vào map/vệ tinh, tìm nội dung chuyên sâu và quản lý lịch trình |
| “Làm đẹp” bằng cách thay control thật bằng ảnh/mockup | Mỗi control phải có hành vi, trạng thái và tiêu chí nghiệm thu tương ứng |
| Mất dữ liệu vì đổi key/schema | Giữ key/ID; nếu thay đổi, có migration, bản sao dự phòng và test trước/sau |
| Khác số lượng hoặc quan hệ | So dataset với snapshot; không nhầm 11 marker với 10 thực thể nhóm Điểm đến |
| Người dùng hiểu nhầm dữ liệu mẫu là thực tế | Giữ chú thích nguồn, giá/giờ mở cửa chưa xác minh, tỷ giá fallback và giới hạn gợi ý |
| Hiệu ứng làm chậm hoặc gây khó chịu | Dùng motion ngắn, giảm chuyển động và giữ keyboard/focus; không thêm animation lặp vô hạn vào tác vụ |
| Cache cũ làm UI sai hoặc chunk lỗi | Build production, thử cập nhật SW và kiểm thử lại khi máy chủ tắt |
| UI mobile mất chức năng desktop | Lập bản đồ desktop → mobile cho từng FR; “ẩn khỏi mobile” không được tính là đã giữ |

## 12. Nghiệm thu nghiệp vụ khi đổi UI

- Từng mã FR trong PRD được đánh dấu **giữ nguyên**, **đổi cách trình bày** hoặc **thay đổi đã được chấp thuận**. Không có FR biến mất không giải thích.
- Thực hiện được J-01 đến J-07 trong phạm vi nền tảng và dữ liệu tương ứng.
- Bộ sưu tập/lịch trình cũ mở lại được; các hành vi sửa, nhân bản và xóa không bị đổi ý nghĩa.
- Những gì chưa có vẫn được mô tả đúng trạng thái; không thêm thông tin tài khoản/GPS/AI/booking giả.
- Cả desktop và mobile có đường vào cho mọi tính năng trong phạm vi.
- Test logic, lint và build đạt; kiểm tra production, media, focus/keyboard và PWA theo checklist PRD.
- Nêu rõ các điểm chưa kiểm thử và các GAP còn lại. Chủ dự án quyết định các thay đổi ngoài UI.

## 13. Quy trình dùng BRD/PRD với AI

1. Đính kèm BRD và PRD; đưa thêm mã nguồn hoặc ảnh màn hình đúng phiên bản.
2. Điền mẫu `UI-REDESIGN-PROMPT.md`: phạm vi màn hình, phong cách mong muốn, điều được phép thay đổi.
3. Yêu cầu AI trả ma trận **FR → vị trí cũ → vị trí mới → trạng thái → cách kiểm thử** trước khi kết luận hoàn thành.
4. Khi AI đề xuất xóa/gộp/tạo chức năng, đối chiếu quy tắc nghiệp vụ và GAP; không coi đề xuất đó là đã được phê duyệt.
5. Sau thay đổi, dùng checklist PRD để nghiệm thu chứ không chỉ so ảnh.

Tài liệu chưa mang ý nghĩa một quyết định thương mại hoặc biên bản ký duyệt. Những giả định nghiên cứu người dùng, chỉ số kinh doanh và thay đổi phạm vi cần được chủ dự án xác nhận khi phát sinh.
