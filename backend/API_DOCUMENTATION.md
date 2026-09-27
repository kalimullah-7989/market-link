# MarketLink API Documentation (Frontend-Backend Integration Guide)

Welcome to the **MarketLink RESTful API**. This document serves as the complete integration guide for the React.js frontend development team.

---

## Base Configuration

- **API Base URL:** `http://127.0.0.1:8000/api`
- **CORS:** Enabled for all localhost ports (`http://localhost:5173`, `http://localhost:3000`).
- **Standard Request Headers:**
  ```http
  Accept: application/json
  Content-Type: application/json
  Authorization: Bearer <auth_token>
  ```
- **Standard JSON Response Envelope:**
  ```json
  {
    "success": true,
    "message": "Operation successful",
    "data": { ... }
  }
  ```

---

## Pre-Seeded Test Credentials

Use these credentials to test all roles immediately without manual registration:

| Role | Name | Email | Password | Details |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | System Admin | `marketlink118@gmail.com` | `password123` | Full platform dashboard, farmer approval, market management |
| **Farmer (Approved)** | Tariq Mehmood | `tariq@punjabfarm.com` | `password123` | Stall #A-04 at Liberty Market (Vegetables specialist) |
| **Farmer (Approved)** | Chaudhry Bashir | `bashir@dairyfarm.com` | `password123` | Stall #B-12 at Model Town Bazaar (Dairy & Eggs specialist) |
| **Farmer (Approved)** | Haji Rasheed | `rasheed@citrusfarm.com` | `password123` | Stall #C-08 at DHA Market (Citrus & Honey specialist) |
| **Farmer (Pending)** | Aslam Khan | `aslam@pendingfarm.com` | `password123` | Pending approval (use for Admin Approval workflow demo) |
| **Customer** | Hamza Ali | `hamza@customer.com` | `password123` | Has 1 completed order with a 5-star review |
| **Customer** | Zainab Bibi | `zainab@customer.com` | `password123` | Has 1 order ready for pickup (Order # ready for verification) |

---

## 1. Authentication Endpoints

### Generate Security CAPTCHA
- **Endpoint:** `GET /api/captcha`
- **Public**
- **Description:** Generates a dynamic mathematical verification challenge (e.g. 8 + 5). The solution is stored temporarily in cache for 5 minutes. Both `/api/register` and `/api/login` require the `captcha_key` and `captcha_answer`.
- **Response:**
  ```json
  {
    "success": true,
    "message": "Captcha generated",
    "data": {
      "captcha_key": "c4b93108-8e68-45a9-9fc6-948f2191590e",
      "question": "What is 8 + 5?",
      "expires_in_seconds": 300
    }
  }
  ```

### Register Customer / Farmer
- **Endpoint:** `POST /api/register`
- **Public**
- **Payload (Customer):**
  ```json
  {
    "name": "Ali Hassan",
    "email": "ali@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "role": "customer",
    "phone": "03001234567",
    "address": "Gulberg, Lahore",
    "captcha_key": "c4b93108-8e68-45a9-9fc6-948f2191590e",
    "captcha_answer": "13"
  }
  ```
- **Payload (Farmer):**
  ```json
  {
    "name": "Kareem Farmer",
    "email": "kareem@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "role": "farmer",
    "farm_name": "Kareem Agro Farms",
    "stall_number": "Stall #D-05",
    "market_id": 1,
    "farm_latitude": 31.2500,
    "farm_longitude": 74.1500,
    "cutoff_hours": 4
  }
  ```

### Login
- **Endpoint:** `POST /api/login`
- **Public**
- **Payload:**
  ```json
  {
    "email": "hamza@customer.com",
    "password": "password123",
    "captcha_key": "c4b93108-8e68-45a9-9fc6-948f2191590e",
    "captcha_answer": "13"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": { "id": 6, "name": "Hamza Ali", "role": "customer" },
      "token": "3|aBcD1234..."
    }
  }
  ```

### 1-Click Google OAuth Social Login (Customer)
- **Step 1 (Redirect):** `GET /api/auth/google`
  - React button action: `window.location.href = "http://127.0.0.1:8000/api/auth/google";`
  - Takes customer to Google account chooser.
- **Step 2 (Callback & Token Handshake):** `GET /api/auth/google/callback`
  - Backend handles Google response, creates/finds the user, generates Sanctum Bearer token.
  - Automatically redirects browser back to React app:
    `http://localhost:5173/auth/callback?token=...&name=...&email=...&role=customer`
  - React team simply extracts `token` from `window.location.search` or `useSearchParams()`, stores in `localStorage.setItem('token', token)`, and redirects user to `/customer/dashboard`.

### Get Current User Profile
- **Endpoint:** `GET /api/me`
- **Header:** `Authorization: Bearer <token>`

### Logout
- **Endpoint:** `POST /api/logout`
- **Header:** `Authorization: Bearer <token>`

### Essential Cookie Consent (All Authenticated Users)
- **Get Status:** `GET /api/cookie-consent`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:**
    ```json
    {
      "success": true,
      "message": "Cookie consent status retrieved",
      "data": {
        "essential_cookie_consent": false,
        "essential_cookie_consent_at": null
      }
    }
    ```
- **Record Consent:** `POST /api/cookie-consent`
  - **Header:** `Authorization: Bearer <token>`
  - **Payload:** `{ "accepted": true }`
  - **Response:**
    ```json
    {
      "success": true,
      "message": "Essential cookie consent recorded successfully",
      "data": {
        "essential_cookie_consent": true,
        "essential_cookie_consent_at": "2026-09-25T15:52:00.000000Z"
      }
    }
    ```
### Two-Step Verification (Email 6-Digit OTP)
- **Login Verification Endpoint:** `POST /api/login/two-factor`
  - **Public**
  - **Payload:**
    ```json
    {
      "temp_token": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "code": "593812"
    }
    ```
  - **Response:** Returns full Sanctum `token`, `user`, and `role`.
- **Get 2FA Status:** `GET /api/two-factor/status`
  - **Header:** `Authorization: Bearer <token>`
- **Toggle 2FA:** `POST /api/two-factor/toggle`
  - **Header:** `Authorization: Bearer <token>`
  - **Payload:** `{ "enable": true }` or `{ "enable": false }`

### Multi-Country & Dynamic Localization (i18n)
- **List Supported Countries:** `GET /api/localization/countries`
  - **Public**
  - **Response:** List of countries with `country_code` (PK, GB, US, SA, AE), `country_name`, `default_locale` (ur, en, ar), `direction` (rtl/ltr), and currency.
- **Get Translations Dictionary:** `GET /api/localization/translations/{locale}`
  - **Public**
  - **Params:** `locale`: `en`, `ur`, `ar`
  - **Response:** Complete UI key-value translation dictionary with `direction` flag (`ltr` or `rtl`).
- **Get User Preference:** `GET /api/localization/preference`
  - **Header:** `Authorization: Bearer <token>`
- **Save User Preference:** `POST /api/localization/preference`
  - **Header:** `Authorization: Bearer <token>`
  - **Payload:** `{ "country_code": "PK", "locale": "ur" }`

---

## 2. Public Catalog & Markets Endpoints

### List Markets (with Near-Me Haversine Distance)
- **Endpoint:** `GET /api/markets`
- **Query Params (Optional for distance calculation):**
  - `?lat=31.5122&lng=74.3432`
- **Response:** Returns list of markets sorted by nearest first, with `distance_km`, operating days, and timings.

### Get Market Details
- **Endpoint:** `GET /api/markets/{id}`
- **Response:** Market details and list of approved farmers present at this market.

### List Categories
- **Endpoint:** `GET /api/categories`
- **Response:** Categories with active products count.

### Browse Products (Catalog with Filters)
- **Endpoint:** `GET /api/products`
- **Query Params:**
  - `category_id`: filter by category
  - `market_id`: filter by market
  - `day`: e.g. `Saturday` or `Sunday`
  - `search`: search by product name/description
  - `min_price`, `max_price`: price range
  - `sort`: `price_asc`, `price_desc`, `latest`
  - `page`: pagination (default 12 items/page)

### Single Product Details (with Farm-to-Fork Origin)
- **Endpoint:** `GET /api/products/{id}`
- **Response:** Includes `product` and `farm_to_fork_origin` (farm name, farm coordinates, market stall coordinates for rendering the animated route on map).

> **Product Dynamic Badges (For React Team):**
> Every product object automatically includes:
> - `"is_low_stock"`: `true` when `stock_quantity <= 5 && stock_quantity > 0` (otherwise `false`).
> - `"stock_urgency_label"`: `"Only 3 kg left!"` (or `null` when stock is healthy).
> - `"harvested_at"`: Datetime of harvest e.g. `"2026-09-24 06:00:00"` (or `null`).
> - `"is_harvested_today"`: `true` if harvested within last 24 hours (otherwise `false`).
> - `"freshness_tag"`: `"Harvested Today"` or `"Harvested Yesterday"` (or `null` if older than 48 hours).
> 
> React team can directly render:
> `{product.freshness_tag && <span className="badge-freshness">{product.freshness_tag}</span>}`

---

## 3. Customer Pre-Order & Receipt Endpoints

### Place Pre-Order
- **Endpoint:** `POST /api/customer/orders`
- **Header:** `Authorization: Bearer <token>` (role: `customer`)
- **Payload:**
  ```json
  {
    "farmer_id": 2,
    "pickup_date": "2026-09-27",
    "pickup_time_slot": "10:00 AM - 12:00 PM",
    "farmer_notes": "Please pack in paper bags if possible",
    "items": [
      { "product_id": 1, "quantity": 3 },
      { "product_id": 2, "quantity": 1 }
    ]
  }
  ```
- **Business Logic:** Automatically checks and decrements available stock, calculates `cutoff_datetime = slot - cutoff_hours`, creates order with status `placed` and payment `unpaid_cash`.

### List Customer Orders
- **Endpoint:** `GET /api/customer/orders`
- **Header:** `Authorization: Bearer <token>`

### View Order Details
- **Endpoint:** `GET /api/customer/orders/{id}`
- **Response:** Order details, `is_cutoff_passed` boolean, and `can_modify_or_cancel` boolean.

### Cancel Pre-Order (Before Cutoff)
- **Endpoint:** `POST /api/customer/orders/{id}/cancel`
- **Header:** `Authorization: Bearer <token>`
- **Payload:** `{ "reason": "Change of plan" }`
- **Behavior:** If `now < cutoff_datetime`, cancels order and automatically restores stock (+qty) in DB. If cutoff passed, returns `403 Forbidden`.

### View / Download Pickup Receipt Slip
- **Endpoint:** `GET /api/customer/orders/{id}/receipt`
- **Header:** `Authorization: Bearer <token>`
- **Response:** Complete digital receipt with Order Number (`#ML-xxxx`), Pickup Slot, Farmer Stall #, Cash Amount, and Pickup Token.

### 1-Click Reorder
- **Endpoint:** `POST /api/customer/orders/{id}/reorder`
- **Header:** `Authorization: Bearer <token>`
- **Response:** Prefills cart items from past order with current stock availability flags.

---

## 4. Farmer Inventory & Stall Verification Endpoints

### List Farmer's Own Products
- **Endpoint:** `GET /api/farmer/products`
- **Header:** `Authorization: Bearer <token>` (role: `farmer`)

### Add Product
- **Endpoint:** `POST /api/farmer/products`
- **Payload (multipart/form-data if image included):**
  - `category_id`: 1
  - `name`: "Fresh Organic Spinach"
  - `unit`: "bunch"
  - `price`: 50.00
  - `stock_quantity`: 40
  - `description`: "Harvested fresh daily"
  - `image`: [file upload optional]

### Update Product
- **Endpoint:** `PUT /api/farmer/products/{id}`

### Toggle Sold Out / Temporarily Unavailable
- **Endpoint:** `PATCH /api/farmer/products/{id}/toggle-status`
- **Payload:** `{ "field": "is_sold_out" }` or `{ "field": "is_temporarily_unavailable" }`

### Save Weekly Recurring Stock Template
- **Endpoint:** `POST /api/farmer/stock-template/save`
- **Behavior:** Saves current product catalog and stock baseline as weekly template.

### 1-Click Apply Weekly Stock Template
- **Endpoint:** `POST /api/farmer/stock-template/apply`
- **Behavior:** Resets weekly market stock numbers and removes sold-out flags in 1 click!

### List Farmer Incoming Orders
- **Endpoint:** `GET /api/farmer/orders?status=placed`

### Update Order Status
- **Endpoint:** `POST /api/farmer/orders/{id}/status`
- **Payload:** `{ "status": "ready_for_pickup" }` (or `accepted`, `declined`)

### In-Stall Cash Order Verification
- **Endpoint:** `POST /api/farmer/verify-order`
- **Header:** `Authorization: Bearer <token>` (role: `farmer`)
- **Payload:**
  ```json
  {
    "order_number": "ML-260921-4419"
  }
  ```
  *(OR pass `{ "pickup_token": "PK-VERIFY-DEMO" }`)*
- **Response:** Verifies order belongs to this stall, marks status as `completed`, marks payment as `paid_cash`, sets completion timestamp, and returns cash collected summary!

---

## 5. Reviews, Favorites & Notifications Endpoints

### Submit Customer Review (Only Completed Orders)
- **Endpoint:** `POST /api/reviews`
- **Payload:**
  ```json
  {
    "order_id": 1,
    "rating": 5,
    "comment": "Crisp and fresh produce, picked up easily!"
  }
  ```

### Farmer Reply to Review
- **Endpoint:** `POST /api/farmer/reviews/{id}/reply`
- **Payload:** `{ "farmer_reply": "Thank you! Visit our stall again this Sunday." }`

### In-App Notifications
- **List & Unread Count:** `GET /api/notifications`
- **Mark Single as Read:** `PATCH /api/notifications/{id}/read`
- **Mark All Read:** `POST /api/notifications/read-all`

### Favorites Toggle
- **Endpoint:** `POST /api/favorites/toggle`
- **Payload:** `{ "product_id": 1 }` or `{ "farmer_id": 2 }`

---

## 6. Admin Control Endpoints (Role: `admin`)

- **Platform Dashboard:** `GET /api/admin/dashboard` (KPI metrics: total farmers, pending approvals, gross revenue, etc.)
- **Farmer Approvals:** `GET /api/admin/farmers` & `POST /api/admin/farmers/{id}/status` (payload: `{ "status": "approved" }`)
- **Customer Moderation:** `GET /api/admin/customers` & `POST /api/admin/customers/{id}/toggle-status`
- **Markets Management:** `POST /api/admin/markets`, `PUT /api/admin/markets/{id}`, `DELETE /api/admin/markets/{id}`
- **Categories Management:** `POST /api/admin/categories`, `PUT /api/admin/categories/{id}`, `DELETE /api/admin/categories/{id}`
- **Content Moderation:** `DELETE /api/admin/moderation/products/{id}`, `DELETE /api/admin/moderation/reviews/{id}`

---

## 7. Add-to-Cart System (Role: `customer`)

All cart endpoints require `Authorization: Bearer <token>` and `role: customer`.

### View Cart
- **Endpoint:** `GET /api/customer/cart`
- **Response:**
  ```json
  {
    "items": [
      {
        "cart_item_id": 1,
        "product_id": 5,
        "product_name": "Fresh Tomatoes",
        "unit": "kg",
        "unit_price": 100.00,
        "quantity": 3,
        "subtotal": 300.00,
        "available_stock": 47,
        "farmer_name": "Tariq Mehmood",
        "farm_name": "Punjab Fresh Farm",
        "freshness_tag": "Harvested Today",
        "is_low_stock": false
      }
    ],
    "item_count": 1,
    "grand_total": 300.00,
    "payment_method": "cash_on_pickup"
  }
  ```

### Add Item to Cart
- **Endpoint:** `POST /api/customer/cart`
- **Payload:** `{ "product_id": 5, "quantity": 3 }`
- **Notes:** Adding the same product again increments existing quantity. Stock availability validated on every add.

### Update Cart Item Quantity
- **Endpoint:** `PATCH /api/customer/cart/{cart_item_id}`
- **Payload:** `{ "quantity": 5 }`

### Remove Single Item
- **Endpoint:** `DELETE /api/customer/cart/{cart_item_id}`

### Clear Entire Cart
- **Endpoint:** `DELETE /api/customer/cart`

### Checkout Cart (Place Orders)
- **Endpoint:** `POST /api/customer/cart/checkout`
- **Payload:**
  ```json
  {
    "pickup_date": "2026-10-05",
    "pickup_time_slot": "10:00 AM - 12:00 PM",
    "farmer_notes": "Please pack separately"
  }
  ```
- **Response:**
  ```json
  {
    "orders": [
      {
        "id": 12,
        "order_number": "ML-261005-XKQP",
        "pickup_token": "PK-ABCD1234",
        "status": "placed",
        "total": 300.00,
        "payment_method": "cash_on_pickup"
      }
    ],
    "items_failed": [],
    "payment_note": "All payments are cash-on-pickup at the stall. No online payment required."
  }
  ```
- **Notes:**
  - Cart items grouped by farmer. Each farmer's items processed in a separate atomic transaction.
  - Cutoff validation, `lockForUpdate()`, and stock decrement applied per existing pre-order rules.
  - Successfully placed items are cleared from cart. Failed items appear in `items_failed` with a reason.
  - Payment is always **cash at the stall**. No online payment gateway is involved.
