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
