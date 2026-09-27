# MarketLink - Farm-to-Fork Digital Platform

Backend REST API for Aptech TechWiz 7 (Category: End-to-End Web Solutions)  
Theme: eGreen Basket | Tagline: "Farm Fresh Just a Click Away"

---

## 1. Project Overview

MarketLink is a decoupled, multi-role web platform designed to connect local farmers directly with urban consumers through scheduled weekly farmers markets. 

The application solves the core logistics problem of traditional farmers markets: customers pre-order harvested goods before an automated cut-off time, securing fresh produce and eliminating agricultural food waste. Payments are settled in-person via cash on pickup, respecting local ground realities and competition scope constraints.

### Architecture
- **Backend:** Laravel 12 (RESTful API, Sanctum Token Authentication, Eloquent ORM)
- **Frontend:** React.js (Developed by separate frontend team, consuming JSON APIs)
- **Database:** MySQL (marketlink_db)
- **API Specification:** Documented in `API_DOCUMENTATION.md`

---

## 2. Installation and Setup Guide

### Prerequisites
- PHP 8.2 or higher
- Composer 2.x
- MySQL (Port 3306)

### Setup Steps

1. **Navigate to the Backend:**
   ```bash
   cd backend
   ```

2. **Install PHP Dependencies:**
   ```bash
   composer install
   ```

3. **Configure Environment:**
   Copy the example environment file if `.env` does not exist:
   ```bash
   copy .env.example .env
   ```
   Ensure database settings match your local MySQL server:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=marketlink
   DB_USERNAME=root
   DB_PASSWORD=
   ```

4. **Generate Application Key:**
   ```bash
   php artisan key:generate
   ```

5. **Run Migrations and Seed Demo Data:**
   ```bash
   php artisan migrate:fresh --seed
   ```

6. **Create Public Storage Symlink (for product images):**
   ```bash
   php artisan storage:link
   ```

7. **Start the Local Development Server:**
   ```bash
   php artisan serve --port=8000
   ```
   The API will be available at: `http://127.0.0.1:8000/api`

---

## 3. Pre-Seeded Test Credentials

The database seeder provisions realistic accounts for all application roles:

| Role | Name | Email | Password | Scope and Permissions |
| :--- | :--- | :--- | :--- | :--- |
| Admin | Platform Admin | marketlink118@gmail.com | #marketlink118@ | Platform KPIs, farmer approvals, category/market management, moderation |
| Farmer (Approved) | Tariq Mehmood | tariq@punjabfarm.com | password123 | Stall A-04 at Liberty Market, inventory, stock templates, order fulfillment |
| Farmer (Approved) | Chaudhry Bashir | bashir@dairyfarm.com | password123 | Stall B-12 at Model Town Bazaar, dairy specialist |
| Farmer (Approved) | Haji Rasheed | rasheed@citrusfarm.com | password123 | Stall C-08 at DHA Market, citrus specialist |
| Farmer (Pending) | Aslam Khan | aslam@pendingfarm.com | password123 | Unapproved account for demonstrating Admin Approval workflow |
| Customer | Kallim Ullah | kallimullahb@gmail.com | password123 | Customer account with pre-orders, QR passes, and reviews |
| Customer | Hamza Ali | hamza@customer.com | password123 | Customer account with completed order history |

---

## 4. Backend Modules and Key Features

The backend REST API is structured into modular feature sets:

### 1. Framework Setup, CORS & Sanctum Authentication
Configured Laravel 12 API scaffolding with Sanctum token management. Published and configured CORS policies to allow cross-origin requests from React development servers (`http://localhost:5173` and `http://localhost:3000`). Implemented standardized JSON response envelopes (`success` and `error` helpers).

### 2. Database Schema & Eloquent Relationships
Designed and migrated 12 normalized relational database tables:
- `users`: Core authentication table with role enum (`admin`, `farmer`, `customer`)
- `farmer_profiles`: Stall details, operating hours, coordinates, approval status
- `markets`: Physical farmers market locations with lat/long and operating days
- `categories`: Master product categories
- `products`: Product catalog with units, stock quantities, flags, and harvest data
- `orders` & `order_items`: Pre-order records with automated cutoff dates and totals
- `reviews`: Star ratings and customer comments with farmer reply threads
- `favorites`: Customer bookmarks for products and farmers
- `notifications`: In-app alert system for orders, approvals, and stock updates

### 3. Authentication & Role-Based Access Control (RBAC)
Implemented token-based authentication via `AuthController`. Created `RoleMiddleware` to restrict access strictly by role (`role:admin`, `role:farmer`, `role:customer`). Suspended or deactivated users are automatically blocked with a 403 Forbidden response.

### 4. Master Catalog, Farmer Inventory & Geolocation
Implemented public catalog browsing with multi-parameter filtering (category, market, day, price range). Developed mathematical Great-Circle Haversine distance calculations in PHP to sort markets by proximity to the customer coordinates without database-specific SQL dependencies. Built farmer inventory CRUD with weekly recurring stock templates.

### 5. Pre-Order Engine, Cutoff Enforcement & Stall Verification
Constructed the pre-order workflow. Implemented `lockForUpdate()` within database transactions to prevent overselling race conditions under concurrent customer bookings. Implemented strict automated cutoff enforcement: customers cannot cancel orders once the cutoff threshold has passed. Designed in-stall verification allowing farmers to fulfill orders by entering either the Order Number or the unique 8-character Pickup Token.

### 6. Admin Dashboard, Review System & Notifications
Built high-level Admin KPI metrics (total revenue, active farmers, pending approvals, order breakdowns). Implemented farmer approval and account suspension controls. Developed a verified review system allowing ratings only on `completed` orders, with support for farmer replies. Built an in-app notification center.

### 7. Database Seeding & Integration Documentation
Constructed realistic seeders with geographically accurate Lahore coordinates, local produce names, and full order lifecycles. Authored `API_DOCUMENTATION.md` containing request/response contracts for the React team. Exported `marketlink_database.sql`.

### 8. Order Modification Before Cutoff
Added the ability for customers to edit order quantities and line items before the cutoff time. The system restores previous inventory back to the farmer within a database transaction, verifies new stock availability, atomically decrements new quantities, and recalculates order totals.

### 9. Farmer Insights & Sales Analytics API
Created `GET /api/farmer/insights` providing farmers with real-time business metrics: total completed orders, pending queue count, weekly revenue, monthly revenue, best-selling product, and average customer rating.

### 10. Public Farmer Profiles & Pickup Slots
Built public-facing endpoints (`GET /api/farmers` and `GET /api/farmers/{id}`) displaying farmer bios, stall locations, market schedules, active products count, and recent reviews. Added `GET /api/farmers/{id}/pickup-slots` to feed time-slot dropdowns in the React checkout form.

### 11. Public Storage Symlink & Product Image URLs
Executed storage symlinking and added an Eloquent Accessor on the `Product` model. The API automatically converts internal storage paths into fully qualified, browser-accessible HTTP URLs, eliminating manual URL concatenation on the frontend.

### 12. Real-Time Frontend Helpers
Engineered three React-oriented helper features:
- **Cutoff Countdown:** Returns `cutoff_remaining_seconds` directly in order details so the frontend can drive countdown timers.
- **Dynamic Market Pin Status:** Evaluates current server time against market operating days and hours, returning `open`, `closing_soon`, or `closed` for dynamic map pin coloring.
- **Global Search:** Single invokable endpoint (`GET /api/search?q=...`) searching products, farmers, and markets simultaneously.

### 13. Google OAuth Social Login
Integrated Laravel Socialite for customer registration and authentication via Google. Handles OAuth redirect, user retrieval, automatic customer account provisioning, token generation, and redirection back to the React application callback route.

### 14. Automated Low-Stock Alerts & Urgency Badges
Implemented automated inventory monitoring. When customer orders drop product stock to 5 units or below, the backend dispatches a low-stock notification to the farmer. Product payloads automatically expose `is_low_stock` and `stock_urgency_label` for customer urgency indicators.

### 15. Harvest Date & Dynamic Freshness Indicators
Added `harvested_at` timestamp tracking to products. The system dynamically computes crop freshness based on elapsed hours:
- Less than 24 hours: `is_harvested_today = true`, `freshness_tag = "Harvested Today"`
- 24 to 48 hours: `freshness_tag = "Harvested Yesterday"`
- Older than 48 hours: tag automatically clears.  
Validates the platform slogan "Farm Fresh Just a Click Away" and justifies pre-order cutoff times to competition judges.

### 16. Security CAPTCHA (Login & Signup)
Engineered an API token-based mathematical verification challenge (`GET /api/captcha`). Generated challenges are stored in server cache with unique UUID keys and a 5-minute time-to-live. Integrated into `POST /api/register` and `POST /api/login` for all roles (Admin, Farmer, Customer). Tested for single-use replay protection and brute-force mitigation without external internet or third-party API dependencies.

### 17. Essential Cookie Consent & Privacy Compliance
Implemented a user consent persistence mechanism for strictly necessary functional cookies (Sanctum authentication tokens, pre-order cart continuity, and CSRF/CAPTCHA security). Added `essential_cookie_consent` and `essential_cookie_consent_at` timestamps to user records. Provided `GET /api/cookie-consent` and `POST /api/cookie-consent` allowing users to record legal consent post-registration or login across any client device.

### 18. Optional Two-Step Verification (Email 6-Digit OTP)
Engineered an optional two-factor authentication system for Farmers and Customers. When enabled, login checks credentials and generates a secure random 6-digit verification code sent to the user email, alongside a 10-minute temporary challenge token (`POST /api/login/two-factor`). Includes single-use replay protection and authenticated profile toggle controls (`GET /api/two-factor/status`, `POST /api/two-factor/toggle`).

### 19. Multi-Country & Dynamic Multi-Language Engine (i18n)
Built an internationalization layer supporting country-based automatic language switching. Exposes supported countries (Pakistan, UK, USA, Saudi Arabia, UAE) via `GET /api/localization/countries` and full UI translation dictionaries for English, Urdu, and Arabic with RTL direction flags via `GET /api/localization/translations/{locale}`. Provides persistent user preferences via `GET /api/localization/preference` and `POST /api/localization/preference`.

### 20. Add-to-Cart System (Cash-on-Pickup)
Implemented a full database-backed cart system allowing customers to browse products, add items from multiple farmers in a single session, and check out in one action. Introduced the `cart_items` table linked to users and products via cascading foreign keys with a composite unique constraint preventing duplicate cart rows.

Cart endpoints (`GET`, `POST`, `PATCH`, `DELETE /api/customer/cart` and `DELETE /api/customer/cart/{id}`) enforce stock availability checks on every add and update operation. The `POST /api/customer/cart/checkout` endpoint groups cart items by farmer, validates cutoff times per farmer, runs each farmer batch inside an isolated `DB::transaction()` with `lockForUpdate()` to prevent overselling, decrements stock atomically, dispatches low-stock and sold-out notifications, and creates standard pre-order records. Successful farmer batches are cleared from the cart; failed batches are returned in an `items_failed` array without blocking other batches. Payment is strictly cash-on-pickup with no online payment integration, consistent with TechWiz competition scope.

---

## 5. Automated Testing & Verification

The test suite covers all 20 implementation steps with 95 automated feature and unit tests.

### Running the Tests:
```bash
php artisan test
```

### Test Coverage Summary:
```
  PASS  Tests\Unit\ExampleTest
  PASS  Tests\Feature\AdminAndReviewsTest
  PASS  Tests\Feature\AuthTest
  PASS  Tests\Feature\CaptchaAuthTest
  PASS  Tests\Feature\CartTest
  PASS  Tests\Feature\EssentialCookieConsentTest
  PASS  Tests\Feature\ExampleTest
  PASS  Tests\Feature\FarmerInsightsTest
  PASS  Tests\Feature\FarmerInventoryTest
  PASS  Tests\Feature\FreshnessIndicatorTest
  PASS  Tests\Feature\GoogleAuthTest
  PASS  Tests\Feature\LocalizationTest
  PASS  Tests\Feature\LowStockAlertTest
  PASS  Tests\Feature\OrderLifecycleTest
  PASS  Tests\Feature\OrderModifyTest
  PASS  Tests\Feature\ProductImageUrlTest
  PASS  Tests\Feature\PublicFarmerProfileTest
  PASS  Tests\Feature\HelpersTest
  PASS  Tests\Feature\TwoFactorAuthTest

  Total Tests:    95 passed
  Total Checks:   336 assertions
  Execution Time: ~6 seconds
```

---

## 6. TechWiz 7 Mandatory Deliverables Status

Per TechWiz SRS Section 1.9, the required project assets are prepared as follows:

- **Database Script (.sql):** Exported as `marketlink_database.sql` (67 KB) in the project root.
- **User Credentials:** Listed in Section 3 above and documented in `API_DOCUMENTATION.md`.
- **System Documentation:** Full API integration contract documented in `API_DOCUMENTATION.md`.
- **Project Report Asset:** ERD and DFD schemas prepared from the 12 relational database tables.
