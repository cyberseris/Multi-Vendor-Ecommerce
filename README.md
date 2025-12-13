# 🛍️ 多商家電商平台 (Multi-Vendor Ecommerce)

## 📌 專案概覽

這是一套完整的 **多商家電商解決方案**，包含 **後端 API 服務**、**客戶端購物站** 與 **商家/管理員儀表板**。
系統涵蓋多角色登入、商品與分類管理、購物車與結帳、Stripe 支付、即時聊天、錢包與提款等核心功能，適合用於打造多商家 Marketplace 產品。

**開發狀態**：開發中 🚀

---

## 🏗️ 專案架構

```txt
Build Multi-Vendor Ecommerce/
├── backend/                 # Express.js 後端 API
├── frontend/                # React 客戶端（購物站）
└── dashboard/               # React 商家/管理員儀表板
```

### 技術堆疊

| 層級       | 技術                                               |
| -------- | ------------------------------------------------ |
| **後端**   | Node.js, Express.js 5.1, MongoDB (Mongoose 8.19) |
| **前端**   | React 19, React Router v7, Redux Toolkit         |
| **樣式**   | Tailwind CSS                                     |
| **即時通訊** | Socket.io 4.8                                    |
| **支付**   | Stripe 19.3.1                                    |
| **其他**   | Cloudinary（圖片上傳）、JWT 認證                          |

---

## 📁 目錄結構

### Backend (`/backend`)

```txt
backend/
├── package.json
├── server.js                          # Express 主服務器 + Socket.io 配置
├── controllers/                       # 控制器層
│   ├── authControllers.js
│   ├── chat/
│   │   └── chatController.js
│   ├── dashboard/
│   │   ├── categoryController.js      # 分類管理
│   │   ├── dashboardController.js
│   │   ├── productController.js       # 產品管理
│   │   └── sellerController.js        # 商家管理
│   ├── home/
│   │   ├── cartController.js          # 購物車
│   │   ├── customerAuthControllers.js # 客戶認證
│   │   └── homeControllers.js
│   ├── order/
│   │   └── orderController.js         # 訂單管理
│   └── payment/
│       └── paymentController.js       # Stripe 支付
├── middlewares/
│   └── authMiddleware.js              # JWT 驗證中間件
├── models/                            # MongoDB 數據模型
│   ├── adminModel.js
│   ├── bannerModel.js
│   ├── cartModel.js
│   ├── categoryModel.js
│   ├── customerModel.js
│   ├── customerOrderModel.js
│   ├── myShopWalletModel.js           # 店鋪錢包
│   ├── productModel.js
│   ├── reviewModel.js
│   ├── sellerModel.js
│   ├── sellerOrderModel.js
│   ├── sellerWalletModel.js           # 商家錢包
│   ├── stripeModel.js
│   ├── wishlistModel.js
│   ├── withdrawalRequestModel.js      # 提款申請
│   └── chat/
│       ├── adminSellerMessageModel.js
│       ├── sellerCustomerModel.js
│       └── sellerCustomerMsgModel.js
├── routes/                            # API 路由
│   ├── authRoutes.js                  # /api/auth
│   ├── paymentRoutes.js               # /api/payment
│   ├── chat/
│   │   └── chatRoutes.js
│   ├── dashboard/
│   │   ├── categoryRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── productRoutes.js
│   │   └── sellerRoutes.js
│   ├── home/
│   │   ├── cartRoutes.js
│   │   ├── customerAuthRoutes.js
│   │   └── homeRoutes.js
│   └── order/
│       └── orderRoutes.js
└── utils/
    ├── db.js                          # MongoDB 連接（支援本地/生產）
    ├── queryProducts.js               # 產品查詢工具
    ├── response.js                    # 統一響應格式
    └── tokenCreate.js                 # JWT 令牌生成
```

### Frontend (`/frontend`)－客戶端（購物站）

```txt
frontend/
├── package.json
├── tailwind.config.js
├── public/
│   └── images/
│       ├── banner/
│       └── ...
└── src/
    ├── App.jsx
    ├── App.css & index.css
    ├── api/
    │   └── api.js                     # Axios API 配置
    ├── assets/
    ├── components/
    ├── pages/
    │   ├── Home.jsx
    │   ├── Shops.jsx
    │   ├── Cart.jsx
    │   ├── Shipping.jsx
    │   ├── Details.jsx                # 產品詳情
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── CategoryShop.jsx
    │   ├── SearchProducts.jsx
    │   ├── Payment.jsx                # Stripe 支付頁面
    │   ├── Dashboard.jsx              # 客戶儀表板
    │   └── ConfirmOrder.jsx
    ├── store/
    │   ├── index.js
    │   ├── rootReducers.js
    │   └── reducers/
    └── utils/
        ├── api.js
        ├── ProtectUser.js             # 路由保護
        └── utils.js
```

### Dashboard (`/dashboard`)－商家/管理員儀表板

```txt
dashboard/
├── package.json
├── tailwind.config.js
├── README.md
├── public/
│   └── images/
│       └── category/
└── src/
    ├── App.jsx
    ├── App.css & index.css
    ├── api/
    │   └── api.js                     # API 配置
    ├── assets/
    ├── layout/
    │   ├── Header.jsx
    │   ├── MainLayout.jsx
    │   └── Sidebar.jsx
    ├── navigation/
    │   ├── allNav.js
    │   └── index.js
    ├── router/
    │   ├── Router.jsx
    │   └── routes/
    ├── store/
    │   ├── index.js
    │   ├── rootReducers.js
    │   └── Reducers/
    ├── utils/
    │   └── utils.js
    └── views/
        ├── Deactive.jsx
        ├── Home.jsx
        ├── Pending.jsx
        ├── Success.jsx
        ├── admin/
        ├── auth/
        ├── components/
        ├── pages/
        └── seller/
```

---

## 🚀 快速開始

### 前置需求

* **Node.js** 22.x 以上
* **MongoDB**（本地或 Atlas）
* **npm** 或 **yarn**
* **Stripe** API Key
* **Cloudinary** 帳戶

### 環境變數設定

#### 1) 後端 (`backend/.env`)

```bash
# Database
mode=dev
DB_LOCAL_URL=mongodb://localhost:27017/ecommerce
DB_PRO_URL=mongodb+srv://user:pass@cluster.mongodb.net/ecommerce

# Server
PORT=5000
JWT_SECRET=your_jwt_secret_key

# CORS
client_customer_production_url=https://customer.example.com
client_admin_production_url=https://admin.example.com

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### 2) 前端 (`frontend/.env`)

```bash
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_xxxxx
```

#### 3) 儀表板 (`dashboard/.env`)

```bash
REACT_APP_API_URL=http://localhost:5000/api
```

### 安裝與啟動

#### Backend

```bash
cd backend
npm install
npm run server     # 開發模式（nodemon）
# 或
npm start          # 生產模式
```

API 服務：`http://localhost:5000`

#### Frontend（客戶端）

```bash
cd frontend
npm install
npm start
```

客戶端：`http://localhost:3000`

#### Dashboard（商家/管理員）

```bash
cd dashboard
npm install
npm start
```

儀表板：`http://localhost:3001`

---

## 📡 API 路由概覽

### 認證 (`/api/auth`)

| 方法    | 端點                      | 描述           |
| ----- | ----------------------- | ------------ |
| POST  | `/admin-login`          | 管理員登入        |
| POST  | `/seller-register`      | 商家註冊         |
| POST  | `/seller-login`         | 商家登入         |
| GET   | `/get-user`             | 取得當前使用者（需認證） |
| PATCH | `/change-password`      | 修改密碼         |
| PATCH | `/profile-image-upload` | 上傳頭像         |
| POST  | `/profile-info-add`     | 新增/更新個人資訊    |
| GET   | `/logout`               | 登出           |

### 支付 (`/api/payment`)

* Stripe 支付整合與交易流程

### 聊天 (`/api/chat`)

* Socket.io 即時聊天（商家↔客戶、管理員↔商家）

### 儀表板 (`/api/dashboard`)

* `/category`：分類管理
* `/product`：產品管理
* `/seller`：商家管理

### 首頁 (`/api/home`)

* `/cart`：購物車
* `/customer-auth`：客戶認證
* `/products`：商品列表與篩選

### 訂單 (`/api/order`)

* 訂單建立、狀態追蹤、商家訂單流程

---

## 🔐 核心功能

### 👤 角色與權限

* 三種角色：**管理員 / 商家 / 客戶**
* JWT + Cookie 認證流程
* bcryptjs 密碼加密與安全驗證

### 🛒 購物車與結帳

* 商品加入/移除/更新數量
* 配送資訊填寫
* 訂單確認與建立

### 💳 Stripe 支付

* 安全支付流程
* 交易紀錄
* 錢包與退款相關邏輯（依系統設計延伸）

### 📦 商品與分類

* 商家商品 CRUD（上傳、編輯、刪除）
* 動態分類管理
* 搜尋/篩選/排序
* 評論與評分

### 💬 即時聊天

* Socket.io 即時通訊
* 商家↔客戶、管理員↔商家對話
* 線上狀態追蹤與訊息落庫

### 📊 儀表板

**商家端**

* 訂單管理、產品管理、銷售統計
* 收入/錢包/提款申請

**管理員端**

* 商家審核與管理
* 分類、banner、系統概況統計

---

## 🧩 主要依賴（摘要）

### 後端

Express、Mongoose、Socket.io、JWT、Stripe、Cloudinary、bcryptjs

### 前端

React、React Router、Redux Toolkit、Axios、socket.io-client、Stripe React、Tailwind

---

### 後續優化方向

* [ ] Socket 狀態持久化（Redis）
* [ ] 更完整的錯誤處理與例外防護
* [ ] 日誌系統（request log / error log）
* [ ] API rate limit 與安全性強化
* [ ] 單元測試 / 整合測試
* [ ] 分頁、快取、虛擬化列表等效能優化

---

## 🔄 流程概述（Data Flow）

### 註冊流程

```txt
填寫表單 → 前端驗證 → 呼叫 API → 後端驗證/加密 → 寫入 DB → 回傳結果 + Token
```

### 下單流程

```txt
瀏覽商品 → 加入購物車 → 填寫配送 → Stripe 支付 → 建立訂單 → Socket 通知商家 → 商家出貨
```

### 聊天流程

```txt
連線 Socket → add_user/add_seller → 更新 online list → 廣播狀態 → 即時收發 → 訊息寫入 MongoDB
```

---

## 🚢 部署建議（簡述）

* 後端：Railway / Render / VPS（EC2、DigitalOcean）
* 前端：Vercel / Netlify
* DB：MongoDB Atlas

---

## 🎓 學習來源

Udemy《Build Multi-Vendor Ecommerce》

