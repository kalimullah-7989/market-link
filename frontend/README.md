# MarketLink — Frontend Application

This is the client-side single page application (SPA) for the **MarketLink** platform, built with **React 18** and **Vite**.

---

## Folder Organization

```text
frontend/
├── public/                 # Static assets, favicon, product placeholders
├── css/                    # Custom CSS stylesheets and Bootstrap overrides
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── AuthModal.jsx        # Login & registration popup with strong password validation
│   │   ├── Navbar.jsx           # Top navigation bar with language & currency switchers
│   │   ├── Footer.jsx           # Footer with links and copyright
│   │   ├── MarketsMap.jsx       # Leaflet OpenStreetMap view with market & stall pins
│   │   ├── PickupPassModal.jsx  # QR code pass and pickup token modal
│   │   ├── MarketSupportDesk.jsx# AI market assistant / help desk chat widget
│   │   ├── CartDrawer.jsx       # Slide-out pre-order basket
│   │   ├── ProductCard.jsx      # Individual produce card with stock badge
│   │   ├── CutoffBanner.jsx     # Countdown warning banner for harvest deadlines
│   │   ├── ThemeToggle.jsx      # Dark mode / Light mode toggle
│   │   └── LanguageSelector.jsx # English, Urdu, and Arabic language picker
│   │
│   ├── context/            # Global React Context providers
│   │   ├── AuthContext.jsx      # User authentication, token storage, and roles
│   │   ├── CartContext.jsx      # Shopping cart and pickup window selection
│   │   ├── OrderContext.jsx     # Order history and active order tracking
│   │   └── LanguageContext.jsx  # Multi-language translations and RTL layout handler
│   │
│   ├── pages/              # Main view routes
│   │   ├── HomePage.jsx         # Landing page with hero banner and featured produce
│   │   ├── MarketsPage.jsx      # Directory of weekly markets with city and day filters
│   │   ├── ProductsPage.jsx     # Produce catalog with search and category filters
│   │   ├── FarmerDashboard.jsx  # Farmer management portal (Stock CRUD, templates, orders, cutoff)
│   │   ├── AdminDashboard.jsx   # Admin portal (KPI stats, farmer verification, market hubs)
│   │   ├── CustomerDashboard.jsx# Customer order tracking and active passes
│   │   ├── AboutPage.jsx        # About the project and mission
│   │   └── ContactPage.jsx      # Contact form and physical office coordinates
│   │
│   ├── services/
│   │   └── api.js               # Centralized API service connecting to Laravel backend
│   │
│   ├── data/
│   │   └── products.js          # Default category icons and currency conversion helpers
│   │
│   ├── App.jsx             # Route definitions and layout wrapper
│   └── main.jsx            # Application mount point
│
├── .env.example            # Environment variables template
├── package.json            # Node.js dependencies
└── vite.config.js          # Vite configuration (runs on port 3000)
```

---

## Setup & Running Locally

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher

### Installation
```bash
# Navigate to the frontend folder
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

The application will be live at: **`http://localhost:3000`**

---

## Environment Variables

Create a `.env` file in this directory (refer to `.env.example`):

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

This points all API requests to the local Laravel backend server.
