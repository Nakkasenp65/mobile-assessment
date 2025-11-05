# 📱 Mobile Assessment Platform

A modern, full-stack mobile device assessment and service booking platform built with Next.js 15, TypeScript, and integrated with multiple third-party services including LINE LIFF, Supabase, Cloudflare Turnstile, Beam Payment Gateway, Longdo Maps, and Google Reviews.

## 🎯 Overview

This platform enables customers to:

- **Assess their mobile devices** with automated diagnostics and condition evaluation
- **Get instant price estimates** for various services (sell, trade-in, consignment, refinance, iPhone exchange)
- **Book appointments** at store locations, BTS stations, or request home service
- **Make secure payments** via Beam Checkout payment gateway
- **Track their assessments** through LINE integration
- **View real customer reviews** fetched from Google Business

## ✨ Key Features

### 📊 Assessment System

- **Comprehensive Device Assessment**: Support for Apple, Samsung, and other brands
- **Automated Diagnostics**: Battery health, network connectivity, device detection
- **Interactive Tests**: Screen, camera, speaker, microphone testing
- **Condition Evaluation**: Visual condition, warranty status, accessories, repair history
- **Real-time Price Calculation**: Dynamic pricing based on device condition and repair costs
- **Grade System**: A/B/C/D grading with visual indicators

### 💼 Multiple Service Types

1. **Sell Now** (ขายทันที) - Immediate device purchase
2. **Consignment** (ฝากขาย) - Consignment sales service
3. **Trade-In** (แลกเครื่องเก่า) - Device trade-in program
4. **Refinance** (จำนอง) - Device refinancing
5. **iPhone Exchange** (แลกเปลี่ยน iPhone) - iPhone exchange service

### 🗺️ Location Services

- **Store Pickup**: Visit physical store locations
- **BTS Station Meetup**: Meet at designated BTS stations with integrated station finder
- **Home Service**: Request assessment at customer's location with Longdo Maps integration
- **Branch Management**: Multi-branch support with queue booking system

### 💳 Payment Integration

- **Beam Checkout Gateway**: Secure payment processing
- **Deposit System**: Required for BTS and home services
- **Payment Status Tracking**: Real-time payment verification
- **Payment Link Management**: Generate and disable payment links
- **QR Code Support**: Payment via QR code scanning

### 📱 LINE Integration

- **LINE LIFF (LINE Front-end Framework)**: Native LINE app integration
- **User Authentication**: LINE login and profile access
- **Assessment Tracking**: Link assessments to LINE user accounts
- **Direct Messaging**: Open LINE chat for customer support
- **Share Target Picker**: Share assessment results in LINE

### 🔒 Security & Verification

- **Cloudflare Turnstile**: Bot protection and CAPTCHA verification
- **Form Validation**: Comprehensive client and server-side validation
- **Environment-based Security**: Production-only security measures
- **PDPA Compliance**: Privacy policy consent management

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15.5.3 (App Router)
- **UI Framework**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **Animations**: Framer Motion, GSAP
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form + Zod validation
- **Maps**: Leaflet, Longdo Maps API
- **Icons**: Lucide, Heroicons, Phosphor Icons

### Backend & Services

- **Database**: Supabase (PostgreSQL)
- **Authentication**: LINE LIFF SDK
- **Payment Gateway**: Beam Checkout
- **Bot Protection**: Cloudflare Turnstile
- **Geolocation**: Longdo Maps API
- **Reviews**: Google Business API
- **File Storage**: Supabase Storage
- **Queue Management**: External queue booking API

### DevOps & Tools

- **Package Manager**: npm
- **Linting**: ESLint 9 (Flat Config)
- **Code Formatting**: Prettier with Tailwind plugin
- **Type Checking**: TypeScript strict mode
- **Build Tool**: Turbopack (Next.js 15)

## 📋 Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- **Git**: Latest version

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Nakkasenp65/mobile-assessment.git
cd mobile-assessment
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_CLIENT_URL=""
NEXT_PUBLIC_SUPABASE_CLIENT_ANON_KEY=""
NEXT_PUBLIC_SUPABASE_ADDRESS_URL=""
NEXT_PUBLIC_SUPABASE_ADDRESS_ANON_KEY=""
NEXT_PUBLIC_SUPABASE_PAYMENT_LINK_STORAGE=your_payment_edge_url

# LINE LIFF Configuration
NEXT_PUBLIC_LIFF_ID=your_liff_id
NEXT_PUBLIC_SERVER_OPTION=dev # or prod

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITEKEY=your_turnstile_sitekey
TURNSTILE_SECRET=your_turnstile_secret

# Longdo Maps
NEXT_PUBLIC_LONGDO_MAP_API_KEY=your_longdo_api_key

# Payment Gateway
DEPOSIT_AMOUNT=20000 # in satang (200.00 THB)
BEAM_TOKEN=your_beam_token
MERCHANT_ID=your_merchant_id

# Queue Booking & Availability
NEXT_PUBLIC_CHECK_AVAILABILITY_URL=your_availability_api_url
CHECK_AVAILABILITY_BASE=your_availability_base_url

# Google Reviews
NEXT_PUBLIC_REVIEW_API_URL=your_google_review_api_url
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### 5. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
mobile-assessment/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── (landing-page)/       # Home page and marketing
│   │   ├── api/                  # API routes
│   │   │   ├── assessments/      # Assessment CRUD operations
│   │   │   ├── create-payment-link/
│   │   │   ├── disable-payment-link/
│   │   │   ├── availability-proxy/
│   │   │   └── verify-turnstile/
│   │   ├── assess/               # Assessment flow (Step 1, 2)
│   │   ├── details/              # Service selection (Step 3, 4)
│   │   ├── confirmed/            # Confirmation pages
│   │   ├── liff-welcome/         # LINE LIFF entry point
│   │   ├── line-assessments/     # LINE user assessments
│   │   └── my-assessments/       # Assessment lookup
│   ├── components/               # Reusable components
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── Provider/             # Context providers
│   │   ├── Layout/               # Layout components
│   │   └── Script/               # External script loaders
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAssessment.ts      # Assessment data fetching
│   │   ├── usePaymentLink.ts     # Payment link management
│   │   ├── useLongdoReverseGeocode.ts
│   │   ├── useBtsStations.ts     # BTS station data
│   │   ├── useReview.ts          # Google reviews
│   │   └── ...
│   ├── types/                    # TypeScript type definitions
│   │   ├── assessment.ts         # Assessment types
│   │   ├── device.ts             # Device types
│   │   └── service.ts            # Service types
│   ├── util/                     # Utility functions
│   │   ├── dateTime.ts           # Date formatting
│   │   ├── phone.ts              # Phone data
│   │   ├── trainLines.ts         # BTS/MRT line data
│   │   └── ...
│   ├── constants/                # App constants
│   │   └── queueBooking.ts       # Branch and service configs
│   └── lib/                      # Third-party library configs
│       ├── supabaseClient.ts     # Supabase client
│       └── utils.ts              # Utility helpers
├── public/                       # Static assets
│   ├── assets/                   # Images and media
│   ├── audio/                    # Audio files for tests
│   ├── css/                      # Custom CSS
│   └── models/                   # 3D models
├── docs/                         # Documentation
│   ├── payment-gateway-integration.md
│   ├── liff-welcome-page.md
│   ├── assessments-api.md
│   └── ...
├── scripts/                      # Utility scripts
│   ├── check-assessment-types.ts
│   └── debug-assessments.ts
├── tailwind.config.js            # Tailwind configuration
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

## 🔌 Platform Integrations

### 1. Supabase

- **Database**: PostgreSQL with real-time subscriptions
- **Tables**: `assessments`, `Mobile`, `repair_prices`, `payment_links`
- **Storage**: File uploads for documents
- **Edge Functions**: Payment link management
- **Row Level Security**: Secure data access

### 2. LINE Platform (LIFF)

- **Features**: User authentication, profile access, messaging
- **Use Cases**: Assessment tracking, customer support
- **Implementation**: LiffProvider context with full SDK integration
- **Environment Detection**: Web vs LIFF app detection

### 3. Cloudflare Turnstile

- **Purpose**: Bot protection and spam prevention
- **Implementation**: Custom Turnstile component
- **Modes**: Production verification, development bypass
- **Integration**: Form submission protection

### 4. Beam Payment Gateway

- **Provider**: Beam Checkout (pay.beamcheckout.com)
- **Features**: Payment links, QR codes, webhook support
- **Security**: Basic auth with merchant credentials
- **Flow**: Create → Pay → Verify → Disable
- **Documentation**: See `docs/payment-gateway-integration.md`

### 5. Longdo Maps

- **Services**: Reverse geocoding, address lookup
- **Implementation**: React hook with caching
- **Use Cases**: Home service location selection
- **Components**: LeafletMap integration

### 6. Google Business

- **API**: Google Places/Reviews API
- **Features**: Real-time review fetching
- **Display**: Carousel with ratings and photos
- **Caching**: React Query for performance

## 🎨 Design System

### Color Palette

- **Primary**: Orange (#f97316) - Main brand color
- **Secondary**: Pink (#fe4da6) - Accent color
- **Background**: Warm white (#fff8f0)
- **Gradients**: Pink-to-orange luxury gradients
- **Service Colors**: Unique colors per service type
  - Sell Now: Pink
  - Consignment: Sky blue
  - Trade-In: Amber
  - Refinance: Purple
  - iPhone Exchange: Green

### Typography

- **Font Family**: LINESeedSansTH (Thai), system fallbacks
- **Weights**: 400 (Regular), 700 (Bold)
- **Loading**: Custom web fonts via CDN

### Components

- Built with **shadcn/ui** and **Radix UI**
- Custom themes with CSS variables
- Dark mode support
- Responsive design (mobile-first)

## 📊 Database Schema

### Core Tables

```sql
-- Assessments
CREATE TABLE assessments (
  id UUID PRIMARY KEY,
  doc_id VARCHAR(255) UNIQUE,
  phone_number VARCHAR(20),
  customer_name VARCHAR(255),
  line_user_id VARCHAR(255),
  email VARCHAR(255),
  status VARCHAR(50), -- pending, reserved, completed, cancelled
  type VARCHAR(50), -- SELL_NOW, CONSIGNMENT, etc.
  estimated_value DECIMAL,
  device_info JSONB,
  condition_info JSONB,
  sell_now_service_info JSONB,
  -- other service info fields...
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  expired_at TIMESTAMP
);

-- Mobile Devices
CREATE TABLE Mobile (
  id SERIAL PRIMARY KEY,
  brand VARCHAR(100),
  model VARCHAR(255),
  storage VARCHAR(50),
  image_url TEXT
);

-- Repair Prices
CREATE TABLE repair_prices (
  id SERIAL PRIMARY KEY,
  model_name VARCHAR(255),
  part_key VARCHAR(100),
  condition_key VARCHAR(100),
  price DECIMAL
);

-- Payment Links
CREATE TABLE payment_links (
  id SERIAL PRIMARY KEY,
  assessment_doc_id VARCHAR(255),
  payment_link TEXT,
  payment_link_id VARCHAR(255),
  created_at TIMESTAMP
);
```

## 🧪 Testing

### Development Mode Features

- Turnstile bypass in development
- Mock data for testing
- Console logging for debugging
- Development indicators in UI

### Test Scenarios

1. **Assessment Flow**: Complete device assessment
2. **Service Booking**: Book each service type
3. **Payment Flow**: Test payment integration
4. **LINE Integration**: Test LIFF features
5. **Location Services**: Test all location types
6. **Form Validation**: Test all validation rules

### Test Data

- See `/scripts/debug-assessments.ts` for sample data
- Test phone numbers: Use any 10-digit number in dev

## 📈 Performance Optimizations

- **Static Generation**: Landing pages are statically generated
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Dynamic imports for heavy components
- **React Query Caching**: Aggressive caching strategy
- **Lazy Loading**: Maps, 3D components, heavy libraries
- **Bundle Analysis**: Regular bundle size monitoring
- **Font Optimization**: next/font with display swap

## 🔐 Security Best Practices

- **Environment Variables**: All secrets in `.env.local`
- **API Routes**: Server-side only sensitive operations
- **Input Validation**: Zod schemas for all forms
- **XSS Protection**: React's built-in escaping
- **CSRF Protection**: SameSite cookies
- **Rate Limiting**: Cloudflare Turnstile
- **Secure Headers**: Next.js security headers
- **HTTPS Only**: Production enforced

## 🌍 Internationalization

- **Language**: Thai (primary)
- **Number Formatting**: Thai locale (฿ currency)
- **Date Formatting**: Thai Buddhist calendar support
- **Phone Numbers**: Thai format validation

## 📚 Documentation

Detailed documentation available in `/docs`:

- `payment-gateway-integration.md` - Payment flow guide
- `liff-welcome-page.md` - LINE LIFF setup
- `assessments-api.md` - API reference
- `service-type-identifiers.md` - Service configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Follow ESLint rules (flat config)
- Use Prettier for formatting
- Write TypeScript with strict mode
- Document complex functions
- Add JSDoc comments where needed

## 🐛 Debugging

### Common Issues

**Issue**: Turnstile not loading

- **Solution**: Check `NEXT_PUBLIC_TURNSTILE_SITEKEY` in environment

**Issue**: Payment redirect fails

- **Solution**: Verify assessment is saved before payment creation

**Issue**: LINE LIFF not working

- **Solution**: Ensure `NEXT_PUBLIC_LIFF_ID` is correct and app is opened in LINE

**Issue**: Maps not displaying

- **Solution**: Check `NEXT_PUBLIC_LONGDO_MAP_API_KEY` is valid

### Debug Tools

- React Query Devtools (enabled in development)
- Console logging throughout critical flows
- Debug API route at `/api/debug`
- Scripts in `/scripts` directory

## 👥 Team

Developed by ok mobile team

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for hosting and deployment
- **shadcn** for the beautiful UI components
- **Supabase** for the backend infrastructure
- **LINE** for the LIFF platform
- **Beam** for payment gateway services
- **Longdo** for maps integration

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**
