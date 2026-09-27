# MarketLink — Farmers Market Pre-Order Platform

MarketLink is a full-stack web application built for the **TechWiz 7** competition (**Category:** End-to-End Web Solutions, **Theme:** eGreen Basket).

The main idea of the project is to connect local farmers with nearby shoppers. Instead of buying through third-party distributors or waiting in long queues at weekly farmers markets, customers can check market schedules, pre-order fresh produce before the weekly harvest, and pick up their packed orders directly at the farmer's stall. Pre-orders are paid in cash during pickup at the stall, which keeps the process simple and accessible for both farmers and local buyers.

---

## Tech Stack

### Frontend
- **Framework:** React 18 (with Vite)
- **Routing:** React Router v6 (with protected routes for Customer, Farmer, and Admin)
- **State Management:** React Context API (`AuthContext`, `CartContext`, `OrderContext`, `LanguageContext`)
- **Styling:** Bootstrap 5.3 + Custom CSS (Fully responsive for desktop and mobile)
- **Maps:** Leaflet.js & OpenStreetMap (Interactive map showing market locations and stall markers)
- **QR Code:** `qrcode.react` (Generates digital pickup pass tokens for stall collection)

### Backend
- **Framework:** Laravel 11 (PHP 8.2+)
- **Architecture:** RESTful API (JSON responses)
- **Authentication:** Laravel Sanctum (Token-based authentication)
- **Mailing:** Laravel Mail via Gmail SMTP (Sends 6-digit OTP for password resets)
- **Security:** Bcrypt password hashing, strong password validation rules

### Database
- **Database:** MySQL
- **ORM:** Eloquent ORM
- **Collation:** `utf8mb4_unicode_ci` (Supports English, Urdu, and Arabic text)

---

## Core Features (SRS Requirements)

The application fulfills all the core requirements outlined in the TechWiz SRS:

### 1. Customer Module
- **Account Registration & Login:** Simple sign-up with name, email, phone number, address, and country selection.
- **Weekly Market Discovery:** Browse physical weekend markets by city and scheduled market day (e.g., Saturday, Sunday).
- **Interactive Map:** View market locations on an OpenStreetMap map with pins for attending farmers.
- **Product Catalog & Filters:** Search produce and filter by category (Vegetables, Fruits, Dairy, Herbs) and price.
- **Product Details:** Shows price per unit (kg, dozen, bundle), available stock quantity, farm name, and harvest cutoff info.
- **Pre-Order & Pickup Window:** Add items to cart and select a convenient pickup time slot (e.g., 09:00 AM – 11:00 AM).
- **Harvest Cutoff Timer:** Live countdown showing how much time is left before pre-orders close for harvesting.
- **Order Status Tracking:** Live tracking through stages: `placed` -> `accepted` -> `ready_for_pickup` -> `completed` / `cancelled`.
- **Cancel Pre-Orders:** Customers can cancel an order as long as it is before the farmer's cutoff deadline.
- **Order History & 1-Click Reorder:** View past purchases and reorder previous grocery baskets easily.
- **Favorites:** Save favorite farms and produce for quick access.
- **Ratings & Reviews:** Rate completed orders (1 to 5 stars) and write feedback.
- **Market Help Desk:** Built-in chat assistant to answer common questions about market timings, stall locations, and pickup rules.
- **About Us & Contact Us:** Team information, contact form, and office location.

### 2. Farmer Module
- **Farmer Profile & Stall Setup:** Register farm name, assigned stall number, location coordinates, operating days, and pickup hours.
- **Product Management:** Full add, edit, and delete controls for produce with title, category, price, unit, stock count, and images.
- **Recurring Stock Templates:** Save standard weekly inventory as a template and reload it each week with one click.
- **Stock Availability Toggle:** Quickly toggle items between "In Stock" and "Sold Out" without deleting them.
- **Order Queue & Fulfillment:** Manage incoming customer pre-orders with options to Accept, Mark Ready for Pickup, Complete, or Decline.
- **Custom Cutoff Window:** Configure cutoff time (e.g., 4 or 6 hours before market starts) to lock pre-orders in time for harvest.
- **Sales Overview:** Summary showing total orders, pending pickups, and revenue earned.
- **Review Replies:** Read customer reviews and reply directly.

### 3. Admin Module
- **Admin Dashboard:** Overview of total registered customers, verified farmers, active markets, and total orders placed.
- **Farmer Approval System:** Review new farmer registrations and Approve, Reject, or Suspend accounts.
- **Customer Management:** View customer list and manage account statuses.
- **Market Management:** Add new weekly markets with city, address, operating days, and map coordinates.
- **Category & Content Moderation:** Manage master produce categories and monitor reviews.

### 4. Cash on Pickup (SRS Rule)
- All pre-orders are paid in cash in person when collected at the stall (as specified on Page 8 of the TechWiz SRS). This eliminates online payment gateway deductions for small farmers and keeps checkout accessible to everyone.

---

## Extra Features We Added (Beyond SRS)

To make the platform more practical for real-world usage, we also built several additional features:

1. **Multi-Country Support (Pakistan, Saudi Arabia, UAE):**  
   Users can switch between Pakistan, Saudi Arabia, and UAE. The platform dynamically filters the cities, markets, and vendors based on the selected country.

2. **Multi-Currency Display (PKR, SAR, AED):**  
   Prices automatically display in the local currency according to the selected country (PKR for Pakistan, SAR for Saudi Arabia, AED for UAE).

3. **Multi-Language Support with Full RTL Layout:**  
   The entire UI can be toggled between English, Urdu (اردو), and Arabic (العربية). When Urdu or Arabic is selected, the layout automatically switches to Right-to-Left (RTL) mode.

4. **Haftawar Hisab (Weekly Statement) with Print & Export:**  
   Farmers have a weekly ledger view of all their orders and cash collected, with buttons to print the receipt directly or export to CSV / Excel.

5. **In-Stall Cash Adjustment:**  
   During pickup, farmers can adjust and save the exact cash received if produce weight changes slightly at the scale.

6. **Strong Password Security:**  
   Requires a minimum password strength with at least one uppercase letter and one special character for better account safety.

7. **Email OTP for Password Reset:**  
   Forgot Password sends a real 6-digit OTP code to the user's email via Gmail SMTP. The code expires in 15 minutes and is never shown in the browser or API response for security.

8. **Digital QR Code Pickup Pass:**  
   Customers get a QR code pass for each order on their phone screen. Farmers can scan or check the token at the stall to confirm the pickup quickly.

9. **Dark Mode / Light Mode:**  
   Built-in dark mode toggle for comfortable night-time browsing.

10. **Clean 2-Column Farmer Registration Form:**  
    Farmer registration is formatted in a clean 2-column layout to prevent long vertical scrolling on standard laptop screens.

---

## Project Structure

```text
market-link full stack/
├── frontend/                     # React + Vite application
│   ├── src/
│   │   ├── components/           # Navbar, Footer, AuthModal, MarketMap, QR Pass, ChatBot
│   │   ├── contexts/             # AuthContext, CartContext, LanguageContext, OrderContext
│   │   ├── pages/                # Home, Markets, Products, Cart, Orders, FarmerDashboard, AdminDashboard
│   │   ├── App.jsx               # Route definitions
│   │   └── main.jsx              # React entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # Laravel 11 API
│   ├── app/
│   │   ├── Http/Controllers/Api/ # Auth, Market, Product, Order, Farmer, Admin controllers
│   │   └── Models/               # User, FarmerProfile, Market, Product, Order, Review models
│   ├── database/
│   │   ├── migrations/           # MySQL table schemas
│   │   └── seeders/              # Initial test data
│   ├── routes/api.php            # API endpoints
│   ├── marketlink_database.sql   # MySQL database export
│   └── composer.json
│
├── RUN_MARKETLINK.bat            # Windows 1-click launch script
├── .gitignore                    # Protects .env, node_modules, vendor
└── README.md
```

---

## Database Design (MySQL)

The project uses a relational **MySQL** database with the following primary tables:

- **`users`** — User accounts with name, email, phone, role (`customer`, `farmer`, `admin`), country, and password.
- **`farmer_profiles`** — Farm details linked to `users`, including farm name, stall number, market ID, coordinates, pickup windows, and approval status.
- **`markets`** — Physical market locations with city, country, address, coordinates, and operating days.
- **`categories`** — Produce categories (Vegetables, Fruits, Dairy, Herbs, etc.).
- **`products`** — Produce items with name, price, measurement unit (`kg`, `dozen`, `bundle`), available stock, and farmer ID.
- **`orders`** — Pre-order records with customer ID, farmer ID, market ID, pickup window, QR token, total amount, currency, and status (`placed`, `accepted`, `ready_for_pickup`, `completed`, `cancelled`).
- **`order_items`** — Items included in each order with quantity and unit price.
- **`reviews`** — Customer star ratings and feedback for farmers and products, including farmer replies.

---

## Main API Endpoints

All backend routes are prefixed with `/api`:

### Auth
- `POST /api/register` — Register customer or farmer
- `POST /api/login` — Login and receive Sanctum token
- `POST /api/forgot-password` — Send 6-digit OTP to user's email
- `POST /api/verify-otp` — Verify reset code
- `POST /api/reset-password` — Set new password
- `GET /api/user` — Get logged-in user profile
- `POST /api/logout` — Logout

### Markets & Products
- `GET /api/markets` — List all markets (supports country & city filter)
- `GET /api/markets/{id}` — Single market details with attending farmers
- `GET /api/categories` — List all product categories
- `GET /api/products` — List products (supports market & category filter)
- `GET /api/products/{id}` — Single product details

### Orders
- `POST /api/orders` — Place a new pre-order
- `GET /api/orders` — Customer's order history
- `GET /api/orders/{id}` — Order details with QR pickup pass
- `PUT /api/orders/{id}/cancel` — Cancel order (before cutoff)

### Farmer Portal
- `GET /api/farmer/profile` — Get stall profile
- `PUT /api/farmer/profile` — Update stall details and cutoff hours
- `GET /api/farmer/products` — List farmer's own products
- `POST /api/farmer/products` — Add a new product
- `PUT /api/farmer/products/{id}` — Edit product price, stock, or status
- `DELETE /api/farmer/products/{id}` — Delete product
- `GET /api/farmer/orders` — View incoming pre-orders
- `PUT /api/farmer/orders/{id}/status` — Update order status (Accept / Ready / Complete)
- `PUT /api/farmer/orders/{id}/payment` — Save actual cash collected at stall
- `GET /api/farmer/statement` — Weekly statement data (Haftawar Hisab)
- `POST /api/farmer/templates/save` — Save current stock as weekly template
- `POST /api/farmer/templates/apply` — Apply weekly template

### Admin
- `GET /api/admin/stats` — Platform statistics (Users, Farmers, Markets, Orders)
- `GET /api/admin/farmers` — List all farmers for approval
- `PUT /api/admin/farmers/{id}/status` — Approve, Reject, or Suspend farmer
- `GET /api/admin/customers` — List registered customers
- `POST /api/admin/markets` — Create a new market

---

## Test Accounts

The database comes pre-seeded with accounts ready for testing:

| Role | Email | Password | What You Can Test |
| :--- | :--- | :--- | :--- |
| **Admin** | `marketlink118@gmail.com` | `#marketlink118@` | Full admin panel, approving pending farmers, adding markets, viewing platform stats |
| **Approved Farmer** | `tariq@punjabfarm.com` | `password123` | Managing produce stock, recurring templates, order queue, Haftawar Hisab, recording pickup cash |
| **Pending Farmer** | `aslam@pendingfarm.com` | `password123` | Shows the pending approval screen until approved by admin |
| **Customer** | `kallimullahb@gmail.com` | `password123` | Browsing markets on map, adding produce to cart, pre-ordering, QR pass, order cancel, reviews |

*(Note: Admin login link is located at the bottom of the sign-in modal)*

---

## How to Run Locally (Windows)

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js 18 or higher & npm
- MySQL running on port 3306 (e.g. via XAMPP or native MySQL)

---

### Option 1: 1-Click Launch (Easiest)
1. Make sure MySQL is running in XAMPP (port 3306).
2. Double-click **`RUN_MARKETLINK.bat`** in the root folder.
3. This opens both the backend (`http://127.0.0.1:8000`) and the frontend (`http://localhost:3000`) automatically in separate command windows.
4. Open `http://localhost:3000` in your browser.

---

### Option 2: Manual Setup

#### 1. Setup the Database:
- Open phpMyAdmin (`http://localhost/phpmyadmin`).
- Create a database named `marketlink`.
- Import the file `backend/marketlink_database.sql` into it.

#### 2. Start the Backend:
```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan serve --port=8000
```
Backend API will run at `http://127.0.0.1:8000`.

#### 3. Start the Frontend:
```bash
cd frontend
npm install
npm run dev
```
Frontend will run at `http://localhost:3000`.

---

## Security Notes
- The `.env` file containing database passwords and mail credentials is kept in `.gitignore` and is not committed to the repository.
- A clean `.env.example` file is included with template configuration for anyone setting up the project.
