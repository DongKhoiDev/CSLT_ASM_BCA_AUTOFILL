# Công cụ Tự động Điền thông tin CCCD - CSLT DU LỊCH

Công cụ này giúp tự động điền thông tin khách hàng từ CCCD vào form check-in của hệ thống CSLT DU LỊCH.

## Tính năng

- Tự động phân tích dữ liệu từ văn bản được dán vào
- Tự động điền các trường thông tin cá nhân: Họ tên, Số CCCD, Ngày sinh, Giới tính, Địa chỉ, Ngày cấp
- Chỉ hỗ trợ CCCD, không hỗ trợ CMND
- Không sử dụng các icon phức tạp
- Công cụ luôn hiển thị trên trang sơ đồ phòng, không cần phải mở modal trước
- Tự động điền thông tin khi bạn nhấn vào nút check-in

## Cách cài đặt

### 1. Cài đặt Tampermonkey

1. Truy cập cửa hàng tiện ích (Extension Store) của trình duyệt:
   - Chrome: [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - Firefox: [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - Edge: [Microsoft Store](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

2. Tìm và cài đặt tiện ích "Tampermonkey"

### 2. Cài đặt script

1. Nhấp vào biểu tượng Tampermonkey trên trình duyệt của bạn và chọn "Dashboard" (Bảng điều khiển)
2. Chọn tab "Utilities" (Tiện ích)
3. Trong phần "Import from file" (Nhập từ tệp), nhấp vào "Choose file" (Chọn tệp)
4. Chọn file `autoFill.js` và nhấp vào "Install" (Cài đặt)

**Cách khác**: Bạn cũng có thể tạo script mới bằng cách:
1. Nhấp vào biểu tượng Tampermonkey và chọn "Create a new script" (Tạo script mới)
2. Xóa nội dung mặc định
3. Sao chép toàn bộ nội dung từ file `autoFill.js` và dán vào
4. Nhấn Ctrl+S để lưu

## Cách sử dụng

1. Truy cập trang web [CSLT DU LỊCH](https://mobile.asmbca.vn/ui/so-do-phong)
2. Đăng nhập vào hệ thống
3. Khi truy cập vào trang sơ đồ phòng, bạn sẽ thấy một khung nhập liệu ở góc trên bên phải của trang
4. Dùng Zalo quét thông tin mã QR trên CCCD, dán thông tin khách hàng theo định dạng sau vào khung nhập liệu:

```
Số CCCD: 089*******
Họ và tên: Đoàn *** ***
Giới tính: Nam
Ngày sinh: 01/01/1910
Nơi thường trú: Ấp Đông Sơn 2, Núi Sập, Thoại Sơn, An Giang
Ngày cấp CCCD: 04/08/2025
```

5. Nhấn nút "Kiểm tra & Điền Form" để xác nhận dữ liệu hợp lệ và tự động điền thông tin

**Lưu ý quan trọng**: 
- Thông tin phải được nhập đúng theo định dạng trên
- Mỗi dòng phải có đúng tiêu đề (ví dụ: "Số CCCD:") và dấu hai chấm (:)
- Các dòng thông tin phải được phân cách bằng dấu xuống dòng
- Thông tin về CMND sẽ tự động bị bỏ qua
- Định dạng ngày tháng phải là ngày/tháng/năm (dd/mm/yyyy)

## Lưu ý

- Script chỉ hoạt động trên trang web có đường dẫn bắt đầu bằng `https://mobile.asmbca.vn/ui/`
- Script tự động bỏ qua dòng "Số CMND" nếu có
- Nếu gặp lỗi, hãy kiểm tra định dạng thông tin đầu vào và thử lại

## Hỗ trợ
Nếu bạn gặp vấn đề hoặc cần hỗ trợ, vui lòng liên hệ qua email dongkhoidev@gmail.com hoặc tạo issue trên GitHub. 