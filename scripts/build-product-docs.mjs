import fs from 'node:fs';
import crypto from 'node:crypto';
import { DESTINATIONS, LAYERS, KIND_ORDER } from '../src/data/content.js';

const modules=[];
function module(code,name,br,screens,sources,rows){
  modules.push({code,name,businessRequirement:br,screens,sources,features:rows.map((r,i)=>({id:`FR-${code}-${String(i+1).padStart(2,'0')}`,title:r[0],behavior:r[1],states:r[2],acceptance:r[3],status:'implemented-source-reviewed'}))});
}
module('INTRO','Landing và mở sản phẩm','BR-01','S01,S03',['src/components/LandingPage.jsx','src/components/TravelTransition.jsx','src/Atlas.jsx'],[
 ['Landing giới thiệu','Hero, định vị sản phẩm, phần giới thiệu, sáu lớp, minh họa hành trình và CTA cuối trang.','Đầu trang; cuộn; màn hình hẹp.','Đọc và đi tới mọi phần trên desktop/mobile.'],
 ['Điều hướng landing','Trang chủ, Về dự án, Lớp tri thức và nút cuộn; cuộn có kiểm soát khi giảm motion.','Đúng anchor; giảm chuyển động.','Nút đến đúng phần, không che nội dung bởi header.'],
 ['CTA vào trải nghiệm','Các CTA thật mở bước chọn quốc gia; nút trong minh họa điện thoại cũng có lối bắt đầu.','Chuột; bàn phím; touch.','CTA không thành ảnh hoặc text vô tác dụng sau redesign.'],
 ['Chuyển cảnh','Máy bay, mây, địa cầu dùng transform/opacity; bình thường khoảng 2.7 giây, giảm motion khoảng 150 ms.','Đang bay; hoàn tất; reduced motion.','Kết thúc đúng một luồng vào Khám phá, không kẹt màn hình.'],
 ['Bỏ qua và phát lại intro','Nút Vào khám phá bỏ qua chuyển cảnh; Về kho tri thức có đường xem lại landing/chọn quốc gia.','Bỏ qua giữa hiệu ứng; vào lại.','Có thể vào nhanh và xem lại intro mà không xóa dữ liệu lưu.'],
]);
module('COUNTRY','Địa cầu và chọn quốc gia','BR-01','S02',['src/components/GlobeExplorer.jsx'],[
 ['Bốn quốc gia','Hiển thị Việt Nam, Hoa Kỳ, Nhật Bản, Hàn Quốc với cờ, khu vực và tiền tệ.','Đang chọn; sắp ra mắt.','Không mở dữ liệu du lịch giả của quốc gia chưa hỗ trợ.'],
 ['Tìm quốc gia','Tìm theo tên Việt/Anh, không phân biệt hoa thường; hiện danh sách khi focus/gõ, xóa được.','Danh sách có/rỗng; Enter; Escape.','Enter chọn kết quả đầu; Escape đóng danh sách; không nhầm với tìm không dấu ở kho chính.'],
 ['Chọn và xoay địa cầu','Chọn quốc gia đổi thông tin, vị trí góc nhìn địa cầu và tiền tệ mặc định.','Chọn từng quốc gia; quay về Việt Nam.','Thông tin tên/cờ/tiền tệ/địa cầu nhất quán với quốc gia vừa chọn.'],
 ['Khả dụng CTA','Việt Nam cho Khám phá; ba quốc gia khác giữ nút vô hiệu/sắp ra mắt.','Enabled; disabled.','Không thể dùng bàn phím để vượt qua trạng thái chưa hỗ trợ.'],
 ['Quay lại giới thiệu','Brand hoặc nút quay lại đưa về landing.','Từ đầu hoặc đang mở đổi tiền.','Đường quay lại luôn dùng được, không mất bộ sưu tập/lịch trình.'],
]);
module('FX','Đổi tiền tham khảo','BR-01','S02',['src/components/GlobeExplorer.jsx','src/lib/currency.js'],[
 ['Mở/đóng đổi tiền','Khối tiền tệ mở Collapsible trong bước chọn quốc gia; có nút đóng.','Mở; đóng.','Mở được lại sau khi đóng, aria-expanded phản ánh đúng.'],
 ['Nhập số tiền','Input số, min 0, inputMode decimal; rỗng/không hợp lệ/âm được logic quy đổi xử lý về 0.','Rỗng; 0; số dương; giá trị không hợp lệ.','Không crash hoặc hiện NaN; không bỏ quyền nhập trên mobile.'],
 ['Chọn đơn vị','Từ/Sang hỗ trợ VND, USD, JPY, KRW; khởi tạo theo quốc gia đã chọn.','Mỗi cặp; cùng đơn vị.','Kết quả theo đúng base/target đang hiển thị.'],
 ['Đảo chiều','Đổi chỗ tiền nguồn và đích, tính lại kết quả.','Đang tải; đã có tỷ giá.','Tên hai đơn vị và kết quả đổi đồng thời, không chỉ đảo icon.'],
 ['Nguồn và fallback','Fetch tỷ giá, cache theo base 30 phút; lỗi mạng dùng tỷ giá mẫu. USD làm tròn 2 số; VND/JPY/KRW 0 số.','Loading; live; cache; fallback.','Giữ nhãn tham khảo/ngày và thông báo mẫu offline; không mô tả tỷ giá mẫu như dữ liệu mới xác minh.'],
]);
module('NAV','Shell và điều hướng','BR-08','S04–S09',['src/Atlas.jsx','src/lib/explore.js','public/manifest.webmanifest'],[
 ['Sáu route chính','explore, graph, saved, suggest, tools, about; fallback route không nhận dạng về explore.','Route hợp lệ/không hợp lệ.','Mỗi route có đường vào và nội dung đúng; không cần URL server riêng cho từng view.'],
 ['Desktop sidebar','Khám phá, Kết nối, Bộ sưu tập có số đếm, Gợi ý, Hành trình; brand về Khám phá.','Mục đang chọn; số đếm thay đổi.','Không mất menu hoặc số đếm khi thu hẹp vùng làm việc.'],
 ['Mobile navigation','Thanh dưới chứa cùng 5 đích chính; hướng dẫn/about vào qua header.','Safe-area; view hẹp.','Mọi đích nghiệp vụ có đường tới trên mobile, không chỉ desktop.'],
 ['Deep link và khởi động','URL không hash mở landing; URL có hash vào app. Chi tiết dùng ?entity=ID; hash cũ #explore/#graph còn đọc được.','Link trực tiếp; reload; ID không tồn tại.','Link thực thể hợp lệ mở đúng chi tiết; ID lạ không gây crash.'],
 ['Back và đóng chi tiết','Mở chi tiết tạo lịch sử; đóng/Back về route thích hợp; đi sang quan hệ cập nhật thực thể.','Close; Back; Forward; related item.','Không rời site ngoài ý muốn trong luồng chi tiết; không hứa lịch sử đổi tâm graph khi chưa có.'],
 ['Ngẫu nhiên và trợ giúp','Sidebar có Khám phá ngẫu nhiên trong 89 mục; header/about có hướng dẫn.','Chọn lại; mở chi tiết.','Ngẫu nhiên mở chi tiết thật, không luôn mở thuyết minh chỉ có ở 3 nơi.'],
 ['Chuyển trang và filter state','Menu chính gọi reset bộ lọc/limit; scroll đầu trang khi đổi stage/page. Reset không xóa bộ sưu tập.','Đang lọc; đang cuộn.','Ngữ cảnh không kẹt ở đáy trang; không biến reset filter thành xóa dữ liệu.'],
]);
module('EXPLORE','Tìm kiếm và danh sách khám phá','BR-02','S04,S07',['src/Atlas.jsx','src/lib/explore.js','src/data/explore.json'],[
 ['Tìm không dấu','Tìm trên tên, mô tả và tags; chuẩn hóa hoa thường, dấu và đ/Đ.','Có kết quả; không kết quả; rỗng.','ha noi tìm được Hà Nội; xóa từ khóa trả lại kết quả theo filter còn lại.'],
 ['Ô tìm kiếm và shortcut','Xóa từ khóa; Ctrl/Cmd+K focus vào ô tìm ở màn hình có ô đó.','Focus; clear; bàn phím.','Không bỏ nút xóa/shortcut hoặc tạo shortcut nuốt thao tác form khác.'],
 ['Tám nhóm tri thức','Tất cả và 8 nhóm; chọn một nhóm tại một thời điểm.','Active; inactive.','Không nhầm nhóm khám phá với 6 lớp chuyên sâu.'],
 ['Bộ lọc mở rộng','Mở/đóng khối filter, lọc Bắc/Trung & Tây Nguyên/Nam.','Collapsed; expanded; từng vùng.','Đóng khối không vô tình xóa lựa chọn.'],
 ['Filter nguồn','Tất cả, có nguồn tham chiếu, biên tập mẫu không có nguồn URL.','Có nguồn; không nguồn.','Không phân loại có URL thành đã được thẩm định.'],
 ['Filter tháng','Tất cả tháng hoặc 1–12 theo tập mùa tham khảo từng vùng.','Tháng hợp/không hợp vùng.','Đổi tháng thực sự thay tập kết quả; ghi rõ tính chất tham khảo.'],
 ['Filter điểm đến cha','Dropdown 11 điểm; chỉ lấy quan hệ có nhãn địa điểm của điểm đến đó.','Tất cả; một cha; tập rỗng.','Đúng địa điểm ăn/chơi liên quan, không chỉ tìm tên bằng chuỗi.'],
 ['Filter loại địa điểm','11 loại hiện có sinh từ dữ liệu, ví dụ cà phê, chợ, ngoài trời, nghệ thuật.','Tất cả; một loại; giao nhiều filter.','Danh sách không hardcode bỏ sót loại; filter kết hợp theo giao.'],
 ['Quick filters','Vui chơi/Ăn uống chọn category và xóa type; Cà phê/Chợ xóa category và chọn type.','Từng shortcut; filter khác còn giữ.','Bốn nút có logic riêng và không chỉ thay trạng thái tô màu.'],
 ['Map và list','Chuyển bố cục map+thẻ hoặc chỉ danh sách.','Map; list; mobile.','Cả hai vẫn mở chi tiết và lưu được.'],
 ['Đếm và sắp xếp','Hiện số mục sau lọc; mặc định theo thứ tự dữ liệu, hoặc A–Z theo locale vi.','Suggested; A–Z.','Không gọi sort mặc định là thuật toán cá nhân hóa của trang Gợi ý.'],
 ['Tải thêm và rỗng','Khởi tạo tối đa 6 mục; Xem thêm tăng 6; empty state và reset.','Còn mục; đã hết; không kết quả.','Không làm mất các mục ngoài 6 mục đầu; nút tải thêm hết thì ẩn.'],
 ['Thẻ kết quả','Ảnh/fallback, nhóm, vùng, tên, mô tả, số kết nối/nguồn; vùng ảnh/tên mở chi tiết.','Ảnh tải/lỗi; nội dung dài.','Không thay dữ liệu thật bằng card trang trí; mọi entry vẫn có đường mở.'],
]);
module('MAP','Bản đồ tổng quan SVG','BR-02','S04,S07',['src/Atlas.jsx','src/lib/explore.js','public/data/vietnam.geojson'],[
 ['11 marker','Hội An, Hà Giang, Tràng An, Huế, Cần Thơ, Hạ Long, Hà Nội, Đà Lạt, TP.HCM, Đà Nẵng, Phú Quốc.','Click; Enter/Space trên marker.','Mọi marker mở đúng thực thể; miền Nam không bị ghi chú che.'],
 ['Zoom và reset','Tăng/giảm hệ số 1–2, bước 0.25; đặt lại 1.','Min; max; reset.','Nút hoạt động và không zoom vô hạn.'],
 ['Ngữ cảnh địa lý','Giữ nền Việt Nam, Biển Đông và chú thích quần đảo minh họa.','Có/không tải được geoJSON.','Không trình bày sơ đồ thành GPS hoặc vị trí đảo chính xác đã khảo sát.'],
 ['Độc lập filter','Hiện tại map luôn là 11 điểm tổng quan; bộ lọc tác động danh sách.','Lọc rỗng nhưng map vẫn có điểm.','Nếu đổi sang marker đồng bộ filter, phải ghi thay đổi nghiệp vụ và có test riêng.'],
]);
module('DETAIL','Chi tiết thực thể','BR-03','S10',['src/Atlas.jsx','src/data/explore.json','src/components/ui/AnimatedSheet.jsx'],[
 ['Header và nội dung chung','Tên, nhóm/vùng, mô tả, tags, ảnh minh họa/nguồn ảnh; lưu/bỏ lưu.','Nội dung ngắn/dài; ảnh lỗi.','Mở đúng ID từ thẻ, map, graph và gợi ý.'],
 ['Tab Tổng quan','Thời lượng, chi tiêu, số quan hệ, narrative và liên kết liên quan.','Có/không narrative hoặc địa chỉ.','Không tạo dữ liệu bịa cho trường rỗng; giữ chú thích dữ liệu mẫu.'],
 ['Thông tin POI','47 mục có địa chỉ/type/Google Maps; giờ mở cửa và giá chưa xác minh được nêu rõ.','Có/không Maps.','Maps mở đúng URL; không thêm giờ/giá xác thực giả.'],
 ['Tab Kết nối','Toàn bộ quan hệ của thực thể, tên đích và nhãn có hướng/ngược.','Không/ít/nhiều quan hệ.','Chọn một quan hệ mở đúng ID đích, không giới hạn 4 gợi ý thành toàn bộ quan hệ.'],
 ['Tab Nguồn','Danh sách label+URL; trạng thái không có nguồn và thông tin biên tập.','Có URL; không nguồn; nguồn ngoài lỗi.','Giữ đường mở gốc và các chú thích về thẩm định.'],
 ['Các lối đi tiếp','Tổng quan có gợi ý liên quan đầu tiên; xem mọi địa điểm ăn/chơi của điểm đến; xem trên graph.','Điểm đến/POI; chuyển route.','CTA cập nhật đúng filter cha hoặc tâm graph trước khi điều hướng.'],
 ['Công cụ chuyên sâu đúng phạm vi','Chỉ Hà Nội/Huế/TP.HCM có CTA 6 lớp, audio và planner.','Có/không nội dung chuyên sâu.','Không hứa tính năng chuyên sâu cho 86 mục còn lại.'],
 ['Tương tác dialog/tab','Đóng, Escape, click ngoài, focus trap/trả focus; tab liên kết ARIA, Arrow chuyển focus, Enter/Space chọn.','Desktop dialog; mobile sheet; lồng dialog.','Dùng được bằng keyboard và không cho focus lạc ra lớp nền.'],
]);
module('GRAPH','Bản đồ kết nối','BR-03','S05',['src/Atlas.jsx','src/data/explore.json'],[
 ['Chọn tâm','Dropdown chọn trong toàn bộ 89 mục, mặc định Hội An.','Chọn trực tiếp; giữ state trong phiên.','Không giới hạn dropdown còn 11 marker/3 điểm chuyên sâu.'],
 ['Đủ quan hệ','Đồ thị hiển thị các nút và đường nối; list cung cấp đủ hàng và nhãn.','Tâm ít/nhiều quan hệ.','Hội An có 15 quan hệ; không chỉ render 8 nút rồi bỏ các mục còn lại.'],
 ['Đổi tâm bằng quan hệ','Click nút đồ thị hoặc dòng liên quan đổi tâm.','Đi qua nhiều thực thể.','Tên tâm, số lượng, nodes và danh sách cùng cập nhật.'],
 ['Mở chi tiết và đặt lại','Nút tâm/Đọc câu chuyện mở chi tiết; đặt lại về Hội An.','Reset; detail; close.','Mở đúng thực thể đang làm tâm, không nhầm điểm đầu.'],
 ['Mobile và vị trí nút','Vùng sơ đồ cuộn ngang, tự căn giữa; list bên dưới. Nút dùng translate để không lệch khi scale.','Viewport hẹp; nhấn nút; scroll.','Không tràn ngang cả trang; giữ đường tới mọi quan hệ bằng danh sách.'],
]);
module('COLLECTION','Bộ sưu tập','BR-04','S04,S07,S10',['src/Atlas.jsx','src/hooks/useLocal.js','src/hooks/useCollection.js'],[
 ['Lưu/bỏ lưu','Toggle từ card/chi tiết/gợi ý; thể hiện trái tim và aria-pressed.','Chưa lưu; đã lưu; toggle lại.','Cùng thực thể phản ánh trạng thái trong shell chính.'],
 ['Danh sách và số đếm','Bộ sưu tập chính hiện các ID đã lưu, sidebar có tổng.','0; 1; nhiều; sau reload.','Số đếm và danh sách dùng cùng tập ID, không chỉ đếm card đang render.'],
 ['Lọc và empty state','Dùng tìm/filter/sort/map/list trong phần đã lưu; chưa lưu hoặc lọc rỗng có lối khám phá lại.','Bộ sưu tập rỗng; filter không khớp.','Không đánh đồng hai trường hợp và không xóa dữ liệu khi reset.'],
 ['Phân biệt bản đồ cũ','Bộ sưu tập cũ hiện có key riêng; đánh dấu GAP-01, không tự coi là đã đồng bộ.','Mở công cụ cũ; trở về chính.','Prompt phải giữ cả chức năng hoặc quy định migration trước khi hợp nhất.'],
]);
module('RECOMMEND','Gợi ý cá nhân','BR-04','S08',['src/Atlas.jsx','src/lib/explore.js'],[
 ['Sở thích nhiều lựa chọn','Văn hóa, Ẩm thực, Thiên nhiên, Đi chậm, Phiêu lưu; mặc định Văn hóa, có thể bỏ hết.','0/1/nhiều lựa chọn.','Nút chọn thực sự đổi input của gợi ý.'],
 ['Tháng khởi hành','Tháng 1–12; ban đầu tháng hiện tại.','Đổi tháng.','Tính điểm mùa theo dữ liệu tham khảo, không giả dữ liệu thời tiết.'],
 ['Ngân sách','Linh hoạt, Tiết kiệm, Vừa phải, Thoải mái.','Mỗi mức.','So khớp mức chi tiêu trong dữ liệu, không tính giá chuyến đi.'],
 ['Top 4 có giải thích','Chấm trên 11 điểm: mỗi sở thích khớp tags/mô tả +3, hợp mùa +1, ngân sách trống/khớp +1; lấy 4 đầu.','Không khớp sở thích; hòa điểm.','Không trùng ID; có lý do hoặc câu gợi ý dự phòng.'],
 ['Hành động từ kết quả','Dùng card thật để mở chi tiết/lưu; giữ thông báo dữ liệu mẫu.','Save; detail; return.','Không biến kết quả thành slide tĩnh không tương tác.'],
]);
module('KNOWLEDGE','Kho chuyên sâu sáu lớp','BR-06','S09,S11',['src/components/DetailPanel.jsx','src/data/content.js','src/Atlas.jsx'],[
 ['Ba điểm đến','Hà Nội, Huế, TP.HCM mở từ Hành trình hoặc CTA chi tiết tương ứng.','Chọn từng nơi.','Không trộn nội dung hoặc ID giữa ba điểm.'],
 ['Bốn ngôn ngữ nội dung','vi/en/zh/ko cho dữ liệu chuyên sâu; chọn ngôn ngữ được lưu.','Đổi ngôn ngữ; thiếu bản dịch UI riêng.','Nội dung theo lựa chọn; không quảng bá UI 89 mục đã dịch toàn bộ.'],
 ['Tổng quan chuyên sâu','Ảnh, vùng, tagline/intro, snapshot di sản/văn hóa/ẩm thực, tháng đẹp, gợi ý ngày, điểm nổi bật.','Dữ liệu/ảnh có hoặc lỗi.','Giữ thông tin giúp chọn chuyến đi, không chỉ còn ảnh hero.'],
 ['Sáu lớp và xem tất cả','history, heritage, culture, food, tourism, story; mỗi nơi 12 mục, có số đếm và lối xem tất cả.','Một lớp; tất cả; quay lại overview.','Không thay 6 lớp bằng 8 nhóm khám phá.'],
 ['Đọc mục và nguồn','Entry có title/body/ảnh wiki, nguồn điểm đến; mục mở từ search được highlight/scroll tới.','Highlight; nội dung dài; ảnh không có.','Không bỏ phần body hoặc nguồn khi chuyển thành layout mới.'],
 ['Đi tiếp sang công cụ','Nút lập lịch trình, nghe MP3 ngắn/đầy đủ và kể theo chủ đề.','Mở/đóng công cụ con.','Truyền đúng destId và lang; đóng dialog con còn đường về cha.'],
]);
module('STORY','Kể chuyện theo chủ đề','BR-06','S12',['src/components/AIStoryteller.jsx','src/lib/storyteller.js'],[
 ['Bốn chủ đề','Kể nhanh 1 phút, Dòng chảy lịch sử, Hồn văn hóa, Chuyện người bản địa.','Chọn từng mode; thay điểm/ngôn ngữ.','Mỗi mode lấy đúng nội dung của điểm đang mở.'],
 ['Tạo lại và trạng thái','Tạo lại cùng chủ đề; loading/success/error; mặc định ghép nội dung tại máy.','Đang tạo; xong; API lỗi nếu cấu hình.','Giữ nút retry/rebuild và nhãn phân biệt demo/local với AI qua backend tùy chọn.'],
 ['Đọc và dừng TTS','Nghe/Dừng câu chuyện qua SpeechSynthesis; chọn mode/đóng phải dừng giọng cũ.','Không có API giọng; đang nói; đã dừng.','Không chồng nhiều giọng hoặc gọi đây là MP3 đã tải offline.'],
 ['Dialog lồng nhau','Mở từ kho chuyên sâu; đóng/Escape quay về cha; phân lớp backdrop và focus.','Dialog cha + con.','Lớp con không bị clipping trong panel và không làm mất đường quay lại.'],
]);
module('AUDIO','Trình phát thuyết minh','BR-06','S13',['src/components/StoryPlayer.jsx','src/hooks/useStoryEngine.js','src/lib/story.js','public/audio/manifest.json'],[
 ['Mở player đầy đủ','Trình phát toàn màn hình với ảnh nền/nguồn ảnh, tên nơi, lớp, tiêu đề và caption.','Đang phát; ảnh lỗi.','Không thay player bằng nút phát audio không còn nội dung dẫn chuyện.'],
 ['Bản ngắn/đầy đủ','Hai mode short/full; thời lượng ước tính; đổi mode kể lại từ đầu.','Mỗi mode; đang nghe đổi mode.','Đúng track/script và không giữ sai vị trí mode trước.'],
 ['Ngôn ngữ player','vi/en/zh/ko; đổi ngôn ngữ cố giữ đoạn/chương tương ứng.','Có MP3; chỉ TTS/chữ.','Giữ ngữ cảnh đoạn, thể hiện nguồn phát đúng.'],
 ['Phát/dừng/phát lại','Play/pause, ended state và nghe lại từ đầu.','Autoplay bị chặn; pause; ended.','Người dùng có thể bấm phát lại; không tự giả báo đang phát khi lệnh play bị từ chối.'],
 ['Câu trước/sau','Đi theo từng câu; disabled ở biên; caption cập nhật.','Đầu/cuối; giữa bản kể.','Không vượt index hoặc tiếp tục phát câu cũ sau khi chuyển.'],
 ['Chương và tiến độ','Mở đầu, sáu lớp và lời kết theo dữ liệu; bấm nhảy chương, thanh tiến độ.','Đã qua; hiện tại; sắp tới.','Tiến độ biểu thị trạng thái thật; không bỏ các nút nhảy chương.'],
 ['Âm lượng và tốc độ','Bật/tắt tiếng, 0.8×/1×/1.25×; ghi nhớ preference.','Muted; có tiếng; đổi tốc độ.','Tốc độ ảnh hưởng phát/timing; mute vẫn cho đọc chữ.'],
 ['Ba engine dự phòng','Ưu tiên file hợp lệ → TTS nếu có giọng và bật tiếng → text theo thời gian. Thiếu giọng/lỗi file có fallback.','MP3 lỗi; thiếu giọng; chưa sẵn voices.','Không kẹt player khi thiếu tiếng; MP3 chỉ có sẵn 6 bản vi.'],
 ['Kết thúc và hành động tiếp','Nghe lại, lập lịch trình, về các lớp và nguồn tham khảo.','Ended.','Cả ba CTA và nguồn đều tiếp tục dùng được.'],
 ['Keyboard và đóng','Space/Left/Right ở ngữ cảnh không tương tác; Escape đóng; dừng tiếng/timer khi đóng.','Focus button/select; focus nền player.','Không double-handle phím trên input/button; đóng không để audio còn chạy.'],
]);
module('PLAN','Lập lịch trình ba bước','BR-05','S14',['src/components/ItineraryBuilder.jsx','src/lib/itinerary.js','src/data/content.js'],[
 ['Chọn điểm đến','Chỉ 3 nơi có dữ liệu POI; tự chọn nơi nếu mở từ chi tiết.','Chưa chọn; đổi điểm.','Bước 1 chưa chọn nơi thì không tiếp tục; đổi nơi không giữ POI của nơi cũ.'],
 ['Tháng và gợi ý mùa','12 tháng có mức thuận lợi 1/2/3, chú giải và bestNote; tự chọn tháng tốt mặc định.','Từng tháng; đổi nơi.','Tháng được lưu vào lịch trình, không chỉ tô biểu đồ.'],
 ['Số ngày','Stepper 1–7, gợi ý số ngày và daysRange của điểm đến.','Min/max.','Không chọn 0 hoặc quá 7 bằng nút; đổi số ngày tác động kế hoạch.'],
 ['Số người','Stepper 1–30; nhóm đông có cảnh báo và capacity thấp hơn.','1; 6; 10; 30.','Số người tham gia gợi ý và metadata sau lưu.'],
 ['Sở thích planner','Di sản, Văn hóa, Ẩm thực, Vui chơi & trải nghiệm; chọn nhiều hoặc để cân bằng.','Không/chọn nhiều.','Không nhầm với 5 sở thích ở trang Gợi ý.'],
 ['Chọn POI bước 2','Filter tất cả/4 kind, checkbox, title/note, số giờ, buổi, nên đi/hợp sở thích.','Đã/chưa chọn; filter.','Lọc không tự làm mất các POI đã chọn ngoài filter.'],
 ['Chọn gợi ý và bỏ hết','Khởi tạo gợi ý theo ngày/nhóm/sở thích; nút chọn lại hệ thống; bỏ chọn tất cả.','Đã sửa tay; khôi phục gợi ý; rỗng.','Rỗng thì không sang bước 3; chọn lại là hành động thật.'],
 ['Khối lượng thời gian','Đếm POI, tổng giờ, capacity; cảnh báo quá tải hoặc phù hợp.','Trong/vượt mức.','Cảnh báo hiện nhưng không tự xóa lựa chọn hay biến thành chặn lưu chưa có trong sản phẩm.'],
 ['Sinh ngày và lịch giờ','Nhóm theo zone/slot, chia ngày, thời gian bắt đầu/kết thúc gợi ý, ngày trống và tổng giờ.','Một/nhiều ngày; ngày rỗng.','Không mất hoặc nhân đôi POI; không mô tả lịch gợi ý là tuyến đường tối ưu thời gian thực.'],
 ['Chỉnh từng POI','Tăng/giảm vị trí, chuyển ngày, xóa khỏi kế hoạch, sắp tự động lại.','Đầu/cuối ngày; chuyển sang ngày khác.','Điều khiển biên disabled đúng; xóa cũng cập nhật tập selected.'],
 ['Tên, ghi chú và lưu','Tên gợi ý, chỉnh tên/notes; lưu mới hoặc cập nhật ID cũ; success và Xem lịch trình của tôi.','Chưa lưu; đã lưu; sửa sau lưu.','Tên trống fallback về tên điểm đến; không tạo trùng ID khi cập nhật.'],
 ['Quay lại và trạng thái bước','Bước 1–2–3, quay lại bước trước; giữ manual selection hợp lệ khi có thể.','Prev; Next; chỉnh lại đầu vào.','Không mất form chỉ vì animation chuyển bước; chưa có bảo đảm giữ draft sau đóng/reload.'],
]);
module('TRIP','Quản lý lịch trình đã lưu','BR-05','S15,S18',['src/components/SavedItineraries.jsx','src/hooks/useItineraries.js','src/Atlas.jsx','src/App.jsx'],[
 ['Danh sách/empty/read view','Chọn lịch trình, tên/điểm/tháng/ngày/nhóm/ngày tạo/rating, xem từng ngày/giờ/POI.','Rỗng; nhiều bản; đổi lựa chọn.','Không chỉ hiển thị thẻ tên mà mất chi tiết kế hoạch.'],
 ['Tạo mới và chỉnh sửa','Tạo mới từ bộ quản lý; sửa bản cũ mở bước 3, giữ ID/createdAt/rating liên quan.','Create; edit/update.','Sửa cập nhật bản chọn, không tạo bản sao ngoài ý muốn.'],
 ['Nhân bản để cải tiến','Mở planner với bản sao, id/createdAt mới khi lưu, rating reset, có hậu tố tên.','Copy draft; save copy.','Bản gốc không bị sửa và không nhầm thành copy clipboard/export.'],
 ['Xóa có xác nhận','AlertDialog Hủy/Xóa, không xóa ngay; cập nhật mục chọn sau xóa.','Hủy; xác nhận; xóa bản cuối.','Hủy giữ nguyên dữ liệu; xác nhận chỉ xóa đúng ID. Chưa có undo/thùng rác.'],
 ['Ghi chú tự lưu','Sửa notes trực tiếp trong read view và lưu cục bộ theo thay đổi.','Gõ; đóng/mở; reload.','Notes thuộc đúng itinerary, không chỉ giữ trong ô input.'],
 ['Đánh giá cá nhân','1–5 sao, bấm lại mức đang chọn để xóa rating.','0–5; đổi sao.','Chỉ là đánh giá cục bộ chuyến đi, không phải review công khai điểm đến.'],
]);
module('LEGACY','Bản đồ địa lý và công cụ cũ','BR-08','S16',['src/App.jsx','src/components/MapView.jsx','src/components/Sidebar.jsx','src/hooks/useCollection.js'],[
 ['Đường vào/ra rõ ràng','Hành trình mở bản đồ cũ; có nút về Khám phá Chạm Việt và brand quay lại.','Đang tải module; đã mở.','Không bỏ công cụ này chỉ vì đã có bản đồ SVG chính.'],
 ['Leaflet và vệ tinh','Map/Esri imagery, zoom/drag của Leaflet, marker 3 điểm, geoJSON/nhãn/credit.','Map; vệ tinh; tile/geo lỗi.','Chọn marker mở đúng nơi; giảm motion không fly/zoom hoạt ảnh.'],
 ['Sidebar và nhóm vùng','Danh sách điểm theo Bắc/Trung/Nam, tên/tagline, chọn điểm; empty panel có câu chuyện ngẫu nhiên.','Chưa chọn; đã chọn.','Có đường vào nội dung và ngẫu nhiên thuyết minh của 3 điểm.'],
 ['Search chuyên sâu','Tìm trong tên/tagline/vùng, tên entry và POI ở các ngôn ngữ; tối đa 4 entry và 3 POI cho mỗi nhóm kết quả.','Query; clear; no match; Ctrl/Cmd+K.','Entry search mở đúng lớp và highlight; không thay bằng tìm 89 thực thể rồi mất search chuyên sâu.'],
 ['Yêu thích cũ và các CTA','Lọc chỉ đã lưu, toggle favorite key riêng; planner, lịch trình của tôi, ngôn ngữ, kể chuyện.','Saved filter; mở công cụ.','Giữ chức năng và công khai GAP-01/02 nếu hợp nhất shell.'],
]);
module('PWA','Cài đặt và ngoại tuyến','BR-07','S09,S17',['public/manifest.webmanifest','scripts/sw-template.js','public/range.js','src/main.jsx','src/Atlas.jsx','vite.config.js'],[
 ['Install và standalone','Manifest, icon 192/512/maskable, start_url explore, shortcuts saved/tools; install prompt khi khả dụng.','Có/không beforeinstallprompt.','Không yêu cầu mọi browser đều có nút cài; giữ hướng dẫn iPhone/Android.'],
 ['Khởi tạo cache production','Service worker chỉ đăng ký production trên localhost/HTTPS; precache app, lazy modules, geoJSON, manifest audio.','Lần đầu; cache sẵn; dev.','Không hứa lần đầu mở không mạng vẫn chạy; kiểm tra bằng build/preview.'],
 ['Ngoại tuyến đúng phạm vi','Dữ liệu đã bundle/cached và local itinerary đọc được; ảnh/font/tile/tỷ giá/nguồn ngoài có giới hạn.','Online; offline; tài nguyên thiếu.','Không cam kết đã cache toàn bộ ảnh hoặc dữ liệu dịch vụ ngoài.'],
 ['Tải sáu MP3','Nút tải chủ động, thông báo đang tải/thành công/thất bại; cache audio riêng.','Chưa tải; đang tải; đã lưu 6; lỗi.','Sau tải thành công vẫn nghe file khi máy chủ local tắt.'],
 ['Tua audio và fallback','Service worker hỗ trợ byte-range đơn, trả 206 hợp lệ/416 không hợp lệ; không chặn engine fallback.','Range; suffix; ngoài biên.','Tua/phát không hỏng chỉ vì audio lấy từ cache.'],
 ['Cập nhật chủ động','Khi có worker waiting, nút cập nhật gửi SKIP_WAITING rồi reload khi controller đổi.','Không bản mới; có bản mới; đang áp dụng.','Không tự refresh để làm mất phiên nghe/chỉnh sửa; lưu ý GAP-08 về version audio.'],
 ['Trạng thái kết nối','Theo dõi online/offline, status trên shell và phản hồi tải; cài đặt giảm motion ở tools/about.','Mất/phục hồi kết nối.','Nhãn kết nối không bị hiểu thành bằng chứng tất cả request ngoài đã thành công.'],
]);
module('MOTION','Hệ motion, responsive và accessibility','BR-09','Mọi màn hình',['src/components/ui/MotionButton.jsx','src/components/ui/AnimatedDialog.jsx','src/components/ui/AnimatedSheet.jsx','src/components/ui/MotionContent.jsx','src/components/ui/AppMotionProvider.jsx','src/components/ui/motion.css','src/atlas.css'],[
 ['Nút toàn dự án','MotionButton dùng chung; tương tác nhấn nhanh, giữ type/handler/disabled/label/pressed.','Default; focus; pressed; disabled.','Không mất click, keyboard hoặc vị trí node vì thêm transform.'],
 ['Dialog theo ngữ cảnh','Sheet, modal rộng, full-screen story, storyteller và alert; quản lý lớp phủ, đóng và focus.','Lồng cha/con; thoát; return focus.','Dialog con che đúng cha, không kẹt focus hay để audio phát sau khi đóng.'],
 ['Chuyển nội dung có mục đích','Fade/translate ngắn khi đổi trang/bước/lớp; landing reveal; không animate left/top của plane hoặc width progress.','Đổi nhanh nhiều lần; nội dung dài.','Không giấu tiêu đề lâu, không chặn thao tác chờ animation.'],
 ['Giảm chuyển động','Tôn trọng OS và checkbox cục bộ; persist key; hạn chế JS/CSS, intro, caption và Leaflet.','OS reduce; user reduce; reload.','Nội dung vẫn đọc được ngay, không còn delay từng từ khi giảm chuyển động.'],
 ['Responsive','Sidebar thành tab dưới, sheet mobile, safe-area, text/input đọc được; tháng planner 2 hàng trên mobile.','360/390/768/desktop; orientation.','Không bỏ chức năng khỏi mobile; không tràn ngang toàn trang.'],
 ['Keyboard và ngữ nghĩa','Skip link, label, focus visible, thứ tự focus, dialog trap; Native select/input giữ thao tác chuẩn.','Tab/Shift+Tab; Enter/Space; Escape.','Không dùng hover làm lối vào duy nhất; không giả nút bằng div không keyboard.'],
]);
module('STATE','Dữ liệu, phản hồi và giới hạn','BR-10','Mọi màn hình',['src/hooks/useLocal.js','src/data/explore.json','src/data/content.js','src/components/WikiImage.jsx','src/lib/storyteller.js','src/lib/explore.js'],[
 ['Giữ dữ liệu và schema','Entity/POI ID, quan hệ, nguồn, itinerary, preferences có danh tính ổn định.','Sau refactor; sau deploy; migration.','Không dùng nhãn hiển thị hoặc index làm ID thay cho ID dữ liệu.'],
 ['Lưu cục bộ và lỗi lưu','Read/parse có fallback sai kiểu; write bắt lỗi. Chưa có báo lỗi write đầy đủ.','JSON hỏng; storage bị chặn/quota.','App không crash; không gọi việc bắt lỗi im lặng là đồng bộ đã thành công.'],
 ['Loading/empty/error','Suspense cho module, empty cho search/saved, lỗi tạo story/tải audio và thiếu ảnh có phản hồi hiện có.','Chậm; rỗng; thiếu dữ liệu; lỗi mạng.','UI mới phải thể hiện cùng trạng thái, không chỉ thiết kế happy path.'],
 ['Ảnh và attribution','Wikipedia/Wikimedia resolve động, ảnh điểm đến có thể minh họa POI con; giữ credit/alt/fallback.','Placeholder; ảnh tải xong; lỗi.','Không bỏ nguồn hoặc gọi ảnh minh họa là ảnh địa điểm đã xác minh.'],
 ['Nguồn và extension','Giữ URL công khai, link Maps; API kể chuyện là extension tùy cấu hình; thông tin mẫu rõ ràng.','Không API; API lỗi; link ngoài.','Không nhúng secret client hoặc tạo AI/GPS/booking giả vào mockup.'],
]);

const data=JSON.parse(fs.readFileSync('src/data/explore.json','utf8'));
const snapshot={
 date:'2026-10-25',entities:data.length,relations:data.reduce((s,e)=>s+e.relations.length,0)/2,
 categories:Object.fromEntries([...new Set(data.map(e=>e.category))].map(k=>[k,data.filter(e=>e.category===k).length])),
 placeTypes:[...new Set(data.map(e=>e.placeType).filter(Boolean))],maps:data.filter(e=>e.maps).length,noSources:data.filter(e=>!e.sources.length).length,
 deep:DESTINATIONS.map(d=>({id:d.id,name:d.name.vi,entries:d.entries.length,plannerPOIs:d.places.length,bestMonths:d.bestMonths,suggestedDays:d.suggestedDays,daysRange:d.daysRange})),layers:LAYERS.map(l=>({id:l.id,name:l.name.vi})),plannerKinds:KIND_ORDER,
 entitiesIndex:data.map(e=>({id:e.id,name:e.name,category:e.category,region:e.region,relationCount:e.relations.length,sourceCount:e.sources.length,hasMaps:Boolean(e.maps)})),
};
const featureCount=modules.reduce((s,m)=>s+m.features.length,0);
const ids=modules.flatMap(m=>m.features.map(f=>f.id));
if(ids.length!==new Set(ids).size)throw Error('Duplicate requirement IDs');
for(const m of modules)for(const path of m.sources)if(!fs.existsSync(path))throw Error('Missing source '+path);
const sources=[...new Set(modules.flatMap(m=>m.sources))];
const hashes=Object.fromEntries(sources.map(path=>[path,crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex')]));
fs.writeFileSync('docs/FEATURE-INVENTORY-CHAM-VIET.json',JSON.stringify({schemaVersion:1,documentDate:snapshot.date,scope:'Current implementation, source-reviewed; not a claim that every scenario is browser-tested',featureCount,modules,snapshot,sourceSHA256:hashes},null,2)+'\n');

const escapeCell=s=>s.replaceAll('|','\\|').replaceAll('\n',' ');
const registry=modules.map(m=>`### ${m.code}. ${m.name}\n\n**Liên kết nghiệp vụ:** ${m.businessRequirement} · **Màn hình:** ${m.screens}\n\n**Nguồn triển khai:** ${m.sources.map(s=>'`'+s+'`').join(', ')}.\n\n| ID | Chức năng và hành vi phải giữ | Trạng thái/biên | Tiêu chí nghiệm thu |\n|---|---|---|---|\n${m.features.map(f=>`| ${f.id} | **${escapeCell(f.title)}.** ${escapeCell(f.behavior)} | ${escapeCell(f.states)} | ${escapeCell(f.acceptance)} |`).join('\n')}\n`).join('\n');
const intro=fs.readFileSync('docs/PRD-CHAM-VIET-header.md','utf8');
const appendix=fs.readFileSync('docs/PRD-CHAM-VIET-appendix.md','utf8');
const index=modules.map(m=>`| ${m.code} | ${m.name} | ${m.features.length} | ${m.businessRequirement} |`).join('\n');
const prd=intro.replace('{{FEATURE_COUNT}}',String(featureCount)).replace('{{MODULE_COUNT}}',String(modules.length)).replace('{{MODULE_INDEX}}',index)+'\n## 4. Danh mục chức năng có mã truy vết\n\n'+registry+'\n'+appendix;
fs.writeFileSync('docs/PRD-CHAM-VIET.md',prd);
const brd=fs.readFileSync('docs/BRD-CHAM-VIET.md','utf8');
const prompt=fs.readFileSync('docs/UI-REDESIGN-PROMPT.md','utf8');
fs.writeFileSync('docs/CHAM-VIET-PRD-BRD-VA-PROMPT.md',`# Chạm Việt — Bộ PRD, BRD và prompt bảo toàn tính năng\n\nNgày 25/10/2026 · ${featureCount} yêu cầu chức năng trong ${modules.length} nhóm.\n\nDùng file này khi muốn đính kèm một tài liệu duy nhất. Phần BRD quy định mục tiêu/phạm vi; PRD là danh mục bảo toàn; phần cuối là prompt có thể sao chép. Các file tách riêng cùng thư mục giúp đọc và chỉnh sửa thuận tiện.\n\n---\n\n${brd}\n\n---\n\n${prd}\n\n---\n\n${prompt}`);
const summary={date:snapshot.date,featureCount,moduleCount:modules.length,entities:snapshot.entities,relations:snapshot.relations,files:['BRD-CHAM-VIET.md','PRD-CHAM-VIET.md','UI-REDESIGN-PROMPT.md','FEATURE-INVENTORY-CHAM-VIET.json','CHAM-VIET-PRD-BRD-VA-PROMPT.md']};
fs.writeFileSync('docs/PRODUCT-DOCS-COVERAGE.json',JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
