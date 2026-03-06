# 🚀 Hướng dẫn Deploy lên Render.com
## Sếp có link xem dashboard 24/7 – làm 1 lần dùng mãi

---

## 📁 Cấu trúc thư mục (giữ nguyên)
```
lara-ads-render/
├── server.js        ← Server chính
├── dashboard.html   ← Giao diện
├── package.json     ← Cấu hình Node
└── DEPLOY.md        ← File này
```

---

## BƯỚC 1 – Tạo tài khoản GitHub (miễn phí)
1. Vào **github.com** → Sign up
2. Xác nhận email
3. Xong ✅

---

## BƯỚC 2 – Tạo Repository trên GitHub
1. Nhấn nút **"+"** góc trên phải → **"New repository"**
2. Đặt tên: `lara-ads-dashboard`
3. Chọn **Private** (để bảo mật)
4. Nhấn **"Create repository"**

---

## BƯỚC 3 – Upload file lên GitHub
1. Trong trang repository vừa tạo → nhấn **"uploading an existing file"**
2. Kéo thả **3 file** vào:
   - `server.js`
   - `dashboard.html`
   - `package.json`
3. Nhấn **"Commit changes"** → **"Commit directly to main"**

---

## BƯỚC 4 – Tạo tài khoản Render (miễn phí)
1. Vào **render.com** → Sign up bằng GitHub luôn (tiện hơn)
2. Xác nhận email

---

## BƯỚC 5 – Deploy lên Render
1. Trong Render → nhấn **"New +"** → chọn **"Web Service"**
2. Chọn **"Connect a repository"** → chọn `lara-ads-dashboard`
3. Điền thông tin:
   - **Name:** `lara-ads-dashboard`
   - **Runtime:** `Node`
   - **Build Command:** *(để trống)*
   - **Start Command:** `node server.js`
   - **Instance Type:** `Free`
4. Nhấn **"Create Web Service"**
5. Đợi ~2 phút để deploy xong

---

## BƯỚC 6 – Đặt mật khẩu cho sếp
Trong trang Web Service → tab **"Environment"** → **"Add Environment Variable"**:

| Key | Value |
|-----|-------|
| `DASHBOARD_PASSWORD` | *(mật khẩu bạn muốn, ví dụ: lara@2026)* |

→ Nhấn **"Save Changes"** → Render tự restart

---

## BƯỚC 7 – Lấy link share
Trong trang Web Service → nhìn góc trên → thấy link dạng:
```
https://lara-ads-dashboard.onrender.com
```

**Gửi link này cho sếp!**

Khi sếp mở → nhập:
- **Username:** bất kỳ (ví dụ: lara)
- **Password:** mật khẩu bạn đã đặt ở Bước 6

---

## ⚙️ Cách bạn dùng hàng ngày
1. Mở link `https://lara-ads-dashboard.onrender.com`
2. Đăng nhập bằng mật khẩu
3. Nhập Access Token + Account ID → Kéo cả 3
4. Sếp F5 lại trang → thấy số liệu mới ngay

---

## ❗ Lưu ý quan trọng
- **Free tier của Render:** Server ngủ sau 15 phút không có ai vào → lần đầu mở sẽ chờ ~30 giây để khởi động lại. Hoàn toàn bình thường!
- **Nâng cấp $7/tháng** nếu muốn server chạy 24/7 không ngủ
- **Token Facebook:** Vẫn nhập thủ công mỗi lần — không lưu trên server để bảo mật

---

## 🆘 Gặp vấn đề?
- Deploy fail → kiểm tra tab **"Logs"** trong Render
- Không vào được → kiểm tra mật khẩu đúng chưa
- Dữ liệu không load → kiểm tra Access Token còn hạn không
